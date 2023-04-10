import CommonTitle from '@/components/common-title'
import { useControllableValue } from 'ahooks'
import { Modal, Checkbox, Form } from 'antd'
// import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { getHasChooseComponentsProps } from '../../../utils'
import HasCheckItem from '../../has-check-item'

interface EditProjectCaseStatistic {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: (componentProps: any) => void
  currentRecord: any
  configArray: any[]
}

const caseComponentPropsArray = [
  { code: 'status', name: '项目状态' },
  { code: 'nature', name: '项目性质' },
]

const EditProjectCaseModal: React.FC<EditProjectCaseStatistic> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { changeFinishEvent, currentRecord, configArray } = props
  const [form] = Form.useForm()

  const sureEditEvent = () => {
    form.validateFields().then((values) => {
      const { condition } = values

      setState(false)

      changeFinishEvent?.({
        name: 'projectSchedule',
        key: currentRecord.key,
        x: 0,
        y: 0,
        w: 3,
        h: 11,
        componentProps: condition,
      })
    })
  }

  useEffect(() => {
    if (currentRecord.componentProps && currentRecord.componentProps.length > 0) {
      form.setFieldsValue({ condition: currentRecord.componentProps })
    }
  }, [JSON.stringify(currentRecord.componentProps)])

  const caseComponentProps = useMemo(() => {
    const hasChooseCaseCodeArray = getHasChooseComponentsProps(configArray, 'projectSchedule')
    const currentCaseProps = caseComponentPropsArray.filter((item) =>
      currentRecord.componentProps?.includes(item.code)
    )
    const unChooseCaseProps = caseComponentPropsArray.filter(
      (item) => !currentRecord.componentProps?.includes(item.code)
    )
    return {
      hasChooseCaseCodeArray,
      unChooseCaseProps,
      currentCaseProps,
    }
  }, [JSON.stringify(configArray)])

  const caseStatisticCheckbox = caseComponentProps.currentCaseProps.map((item) => {
    return (
      <Checkbox key={item.code} value={item.code}>
        {item.name}
      </Checkbox>
    )
  })

  const caseStatisticHasCheck = caseComponentProps.unChooseCaseProps.map((item) => {
    if (caseComponentProps.hasChooseCaseCodeArray.includes(item.code)) {
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
      title="配置-项目情况"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureEditEvent()}
    >
      <Form form={form}>
        <CommonTitle>项目情况</CommonTitle>
        <Form.Item name="condition">
          <Checkbox.Group>
            {caseStatisticCheckbox}
            {caseStatisticHasCheck}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditProjectCaseModal
