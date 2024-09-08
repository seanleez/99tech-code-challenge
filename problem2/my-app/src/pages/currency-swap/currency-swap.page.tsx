import React, { useState } from 'react';
import { CurrencyDropdown, Spinner } from '../../components';
import { CURRENCIES } from '../../const';
import './currency-swap.style.css';
import { useForm } from 'react-hook-form';
import { TCurrency } from '../../type';
import { getConversionRateAPI } from '../../apis';

export interface ICurrencySwapPageProps {}

export interface TFormData {
  currentCurrency: TCurrency;
  currentCurrencyAmt: number;
  targetCurrency: TCurrency;
  targetCurrencyAmt: number;
}

const classNamePrefix = 'currency-swap-page';

export const CurrencySwapPage: React.FC<ICurrencySwapPageProps> = React.memo(
  () => {
    const { formState, register, setValue, getValues, watch, handleSubmit } =
      useForm<TFormData>({
        reValidateMode: 'onChange',
        defaultValues: {
          currentCurrency: CURRENCIES[0],
          currentCurrencyAmt: 0,
          targetCurrency: CURRENCIES[1],
          targetCurrencyAmt: 0,
        },
      });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSwapCurrencies = () => {
      const _tempCurrency = getValues('currentCurrency');
      const _tempAmt = getValues('currentCurrencyAmt');

      setValue('currentCurrency', getValues('targetCurrency'));
      setValue('targetCurrency', _tempCurrency);
      setValue('currentCurrencyAmt', getValues('targetCurrencyAmt'));
      setValue('targetCurrencyAmt', _tempAmt);
    };

    const handleExchangeCurrencies = async (data: TFormData) => {
      const { currentCurrency, targetCurrency, currentCurrencyAmt } = data;

      console.log(data);

      setIsLoading(true);

      try {
        const response = await getConversionRateAPI({
          currentCurrencyCode: currentCurrency.currency,
          targetCurrencyCode: targetCurrency.currency,
          currentCurrencyAmount: currentCurrencyAmt,
        });

        setValue('targetCurrencyAmt', response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className={classNamePrefix}>
        <div className="d-flex justify-content-center align-items-center vh-100">
          <form
            className={`${classNamePrefix}__form`}
            onSubmit={handleSubmit(handleExchangeCurrencies)}>
            <div className={`${classNamePrefix}__form-ribbon`}>
              <label htmlFor="amount" className="form-label">
                You pay
              </label>
              <div className={`${classNamePrefix}__form-ribbon-body`}>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.000001"
                  className={`form-control ${
                    formState.errors.currentCurrencyAmt ? 'is-invalid' : ''
                  }`}
                  {...register('currentCurrencyAmt', {
                    min: { value: 0, message: 'Amount must be greater than 0' },
                  })}
                />
                <CurrencyDropdown
                  selectedCurrency={watch('currentCurrency')}
                  onSelectCurrency={(cur) => setValue('currentCurrency', cur)}
                />
              </div>
              {formState.errors.currentCurrencyAmt && (
                <div className={`${classNamePrefix}__form-ribbon-error`}>
                  {formState.errors.currentCurrencyAmt?.message}
                </div>
              )}
            </div>
            <div className={`${classNamePrefix}__form-ribbon`}>
              <label htmlFor="amount" className="form-label">
                You receive
              </label>
              <div className={`${classNamePrefix}__form-ribbon-body`}>
                <input
                  type="number"
                  className="form-control"
                  readOnly
                  {...register('targetCurrencyAmt')}
                />
                <CurrencyDropdown
                  selectedCurrency={watch('targetCurrency')}
                  onSelectCurrency={(cur) => setValue('targetCurrency', cur)}
                />
              </div>
            </div>

            <div className={`${classNamePrefix}__form-note`}>
              <span>{`1 ${watch('currentCurrency').currency} = ${(
                watch('currentCurrency.price') / watch('targetCurrency.price')
              ).toFixed(6)} ${watch('targetCurrency').currency}`}</span>
              <i className="bi bi-arrow-down-up"></i>
            </div>

            <button
              className={`${classNamePrefix}__form-swap-btn btn btn-dark ${
                formState.errors.currentCurrencyAmt ? 'is-error' : ''
              }`}
              onClick={() => handleSwapCurrencies()}>
              <i className="bi bi-arrow-down-up"></i>
            </button>

            <button type="submit" className="btn btn-warning">
              Convert
            </button>
          </form>
        </div>

        {isLoading && <Spinner />}
      </div>
    );
  }
);
