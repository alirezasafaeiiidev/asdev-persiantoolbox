import { bench, describe } from 'vitest';
import { calculateLoan } from '@/features/loan/loan.logic';
import { calculateSalary } from '@/features/salary';
import { calculateInterest } from '@/features/interest/interest.logic';

describe('core tools benchmarks', () => {
  bench('loan calculation', () => {
    calculateLoan({
      principal: 500_000_000,
      annualInterestRatePercent: 23,
      months: 36,
      loanType: 'regular',
      calculationType: 'installment',
    });
  });

  bench('salary calculation', () => {
    calculateSalary({
      baseSalary: 150_000_000,
      workingDays: 30,
      workExperienceYears: 4,
      overtimeHours: 16,
      nightOvertimeHours: 8,
      holidayOvertimeHours: 4,
      missionDays: 2,
      isMarried: true,
      numberOfChildren: 2,
      hasWorkerCoupon: true,
      hasTransportation: true,
      otherBenefits: 10_000_000,
      otherDeductions: 5_000_000,
      isDevelopmentZone: false,
    });
  });

  bench('interest calculation', () => {
    calculateInterest({
      principal: 250_000_000,
      annualRatePercent: 20,
      months: 18,
      mode: 'compound',
      timesPerYear: 12,
    });
  });
});
