import { ReactComponent as Arrow } from 'assets/icons/arrow_right.svg';
import Airight from 'assets/images/airight.png';
import Defilens from 'assets/images/defilens.png';
import Dex from 'assets/images/dex.png';
import Future from 'assets/images/future.png';
import LLMChat from 'assets/images/llmchat.png';
import Orchai from 'assets/images/orchai.png';
import Orderbook from 'assets/images/orderbook.png';
import Scan from 'assets/images/scan.png';
import { FC, HTMLAttributeAnchorTarget } from 'react';
import { Link } from 'react-router-dom';
import styles from './Feature.module.scss';

export type FeatureType = {
  name: string;
  link: string | undefined;
  target: HTMLAttributeAnchorTarget;
  img: string | undefined;
};

const ListFeature: FC<{
  list: FeatureType[];
  title: string;
}> = ({ list, title }) => {
  return (
    <div className={styles.listWrapper}>
      <h2>{title}</h2>
      <div className={styles.list}>
        {list.map((item) => {
          return (
            <Link className={styles.item} to={item.link} target={item.target} key={item.name}>
              <img src={item.img} alt={item.name} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const Feature = () => {
  return (
    <div className={styles.feature}>
      <h1>Featured DApps</h1>
      <div className={styles.detail}>
        <div className={styles.ai}>
          <ListFeature list={ListAi} title="AI-Powered DApps" />
        </div>

        <div className={styles.defi}>
          <ListFeature list={ListDeFi} title="DeFi DApps" />
        </div>
      </div>

      {/* <Link to="/" className={styles.ecosystem}>
        Explore Ecosystem <Arrow />
      </Link> */}
    </div>
  );
};

export default Feature;

const ListAi: FeatureType[] = [
  {
    name: 'Defi Lens',
    link: 'https://defilens.ai/',
    target: '_blank',
    img: Defilens
  },
  {
    name: 'LLM Chatbot',
    link: 'https://layer.orai.io/',
    target: '_blank',
    img: LLMChat
  },
  {
    name: 'Airight',
    link: 'https://airight.io/',
    target: '_blank',
    img: Airight
  },
  {
    name: 'Orchai',
    link: 'https://orchai.io/',
    target: '_blank',
    img: Orchai
  }
];

const ListDeFi: FeatureType[] = [
  {
    name: 'Orai Dex',
    link: 'https://oraidex.io/',
    target: '_blank',
    img: Dex
  },
  {
    name: 'OrderBook',
    link: 'https://orderbook.oraidex.io/',
    target: '_blank',
    img: Orderbook
  },
  {
    name: 'Future',
    link: 'https://futures.oraidex.io/',
    target: '_blank',
    img: Future
  },
  {
    name: 'Orai Scan',
    link: 'https://scan.orai.io/',
    target: '_blank',
    img: Scan
  }
];
