import React, { useMemo } from 'react'
import { useRequest } from 'ahooks'
import barChartsOptions from '../../utils/barChartsOption'
import BarChart from '@/components/bar-chart'
import { getProjectClassify, Type, AreaInfo } from '@/services/index'
import uuid from 'node-uuid'
import AnnularFighure from '@/components/annular-fighure'
import styles from './index.less'

interface Props {
  componentProps?: string[]
  currentAreaInfo: AreaInfo
  type: Type
}

const chartColor = ['#2AFE97', '#FDFA88', '#21CEBE', '#4DA944']

const ProjectClassify: React.FC<Props> = ({ type = 'pie', currentAreaInfo }) => {
  const { data: projectClassify } = useRequest(
    () =>
      getProjectClassify({ areaCode: currentAreaInfo.areaId, areaType: currentAreaInfo.areaLevel }),
    {
      refreshDeps: [currentAreaInfo],
      pollingWhenHidden: false,
    }
  )
  const dataSum = useMemo(() => {
    if (projectClassify) {
      return (
        projectClassify?.reduce((sum, item) => {
          return sum + item.value
        }, 0) ?? 1
      )
    }
    return 1
  }, [JSON.stringify(projectClassify)])

  const getOption = (type: string, data?: any, index?: number) => {
    if (type === 'pie') {
      const proportion = !isNaN(data.value / dataSum)
        ? ((data.value / dataSum) * 100).toFixed(2) + '%'
        : '0%'
      return {
        title: {
          text: proportion, //图形标题，配置在中间对应效果图的80%
          left: 'center',
          top: '45%',
          textStyle: {
            color: '#74AC91',
            fontSize: 12,
            align: 'center',
            fontWeight: 100,
          },
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '70%'], //设置内外环半径,两者差值越大，环越粗
            hoverAnimation: false, //移入图形是否放大
            labelLine: {
              normal: {
                //label线不显示
                show: false,
              },
            },
            data: [
              {
                value: data.value,
                itemStyle: {
                  normal: {
                    color: chartColor[index!],
                  },
                },
              },
              {
                value: dataSum - data.value,
                itemStyle: {
                  normal: {
                    color: '#004260',
                  },
                },
              },
            ],
          },
        ],
      }
    }
    if (type === 'bar') {
      if (!projectClassify) {
        return undefined
      }
      return barChartsOptions(projectClassify)
    }
    return undefined
  }

  return (
    <>
      {type === 'pie' && (
        <>
          {projectClassify?.map((item, index) => {
            const option = getOption('pie', item, index)
            return (
              <div className={styles.chartItem} key={uuid.v1()}>
                {option && <AnnularFighure options={option} />}
                <div className={styles.title}>{item.key}</div>
              </div>
            )
          })}
        </>
      )}
      {type === 'bar' && getOption('bar') && (
        <>
          <BarChart options={getOption('bar')!} />
        </>
      )}
    </>
  )
}

export default ProjectClassify
