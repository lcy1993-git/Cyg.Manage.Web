import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { useControllableValue } from 'ahooks'
import UrlSelect from '@/components/url-select'
import { Button, Modal, Form, DatePicker, Tooltip } from 'antd'
import { useGetProjectEnum } from '@/utils/hooks'
import CyFormItem from '@/components/cy-form-item'
import moment from 'moment'
import AreaSelect from '@/components/area-select'

import styles from './index.less'
import { useEffect } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'

interface FilterEntrustModalProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent?: (value: any) => void
  defaultPersonInfo?: any
  searchParams: any
}

const { RangePicker } = DatePicker

const FilterEntrustModal: React.FC<FilterEntrustModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [icon, setIcon] = useState<string>('bottom')
  const { finishEvent, searchParams } = props

  const [category, setCategory] = useState<number[]>([]) //项目分类
  const [stage, setStage] = useState<number[]>([]) //项目阶段
  const [constructType, setConstructType] = useState<number[]>([]) //建设性质
  const [nature, setNature] = useState<number[]>([]) //项目性质
  const [kvLevel, setKvLevel] = useState<number[]>([]) //电压等级
  const [status, setStatus] = useState<number[]>([]) //状态
  const [majorCategory, setMajorCategory] = useState<number[]>([]) //专业类别
  const [pType, setPType] = useState<number[]>([]) //项目类型
  const [reformAim, setReformAim] = useState<number[]>([]) //建设改造目的
  const [pCategory, setPCategory] = useState<number[]>([]) //项目类别
  const [attribute, setAttribute] = useState<number[]>([]) //项目属性
  // const [createdOn, setCreatedOn] = useState<Moment | null>(); //创建时间
  // const [modifyDate, setsModiyDate] = useState<Moment | null>(); //更新时间
  const [sourceType, setSourceType] = useState<number[]>([]) //项目来源
  const [identityType, setIdentityType] = useState<number[]>([]) //项目身份
  const [areaInfo, setAreaInfo] = useState({ areaType: '-1', areaId: '' })
  const [dataSourceType, setDataSourceType] = useState<number[]>([])
  const [startTime, setStartTime] = useState<null | string>('')
  const [endTime, setEndTime] = useState<null | string>('')
  const areaRef = useRef<HTMLDivElement>(null)
  const personRef = useRef<HTMLDivElement>(null)

  const [lastSaveAreaInfo, setLastSaveAreaInfo] = useState({
    provinceId: '',
    cityId: '',
    areaId: '',
    cityData: [],
    areaData: [],
    provinceInfo: undefined,
    cityInfo: undefined,
    areaInfo: undefined,
  })

  const [storageAreaInfo, setStorageAreaInfo] = useState({
    provinceId: '',
    cityId: '',
    areaId: '',
    cityData: [],
    areaData: [],
    provinceInfo: undefined,
    cityInfo: undefined,
    areaInfo: undefined,
  })

  // 更多条件
  const [showMoreFlag, setShowMoreFlag] = useState<boolean>(false)

  const imgSrc = require('../../../../../assets/icon-image/' + icon + '.png')

  const searchEvent = () => {
    setLastSaveAreaInfo(storageAreaInfo)
    finishEvent?.({
      category,
      stage,
      constructType,
      nature,
      kvLevel,
      status,
      majorCategory,

      pType,
      reformAim,
      pCategory,
      attribute,
      sourceType,
      identityType,
      ...areaInfo,
      dataSourceType,
      startTime: startTime ?? '',
      endTime: endTime ?? '',
    })
    setState(false)
  }

  const resetRef = () => {
    if (areaRef && areaRef.current) {
      // @ts-ignore
      areaRef.current.reset()
    }
    if (personRef && personRef.current) {
      // @ts-ignore
      personRef.current.reset()
    }
  }

  const resetEvent = () => {
    setCategory([])
    setStage([])
    setConstructType([])
    setNature([])
    setKvLevel([])
    setStatus([])
    setMajorCategory([])
    setPType([])
    setReformAim([])
    setPCategory([])
    setAttribute([])
    setSourceType([])
    setIdentityType([])
    setDataSourceType([])
    setSourceType([])
    setStartTime(null)
    setAreaInfo({ areaType: '-1', areaId: '' })
    setEndTime(null)
    resetRef()

    setLastSaveAreaInfo({
      provinceId: '',
      cityId: '',
      areaId: '',
      cityData: [],
      areaData: [],
      provinceInfo: undefined,
      cityInfo: undefined,
      areaInfo: undefined,
    })

    finishEvent?.({
      category: [],
      stage: [],
      constructType: [],
      nature: [],
      kvLevel: [],
      status: [],
      dataSourceType: [],
      majorCategory: [],
      pType: [],
      reformAim: [],
      pCategory: [],
      attribute: [],
      sourceType: [],
      identityType: [],
      areaType: '-1',
      areaId: '',
      logicRelation: 2,
      startTime: '',
      endTime: '',
      designUser: '',
      surveyUser: '',
    })
    setState(false)
  }

  const areaChangeEvent = (params: any) => {
    const { provinceId, cityId, areaId } = params
    setStorageAreaInfo(params)
    if (areaId) {
      setAreaInfo({
        areaType: '3',
        areaId,
      })
      return
    }
    if (cityId) {
      setAreaInfo({
        areaType: '2',
        areaId: cityId,
      })
      return
    }
    if (provinceId) {
      setAreaInfo({
        areaType: '1',
        areaId: provinceId,
      })
      return
    }
    if (!provinceId && !cityId && !areaId) {
      setAreaInfo({
        areaType: '-1',
        areaId: '',
      })
    }
  }

  const closeEvent = () => {
    setState(false)
  }

  const {
    projectCategory,
    projectClassification,
    projectNature,
    projectPType,
    projectConstructType,
    projectStage,
    projectKvLevel,
    projectMajorCategory,
    projectReformAim,
    projectAttribute,
    projectDataSourceType,
  } = useGetProjectEnum()

  const timeChange = (dates: any, dateStrings: any) => {
    setStartTime(dateStrings[0])
    setEndTime(dateStrings[1])
  }

  const selectStyle = {
    maxTagPlaceholder: (e: any[]) => `已选择${e.length}项`,
    maxTagCount: 0,
    maxTagTextLength: 2,
    valuekey: 'value',
    titlekey: 'text',
  }

  useEffect(() => {
    if (state && searchParams) {
      if (searchParams.category) {
        setCategory(searchParams.category)
      } else {
        setCategory([])
      }
      if (searchParams.stage) {
        setStage(searchParams.stage)
      } else {
        setStage([])
      }
      if (searchParams.constructType) {
        setConstructType(searchParams.constructType)
      } else {
        setConstructType([])
      }
      if (searchParams.nature) {
        setNature(searchParams.nature)
      } else {
        setNature([])
      }
      if (searchParams.kvLevel) {
        setKvLevel(searchParams.kvLevel)
      } else {
        setKvLevel([])
      }
      if (searchParams.status) {
        setStatus(searchParams.status)
      } else {
        setStatus([])
      }
      if (searchParams.majorCategory) {
        setMajorCategory(searchParams.majorCategory)
      } else {
        setMajorCategory([])
      }
      if (searchParams.pType) {
        setPType(searchParams.pType)
      } else {
        setPType([])
      }
      if (searchParams.reformAim) {
        setReformAim(searchParams.reformAim)
      } else {
        setReformAim([])
      }
      if (searchParams.pCategory) {
        setPCategory(searchParams.pCategory)
      } else {
        setPCategory([])
      }
      if (searchParams.dataSourceType) {
        setDataSourceType(searchParams.dataSourceType)
      } else {
        setDataSourceType([])
      }
      if (searchParams.attribute) {
        setAttribute(searchParams.attribute)
      } else {
        setAttribute([])
      }
      if (searchParams.sourceType) {
        setSourceType(searchParams.sourceType)
      } else {
        setSourceType([])
      }
      if (searchParams.identityType) {
        setIdentityType(searchParams.identityType)
      } else {
        setIdentityType([])
      }

      if (searchParams.startTime) {
        setStartTime(searchParams.startTime)
      } else {
        setStartTime(null)
      }
      if (searchParams.endTime) {
        setEndTime(searchParams.endTime)
      } else {
        setEndTime(null)
      }

      if (searchParams.areaType !== '-1') {
        if (areaRef && areaRef.current) {
          // @ts-ignore
          areaRef?.current?.initComponentData(lastSaveAreaInfo)
        }
      }
    }
  }, [state, JSON.stringify(searchParams)])

  return (
    <Modal
      maskClosable={false}
      title="条件筛选"
      centered
      width={860}
      visible={state as boolean}
      footer={[
        <Button key="cancle" onClick={() => resetEvent()}>
          重置
        </Button>,
        <Button key="save" type="primary" onClick={() => searchEvent()}>
          查询
        </Button>,
      ]}
      onCancel={() => closeEvent()}
    >
      <Form>
        <>
          <div className="flex">
            <div className="flex1">
              <CyFormItem label="项目区域" align="right" labelWidth={100}>
                <div style={{ width: '275px' }}>
                  <AreaSelect ref={areaRef} onChange={areaChangeEvent} />
                </div>
              </CyFormItem>
            </div>
            <div className="flex1">
              <CyFormItem
                label={
                  <>
                    <span>项目起止日期</span>
                    <Tooltip title="筛选出项目起止日期包含在此时间段内的项目" placement="top">
                      <QuestionCircleOutlined style={{ paddingLeft: 5, fontSize: 14 }} />
                    </Tooltip>
                  </>
                }
                align="right"
                labelWidth={135}
              >
                <div style={{ width: '275px' }}>
                  <RangePicker
                    value={
                      startTime && endTime ? [moment(startTime), moment(endTime)] : [null, null]
                    }
                    onChange={timeChange}
                  />
                </div>
              </CyFormItem>
            </div>
          </div>

          <div className="flex">
            <div className="flex1">
              <CyFormItem label="建设类型" name="constructType" align="right" labelWidth={100}>
                <div style={{ width: '275px' }}>
                  <UrlSelect
                    {...selectStyle}
                    allowClear
                    mode="multiple"
                    defaultData={projectConstructType}
                    value={constructType}
                    className="widthAll"
                    placeholder="建设类型"
                    onChange={(value) => setConstructType(value as number[])}
                  />
                </div>
              </CyFormItem>
            </div>
            <div className="flex1">
              <CyFormItem label="项目阶段" align="right" labelWidth={135}>
                <div style={{ width: '275px' }}>
                  <UrlSelect
                    {...selectStyle}
                    allowClear
                    mode="multiple"
                    defaultData={projectStage}
                    value={stage}
                    className="widthAll"
                    onChange={(value) => setStage(value as number[])}
                    placeholder="项目阶段"
                  />
                </div>
              </CyFormItem>
            </div>
          </div>

          <div className="flex">
            <div className="flex1">
              <CyFormItem label="专业类别" align="right" labelWidth={100}>
                <div style={{ width: '275px' }}>
                  <UrlSelect
                    {...selectStyle}
                    allowClear
                    mode="multiple"
                    defaultData={projectMajorCategory}
                    value={majorCategory}
                    dropdownMatchSelectWidth={168}
                    onChange={(values) => setMajorCategory(values as number[])}
                    className="widthAll"
                    placeholder="专业类别"
                    allValue="-1"
                  />
                </div>
              </CyFormItem>
            </div>
            <div className="flex1">
              <CyFormItem label="电压等级" align="right" labelWidth={135}>
                <div style={{ width: '275px' }}>
                  <UrlSelect
                    {...selectStyle}
                    allowClear
                    mode="multiple"
                    defaultData={projectKvLevel}
                    value={kvLevel}
                    onChange={(value) => setKvLevel(value as number[])}
                    className="widthAll"
                    placeholder="电压等级"
                  />
                </div>
              </CyFormItem>
            </div>
          </div>

          <div className={styles.moreInfo}>
            {!showMoreFlag ? (
              <>
                <span
                  className={styles.expandWord}
                  onClick={() => {
                    setShowMoreFlag(!showMoreFlag)
                    setIcon(showMoreFlag ? 'bottom' : 'up')
                  }}
                >
                  更多条件
                </span>
                <img src={imgSrc} alt="" />
              </>
            ) : (
              <>
                <span
                  className={styles.expandWord}
                  onClick={() => {
                    setShowMoreFlag(!showMoreFlag)
                    setIcon(showMoreFlag ? 'bottom' : 'up')
                    setCategory([])
                    setPType([])
                    setNature([])
                    setReformAim([])
                    setPCategory([])
                    setAttribute([])
                    setDataSourceType([])
                  }}
                >
                  收起条件
                </span>
                <img src={imgSrc} alt="" />
              </>
            )}
          </div>

          {/* 更多条件 */}
          <div style={{ display: showMoreFlag ? 'block' : 'none' }}>
            <div className="flex">
              <div className="flex1">
                <CyFormItem label="项目分类" align="right" labelWidth={100}>
                  <div style={{ width: '275px' }}>
                    <UrlSelect
                      {...selectStyle}
                      allowClear
                      mode="multiple"
                      defaultData={projectCategory}
                      className="widthAll"
                      value={category}
                      onChange={(value) => setCategory(value as number[])}
                      placeholder="项目分类"
                    />
                  </div>
                </CyFormItem>
              </div>
              <div className="flex1">
                <CyFormItem label="项目类型" align="right" labelWidth={135}>
                  <div style={{ width: '275px' }}>
                    <UrlSelect
                      {...selectStyle}
                      allowClear
                      mode="multiple"
                      defaultData={projectPType}
                      className="widthAll"
                      value={pType}
                      onChange={(value) => setPType(value as number[])}
                      placeholder="项目类型"
                    />
                  </div>
                </CyFormItem>
              </div>
            </div>

            <div className="flex">
              <div className="flex1">
                <CyFormItem label="项目性质" align="right" labelWidth={100}>
                  <div style={{ width: '275px' }}>
                    <UrlSelect
                      {...selectStyle}
                      allowClear
                      mode="multiple"
                      defaultData={projectNature}
                      value={nature}
                      dropdownMatchSelectWidth={168}
                      onChange={(value) => setNature(value as number[])}
                      className="widthAll"
                      placeholder="项目性质"
                    />
                  </div>
                </CyFormItem>
              </div>
              <div className="flex1">
                <CyFormItem label="建设改造目的" align="right" labelWidth={135}>
                  <div style={{ width: '275px' }}>
                    <UrlSelect
                      {...selectStyle}
                      allowClear
                      mode="multiple"
                      defaultData={projectReformAim}
                      className="widthAll"
                      value={reformAim}
                      onChange={(value) => setReformAim(value as number[])}
                      placeholder="请选择"
                    />
                  </div>
                </CyFormItem>
              </div>
            </div>

            <div className="flex">
              <div className="flex1">
                <CyFormItem label="项目类别" align="right" labelWidth={100}>
                  <div style={{ width: '275px' }}>
                    <UrlSelect
                      {...selectStyle}
                      allowClear
                      mode="multiple"
                      defaultData={projectClassification}
                      value={pCategory}
                      dropdownMatchSelectWidth={168}
                      onChange={(value) => setPCategory(value as number[])}
                      className="widthAll"
                      placeholder="项目类别"
                    />
                  </div>
                </CyFormItem>
              </div>
              <div className="flex1">
                <CyFormItem label="项目属性" align="right" labelWidth={135}>
                  <div style={{ width: '275px' }}>
                    <UrlSelect
                      {...selectStyle}
                      allowClear
                      mode="multiple"
                      defaultData={projectAttribute}
                      className="widthAll"
                      value={attribute}
                      onChange={(value) => setAttribute(value as number[])}
                      placeholder="请选择"
                    />
                  </div>
                </CyFormItem>
              </div>
            </div>
            <div className="flex">
              <div className="flex1">
                <CyFormItem label="现场数据来源" align="right" labelWidth={100}>
                  <div style={{ width: '275px' }}>
                    <UrlSelect
                      {...selectStyle}
                      allowClear
                      mode="multiple"
                      defaultData={projectDataSourceType}
                      value={dataSourceType}
                      dropdownMatchSelectWidth={168}
                      onChange={(value) => setDataSourceType(value as number[])}
                      className="widthAll"
                      placeholder="请选择"
                    />
                  </div>
                </CyFormItem>
              </div>
            </div>
          </div>
        </>
      </Form>
    </Modal>
  )
}

export default FilterEntrustModal
