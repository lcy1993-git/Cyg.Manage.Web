import React, {useEffect, useRef, useState} from 'react';
import WrapperComponent from '@/components/page-common-wrap';
import EventNumber from "@/pages/adminIndex/home/child/eventsNumber";
import styles from './index.less'
import * as echarts from 'echarts/lib/echarts';
import {useSize} from "ahooks";

interface Props {

}

const AdminIndex: React.FC<Props> = () => {
  const lineRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  let myChart: any = null;
  const lineSize = useSize(lineRef);
  const circleSize = useSize(lineRef);
  const lineOptions = {
    title: {
      text: '日志趋势',
      textStyle:{
        fontSize: 16,
        fontWeight:500
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'white'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        name:'时间',
        nameGap:40,
        nameLocation: 'center',
        axisLabel:{
          rotate:40
        },
        data: ['00:00:00',
          '02:00:00',
          '04:00:00',
          '06:00:00',
          '08:00:00',
          '10:00:00',
          '12:00:00',
          '14:00:00',
          '16:00:00',
          '18:00:00',
          '20:00:00',
          '22:00:00','24:00:00',]
      }
    ],
    yAxis: [
      {
        type: 'value',
        name:'计数',
        offset:5,
        splitLine: {
          //网格线
          lineStyle: {
            type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
            width: 1,
          },
          show: true, //隐藏或显示
        },
        nameStyle:{
          fontWeight: 500
        },
        axisLabel:{
          interval:1000,
          formatter: function(value:number,index:number){
            let val;
            if (value >= 10000){
              val = value/10000+'w';
            } else  if (value >=1000) {
              val = value/1000+'k';
            }else if(value <1000){
              val = value;
            }
            return val
          }
        },
        nameGap:35,
        nameRotate:90,
        nameLocation: 'center'
      }
    ],
    series: [
      {
        lineStyle:{
          color:'rgba(77, 169, 68, 1)'
        },
        // symbol:'none',
        showSymbol:false,
        type: 'line',
        // stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(77, 169, 68, 0.8)'
            },
            {
              offset: 1,
              color: 'rgba(77, 169, 68, 0.4)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [1200, 1320, 10111, 4134, 5590, 2350, 2140,1720, 6555, 2101, 6134, 7790, 1130, 210]
      },
    ]
  };
  const circleOptions = {
    title: {
      text: '事件比例',
      left: 'left',
      textStyle:{
        fontSize: 16,
        fontWeight:500
      }
    },
    tooltip: {
      trigger: 'item'
    },
    color:['rgba(22, 147, 125, 1)','rgba(53, 131, 222, 1)'],
    series: [
      {
        type: 'pie',
        itemStyle:{
          borderColor: '#fff',
          borderWidth: 1
        },
        data: [
          { value: 735, name: '业务事件' },
          { value: 1048, name: '系统事件' },
        ],
        emphasis: {
          // itemStyle: {
          //   shadowBlur: 10,
          //   shadowOffsetX: 0,
          //   shadowColor: 'rgba(0, 0, 0, 0.5)'
          // }
        },
        radius:100
      },
    ]
  };

  const initChart = () => {
    if (lineRef && lineRef.current) {
      myChart = echarts.init((lineRef.current as unknown) as HTMLDivElement);
      myChart.setOption(lineOptions);
    }
    if (circleRef && circleRef.current) {
      myChart = echarts.init((circleRef.current as unknown) as HTMLDivElement);
      myChart.setOption(circleOptions);
    }
  };
  const resize = () => {
    if (myChart) {
      setTimeout(() => {
        myChart.resize();
      }, 100);
    }
  };
  useEffect(() => {
    window.addEventListener('resize', () => {
      if (!lineRef.current) {
        // 如果切换到其他页面，这里获取不到对象，删除监听。否则会报错
        window.removeEventListener('resize', resize);
        return;
      } else {
        resize();
      }
    });
    window.removeEventListener('resize', resize);
  });
  useEffect(() => {
    if (lineOptions) {
      initChart();
    }
  }, [JSON.stringify(lineOptions), JSON.stringify(lineSize),JSON.stringify(circleSize)]);
  return (
    <WrapperComponent noColor={true} noPadding={true}>
      <div className={styles.indexBack}>
        <EventNumber system={22} business={55}/>
        <div className={styles.mainInfo}>
          <div className={styles.leftContent}>
            <div className={styles.leftContentTop}>
              <div className={styles.lineChart}>
                <div ref={lineRef} style={{width: '100%', height: '100%'}}/>
              </div>
              <div className={styles.circleChart}>
                <div ref={circleRef} style={{width: '100%', height: '100%'}}/>
              </div>
            </div>
            <div className={styles.leftTable}>
              3
            </div>
          </div>
          <div className={styles.RightContent}>
            4
          </div>
        </div>
      </div>
    </WrapperComponent>
  );
};

export default AdminIndex;
