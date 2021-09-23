import React, { useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import { useUpdateEffect } from 'ahooks';
import type { MediaData } from '../../getComponentsByData';

import { Button, Modal } from 'antd';
import InputPercentNumber from '@/components/input-percent-number';
import { DownloadOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'

import classNames from 'classnames';
import { baseUrl } from '@/services/common';

import styles from './index.less';
import uuid from 'node-uuid';

interface MediaImageProps {
  data: MediaData;
  index: number;
  preFullClick: () => void;
  nextFullClick: () => void;
  content: any[];
}

interface Position {
  x: number;
  y: number;
}

const MediaImage: React.FC<MediaImageProps> = ({
  data,
  content,
  index,
  preFullClick,
  nextFullClick,
}) => {

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDrag, setIsDrag] = useState<Boolean>(false);
  const [startPosition, setStartPostion] = useState<Position>({ x: 0, y: 0 })
  const [p, setP] = useState({ x: 0, y: 0 })
  const [percent, setPercent] = useState<number>(100);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const [fsIndex, setFsIndex] = useState<number>(index)

  const imgRef = useRef<HTMLImageElement>(null);

  const outoSizeHandler = () => {
    setPosition({ x: 0, y: 0 })
    setPercent(100);
  }

  const downLoad = () => {
    const a = document.createElement("a");
    a.setAttribute("href", `${baseUrl.upload}/Download/GetFileById?fileId=${data.filePath}&securityKey=1201332565548359680&token=${data.authorization}`);
    a.setAttribute("download", "preview");
    a.click();
  }

  const onmouseMove = (e: MouseEvent) => {
    if (isDrag) {
      setPosition({
        x: (p.x + e.nativeEvent.offsetX - startPosition.x),
        y: (p.y + e.nativeEvent.offsetY - startPosition.y)
      })
    }
  }
  
  const onmouseUp = () => {
    setIsDrag(false)
  }

  const onmousedown = (e: MouseEvent) => {
    setStartPostion({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
    setP({ ...position })
    setTimeout(() => {
      setIsDrag(true);
    }, 10)
  }

  useUpdateEffect(() => {
    imgRef.current!.style.left = 2 * position.x + "px";
    imgRef.current!.style.top = position.y + "px";
  }, [JSON.stringify(position)])

  useUpdateEffect(() => {
    imgRef.current!.style.transform = `scale(${percent / 100})`;
  }, [percent])

  useUpdateEffect(() => {
    setPosition({ x: 0, y: 0 })
    setPercent(100)
  }, [index])

  const checkPreImg = () => {
    let index = fsIndex;
    do {
      index --
      if(index < 0){
        index = content.length - 1
      }
    } while (content[index]?.type === 2)
    setFsIndex(index)
  }

  const checkNextImg = () => {
    let index = fsIndex;
    do {
      index ++
      if(index === content.length){
        index = 0
      }
    } while (content[index]?.type === 2)
    console.log(content.map((item) => item.filePath))
    setFsIndex(index)
  }

  return (
    <>
      <div className={styles.imagWrap}>
        <div className={classNames(styles.overhidden, isDrag ? styles.isDrag : "")}
          onMouseMove={onmouseMove}
          onMouseUp={onmouseUp}
          onMouseDown={onmousedown}
          onMouseLeave={onmouseUp}
        >
          <img
            ref={imgRef}
            className={styles.img}
            crossOrigin={''}
            src={`${baseUrl.upload}/Download/GetFileById?fileId=${data.filePath}&securityKey=1201332565548359680&token=${data.authorization}`}
          />
        </div>
        <div className={styles.AreaButtons}>
          <InputPercentNumber value={percent} onChange={setPercent} />
          <Button onClick={outoSizeHandler}><FullscreenExitOutlined />合适尺寸</Button>
          <Button onClick={() => setIsFullScreen(true)}><FullscreenOutlined />全屏</Button>
          <Button onClick={downLoad}><DownloadOutlined />下载</Button>
        </div>
      </div>
      <div>
        <Modal
          visible={isFullScreen}
          className={styles.fullScreen}
          onCancel={() => setIsFullScreen(false)}
          width="100%"
          title={null}
          destroyOnClose={true}
          footer={false}
          style={{ top: 0 }}
        >
          <div className={styles.controls}>
            <div className={styles.left} onClick={checkPreImg} title="点击切换上一张"></div>
            <div className={styles.right} onClick={checkNextImg} title="点击切换下一张"></div>
          </div>
          <div className={styles.content}>
            {
              data.type === 1 &&
              <img
              key={uuid.v1()}
              style={{ maxHeight: window.innerHeight, maxWidth: window.innerWidth }}
              className={styles.fullScreenImg}
              crossOrigin={''}
              src={`${baseUrl.upload}/Download/GetFileById?fileId=${content[fsIndex].filePath}&securityKey=1201332565548359680&token=${data.authorization}`}
            />
            }
          </div>
        </Modal>
      </div>
      {/* <MediaImgFullScreen isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} data={data} preFullClick={preFullClick} nextFullClick={nextFullClick}/> */}
      {/* <MediaImgFullScreen isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} data={data} preFullClick={preFullClick} nextFullClick={nextFullClick} /> */}
    </>
  );
}

export default MediaImage;
