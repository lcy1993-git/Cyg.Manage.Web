import CommonTitle from '@/components/common-title'
import { useControllableValue } from 'ahooks'
import { Modal, Checkbox, Form } from 'antd'
// import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { useEffect } from 'react'
import { getHasChooseComponentsProps } from '../../../utils'
import HasCheckItem from '../../has-check-item'

interface EditProjectTypeStatistic {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: (componentProps: any) => void
  currentRecord: any
  configArray: any[]
}

const typeComponentPropsArray = [
  { code: 'classify', name: '项目分类' },
  { code: 'category', name: '项目类别' },
  { code: 'stage', name: '项目阶段' },
  { code: 'buildType', name: '项目类型' },
  { code: 'level', name: '电压等级' },
]

const EditProjectTypeModal: React.FC<EditProjectTypeStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { changeFinishEvent, currentRecord, configArray } = props
  const [form] = Form.useForm()

  const sureEditEvent = () => {
    form.validateFields().then((values) => {
      const { type } = values

      setState(false)

      changeFinishEvent?.({
        name: 'projectType',
        key: currentRecord.key,
        x: 0,
        y: 0,
        w: 3,
        h: 11,
        componentProps: type,
      })
    })
  }

  useEffect(() => {
    if (currentRecord.componentProps && currentRecord.componentProps.length > 0) {
      form.setFieldsValue({ type: currentRecord.componentProps })
    }
  }, [JSON.stringify(currentRecord.componentProps)])

  const typeComponentProps = useMemo(() => {
    const hasChooseTypeCodeArray = getHasChooseComponentsProps(configArray, 'projectType')
    const currentTypeProps = typeComponentPropsArray.filter((item) =>
      currentRecord.componentProps?.includes(item.code)
    )
    const unChooseTypeProps = typeComponentPropsArray.filter(
      (item) => !currentRecord.componentProps?.includes(item.code)
    )
    return {
      hasChooseTypeCodeArray,
      unChooseTypeProps,
      currentTypeProps,
    }
  }, [JSON.stringify(configArray)])

  const typeStatisticCheckbox = typeComponentProps.currentTypeProps.map((item) => {
    return (
      <Checkbox key={item.code} value={item.code}>
        {item.name}
      </Checkbox>
    )
  })

  const typeStatisticHasCheck = typeComponentProps.unChooseTypeProps.map((item) => {
    if (typeComponentProps.hasChooseTypeCodeArray.includes(item.code)) {
      return <HasCheckItem key={item.code}>{item.name}</HasCheckItem>
    } else {
      return (
        <Checkbox value={item.code} key={item.code}>
          {item.name}
        </Checkbox>
      )
    }
  })

  return (
    <Modal
      maskClosable={false}
      title="配置-项目类型"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureEditEvent()}
    >
      <Form form={form}>
        <CommonTitle>项目类型</CommonTitle>
        <Form.Item name="type">
          <Checkbox.Group>
            {typeStatisticCheckbox}
            {typeStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditProjectTypeModal
