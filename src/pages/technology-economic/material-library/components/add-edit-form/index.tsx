import React from 'react'
import { Input, Col, Row } from 'antd'
import UrlSelect from '@/components/url-select'
import CyFormItem from '@/components/cy-form-item'
import DateFormItem from '@/components/date-from-item'
import FileUpload from '@/components/file-upload'

const DictionaryForm: React.FC<{ type?: string }> = () => {
  return (
    <>
      <Row>
        <Col span={11}>
          <CyFormItem
            label="名称"
            name="name"
            required
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </CyFormItem>
          <CyFormItem label="发布机构" name="publishOrg">
            <Input />
          </CyFormItem>
          <CyFormItem label="适用行业" name="industryType">
            <UrlSelect
              url="/CommonEnum/GetIndustryTypeEnums"
              requestType="get"
              requestSource="tecEco"
              titlekey="text"
              valuekey="value"
            />
          </CyFormItem>
        </Col>
        <Col span={2}></Col>
        <Col span={11}>
          <CyFormItem
            label="发布时间"
            name="publishDate"
            required
            rules={[{ required: true, message: '请选择发布时间' }]}
          >
            <DateFormItem />
          </CyFormItem>
          <CyFormItem
            label="价格年度"
            name="year"
            required
            rules={[{ required: true, message: '请选择价格年度' }]}
          >
            <DateFormItem picker="year" />
          </CyFormItem>
          {/*<CyFormItem label="状态" name="enabled" required rules={[{required: true}]}>*/}
          {/*  <FormSwitch />*/}
          {/*</CyFormItem>*/}
        </Col>
      </Row>
      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} />
      </CyFormItem>

      <CyFormItem
        label="上传文件"
        name="file"
        required
        rules={[{ required: true, message: '请上传文件' }]}
      >
        <FileUpload accept=".xls,.xlsx" maxCount={1} trigger={false} />
      </CyFormItem>
    </>
  )
}

export default DictionaryForm
