import * as echarts from "echarts/lib/echarts";
import borderStylesHTML from '../utils/borderStylesHTML';
interface DataSource {
  key: string;
  value: unknown
}
/**
 * @param data 请求的数据
 * @param length Y轴一行显示文字的长度
 */
export default (data: DataSource[], length = 4) => {
  const dataArray = data?.map((item: DataSource) => item.key);
  const valueArray = data?.map((item: DataSource) => item.value);

  return {
    grid: {
        left: 60,
        bottom: 30,
        top: 20
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderColor: '#000',
        formatter(params: any) {
            const { name, value } = params[0];

            return borderStylesHTML + `<span style="color: #2AFE97">${name}</span><br />
            <span style="color: #2AFE97">项目数量:</span><span style="color: #fff">${value}</span>`
        }
    },
    xAxis: {
        type: 'value',
        axisLine: {
            show: true,
            lineStyle: {
                color: "#74AC91"
            }
        },
        axisLabel: {
            lineStyle: {
                color: "#74AC91"
            }
        },
        splitLine: {
            lineStyle: {
                color: "#355345",
                type: "dashed"
            }
        }
    },
    yAxis: {
        type: 'category',
        data: dataArray,
        axisLine: {
            show: true,
            lineStyle: {
                color: "#74AC91"
            }
        },
        axisLabel: {
            textStyle: {
                color: '#74AC91'
            },
            fontSize: 10,
            align: "right",
            formatter:function(params: any) {
                let newParamsName = "";
                let paramsNameNumber = params.length;
                if(params.length > 12) {
                    params = params.substring(0,9) + "..."
                }
                let provideNumber = length;  //一行显示几个字
                let rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                if (paramsNameNumber > provideNumber) {
                    for (let p = 0; p < rowNumber; p++) {
                        let tempStr = "";
                        let start = p * provideNumber;
                        let end = start + provideNumber;
                        if (p == rowNumber - 1) {
                            tempStr = params.substring(start, paramsNameNumber);
                        } else {
                            tempStr = params.substring(start, end) + "\n";
                        }
                        newParamsName += tempStr;
                    }

                } else {
                    newParamsName = params;
                }
                return newParamsName ;
            },
        },
    },
    series: [{
        data: valueArray,
        type: 'bar',
        itemStyle: {
            normal: {
                color: function () {
                    return new echarts.graphic.LinearGradient(0, 0, 1, 0,
                        [
                            {
                                offset: 0,
                                color: "#00481E" // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: "#2AFE97" // 100% 处的颜色
                            }
                        ]);
                }
            }
        },
    }]
  };
}