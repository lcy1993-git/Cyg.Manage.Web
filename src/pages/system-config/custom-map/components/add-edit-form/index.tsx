import React from 'react'
import { Col, Input, Row } from 'antd'
import CyFormItem from '@/components/cy-form-item'

const { TextArea } = Input

const MapSourceForm: React.FC = () => {
  return (
    <>
      <CyFormItem label="地图源名称" name="libName" required align="right">
        <Input placeholder="请输入地图源名称"></Input>
      </CyFormItem>
      <CyFormItem label="地址" name="address" align="right" required>
        <Input placeholder="请输入地图源地址" />
      </CyFormItem>

      <CyFormItem label="主机编号" name="remark" align="right">
        <Input placeholder="请输入主机编号" />
      </CyFormItem>
      <Row>
        <Col span={12}>
          <CyFormItem
            label="最小级别"
            name="minLevel"
            required
            align="right"
            rules={[{ pattern: /^(?:0|[1-9][0-9]?|18)$/, message: '请输入0-18以内的正整数' }]}
          >
            <Input type="number" placeholder="请输入最小级别" />
          </CyFormItem>
        </Col>
        <Col span={12}>
          <CyFormItem
            label="最大级别"
            name="maxLevel"
            required
            align="right"
            rules={[{ pattern: /^([0-4]?\d{1}|18)$/g, message: '请输入0-18以内的正整数' }]}
          >
            <Input type="number" placeholder="请输入最大级别" />
          </CyFormItem>
        </Col>
      </Row>
    </>
  )
}

export default MapSourceForm
