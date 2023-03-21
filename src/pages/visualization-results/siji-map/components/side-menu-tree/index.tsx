import exportMediaLight from '@/assets/icon-image/menu-tree-icon/导出多媒体-light.png'
import exportMedia from '@/assets/icon-image/menu-tree-icon/导出多媒体.png'
import { useLayoutStore } from '@/layouts/context'
import EngineerDetailInfo from '@/pages/project-management/all-project/components/engineer-detail-info'
import ProjectDetailInfo from '@/pages/project-management/all-project/components/project-detail-info'
import { downloadMapPositon } from '@/services/visualization-results/list-menu'
import {
  downloadMediaZipFile,
  fetchAreaEngineerProjectListByParams,
  fetchCommentCountById,
  fetchCompanyEngineerProjectListByParams,
  ProjectListByAreaType,
} from '@/services/visualization-results/side-tree'
import { ProjectList } from '@/services/visualization-results/visualization-results'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { AlignLeftOutlined, LeftOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons'
import { useMount, useRequest, useSize, useUpdateEffect } from 'ahooks'
import { Button, DatePicker, Input, message, Modal, Tree } from 'antd'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import React, { FC, useEffect, useRef, useState } from 'react'
import { useContainer } from '../../mobx-store'
import { flattenDeepToKey, getSelectKeyByKeyword, TreeNodeType } from '../../../utils/utils'
import CommentModal from '../comment-modal'
import ControlLayers from '../control-layers'
import ExportMapPositionModal from '../export-map-position-modal'
import FilterModal from '../filter-modal'
import MaterialModal from '../material-modal'
import MigrateDataModal from '../migrate-data-modal'
import ResultModal from '../result-modal'
import SiderMenuAreaButtons from '../side-menu-area-buttons'

import MenuTree from './components/menu-tree'
import styles from './index.less'
import { getMoveData } from '@/pages/visualization-results/utils/mapClick'
import SidePopup from '../side-popup'

const { RangePicker } = DatePicker

export interface SideMenuProps {
  className?: string
  onChange: () => void
  sideMenuVisibel: boolean
  controlLayersProps: any
  sidePopupProps: any
}

type Moment = moment.Moment | undefined

// 用于判断是否页面为初次请求数据状态，是则为true
let isFirstRequest: boolean

/**
 * 判断按钮区与tree数据层级的关系比较
 */
function deepKeyArray(data: TreeNodeType[], flag1: boolean, index: number, keyArray: any) {
  data.forEach((item: TreeNodeType) => {
    const levelCategoryFlag =
      item.levelCategory < 4 ? item.levelCategory === index + 1 : item.levelCategory === index + 2
    const flag = flag1 || levelCategoryFlag
    if (flag) {
      keyArray.push(item.key)
    }
    if (Array.isArray(item.children)) {
      deepKeyArray(item.children, flag, index, keyArray)
    }
  })
}

/**
 * 把传进来的projectList数据转换成需要的数组类型
 * @param projectList
 * @returns TreeNodeType[]
 */
function generateProjectTree(projectList: ProjectListByAreaType[]): TreeNodeType[] {
  return projectList.map((v) => {
    return {
      title: v.name,
      id: v.id,
      key: Math.random().toString(36).slice(2),
      engineerId: v.parentId,
      parentId: v.parentId,
      levelCategory: v.levelCategory,
      propertys: v.propertys,
      children: v.children ? generateProjectTree(v.children) : [],
    }
  })
}

function generatorProjectInfoItem(item: TreeNodeType): ProjectList {
  return {
    id: item.id,
    time: moment(item.propertys?.endTime).format('YYYY-MM-DD'),
    engineerId: item.engineerId ?? '',
    status: item.propertys?.status,
    isExecutor: item.propertys?.isExecutor,
  }
}

type KeyType =
  | React.Key[]
  | {
      checked: React.Key[]
      halfChecked: React.Key[]
    }

const SideTree: FC<SideMenuProps> = observer((props: SideMenuProps) => {
  // 项目详情
  const [projectModalActiveId, setProjectModalActiveId] = useState<string>('')
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false)

  const [engineerModalActiveId, setEngineerModalActiveId] = useState<string>('')
  const [engineerModalVisible, setEngineerModalVisible] = useState<boolean>(false)

  const [keyWord, setkeyWord] = useState('')
  // 筛选
  const [filterModalVisibel, setFilterModalVisibel] = useState<boolean>(false)
  // 成果管理
  const [resultVisibel, setResultVisibel] = useState<boolean>(false)
  // 审阅消息
  const [commentModalVisible, setCommentModalVisible] = useState<boolean>(false)
  // 多媒体下载
  const [mediaLoadVisibel, setMediaLoadVisibel] = useState<boolean>(false)
  const [mediaLoading, setMediaLoading] = useState<boolean>(false)
  const [buttonActive, setButtonActive] = useState<number>(-1)
  const { mapSelectCity, setMapSelectCity } = useLayoutStore()
  // 勘察轨迹
  // const [surveyModalVisible, setSurveyModalVisible] = useState(false)
  // const [surveyModalData, setSurveyModalData] = useState(null)
  // Tree State
  const [selectArrayStuck, setSelectArrayStuck] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [checkedKeys, setCheckedKeys] = useState<KeyType>([])
  const [treeData, setTreeData] = useState<TreeNodeType[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  // 地区or公司状态
  const [tabActiveKey, setTabActiveKey] = useState<string>('1')
  const [checkedProjectIds, setCheckedProjectIds] = useState<any[]>([])

  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  //  卸载清楚请求次数
  useMount(() => {
    setExpandedKeys(['-1'])
    isFirstRequest = true
  })
  // 验证审阅消息是否含有数据
  const { data: commentCountResponseData, run: fetchCommentCountRquest } = useRequest(
    () => fetchCommentCountById(checkedProjectIdList[0].id),
    {
      manual: true,
      onSuccess: () => {
        if (!commentCountResponseData?.totalQty) {
          message.warn('当前项目不存在审阅消息')
        } else {
          setCommentModalVisible(true)
        }
      },
    }
  )
  const handlerCommentClick = () => {
    fetchCommentCountRquest()
  }

  useEffect(() => {
    if (!Array.isArray(treeData) || treeData.length === 0) return
    let selectArray: any[] = []
    if (isFirstRequest) {
      if (buttonActive === 2) {
        // 初次请求初始化默认省级状态
        deepKeyArray(treeData, false, 2, selectArray)

        setSelectedKeys(selectArray)

        setExpandedKeys(flattenDeepToKey(treeData, 2, 'key', '-1'))
      } else if (buttonActive === -1) {
        // alert(-111111111111)
      }
      isFirstRequest = false
    } else {
      // 实时搜索定位
      setButtonActive(4)
      setSelectedKeys(getSelectKeyByKeyword(treeData, keyWord))
      setExpandedKeys(flattenDeepToKey(treeData, 5, 'key', '-1'))
    }
  }, [JSON.stringify(treeData)])

  // 处理关闭项目详情模态框，没有关闭选中状态的bug
  useEffect(() => {
    if (!projectModalVisible) {
      setSelectedKeys([])
      setSelectedKeys(selectArrayStuck)
    }
  }, [projectModalVisible])

  const [exportMapPositionModalVisible, setexportMapPositionModalVisible] = useState<boolean>(false)
  const [migrateDataModalVisible, setMigrateDataModalVisible] = useState<boolean>(false)

  const [materialModalVisible, setMaterialModalVisible] = useState<boolean>(false)

  const startDateRef = useRef<any>(null)
  const endDateRef = useRef<any>(null)
  const sideMenuRef = useRef<HTMLDivElement>(null)
  const { height: sidePopupHeight } = useSize(sideMenuRef)

  // const [startDateValue, setStartDateValue] = useState<Moment>(undefined);
  // const [endDateValue, setEndDateValue] = useState<Moment>(undefined);
  const [dateRange, setDateRange] = useState<[Moment, Moment]>([undefined, undefined])

  // 判断开始时间不能大于结束时间
  const compareData = (start: Moment, end: Moment) => {
    if (start && end) {
      if (start.valueOf() > end.valueOf()) {
        message.error('开始时间不能大于结束时间')
        return false
      }
    }
    return true
  }

  const [exportMapPositionLoading, setexportMapPositionLoading] = useState<boolean>(false)
  const store = useContainer()
  const { vState } = store
  const { checkedProjectIdList, checkedProjectDateList } = vState
  const [filterCondition, setfilterCondition] = useState<any>({ haveAnnotate: 0 })
  /**
   * 根据用户实时选择的数据动态添加初始和截至时间
   */
  useEffect(() => {
    if (checkedProjectIdList.length === 0) {
      setDateRange([undefined, undefined])
    } else {
      const checkedProject = checkedProjectDateList || [undefined]
      let start = moment(checkedProject[0])
      let end = moment(checkedProject[checkedProject.length - 1])
      setDateRange([start.isValid() ? start : undefined, end.isValid() ? end : undefined])
    }
  }, [checkedProjectIdList.length])

  const { className, onChange, sideMenuVisibel } = props
  const activeStyle = (key: string) => (tabActiveKey === key ? '#0e7b3b' : '#000')

  useEffect(() => {
    setTreeData([])
    clearState()
    setSelectedKeys([])
    // setButtonActive(-1);
  }, [tabActiveKey])

  useEffect(() => {
    clearState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCondition])

  const clearState = () => {
    setCheckedKeys([])
    store.setProjectIdList([])
  }

  const isProjectLevel = (level: number | TreeNodeType): boolean =>
    typeof level === 'number' ? level === 6 : level.levelCategory === 6

  const generatorProjectInfoList = (list: TreeNodeType[]) => list.map(generatorProjectInfoItem)

  /**
   *
   * @param list key key不是id，是随机生成的随机数，id是v.id
   * @returns
   */
  const getKeyList = (list: TreeNodeType[]) => list.map((v: TreeNodeType) => v.key)

  const whichTabToFetch = () =>
    tabActiveKey === '1'
      ? fetchAreaEngineerProjectListByParams(filterCondition)
      : fetchCompanyEngineerProjectListByParams(filterCondition)

  const initSideTree = (data: TreeNodeType[]) => {
    /**
     * 由于有从可视化界面点击的功能，所以在点过来以后，
     * 做的任何改变树的操作都要避免自动展开可视化点击过来的城市
     *
     * 判断是否需要展开和选中从可视化界面跳转过来的城市
     * 通过localstorage是否存在来判断，用了以后立即清除这样可以当其他操作刷新tree的时候
     * 可以不用做额外的标记来判断
     *
     */

    const selectCity = mapSelectCity

    if (selectCity) {
      const { expanded, checked } = getSelectCityExpanedAndCheckedProjectKeys(data, selectCity)

      setMapSelectCity?.('')
      setExpandedKeys([...expanded])
      setCheckedKeys(getKeyList(checked))
      store.setProjectIdList(generatorProjectInfoList(checked))
    } else {
      setExpandedKeys(['-1'])
      clearState()
    }
  }

  useUpdateEffect(() => {
    if (mapSelectCity) {
      if (treeListReponseData?.length) {
        setTreeData(treeData)
        initSideTree(treeData)
        // 修复初次请求默认到县级的bug
      } else {
        setTreeData([])
        message.warning('无数据')
      }
    }
  }, [mapSelectCity])

  /**
   * 从可视化界面跳转过来自动展开地区项目，并选中所有项目
   * @param items
   * @returns
   */
  const getSelectCityExpanedAndCheckedProjectKeys = (
    items: TreeNodeType[],
    selectCity: string
  ): { expanded: string[]; checked: TreeNodeType[] } => {
    const reg = new RegExp('^[0-9]*$')
    const expanded = new Array<string>()
    const checked = new Array<TreeNodeType>()

    const dfsByName = (node: TreeNodeType, isSelect: boolean) => {
      const { children, key, title, levelCategory } = node

      expanded.push(key)
      if (title === selectCity) {
        children?.forEach((v) => {
          dfsByName(v, true)
        })
        return
      }

      if (isSelect) {
        isProjectLevel(levelCategory) ? checked.push(node) : expanded.push(key)
        children?.forEach((v) => {
          dfsByName(v, isSelect)
        })
      } else {
        children?.forEach((v) => {
          dfsByName(v, isSelect)
        })
        expanded.pop()
      }
    }

    const dfsById = (node: TreeNodeType, isSelect: boolean) => {
      const { children, key, id, levelCategory } = node
      expanded.push(key)
      if (id === selectCity) {
        children?.forEach((v) => {
          dfsById(v, true)
        })
        return
      }

      if (isSelect) {
        isProjectLevel(levelCategory) ? checked.push(node) : expanded.push(key)
        children?.forEach((v) => {
          dfsById(v, isSelect)
        })
      } else {
        children?.forEach((v) => {
          dfsById(v, isSelect)
        })
        expanded.pop()
      }
    }

    if (reg.test(selectCity) || selectCity.includes('_other')) {
      items.forEach((v) => {
        dfsById(v, false)
      })
    } else {
      items.forEach((v) => {
        dfsByName(v, false)
      })
    }

    return { expanded, checked }
  }

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue)
  }

  const onCheck = (checked: KeyType, info: any) => {
    let temp = info.checkedNodes.filter((v: TreeNodeType) => isProjectLevel(v.levelCategory))
    //去重,这里考虑到按公司筛选的时候，不同的公司可以有同一个项目
    let res = _.unionBy(generatorProjectInfoList(temp), (item: ProjectList) => item.id)

    store.setProjectIdList(res)

    setCheckedKeys(checked)
    const ids = []
    for (let i = 0; i < info.checkedNodes.length; i++) {
      if (info.checkedNodes[i].levelCategory === 6) {
        ids.push(info.checkedNodes[i].id)
      }
    }
    setCheckedProjectIds(ids)
  }

  const onTabChange = (key: string) => {
    setTabActiveKey(key)
  }

  const { data: treeListReponseData, loading: treeListDataLoading } = useRequest(whichTabToFetch, {
    throttleInterval: 1000,
    refreshDeps: [filterCondition, tabActiveKey],
    throwOnError: true,
    onSuccess: () => {
      // setTreeData([]);
      // clearState();
      // setSelectedKeys([]);
      if (treeListReponseData?.length) {
        const data = generateProjectTree(treeListReponseData)

        setTreeData(data)
        initSideTree(data)
        // 修复初次请求默认到县级的bug
      } else {
        setTreeData([])
        // message.warning('无数据')
      }
    },
    onError: () => {
      message.error('获取数据失败')
    },
  })

  const getLayerstype = () => {
    if (
      props.controlLayersProps.designLayerVisible &&
      !props.controlLayersProps.dismantleLayerVisible
    ) {
      return 1
    } else if (
      !props.controlLayersProps.designLayerVisible &&
      props.controlLayersProps.dismantleLayerVisible
    ) {
      return 2
    }
    return 0
  }

  const handlerAreaButtonCheck = (index: number, buttonActive: number) => {
    if (index === buttonActive) {
      setButtonActive(-1)
      setSelectedKeys([])
      return
    }
    const resKey = flattenDeepToKey(treeData, index <= 2 ? index : index + 1, 'key', '-1')
    let selecyKeyArray: string[] = []
    if (index < 0) {
      setSelectedKeys(selecyKeyArray)
    } else {
      deepKeyArray(treeData, false, index, selecyKeyArray)
      setSelectedKeys(selecyKeyArray)
    }

    setExpandedKeys(resKey)
    setButtonActive(index)
  }

  const treeNodeRender = (data: any) => {
    return data.map((item: any) => {
      let rest = {}
      if (item.children && Array.isArray(item.Children)) {
        return (
          <Tree.TreeNode
            key={item.key}
            title={item.title}
            checkable
            {...rest}
            children={treeNodeRender(item.children)}
          />
        )
      } else {
        return <Tree.TreeNode key={item.key} title={item.title} checkable />
      }
    })
  }

  const { data: mapPosition, run: downloadMapPositonRequest } = useRequest(downloadMapPositon, {
    manual: true,
    onSuccess: (data) => {
      if (data.type === 'application/json') {
        message.error('导出坐标失败，请联系运维人员！')
        setexportMapPositionModalVisible(false)
        setexportMapPositionLoading(false)
        return
      }
      const a = document.createElement('a')
      a.download = '项目坐标.zip'
      const blob = new Blob([mapPosition], { type: 'application/zip;charset=utf-8' })
      // text指需要下载的文本或字符串内容
      a.href = window.URL.createObjectURL(blob)
      // 会生成一个类似blob:http://localhost:8080/d3958f5c-0777-0845-9dcf-2cb28783acaf 这样的URL字符串
      document.body.appendChild(a)
      a.click()
      a.remove()
      message.success('导出成功')
      setexportMapPositionModalVisible(false)
      setexportMapPositionLoading(false)
    },
    onError: () => {
      message.warn('导出失败')
      setexportMapPositionModalVisible(false)
      setexportMapPositionLoading(false)
    },
  })

  const { data: mediaData, run: downloadMediaRequest } = useRequest(downloadMediaZipFile, {
    manual: true,
    onSuccess: () => {
      const a = document.createElement('a')
      a.download = '多媒体文件.zip'
      const blob = new Blob([mediaData], { type: 'application/zip;charset=utf-8' })
      // text指需要下载的文本或字符串内容
      a.href = window.URL.createObjectURL(blob)
      // 会生成一个类似blob:http://localhost:8080/d3958f5c-0777-0845-9dcf-2cb28783acaf 这样的URL字符串
      document.body.appendChild(a)
      a.click()
      a.remove()
      setMediaLoading(false)
      setMediaLoadVisibel(false)
    },
    onError: () => {
      message.warn('导出失败')
    },
  })

  const onOkWithExportMapPosition = () => {
    downloadMapPositonRequest(checkedProjectIdList.map((item) => item.id))
    setexportMapPositionLoading(true)
  }
  const onOkMediaClick = () => {
    downloadMediaRequest(checkedProjectIdList.map((item) => item.id))
    setMediaLoading(true)
  }

  useEffect(() => {
    if (Array.isArray(dateRange)) {
      store.setDateRange({
        startDate: dateRange[0] ? moment(dateRange[0]).format('YYYY/MM/DD') : dateRange?.[0],
        endDate: dateRange[1] ? moment(dateRange[1]).format('YYYY/MM/DD') : dateRange?.[1],
      })
    } else {
      store.setDateRange({
        startDate: undefined,
        endDate: undefined,
      })
    }
  }, [dateRange])

  const renderExtraFooter = () => {
    return (
      <div className={styles.extraFooterWrap}>
        <div style={styles.buttomItem}>
          <Button
            type="link"
            onClick={() => {
              if (!checkedProjectDateList || checkedProjectDateList.length === 0) {
                message.error('当前未选择项目')
              } else {
                let start = moment(checkedProjectDateList[0])
                // setStartDateValue(start.isValid() ? start : message.error('项目中有项目开始时间未设置') && undefined);
                setDateRange([
                  start.isValid()
                    ? start
                    : message.error('项目中有项目开始时间未设置') && undefined,
                  dateRange[1],
                ])
              }
              startDateRef && startDateRef.current?.blur()
            }}
          >
            定位最早项目时间
          </Button>
        </div>
        <div style={styles.buttomItem}>
          <Button
            type="link"
            onClick={() => {
              if (!checkedProjectDateList || checkedProjectDateList.length === 0) {
                message.error('当前未选择项目')
              } else {
                let end = moment(checkedProjectDateList[checkedProjectDateList.length - 1])
                // setEndDateValue(end.isValid() ? end : message.error('项目中有项目开始截至未设置') && undefined);
                setDateRange([
                  dateRange[0],
                  end.isValid() ? end : message.error('项目中有项目结束时间未设置') && undefined,
                ])
              }
              endDateRef && endDateRef.current?.blur()
            }}
          >
            定位最晚项目时间
          </Button>
        </div>
      </div>
    )
  }

  const onSelect = (e: any, g: any) => {
    // 代表点击的是项目
    if (g.node.levelCategory && g.node.levelCategory === 6) {
      setSelectedKeys([g.node.key])
      setProjectModalActiveId(g.node.id)
      setProjectModalVisible(true)
      setSelectArrayStuck(selectedKeys)
    }
    // 代表点击的是工程
    if (g.node.levelCategory && g.node.levelCategory === 5) {
      setSelectedKeys([g.node.key])
      setEngineerModalVisible(true)
      setEngineerModalActiveId(g.node.id)
      setSelectArrayStuck(selectedKeys)
    }
  }

  const treeProps = {
    onExpand: onExpand,
    onCheck: (checked: any, info: any) => onCheck(checked, info),
    // treeData: treeData,
    className: classNames(styles.sideMenu),
    onSelect: onSelect,
  }

  const handlerPositionClick = (flag: any) => {
    if (Array.isArray(flag) && flag.length > 0) {
      setexportMapPositionModalVisible(true)
    } else {
      message.error('当前未选择项目')
    }
  }
  const handlerMigrateDataClick = (flag: any) => {
    const data = getMoveData(store.vState.map)
    if (!data || (data && data.length === 0)) {
      message.error('请选择需要迁移的数据')
      return
    }

    for (let i = 0; i < data.length; i++) {
      let str = data[i].values_.id_
      let arr = str.split('.')[0].split('_')
      let type = arr.shift()
      if (type !== 'survey' && type !== 'plan') {
        message.error('只能迁移勘察图层与方案图层')
        return
      }
    }
    if (checkedProjectIds.length > 1) {
      message.error('只能迁移单个项目的数据')
      return
    }
    if (Array.isArray(flag) && flag.length > 0) {
      setMigrateDataModalVisible(true)
    } else {
      message.error('当前未选择项目')
    }
  }

  const downLoadMedia = (list: any[]) => {
    if (list.length > 0) {
      setMediaLoadVisibel(true)
    } else {
      message.error('当前未选择项目')
    }
  }

  const handlerMaterialClick = (flag: any) => {
    if (Array.isArray(flag) && flag.length > 0) {
      setMaterialModalVisible(true)
    } else {
      message.error('当前未选择项目')
    }
  }

  const isClickAble = () => {
    if (Array.isArray(checkedProjectIdList) && checkedProjectIdList?.length === 1) {
      return true
    } else if (Array.isArray(checkedProjectIdList) && checkedProjectIdList?.length === 0) {
      message.error('当前未选择项目')
    } else if (Array.isArray(checkedProjectIdList) && checkedProjectIdList?.length > 1) {
      message.error('多选状态下不可操作')
    }
    return false
  }

  return (
    <div
      ref={sideMenuRef}
      className={`${styles.wrap} ${projectModalVisible ? styles.wrapSelect : ''}`}
    >
      <div className={styles.searchWrap}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="请输入工程/项目名称"
          value={keyWord}
          onChange={(e) => {
            setkeyWord(e.target.value)
            setfilterCondition({ ...filterCondition, keyWord: e.target.value })
          }}
          style={{ width: '78%' }}
        />
        <Button type="text" onClick={() => setFilterModalVisibel(true)}>
          <AlignLeftOutlined />
          筛选
        </Button>
      </div>
      <div className={styles.menuTree}>
        <MenuTree
          className={className!}
          onTabChange={onTabChange}
          activeStyle={activeStyle}
          tabActiveKey={tabActiveKey}
          treeListDataLoading={treeListDataLoading}
          buttonActive={buttonActive}
          handlerAreaButtonCheck={handlerAreaButtonCheck}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          checkedKeys={checkedKeys}
          treeProps={treeProps}
          treeData={treeData}
        />
      </div>
      <div className={styles.timeLine}>
        <RangePicker
          value={dateRange}
          onChange={(e) => setDateRange(e)}
          renderExtraFooter={renderExtraFooter}
        />
      </div>

      <div className={styles.buttonArea}>
        <SiderMenuAreaButtons
          buttonProps={[
            buttonJurisdictionArray?.includes('material-statistics') && {
              title: '材料统计',
              dart: require('@/assets/icon-image/menu-tree-icon/材料统计.png'),
              light: require('@/assets/icon-image/menu-tree-icon/材料统计-light.png'),
              // @ts-ignore
              onClick: () =>
                Array.isArray(checkedProjectIdList) && checkedProjectIdList?.length === 0
                  ? message.error('当前未选择项目')
                  : handlerMaterialClick(checkedProjectIdList),
              style:
                Array.isArray(checkedProjectIdList) && checkedProjectIdList?.length === 0
                  ? { opacity: 0.4 }
                  : {},
            },
            buttonJurisdictionArray?.includes('review-message') && {
              title: '审阅消息',
              dart: require('@/assets/icon-image/menu-tree-icon/审阅消息.png'),
              light: require('@/assets/icon-image/menu-tree-icon/审阅消息-light.png'),
              onClick: () =>
                Array.isArray(checkedKeys) && checkedKeys?.length === 0
                  ? message.error('当前未选择项目')
                  : handlerCommentClick(),
              style:
                Array.isArray(checkedKeys) && checkedKeys?.length === 0 ? { opacity: 0.4 } : {},
            },

            buttonJurisdictionArray?.includes('export-media') && {
              title: '导出多媒体',
              dart: exportMedia,
              light: exportMediaLight,
              onClick: () => downLoadMedia(checkedProjectIdList),
              style:
                Array.isArray(checkedProjectIdList) && checkedProjectIdList?.length === 0
                  ? { opacity: 0.4 }
                  : {},
            },
            buttonJurisdictionArray?.includes('export-coordinates') && {
              title: '导出坐标',
              dart: require('@/assets/icon-image/menu-tree-icon/导出坐标.png'),
              light: require('@/assets/icon-image/menu-tree-icon/导出坐标-light.png'),
              onClick: () => handlerPositionClick(checkedProjectIdList),
              style:
                Array.isArray(checkedProjectIdList) && checkedProjectIdList?.length === 0
                  ? { opacity: 0.4 }
                  : {},
            },
            buttonJurisdictionArray?.includes('migrate-data') && {
              title: '迁移数据',
              dart: require('@/assets/icon-image/menu-tree-icon/迁移数据.png'),
              light: require('@/assets/icon-image/menu-tree-icon/迁移数据-light.png'),
              onClick: () => handlerMigrateDataClick(checkedProjectIdList),
              style:
                Array.isArray(checkedProjectIdList) && checkedProjectIdList?.length === 0
                  ? { opacity: 0.4 }
                  : {},
            },
          ]}
        />
      </div>
      <div className={styles.controlLayers}>
        <ControlLayers {...props.controlLayersProps} />
      </div>
      <div className={styles.handlerSideBarVisibelButton} onClick={() => onChange()}>
        {sideMenuVisibel ? (
          <LeftOutlined style={{ fontSize: 10 }} />
        ) : (
          <RightOutlined style={{ fontSize: 10 }} />
        )}
      </div>
      <ExportMapPositionModal
        confirmLoading={exportMapPositionLoading}
        visible={exportMapPositionModalVisible}
        onCancel={() => setexportMapPositionModalVisible(false)}
        onOk={onOkWithExportMapPosition}
      />
      <MigrateDataModal
        visible={migrateDataModalVisible}
        onChange={setMigrateDataModalVisible}
        projectIds={checkedProjectIds}
      />
      <Modal
        title="导出多媒体"
        onOk={onOkMediaClick}
        confirmLoading={mediaLoading}
        visible={mediaLoadVisibel}
        onCancel={() => {
          setMediaLoading(false)
          setMediaLoadVisibel(false)
        }}
        destroyOnClose={true}
      >
        确认导出所选项目的多媒体文件
      </Modal>
      <MaterialModal
        checkedProjectIdList={checkedProjectIdList?.map((v: ProjectList) => v.id)}
        visible={materialModalVisible}
        onCancel={() => setMaterialModalVisible(false)}
        onOk={() => setMaterialModalVisible(false)}
        layerstype={getLayerstype()}
      />
      <div>
        {sidePopupHeight && <SidePopup {...props.sidePopupProps} height={sidePopupHeight} />}
      </div>

      {projectModalVisible && (
        <ProjectDetailInfo
          projectId={projectModalActiveId}
          visible={projectModalVisible}
          onChange={setProjectModalVisible}
        />
      )}
      {engineerModalVisible && (
        <EngineerDetailInfo
          engineerId={engineerModalActiveId}
          visible={engineerModalVisible}
          onChange={setEngineerModalVisible}
        />
      )}
      <ResultModal
        projectId={checkedProjectIdList[0]?.id ?? ''}
        visible={resultVisibel}
        onChange={setResultVisibel}
      />
      <CommentModal
        visible={commentModalVisible}
        onOk={() => setCommentModalVisible(false)}
        onCancel={() => setCommentModalVisible(false)}
        checkedProjectIdList={checkedProjectIdList}
      />
      <FilterModal
        defaultData={filterCondition}
        visible={filterModalVisibel}
        onChange={setFilterModalVisibel}
        onSure={(values) => setfilterCondition({ ...values, keyWord })}
      />
    </div>
  )
})

export default SideTree
