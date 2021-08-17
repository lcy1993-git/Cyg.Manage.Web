// nextTable?: boolean;
// columns?: any[],
// dataSource?: any[];
// nextColumns?: any[];
// nextDataSource?: any[];
// nextTableRest?: any;

export const getPropsByType = (type: string, data: any) => {
  
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
      return getDataEasy(data);
    /**
     * 冬雨季
     */
    case "51":
      return getData51(data);
    /**
     * 临时设施费费率
     */
    case "52":
      return getData52(data);
    /**
     * 基本预备费费率
     */
    case "53":
      return getData53(data);
    /**
     * 特殊地区施工增加费费率
     */
    case "54":
      return getData54(data);
    /**
     * 设计费费率
     */
    case "55":
      return getData55(data);

    default:
      return Object(data);
      break;
  }
}

/**
 * 夜间施工增加费率
 * 施工工具用具使用费率
 * 安全文明施工费率
 * 企业管理费率
 * 利润率
 */
const getDataEasy = (data: any) => {
  const columns = [
    {
      title: "工程类别",
      key: "type",
      dataIndex: "type"
    },
    {
      title: "建筑工程",
      key: "costRate1",
      dataIndex: "costRate1"
    },
    {
      title: "安装工程",
      key: "costRate2",
      dataIndex: "costRate2"
    },
  ];
  const dataSource = [
    {
      type: "费率(%)",
      costRate1: data?.find((item: any) => item.costRateTypeText === "建筑工程")?.costRate ?? "",
      costRate2: data?.find((item: any) => item.costRateTypeText === "安装工程")?.costRate ?? "",
    }
  ];

  return {
    columns,
    dataSource
  } 
}

/**
 * 冬雨季
 */
const getData51 = (data: any) => {
  const columns = [
    {
      title: "地区分类",
      children: [
        {
          title: null
        },
        {
          title: null
        }
      ]
    }
  ];
  const dataSource = [
    {}
  ];

  return {
    columns,
    dataSource
  }
}

/**
 * 临时设施费费率
 */
const getData52 = (data: any) => {
  const columns = [];
  const dataSource = [];

  return {
    columns,
    dataSource
  }
}

/**
 * 基本预备费费率
 */
const getData53 = (data: any) => {
  const columns = [];
  const dataSource = [];

  return {
    columns,
    dataSource
  }
}

/**
 * 特殊地区施工增加费费率
 */
const getData54 = (data: any) => {
  const columns = [];
  const dataSource = [];

  return {
    columns,
    dataSource
  }
}

/**
 * 设计费费率
 */
const getData55 = (data: any) => {
  const columns = [];
  const dataSource = [];

  return {
    columns,
    dataSource
  }
}