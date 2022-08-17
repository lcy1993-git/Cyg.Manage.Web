import {
  deleteLine,
  // getLineCompoment,
  getTransformerSubstationMenu,
} from '@/services/grid-manage/treeMenu'
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { message, Modal, Tree } from 'antd'
import { EventDataNode } from 'antd/es/tree'
import { Key, useEffect, useState } from 'react'
import EquipLineList from '../../components/line-equip-list'
import { useMyContext } from '../Context'
import { KVLEVELOPTIONS, LINE, POWERSUPPLY, TRANSFORMERSUBSTATION } from '../DrawToolbar/GridUtils'
import { useTreeContext } from './TreeContext'

interface infoType {
  event: React.MouseEvent<Element, MouseEvent>
  node: EventDataNode & {
    id?: string
    name?: string
  }
}

interface TreeSelectType {
  event: 'select'
  selected: boolean
  node: EventDataNode
  selectedNodes: {
    title: string
    key: string
    name?: string
    kvLevel?: number
    isOverhead?: boolean
    id?: string
    children: any[] | undefined
  }[]
  nativeEvent: MouseEvent
}

const SubstationTree = () => {
  const { data, run: getTree } = useRequest(
    () => getTransformerSubstationMenu({ kvLevels: kvLevels, ...transformAreaId(areasId) }),
    {
      manual: true,
      onSuccess: () => {
        settreeLoading(true)
      },
      onError: () => {
        settreeLoading(true)
      },
    }
  )
  const { isRefresh, setIsRefresh, companyId } = useMyContext()
  const { linesId, setlinesId, setsubStations, settreeLoading, kvLevels, areasId, isFilterTree } =
    useTreeContext()
  // 编辑线路模态框状态
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [currentLineId, setCurrentLineId] = useState<string>('')
  //当前点击线路标题
  const [lineTitle, setLineTitle] = useState<string>('')
  const transformAreaId = (areasId: any) => {
    const [province, city, county] = areasId
    return {
      province: !isNaN(province) ? province : '',
      city: !isNaN(city) ? city : '',
      area: !isNaN(county) ? county : '',
    }
  }

  const transformTreeData = (tree: any) => {
    return tree?.map((item: any, index: any) => {
      return {
        ...item,
        title:
          companyId !== item.companyId ? (
            <>
              <InfoCircleOutlined style={{ color: '#2d7de3' }} title="子公司项目" />
              <span style={{ paddingLeft: '3px' }}> {item.name}</span>
            </>
          ) : (
            item.name
          ),
        key: `${item.id}_&${TRANSFORMERSUBSTATION}`,
        type: TRANSFORMERSUBSTATION,
        children: item.lineKVLevelGroups.map(
          (
            child: { kvLevel: number; lines: { name: string; id: string }[]; id: string },
            childIndex: number
          ) => {
            const childTitle = KVLEVELOPTIONS.find((kv) => kv.kvLevel === child.kvLevel)
            return {
              ...child,
              title: childTitle ? childTitle.label : '未知电压',
              type: 'KVLEVEL',
              key: `0=1=${item.id}=${childIndex}`,
              children: child.lines.map((children: { name: string; id: string }) => {
                return {
                  ...children,
                  title: children.name,
                  type: LINE,
                  key: `${children.id}_&Line${item.id}_&${TRANSFORMERSUBSTATION}_KVLEVEL0=1=${item.id}=${childIndex}_&Parent0-1`,
                }
              }),
            }
          }
        ),
      }
    })
  }
  const transformTreeStructure = (tree: any) => {
    return tree?.map((item: any) => {
      return {
        key: item.key,
        type: item.type,
        title: item.title,
        children:
          item.key === 'Province_Other'
            ? transformTreeData(item.data)
            : item.children.map((item: any) => {
                if (item.data && item.data.length > 0) {
                  return {
                    key: item.key,
                    title: item.title,
                    type: 'city',
                    children: transformTreeData(item.data),
                  }
                }
                return {
                  key: item.key,
                  type: item.type,
                  title: item.title,
                  children: item.children.map((item: any) => {
                    return {
                      key: item.key,
                      type: item.type,
                      title: item.title,
                      children: transformTreeData(item.data),
                    }
                  }),
                }
              }),
      }
    })
  }
  const treeData = [
    {
      title: '变电站',
      type: 'Parent',
      key: '0=1',
      children: transformTreeStructure(data),
    },
  ]
  // 右键删除线路
  const onRightClick = (info: infoType) => {
    const { node } = info
    if (node && !node.children) {
      Modal.confirm({
        title: '确认删除该条线路吗？',
        icon: <ExclamationCircleOutlined />,
        content: `${node.name}`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteLine([node.id])
            setIsRefresh(!isRefresh)
            message.info('删除成功')
            const currentSelectLineIds = linesId.filter((item) => item !== node.id)
            setlinesId(currentSelectLineIds)
          } catch (err) {
            message.error('删除失败')
          }
        },
      })
    }
  }

  useEffect(() => {
    getTree()
  }, [getTree, isRefresh, isFilterTree])

  // 点击左键，编辑线路数据
  const onSelect = async (_selectedKeys: Key[], info: TreeSelectType) => {
    const { selectedNodes } = info

    if (selectedNodes.length && !selectedNodes[0].children && selectedNodes[0].id) {
      //   setcurrentFeatureId(selectedNodes[0].id)
      //   const data = await getLineData(selectedNodes[0].id)
      //   const lines = await getLineCompoment([selectedNodes[0].id])
      //   // @ts-ignore
      //   const length = getTotalLength(lines.lineRelationList)
      //   selectedNodes[0].kvLevel && setcurrentLineKvLevel(selectedNodes[0].kvLevel)
      const lineIdStr = selectedNodes[0].key

      const end = lineIdStr.indexOf('_&Line')
      if (end !== -1) {
        setCurrentLineId(lineIdStr.substring(0, end))
      }
      setLineTitle(selectedNodes[0].title)
      setIsModalVisible(true)

      //   form.setFieldsValue({
      //     ...data,
      //     totalLength: length.toFixed(1),
      //     lineType: selectedNodes[0].isOverhead ? 'Line' : 'CableCircuit',
      //   })
      //   setselectLineType(selectedNodes[0].isOverhead ? 'Line' : 'CableCircuit')
    }
  }

  // checkbox状态改变触发
  const getSubstationTreeData = async (checkedKeys: any, e: any) => {
    const SubstationIds: string[] = checkedKeys
      .map((item: string) => {
        const start = item.indexOf('_&Line')
        const end = item.indexOf('_&TransformerSubstation')
        if (start !== -1 && end !== -1) {
          return item.substring(start + 6, end)
        }
        const idStr = item.indexOf('_&TransformerSubstation')
        if (idStr !== -1) {
          return item.split('_&')[0]
        }
        return undefined
      })
      .filter(Boolean)
    setsubStations([...new Set(SubstationIds)])

    const currentLineId = checkedKeys
      .map((item: string) => {
        const isSubstation = item.includes(`_&Line`)
        if (isSubstation) {
          return item
        }
        return undefined
      })
      .filter((item: string) => item)

    const currentLinesId = [
      ...currentLineId,
      ...linesId.filter((item) => item.indexOf(POWERSUPPLY) !== -1),
    ]
    setlinesId([...new Set(currentLinesId)])
  }

  return (
    <>
      <Tree
        checkable
        defaultExpandAll
        onCheck={getSubstationTreeData}
        onRightClick={onRightClick}
        onSelect={onSelect}
        treeData={treeData}
      />

      <EquipLineList
        visible={isModalVisible}
        onChange={setIsModalVisible}
        lineTitle={lineTitle}
        lineId={currentLineId}
      />
    </>
  )
}
export default SubstationTree
