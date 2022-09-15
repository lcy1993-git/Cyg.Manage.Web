import React, { useState, Dispatch, SetStateAction } from 'react'
import { useControllableValue } from 'ahooks'
import { Modal, Button } from 'antd'
import { Form } from 'antd'
import CreateEngineer from '../create-engineer'
import { addEngineer, getProjectTableList } from '@/services/project-management/all-project'
import { message } from 'antd'
import { useLayoutStore } from '@/layouts/context'
import { relationProject } from '@/services/plan-manage/plan-manage'
import {
  clearBoxData,
  clearDragBoxDatas,
} from '@/pages/visualization-results/plan-manage/PlanMap/utils/initializeMap'

interface AddEngineerModalProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent?: () => void
  isPlan?: boolean
}

const AddEngineerModal: React.FC<AddEngineerModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [current, setCurrent] = useState<number>(0)
  //此处ref是用于规划网架立项后刷新列表
  const { ref, pointData } = useLayoutStore()

  const { finishEvent } = props

  const [form] = Form.useForm()

  const initParams = {
    category: [],
    stage: [],
    constructType: [],
    nature: [],
    kvLevel: [],
    status: [],
    dataSourceType: [],
    majorCategory: [],
    pType: [],
    reformAim: [],
    pCategory: [],
    attribute: [],
    sourceType: [],
    identityType: [],
    areaType: '-1',
    areaId: '',
    logicRelation: 2,
    startTime: '',
    endTime: '',
    designUser: '',
    surveyUser: '',
    pageIndex: 1,
    pageSize: 10,
  }

  const refresh = () => {
    if (ref && ref.current) {
      // @ts-ignore
      ref.current.delayRefresh()
    }
  }

  const sureAddEngineerEvent = () => {
    form.validateFields().then(async (values) => {
      try {
        setSaveLoading(true)
        const {
          projects,
          name,
          province,
          libId,
          inventoryOverviewId,
          warehouseId,
          compiler,
          compileTime,
          organization,
          startTime,
          endTime,
          company,
          plannedYear,
          importance,
          grade,
        } = values

        const [provinceNumber, city, area] = province
        await addEngineer({
          projects,
          engineer: {
            name,
            province: !isNaN(provinceNumber) ? provinceNumber : '',
            city: !isNaN(city) ? city : '',
            area: !isNaN(area) ? area : '',
            libId,
            inventoryOverviewId,
            warehouseId,
            compiler,
            compileTime,
            organization,
            startTime,
            endTime,
            company,
            plannedYear,
            importance,
            grade,
          },
        })

        if (!finishEvent) {
          const res = await getProjectTableList(initParams)
          const projectId = res?.items[0]?.projects[0]?.id

          const finalData = pointData.map((item: any) => {
            return { ...item, projectId: projectId }
          })
          await relationProject(finalData)
        }
        message.success('立项成功')
        setState(false)
        finishEvent ? finishEvent?.() : refresh()
      } catch (msg) {
        console.error(msg)
      } finally {
        setSaveLoading(false)
      }
    })
  }

  return (
    <Modal
      maskClosable={false}
      centered
      visible={state}
      bodyStyle={{
        height: current > 0 ? 800 : 450,
        overflowY: 'auto',
        padding: current > 0 ? '0 24px' : '',
      }}
      footer={[
        <>
          <Button
            key="cancle"
            onClick={() => {
              clearDragBoxDatas()
              setState(false)
            }}
          >
            取消
          </Button>
          {current > 0 ? (
            <>
              <Button key="pre" onClick={() => setCurrent(current - 1)}>
                上一步
              </Button>
              <Button
                key="save"
                type="primary"
                loading={saveLoading}
                onClick={() => sureAddEngineerEvent()}
              >
                保存
              </Button>
            </>
          ) : (
            <Button key="next" type="primary" onClick={() => setCurrent(current + 1)}>
              下一步
            </Button>
          )}
        </>,
      ]}
      width={820}
      onCancel={() => {
        clearDragBoxDatas()
        setState(false)
      }}
      title="项目立项"
      destroyOnClose
    >
      <Form form={form} preserve={false}>
        <CreateEngineer form={form} current={current} />
      </Form>
    </Modal>
  )
}

export default AddEngineerModal
