import { Input } from "./utils/types";
import { LOCATION } from "./utils/constants";
import { ChartEntry } from "./utils/types";

export const callApiAlgorithm = async (
  payload: Input,
  location?: [number, number],
  aggregateMonthly: boolean = true
): Promise<ChartEntry[]> => {
  const apiPayload: Record<string, any> = {
    realPower: payload.realPower,
    startDate: payload.startDate,
    endDate: payload.endDate,
    offset: 10,
    aggregation: "daily",
  };

  if (location) {
    apiPayload.latitude = location[0];
    apiPayload.longitude = location[1];
  } else {
    apiPayload.latitude = LOCATION[0];
    apiPayload.longitude = LOCATION[1];
  }

  if (payload.intelligentSettings) {
    apiPayload.intelligentSettings = {
      percentgeOfTotal: payload.intelligentSettings.percentageOfTotal ?? 0,
      dimmingPowerPercentage:
        payload.intelligentSettings.dimmingPowerPercentage ?? 0,
      dimmingTimePercentage:
        payload.intelligentSettings.dimmingTimePercentage ?? 0,
      criticalInfrastructurePercentage:
        payload.intelligentSettings.criticalInfrastructurePercentage ?? 0,
    };
  }

  if (payload.sunType) {
    apiPayload.sun_type = payload.sunType;
  }

  try {
    const res = await fetch(
      "https://vercel-django-test-virid.vercel.app/api/calculate-usage/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      }
    );

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    const raw: ChartEntry[] = Array.isArray(json.results) ? json.results : [];

    if (!aggregateMonthly) return raw;

    const grouped: Record<string, { date: string; usage: number }> = {};

    for (const item of raw) {
      const d = new Date(item.date);
      const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          date: new Date(d.getFullYear(), d.getMonth(), 1).toISOString(),
          usage: 0,
        };
      }
      grouped[monthKey].usage += item.usage;
    }

    return Object.values(grouped);
  } catch {
    return [];
  }
};
