import React, { useEffect, useState } from 'react'
import { Input, Col, Row, Select } from 'antd'
import DisableSelect from '../disable-select'
import UrlSelect from '@/components/url-select'
import FormSwitch from '@/components/form-switch'
import CyFormItem from '@/components/cy-form-item'
import DateFormItem from '@/components/date-from-item'
import { getEnums } from '@/pages/technology-economic/utils'
const { Option } = Select
const engineeringTemplateTypeList = getEnums('EngineeringTemplateType')
  ? getEnums('EngineeringTemplateType')
  : [{ text: '定额计价', value: 1 }]
interface IForm {
  type?: 'add' | 'edit'
  selectList?: number[]
}
type listType = {
  value: string
  text: string
  disabled?: true
}
const DictionaryForm: React.FC<IForm> = (props) => {
  const { type, selectList } = props
  return (
    <>
      <Row>
        <Col span={11}>
          <CyFormItem
            label="编号"
            name="no"
            required
            rules={[{ required: true, message: '编号为必填项' }]}
          >
            <Input placeholder="请输入编号" />
          </CyFormItem>
          <CyFormItem label="版本" name="version">
            <Input />
          </CyFormItem>
          <CyFormItem
            label="模板类型"
            name="engineeringTemplateType"
            required
            rules={[{ required: true, message: '模板类型为必填项' }]}
          >
            {type === 'edit' ? (
              <Select disabled>
                {engineeringTemplateTypeList &&
                  engineeringTemplateTypeList.map((item: any, index: number) => {
                    return (
                      <Option value={item.value} key={index}>
                        {item.text}
                      </Option>
                    )
                  })}
              </Select>
            ) : (
              <DisableSelect
                requestType="get"
                requestSource="tecEco"
                defaultData={engineeringTemplateTypeList!}
                selectList={selectList!}
              />
              // <UrlSelect
              //   requestType="get"
              //   requestSource="tecEco"
              //   defaultData={engineeringTemplateTypeList!}
              // />
            )}
          </CyFormItem>
        </Col>
        <Col span={2}></Col>
        <Col span={11}>
          <CyFormItem
            label="发布时间"
            name="publishDate"
            required
            rules={[{ required: true, message: '发布时间为必填项' }]}
          >
            <DateFormItem />
          </CyFormItem>
          <CyFormItem
            label="状态"
            name="enabled"
            required
            rules={[{ required: true, message: '状态为必填项' }]}
          >
            <FormSwitch />
          </CyFormItem>
        </Col>
      </Row>
      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} />
      </CyFormItem>
    </>
  )
}

export default DictionaryForm
