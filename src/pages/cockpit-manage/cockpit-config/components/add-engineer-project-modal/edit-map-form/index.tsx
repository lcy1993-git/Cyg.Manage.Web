import CommonTitle from '@/components/common-title'
import { useControllableValue } from 'ahooks'
import { Modal, Checkbox, Form } from 'antd'
import React, { Dispatch, SetStateAction, useEffect } from 'react'

interface EditEngineerAndModalProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: (componentProps: any) => void
  currentRecord: any
}

const EditEngineerAndMapModal: React.FC<EditEngineerAndModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { changeFinishEvent, currentRecord } = props
  const [form] = Form.useForm()

  const sureAddEvent = () => {
    form.validateFields().then((values) => {
      // const { mapComponent, personLoad, projectRefreshData, projectProgress } = values;
      for (let k in values) {
        changeFinishEvent?.({
          name: 'mapComponent',
          key: currentRecord.key,
          x: 0,
          y: 0,
          w: 3,
          h: 11,
          componentProps: values[k],
        })
      }

      setState(false)

      // changeFinishEvent?.({
      //   name: 'mapComponent',
      //   key: currentRecord.key,
      //   x: 0,
      //   y: 0,
      //   w: 3,
      //   h: 11,
      //   componentProps: mapComponent,
      // });
    })
  }

  useEffect(() => {
    if (currentRecord.componentProps && currentRecord.componentProps.length > 0) {
      form.setFieldsValue({ area: currentRecord.componentProps })
    }
  }, [JSON.stringify(currentRecord.componentProps)])

  return (
    <Modal
      maskClosable={false}
      title="配置-项目管控"
      width={750}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => sureAddEvent()}
    >
      <Form form={form}>
        <CommonTitle>地图</CommonTitle>
        <Form.Item name="mapComponent">
          <Checkbox.Group>
            <Checkbox value="province">项目数量（地图）</Checkbox>
            {/* <Checkbox value="city">市</Checkbox> */}
          </Checkbox.Group>
        </Form.Item>
        <CommonTitle>生产负荷</CommonTitle>
        <Form.Item name="personLoad">
          <Checkbox.Group>
            <Checkbox value="person">生产负荷(员工)</Checkbox>
            <Checkbox value="department">生产负荷(部组)</Checkbox>
            <Checkbox value="company">生产负荷(公司)</Checkbox>
            {/* <Checkbox value="city">市</Checkbox> */}
          </Checkbox.Group>
        </Form.Item>
        <CommonTitle>实时数据</CommonTitle>
        <Form.Item name="projectRefreshData">
          <Checkbox.Group>
            <Checkbox value="projectRefreshData">实时数据</Checkbox>
            {/* <Checkbox value="city">市</Checkbox> */}
          </Checkbox.Group>
        </Form.Item>
        <CommonTitle>甘特图</CommonTitle>
        <Form.Item name="projectProgress">
          <Checkbox.Group>
            <Checkbox value="gantt">甘特图</Checkbox>
            {/* <Checkbox value="city">市</Checkbox> */}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditEngineerAndMapModal
