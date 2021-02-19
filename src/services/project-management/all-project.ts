import request from '@/utils/request';
import { cyRequest, baseUrl } from '../common';
import { TableRequestResult } from '../table';

export enum ProjectCategory {
    "10KV线路" = 1,
    "配变台区",
    "低压线路"
}

export enum ProjectType {
    "农网改造升级项目" = 1,
    "城镇配网工程",
    "无电地区电力建设"
}

export enum ProjectStage {
    "可研" = 2,
    "初设",
    "施工图",
    "竣工图"
}

export enum BuildType {
    "新建" = 1,
    "改造",
    "扩建",
    "配套输出"
}

export enum ProjectNature {
    "贫困村" = 1,
    "深度贫困村" = 2,
    "小康用电" = 4,
    "煤改电" = 8,
    "三区京州" = 16,
    "井井通电" = 32,
    "小城镇(中心村)" = 64,
    "村村通动力电" = 128,
    "迎峰度冬项目" = 256,
    "迎峰度夏项目" = 512,
    "灾后恢复项目" = 1024,
    "易地扶贫搬迁" = 2048,
    "其他" = 4096
}

export enum ProjectVoltageClasses {
    "无",
    "交流20kv",
    "交流10kv",
    "交流380v"
}

export enum ProjectStatus {
    "待安排" = 1,
    "待勘察",
    "待结项",
    "待申请结项",
    "已结项",
}

export enum StatisticalCategory {
    "待处理" = 1,
    "进行中",
    "委托",
    "被共享"
}

export interface AllProjectStatisticsParams {
    keyWord?: string
    category?: string,
    pCategory?: string,
    stage?: string,
    constructType?: string,
    nature?: string,
    kvLevel?: string,
    status?: string,
}

export interface AllProjectSearchParams extends AllProjectStatisticsParams {
    pageIndex: number
    pageSize: number
    statisticalCategory?: string
}

// 获取列表
export const getProjectTableList = (params: AllProjectSearchParams) => {
    return cyRequest<TableRequestResult>(() => request(`${baseUrl.project}/Porject/GetPagedList`,{method: "POST", data: params}))
}

interface ProjectTableStatisticsResult {
    total: number
    awaitProcess: number
    inProgress: number
    delegation: number
    beShared: number
}

// 获取统计的值
export const getProjectTableStatistics = (params: AllProjectStatisticsParams) => {
    return cyRequest<ProjectTableStatisticsResult>(() => request(`${baseUrl.project}/Porject/GetStatistical`,{method: "POST", data: params}))
}


