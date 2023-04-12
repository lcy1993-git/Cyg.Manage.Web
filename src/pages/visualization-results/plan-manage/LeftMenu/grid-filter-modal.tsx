import { ReloadOutlined } from '@ant-design/icons'
import { Button, Form, Modal, Cascader } from 'antd'
import { useTreeContext } from './TreeContext'
import UrlSelect from '@/components/url-select'
import CyFormItem from '@/components/cy-form-item'
import { useMyContext } from '../Context'

interface Props {
  visible: boolean
  onSure?: (arg0: any) => void
  onCancel?: () => void
  onChange: (arg0: boolean) => void
}

const GridFilterModal: React.FC<Props> = ({ visible, onChange, onCancel }) => {
  const { setKvLevels, setAreasId, isFilterTree, setIsFilterTree } = useTreeContext()
  const { areaData } = useMyContext()
  const kvOps = [
    { label: '10kV', value: 3 },
    { label: '20kV', value: 4 },
    { label: '35kV', value: 5 },
    { label: '110kV', value: 6 },
    { label: '330kV', value: 7 },
  ]
  const [form] = Form.useForm()
  const sureEvent = () => {
    form.validateFields().then((values) => {
      setKvLevels(values.kvLevels)
      setAreasId(values.areas)
      setIsFilterTree(!isFilterTree)
    })
    onChange(false)
  }

  const onReset = () => {
    form.setFieldsValue({
      kvLevels: [],
      areas: [],
    })
    setKvLevels(form.getFieldValue('kvLevels'))
    setAreasId(form.getFieldValue('areas'))
    setIsFilterTree(!isFilterTree)
    onChange(false)
  }

  const footer = [
    <Button style={{ width: 68 }} onClick={onReset} key="reset">
      <ReloadOutlined />
      重置
    </Button>,
    <Button style={{ width: 68 }} onClick={sureEvent} type="primary" key="sure">
      确定
    </Button>,
  ]
  const selectStyle = {
    maxTagPlaceholder: (e: any[]) => `已选择${e.length}项`,
    maxTagCount: 0,
    maxTagTextLength: 2,
  }

  return (
    <Modal
      title="筛选"
      visible={visible}
      onCancel={onCancel ?? (() => onChange(false))}
      cancelText="重置"
      width={450}
      footer={footer}
      maskClosable={false}
    >
      <Form form={form}>
        <CyFormItem name="kvLevels" label="电压等级">
          <UrlSelect
            {...selectStyle}
            defaultData={kvOps}
            allowClear
            mode="multiple"
            valuekey="value"
            titlekey="label"
            dropdownMatchSelectWidth={168}
            className="widthAll"
            placeholder="选择电压等级"
            style={{ width: 300 }}
          />
        </CyFormItem>
        <CyFormItem name="areas" label="区域">
          <Cascader options={areaData} style={{ width: 300 }} />
        </CyFormItem>
      </Form>
    </Modal>
  )
}

export default GridFilterModal
