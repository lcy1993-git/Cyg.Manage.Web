import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { MapRef } from './hooks'

export interface MyContextType {
  mapRef: MapRef
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
  // 是否刷新所属厂站
  lineAssemble: boolean
  setlineAssemble: Dispatch<SetStateAction<boolean>>
  isRefresh: boolean
  setisRefresh: Dispatch<SetStateAction<boolean>>
  zIndex: string
  setzIndex: Dispatch<SetStateAction<string>>
  setpageDrawState: Dispatch<SetStateAction<boolean>>
  pageDrawState: boolean
  checkLineIds: string[]
  setcheckLineIds: Dispatch<SetStateAction<string[]>>
}

// 全局状态管理
export const MyContext = createContext({} as MyContextType)

export const MyWorkProvider = MyContext.Provider

export const useMyContext = () => useContext(MyContext)
