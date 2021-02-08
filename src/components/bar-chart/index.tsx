import React,{useRef,useEffect} from "react";

import * as echarts from "echarts/lib/echarts"
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';

interface BarChartProps {
    options: object
}

const BarChart:React.FC<BarChartProps> = (props) => {
    const {options} = props;

    const divRef = useRef<HTMLDivElement>(null);

    const initChart = () => {
        if(divRef && divRef.current) {
            const echartElement = echarts.init(divRef.current as unknown as HTMLDivElement);
            echartElement.setOption(options)
        }
    }

    useEffect(() => {
        initChart();
    })

    return (
        <div style={{width: "100%", height: "100%"}} ref={divRef} />
    )
}

export default BarChart