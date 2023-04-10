import {
  editEngineer,
  getCityAreas,
  getEngineerInfo,
} from '@/services/project-management/all-project'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Form, message, Modal, Spin } from 'antd'
import moment from 'moment'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import CreateEngineerForm from '../create-engineer-form'

interface EditEngineerProps {
  engineerId: string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: () => void
  minStart?: number
  maxEnd?: number
}

const EditEngineerModal: React.FC<EditEngineerProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [requestLoading, setRequestLoading] = useState(false)
  const [areaId, setAreaId] = useState<string>('')
  const [libId, setLibId] = useState<string>('')
  const [canChange, setCanChange] = useState<boolean>(false)
  // const [loading, setLoading] = useState<boolean>(false)
  const [city, setCity] = useState<any[]>([])
  const [form] = Form.useForm()

  const { engineerId, changeFinishEvent, minStart, maxEnd } = props

  const mapHandleCityData = (data: any) => {
    return {
      label: data.shortName,
      value: data.id,
      children: data.children
        ? [
            { label: '无', value: `${data.id}_null`, children: undefined },
            ...data.children.map(mapHandleCityData),
          ]
        : undefined,
    }
  }

  //获取区域
  const {
    data: cityData,
    run: getAreaData,
    loading: cityLoading,
  } = useRequest(getCityAreas, {
    manual: true,
    onSuccess: () => {
      if (cityData) {
        setCity(cityData.data)
      }
    },
  })

  const afterHandleData = useMemo(() => {
    return city?.map(mapHandleCityData)
  }, [JSON.stringify(city)])

  const {
    data: engineerInfo,
    run,
    loading,
  } = useRequest(() => getEngineerInfo(engineerId), {
    manual: true,
    onSuccess: async () => {
      const provinceValue = [
        engineerInfo?.province,
        engineerInfo?.city ? engineerInfo?.city : `${engineerInfo?.province}_null`,
        engineerInfo?.area
          ? engineerInfo?.area
          : engineerInfo?.city
          ? `${engineerInfo?.city}_null`
          : undefined,
      ]
      await getAreaData()
      form.setFieldsValue({
        ...engineerInfo,
        compileTime: engineerInfo?.compileTime ? moment(engineerInfo?.compileTime) : null,
        startTime: engineerInfo?.startTime ? moment(engineerInfo?.startTime) : null,
        endTime: engineerInfo?.endTime ? moment(engineerInfo?.endTime) : null,
        importance: String(engineerInfo?.importance),
        grade: String(engineerInfo?.grade),
        inventoryOverviewId: engineerInfo?.inventoryOverviewId
          ? engineerInfo?.inventoryOverviewId
          : 'none',
        warehouseId: engineerInfo?.warehouseId ? engineerInfo?.warehouseId : 'none',
        province: provinceValue,
      })

      setAreaId(engineerInfo?.province ?? '')
      setLibId(engineerInfo?.libId ?? '')

      setCanChange(true)
    },
  })

  useEffect(() => {
    if (state) {
      run()
    }
  }, [state])

  const edit = () => {
    form.validateFields().then(async (value) => {
      try {
        const { province } = value
        const [provinceNumber, city, area] = province
        await editEngineer({
          id: engineerId,
          ...value,
          province: !isNaN(provinceNumber) ? provinceNumber : '',
          city: !isNaN(city) ? city : '',
          area: !isNaN(area) ? area : '',
        })
        message.success('工程信息更新成功')
        setState(false)
        form.resetFields()
        changeFinishEvent?.()
      } catch (msg) {
        console.error(msg)
      } finally {
        setRequestLoading(false)
      }
    })
  }

  return (
    <Modal
      maskClosable={false}
      title="编辑工程信息"
      width={750}
      visible={state as boolean}
      destroyOnClose={true}
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" loading={requestLoading} onClick={() => edit()}>
          保存
        </Button>,
      ]}
      onOk={() => edit()}
      onCancel={() => setState(false)}
    >
      <Form form={form} preserve={false}>
        <Spin spinning={loading || cityLoading}>
          <CreateEngineerForm
            form={form}
            canChange={canChange}
            areaId={areaId}
            libId={libId}
            minStart={minStart}
            maxEnd={maxEnd}
            provinceData={afterHandleData}
          />
        </Spin>
      </Form>
    </Modal>
  )
}

export default EditEngineerModal
