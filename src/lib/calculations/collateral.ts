import Decimal from 'decimal.js';
import { BANKING_RULES } from '@/lib/constants/banking-rules';

export interface CollateralValidationResult {
  isValid: boolean;
  requiredCollateralValue: number; // The 20% of new home price
  availableCollateralValue: number; // The 80% of parent's property
  shortfall: number; // If invalid, how much more value is needed
}

/**
 * Validates if the parent's property is sufficient as collateral.
 * 
 * Rule: Parent's property value * 0.80 >= New home price * 0.20
 * This means the bank can lend 100% of the new home price if they have security
 * covering the 20% down payment equivalent, backed by the parent's property at 80% LTV.
 * 
 * @param newHomePrice Price of the home being purchased
 * @param parentPropertyValue Value of the parent's property offered as collateral
 * @returns CollateralValidationResult
 */
export function validateCollateral(
  newHomePrice: number,
  parentPropertyValue: number
): CollateralValidationResult {
  const homePrice = new Decimal(newHomePrice);
  const parentValue = new Decimal(parentPropertyValue);

  const requiredCollateralValue = homePrice.times(BANKING_RULES.MIN_DOWN_PAYMENT_PERCENT).dividedBy(100);
  const availableCollateralValue = parentValue.times(BANKING_RULES.COLLATERAL_LTV_PERCENT).dividedBy(100);

  const isValid = availableCollateralValue.greaterThanOrEqualTo(requiredCollateralValue);
  const shortfall = isValid ? new Decimal(0) : requiredCollateralValue.minus(availableCollateralValue);

  return {
    isValid,
    requiredCollateralValue: requiredCollateralValue.toNumber(),
    availableCollateralValue: availableCollateralValue.toNumber(),
    shortfall: shortfall.toNumber(),
  };
}
