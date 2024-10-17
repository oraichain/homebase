export const LUCKY_DRAW_CONTRACT = 'orai1n2vear4eua2ha29jgvuygrxpegm8rqx4z99ev5l4w67lpal23ycs4n659p';
export const LUCKY_DRAW_INTERVAL = 30 * 60 * 60;
export const FETCH_RESULT_INTERVAL = 500;
export const LUCKY_DRAW_FEE = '44440';
export const MAX_SPIN_TIME_PER_SEND = 30;
export const SPIN_ID_KEY = 'spin_id';

export enum REWARD_ENUM {
  EMERALD = '100000000',
  DIAMOND = '20000000',
  GOLD = '5000000',
  SILVER = '1000000',
  BRONZE = '100000',
  NOTHING = '0'
}

export const REWARD_LIST = {
  [REWARD_ENUM.EMERALD]: {
    amount: '100000000',
    title: '100 ORAI',
    message: '✨ NO WAY! You just scored the BIGGEST prize - 100 ORAI!'
  },
  [REWARD_ENUM.DIAMOND]: {
    amount: '20000000',
    title: '20 ORAI',
    message: "Winner, Winner! You've just won 20 ORAI"
  },
  [REWARD_ENUM.GOLD]: {
    amount: '5000000',
    title: '5 ORAI',
    message: "Winner, Winner! You've just won 5 ORAI"
  },
  [REWARD_ENUM.SILVER]: {
    amount: '1000000',
    title: '1 ORAI',
    message: 'Holy Moly! You just snagged 1 ORAI!'
  },
  [REWARD_ENUM.BRONZE]: {
    amount: '100000',
    title: '0.1 ORAI',
    message: 'Cha-ching! 0.1 ORAI just landed in your wallet - lucky you!'
  },
  [REWARD_ENUM.NOTHING]: {
    amount: '0',
    title: 'Try again',
    message: "This spin wasn't a win, but who knows what's next?"
  }
};

export const REWARD_MAP = {
  [REWARD_ENUM.EMERALD]: [0],
  [REWARD_ENUM.DIAMOND]: [1],
  [REWARD_ENUM.GOLD]: [2],
  [REWARD_ENUM.SILVER]: [3],
  [REWARD_ENUM.BRONZE]: [4],
  [REWARD_ENUM.NOTHING]: [5]
};

const prizes = Object.keys(REWARD_MAP)
  .map((rewardEnum) => {
    return REWARD_MAP[rewardEnum].map((id) => {
      const prize = {
        id,
        rewardEnum,
        title: REWARD_LIST[rewardEnum].title,
        background: id % 2 ? '#612fca' : '#9b89e3',
        fonts: []
      };
      if (rewardEnum === REWARD_ENUM.NOTHING) {
        prize.fonts = [{ text: 'Try Again', top: '18%' }];
      } else {
        const fonts = prize.title.split(' ');
        prize.fonts = [
          { text: fonts[0], top: '18%', fontSize: '26px' },
          { text: fonts[1], top: '38%' }
        ];
      }
      return prize;
    });
  })
  .flat()
  .sort((a, b) => a.id - b.id);

export const DATA_LUCKY_DRAW = {
  blocks: [{ padding: '13px', background: '#341b55' }],
  prizes,
  buttons: [
    { radius: '50px', background: '#341b55' },
    { radius: '45px', background: '#fff' },
    { radius: '41px', background: '#665a9a', pointer: true },
    {
      radius: '35px',
      background: '#9b89e3',
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
