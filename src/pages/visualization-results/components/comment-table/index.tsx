import React, { FC, useEffect, useState } from 'react';
import styles from './index.less';
import TableSearch from '@/components/table-search';
import { Button, Input, Select, message, Table, Tag, Modal } from 'antd';
import { useContainer } from '../../result-page/mobx-store';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useRequest } from 'ahooks';
import {
  fetchReviewListByParams,
  CommentListItemType,
} from '@/services/visualization-results/list-menu';
import CommentList from '../side-popup/components/comment-list';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { isArray } from 'lodash';

const { Option } = Select;

interface CommentProps {}
const { Search } = Input;

const CommentTable: FC<CommentProps> = observer((props) => {
  const [keyWord, setKeyWord] = useState<string>('');
  const [layer, setLayer] = useState<number>(0);
  const [type, setType] = useState<number>();
  const [deviceId, setDeviceId] = useState<string>();
  const [filterData, setFilterData] = useState<CommentListItemType[]>();
  const [clickLayer, setClickLayer] = useState<number>();
  const [commentListModalVisible, setCommentListModalVisible] = useState<boolean>(false);
  const store = useContainer();
  const { vState } = store;
  const { checkedProjectIdList } = vState;

  const loadEnumsData = JSON.parse(localStorage.getItem('loadEnumsData') ?? '');

  const findEnumKey = (type: string) => {
    let res: any[] = [];
    if(isArray(loadEnumsData)) {
      loadEnumsData.forEach((l: { key: string; value: { value: number; text: string }[] }) => {
        if (l.key === type) {
          res = l.value.map((e) => {
            return [e.value, e.text];
          });
        }
      });
    }
    return res;
  };

  const layers = new Map<number, string>(findEnumKey('ProjectCommentLayer'));
  const types = new Map<number, string>(findEnumKey('ProjectCommentDevice'));

  const columns: ColumnsType<any> = [
    {
      title: '名称',
      width: 100,
      dataIndex: 'deviceName',
      key: 'type',
      fixed: 'left',
    },

    {
      title: '类型',
      width: 100,
      dataIndex: 'deviceType',
      key: 'type',
      fixed: 'left',
      render: (text) => types.get(text),
    },
    {
      title: '所属图层',
      dataIndex: 'layerType',
      key: 'layer',
      width: 150,
      render: (text) => layers.get(text),
    },
    {
      title: '创建时间',
      dataIndex: 'createdOn',
      key: 'createdOn',
      width: 150,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdateDate',
      key: 'modifiedDate',
      width: 150,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text) =>
        text === 1 ? <Tag color="#87d068">正常</Tag> : <Tag color="#f50">删除</Tag>,
    },
    {
      title: '',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (record) => (
        <Button
          type="primary"
          onClick={() => onClickViewCommentList(record.deviceId, record.layerType)}
        >
          {' '}
          查看
        </Button>
      ),
    },
  ];

  const onClickViewCommentList = (deviceId: string, layerType: number) => {
    setDeviceId(deviceId);
    setClickLayer(layerType);
    setCommentListModalVisible(true);
  };
  /**
   * 获取全部数据
   */
  const { data, loading } = useRequest(
    () =>
      fetchReviewListByParams(
        checkedProjectIdList.map((v) => v.id),
        checkedProjectIdList[0].engineerId,
      ),

    {
      onSuccess: () => {
        console.log(data);

        setFilterData(data);
      },
      onError: () => {
        message.error('获取数据失败');
      },
    },
  );

  const search = () => {
    setFilterData(data?.filter((v) => v.deviceName?.includes(keyWord)));
  };

  const reset = () => {
    setFilterData(data);
    setType(undefined);
    setLayer(0);
  };

  function onSelectLayer(value: number) {
    setLayer(value);
    if (!value && !type) {
      setFilterData(data);
    } else if (type && !value) {
      setFilterData(data?.filter((v) => v.deviceType === type));
    } else if (value && !type) {
      console.log(data);
      setFilterData(data?.filter((v) => v.layerType === value));
    } else {
      setFilterData(data?.filter((v) => v.layerType === value && v.deviceType === type));
    }
  }

  function onSelectType(value: number) {
    setType(value);
    if (!value && !type) {
      setFilterData(data);
    } else if (layer && !value) {
      setFilterData(data?.filter((v) => v.layerType === layer));
    } else if (value && !layer) {
      setFilterData(data?.filter((v) => v.deviceType === value));
    } else {
      setFilterData(data?.filter((v) => v.layerType === layer && v.deviceType === value));
    }
  }
  return (
    <>
      <div className={styles.tableContainer}>
        <div className={classnames(styles.tableFilterbar, 'flex')}>
          <TableSearch className="mr10" label="名称" width="268px">
            <Search
              placeholder="请输入名称"
              value={keyWord}
              onSearch={() => search()}
              onChange={(e) => setKeyWord(e.target.value)}
              enterButton
            />
          </TableSearch>
          <TableSearch className="mr10" label="所属图层" width="178px">
            <Select
              value={layer}
              placeholder="选择图层"
              style={{ width: '100%' }}
              onSelect={onSelectLayer}
            >
              {Array.from(layers.keys()).map((v) => (
                <Option key={v} value={v} children={layers.get(v)} />
              ))}
            </Select>
          </TableSearch>
          <TableSearch className="mr10" width="138px">
            <Select
              value={type}
              placeholder="类型"
              style={{ width: '100%' }}
              onSelect={onSelectType}
            >
              {Array.from(types.keys()).map((v) => (
                <Option key={v} value={v} children={types.get(v)} />
              ))}
            </Select>
          </TableSearch>

          <Button type="primary" onClick={() => reset()}>
            重置
          </Button>
        </div>
        <Table
          bordered
          size="large"
          rowKey="createdOn"
          loading={loading}
          columns={columns}
          scroll={{ x: 1000 }}
          dataSource={filterData}
          sticky
        />
      </div>

      <Modal
        title="评审详细列表"
        centered
        visible={commentListModalVisible}
        onOk={() => setCommentListModalVisible(false)}
        onCancel={() => setCommentListModalVisible(false)}
        width={1500}
      >
        <CommentList
          height={600}
          deviceId={deviceId}
          layer={clickLayer}
          projectId={checkedProjectIdList[0].id}
        />
      </Modal>
    </>
  );
});

export default CommentTable;
