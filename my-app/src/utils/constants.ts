import { INFO } from "./types";

export const ALLOWED_DIFFERENCE = 0.05; 

export const initForm = {
    realUsage: 300,
    realPower: 100,
    intelligent: true,
    percentageOfTotal: 100,
    dimmingPowerPercentage: 50,
    dimmingTimePercentage: 60,
    criticalInfrastructurePercentage: 10
  }

export const tagColor: Record<INFO, string> = {
    ['too_small']: '#2db7f5',
    ['ok']: '#04d666',
    ['too_much']: '#f00',
    ['tbd']: '#000'
  }
  
export const informationText: Record<INFO, string> = {
    ['too_small']: 'Za małe zużycie',
    ['ok']: 'OK',
    ['too_much']: 'Za duże zużycie',
    ['tbd']: 'Wprowadź dane'
  }

const center_of_Poland: [number, number] = [52.0692, 19.4803];
const Wroclaw: [number, number] = [51.1079, 17.0385];
export const LOCATION: [number, number] = center_of_Poland