import CyFormItem from '@/components/cy-form-item'
import DataSelect from '@/components/data-select'
import UrlSelect from '@/components/url-select'
import { getProjectInfo } from '@/services/project-management/all-project'
import { useGetProjectEnum, useGetSelectData } from '@/utils/hooks'
import { getDefaultStartEndDate } from '@/utils/utils'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useMount, useRequest, useUpdateEffect } from 'ahooks'
import { DatePicker, Input, InputNumber, Select, Tooltip } from 'antd'
import { isEmpty, isNumber } from 'lodash'
import moment, { Moment } from 'moment'
import React, { memo, useEffect, useMemo, useState } from 'react'
import Rule from './project-form-rule'

interface CreateProjectFormProps {
  field?: any
  areaId?: string
  company?: string
  companyName?: string
  status?: number
  projectId?: string
  form?: any
  engineerStart?: Moment
  engineerEnd?: Moment
  copyFlag?: number[]
  setCopyFlag?: (value: number[]) => void
  index?: any
  isInherit?: boolean
  isEdit?: boolean
  isAdd?: boolean
  canEditStage?: boolean
  pointVisible?: boolean
  copyLibId?: string
  getWarehouseData?: (value: any[]) => void
  getLibData?: (value: any[]) => void
}

const { TextArea } = Input

const CreateProjectForm: React.FC<CreateProjectFormProps> = (props) => {
  const {
    field = {},
    // company,
    pointVisible,
    status,
    projectId,
    form,
    engineerStart,
    engineerEnd,
    copyFlag,
    index,
    areaId,
    isInherit = false,
    isEdit = false,
    isAdd = false,
    canEditStage = true,
    setCopyFlag,
    getWarehouseData,
    getLibData,
    copyLibId: inputLibId,
  } = props

  const [startDate, setStartDate] = useState<Moment>()
  const [endDate, setEndDate] = useState<Moment>()
  const [dataSourceType, setDataSourceType] = useState<number>()
  const [disRangeValue] = useState<number>()
  const [pileRangeValue] = useState<number>()
  // const [warehouseId, setWarehouseId] = useState<string>()
  const [libId, setLibId] = useState<string | undefined>(inputLibId)
  const [newLibSelectData, setNewLibSelectData] = useState([])

  //获取wbs是否必填开关
  const wbsMust = localStorage.getItem('wbsMust')

  const { data: projectInfo, run } = useRequest(getProjectInfo, {
    onSuccess: () => {
      setLibId(projectInfo?.libId)
      // setWarehouseId(projectInfo?.warehouseId)
      setStartDate(moment(projectInfo?.startTime))
      setEndDate(moment(projectInfo?.endTime))
    },
    manual: true,
  })

  useMount(() => {
    projectId && run(projectId)
  })

  const disableDate = (current: any) => {
    return current < moment('2010-01-01') || current > moment('2051-01-01')
  }

  useEffect(() => {
    if (!isInherit) {
      setDataSourceType(Number(projectInfo?.dataSourceType))
    } else {
      setDataSourceType(
        Number(projectInfo?.dataSourceType) === 1 ? 0 : Number(projectInfo?.dataSourceType)
      )
    }

    // 0229新疆屏蔽现场数据来源导入和免勘察，因此在复制，继承时重置现场数据来源
    if (!isEdit) setDataSourceType(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(projectInfo)])

  const labelElement = (label: any) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>
        <ExclamationCircleOutlined />
      </div>
    )
  }

  const { data: libSelectData = [] } = useGetSelectData(
    {
      url: '/ResourceLib/GetList',
      requestSource: 'resource',
      titleKey: 'libName',
      valueKey: 'id',
      extraParams: { status: 0 },
    },
    {
      onSuccess: () => {
        getLibData?.(libSelectData)
      },
    }
  )

  const { data: inventoryOverviewSelectData = [] } = useGetSelectData(
    {
      url: `/Inventory/GetList`,
      valueKey: 'id',
      titleKey: 'name',
      otherKey: 'hasMaped',
      requestSource: 'resource',
      extraParams: { libId: libId },
    },
    {
      ready: !!libId,
      refreshDeps: [libId, index],
    }
  )

  const { data: warehouseSelectData = [] } = useGetSelectData(
    {
      url: '/WareHouse/GetWareHouseListByArea',
      extraParams: { area: areaId },
      requestSource: 'resource',
      method: 'post',
      postType: 'query',
    },
    {
      ready: !!areaId,
      refreshDeps: [areaId],
      onSuccess: () => {
        getWarehouseData?.(warehouseSelectData)
        if (!isEdit) {
          const projectInfo = form.getFieldValue('projects')
          const newProjectInfo = projectInfo?.map((item: any, inx: number) => {
            if (inx === index) {
              return {
                ...item,
                warehouseId:
                  warehouseSelectData.length !== 0 ? warehouseSelectData[0].value : 'none',
              }
            }
            return item
          })
          form.setFieldsValue({ projects: newProjectInfo })
        }
        if (isAdd) {
          form.setFieldsValue({
            warehouseId: warehouseSelectData.length !== 0 ? warehouseSelectData[0].value : 'none',
          })
        }
      },
    }
  )

  const handleInventoryData = useMemo(() => {
    if (inventoryOverviewSelectData) {
      return inventoryOverviewSelectData.map((item: any) => {
        if (!item.otherKey) {
          return { label: labelElement(item.label), value: item.value }
        }
        return { label: item.label, value: item.value }
      })
    }
    return []
  }, [inventoryOverviewSelectData])

  //工程区域选择后重置利库选择
  useUpdateEffect(() => {
    const projectInfo = form.getFieldValue('projects')
    const newProjectInfo = projectInfo.map((item: any, inx: number) => {
      if (inx === index) {
        return { ...item, warehouseId: undefined }
      }
      return item
    })
    form.setFieldsValue({ projects: newProjectInfo })
  }, [areaId])

  useEffect(() => {
    if (inputLibId) {
      setLibId(inputLibId)
      const selectData = libSelectData
        .filter((item: any) => {
          if (item.isDisabled) {
            return item.value === inputLibId
          }
          return true
        })
        .map((item: { disabled: any; isDisabled: any }) => {
          item.disabled = item.isDisabled
          return item
        })
      getLibData?.(selectData)
      setNewLibSelectData(selectData)
    } else {
      const copyData = libSelectData.filter((item: any) => {
        if (!item.isDisabled) {
          return item
        }
      })
      getLibData?.(copyData)
      setNewLibSelectData(copyData)
    }
  }, [inputLibId, libSelectData])

  const {
    projectCategory,
    projectPType,
    projectKvLevel,
    projectNature,
    projectAssetsNature,
    projectMajorCategory,
    projectReformCause,
    projectReformAim,
    projectRegionAttribute,
    projectConstructType,
    projectClassification,
    projectStage,
    projectBatch,
    projectAttribute,
    meteorologicLevel,
    projectDataSourceType,
  } = useGetProjectEnum()

  // 如果是继承，那么筛掉value是1的选项
  const handleProjectDataSourceType = useMemo(() => {
    if ((projectDataSourceType && pointVisible) || (isInherit && projectDataSourceType)) {
      return projectDataSourceType
    }
    return []
  }, [projectDataSourceType, pointVisible, isInherit])

  const handleProjectStage = useMemo(() => {
    if (isNumber(projectInfo?.stage) && projectStage && isInherit && projectInfo) {
      return projectStage.filter((item: any) => item.value > projectInfo?.stage)
    }
    return []
  }, [projectStage, isInherit, projectInfo])

  const keyPressEvent = (e: any) => {
    //只要输入的内容是'+-eE'  ，就阻止元素发生默认的行为
    const invalidChars = ['-', '+', 'e', 'E']
    if (invalidChars.indexOf(e.key) !== -1) {
      e.preventDefault()
    }
  }

  const invSlot = () => {
    return (
      <>
        <span>协议库存</span>
        <Tooltip
          title="'!'符号表示当前所选的资源库和该协议库无映射，选用后将在后台为您自动创建映射；"
          placement="top"
        >
          <ExclamationCircleOutlined style={{ paddingLeft: 8, fontSize: 14 }} />
        </Tooltip>
      </>
    )
  }

  // 现场数据来源屏蔽选项使用下面的自定义枚举
  const sourceTypeList = [
    { value: 0, text: '勘察' },
    { value: 1, text: '导入' },
    { value: 2, text: '免勘察' },
  ]

  return (
    <>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            {...field}
            label="项目名称"
            fieldKey={[field.fieldKey, 'name']}
            name={isEmpty(field) ? 'name' : [field.name, 'name']}
            labelWidth={120}
            align="right"
            rules={Rule.name}
            required
          >
            <Input placeholder="请输入" />
          </CyFormItem>
        </div>

        <div className="flex1 flowHidden">
          <CyFormItem
            // shouldUpdate={valueChangeEvent}
            label="项目编码"
            fieldKey={[field.fieldKey, 'code']}
            name={isEmpty(field) ? 'code' : [field.name, 'code']}
            labelWidth={120}
            align="right"
          >
            <Input placeholder="请输入项目编码" maxLength={64} />
          </CyFormItem>
        </div>
      </div>

      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            // shouldUpdate={valueChangeEvent}
            label="WBS编码"
            fieldKey={[field.fieldKey, 'code']}
            name={isEmpty(field) ? 'wbs' : [field.name, 'wbs']}
            labelWidth={120}
            align="right"
            required={wbsMust && Number(wbsMust) === 1 ? true : false}
            rules={[
              wbsMust && Number(wbsMust) === 1
                ? {
                    required: true,
                    message: 'WBS编码不能为空',
                  }
                : {},
            ]}
          >
            <Input placeholder="请输入WBS编码" maxLength={64} />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="总投资(万元)"
            labelWidth={120}
            align="right"
            fieldKey={[field.fieldKey, 'totalInvest']}
            name={isEmpty(field) ? 'totalInvest' : [field.name, 'totalInvest']}
            rules={[
              () => ({
                validator(_, value) {
                  if (value <= 100000 && value > -1) {
                    return Promise.resolve()
                  }
                  if (value > 100000) {
                    return Promise.reject('请填写0~100000以内的整数')
                  }
                  return Promise.resolve()
                },
              }),

              {
                pattern: /^(([1-9]\d+)|[0-9])/, //匹配正整数
                message: '该项不能为负数',
              },
              {
                pattern: /^([\\-]?[0-9]+[\d]*(.[0-9]{1,3})?)$/, //匹配小数位数
                message: '最多保留三位小数',
              },
            ]}
          >
            <Input
              type="number"
              placeholder="请输入"
              min={0}
              defaultValue={0}
              onKeyPress={keyPressEvent}
            />
          </CyFormItem>
        </div>
      </div>

      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            fieldKey={[field.fieldKey, 'libId']}
            name={isEmpty(field) ? 'libId' : [field.name, 'libId']}
            label="资源库"
            labelWidth={120}
            align="right"
            required
            rules={Rule.lib}
          >
            <DataSelect
              placeholder="请选择"
              options={newLibSelectData}
              onChange={(value: any) => {
                setLibId(value)
                if (field.fieldKey === undefined) {
                  form.setFieldsValue({ inventoryOverviewId: undefined })
                } else {
                  // form.setFieldsValue( {'inventoryOverviewId'[field.fieldKey]: undefined })
                  const projectInfo = form.getFieldValue('projects')
                  const newProjectInfo = projectInfo.map((item: any, inx: number) => {
                    if (inx === index) {
                      return { ...item, inventoryOverviewId: undefined }
                    }
                    return item
                  })
                  form.setFieldsValue({ projects: newProjectInfo })
                }
              }}
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            fieldKey={[field.fieldKey, 'inventoryOverviewId']}
            name={isEmpty(field) ? 'inventoryOverviewId' : [field.name, 'inventoryOverviewId']}
            labelSlot={invSlot}
            labelWidth={120}
            align="right"
            required
            rules={Rule.inventory}
          >
            <DataSelect
              options={
                handleInventoryData.length !== 0
                  ? handleInventoryData
                  : [{ label: '无', value: 'none' }]
              }
              placeholder="请先选择资源库"
            />
          </CyFormItem>
        </div>
      </div>

      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            fieldKey={[field.fieldKey, 'warehouseId']}
            name={isEmpty(field) ? 'warehouseId' : [field.name, 'warehouseId']}
            label="利旧库存协议"
            initialValue="none"
            labelWidth={120}
            align="right"
            required
            rules={Rule.warehouse}
          >
            <DataSelect
              options={
                warehouseSelectData.length !== 0
                  ? warehouseSelectData
                  : [{ label: '无', value: 'none' }]
              }
              placeholder="请先选择区域"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目分类"
            fieldKey={[field.fieldKey, 'category']}
            initialValue={1}
            name={isEmpty(field) ? 'category' : [field.name, 'category']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectCategory}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>

      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目开始日期"
            labelWidth={120}
            align="right"
            fieldKey={[field.fieldKey, 'startTime']}
            name={isEmpty(field) ? 'startTime' : [field.name, 'startTime']}
            required
            initialValue={moment(getDefaultStartEndDate().startDate)}
            dependencies={['startTime', 'endTime']}
            rules={[
              { required: true, message: '项目开始日期不能为空' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    !getFieldValue('startTime') ||
                    endDate ||
                    moment(value.format('YYYY-MM-DD')).isBefore(
                      moment(endDate).format('YYYY-MM-DD')
                    )
                  ) {
                    if (
                      moment(moment(new Date(value)).format('YYYY-MM-DD')).isAfter(
                        moment(endDate).format('YYYY-MM-DD')
                      ) ||
                      moment(moment(new Date(value)).format('YYYY-MM-DD')).isSame(
                        moment(endDate).format('YYYY-MM-DD')
                      )
                    ) {
                      return Promise.reject('"项目开始日期"必须早于"项目结束日期"')
                    }
                    if (
                      getFieldValue('startTime')
                        ? moment(new Date(value).getTime()).isAfter(
                            engineerStart
                              ? engineerStart
                              : new Date(getFieldValue('startTime')).getTime()
                          ) ||
                          moment(new Date(value).getTime()).isSame(
                            engineerStart
                              ? engineerStart
                              : new Date(getFieldValue('startTime')).getTime(),
                            'day'
                          )
                        : true
                    ) {
                      return Promise.resolve()
                    }
                    return Promise.reject('"项目开始日期"不得早于"工程开始日期"')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <DatePicker
              placeholder="请选择"
              onChange={(value: any) => {
                setStartDate(value)
              }}
              disabledDate={disableDate}
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目结束日期"
            labelWidth={120}
            align="right"
            fieldKey={[field.fieldKey, 'endTime']}
            name={isEmpty(field) ? 'endTime' : [field.name, 'endTime']}
            dependencies={['endTime', 'startTime']}
            required
            initialValue={moment(getDefaultStartEndDate().endDate)}
            rules={[
              { required: true, message: '项目结束日期不能为空' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    moment(value?.format('YYYY-MM-DD')).isAfter(
                      moment(startDate).format('YYYY-MM-DD')
                    ) ||
                    !value ||
                    !getFieldValue('endTime') ||
                    startDate
                  ) {
                    if (
                      moment(value?.format('YYYY-MM-DD')).isBefore(
                        moment(startDate).format('YYYY-MM-DD')
                      ) ||
                      moment(moment(new Date(value))?.format('YYYY-MM-DD')).isSame(
                        moment(startDate).format('YYYY-MM-DD')
                      )
                    ) {
                      return Promise.reject('"项目结束日期"必须晚于"项目开始日期"')
                    }
                    if (
                      getFieldValue('endTime')
                        ? moment(new Date(value).getTime()).isBefore(
                            engineerEnd ? engineerEnd : new Date(getFieldValue('endTime')).getTime()
                          ) ||
                          moment(new Date(value).getTime()).isSame(
                            engineerEnd
                              ? engineerEnd
                              : new Date(getFieldValue('endTime')).getTime(),
                            'day'
                          )
                        : true
                    ) {
                      return Promise.resolve()
                    }
                    return Promise.reject('“项目结束日期”不得晚于“工程结束日期”')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <DatePicker
              placeholder="请选择"
              disabledDate={disableDate}
              format={'yyyy-MM-DD'}
              onChange={(value: any) => {
                setEndDate(value)
              }}
            />
          </CyFormItem>
        </div>
      </div>

      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目类型"
            fieldKey={[field.fieldKey, 'pType']}
            initialValue={1}
            name={isEmpty(field) ? 'pType' : [field.name, 'pType']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectPType}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="电压等级"
            fieldKey={[field.fieldKey, 'kvLevel']}
            initialValue={2}
            name={isEmpty(field) ? 'kvLevel' : [field.name, 'kvLevel']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectKvLevel}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目性质"
            labelWidth={120}
            align="right"
            rules={Rule.natures}
            fieldKey={[field.fieldKey, 'natures']}
            name={isEmpty(field) ? 'natures' : [field.name, 'natures']}
            required
            initialValue={[4096]}
          >
            <UrlSelect
              defaultData={projectNature}
              mode="multiple"
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="资产性质"
            fieldKey={[field.fieldKey, 'assetsNature']}
            initialValue={1}
            name={isEmpty(field) ? 'assetsNature' : [field.name, 'assetsNature']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectAssetsNature}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="专业类别"
            fieldKey={[field.fieldKey, 'majorCategory']}
            initialValue={1}
            name={isEmpty(field) ? 'majorCategory' : [field.name, 'majorCategory']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectMajorCategory}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="是否跨年项目"
            fieldKey={[field.fieldKey, 'isAcrossYear']}
            initialValue={'false'}
            name={isEmpty(field) ? 'isAcrossYear' : [field.name, 'isAcrossYear']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <Select placeholder="请选择">
              <Select.Option value="true">是</Select.Option>
              <Select.Option value="false">否</Select.Option>
            </Select>
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="改造原因"
            initialValue={1}
            fieldKey={[field.fieldKey, 'reformCause']}
            name={isEmpty(field) ? 'reformCause' : [field.name, 'reformCause']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectReformCause}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="建设改造目的"
            initialValue={1}
            fieldKey={[field.fieldKey, 'reformAim']}
            name={isEmpty(field) ? 'reformAim' : [field.name, 'reformAim']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectReformAim}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="供电所/班组"
            fieldKey={[field.fieldKey, 'powerSupply']}
            name={isEmpty(field) ? 'powerSupply' : [field.name, 'powerSupply']}
            labelWidth={120}
            align="right"
          >
            <Input placeholder="请输入供电所/班组" />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="资产所属单位"
            fieldKey={[field.fieldKey, 'assetsOrganization']}
            name={isEmpty(field) ? 'assetsOrganization' : [field.name, 'assetsOrganization']}
            labelWidth={120}
            align="right"
            // rules={Rule.assetsOrganization}
            // required
          >
            <Input placeholder="请输入" />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="所属市公司"
            fieldKey={[field.fieldKey, 'cityCompany']}
            name={isEmpty(field) ? 'cityCompany' : [field.name, 'cityCompany']}
            labelWidth={120}
            align="right"
            // rules={[{ required: true, message: '所属市公司不能为空' }]}
            // required
          >
            <Input placeholder="请输入" />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="区域属性"
            initialValue={1}
            fieldKey={[field.fieldKey, 'regionAttribute']}
            name={isEmpty(field) ? 'regionAttribute' : [field.name, 'regionAttribute']}
            labelWidth={120}
            align="right"
            rules={Rule.required}
            required
          >
            <UrlSelect
              defaultData={projectRegionAttribute}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="所属县公司"
            fieldKey={[field.fieldKey, 'countyCompany']}
            name={isEmpty(field) ? 'countyCompany' : [field.name, 'countyCompany']}
            labelWidth={120}
            align="right"
            // required
            // rules={[{ required: true, message: '所属县公司不能为空' }]}
          >
            <Input placeholder="请输入" />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="建设类型"
            initialValue={1}
            fieldKey={[field.fieldKey, 'constructType']}
            name={isEmpty(field) ? 'constructType' : [field.name, 'constructType']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            <UrlSelect
              defaultData={projectConstructType}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目类别"
            initialValue={1}
            fieldKey={[field.fieldKey, 'pCategory']}
            name={isEmpty(field) ? 'pCategory' : [field.name, 'pCategory']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            <UrlSelect
              defaultData={projectClassification}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目阶段"
            initialValue={2}
            fieldKey={[field.fieldKey, 'stage']}
            name={isEmpty(field) ? 'stage' : [field.name, 'stage']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            <UrlSelect
              defaultData={isInherit ? handleProjectStage : projectStage}
              valuekey="value"
              disabled={!canEditStage && !isInherit} //判断是否参与继承 && 是否开始继承 &&是否新增项目
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目批次"
            initialValue={1}
            fieldKey={[field.fieldKey, 'batch']}
            name={isEmpty(field) ? 'batch' : [field.name, 'batch']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            <UrlSelect
              defaultData={projectBatch}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="截止日期"
            fieldKey={[field.fieldKey, 'deadline']}
            name={isEmpty(field) ? 'deadline' : [field.name, 'deadline']}
            labelWidth={120}
            align="right"
          >
            <DatePicker placeholder="请选择" />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目属性"
            initialValue={1}
            fieldKey={[field.fieldKey, 'pAttribute']}
            name={isEmpty(field) ? 'pAttribute' : [field.name, 'pAttribute']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            <UrlSelect
              defaultData={projectAttribute}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>

      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="现场数据来源"
            initialValue={0}
            fieldKey={[field.fieldKey, 'dataSourceType']}
            name={isEmpty(field) ? 'dataSourceType' : [field.name, 'dataSourceType']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            {status === 1 ||
            status === 14 ||
            status === 30 ||
            status === 31 ||
            status === undefined ? (
              <UrlSelect
                defaultData={
                  pointVisible || isInherit ? handleProjectDataSourceType : projectDataSourceType
                }
                valuekey="value"
                titlekey="text"
                placeholder="请选择"
                onChange={(value: any) => {
                  if (value === 2 || value === 1) {
                    if (field.fieldKey === undefined) {
                      // form.resetFields(['disclosureRange', 'pileRange'])

                      form.setFieldsValue({ disclosureRange: undefined, pileRange: undefined })
                    } else {
                      const projectsInfo = form.getFieldValue('projects')
                      const newProjectsInfo = projectsInfo.map((item: any, ind: number) => {
                        if (ind === index) {
                          return { ...item, disclosureRange: undefined, pileRange: undefined }
                        }
                        return item
                      })
                      form.setFieldsValue({ projects: newProjectsInfo })
                    }
                  }
                  setDataSourceType(value)
                  if (field) {
                    // 当有field的时候，重新触发校验
                    form.validateFields()
                  }
                  if (isNumber(index)) {
                    const copyData = [...copyFlag!]
                    // console.log(index)
                    copyData.splice(index!, 1, value)
                    // console.log(copyData)
                    setCopyFlag?.(copyData)
                  }
                }}
              />
            ) : (
              <UrlSelect
                defaultData={sourceTypeList}
                disabled
                valuekey="value"
                titlekey="text"
                placeholder="请选择"
              />
            )}
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          {dataSourceType === 2 || (copyFlag && copyFlag[index] && copyFlag[index] === 2) ? (
            <CyFormItem
              label="交底范围(米)"
              // initialValue={'50'}
              fieldKey={[field.fieldKey, 'disclosureRange']}
              name={isEmpty(field) ? 'disclosureRange' : [field.name, 'disclosureRange']}
              labelWidth={120}
              // required
              align="right"
            >
              <InputNumber
                disabled
                placeholder="“免勘察”项目，免设置此条目"
                style={{ width: '100%' }}
                value={disRangeValue}
              />
            </CyFormItem>
          ) : dataSourceType === 1 || (copyFlag && copyFlag[index] && copyFlag[index] === 1) ? (
            <CyFormItem
              label="交底范围(米)"
              // initialValue={'50'}
              fieldKey={[field.fieldKey, 'disclosureRange']}
              name={isEmpty(field) ? 'disclosureRange' : [field.name, 'disclosureRange']}
              labelWidth={120}
              // required
              align="right"
            >
              <InputNumber
                disabled
                placeholder="“导入”项目，免设置此条目"
                style={{ width: '100%' }}
                value={disRangeValue}
              />
            </CyFormItem>
          ) : (
            <CyFormItem
              label="交底范围(米)"
              // initialValue={'50'}
              fieldKey={[field.fieldKey, 'disclosureRange']}
              name={isEmpty(field) ? 'disclosureRange' : [field.name, 'disclosureRange']}
              labelWidth={120}
              // required
              align="right"
              rules={[
                // {
                //   required: true,
                //   message: '交底范围不能为空',
                // },
                () => ({
                  validator(_, value) {
                    if (value <= 999 && value > -1) {
                      return Promise.resolve()
                    }
                    if (value > 999) {
                      return Promise.reject('请填写0~999以内的整数')
                    }
                    return Promise.resolve()
                  },
                }),
                {
                  pattern: /^[0-9]\d*$/,
                  message: '请输入正整数',
                },
              ]}
            >
              <Input
                type="number"
                placeholder="请输入交底范围"
                style={{ width: '100%' }}
                value={disRangeValue}
                onKeyPress={keyPressEvent}
              />
            </CyFormItem>
          )}
        </div>
      </div>

      <div className="flex">
        <div className="flex1 flowHidden">
          {dataSourceType === 2 || (copyFlag && copyFlag[index] && copyFlag[index] === 2) ? (
            <CyFormItem
              label="桩位范围(米)"
              // initialValue={10}
              fieldKey={[field.fieldKey, 'pileRange']}
              name={isEmpty(field) ? 'pileRange' : [field.name, 'pileRange']}
              labelWidth={120}
              required
              align="right"
            >
              <InputNumber
                value={pileRangeValue}
                disabled
                style={{ width: '100%' }}
                placeholder="“免勘察”项目，免设置此条目"
              />
            </CyFormItem>
          ) : dataSourceType === 1 || (copyFlag && copyFlag[index] && copyFlag[index] === 1) ? (
            <CyFormItem
              label="桩位范围(米)"
              // initialValue={10}
              fieldKey={[field.fieldKey, 'pileRange']}
              name={isEmpty(field) ? 'pileRange' : [field.name, 'pileRange']}
              labelWidth={120}
              required
              align="right"
            >
              <InputNumber
                value={pileRangeValue}
                disabled
                placeholder="“导入”项目，免设置此条目"
                style={{ width: '100%' }}
              />
            </CyFormItem>
          ) : status === 1 ||
            status === 2 ||
            status === 14 ||
            status === 30 ||
            status === 31 ||
            isInherit ? (
            <CyFormItem
              label="桩位范围(米)"
              initialValue={10}
              fieldKey={[field.fieldKey, 'pileRange']}
              name={isEmpty(field) ? 'pileRange' : [field.name, 'pileRange']}
              required
              labelWidth={120}
              align="right"
              rules={[
                {
                  required: true,
                  message: '桩位范围不能为空',
                },
                () => ({
                  validator(_, value) {
                    if (value <= 999 && value > -1) {
                      return Promise.resolve()
                    }
                    if (value > 999) {
                      return Promise.reject('请填写0~999以内的整数')
                    }
                    return Promise.resolve()
                  },
                }),
                {
                  pattern: /^[0-9]\d*$/,
                  message: '请输入正整数',
                },
              ]}
            >
              <Input
                type="number"
                placeholder="请输入桩位范围"
                onKeyPress={keyPressEvent}
                style={{ width: '100%' }}
              />
            </CyFormItem>
          ) : (
            <CyFormItem
              label="桩位范围(米)"
              initialValue={10}
              fieldKey={[field.fieldKey, 'pileRange']}
              name={isEmpty(field) ? 'pileRange' : [field.name, 'pileRange']}
              labelWidth={120}
              required
              align="right"
            >
              <InputNumber value={pileRangeValue} disabled style={{ width: '100%' }} />
            </CyFormItem>
          )}
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="气象区"
            initialValue={1}
            fieldKey={[field.fieldKey, 'meteorologic']}
            name={isEmpty(field) ? 'meteorologic' : [field.name, 'meteorologic']}
            required
            labelWidth={120}
            align="right"
            rules={Rule.required}
          >
            <UrlSelect
              defaultData={meteorologicLevel}
              valuekey="value"
              titlekey="text"
              placeholder="请选择"
            />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="备注"
            fieldKey={[field.fieldKey, 'remark']}
            name={isEmpty(field) ? 'remark' : [field.name, 'remark']}
            labelWidth={120}
            align="right"
          >
            <TextArea
              placeholder="请输入备注"
              showCount
              maxLength={200}
              style={{ width: '100%' }}
            />
          </CyFormItem>
        </div>
      </div>
    </>
  )
}

export default memo(CreateProjectForm)
