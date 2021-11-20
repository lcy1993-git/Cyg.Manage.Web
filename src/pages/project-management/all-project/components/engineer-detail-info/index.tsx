import ReadonlyItem from '@/components/readonly-item'
import { getEngineerInfo } from '@/services/project-management/all-project'
import { useControllableValue, useRequest } from 'ahooks'
import { Modal, Tooltip } from 'antd'
import moment from 'moment'
import React, { Dispatch, SetStateAction, useEffect } from 'react'

interface EngineerDetailInfoProps {
  engineerId: string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
}

const EngineerDetailInfo: React.FC<EngineerDetailInfoProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })

  const { engineerId } = props

  const { data: engineerInfo, run } = useRequest(() => getEngineerInfo(engineerId), {
    manual: true,
  })

  useEffect(() => {
    if (state) {
      run()
    }
  }, [state])

  return (
    <Modal
      maskClosable={false}
      title="工程详情"
      width={680}
      destroyOnClose
      visible={state as boolean}
      footer={null}
      onCancel={() => setState(false)}
    >
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="工程名称">
            <Tooltip title={engineerInfo?.name} placement="topLeft">
              {engineerInfo?.name}
            </Tooltip>
          </ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="资源库">{engineerInfo?.libName}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="编制单位">
            <Tooltip title={engineerInfo?.organization} placement="topLeft">
              {engineerInfo?.organization}
            </Tooltip>
          </ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="协议库存">
            {engineerInfo?.inventoryOverviewName == '__'
              ? '无'
              : engineerInfo?.inventoryOverviewName}
          </ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="利旧库存协议">
            {engineerInfo?.warehouseName == '_' ? '无' : engineerInfo?.warehouseName}
          </ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="编制人">
            <Tooltip title={engineerInfo?.compiler} placement="topLeft">
              {engineerInfo?.compiler}
            </Tooltip>
          </ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="重要程度">{engineerInfo?.importanceText}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="所属公司">{engineerInfo?.company}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="项目级别">{engineerInfo?.gradeText}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="计划年度">{engineerInfo?.plannedYear}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="区域">
            <span>{engineerInfo?.provinceName}</span>
            {engineerInfo?.cityName && <span>/{engineerInfo?.cityName}</span>}
            {engineerInfo?.areaName && <span>/{engineerInfo?.areaName}</span>}
          </ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="编制时间">
            {engineerInfo?.compileTime
              ? moment(engineerInfo?.compileTime).format('YYYY-MM-DD')
              : ''}
          </ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="工程日期">
            {engineerInfo?.startTime ? moment(engineerInfo?.startTime).format('YYYY-MM-DD') : ''}至
            {engineerInfo?.endTime ? moment(engineerInfo?.endTime).format('YYYY-MM-DD') : ''}
          </ReadonlyItem>
        </div>
      </div>
    </Modal>
  )
}

export default EngineerDetailInfo
