import React, {useEffect, useState} from "react";
import styles from './index.less'
import {getAllEarthworkMargins, getAllEarthWorks, GetAllEarthworkSlopeCoefficients} from "@/services/technology-economic/usual-quota-table";
import {Table} from "antd";
import {Tabs} from 'antd';

const {TabPane} = Tabs;

interface Props {
  id: string
}

interface AttritionRateRow {
  "commonlyTableId": string
  "transferType": string
  "materialType": string
  "lossRateFormula": string
  "packageRate": number
}

const EarthworkParameters: React.FC<Props> = (props) => {
  const {id} = props
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

  const columns = [
    {
      title: '序号',
      width: 80,
      dataIndex: 'no'
    },
    {
      title: '图形',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '大类',
      dataIndex: 'earthworkType',
      key: 'earthworkType',
    },
    {
      title: '是否沟槽施工',
      dataIndex: 'isTrenchConstruction',
      key: 'isTrenchConstruction',
      render: (text: boolean) => {
        return text ? '是' : '否'
      }
    },
    {
      title: '默认计算式',
      dataIndex: 'formula',
      key: 'formula',
    },
    {
      title: '参数名称',
      dataIndex: 'commonlyTableEarthworkParams',
      key: 'commonlyTableEarthworkParams',
      render: (text: string, record: any) => {
        // @ts-ignore
        return <table border="1" style={{borderColor: '#fafafa'}}>
          <tbody>
          {
            record.commonlyTableEarthworkParams.map((item: any) => {
              return <tr key={item.id}>
                <td>
                  {item.paramName}
                </td>
              </tr>
            })
          }
          </tbody>
        </table>
      }
    },
    {
      title: '参数值',
      dataIndex: 'commonlyTableEarthworkParams',
      key: 'commonlyTableEarthworkParams',
      render: (text: string, record: any) => {
        // @ts-ignore
        return <table border="1" style={{borderColor: '#fafafa'}}>
          <tbody>
          {
            record.commonlyTableEarthworkParams.map((item: any) => {
              return <tr key={item.id}>
                <td>
                  {item.defaultValue}
                </td>
              </tr>
            })
          }
          </tbody>
        </table>
      }
    },
    {
      title: '说明',
      dataIndex: 'commonlyTableEarthworkParams',
      key: 'commonlyTableEarthworkParams',
      render: (text: string, record: any) => {
        // @ts-ignore
        return <table border="1" style={{borderColor: '#fafafa'}}>
          <tbody>
          {
            record.commonlyTableEarthworkParams.map((item: any) => {
              return <tr key={item.id}>
                <td>
                  {item.remark}
                </td>
              </tr>
            })
          }
          </tbody>
        </table>
      }
    },
  ];
  useEffect(() => {
    getTableData()
  }, [id])
  return (
    <div className={styles.topographicIncreaseFactor}>
      <Tabs defaultActiveKey="1" size={'small'}>
        <TabPane tab="土方参数" key="1">
          <Table
            pagination={false}
            scroll={{y: 800}}
            bordered
            size={'small'}
            rowKey={'id'}
            dataSource={dataSource}
            columns={columns}/>
          <br/>
        </TabPane>
        <TabPane tab="挖方裕度" key="2">
          <div style={{width: '500px', margin: '10px'}}>
            <Table
              pagination={false}
              bordered
              size={'small'}
              rowKey={'id'}
              dataSource={dataSource1}
              columns={[
                {
                  title: '土质',
                  width: 200,
                  dataIndex: 'soilQualityType',
                  render: (type: number) => {
                    return ['普通土', '坚土', '冻土', '松砂石', '岩石（爆破）', '岩石（人工开凿）', '泥水坑', '流沙坑', '干砂坑', '水坑'][type - 1]
                  }
                },
                {
                  title: '每边操作裕度',
                  width: 250,
                  dataIndex: 'marginValue',
                  key: 'marginValue',
                },
              ]}/>
          </div>
        </TabPane>
        <TabPane tab="放坡系数" key="3">
          <Table
            pagination={false}
            scroll={{y: 800}}
            bordered
            size={'small'}
            rowKey={'id'}
            dataSource={dataSource2}
            columns={[
              {
                title: '土质',
                width: 200,
                dataIndex: 'soilQualityType',
                render: (type: number) => {
                  return ['普通土', '坚土', '冻土', '松砂石', '岩石（爆破）', '岩石（人工开凿）', '泥水坑', '流沙坑', '干砂坑', '水坑'][type - 1]
                }
              },
              {
                title: '上限值',
                dataIndex: 'maxHeight',
                key: 'maxHeight',
              },
              {
                title: '下限值',
                dataIndex: 'minHeight',
                key: 'minHeight',
              },
              {
                title: '边坡系数',
                dataIndex: 'slopeCoefficient',
                key: 'slopeCoefficient',
              },
              {
                title: '挖土方式',
                dataIndex: 'diggingType',
                key: 'diggingType',
              render: (type: number) => {
              return [{val:11,name:'人工挖土'},{val:12,name:'v '},{val:13,name:'机械坑上挖土 '}].find(item=>item.val === type)?.name
            }
              },
              {
                title: '专业属性',
                dataIndex: 'professionalProperty',
                key: 'professionalProperty',
                render: (type: number) => {
                  return [{val:1,name:'架空线路'},{val:2,name:'电缆线路 '},{val:3,name:'通信光缆 '},{val:20,name:'配电站、开关站'},{val:21,name:'充电、换电站'}].find(item=>item.val === type)?.name
                }
              },
            ]}/>
        </TabPane>
      </Tabs>

    </div>
  );
}

export default EarthworkParameters;
