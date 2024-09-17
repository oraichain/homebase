import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
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
import { handleConnectGithub } from 'components/GithubConnect/helper';
import { RootState } from 'store/configure';
import axios, { axiosAuth } from 'rest/request';
import styles from './index.module.scss';

const cx = cn.bind(styles);
Chart.register(CategoryScale, BarElement);
const baseApiUrl = process.env.REACT_APP_BASE_GPU_API_URL;

const GpuCredit: React.FC<{}> = () => {
  const [gpuStatistics, setGpuStatistics] = useState({
    totalCards: 30,
    totalVRAM: 1648,
    totalUsage: 0
  });
  const [gpuStatus, setGpuStatus] = useState([]);
  const [creditUsageHistoryData, setCreditUsageHistoryData] = useState([]);
  const [dailyCreditUsage, setDailyCreditUsage] = useState([]);

  const tokens = useSelector((state: RootState) => state.auth.token);
  const credit = useSelector((state: RootState) => state.auth.credit);
  const loggedIn = !!tokens.access;

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        // label: undefined,
        data: [],
        backgroundColor: ['#7332E7'],
        borderColor: '#B999F3',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
        barThickness: 20
      }
    ]
  });

  useEffect(() => {
    if (loggedIn) {
      const getData = async () => {
        let promises;

        try {
          promises = await Promise.all([
            axiosAuth.get(`${baseApiUrl}/credit-usage-history?filter=negative`, {
              headers: { Authorization: `Bearer ${tokens.access}` }
            }),
            axiosAuth.get(`${baseApiUrl}/credit-usage-per-day`, {
              headers: { Authorization: `Bearer ${tokens.access}` }
            })
          ]);
        } catch (e) {
          console.error('Credit usage history:', e);

          toast.error('Failed to qery credit usage');
        }

        // TODO: refactor this, promises may get [undefined, undefined] due to interceptors
        if (promises && promises[0] && promises[1]) {
          const creditUsageHistory = promises[0].data.creditUsageHistory;
          const totalCreditUsageEachDay = promises[1].data.totalCreditUsageEachDay;

          setCreditUsageHistoryData(creditUsageHistory);
          setDailyCreditUsage(totalCreditUsageEachDay);
        }
      };
      getData();
    } else {
      axios
        .get(`${baseApiUrl}/credit-usage-per-day-of-server`)
        .then(({ data }) => {
          setDailyCreditUsage(data.totalCreditUsageEachDayByServer);
        })
        .catch((e) => {
          console.error('Credit usage per day:', e);

          // TODO: handle error
          toast.error('Failed to fetch daily credit usage');
        });
    }

    axios
      .get(`${baseApiUrl}/gpu-statistics`)
      .then(({ data }) => {
        const gpuStatisticsData = {
          totalCards: 30, // data.numberOfCards, // hardcode util BE done
          totalVRAM: 1648, // Math.round(data.totalVRAM), // hardcode util BE done
          totalUsage: data.totalUsage.toFixed(2).replace(/\.0+$/, '')
        };
        setGpuStatistics(gpuStatisticsData);

        // TODO: set interval
        // TODO: set real data
        const gpuStatusData = data.hosts
          .sort((host1, host2) => host2.vramUsage - host1.vramUsage)
          .slice(0, 2)
          .map((host) => ({
            name: `${host.name} ${host.gpuNumber}x ${host.gpuName}`,
            capacity: Math.floor(host.totalVRAM),
            currentUsage: Math.floor(host.vramUsage)
          }));
        setGpuStatus(gpuStatusData);
      })
      .catch((e) => {
        console.error('gpu-statistics:', e);

        // TODO: handle error
        toast.error('Failed to fetch gpu statistics');
      });
  }, [tokens]);

  useEffect(() => {
    setChartData({
      labels: dailyCreditUsage.map((data) => new Date(data.date).getDate()),
      datasets: [
        {
          // label: undefined,
          data: dailyCreditUsage.map((data) => data.credit),
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
      accessor: (data) => new Date(data.timestamp).toISOString().replace(/T.+$/, ''),
      width: '35%',
      align: 'left',
      padding: `0px 0px 0px 24px`
    },
    action: {
      name: 'ACTION',
      accessor: (data) => data.action,
      width: '35%',
      align: 'left'
    },
    creditUsage: {
      name: 'CREDIT USAGE',
      accessor: (data) => data.credit,
      width: '30%',
      align: 'left'
    }
  };

  return (
    <Content nonBackground otherBackground>
      <div className={cx('container')}>
        <div className={cx('statistics')}>
          <div className={cx('daily-credit-usage')}>
            <h2 className={cx('title')}>{loggedIn ? 'Your' : 'Total'} Credit Usage Each Day</h2>
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
                <a
                  href="https://oraichain.notion.site/Decentralized-GPU-Infra-edafbc5aded04262ad6003ee392cfdc3"
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
                <a
                  href="https://oraichain.notion.site/Decentralized-GPU-Infra-edafbc5aded04262ad6003ee392cfdc3?pvs=74"
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
                  <div className={cx('value')}>{tokens.access ? credit : 0}</div>
                </div>
                <div className={cx('list-buttons')}>
                  {loggedIn ? (
                    <>
                      <Button type="third" disabled={true} icon={<AddIcon />}>
                        Buy Credit <TimeIcon />
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          window.open('https://forms.gle/MkAj3Cu8ZeG7pT6eA');
                        }}
                        icon={<KeyIcon />}
                      >
                        Apply for Credit
                      </Button>
                    </>
                  ) : (
                    <Button type="primary" onClick={handleConnectGithub} icon={<GitHubIcon />}>
                      Login to apply
                    </Button>
                  )}
                </div>
              </div>
              <div className={cx('go-to-panel')}>
                {loggedIn ? (
                  <>
                    <a
                      target="_blank"
                      href="https://jupyterhub.orai.network"
                      rel="noreferrer"
                      onClick={(e) => {
                        if (!credit) {
                          e.preventDefault();
                          alert('You have no credit. Please apply for credit first.');
                        }
                      }}
                    >
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
