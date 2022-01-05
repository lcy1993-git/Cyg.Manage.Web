import { makeAutoObservable } from 'mobx'
import React, { createContext, useContext } from 'react'
const initState = {
  activeValue: {
    id: '1',
    name: '基本设计费',
  },
  rightTabList: [],
  rightTileList: [],
  rightTabId: '',
  contentList: [],
  currentList: [],
  currentRow: [],
  currentIndex: [],
  cIndex: 0, // 当前点击横向index
  hIndex: 0, // 当前点击竖index
  allList: [],
  loading: true,
}

// eslint-disable-next-line require-jsdoc
function createStore(state: any) {
  return makeAutoObservable({
    state,
    async getTableData(projectType: number) {},
    setActiveValue(item: any) {
      this.state.activeValue = item
    },
    setRightTabList(list: any[]) {
      this.state.rightTabList = list
    },
    setLoading(bool: boolean) {
      this.state.loading = bool
    },
    setRightTile(list: any[]) {
      this.state.loading = false
      list.map((item: any) => {
        item.selected = false
      })
      let allList: any[] = []
      allList = [...list]
      this.state.rightTileList = allList
      let newList: any[] = []
      newList.push(allList)
      const showData: any = {}
      showData.data = [...list]
      showData.hIndex = ''
      showData.backgroundColor = false
      const data: any[] = []
      data.push(showData)

      this.state.allList = data
      this.setContentList(list)
    },
    updateLeftTab(list: any[]) {
      this.state.rightTabId = list[0].id
    },
    setRightTabId(id: string) {
      this.state.rightTabId = id
    },
    setAllList() {
      this.state.allLis = []
    },
    setContentList(list: any[]) {
      const allList: any[] = []
      list.map((res: any) => {
        if (res.formulaName) {
          allList.push(res)
        } else {
          allList.push({})
        }
      })
      this.state.contentList = allList
    },
    reduceData(list: any[]) {
      list.reduce((r, c) => {}, [])
    },
    treeToArray(tree: any[]) {
      let arr: any[] = []
      const expanded = (datas: any) => {
        if (datas && datas.length > 0) {
          datas.forEach((e: any) => {
            arr.push(e)
            expanded(e.childs)
          })
        }
      }
      expanded(tree)
      return arr
    },
    setCurrentRow(row: any, cInd: number, hIndex: number) {
      if (row.childs && row.childs.length > 0) {
        const nowList = JSON.parse(JSON.stringify(this.state.allList))
        nowList.splice(cInd + 1)
        const showData: any = {}
        showData.data = [...row.childs]
        // showData.hIndex = 0
        nowList[cInd + 1] = showData
        nowList[cInd].data = this.returnNewList(nowList[cInd].data, row.id, true)
        nowList[cInd].hIndex = hIndex + ''

        this.state.allList = nowList
        this.state.cIndex = cInd
      }
    },
    setCancelSelectRow(row: any, cInd: number, hIndex: number) {
      if (row.childs && row.childs.length > 0) {
        const nowList = JSON.parse(JSON.stringify(this.state.allList))
        nowList.splice(cInd + 1)
        nowList[cInd].data = this.returnNewList(nowList[cInd].data, row.id, false)
        nowList[cInd].hIndex = ''
        this.state.allList = nowList
        this.state.cIndex = cInd
        // 如果要点击取消选中 TODO
      }
    },
    showBackground(row: any, cInd: number, hIndex: number) {
      if (!row.childs.length) {
        const nowList = JSON.parse(JSON.stringify(this.state.allList))
        nowList.map((item: any) => {
          item.data = this.changeOtherBack(item.data, row.id)
          return item
        })
        this.state.allList = nowList
      }
    },
    returnItem(list: any[], id: string) {
      list.map((res: any) => {
        if (res.id === id) {
        }
      })
    },
    returnNewList(list: any[], id: string, bool: boolean) {
      list.map((res: any, index: number) => {
        if (res.id === id && bool) {
          res.selected = true
          res.hIndex = index
        } else {
          res.selected = false
        }
      })
      return list
    },
    changeOtherBack(list: any[], id: string) {
      list.map((res: any) => {
        if (res.id === id) {
          res.backgroundColor = true
        } else {
          if (res.childs && res.childs.length > 0) {
            res.backgroundColor = false
            this.changeOtherBack(res.childs, id)
          }
          res.backgroundColor = false
        }
      })
      return list
    },
  })
}

const store = createStore(initState)
const StateContext = createContext(store)

// eslint-disable-next-line require-jsdoc
function useExpressionContainer() {
  return useContext(StateContext)
}
// eslint-disable-next-line require-jsdoc
const ExpressionProvider: React.FC = ({ children }) => (
  <StateContext.Provider value={store}>{children}</StateContext.Provider>
)

export { useExpressionContainer, ExpressionProvider }
