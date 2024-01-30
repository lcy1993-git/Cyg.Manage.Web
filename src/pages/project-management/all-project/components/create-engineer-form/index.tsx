import CyFormItem from '@/components/cy-form-item'
import DataSelect from '@/components/data-select'
import EnumSelect from '@/components/enum-select'
import {
  FormImportantLevel,
  getCityAreas,
  ProjectLevel,
} from '@/services/project-management/all-project'
import { useGetSelectData } from '@/utils/hooks'
import { getDefaultStartEndDate } from '@/utils/utils'
import useRequest from '@ahooksjs/use-request'
import { Cascader, DatePicker, Input } from 'antd'
// import city from '@/assets/local-data/area'
import moment from 'moment'
import React, { useCallback, useMemo, useState } from 'react'
import Rule from './engineer-form-rule'

interface CreateEngineerForm {
  exportDataChange?: (exportData: any) => void
  areaId?: string
  libId?: string
  form?: any
  canChange?: boolean
  minStart?: number
  maxEnd?: number
  provinceData?: any
}

const CreateEngineerForm: React.FC<CreateEngineerForm> = (props) => {
  const {
    exportDataChange,

    form,
    canChange = true,
    minStart,
    maxEnd,
    provinceData,
  } = props

  const [areaId, setAreaId] = useState<string>('')
  // const [libId, setLibId] = useState<string>('')
  const [city, setCity] = useState<any[]>([])

  const disableDate = (current: any) => {
    return current < moment('2010-01-01') || current > moment('2051-01-01')
  }

  //获取区域
  const { data: cityData } = useRequest(() => getCityAreas(), {
    loadingDelay: 500,
    onSuccess: () => {
      if (cityData) {
        setCity(cityData.data)
      }
    },
  })

  //@ts-ignore
  const { companyName, userName, name } = JSON.parse(localStorage.getItem('userInfo'))

  const { data: companySelectData = [] } = useGetSelectData(
    {
      url: `/ElectricityCompany/GetListByAreaId`,
      extraParams: { areaId: areaId },
      titleKey: 'text',
      valueKey: 'text',
    },
    { ready: !!areaId, refreshDeps: [areaId] }
  )

  const mapHandleCityData = (data: any) => {
    return {
      label: data.shortName,
      value: data.id,
      children: data.children
        ? [
            { label: '无', value: `${data.id}_null`, children: undefined },
            ...data.children.map(mapHandleCityData),
          ]
        : undefined,
    }
  }

  const afterHandleData = useMemo(() => {
    return city?.map(mapHandleCityData)
  }, [JSON.stringify(city)])

  const valueChangeEvenet = useCallback(
    (prevValues: any, curValues: any) => {
      if (prevValues.province !== curValues.province) {
        const [currentAreaId = ''] = curValues.province
        setAreaId(currentAreaId)
        exportDataChange?.({
          areaId: currentAreaId,
          company: curValues.company,
          companyName:
            companySelectData?.find((item: any) => item.value == curValues.company)?.label ?? '',
        })
        // 因为发生了改变，所以之前选择的应该重置
        if (form && canChange) {
          form.setFieldsValue({
            warehouseId: undefined,
          })
          form.setFieldsValue({
            company: undefined,
          })
        }
      }

      if (prevValues.company !== curValues.company) {
        const [currentAreaId = ''] = curValues.province
        exportDataChange?.({
          areaId: currentAreaId,
          company: curValues.company,
          companyName:
            companySelectData?.find((item: any) => item.value == curValues.company)?.label ?? '',
        })
      }
      return false
    },
    [canChange]
  )

  const changeProvince = (value: any, selectedOptions: any) => {
    const area = selectedOptions
      .filter((item: any) => item.label !== '无')
      .map((item: any) => item.label)
    let projectName = ''
    area.forEach((item: any, index: any) => {
      if (index === 0) projectName = item
      if (index === 1) projectName += item
      if (index === 2) projectName += item + '县'
    })
    const project = form.getFieldValue('projects')
    const projects = project?.map((item: any) => {
      return {
        ...item,
        name: projectName + '*镇*台区10千伏及以下新建（改造）工程',
        cityCompany: area[1] ? area[1] + '市(州)公司' : '',
        countyCompany: area[2] ? area[2] + '县公司' : '',
      }
    })

    form.setFieldsValue({
      name: projectName + '*镇*台区10千伏及以下新建（改造）工程',
      projects: projects,
    })
  }

  return (
    <>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="区域"
            name="province"
            labelWidth={120}
            align="right"
            required
            rules={Rule.area}
          >
            <Cascader options={afterHandleData || provinceData} onChange={changeProvince} />
          </CyFormItem>
        </div>

        <div className="flex1 flowHidden">
          <CyFormItem
            label="工程名称"
            name="name"
            labelWidth={120}
            align="right"
            rules={Rule.name}
            required
          >
            <Input placeholder="请输入" />
          </CyFormItem>
        </div>
      </div>

      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="项目级别"
            name="grade"
            labelWidth={120}
            align="right"
            initialValue={'1'}
            required
            rules={Rule.grade}
          >
            <EnumSelect placeholder="请选择" enumList={ProjectLevel} />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="所属公司"
            name="company"
            labelWidth={120}
            align="right"
            required
            rules={Rule.company}
          >
            <DataSelect options={companySelectData} placeholder="请先选择区域" />
          </CyFormItem>
        </div>
      </div>
      <div className="flex ">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="编制时间"
            name="compileTime"
            initialValue={moment()}
            labelWidth={120}
            align="right"
            required
            rules={Rule.complieTime}
          >
            <DatePicker />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="编制单位"
            name="organization"
            labelWidth={120}
            align="right"
            required
            rules={Rule.organization}
            initialValue={companyName}
          >
            <Input placeholder="请输入" />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            shouldUpdate={valueChangeEvenet}
            label="编制人"
            name="compiler"
            labelWidth={120}
            align="right"
            required
            rules={Rule.compiler}
            initialValue={name ?? userName}
          >
            <Input placeholder="请输入" />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="重要程度"
            name="importance"
            labelWidth={120}
            align="right"
            initialValue={'1'}
            required
            rules={Rule.importance}
          >
            <EnumSelect placeholder="请选择" enumList={FormImportantLevel} />
          </CyFormItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="工程开始时间"
            name="startTime"
            labelWidth={120}
            initialValue={moment(getDefaultStartEndDate().startDate)}
            align="right"
            required
            rules={[
              { required: true, message: '工程开始时间不能为空' },
              () => ({
                validator(_, value) {
                  if (
                    minStart
                      ? moment(new Date(value).getTime()).isBefore(moment(minStart)) ||
                        moment(new Date(value).getTime()).isSame(moment(minStart))
                      : true
                  ) {
                    return Promise.resolve()
                  }
                  return Promise.reject('"工程开始时间"不得晚于"项目开始时间"')
                },
              }),
            ]}
          >
            <DatePicker disabledDate={disableDate} />
          </CyFormItem>
        </div>
        <div className="flex1 flowHidden">
          <CyFormItem
            label="工程结束时间"
            name="endTime"
            labelWidth={120}
            align="right"
            required
            dependencies={['startTime']}
            initialValue={moment(getDefaultStartEndDate().endDate)}
            rules={[
              { required: true, message: '工程结束时间不能为空' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    moment(moment(new Date(value)).format('YYYY-MM-DD')).isAfter(
                      moment(new Date(getFieldValue('startTime')?.format('YYYY-MM-DD')))
                    ) ||
                    !value ||
                    !getFieldValue('startTime')
                  ) {
                    if (
                      maxEnd
                        ? moment(new Date(value).getTime()).isAfter(moment(maxEnd)) ||
                          moment(new Date(value).getTime()).isSame(moment(maxEnd))
                        : true
                    ) {
                      return Promise.resolve()
                    }
                    return Promise.reject('"工程结束时间"不得早于"项目结束时间"')
                  }
                  return Promise.reject('"工程结束时间"不得早于"工程开始时间"')
                },
              }),
            ]}
          >
            <DatePicker disabledDate={disableDate} />
          </CyFormItem>
        </div>
      </div>

      <div className="flex">
        <div className="flex1 flowHidden">
          <CyFormItem
            label="计划年度"
            name="plannedYear"
            labelWidth={120}
            align="right"
            initialValue={new Date().getFullYear()}
            required
            rules={Rule.plannedYear}
          >
            <Input type="number" placeholder="请输入" style={{ width: '40.85%' }} />
          </CyFormItem>
        </div>
      </div>
    </>
  )
}

export default CreateEngineerForm
