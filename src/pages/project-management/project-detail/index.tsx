import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import { exportConstructEffect } from '@/services/project-management/project-detail'
import { useUpdateEffect } from 'ahooks'
import { Button, Input, message, Spin } from 'antd'
import React, { useRef, useState } from 'react'
import ScreenModal from '../all-project/components/screen-modal'
import { initSearchParams } from '../my-work/components/engineer-table-wrapper'
import styles from './index.less'

const { Search } = Input

const ProjectDetail: React.FC<any> = () => {
  // 筛选
  const [screenModalVisible, setScreenModalVisible] = useState(false)
  const [keyWord, setKeyWord] = useState<string>('')
  const [searchParams, setSearchParams] = useState(initSearchParams)
  const tableRef = useRef<HTMLDivElement>(null)
  const [spinning, setSpinning] = useState<boolean>(false)

  const screenClickEvent = (params: any) => {
    setSearchParams({ ...params, keyWord })
  }

  const searchEvent = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        ...searchParams,
        keyWord,
      })
    }
  }

  useUpdateEffect(() => {
    searchEvent()
  }, [searchParams])

  const columns: any = [
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
      width: 50,
      fixed: 'left',
      align: 'center',
      render: (text: string, record: any, index: number) => {
        return <span>{index + 1}</span>
      },
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '估算投资(万元)',
      dataIndex: 'col1',
      key: 'col1',
      width: 120,
      fixed: 'left',
      align: 'center',
    },

    {
      title: '10千伏线路',
      children: [
        {
          title: '合计',
          dataIndex: 'col2',
          key: 'col2',
          width: 100,
          // fixed: 'left',
          align: 'center',
        },
        {
          title: '架空线路',
          children: [
            {
              title: '新建架空线路长度(km)',
              dataIndex: 'col2_1_1',
              key: 'col2_1_1',
              width: 100,
              align: 'center',
            },
            {
              title: '导线型号',
              dataIndex: 'col2_1_2',
              key: 'col2_1_2',
              width: 150,
              align: 'center',
            },
            {
              title: '改造架空线路长度(km)',
              dataIndex: 'col2_1_3',
              key: 'col2_1_3',
              width: 100,
              align: 'center',
            },
            {
              title: '导线型号',
              dataIndex: 'col2_1_4',
              key: 'col2_1_4',
              width: 100,
              align: 'center',
            },
          ],
        },
        {
          title: '电缆线路',
          children: [
            {
              title: '新建电缆线路长度(km)',
              dataIndex: 'col2_2_1',
              key: 'col2_2_1',
              width: 100,
              align: 'center',
            },
            {
              title: '电缆型号',
              dataIndex: 'col2_2_2',
              key: 'col2_2_2',
              width: 100,
              align: 'center',
            },
            {
              title: '改造电缆线路长度(km)',
              dataIndex: 'col2_2_3',
              key: 'col2_2_3',
              width: 100,
              align: 'center',
            },
            {
              title: '电缆型号',
              dataIndex: 'col2_2_4',
              key: 'col2_2_4',
              width: 100,
              align: 'center',
            },
          ],
        },
      ],
    },
    {
      title: '电缆管线',
      children: [
        {
          title: '合计',
          dataIndex: 'col3_1',
          key: 'col3_1',
          width: 80,
          align: 'center',
        },
        {
          title: '新建长度(km)',
          dataIndex: 'col3_2',
          key: 'col3_2',
          width: 100,
          align: 'center',
        },
      ],
    },
    {
      title: '站房设备(开关类)',
      children: [
        {
          title: '新建开闭站(座)',
          dataIndex: 'col4_1',
          key: 'col4_1',
          width: 80,
          align: 'center',
        },
        {
          title: '新建环网柜(座)',
          dataIndex: 'col4_2',
          key: 'col4_2',
          width: 100,
          align: 'center',
        },
      ],
    },
    {
      title: '配变设备',
      children: [
        {
          title: '合计台数(台)',
          dataIndex: 'col5_1',
          key: 'col5_1',
          width: 80,
          align: 'center',
        },
        {
          title: '合计容量(kVA)',
          dataIndex: 'col5_2',
          key: 'col5_2',
          width: 80,
          align: 'center',
        },
        {
          title: '柱上变压器',
          children: [
            {
              title: '新建柱上配变(台)',
              dataIndex: 'col5_1_1',
              key: 'col5_1_1',
              width: 100,
              align: 'center',
            },
            {
              title: '容量',
              dataIndex: 'col5_1_2',
              key: 'col5_1_2',
              width: 100,
              align: 'center',
            },
            {
              title: '改造柱上配变(台)',
              dataIndex: 'col5_1_3',
              key: 'col5_1_3',
              width: 100,
              align: 'center',
            },
            {
              title: '容量',
              dataIndex: 'col5_1_4',
              key: 'col5_1_4',
              width: 100,
              align: 'center',
            },
          ],
        },
        {
          title: '箱式变压器',
          children: [
            {
              title: '新建箱变(台)',
              dataIndex: 'col5_2_1',
              key: 'col5_2_1',
              width: 100,
              align: 'center',
            },
            {
              title: '容量',
              dataIndex: 'col5_2_2',
              key: 'col5_2_2',
              width: 100,
              align: 'center',
            },
            {
              title: '改造箱变(台)',
              dataIndex: 'col5_2_3',
              key: 'col5_2_3',
              width: 100,
              align: 'center',
            },
            {
              title: '容量',
              dataIndex: 'col5_2_4',
              key: 'col5_2_4',
              width: 100,
              align: 'center',
            },
          ],
        },
      ],
    },
    {
      title: '0.4千伏线路',
      children: [
        {
          title: '合计',
          dataIndex: 'col6',
          key: 'col6',
          width: 80,
          align: 'center',
        },

        {
          title: '架空线路',
          children: [
            {
              title: '新建架空线路长度(km)',
              dataIndex: 'col6_1_1',
              key: 'col6_1_1',
              width: 100,
              align: 'center',
            },
            {
              title: '导线型号',
              dataIndex: 'col6_1_2',
              key: 'col6_1_2',
              width: 100,
              align: 'center',
            },
            {
              title: '改造架空线路长度(km)',
              dataIndex: 'col6_1_3',
              key: 'col6_1_3',
              width: 100,
              align: 'center',
            },
            {
              title: '导线型号',
              dataIndex: 'col6_1_4',
              key: 'col6_1_4',
              width: 100,
              align: 'center',
            },
          ],
        },
        {
          title: '电缆线路',
          children: [
            {
              title: '新建电缆线路(km)',
              dataIndex: 'col6_2_1',
              key: 'col6_2_1',
              width: 100,
              align: 'center',
            },
            {
              title: '电缆型号',
              dataIndex: 'col6_2_2',
              key: 'col6_2_2',
              width: 100,
              align: 'center',
            },
            {
              title: '改造电缆线路(km)',
              dataIndex: 'col6_2_3',
              key: 'col6_2_3',
              width: 100,
              align: 'center',
            },
            {
              title: '电缆型号',
              dataIndex: 'col6_2_4',
              key: 'col6_2_4',
              width: 100,
              align: 'center',
            },
          ],
        },
      ],
    },
    {
      title: '接户线',
      children: [
        {
          title: '接户线(km)',
          dataIndex: 'col7',
          key: 'col7',
          width: 80,
          align: 'center',
        },
      ],
    },
    {
      title: '10千伏断路器',
      children: [
        {
          title: '合计',
          dataIndex: 'col8',
          key: 'col8',
          width: 80,
          align: 'center',
        },
        {
          title: '开关(新建)',
          dataIndex: 'col8_1',
          key: 'col8_1',
          width: 80,
          align: 'center',
        },
        {
          title: '开关(改造)',
          dataIndex: 'col8_2',
          key: 'col8_2',
          width: 80,
          align: 'center',
        },
        {
          title: '开关类型(包含新建和改造)',
          children: [
            {
              title: '联络开关(台)',
              // dataIndex: 'col2_1_1',
              // key: 'col2_1_1',
              width: 100,
              align: 'center',
            },
            {
              title: '分段开关(台)',
              // dataIndex: 'col2_1_2',
              // key: 'col2_1_2',
              width: 100,
              align: 'center',
            },
            {
              title: '分支开关(台)',
              // dataIndex: 'col2_1_3',
              // key: 'col2_1_3',
              width: 100,
              align: 'center',
            },
          ],
        },
      ],
    },
    {
      title: '户表改造',
      children: [
        {
          title: '电能表箱(只)',
          dataIndex: 'col9',
          key: 'col9',
          width: 80,
          align: 'center',
        },
        {
          title: '涉及电能表迁改户数(户)',
          // dataIndex: 'col3_2',
          // key: 'col3_2',
          width: 100,
          align: 'center',
        },
      ],
    },
    {
      title: '竣工阶段',
      children: [
        {
          title: '竣工图绘制开始日期',
          dataIndex: 'col10_1',
          key: 'col10_1',
          width: 150,
          align: 'center',
        },
        {
          title: '竣工图绘制人员',
          dataIndex: 'col10_2',
          key: 'col10_2',
          width: 120,
          align: 'center',
        },
        {
          title: '竣工图计划绘制完成日期',
          dataIndex: 'col10_3',
          key: 'col10_3',
          width: 160,
          align: 'center',
        },
      ],
    },
    {
      title: '对应县区名称',
      dataIndex: 'areaName',
      key: 'areaName',
      width: 120,
      align: 'center',
    },
  ]

  const exportEvent = async () => {
    try {
      setSpinning(true)
      //@ts-ignore
      const pageSize = tableRef.current.pageSize
      //@ts-ignore
      const currentPage = tableRef.current.currentPage
      const res = await exportConstructEffect({
        ...searchParams,
        pageSize: pageSize,
        pageIndex: currentPage,
      })
      let blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=utf-8',
      })
      let finalyFileName = `项目明细表.xlsx`
      // for IE
      //@ts-ignore
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //@ts-ignore
        window.navigator.msSaveOrOpenBlob(blob, finalyFileName)
      } else {
        // for Non-IE
        let objectUrl = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = objectUrl
        link.setAttribute('download', finalyFileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(link.href)
      }
      setSpinning(false)
      message.success('导出成功')
    } catch (err) {
      console.log(err)
    } finally {
      setSpinning(false)
    }
  }

  return (
    <PageCommonWrap>
      <Spin spinning={spinning} tip="导出中...">
        <div className={styles.filter}>
          <div className="flex">
            <Search
              placeholder="请输入工程/项目名称/项目编码"
              enterButton
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              onSearch={() => searchEvent()}
              style={{ width: '280px' }}
              className="mr22"
            />
            <Button onClick={() => setScreenModalVisible(true)}>筛选</Button>
          </div>
          <Button type="primary" onClick={() => exportEvent()}>
            导出
          </Button>
        </div>
        <div className={styles.tableTitle}>
          10千伏及以下配电网工程项目明细及建设成效明细表（按照项目包、单体工程统计）
        </div>
        <div>
          <GeneralTable
            rowKey="id"
            notShowSelect
            ref={tableRef}
            columns={columns}
            url="/ProjectDesignData/GetConstructEffect"
            scroll={{ x: 3000, y: 'calc(100vh - 600px)' }}
            extractParams={{ ...searchParams, keyWord }}
          />
        </div>

        <ScreenModal
          visible={screenModalVisible}
          onChange={setScreenModalVisible}
          finishEvent={screenClickEvent}
          searchParams={searchParams}
        />
      </Spin>
    </PageCommonWrap>
  )
}

export default ProjectDetail
