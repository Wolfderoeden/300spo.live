export function dash(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

export function formatNumber(value: unknown, options?: Intl.NumberFormatOptions) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const numberValue =
    typeof value === "bigint" ? Number(value) : Number(String(value));

  if (!Number.isFinite(numberValue)) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", options).format(numberValue);
}

export function formatAda(lovelace: unknown, fractionDigits = 2) {
  if (lovelace === null || lovelace === undefined || lovelace === "") {
    return "-";
  }

  const ada = Number(String(lovelace)) / 1_000_000;
  if (!Number.isFinite(ada)) {
    return "-";
  }

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: fractionDigits,
  }).format(ada)} ADA`;
}

export function formatUsd(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const numeric = Number(String(value));
  if (!Number.isFinite(numeric)) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: numeric < 0.01 ? 6 : 3,
  }).format(numeric);
}

export function formatPercent(value: unknown, multiplier = 1) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const numeric = Number(String(value)) * multiplier;
  if (!Number.isFinite(numeric)) {
    return "-";
  }

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(numeric)}%`;
}

export function formatDate(value: unknown) {
  if (!value) {
    return "-";
  }

  const date =
    typeof value === "number"
      ? new Date(value * 1000)
      : new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

