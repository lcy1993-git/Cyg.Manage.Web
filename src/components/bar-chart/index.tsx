import React,{useRef,useEffect} from "react";

import * as echarts from "echarts/lib/echarts"
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';

import styles from "./index.less"

import { useMount } from "ahooks";

interface BarChartProps {
    options: object
}

const BarChart:React.FC<BarChartProps> = (props) => {
    const {options} = props;

    const divRef = useRef<HTMLDivElement>(null);
    let myChart: any = null;

    const initChart = () => {
        if(divRef && divRef.current) {
            myChart = echarts.init(divRef.current as unknown as HTMLDivElement);
            myChart.setOption(options)
        }
    }

    const resize = () => {
        setTimeout(() => {
            myChart.resize()
        },100)
    }

    useEffect(() => {
        window.addEventListener('resize', () => {
			if (!divRef.current) { // 如果切换到其他页面，这里获取不到对象，删除监听。否则会报错
		        window.removeEventListener('resize', resize);
		        return;
		    }else {
                resize()
            }
		});
       
        () => {
            window.removeEventListener('resize', resize);
        }
    });

    useMount(() => {
        initChart();
    })

    return (
        <div style={{width: "100%", height: "100%"}} ref={divRef} />
    )
}

export default BarChart