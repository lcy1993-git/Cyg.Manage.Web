import CyFormItem from '@/components/cy-form-item'
import { Col, Input, Row } from 'antd'
import React, { useState } from 'react'

interface MapSourceFormProps {
  addForm?: any
}

const MapSourceForm: React.FC<MapSourceFormProps> = (props) => {
  const { addForm } = props

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
            dependencies={['maxLevel']}
            align="right"
            initialValue={0}
            rules={[
              { pattern: /^\d+$|^\d+[.]?\d+$/, message: '请输入0-18的正整数' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    value &&
                    getFieldValue('maxLevel') &&
                    Number(value) > Number(getFieldValue('maxLevel'))
                  ) {
                    return Promise.reject('最小级别不可大于最大级别')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input
              type="number"
              placeholder="请输入最小级别"
              min={0}
              onChange={(e) => {
                if (Number(e.target.value) > 18) {
                  addForm.setFieldsValue({ minLevel: 18 })
                  return
                }
              }}
            />
          </CyFormItem>
        </Col>
        <Col span={12}>
          <CyFormItem
            label="最大级别"
            name="maxLevel"
            required
            dependencies={['minLevel']}
            align="right"
            initialValue={0}
            rules={[
              { pattern: /^\d+$|^\d+[.]?\d+$/, message: '请输入0-18的正整数' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    value &&
                    getFieldValue('minLevel') &&
                    Number(value) < Number(getFieldValue('minLevel'))
                  ) {
                    return Promise.reject('最大级别不可小于最小级别')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input
              type="number"
              placeholder="请输入最大级别"
              min={0}
              onChange={(e) => {
                if (Number(e.target.value) > 18) {
                  addForm.setFieldsValue({ maxLevel: 18 })
                  return
                }
              }}
            />
          </CyFormItem>
        </Col>
      </Row>
    </>
  )
}

export default MapSourceForm
