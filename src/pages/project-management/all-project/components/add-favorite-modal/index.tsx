import CyFormItem from '@/components/cy-form-item'
import CyTip from '@/components/cy-tip'
import { addCollectionEngineers, getFavorites } from '@/services/project-management/favorite-list'
import { useControllableValue, useRequest } from 'ahooks'
import { message, Modal, TreeSelect } from 'antd'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'

// import styles from './index.less';

interface ExportPowerModalParams {
  projectIds: string[]
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  finishEvent: () => void
}

const AddFavoriteModal: React.FC<ExportPowerModalParams> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [favId, setFavId] = useState<string>('')
  const [treeData, setTreeData] = useState<any>([])
  const { projectIds, finishEvent } = props

  const { data = [] } = useRequest(() => getFavorites(), {
    onSuccess: () => {
      setTreeData(data)
    },
  })

  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      key: data.id,
      children: data.children?.map(mapTreeData),
    }
  }

  const handleData = useMemo(() => {
    return treeData?.map(mapTreeData)
  }, [JSON.stringify(treeData)])

  const addToFavEvent = async () => {
    await addCollectionEngineers({
      id: favId,
      projectIds: projectIds,
    })
    message.success('操作成功')
    setState(false)
    finishEvent?.()
  }

  return (
    <Modal
      maskClosable={false}
      title="添加至项目目录"
      width={755}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => addToFavEvent()}
      cancelText="取消"
      okText="确认"
      bodyStyle={{ height: 180, padding: 0 }}
    >
      <CyTip>您已选中{projectIds.length}个项目，将添加至所选项目目录。</CyTip>
      <div style={{ padding: '30px' }}>
        <CyFormItem required label="请选择项目目录" labelWidth={108}>
          <TreeSelect
            treeData={handleData}
            treeDefaultExpandAll
            placeholder="请选择目录"
            onChange={(value: any) => setFavId(value)}
          />
        </CyFormItem>
      </div>
    </Modal>
  )
}

export default AddFavoriteModal
