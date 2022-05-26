import {
  featchSubstationTreeData,
  getTransformerSubstationMenu,
} from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
import { Tree } from 'antd'
import { useEffect, useState } from 'react'
import { KVLEVELOPTIONS } from '../DrawToolbar/GridUtils'

const SubstationTree = () => {
  const { data } = useRequest(() => getTransformerSubstationMenu())

  const [checkedKeys, setCheckedKeys] = useState<string[]>([])

  const treeData = [
    {
      title: '变电站',
      key: '0-1',
      children: data?.map((item, index) => {
        return {
          ...item,
          title: item.name,
          key: `0-1-${index}`,
          children: item.lineKVLevelGroups.map(
            (
              child: { kvLevel: number; lines: { name: string; id: string }[] },
              childIndex: number
            ) => {
              const childTitle = KVLEVELOPTIONS.find((kv) => kv.kvLevel === child.kvLevel)
              return {
                ...child,
                title: childTitle ? childTitle.label : '未知电压',
                key: `0-1-${index}-${childIndex}`,
                children: child.lines.map((children: { name: string; id: string }) => {
                  return {
                    ...children,
                    title: children.name,
                    key: children.id,
                  }
                }),
              }
            }
          ),
        }
      }),
    },
  ]

  const { data: TreeData, run: getTreeData } = useRequest(
    () => featchSubstationTreeData(checkedKeys),
    {
      manual: true,
      onSuccess: () => {
        //! 请求网架数据，调用绘制方法 console.log(TreeData, '55555')
      },
    }
  )

  useEffect(() => {
    checkedKeys.length && getTreeData()
  }, [checkedKeys, getTreeData])

  const getSubstationTreeData = (checkedKeys: any) => {
    const checkedIds = checkedKeys.filter((item: string) => !item.includes('-'))
    setCheckedKeys(checkedIds)
  }

  return <Tree checkable defaultExpandAll onCheck={getSubstationTreeData} treeData={treeData} />
}
export default SubstationTree
