import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';

interface ImportProject {
  engineeringTemplateId: string;
  file: File;
}
/**
 * 将对象传参formData格式化
 * @param params 传参的对象
 * @returns 对象formData实例
 */
const formData = (params: Object) => {
  const form = new FormData();
  for (let k in params) {
    if (k === 'file') {
      form.append(k, params[k]?.[0]);
    } else {
      form.append(k, params[k]);
    }
  }
  return form;
};
// 获取工程目录树状结构
export const getEngineeringTemplateTreeData = (
  engineeringTemplateId: string,
  projectType: number,
) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.tecEco1}/EngineeringTemplateCatalog/GetEngineeringTemplateCatalogTree`, {
      method: 'GET',
      params: { engineeringTemplateId, projectType },
    }),
  );
};
// 导入目录
export const importProject = (data: ImportProject) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/EngineeringTemplateCatalog/ImportEngineeringTemplateCatalog`, {
      method: 'POST',
      data: formData(data),
    }),
  );
};
//下载模板
export const downLoadTemplate = (params: any) => {
  return request(`${baseUrl.tecEco1}/EngineeringTemplateCatalog/DownloadTemplate`, {
    method: 'GET',
    params,
    responseType: 'blob',
  });
};
