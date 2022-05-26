import { getTransformerSubstationMenu } from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
import { Tree } from 'antd'
import { useState } from 'react'

const SubstationTree = () => {
  const { data } = useRequest(() => getTransformerSubstationMenu())
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1'])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

  const onExpand = (expandedKeysValue: React.Key[]) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }
  const onCheck = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue)
  }
  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue)
  }
  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={data}
    />
  )
}
export default SubstationTree
