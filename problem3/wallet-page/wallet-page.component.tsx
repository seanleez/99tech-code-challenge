import {
  IFormattedWalletBalance,
  IWalletPageProps,
  IWalletBalance,
} from './wallet-page.type';
import { getPriority } from './wallet-page.util';

export const WalletPage: React.FC<IWalletPageProps> = React.memo((props) => {
  // Why we have to push all rest props to the div element?
  // And we need to use children inside return div. If not, no need to destruct children from props here.
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: IWalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);

        return balancePriority > -99 && balance.amount <= 0;
      })
      .sort((lhs: IWalletBalance, rhs: IWalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        return rightPriority - leftPriority;
      });
  }, [balances]);

  const formattedBalances = useMemo(() => {
    sortedBalances.map((balance: IWalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(),
    }));
  }, [sortedBalances]);

  const renderRows = useCallback(() => {
    return formattedBalances.map(
      (balance: IFormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;

        return (
          <WalletRow
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      }
    );
  }, [formattedBalances, prices]);

  return <div {...rest}>{renderRows()}</div>;
});
