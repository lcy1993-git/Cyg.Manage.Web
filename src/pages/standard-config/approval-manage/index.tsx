import CommonTitle from '@/components/common-title'
import PageCommonWrap from '@/components/page-common-wrap'
import { getResourceLibApprovalList } from '@/services/resource-config/approval'
import { useMount, useRequest } from 'ahooks'
import { Spin, Tabs } from 'antd'
import qs from 'qs'
import React, { useState } from 'react'
import TabTable from './components/tab-table'
import styles from './index.less'

const { TabPane } = Tabs

const ApprovalManage: React.FC = () => {
  const createdBy = qs.parse(window.location.href.split('?')[1]).createdBy as string
  const targetId = qs.parse(window.location.href.split('?')[1]).targetId as string

  const [materialData, setMaterialData] = useState<any[]>([])
  const [componentData, setComponentData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [poleTypeData, setPoleTypeData] = useState<any[]>([])
  const [cableWellData, setCableWellData] = useState<any[]>([])
  const [cableChannelData, setCableChannelData] = useState<any[]>([])

  const { run: getList, loading } = useRequest(
    () => getResourceLibApprovalList({ createdBy, targetId }),
    {
      manual: true,
      onSuccess: (res: any) => {
        // 处理审批列表数据，分离为各种类型的数据数组
        const materialData: any = []
        const componentData: any = []
        const categoryData: any = []
        const poleTypeData: any = []
        const cableWellData: any = []
        const cableChannelData: any = []
        res?.forEach((item: any) => {
          const obj = Object.assign(item, item.data)
          switch (obj.dataType) {
            case 0:
              componentData.push(obj)
              break
            case 1:
              materialData.push(obj)
              break
            case 2:
              poleTypeData.push(obj)
              break
            case 3:
              categoryData.push(obj)
              break
            case 4:
              cableWellData.push(obj)
              break
            case 5:
              cableChannelData.push(obj)
              break
          }
        })
        setMaterialData(materialData)
        setComponentData(componentData)
        setCategoryData(categoryData)
        setPoleTypeData(poleTypeData)
        setCableWellData(cableWellData)
        setCableChannelData(cableChannelData)
      },
    }
  )
  useMount(() => {
    getList()
  })
  return (
    <PageCommonWrap noPadding={true} className={styles.wrap}>
      <Spin spinning={loading}>
        <div className={styles.resourceApproval}>
          <div className={styles.moduleTitle}>
            <CommonTitle>{'资源审批'}</CommonTitle>
          </div>
          <div className={styles.moduleTabs}>
            <Tabs type="card">
              <TabPane tab="物料库" key="material">
                <div className={styles.pannelTable}>
                  <TabTable type="material" tableData={materialData} refresh={getList} />
                </div>
              </TabPane>
              <TabPane tab="组件库" key="component">
                <div className={styles.pannelTable}>
                  <TabTable type="component" tableData={componentData} refresh={getList} />
                </div>
              </TabPane>
              <TabPane tab="分类" key="category">
                <div className={styles.pannelTable}>
                  <TabTable type="category" tableData={categoryData} refresh={getList} />
                </div>
              </TabPane>
              <TabPane tab="杆型" key="pole-type">
                <div className={styles.pannelTable}>
                  <TabTable type="pole-type" tableData={poleTypeData} refresh={getList} />
                </div>
              </TabPane>
              <TabPane tab="电缆井" key="cable-well">
                <div className={styles.pannelTable}>
                  <TabTable type="cable-well" tableData={cableWellData} refresh={getList} />
                </div>
              </TabPane>
              <TabPane tab="电缆通道" key="cable-channel">
                <div className={styles.pannelTable}>
                  <TabTable type="cable-channel" tableData={cableChannelData} refresh={getList} />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Spin>
    </PageCommonWrap>
  )
}

export default ApprovalManage
