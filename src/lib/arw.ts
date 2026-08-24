/** AWI advertiser lead API — americaswarranty.com portal (/api/insert/rv). */

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

/** Full US state names — required by AWI advertiser API docs. */
export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

export type ArwOption = { label: string; value: string };

export type ArwLeadPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  rvClass: string;
  make: string;
  model: string;
  modelYear: number;
  purchasePrice: number;
  odometer?: number;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
  utm_term?: string;
};

/** Lead API host (AWI advertiser portal). */
function arwBaseUrl() {
  return (
    process.env.ARW_API_BASE_URL?.replace(/\/$/, "") ||
    "https://americaswarranty.com"
  );
}

/** Class/make reference lists (RV marketing site). */
function arwReferenceBaseUrl() {
  return (
    process.env.ARW_REFERENCE_BASE_URL?.replace(/\/$/, "") ||
    "https://americasrvwarranty.com"
  );
}

export function hasArwApiToken() {
  return Boolean(process.env.ARW_API_TOKEN?.trim());
}

/** Motorhomes (MTR) need odometer; towables (TRL) do not. */
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
    state: payload.state,
    rvClass: payload.rvClass,
    make: payload.make,
    model: payload.model,
    modelYear: payload.modelYear,
    purchasePrice: payload.purchasePrice,
  };
  if (payload.odometer != null) {
    body.odometer = payload.odometer;
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
