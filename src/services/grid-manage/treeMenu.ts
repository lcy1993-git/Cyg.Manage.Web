import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

export const fetchGridManageMenu = () =>
  cyRequest(() => request(`${baseUrl.project}api/PowerSupply/Tree`, { method: 'GET' }))
