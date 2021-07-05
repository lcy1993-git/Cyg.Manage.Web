
import { useMemo, useEffect } from 'react';
import { useRequest } from 'ahooks';
import { Table, TableProps } from 'antd';
import { api, formatData} from './utils'; 

import styles from './index.less';


interface Props extends TableProps<any> {
  headTitle: React.ReactNode;
  nextTable?: boolean;
  columns?: any[],
  dataSource?: any[];
  nextColumns?: any[];
  nextDataSource?: any[];
  nextTableRest?: any;
} 

const ConstomTable: React.FC<Props> = (props) => {
  const {
    headTitle,
    nextTable=false,
    columns,
    dataSource,
    nextColumns=[],
    nextDataSource=[],
    nextTableRest,
    ...rest
  } = props;

  return (
    <div className={`${styles.constomTableWrap} ${nextTable ? styles.nextTable : ""}`}>
      <div className={styles.title}>{headTitle}</div>
      <Table
        bordered
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        {...rest}
      />
      {
        nextTable ?
        <Table
          bordered
          pagination={false}
          showHeader={false}
          columns={nextColumns}
          dataSource={nextDataSource}
          {...nextTableRest}
        /> : null
      }
    </div>
  );
}

export default ConstomTable;