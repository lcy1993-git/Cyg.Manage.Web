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
  groupId: string;
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
  groupId: string;
  designOrganize: string;
  frameTemplate: string;
  directoryTemplate: string;
  descriptionTemplate: string;
}

export const getCompanyDefaultOptions = (groupId: string) => {
  return cyRequest<DefaultOptionsParams>(() =>
    request(`${baseUrl.project}/CompanyFileGroup/GetDefaultOptions`, {
      method: 'GET',
      params: { groupId },
    }),
  );
};

export const updateCompanyDefaultOptions = (params: DefaultOptionsParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyFileGroup/SaveDefaultOptions`, {
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

  return cyRequest<string>(() =>
    request(uploadUrl, {
      method: 'POST',
      data: formData,
      requestType: 'form',
    }),
  );
};

//公司文件组别接口

interface FileGroupParams {
  name: string;
  remark: string;
}

export const addFileGroupItem = (params: FileGroupParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyFileGroup/Create`, { method: 'POST', data: params }),
  );
};

export const deleteFileGroupItem = (id: string) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/CompanyFileGroup/DeleteById`, { method: 'GET', params: { id } }),
  );
};

//下载公司文件接口
export const downLoadFileItem = (params: any) => {
  return request(`${baseUrl.upload}/Download/GetFileById`, {
    method: 'GET',
    params,
    responseType: 'blob',
  });
};
