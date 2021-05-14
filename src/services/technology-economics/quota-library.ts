import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

// 获取定额库列表

export const getQuotaLibrary = () => {
  return cyRequest(() => 
    request(`${baseUrl.tecEco}/Quota/GetQuotaLibrary`, {method: 'POST'})
  )
}

// export const getQuotaLibrary = () => {
//   return cyRequest(() => 
//     request(`http://10.6.1.36:8033/api/Quota/GetQuotaLibrary`, {method: 'POST'})
//   )
// }
