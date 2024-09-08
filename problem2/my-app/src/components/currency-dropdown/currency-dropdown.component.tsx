import { TCurrency } from '../../type';
import { CURRENCIES } from '../../const';
import React from 'react';
import './currency-dropdown.style.css';
import { SVGIcon } from '../svg-icon';

export interface ICurrencyDropdownProps {
  selectedCurrency: TCurrency;
  onSelectCurrency: (currency: TCurrency) => void;
}

const classNamePrefix = 'currency-dropdown';

export const CurrencyDropdown: React.FC<ICurrencyDropdownProps> = (props) => {
  const { selectedCurrency = CURRENCIES[0], onSelectCurrency } = props;

  return (
    <div className={`${classNamePrefix} dropdown`}>
      <button
        className="btn btn-dark dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false">
        <SVGIcon name={selectedCurrency.currency} />

        {selectedCurrency.currency}
      </button>
      <ul className={`${classNamePrefix}__menu dropdown-menu`}>
        {CURRENCIES.sort((a, b) => a.currency.localeCompare(b.currency)).map(
          (cur, index) => {
            return (
              <li key={index} onClick={() => onSelectCurrency(cur)}>
                <span className="dropdown-item">{cur.currency}</span>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};
