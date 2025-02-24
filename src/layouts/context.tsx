import { createContext, SetStateAction, useContext } from 'react'

interface LayoutContextValue {
  clearWs?: () => void
  newSocket?: WebSocket
  setNewSocket?: (value: WebSocket) => void
  resourceManageFlag?: boolean
  workHandoverFlag?: boolean
  clearAgainLogin?: () => void
  mapSelectCity?: string
  allProjectSearchParams?: any
  setResourceManageFlag?: (value: boolean) => void
  setMapSelectCity?: (value: string) => void
  setWorkHandoverFlag?: (value: boolean) => void

  setAllProjectSearchParams?: (value?: any) => void
  removeTab?: (value: string) => void
  /** 预设计 */
  preDesignItem?: any
  setPreDesignItem: React.Dispatch<SetStateAction<any>>
  favoriteFlag?: boolean
  setFavoriteFlag?: (value: boolean) => void

  /**规划网架 */
  ref: any //存储列表ref
  setRef: any

  pointData: any
  setPointData: React.Dispatch<SetStateAction<any>> //立项后获取框选数据
  lineStressSagFlag?: boolean
  setLineStressSagFlag: (value: boolean) => void
  resourceLibApprovalListFlag?: boolean // 审批管理页面审批、驳回后刷新审批列表页面
  setResourceLibApprovalListFlag: (value: boolean) => void
}

const LayoutContext = createContext({} as LayoutContextValue)

export const LayoutProvider = LayoutContext.Provider

export const useLayoutStore = () => useContext(LayoutContext)
