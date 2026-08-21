import { NextResponse } from "next/server";
import {
  hasArwApiToken,
  insertArwLead,
  isMotorhomeClass,
  type ArwLeadPayload,
} from "@/lib/arw";

type LeadBody = ArwLeadPayload & { website?: string };

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  if (!hasArwApiToken()) {
    return NextResponse.json(
      {
        error:
          "Quote API is not configured yet. Please use the hosted quote form.",
        fallback: true,
      },
      { status: 503 }
    );
  }

  let body: LeadBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  // Honeypot — bots fill this; pretend success
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const rvClass = String(body.rvClass ?? "").trim();
  const make = String(body.make ?? "").trim();
  const model = String(body.model ?? "").trim();
  const modelYear = Number(body.modelYear);
  const odometerRaw = body.odometer;
  const odometer =
    odometerRaw === undefined ||
    odometerRaw === null ||
    (odometerRaw as unknown) === ""
      ? undefined
      : Number(odometerRaw);

  if (firstName.length < 1) return badRequest("First name is required.");
  if (lastName.length < 1) return badRequest("Last name is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("Please enter a valid email address.");
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return badRequest("Please enter a valid phone number.");
  }
  if (!rvClass) return badRequest("Please select an RV class.");
  if (!make) return badRequest("Please select or enter the RV make.");
  if (!model) return badRequest("Please enter the RV model.");
  if (!Number.isFinite(modelYear) || modelYear < 1970 || modelYear > 2030) {
    return badRequest("Please enter a valid model year.");
  }
  if (isMotorhomeClass(rvClass)) {
    if (odometer === undefined || !Number.isFinite(odometer) || odometer < 0) {
      return badRequest("Odometer is required for motorhomes.");
    }
  }

  const payload: ArwLeadPayload = {
    firstName,
    lastName,
    email,
    phone,
    rvClass,
    make,
    model,
    modelYear,
  };
  if (odometer !== undefined && Number.isFinite(odometer)) {
    payload.odometer = odometer;
  }
  for (const key of [
    "utm_campaign",
    "utm_source",
    "utm_medium",
    "utm_content",
    "utm_term",
  ] as const) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) {
      payload[key] = value.trim().slice(0, 200);
    }
  }

  try {
    const result = await insertArwLead(payload);
    if (!result.ok) {
      const useFallback =
        result.status === 503 ||
        result.status === 401 ||
        result.status === 502;
      return NextResponse.json(
        { error: result.message, fallback: useFallback },
        { status: result.status }
      );
    }
    return NextResponse.json({ success: true, id: result.id });
  } catch {
    return NextResponse.json(
      {
        error:
          "We could not reach the quote service. Please try the hosted form.",
        fallback: true,
      },
      { status: 502 }
    );
  }
}
