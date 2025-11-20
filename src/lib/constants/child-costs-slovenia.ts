export const CHILD_COSTS_SLOVENIA = {
  '0-3': 225,    // €200-250 average
  '4-6': 200,    // €180-220 average
  '7-12': 250,   // €220-280 average
  '13-18': 315,  // €280-350 average
  '18-24': 425,  // €350-500 average
  '25+': 0       // Independent
} as const;

export type ChildAgeGroup = keyof typeof CHILD_COSTS_SLOVENIA;
