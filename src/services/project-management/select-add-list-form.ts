import request from '@/utils/request';
import { baseUrl, cyRequest } from '../common';
/**
 * 返回的用户信息
 * value：需要的信息
 * text：名字
 */
export interface UserInfo {
  //绑定关系用的信息
  value: string;
  // 用户信息
  text: string;
}
export function queryOuterAuditUserByPhoneAndUsername(keyWord: string) {
  return cyRequest<UserInfo>(() =>
    request(`${baseUrl.companyUser}/CompanyUser/QueryOuterAuditUser`, {
      method: 'POST',
      data: { keyWord },
    }),
  );
}
