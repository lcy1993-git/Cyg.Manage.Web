import { getTechnicalEconomyEnums } from '@/services/technology-economic';

const findItems = (resData: any[], name: string, isChineseName=false) => {
  return resData.find((item: any) => {
    if(isChineseName) {
      return item.name === name;
    }
    return item.code === name;
  })
}

/**
 * 获取技经所有枚举值
 * @param name 枚举值名
 * @param isChineseName 是否使用中文名获取枚举  默认为false
 * @demo   (getEnums('AreaType'));
 * @demo   (getEnums('地区类型', true));
 * @returns Map[]
 */
export const getEnums = (name: string, isChineseName=false) => {
  const technologyEconomicEnums = localStorage.getItem('technologyEconomicEnums');
  if(technologyEconomicEnums) {
    const parse = JSON.parse(technologyEconomicEnums || "");
    if(typeof parse === 'object' && parse != null) {
      return findItems(parse, name, isChineseName)?.items;
    }
  } else {
      getTechnicalEconomyEnums().then((resData) => {
        if(Array.isArray(resData)){
          localStorage.setItem('technologyEconomicEnums', JSON.stringify(resData));
          getEnums(name, isChineseName)
        }   
    });
 
  }
}