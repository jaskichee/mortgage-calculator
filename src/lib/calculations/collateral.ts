import Decimal from 'decimal.js';
import { BANKING_RULES } from '@/lib/constants/banking-rules';

export interface CollateralValidationResult {
  isValid: boolean;
  requiredCollateralValue: number; // The 20% of new home price
  availableCollateralValue: number; // The 80% of parent's property
  shortfall: number; // If invalid, how much more value is needed
}

export interface ICollateralValidator {
  validate(newHomePrice: number, parentPropertyValue: number, downPayment: number, isConsumerLoanSelected?: boolean): CollateralValidationResult;
}

export class StandardCollateralValidator implements ICollateralValidator {
  validate(newHomePrice: number, parentPropertyValue: number, downPayment: number = 0, isConsumerLoanSelected: boolean = false): CollateralValidationResult {
    if (isConsumerLoanSelected) {
      return {
        isValid: true,
        requiredCollateralValue: 0,
        availableCollateralValue: 0,
        shortfall: 0,
      };
    }

    const homePrice = new Decimal(newHomePrice);
    const parentValue = new Decimal(parentPropertyValue);
    const downPaymentValue = new Decimal(downPayment);

    const minDownPayment = homePrice.times(BANKING_RULES.MIN_DOWN_PAYMENT_PERCENT).dividedBy(100);
    const requiredCollateralValue = Decimal.max(0, minDownPayment.minus(downPaymentValue));
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
}

const defaultValidator = new StandardCollateralValidator();

/**
 * Validates if the parent's property is sufficient as collateral.
 * 
 * Rule: Parent's property value * 0.80 >= (New home price * 0.20 - Down Payment)
 * This means the bank can lend the remaining amount if they have security
 * covering the missing down payment, backed by the parent's property at 80% LTV.
 * 
 * @param newHomePrice Price of the home being purchased
 * @param parentPropertyValue Value of the parent's property offered as collateral
 * @param downPayment Amount of down payment provided by the user
 * @param isConsumerLoanSelected Whether the user has selected a consumer loan to cover the down payment
 * @returns CollateralValidationResult
 */
export function validateCollateral(
  newHomePrice: number,
  parentPropertyValue: number,
  downPayment: number = 0,
  isConsumerLoanSelected: boolean = false
): CollateralValidationResult {
  return defaultValidator.validate(newHomePrice, parentPropertyValue, downPayment, isConsumerLoanSelected);
}
