import CommonTitle from '@/components/common-title'
import { useControllableValue } from 'ahooks'
import { Modal, Checkbox, Form } from 'antd'
import uuid from 'node-uuid'
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { getHasChooseComponentsProps } from '../../utils'
import HasCheckItem from '../has-check-item'

interface AddOtherStatistic {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: (componentProps: any) => void
  configArray: any[]
}

const toDoComponentPropsArray = [
  { code: 'wait', name: '已结项' },
  { code: 'arrange', name: '待安排' },
  { code: 'other', name: '其他消息' },
]

const AddOtherStatisticModal: React.FC<AddOtherStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { changeFinishEvent, configArray } = props
  const [form] = Form.useForm()

  const sureAddEvent = () => {
    form.validateFields().then((values) => {
      const { type } = values
      const componentProps = [...type]
      setState(false)
      changeFinishEvent?.([
        {
          name: 'toDo',
          key: uuid.v1(),
          x: 0,
          y: 0,
          w: 3,
          h: 11,
          componentProps: componentProps,
          fixHeight: true,
        },
      ])
      form.resetFields()
    })
  }

  const toDoCompoentProps = useMemo(() => {
    const hasChoosetoDoComponentCodeArray = getHasChooseComponentsProps(configArray, 'toDo')
    const unChoosetoDoComponentProps = toDoComponentPropsArray.filter(
      (item) => !hasChoosetoDoComponentCodeArray?.includes(item.code)
    )
    const hasChoosetoDoComponentProps = toDoComponentPropsArray.filter((item) =>
      hasChoosetoDoComponentCodeArray?.includes(item.code)
    )
    return {
      unChoosetoDoComponentProps,
      hasChoosetoDoComponentProps,
    }
  }, [JSON.stringify(configArray)])

  const toDoStatisticCheckbox = toDoCompoentProps.unChoosetoDoComponentProps.map((item) => {
    return (
      <Checkbox key={item.code} value={item.code}>
        {item.name}
      </Checkbox>
    )
  })

  const toDoStatisticHasCheck = toDoCompoentProps.hasChoosetoDoComponentProps.map((item) => {
    return <HasCheckItem key={item.code}>{item.name}</HasCheckItem>
  })

  return (
    <Modal
      maskClosable={false}
      title="其他统计配置"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureAddEvent()}
    >
      <Form form={form}>
        <CommonTitle>通知栏</CommonTitle>
        <Form.Item name="type">
          <Checkbox.Group>
            {toDoStatisticCheckbox}
            {toDoStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddOtherStatisticModal
