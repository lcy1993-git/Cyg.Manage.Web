import { createContext, Dispatch, SetStateAction, useContext } from 'react'

export interface MyContextType {
  /** 手动绘制数据 工具栏状态 */
  drawToolbarVisible: boolean
  setdrawToolbarVisible: Dispatch<SetStateAction<boolean>>
  /***
   * 当前选中的城市
   * */
  selectCity: {
    code?: string
    lat: string
    lng: string
    name: string
  }
  setselectCity: Dispatch<SetStateAction<MyContextType['selectCity']>>
  importModalVisible: boolean
  setImportModalVisible: Dispatch<SetStateAction<boolean>>
}

// 全局状态管理
export const MyContext = createContext({} as MyContextType)

export const MyWorkProvider = MyContext.Provider

export const useMyContext = () => useContext(MyContext)
