import { LuckyWheel } from '@lucky-canvas/react';
import { toDisplay, BigDecimal } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import cn from 'classnames/bind';
import Lottie from 'lottie-react';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import LuckyDrawImg from 'assets/images/oraichain-labs-4-years-side.jpg';
import LuckyDrawImgMobile from 'assets/images/oraichain-labs-4-years.jpg';
import CongratulationLottie from 'assets/lottie/congratulation.json';
import InputRange from 'components/InputRange';
import Loader from 'components/Loader';
import ModalCustom from 'components/ModalCustom';
import { network } from 'config/networks';
import { handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import { useLoadOraichainTokens } from 'hooks/useLoadTokens';
import useWindowSize from 'hooks/useWindowSize';
import { numberWithCommas } from 'helper/number';
import { RootState } from 'store/configure';
import { Spin } from './lucky-draw-client/LuckyWheelContract.types';
import {
  DATA_LUCKY_DRAW,
  LUCKY_DRAW_FEE,
  MAX_SPIN_TIME_PER_SEND,
  MSG_TITLE,
  REWARD_MAP,
  REWARD_TITLE,
  SPIN_ID_KEY
} from './constants';
import {
  getDataLogByKey,
  sendMultiple,
  useGetListSpinResult,
  useLuckyDrawConfig
} from './useLuckyDraw';
import styles from './index.module.scss';

const cx = cn.bind(styles);

const LuckyDraw: FC<{}> = () => {
  const [address] = useConfigReducer('address');
  const [isOpen, setIsOpen] = useState(false);
  const [loadingFee, setLoadingFee] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [ticketNum, setTicketNum] = useState(1);
  const [spinIdList, setSpinIdList] = useState([]);
  const myLuckyRef = useRef(null);
  const [item, setItem] = useState('');
  const [isSuccessSpin, setIsSuccessSpin] = useState(false);
  const [bestReward, setBestReward] = useState<
    | Spin
    | {
        spinId: number;
        participant: string;
        random_number: string;
        reward: string;
        spin_time: number;
        result_time: number;
      }
  >();
  const [numberOfReward, setNumberOfReward] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [wheelSize, setWheelSize] = useState('500px');
  const [loaded, setLoaded] = useState(false);
  const mobileMode = isMobile();
  const { isMobileView, windowSize } = useWindowSize();
  const [dataSource, setDataSource] = useState<any>(DATA_LUCKY_DRAW);

  const amounts = useSelector((state: RootState) => state.token.amounts);
  const loadOraichainToken = useLoadOraichainTokens();
  const balance = amounts['orai'];

  const { spinConfig } = useLuckyDrawConfig();
  const { fee = LUCKY_DRAW_FEE, feeDenom = 'orai', feeToken } = spinConfig || {};

  const insufficientFund = fee && Number(fee) * ticketNum > Number(balance);

  useEffect(() => {
    const { width = 500 } = windowSize || {};

    if (!width) {
      return;
    }

    setLoaded(false);
    const size = isMobileView ? width - 20 : 500;

    if (size > 0) {
      setWheelSize(`${size}px`);
      setLoaded(true);
    }

    return () => setLoaded(false);
  }, [windowSize, isMobileView]);

  // const { spinResult } = useGetSpinResult({ id: spinId });
  const { spinResult, isDone } = useGetListSpinResult({ spinIdList });

  useEffect(() => {
    if (spinIdList.length && isDone && myLuckyRef?.current) {
      const fmtRes = [...(spinResult || [])].sort((a, b) => Number(b.reward) - Number(a.reward));
      const bestRes = fmtRes[0];

      const listReward = fmtRes.filter((e) => e.reward && Number(e.reward) > 0);
      const totalRew = listReward.reduce((acc, cur) => {
        acc = new BigDecimal(cur.reward).add(acc).toNumber();

        return acc;
      }, 0);

      setBestReward(bestRes);
      setNumberOfReward(listReward.length);
      setTotalReward(totalRew);

      const indexPrize = REWARD_MAP[bestRes?.reward];
      const randomItemIndex = (Math.random() * 2) >> 0;

      myLuckyRef.current.stop(indexPrize?.[randomItemIndex] ?? indexPrize?.[0]);
    }
  }, [spinResult, spinIdList, isDone]);

  const onStart = async () => {
    setIsSuccessSpin(false);
    setItem('');
    setSpinIdList([]);
    setLoadingFee(true);
    setIsSpinning(true);

    if (!myLuckyRef) return;

    try {
      const sendResult = await sendMultiple({
        senderAddress: address,
        timeToSpin: ticketNum,
        fee,
        feeDenom,
      });

      myLuckyRef?.current?.play();

      const { logs = [] } = sendResult;

      const idList = [];
      logs.forEach((log) => {
        const { value: spinId } = getDataLogByKey(log, SPIN_ID_KEY);

        if (spinId && !isNaN(spinId)) {
          idList.push(Number(spinId));
        }
        return log;
      });

      if (idList.length) {
        setSpinIdList(idList);
      }
    } catch (error) {
      console.log('error', error);
      handleErrorTransaction(error, {
        tokenName: 'ORAI',
        chainName: network.chainId
      });
      setIsSpinning(false);
    } finally {
      setLoadingFee(false);
    }
  };

  // const tokenValueByTicket = ticketNum * toDisplay(fee || LUCKY_DRAW_FEE);
  const tokenValueByTicket = ticketNum * toDisplay(fee);

  return (
    <>
      <div className={cx('btn') + ' disco'} onClick={() => setIsOpen(true)}>
        <img src={mobileMode ? LuckyDrawImgMobile : LuckyDrawImg} alt="LuckyDrawImg" />
      </div>
      <ModalCustom
        title="Lucky Draw"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setItem('');
          setIsSuccessSpin(false);

          setTicketNum(1);
          setBestReward(null);
          setTotalReward(0);
          setNumberOfReward(0);
        }}
        className={cx('contentModal')}
        overlayClassName={cx('overlay')}
      >
        <div className={cx('wheel')}>
          <div className={cx('info')}>
            <div className={cx('detail')}>
              <div className={cx('rangeWrapper')}>
                <span className={cx('title')}>Select Spin: </span>
                <InputRange
                  max={MAX_SPIN_TIME_PER_SEND}
                  min={1}
                  value={ticketNum}
                  onChange={(val) => setTicketNum(+val)}
                  className={cx('range')}
                  showValue={false}
                  suffix={
                    <div className={cx('value')}>
                      <span>{ticketNum} times </span>
                      <span>
                        ( = {tokenValueByTicket /* numberWithCommas(tokenValueByTicket) */} {feeToken?.name || 'ORAI'})
                      </span>
                    </div>
                  }
                />
              </div>
            </div>
            <span>
              Balance:&nbsp;
              <span className={cx('balance')}>
                {toDisplay(balance)} {feeToken?.name || 'ORAI'}
              </span>
            </span>
          </div>

          {loaded && (
            <div className={cx('spin')}>
              <LuckyWheel
                ref={myLuckyRef}
                width={wheelSize}
                height={wheelSize}
                blocks={dataSource.blocks}
                prizes={dataSource.prizes}
                buttons={dataSource.buttons}
                defaultStyle={dataSource.defaultStyle}
                onStart={() => {
                  // onStart
                  console.log('Spin...');
                }}
                onEnd={(prize) => {
                  console.log(prize);
                  setIsSuccessSpin(true);
                  setIsSpinning(false);
                  setItem(prize.title as string);
                  loadOraichainToken(address, [feeDenom]);
                }}
              />
              <button
                disabled={insufficientFund || loadingFee || isSpinning}
                // disabled
                className={cx('spinMask')}
                onClick={onStart}
                title={insufficientFund ? 'Insufficient Fee!' : 'Spin the wheel to win!'}
              >
                <span className={cx('spinTxt')}>
                  {loadingFee && <Loader width={16} height={16} />}
                  Start
                </span>
                {/* <span className={cx('token')}>
                  {toDisplay(fee)} <OraiXLightIcon />
                </span> */}
              </button>
            </div>
          )}
          <span className={cx('result', isSuccessSpin && 'done')}>
            {!isSuccessSpin ? (
              'Ready to test your luck? Spin the wheel to win!'
            ) : ticketNum >= 1 && numberOfReward > 0 ? (
              <div className={cx('multiple')}>
                You've racked up <strong>{numberOfReward}</strong> wins! Keep it going!
                <br />
                <br />
                You earned{' '}
                <strong>
                  {numberWithCommas(toDisplay(String(totalReward)), undefined, { maximumFractionDigits: 6 })}
                </strong>{' '}
                $ORAI in total rewards, with your best single win at{' '}
                <strong>
                  {numberWithCommas(toDisplay(bestReward?.reward || '0'), undefined, { maximumFractionDigits: 6 })}
                </strong>{' '}
                $ORAI
              </div>
            ) : (
              <span>
                <strong>{item}: &nbsp;</strong>
                {MSG_TITLE[item]}
              </span>
            )}
          </span>
        </div>

        {isSuccessSpin && item !== REWARD_TITLE.NOTHING && (
          <div className={cx('lottie')}>
            <Lottie animationData={CongratulationLottie} autoPlay={isSuccessSpin} loop={false} />
          </div>
        )}
      </ModalCustom>
    </>
  );
};

export default LuckyDraw;
