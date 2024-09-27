import LogoTokenOrai from 'assets/icons/oraichain.svg';
import LogoTokenAiri from 'assets/icons/airi.svg';
import LogoTokenAtom from 'assets/icons/atom_cosmos.svg';
import LogoTokenScOrai from 'assets/icons/orchai.svg';
import LogoTokenTron from 'assets/icons/tron.svg';

export const tokenAction = [
  {
    title: 'Buy ORAI with Alchemy Pay',
    link: 'https://payment.orai.io/'
  },
  {
    title: 'Buy ORAI on CEX',
    link: 'https://www.kucoin.com/trade/ORAI-USDT'
  },
  {
    title: 'Delegate & Claim rewards',
    link: 'https://scan.orai.io/validators'
  },
  {
    title: 'Swap tokens with OraiDEX',
    link: 'https://oraidex.io/bridge'
  }
];

export const prices = [
  {
    label: 'oraichain-token',
    token: 'ORAI',
    icon: LogoTokenOrai
  },
  {
    label: 'airight',
    token: 'AIRI',
    icon: LogoTokenAiri
  },
  {
    label: 'cosmos',
    token: 'ATOM',
    icon: LogoTokenAtom
  },
  {
    label: 'scorai',
    token: 'SCORAI',
    icon: LogoTokenScOrai
  },
  {
    label: 'tron',
    token: 'TRON',
    icon: LogoTokenTron
  }
  // {
  //   label: "kawaii-islands",
  //   token: "KWT",
  //   icon: "/images/subpage/tokens/kwt.png",
  // },
  // {
  //   label: "milky-token",
  //   token: "MILKY",
  //   icon: "/images/subpage/tokens/milky.png",
  // },
  // {
  //   label: "usd-coin",
  //   token: "USDT",
  //   icon: "/images/subpage/tokens/usd.png",
  // }
];
