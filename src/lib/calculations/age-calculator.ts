import { differenceInYears } from 'date-fns';
import { CHILD_COSTS_SLOVENIA } from '@/lib/constants/child-costs-slovenia';

/**
 * Calculates the age based on birth date.
 * 
 * @param birthDate Date of birth
 * @returns Age in years
 */
export function calculateAge(birthDate: Date): number {
  return differenceInYears(new Date(), birthDate);
}

/**
 * Determines the monthly cost for a child based on their age.
 * 
 * @param age Age of the child
 * @returns Monthly cost in EUR
 */
export function getChildCost(age: number): number {
  if (age < 0) return 0;
  
  if (age <= 3) return CHILD_COSTS_SLOVENIA['0-3'];
  if (age <= 6) return CHILD_COSTS_SLOVENIA['4-6'];
  if (age <= 12) return CHILD_COSTS_SLOVENIA['7-12'];
  if (age <= 18) return CHILD_COSTS_SLOVENIA['13-18'];
  if (age <= 24) return CHILD_COSTS_SLOVENIA['18-24'];
  
  return CHILD_COSTS_SLOVENIA['25+'];
}

/**
 * Calculates total monthly child costs for all children.
 * 
 * @param birthDates Array of birth dates
 * @returns Total monthly cost
 */
export function calculateTotalChildCosts(birthDates: Date[]): number {
  return birthDates.reduce((total, date) => {
    const age = calculateAge(date);
    return total + getChildCost(age);
  }, 0);
}
