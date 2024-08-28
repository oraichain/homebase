import { useEffect, useState } from 'react';
import cn from 'classnames/bind';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, BarElement } from 'chart.js';
import Chart from 'chart.js/auto';

import Content from 'layouts/Content';
import { ReactComponent as JumpIcon } from 'assets/icons/jump.svg';
import { ReactComponent as GitHubIcon } from 'assets/icons/github.svg';
import { ReactComponent as NoCreditUsageHistoryIcon } from 'assets/images/no-credit-usage-history.svg';
import { ReactComponent as AddIcon } from 'assets/icons/Add.svg';
import { ReactComponent as TimeIcon } from 'assets/icons/time.svg';
import { ReactComponent as KeyIcon } from 'assets/icons/key.svg';
import JupyterHubImg from 'assets/images/jupyterhub.png';
import { Table, TableHeaderProps } from 'components/Table';
import { Button } from 'components/Button';
import styles from './index.module.scss';

const cx = cn.bind(styles);
Chart.register(CategoryScale, BarElement);

const GpuCredit: React.FC<{}> = () => {
  const [gpuStatistics, setGpuStatistics] = useState({
    totalCards: 22,
    totalVRAM: 592,
    totalUsage: 68.31
  });
  const [gpuStatus, setGpuStatus] = useState([]);
  const [creditUsageHistoryData, setCreditUsageHistoryData] = useState([]);
  const [dailyCreditUsage, setDailyCreditUsage] = useState([]);

  const [chartData, setChartData] = useState({
    labels: dailyCreditUsage.map((data) => data.year),
    datasets: [
      {
        // label: undefined,
        data: dailyCreditUsage.map((data) => data.userGain),
        backgroundColor: ['#7332E7'],
        borderColor: '#B999F3',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
        barThickness: 20
      }
    ]
  });
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    loggedIn &&
      setCreditUsageHistoryData([
        {
          timestamp: '26/08/2024',
          action: '10 hours usage',
          creditUsage: -101
        },
        {
          timestamp: '26/08/2024',
          action: '10 hours usage',
          creditUsage: -101
        },
        {
          timestamp: '26/08/2024',
          action: '10 hours usage',
          creditUsage: -101
        },
        {
          timestamp: '26/08/2024',
          action: '10 hours usage',
          creditUsage: -101
        }
      ]);
    setGpuStatus([
      { name: 'VT1 4x RTX3090', capacity: 96, currentUsage: 58.5 },
      { name: 'VT2 4x RTX3090', capacity: 96, currentUsage: 77.3 }
    ]);
    setDailyCreditUsage([
      {
        date: new Date(Date.now() - 13 * 864e5),
        value: 5
      },
      {
        date: new Date(Date.now() - 12 * 864e5),
        value: 3
      },
      {
        date: new Date(Date.now() - 11 * 864e5),
        value: 40
      },
      {
        date: new Date(Date.now() - 10 * 864e5),
        value: 198
      },
      {
        date: new Date(Date.now() - 9 * 864e5),
        value: 225
      },
      {
        date: new Date(Date.now() - 8 * 864e5),
        value: 20
      },
      {
        date: new Date(Date.now() - 7 * 864e5),
        value: 6
      },
      {
        date: new Date(Date.now() - 6 * 864e5),
        value: 125
      },
      {
        date: new Date(Date.now() - 5 * 864e5),
        value: 74
      },
      {
        date: new Date(Date.now() - 4 * 864e5),
        value: 35
      },
      {
        date: new Date(Date.now() - 3 * 864e5),
        value: 250
      },
      {
        date: new Date(Date.now() - 2 * 864e5),
        value: 20
      },
      {
        date: new Date(Date.now() - 1 * 864e5),
        value: 6
      },
      {
        date: new Date(Date.now() - 0 * 864e5),
        value: 74
      }
    ]);
  }, []);

  useEffect(() => {
    setChartData({
      labels: dailyCreditUsage.map((data) => data.date.getDate()),
      datasets: [
        {
          // label: undefined,
          data: dailyCreditUsage.map((data) => data.value),
          backgroundColor: ['#7332E7'],
          borderColor: '#B999F3',
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
          barThickness: 20
        }
      ]
    });
  }, [dailyCreditUsage]);

  const gpuStatusElements = gpuStatus.map((detail, idx) => {
    const percentUsage = Math.floor((detail.currentUsage / detail.capacity) * 100);
    return (
      <div className={cx('gpu')} key={`gpu-${idx}`}>
        <div className={cx('usage')}>
          <div className={cx('text')}>{detail.name} Usage:</div>
          <div className={cx('value')}>
            {Math.floor(detail.currentUsage)}/{detail.capacity} GB
          </div>
        </div>
        <div className={cx('progress')}>
          <div className={cx('percent-value')} style={{ width: `${percentUsage}%` }}>
            {percentUsage}%
          </div>
        </div>
      </div>
    );
  });

  const creditUsageHistoryHeaders: TableHeaderProps<any> = {
    timestamp: {
      name: 'TIMESTAMP',
      accessor: (data) => data.timestamp,
      width: '30%',
      align: 'left',
      padding: `0px 0px 0px 24px`
    },
    action: {
      name: 'ACTION',
      accessor: (data) => data.action,
      width: '40%',
      align: 'left'
    },
    creditUsage: {
      name: 'CREDIT USAGE',
      accessor: (data) => data.creditUsage,
      width: '30%',
      align: 'left'
    }
  };

  return (
    <Content nonBackground otherBackground>
      <div className={cx('container')}>
        <div className={cx('statistics')}>
          <div className={cx('daily-credit-usage')}>
            <h2 className={cx('title')}>Total Credit Usage Each Day</h2>
            <div className={cx('chart')}>
              <Bar
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      grid: {
                        display: true,
                        color: 'darkgray', // Color of the grid lines
                        lineWidth: 0.2 // Width of the grid lines
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className={cx('gpu-statistics')}>
            <h2 className={cx('title')}>GPU Statistics</h2>
            <div className={cx('content')}>
              <div className={cx('basic-info')}>
                <div className={cx('total-cards')}>
                  <div className={cx('header')}>Total GPU Cards:</div>
                  <div className={cx('value')}>{gpuStatistics.totalCards}</div>
                </div>
                <div className={cx('total-vram')}>
                  <div className={cx('header')}>Total VRAM:</div>
                  <div className={cx('value')}>{gpuStatistics.totalVRAM} GB</div>
                </div>
                <div className={cx('total-usage')}>
                  <div className={cx('header')}>Total Usage:</div>
                  <div className={cx('value')}>{gpuStatistics.totalUsage}%</div>
                </div>
              </div>
              <hr style={{ width: '100%' }} />
              <div className={cx('gpu-detail')}>
                {gpuStatusElements}
                {/* TODO: add link href */}
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx('link', 'external')}
                >
                  View all GPU Status &nbsp;{<JumpIcon />}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={cx('personal-info')}>
          <div className={cx('intro')}>
            <div className={cx('text')}>
              <h2 className={cx('title')}>Decentralized GPU Infra</h2>
              <div className={cx('content')}>
                <p>
                  Decentralized GPU infra is crucial for the advancement of AI x Blockchain. DApps builders that are
                  eager to scale AI in Blockchain environment can apply for GPU Credits offered by Oraichain Labs and
                  expand their project capabilities.
                  <br />
                  GPU Credits Offering supercharges AI businesses and empowers them to thrive on blockchain environment.
                  Decentralized GPU infrastructure is crucial for the advancement of AI x Blockchain.
                  <br />
                  With Decentralized GPU Infra, projects can: <br />
                  - Optimize cost
                  <br />- Reduce common infrastructure risks of relying on a single provider.
                </p>
                {/* TODO: add Link */}
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx('link', 'external')}
                >
                  Learn more &nbsp;{<JumpIcon />}
                </a>
              </div>
            </div>
            <div className={cx('interaction')}>
              <div className={cx('credit-balance')}>
                <div className={cx('info')}>
                  <div className={cx('text')}>Your Credits</div>
                  <div className={cx('value')}>0</div>
                </div>
                <div className={cx('list-buttons')}>
                  {loggedIn ? (
                    <>
                      <Button type="third" disabled={true} icon={<AddIcon />}>
                        Buy Credit <TimeIcon />
                      </Button>
                      {/* TODO: add action */}
                      <Button type="primary" onClick={() => {}} icon={<KeyIcon />}>
                        Apply for Credit
                      </Button>
                    </>
                  ) : (
                    /* TODO: add action */
                    <Button type="primary" onClick={() => {}}>
                      <GitHubIcon /> Login to apply
                    </Button>
                  )}
                </div>
              </div>
              <div className={cx('go-to-panel')}>
                {loggedIn ? (
                  <>
                    {/* TODO: Go to Jupyter */}
                    <a target="_blank" href="https://google.com" rel="noreferrer">
                      <img src={JupyterHubImg} alt="jupyterhub" />
                      <JumpIcon />
                    </a>
                    {/* TODO: remove */}
                    {/* <a target="_blank" href="https://google.com" rel="noreferrer" style={{ visibility: 'hidden' }}>
                      <img src={JupyterHubImg} alt="rancher" />
                      <JumpIcon />
                    </a> */}
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
          <div className={cx('credit-usage-history')}>
            <h2 className={cx('title')}>Credit Usage History</h2>
            <div className={cx('table')}>
              <Table
                headers={creditUsageHistoryHeaders}
                data={creditUsageHistoryData}
                stylesColumn={{
                  padding: '16px 0'
                }}
                noData={
                  <tr className={cx('no-data')}>
                    <td>
                      <NoCreditUsageHistoryIcon />
                      No records found
                    </td>
                  </tr>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default GpuCredit;
