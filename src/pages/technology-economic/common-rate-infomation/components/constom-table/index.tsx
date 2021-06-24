
import { useMemo, useEffect } from 'react';
import { useRequest } from 'ahooks';
import { Table, TableProps } from 'antd';
import { api, formatData} from './utils'; 

import styles from './index.less';

interface nextTableData {
  nextColumns: any[];
  nextDataSource: any[];
}

interface Props extends TableProps<any> {
  headTitle: string;
  nextTable?: false | nextTableData;
  type: string;
} 

const ConstomTable: React.FC<Props> = (props) => {
  const {
    headTitle,
    nextTable=false,
    type,
    ...rest
  } = props;

  const { data, run } = useRequest( api[type], {manual: true})

  useEffect(() => {
    run(type)
  }, [type])

  const {columns, dataSource} = useMemo(() => {
    return formatData(data)
  }, [JSON.stringify(data)])

  return (
    <div className={`${styles.constomTableWrap} ${nextTable ? styles.nextTable : ""}`}>
      <div className={styles.title}>{headTitle}</div>
      <Table
        showHeader={false}
        columns={columns}
        dataSource={dataSource}
        {...rest}
      />
      {
        nextTable ?
        <Table
          showHeader={false}
          columns={(nextTable as nextTableData).nextColumns}
          dataSource={(nextTable as nextTableData).nextDataSource}
        /> : null
      }
    </div>
  );
}

export default ConstomTable;