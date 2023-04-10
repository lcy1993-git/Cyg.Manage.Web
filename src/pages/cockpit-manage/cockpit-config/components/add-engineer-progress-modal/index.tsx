import CommonTitle from '@/components/common-title'
import { useControllableValue } from 'ahooks'
import { Modal, Checkbox, Form } from 'antd'
import uuid from 'node-uuid'
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { getHasChooseComponentsProps } from '../../utils'
import HasCheckItem from '../has-check-item'

interface AddEngineerProcessStatistic {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: (componentProps: any) => void
  configArray: any[]
}

const processComponentPropsArray = [{ code: 'gantt', name: '甘特图' }]

const AddEngineerProcessModal: React.FC<AddEngineerProcessStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { changeFinishEvent, configArray } = props
  const [form] = Form.useForm()

  const sureAddEvent = () => {
    form.validateFields().then((values) => {
      const { type } = values
      const componentProps = [...type]

      if (type) {
        setState(false)

        changeFinishEvent?.([
          {
            name: 'projectProgress',
            key: uuid.v1(),
            x: 0,
            y: 0,
            w: 3,
            h: 11,
            componentProps: componentProps,
          },
        ])
        form.resetFields()
      }
    })
  }

  const processCompoentProps = useMemo(() => {
    const hasChooseProgressComponentCodeArray = getHasChooseComponentsProps(
      configArray,
      'projectProgress'
    )
    const unChooseProgressComponentProps = processComponentPropsArray.filter(
      (item) => !hasChooseProgressComponentCodeArray?.includes(item.code)
    )
    const hasChooseProgressComponentProps = processComponentPropsArray.filter((item) =>
      hasChooseProgressComponentCodeArray?.includes(item.code)
    )
    return {
      hasChooseProgressComponentProps,
      unChooseProgressComponentProps,
    }
  }, [JSON.stringify(configArray)])

  const processStatisticCheckbox = processCompoentProps.unChooseProgressComponentProps.map(
    (item) => {
      return (
        <Checkbox key={item.code} value={item.code}>
          {item.name}
        </Checkbox>
      )
    }
  )

  const processStatisticHasCheck = processCompoentProps.hasChooseProgressComponentProps.map(
    (item) => {
      return <HasCheckItem key={item.code}>{item.name}</HasCheckItem>
    }
  )

  return (
    <Modal
      maskClosable={false}
      title="工程进度统计配置"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureAddEvent()}
    >
      <Form form={form}>
        <CommonTitle>甘特图</CommonTitle>
        <Form.Item name="type">
          <Checkbox.Group>
            {processStatisticCheckbox}
            {processStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddEngineerProcessModal
