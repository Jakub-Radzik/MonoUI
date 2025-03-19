export type INFO = 'too_small' | 'ok' | 'too_much' | 'tbd'

export type ChartEntry = {
    date: string;
    usage: number;
}

export type Input = {
    realPower: number,
    startDate: string,
    endDate: string,
    intelligentSettings?: IntelligentSettings
}

export type IntelligentSettings = {
    percentageOfTotal: number,
    dimmingPowerPercentage: number,
    dimmingTimePercentage: number,
    criticalInfrastructurePercentage: number
}

export type Output = ChartEntry[]