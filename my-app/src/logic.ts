import { Input, IntelligentSettings, Output } from "./utils/types";

export function algorithm(input: Input): Output{
    const { realPower, startDate, endDate, intelligentSettings } = input;

    if(!realPower || !startDate || !endDate) {
        throw new Error("Missing required fields");
    }

    // intelligent settings calculator
    if(intelligentSettings){
        return smartInstallation(realPower, startDate, endDate, intelligentSettings);
    }


    return normalInstallation(realPower, startDate, endDate);
}

const normalInstallation = (realPower: number, startDate: string, endDate: string): Output => {
    const months = getLightingDurations(startDate, endDate);

        return months.map(({date, nightDurationH}) => ({
            date: date,
            usage: nightDurationH * realPower
        })
    );
}

const smartInstallation = (realPower: number, startDate: string, endDate: string, intelligentSettings: IntelligentSettings): Output => {
    const { percentageOfTotal, criticalInfrastructurePercentage } = intelligentSettings;

    if(percentageOfTotal + criticalInfrastructurePercentage > 1) {
        throw new Error("Sum of percentages cannot exceed 1");
    }

    const months = getLightingDurations(startDate, endDate);

    return months.map(({date, nightDurationH}) => ({
        date: date,
        usage: calculateSmartUsage(nightDurationH, realPower, intelligentSettings)
    }))
}

const calculateSmartUsage = (nightDurationH: number, realPower: number, intelligentSettings: IntelligentSettings): number => {
    const realPowerOfSmartLighting = realPower * intelligentSettings.percentageOfTotal;
    const realPowerOfCriticalInfrastructure = realPower * intelligentSettings.criticalInfrastructurePercentage;
    const realPowerOfNormalLighting = realPower * (1 - intelligentSettings.percentageOfTotal - intelligentSettings.criticalInfrastructurePercentage);

    const criticalInfrastructureUsage = nightDurationH * realPowerOfCriticalInfrastructure;
    const normalLightingUsage = nightDurationH * realPowerOfNormalLighting;

    // smart lights
    const dimmingPower = realPowerOfSmartLighting * intelligentSettings.dimmingPowerPercentage;
    const dimmingTime = nightDurationH * intelligentSettings.dimmingTimePercentage;
    const fullPowerTime = nightDurationH - dimmingTime;

    const dimmingUsage = dimmingPower * dimmingTime;
    const fullPowerUsage = realPowerOfSmartLighting * fullPowerTime;

    return criticalInfrastructureUsage + normalLightingUsage + dimmingUsage + fullPowerUsage;
}

const getLightingDurations = (startDate: string, endDate: string): { date: string, nightDurationH: number }[] => {
    const result: { date: string, nightDurationH: number }[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Start iterating from the first day of the start month.
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    
    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth(); // 0-indexed month
      
      // Get number of days in the current month.
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      // Determine the first day to count in this month.
      let monthStartDay = 1;
      if (year === start.getFullYear() && month === start.getMonth()) {
        monthStartDay = start.getDate();
      }
      
      // Determine the last day to count in this month.
      let monthEndDay = daysInMonth;
      if (year === end.getFullYear() && month === end.getMonth()) {
        monthEndDay = end.getDate();
      }
      
      // Calculate the number of nights in the current month (inclusive).
      const nights = monthEndDay - monthStartDay + 1;
      // Here we assume each night lasts 12 hours.
      const nightDurationH = nights * 12;
      
      // Format the month-year as ISO string (using the first day of the month).
      const dateString = new Date(year, month, 1).toISOString();
      
      result.push({ date: dateString, nightDurationH });
      
      // Move to the next month.
      current.setMonth(current.getMonth() + 1);
    }
    
    return result;
};