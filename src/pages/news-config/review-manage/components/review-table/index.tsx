import React, { FC, useState } from 'react';
import styles from './index.less';
import TableSearch from '@/components/table-search';
import { Button, Input, DatePicker, Select, message, Table } from 'antd';
import { useContainer } from '../../store';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useRequest } from 'ahooks';
import { ReviewListParams, fetchReviewList } from '@/services/news-config/review-manage';

import { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const columns: ColumnsType<any> = [
  {
    title: '序号',
    width: 100,
    dataIndex: 'index',
    key: 'index',
    fixed: 'left',
  },
  {
    title: '类型',
    width: 100,
    dataIndex: 'type',
    key: 'type',
    fixed: 'left',
  },
  {
    title: '所属图层',
    dataIndex: 'layer',
    key: 'layer',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createdOn',
    key: 'createdOn',
    width: 150,
  },
  {
    title: '更新时间',
    dataIndex: 'modifiedDate',
    key: 'modifiedDate',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 150,
  },
  {
    title: '',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => <Button type="primary"> 查看</Button>,
  },
];

const layers = ['勘察图层', '方案图层', '设计图层', '拆除图层'];
interface ReviewProps {}
const { Search } = Input;
const ReviewTable: FC<ReviewProps> = observer((props) => {
  const [keyWord, setKeyWord] = useState<string>('');
  const [layer, setLayer] = useState<string>('');
  const [type, setType] = useState<string>('');
  const store = useContainer();
  const { vState } = store;
  const { projectId } = vState;

  /**
   * 获取全部数据
   */
  // const { data, run, loading } = useRequest(
  //   () =>
  //     fetchReviewList({
  //       id: projectId ?? '',
  //       type,
  //       layer,
  //     }),

  //   {
  //     manual: true,
  //     onSuccess: () => {},
  //     onError: () => {
  //       message.error('获取数据失败');
  //     },
  //   },
  // );

  const search = () => {
    const condition = {
      keyWord,
      layer,
      type,
    };
  };

  function onSelectLayer(value: string | number) {
    setLayer(value as string);
    search();
  }

  function onSelectType(value: string | number) {
    setType(value as string);
    search();
  }
  return (
    <div className={styles.tableContainer}>
      <div className={classnames(styles.tableFilterbar, 'flex')}>
        <TableSearch className="mr10" label="项目名称" width="268px">
          <Search
            placeholder="请输入项目名称"
            value={keyWord}
            onSearch={() => search()}
            onChange={(e) => setKeyWord(e.target.value)}
            enterButton
          />
        </TableSearch>
        <TableSearch className="mr10" label="所属图层" width="178px">
          <Select placeholder="选择图层" style={{ width: '100%' }} onSelect={onSelectLayer}>
            {layers.map((v: string, idx: number) => (
              <Option key={v} value={v} children={v} />
            ))}
          </Select>
        </TableSearch>
        <TableSearch className="mr10" width="138px">
          <Select placeholder="类型" style={{ width: '100%' }} onSelect={onSelectType}>
            {layers.map((v: string, idx: number) => (
              <Option key={v} value={v} children={v} />
            ))}
          </Select>
        </TableSearch>
      </div>
      <Table size="middle" columns={columns} scroll={{ x: 1500 }} sticky />
    </div>
  );
});

export default ReviewTable;
