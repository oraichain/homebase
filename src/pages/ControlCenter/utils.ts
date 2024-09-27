export const mapMainnetDataLabel = (key: string, value: string) => {
  switch (key) {
    case 'transaction_count':
      return {
        label: 'Transaction Count',
        value
      };
    case 'block_height':
      return {
        label: 'Block Height',
        value
      };
    case 'ratio_bonded':
      return {
        label: 'Ratio Bonded',
        value: value + '%'
      };
    case 'total_account':
      return {
        label: 'Total Account',
        value
      };
    case 'circulating_supply':
      return {
        label: 'Circulating Supply',
        value
      };
    case 'defi_tvl':
      return {
        label: 'DeFi TVL',
        value: '$' + value
      };
    case 'total_delegated':
      return {
        label: 'Total Delegated',
        value
      };
    case 'value_delegated':
      return {
        label: 'Value Delegated',
        value: '$' + value
      };
  }
};
