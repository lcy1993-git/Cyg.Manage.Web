import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';


// 查询总算表数据
export const querySocialSecurityHouseFundTree = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/SocialSecurityHouseFund/QuerySocialSecurityHouseFundTree`,
      { method: 'GET'}),
  );
}
// 导入费率表
export const importSocialSecurityHouseFund = (file: File) => {
  const data = new FormData();
  data.append('file', file)
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/SocialSecurityHouseFund/ImportSocialSecurityHouseFund`, {method: 'POST', data})
  )
}
