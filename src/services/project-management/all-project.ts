import request from '@/utils/request';
import { Moment } from 'moment';
import { cyRequest, baseUrl } from '../common';
import { TableRequestResult } from '../table';

export enum Arrangement {
  '项目委托' = 1,
  '公司成员',
  '公司部组',
}

export enum IsArrangement {
  '项目委托' = 1,
  '部组成员' = 4,
  '公司部组' = 3,
}

export enum ProjectCategory {
  '10KV线路' = 1,
  '配变台区',
  '低压线路',
}

export enum ProjectType {
  '农网改造升级项目' = 1,
  '城镇配网工程',
  '无电地区电力建设',
}

export enum ProjectFormType {
  '优化网架结构' = 1,
  '改善供电质量',
  '提高装备标准',
  '提升智能水平',
  '深化新技术应用',
  '其他',
}

export enum ProjectStage {
  '可研' = 2,
  '初设',
  '施工图',
  '竣工图',
}

export enum BuildType {
  '新建' = 1,
  '改造',
  '扩建',
  '配套输出',
}

export enum ProjectNature {
  '贫困村' = 1,
  '深度贫困村' = 2,
  '小康用电' = 4,
  '煤改电' = 8,
  '三区京州' = 16,
  '井井通电' = 32,
  '小城镇(中心村)' = 64,
  '村村通动力电' = 128,
  '迎峰度冬项目' = 256,
  '迎峰度夏项目' = 512,
  '灾后恢复项目' = 1024,
  '易地扶贫搬迁' = 2048,
  '其他' = 4096,
}

export enum ProjectVoltageClasses {
  '无',
  '交流20kv',
  '交流10kv',
  '交流380v',
}

export enum ProjectStatus {
  '待安排' = 1,
  '待勘察',
  '待结项',
  '待申请结项',
  '已结项',
}

export enum ProjectSourceType {
  '无' = 1,
  '被共享' = 2,
  '被委托' = 3,
}

export enum ProjectIdentityType {
  '立项' = 1,
  '委托' = 2,
  '执行' = 4,
  '共享' = 999,
}

export enum StatisticalCategory {
  '待处理' = 1,
  '进行中',
  '委托',
  '被共享',
}

export enum FormImportantLevel {
  '重大' = 1,
  '重要',
  '一般',
}

export enum ProjectLevel {
  '省级项目' = 1,
  '市级项目',
  '县级项目',
}

export enum AssetsNature {
  '子公司' = 1,
  '用户',
  '总公司',
  '分部',
  '省（直辖市、自治区）公司)',
}

export enum MajorCategory {
  '配电线路' = 1,
  '配电电缆',
  '配电通道',
  '配电站室',
  '配电自动化',
  '配网通信',
  '配电附属设施',
}

export enum ReformCause {
  '网架结构不合理' = 1,
  '供电能力不足',
  '设备老化',
  '落实安措（安全防护）及反措要求',
  '设备故障',
  '设备质量缺陷',
  '电能质量问题',
  '运行环境恶化',
  '电网发展需求需提高主要技术参数水平',
  '新技术应用',
  '配合市政建设',
  '落实国家政策',
  '其他',
}

export enum ReformAim {
  '提升电网安全稳定水平' = 1,
  '提升设备运行可靠性',
  '提升电网输送能力',
  '提升电网经济运行水平',
  '提升电网智能化水平',
  '提升电网环保水平',
  '其他',
}

export enum RegionAttribute {
  'A+' = 1,
  'A',
  'B',
  'C',
  'D',
  'E',
}

export enum Batch {
  '第一批' = 1,
  '第二批',
  '第三批',
  '第四批',
  '第五批',
  '第六批',
}

export enum PAttribute {
  '贫困地区农网建设与改造项目' = 1,
  '新接收小水电供区电网改造项目',
  '运行异常配变改造项目',
  '小康电示范县电网建设与改造项目',
  '新增机井通电工程',
  '农网配电自动化改造项目',
  '易地扶贫搬迁项目',
  '常规农网项目',
  '其他项目',
}

export enum Meteorologic {
  '无',
  'A类',
  'B类',
  'C类',
  'D类',
  'E类',
  'F类',
}

export enum DataSourceType {
  '勘察',
  '导入',
}

export interface AllProjectStatisticsParams {
  keyWord?: string;
  category?: string;
  pCategory?: string;
  stage?: string;
  constructType?: string;
  nature?: string;
  kvLevel?: string;
  status?: string;
  sourceType?: string;
  identityType?: string;
}

export interface AllProjectSearchParams extends AllProjectStatisticsParams {
  pageIndex: number;
  pageSize: number;
  statisticalCategory?: string;
}

// 获取列表
export const getProjectTableList = (params: AllProjectSearchParams) => {
  return cyRequest<TableRequestResult>(() =>
    request(`${baseUrl.project}/Porject/GetPagedList`, { method: 'POST', data: params }),
  );
};

interface ProjectTableStatisticsResult {
  total: number;
  awaitProcess: number;
  inProgress: number;
  delegation: number;
  beShared: number;
}

// 获取统计的值
export const getProjectTableStatistics = (params: AllProjectStatisticsParams) => {
  return cyRequest<ProjectTableStatisticsResult>(() =>
    request(`${baseUrl.project}/Porject/GetStatistical`, { method: 'POST', data: params }),
  );
};

interface EngineerParams {
  name: string;
  province: string;
  city: string;
  area: string;
  libId: string;
  inventoryOverviewId: string;
  warehouseId: string;
  compiler: string;
  compileTime: Moment;
  organization: string;
  startTime: Moment;
  endTime: Moment;
  company: string;
  importance: string;
  plannedYear: string;
  grade: string;
}

interface ProjectParams {
  name: string;
  category: string;
  pType: string;
  kvLevel: string;
  totalInvest: string;
  natures: any[];
  startTime: Moment;
  endTime: Moment;
  assetsNature: string;
  majorCategory: string;
  isAcrossYear: string;
  reformCause: string;
  reformAim: string;
  powerSupply: string;
  assetsOrganization: string;
  cityCompany: string;
  regionAttribute: string;
  countyCompany: string;
  constructType: string;
  pCategory: string;
  stage: string;
  batch: string;
  pAttribute: string;
  meteorologic: string;
  disclosureRange: string;
  pileRange: string;
  deadline: Moment;
  dataSourceType: string;
}

interface AddEngineerParams {
  engineer: EngineerParams;
  projects: ProjectParams[];
}

// 立项保存接口
export const addEngineer = (params: AddEngineerParams) => {
  return cyRequest<ProjectTableStatisticsResult>(() =>
    request(`${baseUrl.project}/Porject/CreateMultipleProject`, { method: 'POST', data: params }),
  );
};

export const editEngineer = (params: EngineerParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Engineer/Modify`, { method: 'POST', data: params }),
  );
};

interface EngineerInfoParams {
  id: string;
  name: string;
  province: string;
  provinceName: string;
  libId: string;
  libName: string;
  inventoryOverviewId: string;
  inventoryOverviewName: string;
  warehouseId: string;
  warehouseName: string;
  compiler: string;
  compileTime: string;
  organization: string;
  startTime: string;
  endTime: string;
  company: string;
  importance: string;
  importanceText: string;
  plannedYear: string;
  grade: string;
  gradeText: string;
  cityName:string;
  areaName:string;
}

// 获取工程详细信息接口
export const getEngineerInfo = (engineerId: string) => {
  return cyRequest<EngineerInfoParams>(() =>
    request(`${baseUrl.project}/Engineer/GetById`, { method: 'GET', params: { id: engineerId } }),
  );
};

interface ProjectInfoParams {
  id: string;
  name: string;
  category: string;
  categoryText: string;
  pType: string;
  pTypeText: string;
  kvLevel: string;
  kvLevelText: string;
  totalInvest: string;
  natures: string[];
  startTime: string;
  endTime: string;
  assetsNature: string;
  assetsNatureText: string;
  majorCategory: string;
  majorCategoryText: string;
  isAcrossYear: string;
  reformCause: string;
  reformCauseText: string;
  reformAim: string;
  reformAimText: string;
  powerSupply: string;
  assetsOrganization: string;
  cityCompany: string;
  regionAttribute: string;
  regionAttributeText: string;
  countyCompany: string;
  constructType: string;
  constructTypeText: string;
  pCategory: string;
  pCategoryText: string;
  stage: string;
  stageText: string;
  batch: string;
  batchText: string;
  pAttribute: string;
  pAttributeText: string;
  meteorologic: string;
  meteorologicText: string;
  disclosureRange: string;
  pileRange: string;
  deadline: string;
  dataSourceType: string;
  dataSourceTypeText: string;
  createdOn: string;
  createdCompanyName: string;
  stateInfo: any;
  sources: string;
  identitys: string[];
  allots: any[];
}

// 获取项目详细信息接口
export const getProjectInfo = (projectId: string) => {
  return cyRequest<ProjectInfoParams>(() =>
    request(`${baseUrl.project}/Porject/GetById`, { method: 'GET', params: { id: projectId } }),
  );
};

// 编辑项目信息
export const editProject = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/Modify`, { method: 'POST', data: params }),
  );
};

// 复制项目信息
export const copyProject = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/Copy`, { method: 'POST', data: params }),
  );
};

// 获取项目的枚举
export const getEngineerEnum = () => {
  return cyRequest<any>(() => request(`${baseUrl.project}/Engineer/GetEnums`, { method: 'GET' }));
};

// 删除项目
export const deleteProject = (projectIds: string[]) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.project}/Porject/Delete`, { method: 'POST', data: { projectIds } }),
  );
};

// 新增项目
export const addProject = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/Create`, { method: 'POST', data: params }),
  );
};

// 申请结项
export const applyKnot = (projectIds: string[]) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/ApplyKnot`, { method: 'POST', data: { projectIds } }),
  );
};

// 撤回结项
export const revokeKnot = (projectIds: string[]) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/RevokeKnot`, { method: 'POST', data: { projectIds } }),
  );
};

// 结项通过
export const auditKnot = (projectIds: string[]) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/AuditKnot`, {
      method: 'POST',
      data: { isPass: 'true', projectIds },
    }),
  );
};
// 结项退回
export const noAuditKnot = (projectIds: string[]) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/AuditKnot`, {
      method: 'POST',
      data: { isPass: 'false', projectIds },
    }),
  );
};

// 撤回共享
export const recallShare = (ids: string[]) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/RevokeShare`, {
      method: 'POST',
      data: { shareIds: ids },
    }),
  );
};

// 撤回安排
export const revokeAllot = (projectIds: string[]) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/RevokeAllot`, { method: 'POST', data: { projectIds } }),
  );
};

// 检查是否可以一起被安排
export const checkCanArrange = (projectIds: string[]) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/CheckAllotPrerequisites`, {
      method: 'POST',
      data: projectIds,
    }),
  );
};

export const getGroupInfo = (clientType: string, companyGroupId: string = '') => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/CompanyUser/GetTreeByGroup`, {
      method: 'POST',
      data: { clientType, companyGroupId },
    }),
  );
};

export const getCompanyName = (userName: string): Promise<any> => {
  if (!userName) {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
  return cyRequest<any>(() =>
    request(`${baseUrl.project}/ManageUser/GetCompanyNameByUserName`, {
      method: 'POST',
      data: { userName },
    }),
  );
};

export const shareProject = (params: any) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.project}/Porject/Share`, {
      method: 'POST',
      data: params,
    }),
  );
};

interface AllotParams {
  allotType: number;
  allotCompanyGroup: string;
  allotOrganizeUser: string;
  surveyUser: string;
  designUser: string;
  designAssessUser1: string;
  designAssessUser2: string;
  designAssessUser3: string;
  designAssessUser4: string;
  outerAuditUsers: string[] | undefined;
}

export const saveArrange = (params: AllotParams) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/Porject/Allot`, { method: 'POST', data: params }),
  );
};

//修改安排
export const editArrange = (params: AllotParams) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/Porject/ModifyProjectAllot`, { method: 'POST', data: params }),
  );
};

// 检查是否可以进行修改安排
export const canEditArrange = (projectIds: string[]) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.project}/Porject/CheckModifyAllotPrerequisites`, {
      method: 'POST',
      data: projectIds,
    }),
  );
};

// 迭代资源库
export const modifyMultipleEngineerLib = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Engineer/ModifyMultipleEngineerLib`, {
      method: 'POST',
      data: params,
    }),
  );
};

// 获取设计成果树状结构
export const getResultTreeData = (projectId: string) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.upload}/Find/ProjectOutcomeFileDirectory`, {
      method: 'GET',
      params: { projectId },
    }),
  );
};

//获取项目编制成果树状结构
export const getCompileResultTreeData = (projectId: string) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.upload}/Find/ProjectCompilationResultsFileDirectory`, {
      method: 'GET',
      params: { projectId },
    }),
  );
};

// 生成设计成果
export const createResult = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.upload}/Find/GetProjectOutcomeFileDownloadPath`, {
      method: 'POST',
      data: params,
    }),
  );
};

//生成项目编制成果
export const createCompileResult = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.upload}/Find/GetProjectCompilationResultsFileDownloadPath`, {
      method: 'POST',
      data: params,
    }),
  );
};

// 根据编号下载文件
export const downloadFile = (params: any) => {
  return request(`${baseUrl.upload}/Download/GetProjectOutcomeFile`, {
    method: 'GET',
    params,
    responseType: 'blob',
  });
};

//下载--项目编制成果
export const downloadFileComplie = (params: any) => {
  return request(`${baseUrl.upload}/Download/GetProjectCompilationResultFile`, {
    method: 'GET',
    params,
    responseType: 'blob',
  });
};

// 获取已经分享的公司
export const getHasShareDetailData = (projectId: string) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/Porject/GetShares`, {
      method: 'GET',
      params: { projectId },
    }),
  );
};

export const uploadBulkProject = (files: any[], requestSource: 'project', url: string) => {
  const formData = new FormData();
  files?.forEach((item) => {
    formData.append('file', item);
  });

  const uploadUrl = `${baseUrl[requestSource]}${url}`;

  return request(uploadUrl, {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
};

//批量导入工程项目
export const importBulkEngineerProject = (params: any) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/ImportEngineerProject`, {
      method: 'POST',
      data: params,
    }),
  );
};

//获取项目导入工程项目
export const getAllotUsers = (projectId: string, arrangeType: number) => {
  return cyRequest<any[]>(() =>
    request(`${baseUrl.project}/Porject/GetAllotUsers`, {
      method: 'POST',
      data: { projectId, arrangeType },
    }),
  );
};

interface AllotOuterAuditParams {
  projectId: string;
  userIds: string[];
  notArrangeAudit?: boolean;
  auditResult?: boolean;
}
//安排外审
export const allotOuterAudit = (params: AllotOuterAuditParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/AllotOuterAudit`, {
      method: 'POST',
      data: params,
    }),
  );
};

//获取外审人员列表及当前步骤
export const getExternalArrangeStep = (projectId: string) => {
  return cyRequest<any>(() =>
    request(`${baseUrl.review}/ReviewProject/GetOutAuditSteps`, {
      method: 'GET',
      params: { projectId },
    }),
  );
};

interface ExecuteExternalArrangeParams {
  projectId: string;
  parameter: {};
}
//外审通过执行
export const executeExternalArrange = (params: ExecuteExternalArrangeParams) => {
  return cyRequest(() =>
    request(`${baseUrl.review}/ReviewProject/OutAuditCheckExecute`, {
      method: 'POST',
      data: params,
    }),
  );
};

interface ModifyOuterAuditParams {
  projectId: string;
  addUserIds: any;
  delUserIds: string[];
}
//修改外审安排
export const modifyExternalArrange = (params: ModifyOuterAuditParams) => {
  return cyRequest(() =>
    request(`${baseUrl.project}/Porject/ModifyOuterAudit`, {
      method: 'POST',
      data: params,
    }),
  );
};
