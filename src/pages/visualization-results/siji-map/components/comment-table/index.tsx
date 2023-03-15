import React, { FC, useState } from 'react'
import styles from './index.less'
import TableSearch from '@/components/table-search'
import { Button, Input, Select, message, Table, Tag, Modal } from 'antd'
import classnames from 'classnames'
import { useRequest } from 'ahooks'
import {
  fetchCommentListByParams,
  ProjectCommentListItemType,
} from '@/services/visualization-results/list-menu'
import CommentList from '../side-popup/components/comment-list'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { findEnumKeyByType } from '../../../utils/loadEnum'
import { fetchCommentList } from '@/services/visualization-results/side-popup'

const { Option } = Select

interface CommentProps {
  projectIds: string[]
}

const { Search } = Input

const CommentTable: FC<CommentProps> = (props) => {
  const { projectIds } = props
  const [keyword, setKeyword] = useState<string>()
  const [layerType, setLayerType] = useState<number>()
  const [deviceType, setDeviceType] = useState<number>()
  const [currentPage, setCurrentPage] = useState<number>(1) //为了获取数据编号
  const [pageSize, setPageSize] = useState<number>(10)
  const [projectCommentList, setProjectCommentList] = useState<ProjectCommentListItemType[]>()
  const [clickItemIsDelete, setIsItemDelete] = useState<boolean>(false) //用来表示被点击的item状态是否被删除
  const [commentListModalVisible, setCommentListModalVisible] = useState<boolean>(false)
  const layers = new Map<number, string>(findEnumKeyByType('ProjectCommentLayer'))
  const types = new Map<number, string>(findEnumKeyByType('ProjectCommentDevice'))

  const columns: ColumnsType<ProjectCommentListItemType> = [
    {
      title: '序号',
      width: 10,
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      fixed: 'left',
      render: (text, record, idx: number) => (currentPage - 1) * 10 + idx + 1,
    },
    {
      title: '项目',
      width: 50,
      dataIndex: 'projectName',
      key: 'projectName',
      fixed: 'left',
    },
    {
      title: '名称',
      width: 50,
      dataIndex: 'deviceName',
      key: 'type',
      fixed: 'left',
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
      title: '创建时间',
      dataIndex: 'createdOn',
      key: 'createdOn',
      width: 40,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdateDate',
      key: 'modifiedDate',
      width: 40,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 20,
      render: (text) =>
        text === 1 ? <Tag color="#87d068">正常</Tag> : <Tag color="#f50">删除</Tag>,
    },
    {
      title: '',
      key: 'operation',
      align: 'center',
      width: 20,
      render: (record) => (
        <Button
          type="primary"
          onClick={() =>
            onClickViewCommentList(
              record.projectId,
              record.deviceId,
              record.layerType,
              record.status !== 1
            )
          }
        >
          查看
        </Button>
      ),
    },
  ]
  const onPageChange = (page: number, currentSize: number | undefined) => {
    if (currentSize && currentSize !== pageSize) {
      setPageSize(currentSize)
    }
    setCurrentPage(page)
  }
  /**
   * 查看某个设备的评审记录
   * @param deviceId
   * @param layerType
   */
  const onClickViewCommentList = (
    projectId: string,
    deviceId: string,
    layerType: number,
    isDelete: boolean
  ) => {
    setIsItemDelete(isDelete)
    fetchCommentListRequest({ projectId, layer: layerType, deviceId })
    setCommentListModalVisible(true)
  }

  const search = () => {
    fetchProjectCommentListRquest(keyword)
  }

  const reset = () => {
    setDeviceType(undefined)
    setLayerType(undefined)
    setKeyword(undefined)
    fetchProjectCommentListRquest()
  }

  const pagination = {
    current: currentPage,
    onChange: onPageChange,
    pageSize: 10,
  }

  const {
    data: commentListResponseData,
    run: fetchCommentListRequest,
    loading: fetchCommentListloading,
  } = useRequest(fetchCommentList, {
    manual: true,
    onError: () => {
      message.error('获取审阅失败')
    },
  })

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
        projectIds,
        layerTypes: layerType ? [layerType] : undefined,
        deviceType,
        deviceName: keyword,
      }),

    {
      refreshDeps: [layerType, deviceType, JSON.stringify(projectIds)],
      onSuccess: () => {
        if (projectCommentListResponseData) {
          setProjectCommentList(projectCommentListResponseData)
        } else {
          message.warn('没有数据')
        }
      },
      onError: () => {
        message.error('获取数据失败')
      },
    }
  )

  return (
    <>
      <div className={styles.commentTable}>
        <div className={classnames(styles.tableFilterbar, 'flex')}>
          <TableSearch className="mr10" label="名称" width="268px">
            <Search
              placeholder="请搜索名称"
              value={keyword}
              onSearch={() => search()}
              onChange={(e) => {
                setKeyword(e.target.value)
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
              {Array.from(types.keys())
                .filter((v) => types.get(v) !== '下户')
                .map((v) => (
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
          pagination={{
            current: currentPage,
            onChange: onPageChange,
            pageSize,
            total: projectCommentList?.length,
          }}
          loading={fetchProjectCommentListLoading}
          columns={columns}
          scroll={{ x: 1000 }}
          dataSource={projectCommentList}
          sticky
        />
      </div>

      <Modal
        title="审阅列表"
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
  )
}

export default CommentTable
