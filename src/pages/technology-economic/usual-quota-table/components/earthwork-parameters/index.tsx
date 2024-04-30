import { baseUrl } from '@/services/common'
import {
  getAllEarthworkMargins,
  getAllEarthWorks,
  GetAllEarthworkSlopeCoefficients,
} from '@/services/technology-economic/usual-quota-table'
import { getObject, handleGetUrl } from '@/utils/utils'
import { Table, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './index.less'

const { TabPane } = Tabs

interface Props {
  id: string
}

interface AttritionRateRow {
  commonlyTableId: string
  transferType: string
  materialType: string
  lossRateFormula: string
  packageRate: number
  picPath: string
}

const EarthworkParameters: React.FC<Props> = (props) => {
  const { id } = props
  const [dataSource, setDataSource] = useState<AttritionRateRow[]>([])
  const [dataSource1, setDataSource1] = useState<AttritionRateRow[]>([])
  const [dataSource2, setDataSource2] = useState<AttritionRateRow[]>([])
  const getTableData = async () => {
    if (!id) return
    let res = await getAllEarthWorks(id) //获取所有的土方参数
    let res1 = await getAllEarthworkMargins(id) //获取所有的挖方裕度
    let res2 = await GetAllEarthworkSlopeCoefficients(id) //获取所有的放坡系数
    setDataSource(res)
    setDataSource1(res1)
    setDataSource2(res2)
  }

  const requestHost = localStorage.getItem('requestHost')
  const currentHost =
    requestHost && requestHost !== 'undefined' ? requestHost : `http://${window.location.host}/api`

  const handleUrl = `${baseUrl.upload}/Download/GetFileById`

  // let targetUrl = handleSM2Crypto(`http://172.2.48.22${handleUrl}`)

  const finalUrl = `${currentHost}/commonGet`

  const downImage = (row: AttritionRateRow) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', `${finalUrl}${handleGetUrl({ fileId: row.picPath }, handleUrl)}`, true) // 也可以使用POST方式，根据接口
    xhr.responseType = 'blob' // 返回类型blob
    xhr.setRequestHeader('Authorization', localStorage.getItem('Authorization') as string)
    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    // @ts-ignore
    xhr.onload = function (e) {
      // 请求完成
      if (this.status === 200) {
        // 返回200
        // @ts-ignore
        var res = e.target.response
        let blob = new Blob([res], { type: 'image/png' })
        const newPic = dataSource.map((item) => {
          // @ts-ignore
          if (item.id === row.id) {
            item.picPath = window.URL.createObjectURL(blob)
          }
          return item
        })
        setDataSource(newPic)
        return window.URL.createObjectURL(blob)
      }
    }
    xhr.send()
  }
  useEffect(() => {
    dataSource.map((item) => {
      downImage(item)
      return item
    })
  }, [dataSource1])
  useEffect(() => {
    getTableData()
  }, [id])
  return (
    <div className={styles.topographicIncreaseFactor}>
      <Tabs defaultActiveKey="1" size={'small'}>
        <TabPane tab="土方参数" {...getObject('1')}>
          <Table
            pagination={false}
            scroll={{ y: 720 }}
            bordered
            size={'small'}
            rowKey={'id'}
            dataSource={dataSource}
            columns={[
              {
                title: '序号',
                width: 80,
                dataIndex: 'no',
              },
              {
                title: '图形',
                dataIndex: 'name',

                width: 400,
                render: (text: string, record: any) => {
                  return (
                    record.picPath?.includes('blob') && (
                      <img src={record.picPath} alt={text} width={350} />
                    )
                  )
                },
              },
              {
                title: '土方类型',
                dataIndex: 'earthworkTypeText',
              },

              {
                title: '默认计算式',
                dataIndex: 'formula',
              },
              {
                title: '参数名称',
                dataIndex: 'commonlyTableEarthworkParams',

                render: (text: string, record: any) => {
                  return (
                    // @ts-ignore
                    <table border="1" style={{ borderColor: '#fafafa' }}>
                      <tbody>
                        {record.commonlyTableEarthworkParams.map((item: any) => {
                          return (
                            <tr key={item.id}>
                              <td>{item.paramName}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )
                },
              },
              {
                title: '参数值',
                dataIndex: 'commonlyTableEarthworkParams',

                render: (text: string, record: any) => {
                  return (
                    // @ts-ignore
                    <table border="1" style={{ borderColor: '#fafafa' }}>
                      <tbody>
                        {record.commonlyTableEarthworkParams.map((item: any) => {
                          return (
                            <tr key={item.id}>
                              <td>{item.defaultValue}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )
                },
              },
              {
                title: '说明',
                dataIndex: 'commonlyTableEarthworkParams',

                render: (text: string, record: any) => {
                  return (
                    // @ts-ignore
                    <table border="1" style={{ borderColor: '#fafafa' }}>
                      <tbody>
                        {record.commonlyTableEarthworkParams.map((item: any) => {
                          return (
                            <tr key={item.id}>
                              <td>{item.remark}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )
                },
              },
              {
                title: '图片',
                dataIndex: 'name',

                width: 200,
              },
            ]}
          />
          <br />
        </TabPane>
        <TabPane tab="挖方裕度" {...getObject('2')}>
          <div style={{ width: '500px', margin: '10px' }}>
            <Table
              pagination={false}
              bordered
              size={'small'}
              rowKey={'id'}
              dataSource={dataSource1}
              columns={[
                {
                  title: '基础材料',
                  width: 200,
                  dataIndex: 'earthworkMaterialTypeText',
                },
                {
                  title: '每边操作裕度',
                  width: 250,
                  dataIndex: 'marginValue',
                },
              ]}
            />
          </div>
        </TabPane>
        <TabPane tab="放坡系数" {...getObject('3')}>
          <Table
            pagination={false}
            scroll={{ y: 698 }}
            bordered
            size={'small'}
            rowKey={'id'}
            dataSource={dataSource2}
            columns={[
              {
                title: '土质',
                width: 200,
                dataIndex: 'soilQualityTypeText',
              },
              {
                title: '上限值',
                dataIndex: 'maxHeight',
              },
              {
                title: '下限值',
                dataIndex: 'minHeight',
              },
              {
                title: '边坡系数',
                dataIndex: 'slopeCoefficient',
              },
              {
                title: '挖土方式',
                dataIndex: 'diggingTypeText',
              },
              {
                title: '专业属性',
                dataIndex: 'professionalPropertyText',
              },
            ]}
          />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default EarthworkParameters
