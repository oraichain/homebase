import { ReactNode } from 'react';
import styles from './Table.module.scss';

export type TableHeaderProps<T extends object> = Record<
  string,
  {
    name: string;
    accessor: (data: T) => ReactNode | string | undefined;
    width: string;
    align: 'left' | 'right' | 'center';
    padding?: string;
  }
>;
export type TableProps<T extends object> = {
  headers: TableHeaderProps<T>;
  data: T[];
  stylesColumn?: React.CSSProperties;
  handleClickRow?: (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, record: T) => void;
};

export const Table = <T extends object>({ headers, data, handleClickRow, stylesColumn }: TableProps<T>) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr style={stylesColumn}>
          {Object.keys(headers).map((key, index) => {
            return (
              <th scope="col" key={index} style={{ width: headers[key].width, textAlign: headers[key].align, padding: headers[key].padding }}>
                {headers[key].name}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((datum, index) => {
          return (
            <tr style={stylesColumn} key={index} onClick={(event) => handleClickRow && handleClickRow(event, datum)}>
              {Object.keys(headers).map((key, index) => {
                return (
                  <td key={index} style={{ width: headers[key].width, textAlign: headers[key].align, padding: headers[key].padding }}>
                    {headers[key].accessor(datum)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};