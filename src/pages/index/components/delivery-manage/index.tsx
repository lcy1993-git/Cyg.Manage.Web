import BarChart from "@/components/bar-chart";
import { CaretDownOutlined } from "@ant-design/icons";
import { Select,DatePicker } from "antd";
import React from "react";
import ChartBox from "../chart-box";
import ChartTab from "../chart-tab";
import * as echarts from "echarts/lib/echarts"
const { Option } = Select;

import styles from "./index.less";

const { RangePicker } = DatePicker;

const DeliveryManage: React.FC = () => {

    const tabData = [
        {
            id: "person",
            name: "员工"
        },
        {
            id: "array",
            name: "部组"
        },
        {
            id: "company",
            name: "公司"
        }
    ]

    const option = {
        grid: {
            left: 60,
            bottom: 30,
            top: 20
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
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
                    color: "#74AC91"
                }
            }
        },
        yAxis: {
            type: 'category',
            data: ['员工一', '员工二', '员工三', '员工四', '员工五'],
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#74AC91"
                }
            }
        },
        series: [{
            data: [120, 200, 150, 80, 70],
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
                            ])
                    }
                }
            },
        }]
    };

    return (
        <ChartBox title="交付管理">
            <div className={styles.deliveryMange}>
                <div className={styles.deliveryManageStatisticCondition}>
                    <div className={styles.deliverySelect}>
                        <Select bordered={false} defaultValue="number" suffixIcon={<CaretDownOutlined />}>
                            <Option value="number">项目数量</Option>
                            <Option value="number2">项目数量2</Option>
                        </Select>
                    </div>
                    <div className={styles.deliveryTab}>
                        <ChartTab data={tabData} defaultValue="person" />
                    </div>
                </div>
                <div className={styles.deliveryChart}>
                    <BarChart options={option} />
                </div>
                <div className={styles.deliveryTime}>
                    <span className={styles.deliveryChooseTimeLabel}>选择日期</span>
                    <div className={styles.delivertChooseTime}>
                        <RangePicker allowClear={false} bordered={false} />
                    </div>
                </div>
            </div>
        </ChartBox>
    )
}

export default DeliveryManage