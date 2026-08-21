/** ARW advertiser lead API helpers — token stays server-side only. */

export const ARW_LEAD_SOURCE = "rvr";

export const ARW_HOSTED_QUOTE_URL =
  "https://www.americasrvwarranty.com/quote/source/rvr/tracking_num/770-727-0028";

export const ARW_FALLBACK_CLASSES = [
  { label: "Class A Motorhome", value: "Class A MTR" },
  { label: "Class B Motorhome", value: "Class B MTR" },
  { label: "Class C Motorhome", value: "Class C MTR" },
  { label: "Fifth Wheel", value: "Fifth Wheel TRL" },
  { label: "Travel Trailer", value: "Travel TRL" },
  { label: "Toy Hauler", value: "Toy Hauler TRL" },
] as const;

export type ArwOption = { label: string; value: string };

export type ArwLeadPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rvClass: string;
  make: string;
  model: string;
  modelYear: number;
  odometer?: number;
  purchasePrice?: number;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
  utm_term?: string;
};

/** Lead API host (AWI / americaswarranty.com). */
function arwBaseUrl() {
  return (
    process.env.ARW_API_BASE_URL?.replace(/\/$/, "") ||
    "https://americaswarranty.com"
  );
}

/** Public class/make lists still live on the RV marketing site. */
function arwReferenceBaseUrl() {
  return (
    process.env.ARW_REFERENCE_BASE_URL?.replace(/\/$/, "") ||
    "https://americasrvwarranty.com"
  );
}

export function hasArwApiToken() {
  return Boolean(process.env.ARW_API_TOKEN?.trim());
}

/** Motorhomes (Class A/B/C MTR) need odometer; fifth wheels, travel trailers, toy haulers (TRL) do not. */
export function isMotorhomeClass(rvClass: string) {
  const normalized = rvClass.toUpperCase();
  if (normalized.includes("TRL")) return false;
  return normalized.includes("MTR");
}

function normalizeOptions(data: unknown): ArwOption[] {
  if (!Array.isArray(data)) return [];
  return data
    .map((item) => {
      if (typeof item === "string") {
        return { label: item, value: item };
      }
      if (item && typeof item === "object") {
        const row = item as Record<string, unknown>;
        const value = String(row.value ?? row.Value ?? row.name ?? row.Name ?? "");
        const label = String(row.label ?? row.Label ?? value);
        if (!value) return null;
        return { label, value };
      }
      return null;
    })
    .filter((o): o is ArwOption => Boolean(o));
}

export async function getArwClasses(): Promise<ArwOption[]> {
  try {
    const res = await fetch(`${arwReferenceBaseUrl()}/get/classes`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [...ARW_FALLBACK_CLASSES];
    const data = await res.json();
    // ARW returns classes under the `makes` key on /get/classes
    const options = normalizeOptions(
      data?.data ?? data?.classes ?? data?.makes ?? data
    );
    return options.length ? options : [...ARW_FALLBACK_CLASSES];
  } catch {
    return [...ARW_FALLBACK_CLASSES];
  }
}

export async function getArwMakes(): Promise<ArwOption[]> {
  try {
    const res = await fetch(`${arwReferenceBaseUrl()}/get/makes`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return normalizeOptions(data?.data ?? data?.makes ?? data);
  } catch {
    return [];
  }
}

export type ArwInsertResult =
  | { ok: true; id?: string }
  | { ok: false; status: number; message: string };

export async function insertArwLead(
  payload: ArwLeadPayload
): Promise<ArwInsertResult> {
  const token = process.env.ARW_API_TOKEN?.trim();
  if (!token) {
    return {
      ok: false,
      status: 503,
      message:
        "Quote API is not configured yet. Please use the hosted quote form.",
    };
  }

  const body: Record<string, string | number> = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    rvClass: payload.rvClass,
    make: payload.make,
    model: payload.model,
    modelYear: payload.modelYear,
  };
  if (payload.odometer != null) {
    body.odometer = payload.odometer;
  }
  if (payload.purchasePrice != null) {
    body.purchasePrice = payload.purchasePrice;
  }
  for (const key of [
    "utm_campaign",
    "utm_source",
    "utm_medium",
    "utm_content",
    "utm_term",
  ] as const) {
    const value = payload[key];
    if (value) body[key] = value;
  }

  const res = await fetch(`${arwBaseUrl()}/api/insert/rv`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let data: { status?: string; id?: string; message?: string } = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON body */
  }

  if (res.ok && data.status === "success") {
    return { ok: true, id: data.id };
  }

  if (res.status === 401) {
    return {
      ok: false,
      status: 401,
      message: "Quote service authentication failed.",
    };
  }

  return {
    ok: false,
    status: res.status || 500,
    message:
      data.message ||
      "We could not submit your quote request. Please try the hosted form.",
  };
}
