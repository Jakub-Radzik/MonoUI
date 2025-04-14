export type INFO = "too_small" | "ok" | "too_much" | "tbd";

export type ChartEntry = {
  date: string;
  usage: number;
};

export type Input = {
  realPower: number;
  startDate: string;
  endDate: string;
  intelligentSettings?: IntelligentSettings;
  sunType?: string;
};

export type FormValues = {
  criticalInfrastructurePercentage: number;
  dimmingPowerPercentage: number;
  dimmingTimePercentage: number;
  percentageOfTotal: number;
  realPower: number;
  realUsage: number;
  sunType: string;
  dateRange: [Date, Date];
};

export type IntelligentSettings = {
  percentageOfTotal: number;
  dimmingPowerPercentage: number;
  dimmingTimePercentage: number;
  criticalInfrastructurePercentage: number;
};

export type Output = ChartEntry[];
