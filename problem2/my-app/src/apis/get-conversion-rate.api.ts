import { CURRENCIES } from '../const';

export type TGetConversionRateParams = {
  currentCurrencyCode: string;
  currentCurrencyAmount: number;
  targetCurrencyCode: string;
};

export const getConversionRateAPI = (params: TGetConversionRateParams) => {
  const { currentCurrencyCode, currentCurrencyAmount, targetCurrencyCode } =
    params;

  return new Promise<number>((resolve) => {
    const currentCurrency = CURRENCIES.find(
      (cur) => cur.currency === currentCurrencyCode
    );
    const targetCurrency = CURRENCIES.find(
      (cur) => cur.currency === targetCurrencyCode
    );

    const targetCurrencyAmt = Number(
      (
        (currentCurrencyAmount * (currentCurrency?.price ?? 1)) /
        (targetCurrency?.price ?? 1)
      ).toFixed(6)
    );

    const timeoutId: NodeJS.Timeout = setTimeout(() => {
      resolve(targetCurrencyAmt);
      clearTimeout(timeoutId);
    }, 500);
  });
};
