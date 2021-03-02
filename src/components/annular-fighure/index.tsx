import React,{useRef,useEffect} from "react";
import * as echarts from "echarts/lib/echarts"
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import { useSize } from "ahooks";

interface BarChartProps {
    options: object
}

const AnnularFighure:React.FC<BarChartProps> = (props) => {
    const {options} = props;

    const divRef = useRef<HTMLDivElement>(null);
    let myChart:any = null;

    const size = useSize(divRef);

    const initChart = () => {
        if(divRef && divRef.current) {
            myChart = echarts.init(divRef.current as unknown as HTMLDivElement);
            myChart.setOption(options)
        }
    }

    const resize = () => {
        if(myChart) {
            setTimeout(() => {
                myChart.resize()
            },100)
        }
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

    useEffect(() => {
        if(size.width || size.height) {
            initChart();
        }
    }, [JSON.stringify(size)])

    useEffect(() => {
        initChart();
    }, [JSON.stringify(options)])

    return (
        <div ref={divRef} style={{width: "100%", height: "100%"}} />
    )
}

export default AnnularFighure