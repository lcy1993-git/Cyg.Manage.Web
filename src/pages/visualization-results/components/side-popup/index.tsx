import {
  addComment,
  CommentRequestType,
  fetchCommentList,
  porjectIsExecutor,
} from '@/services/visualization-results/side-popup'
import {
  GetDesignResultMaterial,
  getHouseholdLineInfo,
  getlibId_new,
  getMedium,
} from '@/services/visualization-results/visualization-results'
import { handleDecrypto, translateMatDataToTree } from '@/utils/utils'
import { CloseOutlined, StepBackwardOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Input, message, Modal, Table } from 'antd'
import classnames from 'classnames'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useContainer } from '../../result-page/mobx-store'
import { findEnumKeyByCN } from '../../utils/loadEnum'
import { AdditionMaterialTable } from '../addition-material-table'
import CableSection from '../cable-section'
import { HouseholdTable } from '../household-table'
import { MaterialTableNew } from '../material-table-new'
import MediaModal from '../media-modal'
import CommentList from './components/comment-list'
import styles from './index.less'

export interface TableDataType {
  [propName: string]: any
}

export interface SidePopupProps {
  data: TableDataType[]
  rightSidebarVisible: boolean
  setRightSidebarVisiviabel: (arg0: boolean) => void
  height: number
  isShowCable: boolean
  setIsShowCable: any
}

const modalTitle = {
  media: '查看多媒体文件',
  material: '查看材料表',
  annotation: '创建审阅',
  household: '查看入户线',
  additionMaterial: '查看附加材料表',
}

const DEVICE_TYPE: { [propertyName: string]: string } = {
  tower: '杆塔',
  cable: '电缆井',
  cable_equipment: '电气设备',
  mark: '地物',
  transformer: '变压器',
  over_head_device: '柱上设备',
  line: '线路' || '电缆',
  cable_channel: '电缆通道',
  electric_meter: '户表',
  cross_arm: '横担',
  user_line: '下户线',
  fault_indicator: '故障指示器',
  pull_line: '拉线',
  Track: '轨迹点',
  TrackLine: '轨迹线',
}

const LAYER_TYPE: { [propertyName: string]: string } = {
  survey: '勘察',
  plan: '方案',
  design: '设计',
  dismantle: '拆除',
}

export interface CommentListItemDataType {
  author: string
  content: React.ReactNode
  datetime: React.ReactNode
}
const SidePopup: React.FC<SidePopupProps> = observer((props) => {
  const {
    data: dataResource,
    rightSidebarVisible,
    setRightSidebarVisiviabel,
    height,
    isShowCable,
    setIsShowCable,
  } = props

  const [commentRquestBody, setcommentRquestBody] = useState<CommentRequestType>()
  const [resourceLibId, setResourceLibId] = useState<string>('')
  const [activeType, setActiveType] = useState<string | undefined>(undefined)
  const [threeModal, setThtreeModal] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState(dataResource)

  const [threeRouter, setThreeRouter] = useState<string>('duanluqi')

  const setMmaterialRefNone = () => {
    if (materialRef?.current?.innerHTML) {
      materialRef.current.innerHTML = '暂无数据'
      materialRef.current.className = ''
    }
  }

  const { data: mediaData, run: mediaDataRun } = useRequest(getMedium, {
    manual: true,
    onSuccess(data) {
      if (data?.length > 0) {
        mediaRef.current!.innerHTML = '查看'
        mediaRef.current!.className = 'mapSideBarlinkBtn'
      } else {
        mediaRef.current!.innerHTML = '暂无数据'
        mediaRef.current!.className = ''
      }
    },
  })

  const { run: reviewRun } = useRequest(porjectIsExecutor, {
    manual: true,
    onSuccess(data) {
      if (data) {
        reviewRef.current!.innerHTML = '添加审阅'
        reviewRef.current!.className = 'mapSideBarlinkBtn'
      } else {
        reviewRef.current!.innerHTML = '暂无数据'
        reviewRef.current!.className = ''
      }
    },
  })
  const {
    data: materialData,
    run: materialDataRun,
    loading: matiralsLoading,
  } = useRequest(GetDesignResultMaterial, {
    manual: true,
    throwOnError: true,
    onSuccess(data) {
      // 材料表
      if (materialRef.current) {
        if (data?.materialList?.length > 0) {
          data?.materialList.forEach(() => {
            // if (item.unit === 'km') {
            //   item.itemNumber = item.itemNumber / 1000
            // }
          })
          materialRef.current!.innerHTML = '查看'
          materialRef.current!.className = 'mapSideBarlinkBtn'
        } else {
          materialRef.current!.innerHTML = '暂无数据'
          materialRef.current!.className = ''
        }
      }

      // 附加材料表
      if (additionMaterialRef.current) {
        if (data?.additionalMaterialList?.length > 0) {
          data.additionalMaterialList.forEach(() => {
            // if (item.unit === 'km') {
            //   item.itemNumber = item.itemNumber / 1000
            // }
          })
          additionMaterialRef.current!.innerHTML = '查看'
          additionMaterialRef.current!.className = 'mapSideBarlinkBtn'
        } else {
          additionMaterialRef.current!.innerHTML = '暂无数据'
          additionMaterialRef.current!.className = ''
        }
      }
    },
  })

  const {
    data: householdData,
    run: houseHoldRun,
    loading: houseHoldLoading,
  } = useRequest(getHouseholdLineInfo, {
    manual: true,
    onSuccess(data) {
      if (data?.length > 0) {
        data.forEach((item: any) => {
          if (item.unit === 'km') {
            item.itemNumber = item.itemNumber / 1000
          }
        })
        householdRef.current!.innerHTML = '查看'
        householdRef.current!.className = 'mapSideBarlinkBtn'
      } else {
        householdRef.current!.innerHTML = '暂无数据'
        householdRef.current!.className = ''
      }
    },
  })

  const returnlibId = async (materialParams: any) => {
    materialDataRun(materialParams)
  }

  useEffect(() => {
    if (rightSidebarVisible) {
      setDataSource(dataResource)
      // 多媒体数据请求
      const mediaParams = dataResource?.find((item: any) => item.propertyName === '多媒体')?.data
        ?.params
      if (mediaParams) {
        mediaDataRun(mediaParams)
      } else if (mediaRef.current) {
        mediaRef.current.innerHTML = '暂无数据'
        mediaRef.current.className = ''
      }

      //入户线数据请求
      const houseHoldParams =
        dataResource?.find((item: any) => item.propertyName === '入户线')?.data?.params ?? {}

      if (houseHoldParams?.projectId && houseHoldParams?.deviceId) {
        houseHoldRun({
          deviceId: houseHoldParams?.deviceId,
          projectId: houseHoldParams?.projectId,
          scope: houseHoldParams?.type,
        })
      }
      // 材料表params
      const materialParams =
        dataResource?.find((item: any) => item.propertyName === '材料表')?.data?.params ?? {}
      //附加材料表params 这次开发两个接口合并为一个
      const additionMaterialParams =
        dataResource?.find((item: any) => item.propertyName === '附加材料表')?.data?.params ?? {}
      if (additionMaterialParams?.projectId && additionMaterialParams?.deviceId) {
        if (
          additionMaterialParams.getProperties.id_.includes('cable_head') ||
          additionMaterialParams.getProperties.id_.includes('design_tower') ||
          additionMaterialParams.getProperties.id_.includes('dismantle_tower')
        ) {
          getlibId_new({ projectId: additionMaterialParams?.projectId }).then((data) => {
            const decryRes = handleDecrypto(data)
            if (decryRes.isSuccess) {
              const resourceLibID = decryRes?.content
              setResourceLibId(resourceLibID)
            }
          })
        }
      }
      // 设置材料表展示文本
      if (!materialParams?.rest?.objectID || !materialParams?.getProperties.project_id) {
        setMmaterialRefNone()
      }
      // 获取材料表和附加材料表
      if (materialParams?.deviceId && materialParams?.projectId) {
        returnlibId({
          deviceId: materialParams?.deviceId,
          projectId: materialParams?.projectId,
          layerType: materialParams?.rest?.layerName, // 元素类型
          groupType: materialParams?.type, // 图层
        })
      }

      // 审阅数据
      const reviewData = dataResource?.find((item: any) => item.propertyName === '审阅')?.data ?? {}
      if (reviewData?.id) {
        reviewRun(reviewData.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(dataResource), rightSidebarVisible])

  const mediaRef = useRef<HTMLSpanElement>(null)
  const householdRef = useRef<HTMLSpanElement>(null)
  const materialRef = useRef<HTMLSpanElement>(null)
  const additionMaterialRef = useRef<HTMLSpanElement>(null)
  const reviewRef = useRef<HTMLSpanElement>(null)

  const [Comment, setComment] = useState('')
  const [mediaVisiable, setMediaVisiable] = useState(false)
  // 户表id弹出框是否显示
  const [idsVisiable, setIdsVisiable] = useState(false)
  const [idsListData, setIdsListData] = useState<any>([])
  // 电缆沟土建弹出框是否显示
  const [cableTjVisiable, setCableTjVisiable] = useState(false)
  const [cableTjListData, setCableTjListData] = useState<any>([])
  const [mediaIndex, setMediaIndex] = useState<number>(0)
  const store = useContainer()
  // const { vState, setMediaListVisibel } = useContainer();
  const { checkedProjectIdList, mediaListVisibel, mediaListData } = store.vState

  const data = useMemo(() => {
    const title = dataSource.find((o) => o.propertyName === 'title')?.data
    return [dataSource.filter((o) => o.propertyName !== 'title'), title ? title : '']
  }, [JSON.stringify(dataSource)])

  const handlerMediaClick = () => {
    if (mediaRef.current?.innerHTML === '查看') {
      setActiveType('media')
    }
  }

  const handlerMaterialClick = () => {
    if (materialRef.current?.innerHTML === '查看') {
      setActiveType('material')
    }
  }

  const handlerHouseHoldClick = () => {
    if (householdRef.current?.innerHTML === '查看') {
      setActiveType('household')
    }
  }

  const handlerAdditionMaterialClick = () => {
    if (additionMaterialRef.current?.innerHTML === '查看') {
      setActiveType('additionMaterial')
    }
  }

  const columns = [
    {
      title: '属性名',
      dataIndex: 'propertyName',
      ellipsis: true,
    },
    {
      title: '属性值',
      dataIndex: 'data',
      width: 164,
      // ellipsis: true,
      render(value: any, record: any, index: any) {
        if (record.propertyName === '户表ID') {
          return (
            <span
              onClick={() => {
                const list = [
                  {
                    name: '户表1',
                    value: record.data.m_first || '-',
                  },
                  {
                    name: '户表2',
                    value: record.data.m_second || '-',
                  },
                  {
                    name: '户表3',
                    value: record.data.m_third || '-',
                  },
                  {
                    name: '户表4',
                    value: record.data.m_fourth || '-',
                  },
                  {
                    name: '户表5',
                    value: record.data.m_fifth || '-',
                  },
                  {
                    name: '户表6',
                    value: record.data.m_sixth || '-',
                  },
                ]
                setIdsListData(list)
                setIdsVisiable(true)
              }}
              className={styles.link}
            >
              查看
            </span>
          )
        }

        if (record.propertyName === '电缆沟土建') {
          return (
            <span
              onClick={() => {
                const list = [
                  {
                    name: '普土',
                    value: (record.data.ordi_soil || '-') + '米',
                  },
                  {
                    name: '砂石土',
                    value: (record.data.sand_soil || '-') + '米',
                  },
                  {
                    name: '混泥土',
                    value: (record.data.concrete || '-') + '米',
                  },
                  {
                    name: '柏油路',
                    value: (record.data.asp_road || '-') + '米',
                  },
                  {
                    name: '水钻50',
                    value: (record.data.rh_fifty || '-') + '个',
                  },
                  {
                    name: '非开挖水平定向钻100及以下',
                    value: (record.data.rhbe_hun || '-') + '米',
                  },
                  {
                    name: '非开挖水平定向钻100及以上',
                    value: (record.data.rhab_hun || '-') + '米',
                  },
                ]
                setCableTjListData(list)
                setCableTjVisiable(true)
              }}
              className={styles.link}
            >
              查看
            </span>
          )
        }

        if (record.propertyName === 'title') return null
        if (record.propertyName === '三维模型') {
          if (record.data) {
            return (
              <span
                key={record.id}
                className={styles.link}
                onClick={() => {
                  setThreeRouter(value)
                  setThtreeModal(true)
                }}
              >
                查看
              </span>
            )
          }
        }
        if (typeof value === 'string' || typeof value === 'number')
          return (
            <span title={value + ''} key={index}>
              {value}
            </span>
          )
        if (record.propertyName === '多媒体') {
          return (
            <span onClick={handlerMediaClick} ref={mediaRef}>
              {mediaRef ? '暂无数据' : '数据请求中'}
            </span>
          )
        } else if (record.propertyName === '材料表') {
          return (
            <span onClick={handlerMaterialClick} ref={materialRef}>
              {materialRef ? '暂无数据' : '数据请求中'}
            </span>
          )
        } else if (record.propertyName === '入户线') {
          return (
            <span onClick={handlerHouseHoldClick} ref={householdRef}>
              {householdRef ? '暂无数据' : '数据请求中'}
            </span>
          )
        } else if (record.propertyName === '附加材料表') {
          return (
            <span onClick={handlerAdditionMaterialClick} ref={additionMaterialRef}>
              {additionMaterialRef ? '暂无数据' : '数据请求中'}
            </span>
          )
        } else if (record.propertyName === '审阅') {
          return (
            <span
              onClick={() => {
                if (reviewRef.current?.innerHTML === '添加审阅') {
                  onOpenAddCommentModal(value)
                }
              }}
              ref={reviewRef}
            >
              暂无权限
            </span>
          )
          // if (checkedProjectIdList.flat(2).find((i) => i.id === value.id)?.isExecutor) {
          //   return (
          //     <span
          //       className={styles.link}
          //       onClick={() => onOpenAddCommentModal(value)}
          //       key={index}
          //     >
          //       添加审阅
          //     </span>
          //   );
          // } else {
          //   return (
          //     <span key={index} className={styles.none}>
          //       暂无权限
          //     </span>
          //   );
          // }
        } else if (record.propertyName === '穿孔示意图') {
          return <CableSection key={JSON.stringify({ ...value })} {...value} />
        }
        return <span key={index}>暂无权限</span>
      },
    },
  ]

  const mediaColumns = [
    {
      title: '',
      dataIndex: 'type',
      key: 'type',
      render(t: any, r: any) {
        if (t === 1) {
          return <span key={r.id}>图片</span>
        } else if (t === 2) {
          return <span key={r.id}>音频</span>
        }
        return t ?? ''
      },
    },
    {
      title: '勘测人',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '勘测日期',
      dataIndex: 'surveyTime',
      key: 'surveyTime',
      render(t: number) {
        return moment(t).format('YYYY-MM-DD')
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render(value: any, record: any, index: number) {
        return (
          <span
            key={record.id}
            className={styles.link}
            onClick={() => {
              setMediaVisiable(true)
              setMediaIndex(index)
            }}
          >
            查看
          </span>
        )
      },
    },
  ]

  const idsColumns = [
    // showHeader
    {
      title: '',
      dataIndex: 'name',
      key: 'classNames',
    },
    {
      title: '',
      dataIndex: 'value',
      key: 'value',
    },
  ]

  /**
   * 获取评审list
   */
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
   * 添加评审
   */
  const { run: addCommentRequest } = useRequest(addComment, {
    manual: true,
    onSuccess: () => {
      message.success('添加成功')
      fetchCommentListRequest({
        layer: commentRquestBody?.layerType,
        deviceId: commentRquestBody?.deviceId,
        projectId: commentRquestBody?.projectId,
      })
      setComment('')
    },
    onError: () => {
      message.error('添加失败')
    },
  })

  const onOpenAddCommentModal = (value: any) => {
    setActiveType('annotation&' + value.id)
    const feature = data[0].find((item: any) => item.propertyName === '审阅')?.data.feature

    /**
     * 从feature这个对象里面取出关键信息，
     * 由于localstorage里面存的是中文枚举值，
     * 这里取出来的是英文，所以要根据中英文转换一下
     */
    if (feature) {
      const { id_, project_id: projectId } = feature.values_
      /**
       * "survey_tower.1386220338212147281" 切割该字符串获取图层type，设备类型，设备id
       * survey_device_type.1386220338212147281
       */
      const split = id_?.split('.')
      // deviceId在审阅获取数据时拿不到id名称，这里的id有误故修改id获取方式
      // const deviceId = split[1];
      const deviceId = feature.values_?.id

      const deviceAndLayer = split && split[0].split('_')

      /**
       * 初始化请求body
       * LAYER_TYPE[deviceAndLayer[0]]这里是英文转换成中文，
       * 因为feature里面的数据是英文的，
       * 但是本地存储的是中文？？？？？
       */

      let body = {
        layerType: findEnumKeyByCN(LAYER_TYPE[deviceAndLayer?.[0]], 'ProjectCommentLayer'),
        deviceType: findEnumKeyByCN(
          DEVICE_TYPE[deviceAndLayer?.slice(1).join('_')],
          'ProjectCommentDevice'
        ),
        deviceId,
        projectId,
        content: '',
      }
      setcommentRquestBody(body)
      fetchCommentListRequest({ layer: body.layerType, deviceId: body.deviceId, projectId })
    }
  }

  // 解决意外关闭弹窗时，三维模型框没有响应关闭的bug
  useEffect(() => {
    if (!rightSidebarVisible) {
      setThtreeModal(false)
    }
  }, [rightSidebarVisible])

  useEffect(() => {
    setRightSidebarVisiviabel(false)
  }, [JSON.stringify(checkedProjectIdList)])

  const materialDataRes = useMemo(() => {
    if (Array.isArray(materialData?.materialList) && materialData?.materialList?.length > 0) {
      return translateMatDataToTree(materialData?.materialList)
    } else {
      return []
    }
    // const materialParams = dataResource?.find((item: any) => item.propertyName === '材料表')?.data
    //   ?.params ?? {};
    // return materialData?.content && materialData?.content.length > 0
    //   ? generateMaterialTreeList(materialData?.content)
    //   : [];
  }, [materialData?.materialList])

  // 附加材料表变化
  const addMaterialDataRes = useMemo(() => {
    if (
      Array.isArray(materialData?.additionalMaterialList) &&
      materialData?.additionalMaterialList?.length > 0
    ) {
      return materialData?.additionalMaterialList
    } else {
      return []
    }
  }, [materialData?.additionalMaterialList])

  /**
   * 当modal click确定的时候
   * @param id
   */
  const onOkClick = () => {
    /**
     * 如果要在添加审阅相应事件只能在这个if下面
     */
    if (activeType?.split('&')[0] === 'annotation') {
      addCommentRequest({
        projectId: commentRquestBody?.projectId ?? '',
        layerType: commentRquestBody?.layerType ?? -100,
        deviceType: commentRquestBody?.deviceType ?? -100,
        deviceId: commentRquestBody?.deviceId ?? '-100',
        content: Comment,
      })
    } else {
      setActiveType(void 0)
    }
  }

  const onChange = (e: any) => {
    setIsShowCable(e.target.checked)
  }

  const isShowCableText = () => {
    return (
      dataSource.find((item) => item.propertyName === '所属图层')?.data === '设计图层' &&
      dataSource.find((item) => item.propertyName === '元素类型')?.data === '电缆'
    )
  }

  return (
    <div className={styles.wrap}>
      <Modal
        title="户表编号"
        visible={idsVisiable}
        width="15%"
        onCancel={() => setIdsVisiable(false)}
        onOk={() => setIdsVisiable(false)}
        destroyOnClose={true}
        className={styles.mediaModal}
      >
        <Table
          key="media"
          columns={idsColumns}
          dataSource={idsListData}
          pagination={false}
          showHeader={false}
        ></Table>
      </Modal>

      <Modal
        title="土建属性"
        visible={cableTjVisiable}
        width="15%"
        onCancel={() => setCableTjVisiable(false)}
        onOk={() => setCableTjVisiable(false)}
        destroyOnClose={true}
        className={styles.mediaModal}
      >
        <Table
          key="media"
          columns={idsColumns}
          dataSource={cableTjListData}
          pagination={false}
          showHeader={false}
        ></Table>
      </Modal>

      <Modal
        title={activeType ? modalTitle[activeType!] ?? '添加审阅' : ''}
        centered
        visible={!!activeType}
        onOk={onOkClick}
        onCancel={() => setActiveType(undefined)}
        width={1200}
        maskClosable={true}
      >
        <Modal
          title="多媒体查看"
          visible={mediaVisiable}
          width="96%"
          onCancel={() => setMediaVisiable(false)}
          onOk={() => setMediaVisiable(false)}
          destroyOnClose={true}
          className={styles.mediaModal}
        >
          <MediaModal
            content={mediaData ?? []}
            currentIndex={mediaIndex}
            setCurrentIndex={setMediaIndex}
          />
        </Modal>
        {activeType === 'media' && (
          <Table
            key="media"
            columns={mediaColumns}
            dataSource={mediaData ?? []}
            rowKey={(e) => e.id}
            pagination={false}
          ></Table>
        )}
        {activeType === 'material' && (
          <MaterialTableNew data={materialDataRes} loading={matiralsLoading} />
        )}

        {activeType === 'household' && (
          <HouseholdTable data={householdData?.content} loading={houseHoldLoading} />
        )}
        {activeType === 'additionMaterial' && (
          <AdditionMaterialTable
            data={addMaterialDataRes}
            libId={resourceLibId}
            loading={matiralsLoading}
          />
        )}

        {activeType?.split('&')[0] === 'annotation' && (
          <>
            <div>
              <CommentList
                horizontal
                height={300}
                commentList={commentListResponseData}
                loading={fetchCommentListloading}
              />
              <div className="flex">
                <div style={{ width: '8%' }}>添加审阅</div>
                <Input.TextArea
                  maxLength={200}
                  placeholder="请输入"
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  defaultValue={Comment}
                  value={Comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
          </>
        )}
      </Modal>

      <Modal
        title="查看多媒体文件"
        centered
        visible={mediaListVisibel}
        width="96%"
        onOk={onOkClick}
        onCancel={() => store.setMediaListVisibel(false)}
        // width={1200}
        footer={[
          <Button key="cancle" onClick={() => store.setMediaListVisibel(false)}>
            关闭
          </Button>,
        ]}
        maskClosable={false}
      >
        <Table
          columns={mediaColumns}
          dataSource={mediaListData}
          rowKey={(e) => e.id}
          pagination={false}
        ></Table>
        <Modal
          title="多媒体查看"
          visible={mediaVisiable}
          width="96%"
          onCancel={() => setMediaVisiable(false)}
          onOk={() => setMediaVisiable(false)}
          destroyOnClose={true}
          className={styles.mediaModal}
        >
          <MediaModal
            content={mediaListData}
            currentIndex={mediaIndex}
            setCurrentIndex={setMediaIndex}
          />
        </Modal>
      </Modal>
      {rightSidebarVisible ? (
        <div className={styles.sidePopupWrap}>
          <div className={styles.title} title={'项目名称：' + data[1]}>
            <span className={styles.head}>项目名称：</span>
            <span className={styles.body}>{data[1]}</span>
          </div>
          <div
            className={styles.drawerClose}
            onClick={() => {
              setRightSidebarVisiviabel(false)
              setThtreeModal(false)
            }}
          >
            <CloseOutlined />
          </div>
          {isShowCableText() && (
            <div style={{ marginLeft: '5px' }}>
              <Checkbox onChange={onChange} defaultChecked={isShowCable}>
                显示整根电缆
              </Checkbox>
            </div>
          )}
          <Table
            key={JSON.stringify(dataResource)}
            bordered
            style={{ height: 30 }}
            pagination={false}
            columns={columns}
            dataSource={data[0]}
            rowClassName={styles.row}
            scroll={{ y: height - 160 }}
            rowKey={(r) => r.propertyName}
          />
        </div>
      ) : null}
      {rightSidebarVisible && threeModal ? (
        <div
          className={styles.threeModalWrap}
          style={{
            width: window.innerWidth - 540,
            height: window.innerHeight - 228,
          }}
        >
          <div
            className={classnames(styles.closeButton, styles.link)}
            onClick={() => setThtreeModal(false)}
          >
            <StepBackwardOutlined />
            收起
          </div>
          <iframe
            title=" "
            key={threeRouter}
            width="100%"
            height="100%"
            src={`${window.location.origin}/visiual3d/?type=${threeRouter}`}
            style={{ backgroundColor: '#fff' }}
          ></iframe>
        </div>
      ) : null}
    </div>
  )
})

export default SidePopup
