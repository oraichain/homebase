export const LUCKY_DRAW_CONTRACT = 'orai1n2vear4eua2ha29jgvuygrxpegm8rqx4z99ev5l4w67lpal23ycs4n659p';
export const LUCKY_DRAW_INTERVAL = 30 * 60 * 60;
export const FETCH_RESULT_INTERVAL = 500;
export const LUCKY_DRAW_FEE = '44440';
export const MAX_SPIN_TIME_PER_SEND = 30;
export const SPIN_ID_KEY = 'spin_id';

export enum REWARD_ENUM {
  DIAMOND = '20000000',
  GOLD = '5000000',
  SILVER = '1000000',
  BRONZE = '100000',
  NOTHING = '0'
}

export const REWARD_MAP = {
  [REWARD_ENUM.DIAMOND]: [0],
  [REWARD_ENUM.GOLD]: [1],
  [REWARD_ENUM.SILVER]: [3],
  [REWARD_ENUM.BRONZE]: [4],
  [REWARD_ENUM.NOTHING]: [2, 5]
};

export enum REWARD_TITLE {
  DIAMOND = '20 ORAI',
  GOLD = '5 ORAI',
  SILVER = '1 ORAI',
  BRONZE = '0.1 ORAI',
  NOTHING = 'Try again'
}

export const MSG_TITLE = {
  [REWARD_TITLE.DIAMOND]: `✨ NO WAY! You just scored the BIGGEST prize - 20 ORAI!`,
  [REWARD_TITLE.GOLD]: "Winner, Winner! You've just won 5 ORAI",
  [REWARD_TITLE.SILVER]: 'Holy Moly! You just snagged 1 ORAI!',
  [REWARD_TITLE.BRONZE]: 'Cha-ching! 0.1 ORAI just landed in your wallet - lucky you!',
  [REWARD_TITLE.NOTHING]: "This spin wasn't a win, but who knows what's next?"
};

export const DATA_LUCKY_DRAW = {
  blocks: [{ padding: '13px', background: '#341B55' }],
  prizes: [
    {
      id: 0,
      title: '20 ORAI',
      background: '#9B89E3',
      fonts: [
        { text: '20', top: '18%', fontSize: '26px' },
        { text: 'ORAI', top: '38%' }
      ]
    },
    {
      id: 1,
      title: '5 ORAI',
      background: '#612FCA',
      fonts: [
        { text: '5', top: '18%', fontSize: '26px' },
        { text: 'ORAI', top: '38%' }
      ]
    },
    {
      id: 2,
      title: 'Try again',
      background: '#9B89E3',
      fonts: [{ text: 'Try Again', top: '18%' }]
    },
    {
      id: 3,
      title: '1 ORAI',
      background: '#612FCA',
      fonts: [
        { text: '1', top: '18%', fontSize: '26px' },
        { text: 'ORAI', top: '38%' }
      ]
    },
    {
      id: 4,
      title: '0.1 ORAI',
      background: '#9B89E3',
      fonts: [
        { text: '0.1', top: '18%', fontSize: '26px' },
        { text: 'ORAI', top: '38%' }
      ]
    },
    {
      id: 5,
      title: 'Try again',
      background: '#612FCA',
      fonts: [{ text: 'Try Again', top: '18%' }]
    }
  ],
  buttons: [
    { radius: '50px', background: '#341B55' },
    { radius: '45px', background: '#fff' },
    { radius: '41px', background: '#665a9a', pointer: true },
    {
      radius: '35px',
      background: '#d7f5bf',
      fonts: [{ text: 'Spin', fontSize: '18px', top: '-30%' }]
    }
  ],
  defaultStyle: {
    fontColor: '#ffffff',
    fontSize: '18px',
    fontWeight: 700
  },
  defaultConfig: {
    speed: 10
  }
};
