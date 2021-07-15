import { useRef } from 'react';
import { useMount } from 'ahooks';
import classNames from 'classnames';

import { useRequest } from 'ahooks';
import { findHoleDetails, CableSectionProps } from '@/services/visualization-results/visualization-results';
import { initCtx } from './utils';

import styles from "./index.less";
import { message, Tooltip } from 'antd';

const CableSection: React.FC<CableSectionProps> = (params) => {
  console.log(params);
  
  const { title, layMode, layerType, holeId, arrangement } = params;
  const ref = useRef<HTMLCanvasElement>(null);

  useMount(async () => {
    const ctx = ref.current!.getContext('2d')!;
    console.log(params);
    
    const data: any[] = await findHoleDetails({layerType, holeId}).then((res) => {
      console.log(res);
      if(res.isSuccess ===true) {
        console.log(Object(res)?.content);
        
        console.log(layerType === 1 ? Object(res)?.content : Object(res)?.content);
        
        return (layerType === 1 ? Object(res)?.content?.designCableChannelProfile : Object(res)?.content?.dismantleCableChannelProfile) ?? []
      }else {
        message.error(res.message);
        return [];
      }

    }).catch((err) => {
      message.error(err);
      return [];
    });
   
    console.log(data);
    
    initCtx(ctx, data, layMode, arrangement, title)
  })

  return (
    <div className={styles.canvasWrap}>
      <div className={styles.canvasBox}>
        <canvas ref={ref} className={classNames(styles.canvas, layMode !== 3 && layMode !== 4 ? styles.border : "") } width={150} height={150} />
        <Tooltip className={styles.title} placement="top" title={title}>
          {title ?? ""}
        </Tooltip>
        {/* <div className={styles.title}>{title ?? ""}</div> */}
        <div className={styles.footer}>
          图例:
          <div className={classNames(styles.icon, styles.green)}></div>
          新建
          <div className={classNames(styles.icon, styles.gray)}></div>
          原有
          <div className={classNames(styles.icon, styles.white)}></div>
          空
        </div>
      </div>
    </div>
  );
}

export default CableSection;