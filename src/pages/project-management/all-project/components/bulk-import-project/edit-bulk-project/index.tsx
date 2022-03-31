import CyFormItem from '@/components/cy-form-item'
import DataSelect from '@/components/data-select'
import UrlSelect from '@/components/url-select'
import { useGetProjectEnum } from '@/utils/hooks'
import { useControllableValue } from 'ahooks'
import { DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd'
import { cloneDeep } from 'lodash'
// import DataSelect from '@/components/data-select';
// import EnumSelect from '@/components/enum-select';
import moment from 'moment'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Rule from '../../create-project-form/project-form-rule'

interface EditBulkProjectProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent: (projectInfo: any) => void
  projectInfo: any
  currentChooseEngineerInfo: any
}

const EditBulkProject: React.FC<EditBulkProjectProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [nature, setNature] = useState<string>()
  const [powerSupplySelectData, setPowerSupplySelectData] = useState<any[]>([])
  const [powerSupply, setPowerSupply] = useState<string>('')
  const [dataSourceType, setDataSourceType] = useState<number>()
  const [disRangeValue, setDisRangeValue] = useState<number>()
  const [pileRangeValue, setPileRangeValue] = useState<number>()

  const { projectInfo, finishEvent, currentChooseEngineerInfo } = props

  const [form] = Form.useForm()

  useEffect(() => {
    const { selectData } = currentChooseEngineerInfo
    form.setFieldsValue({
      ...projectInfo,
      startTime: projectInfo?.startTime ? moment(projectInfo?.startTime) : null,
      endTime: projectInfo?.endTime ? moment(projectInfo?.endTime) : null,
      deadline: projectInfo?.deadline ? moment(projectInfo?.deadline) : null,
      natures: (projectInfo?.natures ?? []).map((item: any) => Number(item)),
      isAcrossYear: projectInfo?.isAcrossYear ? 'true' : 'false',
      powerSupply: projectInfo?.powerSupply ? projectInfo?.powerSupply : 'none',
      disclosureRange:
        projectInfo?.dataSourceType === 2
          ? undefined
          : projectInfo?.dataSourceType === 1
          ? undefined
          : projectInfo?.disclosureRange,
      pileRange:
        projectInfo?.dataSourceType === 2
          ? undefined
          : projectInfo?.dataSourceType === 1
          ? undefined
          : projectInfo?.pileRange,
    })
    setDataSourceType(projectInfo?.dataSourceType)
    setPowerSupplySelectData(selectData.departmentSelectData)
    setPowerSupply(projectInfo.powerSupply)
  }, [JSON.stringify(projectInfo)])

  const powerSupplyOnchange = (value: any) => {
    setPowerSupply(value)
  }

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

  const saveCurrentProject = () => {
    form.validateFields().then((values) => {
      const { projects } = currentChooseEngineerInfo

      const newProjectInfo = {
        ...projectInfo,
        ...values,
        powerSupply,
      }

      const copyProjects = cloneDeep(projects)
      const handleProjects = copyProjects.map((item: any, index: any) => {
        if (index === newProjectInfo.index) {
          return newProjectInfo
        }
        return item
      })
      const projectSaveInfo = {
        ...currentChooseEngineerInfo,
        projects: handleProjects,
      }
      finishEvent(projectSaveInfo)
    })
    setState(false)
  }

  const closeModalEvent = () => {
    setState(false)
  }
  return (
    <>
      <Modal
        maskClosable={false}
        title="编辑项目"
        width="45%"
        centered
        visible={state as boolean}
        onOk={() => saveCurrentProject()}
        onCancel={() => closeModalEvent()}
      >
        <Form form={form}>
          <div className="flex">
            <div className="flex1 flowHidden">
              <CyFormItem
                label="项目名称"
                name="name"
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
                label="项目分类"
                initialValue={1}
                name="category"
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
                label="项目类型"
                initialValue={1}
                name="pType"
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
                initialValue={1}
                name="kvLevel"
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
              <CyFormItem label="总投资(万元)" labelWidth={120} align="right" name="totalInvest">
                <Input placeholder="请输入" />
              </CyFormItem>
            </div>
            <div className="flex1 flowHidden">
              <CyFormItem
                label="项目性质"
                labelWidth={120}
                align="right"
                rules={Rule.required}
                name="natures"
                required
              >
                <UrlSelect
                  defaultData={projectNature}
                  mode="multiple"
                  valuekey="value"
                  titlekey="text"
                  placeholder="请选择"
                  value={nature}
                  onChange={(value) => setNature(value as string)}
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
                name="startTime"
                required
                rules={[{ required: true, message: '项目开始日期不能为空' }]}
              >
                <DatePicker placeholder="请选择" />
              </CyFormItem>
            </div>
            <div className="flex1 flowHidden">
              <CyFormItem
                label="项目结束日期"
                labelWidth={120}
                align="right"
                name="endTime"
                required
                dependencies={['startTime']}
                rules={[
                  { required: true, message: '项目结束日期不能为空' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        new Date(value).getTime() >
                          new Date(getFieldValue('startTime')).getTime() ||
                        !value ||
                        !getFieldValue('startTime')
                      ) {
                        return Promise.resolve()
                      }
                      return Promise.reject('"项目结束日期"不得早于"项目开始日期"')
                    },
                  }),
                ]}
              >
                <DatePicker placeholder="请选择" />
              </CyFormItem>
            </div>
          </div>
          <div className="flex">
            <div className="flex1 flowHidden">
              <CyFormItem
                label="资产性质"
                initialValue={1}
                name="assetsNature"
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
                initialValue={1}
                name="majorCategory"
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
                initialValue={'false'}
                name="isAcrossYear"
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
                name="reformCause"
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
                name="reformAim"
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
                rules={Rule.required}
                name="powerSupply"
                labelWidth={120}
                align="right"
                required
              >
                <div>
                  <DataSelect
                    style={{ width: '100%' }}
                    value={powerSupply}
                    options={powerSupplySelectData}
                    onChange={(value) => powerSupplyOnchange(value)}
                  />
                </div>
              </CyFormItem>
            </div>
          </div>
          <div className="flex">
            <div className="flex1 flowHidden">
              <CyFormItem
                label="资产所属单位"
                name="assetsOrganization"
                labelWidth={120}
                align="right"
                rules={Rule.assetsOrganization}
                required
              >
                <Input placeholder="请输入" />
              </CyFormItem>
            </div>
            <div className="flex1 flowHidden">
              <CyFormItem
                label="所属市公司"
                name="cityCompany"
                labelWidth={120}
                align="right"
                required
                rules={[{ required: true, message: '所属市公司不能为空' }]}
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
                name="regionAttribute"
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
                name="countyCompany"
                labelWidth={120}
                align="right"
                required
                rules={[{ required: true, message: '所属县公司不能为空' }]}
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
                name="constructType"
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
                name="pCategory"
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
                name="stage"
                required
                labelWidth={120}
                align="right"
                rules={Rule.required}
              >
                <UrlSelect
                  defaultData={projectStage}
                  valuekey="value"
                  titlekey="text"
                  placeholder="请选择"
                />
              </CyFormItem>
            </div>
            <div className="flex1 flowHidden">
              <CyFormItem
                label="项目批次"
                initialValue={1}
                name="batch"
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
                label="项目属性"
                initialValue={1}
                name="pAttribute"
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
            <div className="flex1 flowHidden">
              <CyFormItem
                label="气象区"
                initialValue={1}
                name="meteorologic"
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
              <CyFormItem label="截止日期" name="deadline" labelWidth={120} align="right">
                <DatePicker placeholder="请选择" />
              </CyFormItem>
            </div>
            <div className="flex1 flowHidden">
              <CyFormItem
                label="现场数据来源"
                initialValue={0}
                name="dataSourceType"
                required
                labelWidth={120}
                align="right"
                rules={Rule.required}
              >
                <UrlSelect
                  defaultData={projectDataSourceType}
                  valuekey="value"
                  titlekey="text"
                  placeholder="请选择"
                  onChange={(value: any) => {
                    if (value === 2 || value === 1) {
                      form.setFieldsValue({ disclosureRange: undefined, pileRange: undefined })
                    }
                    setDataSourceType(value)
                  }}
                />
              </CyFormItem>
            </div>
          </div>

          <div className="flex">
            <div className="flex1 flowHidden">
              {dataSourceType === 2 || disRangeValue === 0 ? (
                <CyFormItem
                  label="交底范围(米)"
                  // initialValue={'50'}
                  name="disclosureRange"
                  labelWidth={120}
                  required
                  align="right"
                >
                  <InputNumber
                    disabled
                    placeholder="“免勘察”项目，免设置此条目"
                    style={{ width: '100%' }}
                    value={disRangeValue}
                  />
                </CyFormItem>
              ) : dataSourceType === 1 ? (
                <CyFormItem
                  label="交底范围(米)"
                  // initialValue={'50'}
                  name="disclosureRange"
                  labelWidth={120}
                  required
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
                  name="disclosureRange"
                  labelWidth={120}
                  required
                  align="right"
                  rules={[
                    {
                      required: true,
                      message: '交底范围不能为空',
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
                  <InputNumber
                    placeholder="请输入交底范围"
                    style={{ width: '100%' }}
                    value={disRangeValue}
                  />
                </CyFormItem>
              )}
            </div>
            <div className="flex1 flowHidden">
              {dataSourceType === 2 ? (
                <CyFormItem
                  label="桩位范围(米)"
                  // initialValue={'50'}
                  name="pileRange"
                  labelWidth={120}
                  required
                  align="right"
                >
                  <InputNumber
                    value={pileRangeValue}
                    disabled
                    placeholder="“免勘察”项目，免设置此条目"
                    style={{ width: '100%' }}
                  />
                </CyFormItem>
              ) : dataSourceType === 1 ? (
                <CyFormItem
                  label="桩位范围(米)"
                  // initialValue={'50'}
                  name="pileRange"
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
              ) : (
                <CyFormItem
                  label="桩位范围(米)"
                  // initialValue={'50'}
                  name="pileRange"
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
                  <InputNumber placeholder="请输入桩位范围" style={{ width: '100%' }} />
                </CyFormItem>
              )}
            </div>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default EditBulkProject
