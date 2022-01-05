import PageCommonWrap from '@/components/page-common-wrap'
import {
  getExpressionTemplateList,
  getExpressionTemplateSheetMenuList,
} from '@/services/technology-economic/expression'
import { observer } from 'mobx-react-lite'
import qs from 'qs'
import React, { useEffect } from 'react'
import styles from './index.less'
import RightTab from './rightTab'
import { ExpressionProvider, useExpressionContainer } from './store'
import TableImportButton from './table-import-button'
const leftList = [
  { id: '1', name: '基本设计费' },
  { id: '2', name: '施工费' },
  { id: '3', name: '建筑取费表' },
  { id: '4', name: '安装取费表' },
  { id: '5', name: '设备购置费' },
  { id: '6', name: '拆除取费表' },
  { id: '7', name: '其他费用' },
  { id: '8', name: '总算表' },
]

const Expression: React.FC = observer(() => {
  const store = useExpressionContainer()
  const { activeValue, loading } = store.state
  const id = (qs.parse(window.location.href.split('?')[1]).id as string) || ''
  // const [activeValue, setActiveValue] = useState<ListData>({
  //   id: '1',
  //   name: '基本设计费',
  // })
  const getTableData = async (name?: string) => {
    store.setLoading(true)
    let res = await getExpressionTemplateList({
      engineeringTemplateId: id,
      engineeringTemplateName: name ? name : activeValue.name,
    })
    const list: any[] = res as []
    if (list && list.length > 0 && list[0].childs && list[0].childs.length > 0) {
      store.setRightTabList(list[0].childs)
      const result = await getExpressionTemplateSheetMenuList(list[0].childs[0].id)
      const newList: any[] = result as []
      store.updateLeftTab(newList)
      newList && newList.length > 0 && store.setRightTile(newList)
    }
  }
  useEffect(() => {
    getTableData()
  }, [])

  const listDataElement = leftList.map((item: any, index) => {
    return (
      <div
        className={`${styles.listElementItem} ${
          item.id === activeValue.id ? styles.listActive : ''
        }`}
        key={item.id}
        onClick={() => {
          store.setAllList()
          store.setActiveValue(item)
          getTableData(item.name)
        }}
      >
        {item.name}
      </div>
    )
  })
  const setSuccessful = () => {
    getTableData()
  }
  return (
    <PageCommonWrap>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px' }}>
          <div>表达式编辑器变量菜单</div>
          <TableImportButton
            extraParams={{ EngineeringTemplateId: id }}
            buttonTitle={'导入'}
            requestSource={'tecEco1'}
            setSuccessful={setSuccessful}
            importUrl={'/ExpressionTrees/AddExpressionTrees'}
          />
        </div>
        <div className={styles.contentDiv}>
          <div className={styles.containerLeft}>
            <div className={styles.listElement}>{listDataElement}</div>
          </div>
          <div className={styles.containerRight}>
            {/* loading TODO */}
            {!loading && <RightTab />}
          </div>
        </div>
      </div>
    </PageCommonWrap>
  )
})
const ExpressProvider = () => {
  return (
    <ExpressionProvider>
      <Expression />
    </ExpressionProvider>
  )
}
export default ExpressProvider
