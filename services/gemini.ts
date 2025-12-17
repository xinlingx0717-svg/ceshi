import { HolidayData, Country } from "../types";

export interface ExchangeRateResult {
  rate: number;
  lastUpdated: string;
  sources: { title: string; uri: string }[];
}

export const fetchMonthHolidays = async (
  country: Country,
  year: number,
  month: number
): Promise<HolidayData[]> => {
  try {
    const res = await fetch(
      `/api/holidays?country=${encodeURIComponent(country.name)}&year=${year}&month=${month}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const askAssistant = async (
  query: string,
  country: Country,
  context: "translation" | "general"
): Promise<string> => {
  try {
    const res = await fetch(`/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, country, context })
    });
    if (!res.ok) return "AI 助手暂时不可用。";
    const data = await res.json();
    return typeof data?.text === "string" ? data.text : "AI 助手暂时不可用。";
  } catch {
    return "AI 助手暂时不可用。";
  }
};

export const fetchExchangeRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<ExchangeRateResult | null> => {
  try {
    const res = await fetch(
      `/api/exchange-rate?from=${encodeURIComponent(fromCurrency)}&to=${encodeURIComponent(
        toCurrency
      )}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};
