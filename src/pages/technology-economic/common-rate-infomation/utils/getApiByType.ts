import {
  getWinterConstructionRate,
  getEasyRate,
  getTemporaryFacilityRate,
  getBasicReserveRate,
  getDesignRate,
  getSpecialAreaConstructionRate,
  getDemolitionEasyRate,
  getDemolitionWinterConstructionRate,
  getDemolitionSpecialAreaConstructionRate

} from '@/services/technology-economic/common-rate';

/**
 * 根据费率表类型获取相应接口
 *
 * @param type 费率表类型
 * @returns 费率表相关接口
 */
export const getApiByType = (rateTableType: string, rateFileId: string, demolition: boolean) => {
  if(demolition){
    switch (String(rateTableType)) {
      /**
       * 拆除冬雨季
       */
      case "51":
        return () => getDemolitionWinterConstructionRate(rateFileId)
        break;
      /**
       * 拆除特殊地区施工
       */
      case "54":
        return () => getDemolitionSpecialAreaConstructionRate(rateFileId)
        break;
      default:
        /**
         * 拆除简单费率
         */
        return () => getDemolitionEasyRate(rateTableType, rateFileId)
        break;
    }
  }else{
    switch (String(rateTableType)) {
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
        return () => getEasyRate(rateTableType, rateFileId);
      /**
      * 冬雨季施工增加费率
      */
      case "51":
        return () =>getWinterConstructionRate(rateFileId);
      /**
       * 临时设施费费率
       */
      case "52":
        return () => getTemporaryFacilityRate(rateFileId);
      /**
       * 基本预备费费率
       */
      case "53":
        return () => getBasicReserveRate(rateFileId);
      /**
       * 特殊地区施工增加费费率
       */
      case "54":
        return () => getSpecialAreaConstructionRate(rateFileId);
      /**
       * 设计费费率
       */
      case "55":
        return () => getDesignRate(rateFileId);
      default:
        return () => Promise.reject([])
    }
  }

}
