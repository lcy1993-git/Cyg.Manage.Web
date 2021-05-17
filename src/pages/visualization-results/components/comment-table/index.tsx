import React, { FC, useState } from 'react';
import styles from './index.less';
import TableSearch from '@/components/table-search';
import { Button, Input, Select, message, Table, Tag, Modal } from 'antd';
import { useContainer } from '../../result-page/mobx-store';
import classnames from 'classnames';
import { useRequest } from 'ahooks';
import {
  fetchCommentListByParams,
  ProjectCommentListItemType,
} from '@/services/visualization-results/list-menu';
import CommentList from '../side-popup/components/comment-list';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { isArray } from 'lodash';
import { fetchCommentList } from '@/services/visualization-results/side-popup';

const { Option } = Select;

interface CommentProps {
  projectId: string;
  engineerId: string;
}
const { Search } = Input;

const CommentTable: FC<CommentProps> = (props) => {
  const { projectId, engineerId } = props;
  const [keyword, setKeyword] = useState<string>();
  const [layerType, setLayerType] = useState<number>();
  const [deviceType, setDeviceType] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1); //为了获取数据编号
  const [projectCommentList, setProjectCommentList] = useState<ProjectCommentListItemType[]>();
  const [clickItemIsDelete, setIsItemDelete] = useState<boolean>(false); //用来表示是否被点击的item状态是否被删除
  const [commentListModalVisible, setCommentListModalVisible] = useState<boolean>(false);

  const loadEnumsData = JSON.parse(localStorage.getItem('loadEnumsData') ?? '');

  /**
   * 获取枚举值
   * @param type
   * @returns
   */
  const findEnumKey = (type: string) => {
    let res: any[] = [];
    if (isArray(loadEnumsData)) {
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
      title: '序号',
      width: 30,
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      render: (text, record, idx: number) => (currentPage - 1) * 10 + idx + 1,
    },

    {
      title: '类型',
      width: 30,
      dataIndex: 'deviceType',
      key: 'type',
      fixed: 'left',
      render: (text) => types.get(text),
    },
    {
      title: '所属图层',
      dataIndex: 'layerType',
      key: 'layer',
      width: 30,
      render: (text) => layers.get(text),
    },
    {
      title: '名称',
      width: 50,
      dataIndex: 'deviceName',
      key: 'type',
      fixed: 'left',
    },
    {
      title: '创建时间',
      dataIndex: 'createdOn',
      key: 'createdOn',
      width: 50,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdateDate',
      key: 'modifiedDate',
      width: 50,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 30,
      render: (text) =>
        text === 1 ? <Tag color="#87d068">正常</Tag> : <Tag color="#f50">删除</Tag>,
    },
    {
      title: '',
      key: 'operation',
      fixed: 'right',
      width: 30,
      render: (record) => (
        <Button
          type="primary"
          onClick={() =>
            onClickViewCommentList(record.deviceId, record.layerType, record.status !== 1)
          }
        >
          查看
        </Button>
      ),
    },
  ];

  const {
    data: commentListResponseData,
    run: fetchCommentRequest,
    loading: fetchCommentListloading,
  } = useRequest(fetchCommentList, {
    manual: true,
    onError: () => {
      message.error('获取审阅失败');
    },
  });
  /**
   * 查看某个设备的评审记录
   * @param deviceId
   * @param layerType
   */
  const onClickViewCommentList = (deviceId: string, layerType: number, isDelete: boolean) => {
    setIsItemDelete(isDelete);
    fetchCommentRequest({ projectId: projectId, layer: layerType, deviceId });
    setCommentListModalVisible(true);
  };
  /**
   * 获取全部数据
   */
  const {
    data: projectCommentListResponseData,
    run: fetchProjectCommentListRquest,
    loading: fetchProjectCommentListLoading,
  } = useRequest(
    (keyword?: string) =>
      fetchCommentListByParams({
        engineerId: engineerId,
        projectIds: [projectId],
        layerTypes: layerType ? [layerType] : undefined,
        deviceType,
        deviceName: keyword,
      }),

    {
      refreshDeps: [layerType, deviceType, engineerId, projectId],
      onSuccess: () => {
        if (projectCommentListResponseData) {
          setProjectCommentList(projectCommentListResponseData);
        } else {
          message.warn('没有数据');
        }
      },
      onError: () => {
        message.error('获取数据失败');
      },
    },
  );

  const search = () => {
    fetchProjectCommentListRquest(keyword);
  };

  const reset = () => {
    setDeviceType(undefined);
    setLayerType(undefined);
    setKeyword(undefined);

    fetchProjectCommentListRquest();
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pagination = {
    current: currentPage,
    onChange: onPageChange,
    pageSize: 10,
  };
  return (
    <>
      <div className={styles.tableContainer}>
        <div className={classnames(styles.tableFilterbar, 'flex')}>
          <TableSearch className="mr10" label="名称" width="268px">
            <Search
              placeholder="请输入名称"
              value={keyword}
              onSearch={() => search()}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              enterButton
            />
          </TableSearch>
          <TableSearch className="mr10" label="所属图层" width="178px">
            <Select
              value={layerType}
              placeholder="选择图层"
              style={{ width: '100%' }}
              onSelect={(value) => setLayerType(value)}
            >
              {Array.from(layers.keys()).map((v) => (
                <Option key={v} value={v} children={layers.get(v)} />
              ))}
            </Select>
          </TableSearch>
          <TableSearch className="mr10" width="138px">
            <Select
              value={deviceType}
              placeholder="类型"
              style={{ width: '100%' }}
              onSelect={(value) => setDeviceType(value)}
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
          size="middle"
          rowKey="createdOn"
          pagination={{ ...pagination }}
          loading={fetchProjectCommentListLoading}
          columns={columns}
          scroll={{ x: 1000 }}
          dataSource={projectCommentList}
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
          isDelete={clickItemIsDelete}
          commentList={commentListResponseData}
          loading={fetchCommentListloading}
          height={600}
        />
      </Modal>
    </>
  );
};

export default CommentTable;
