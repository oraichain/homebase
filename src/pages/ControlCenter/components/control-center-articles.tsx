import cn from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from '../index.module.scss';

const cx = cn.bind(styles);

const ControlCenterArticles = () => {
  return (
    <>
      <div className={cx('article-section')}>
        <div className={cx('apps-list-wrapper', 'grid')}>
          <div className={cx('apps-list', 'grid')}>
            <div>
              <span className={cx('sec-title')}>Oraichain Academy</span>
              <Link to="https://academy.orai.io/" target="blank">
                <img
                  src="https://academy.orai.io/_next/image?url=https%3A%2F%2Forailabelstudio.storage.googleapis.com%2F2023%2F03%2Foracle_solutions_fix.png&w=3120&q=75"
                  alt="cover"
                  style={{
                    width: '100%',
                    height: 160,
                    objectFit: 'contain',
                    borderRadius: 8
                  }}
                  height={160}
                  width={160}
                />
              </Link>
            </div>
            <div style={{ marginTop: 20 }}>
              <span className={cx('sec-title', 'lg:row-span-1')}>Feature dApps</span>
              <Link to="https://oraidex.io/" target="blank">
                <img
                  src="https://app.oraidex.io/mascot.png"
                  alt="cover"
                  style={{
                    width: '100%',
                    height: 160,
                    objectFit: 'contain',
                    borderRadius: 8
                  }}
                  height={160}
                  width={160}
                />
              </Link>
            </div>
          </div>
          <div className={cx('noti-wrapper')}>
            <div className={cx('sec-title')}>Notifications</div>
            <div className={cx('noti')}>
              <div className={cx('noti-list', 'grid')}>
                <div className={cx('noti-card')}>
                  <img
                    src="https://i.ibb.co/RNrY547/noti-1.png"
                    alt="cover"
                    style={{
                      width: '100%',
                      objectFit: 'cover',
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8
                    }}
                  />
                  <div className={cx('noti-content')}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p className={cx('noti-title')}>Partnership Announcement: Oraichain X DoraHacks</p>
                      <p className={cx('noti-text')}>
                        We are happy to announce Oraichain is partnering with DoraHacks to advance the adoption of its
                        Layer 1 ecosystem for AI and Data economy. Over the coming ...
                      </p>
                    </div>
                    <Link
                      to="https://blog.orai.io/partnership-announcement-oraichain-x-dorahacks-1d1bedb30efa"
                      target="blank"
                    >
                      View more
                    </Link>
                  </div>
                </div>
                <div className={cx('noti-card')}>
                  <img
                    src="https://i.ibb.co/h9frHD0/noti-2.webp"
                    alt="cover"
                    style={{
                      width: '100%',
                      objectFit: 'cover',
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8
                    }}
                  />
                  <div className={cx('noti-content')}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p className={cx('noti-title')}>PATENT WO/2022/200834 - Oraichain Labs</p>
                      <p className={cx('noti-text')}>
                        AI and Blockchain are two of the leading technologies that will reshape plenty of things in our
                        lifetime. While Oraichain is aspiring to make the most...
                      </p>
                    </div>
                    <Link
                      to="https://blog.orai.io/introducing-patent-wo-2022-200834-by-oraichain-labs-da390c23bf6"
                      target="blank"
                    >
                      View more
                    </Link>
                  </div>
                </div>
                <div className={cx('noti-card')}>
                  <img
                    src="https://i.ibb.co/2FxBbMM/noti-3.webp"
                    alt="cover"
                    style={{
                      width: '100%',
                      objectFit: 'cover',
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8
                    }}
                  />
                  <div className={cx('noti-content')}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p className={cx('noti-title')}>
                        EUENO by Oraichain Labs - Decentralized Encrypting blockchain oracles for Web3
                      </p>
                      <p className={cx('noti-text')}>
                        Web3 needs to scale to big data of many real-world applications that reach beyond the data
                        storage capacity of Blockchains. ...
                      </p>
                    </div>
                    <Link
                      to="https://blog.orai.io/eueno-by-oraichain-labs-decentralized-encrypting-oracles-for-web3-4cc3a9729710"
                      target="blank"
                    >
                      View more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlCenterArticles;
