import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';
import qs from 'qs';

interface CompanyFileItemParams {
  name: string;
  companyId: string;
  fileId: string;
  fileCategory: number;
  fileCategoryText: string;
  describe: string;
  createdOn: string;
}

interface ItemDetailData extends CompanyFileItemParams {
  id: string;
}

//获取选中数据
export const getCompanyFileDetail = (id: string) => {
  return cyRequest<ItemDetailData>(() =>
    request(`${baseUrl.project}/CompanyFile/GetById`, { method: 'GET', params: { id } }),
  );
};

//新增公司文件
export const addCompanyFileItem = (params: CompanyFileItemParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyFile/Create`, { method: 'POST', data: params }),
  );
};

//编辑公司文件
export const updateCompanyFileItem = (params: ItemDetailData) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyFile/Modify`, { method: 'POST', data: params }),
  );
};

// 删除公司文件
export const deleteCompanyFileItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyFile/DeleteById`, { method: 'GET', params: { id } }),
  );
};

/**成果默认参数 接口*/

// export interface GetTreeByCategory {
//   text: string;
//   id: string;
//   children: GetTreeByCategory[];
// }

interface DefaultOptionsParams {
  designOrganize: string;
  frameTemplate: string;
  directoryTemplate: string;
  descriptionTemplate: string;
  approve: string;
  audit: string;
  calibration: string;
  designSurvey: string;
}

//获取文件类别Tree
export const getCompanyFileTree = () => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/CompanyFile/GetTreeByCategory`, { method: 'GET' }),
  );
};

export const getCompanyDefaultOptions = () => {
  return cyRequest<DefaultOptionsParams>(() =>
    request(`${baseUrl.project}/CompanyFile/GetCompanyDefaultOptions`, { method: 'GET' }),
  );
};

export const updateCompanyDefaultOptions = (params: DefaultOptionsParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyFile/ModifyCompanyDefaultOptions`, {
      method: 'POST',
      data: params,
    }),
  );
};

export const uploadCompanyFile = (files: any[], params: any, url: string) => {
  const formData = new FormData();
  files.forEach((item) => {
    formData.append('file', item);
  });

  const uploadUrl = `${baseUrl.upload}${url}?${qs.stringify(params)}`;

  return cyRequest<any[]>(() =>
    request(uploadUrl, {
      method: 'POST',
      data: formData,
      requestType: 'form',
    }),
  );
};
