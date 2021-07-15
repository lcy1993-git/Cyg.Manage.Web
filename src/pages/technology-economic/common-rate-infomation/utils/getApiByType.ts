import {
  getWinterConstructionRate,
  getEasyRate,
  getTemporaryFacilityRate,
  getBasicReserveRate,
  getDesignRate,
  getSpecialAreaConstructionRate

} from '@/services/technology-economic/common-rate';

/**
 * 根据费率表类型获取相应接口
 * 
 * @param type 费率表类型
 * @returns 费率表相关接口
 */
export const getApiByType = (type: string) => {
  
  switch (String(type)) {
    /**
     * 夜间施工增加费率
     * 施工工具用具使用费率
     * 安全文明施工费率
     * 企业管理费率
     * 利润率
     */
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
      return getEasyRate;
    /**
    * 冬雨季施工增加费率
    */
    case "51":
      console.log("冬雨");
      
      return getWinterConstructionRate;
    /**
     * 临时设施费费率
     */
    case "52":
      return getTemporaryFacilityRate;
    /**
     * 基本预备费费率
     */
    case "53":
      return getBasicReserveRate;
    /**
     * 特殊地区施工增加费费率
     */
    case "54":
      return getSpecialAreaConstructionRate;
    /**
     * 设计费费率
     */
    case "55":
      return getDesignRate;
    default:
      return () => Promise.reject([])
  }
}