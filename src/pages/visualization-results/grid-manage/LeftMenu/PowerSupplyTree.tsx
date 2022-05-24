import { Tree } from 'antd'
import { useState } from 'react'

const PowerSupplyTree = () => {
  const treeData = [
    {
      title: '变电站',
      key: '0-0',
      children: [
        {
          // title: () => {
          //   return <span style={{color: 'red', width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
          //     '330KV变asdasdasdasd电czx山东高速对方水电费水电费水电费站'
          //   </span>
          // },
          title: '330KV变电站',
          key: '0-0-0',
          children: [
            { title: '330KV房屋变电站', key: '0-0-0-0' },
            { title: '330KV道路变电站', key: '0-0-0-1' },
            { title: '330KV河流变电站', key: '0-0-0-2' },
          ],
        },
        {
          title: '220KV变电站',
          key: '0-0-1',
          children: [
            { title: '220KV民阿卡哈师大看空间看就好了客家话啊用变电站', key: '0-0-1-0' },
            { title: '220KV商用变电站', key: '0-0-1-1' },
            { title: '220KV军事变电站', key: '0-0-1-2' },
          ],
        },
        {
          title: '110KV变电站',
          key: '0-0-2',
        },
      ],
    },
  ]
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1'])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['0-0-0'])
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
      showIcon={true}
      blockNode={true}
      // titleRender={(item) => {
      //   return <div style={{color: 'red', width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
      //     sdfg树大招风水电费水电费是的发送到发送到发送到发斯蒂芬</div>
      // }}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeData}
    />
  )
}
export default PowerSupplyTree
