import request from '@/utils/request'
import { baseUrl, cyRequest } from '../common'

/**
 * 将对象传参formData格式化
 * @param params 传参的对象
 * @returns 对象formData实例
 */
const formData = (params: Object) => {
  const form = new FormData()
  for (let k in params) {
    if (k === 'file' || k === 'files') {
      form.append(k, params[k]?.[0])
    } else {
      form.append(k, params[k])
    }
  }
  return form
}

// 获取模板导航
export const getExpressionTemplateList = (data: any) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/ExpressionTrees/GetExpressionTemplateList`, {
      method: 'POST',
      data: data,
    })
  )
}
// 根据sheetID获取表达式目录树
export const getExpressionTemplateSheetMenuList = (id: any) => {
  return cyRequest(() =>
    request(
      `${baseUrl.tecEco1}/ExpressionTrees/GetExpressionTemplateSheetMenuList?TemplateSheetId=${id}`,
      {
        method: 'GET',
      }
    )
  )
}

// 上传表达式树
export const addExpressionTrees = (data: any) => {
  return cyRequest(() =>
    request(`${baseUrl.tecEco1}/ExpressionTrees/AddExpressionTrees`, {
      method: 'POST',
      data: formData(data),
    })
  )
}
