import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';
import { Moment } from 'moment';

interface TerminalUnitParams {
  serialNumber: string;
  provice: string;
  company: string;
  orderNumber: number;
  differentialAccount: string;
  differentialPwd: string;
  expiryTime: Moment;
  remark: string;
}

interface ItemDetailData extends TerminalUnitParams {
  id: string;
}

//获取选中数据
export const getTerminalUnitDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/TerminalUnit/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增字段映射
export const addTerminalUnitItem = (params: TerminalUnitParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/TerminalUnit/Create`, { method: 'POST', data: params }),
  );
};

//编辑字段映射
export const updateTerminalUnitItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/TerminalUnit/Modify`, { method: 'POST', data: params }),
  );
};

// 删除字段映射
export const deleteTerminalUnitItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/TerminalUnit/DeleteById`, { method: 'GET', params: { id } }),
  );
};
