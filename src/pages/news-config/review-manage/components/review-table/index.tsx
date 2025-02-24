import React, { FC, useEffect, useState } from 'react'
import styles from './index.less'
import TableSearch from '@/components/table-search'
import { Button, Input, Select, message, Table, Tag } from 'antd'
import { useContainer } from '../../store'
import classnames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useRequest } from 'ahooks'
import { fetchReviewList, ReviewListItemType } from '@/services/news-config/review-manage'

import { ColumnsType } from 'antd/es/table'
import moment from 'moment'

const { Option } = Select

interface ReviewProps {}
const { Search } = Input

const ReviewTable: FC<ReviewProps> = observer(() => {
  const [keyWord, setKeyWord] = useState<string>('')
  const [layer, setLayer] = useState<number>()
  const [type, setType] = useState<number>()
  const [filterData, setFilterData] = useState<ReviewListItemType[]>()
  const store = useContainer()
  const { vState } = store
  const { projectInfo } = vState

  const loadEnumsData = JSON.parse(localStorage.getItem('loadEnumsData') ?? '')

  const findEnumKey = (type: string) => {
    let res

    loadEnumsData.forEach((l: { key: string; value: { value: number; text: string }[] }) => {
      if (l.key === type) {
        res = l.value.map((e) => {
          return [e.value, e.text]
        })
      }
    })

    return res
  }
  const layers = new Map<number, string>(findEnumKey('ProjectCommentLayer'))
  const types = new Map<number, string>(findEnumKey('ProjectCommentDevice'))
  const columns: ColumnsType<any> = [
    {
      title: '名称',
      width: 100,
      dataIndex: 'deviceName',

      fixed: 'left',
    },

    {
      title: '类型',
      width: 100,
      dataIndex: 'deviceType',

      fixed: 'left',
      render: (text) => types.get(text),
    },
    {
      title: '所属图层',
      dataIndex: 'layerType',

      width: 150,
      render: (text) => layers.get(text),
    },
    {
      title: '创建时间',
      dataIndex: 'createdOn',

      width: 150,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdateDate',

      width: 150,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'status',

      width: 150,
      render: (text) =>
        text === 1 ? <Tag color="#87d068">正常</Tag> : <Tag color="#f50">删除</Tag>,
    },
    {
      title: '',

      fixed: 'right',
      width: 100,
      render: () => <Button type="primary"> 查看</Button>,
    },
  ]
  /**
   * 获取全部数据
   */
  const { data } = useRequest(
    () =>
      fetchReviewList({
        projectIds: [projectInfo?.projectId ?? ''],
        engineerId: projectInfo?.engineerId,
      }),

    {
      refreshDeps: [projectInfo],
      onSuccess: () => {
        setFilterData(data)
      },
      onError: () => {
        message.error('获取数据失败')
      },
    }
  )

  useEffect(() => {
    setLayer(undefined)
    setType(undefined)
  }, [projectInfo])

  const search = () => {
    setFilterData(data?.filter((v) => v.deviceName?.includes(keyWord)))
  }

  const reset = () => {
    setFilterData(data)
    setType(undefined)
    setLayer(undefined)
  }

  function onSelectLayer(value: number) {
    setLayer(value)
    if (value) {
      setFilterData(data?.filter((v) => v.layerType === value))
    } else {
      if (type) {
        setFilterData(data?.filter((v) => v.deviceType === type))
      } else {
        setFilterData(data)
      }
    }
  }

  function onSelectType(value: number) {
    setType(value)
    if (value) {
      setFilterData(data?.filter((v) => v.deviceType === value))
    } else {
      if (layer) {
        setFilterData(data?.filter((v) => v.layerType === layer))
      } else {
        setFilterData(data)
      }
    }
  }
  return (
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
          <Select value={type} placeholder="类型" style={{ width: '100%' }} onSelect={onSelectType}>
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
        columns={columns}
        scroll={{ x: 1500 }}
        dataSource={filterData}
        sticky
      />
    </div>
  )
})

export default ReviewTable
