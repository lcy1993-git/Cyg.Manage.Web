import React, { ReactNode, useRef, useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './index.less';
import { useMount } from 'ahooks';

interface ScrollListQueeProps {
  data: any[];
  className?: string;
  height: number; //每个item的高度
}

const ScrollListQuee: React.FC<ScrollListQueeProps> = ({ data, children, height, className }) => {
  if (typeof children !== 'function') {
    console.error('the ScrollListQuee component children must be a function');
  }

  const [timer, setTimer] = useState<number>(0);

  const realDom = (children as (data: any[]) => ReactNode[])(data);

  const [auto, setAuto] = useState(false);

  // 是否可以滚动，当数据没有占满屏幕时，不能滚动
  const [scrollClock, setScrollClock] = useState(false);

  const [preDataLength, setPreDataLength] = useState<number>(data.length);

  const [offsetHeight, setOffsetHeight] = useState(data.length * height);

  const ref = useRef<HTMLDivElement>(null);

  const refRender = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const offsetHeight = data.length * height;
    setOffsetHeight(offsetHeight);
    if (ref.current && refRender.current) {
      // 当数量没有满足时不滚动

      const scrollClock = ref.current?.offsetHeight / height < data.length;
      setScrollClock(scrollClock);
      if (!scrollClock) {
        refRender.current.style.top = '0px';
      }
    }
  }, [data.length]);

  useEffect(() => {
    if (auto && scrollClock) {
      setTimer(
        window.setInterval(() => {
          if (refRender.current) {
            let top = parseInt(refRender.current.style.top);
            if (top <= -2 * offsetHeight) {
              top = top + offsetHeight;
            }
            top--;
            refRender.current.style.top = top + 'px';
          }
        }, 40),
      );
    } else {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [auto]);

  // 根据scrollClock初始化当前样式
  useEffect(() => {
    if (scrollClock && refRender.current) {
      setAuto(true);
      refRender.current.style.top = -offsetHeight + 'px';
    }
  }, [scrollClock]);

  useEffect(() => {
    /**
     * 当新加数据时
     */
    let top = parseInt(refRender.current!.style.top);
    if (auto === true) {
      const newLen = data.length - preDataLength;
      top = top - newLen * height;
      setPreDataLength(data.length);
    }
  }, [JSON.stringify(data)]);

  const handlerScroll = (e: { deltaY: number }) => {
    if (!scrollClock) return;
    let top = parseInt(refRender.current!.style.top);
    /**
     * 滚轮向下
     */
    if (e.deltaY > 0) {
      top = top - height;
      if (top <= -2 * offsetHeight) {
        top = top + offsetHeight;
      }
      refRender.current!.style.top = top + 'px';
    } else {
      /**
       * 滚轮向上
       */
      top = top + height;
      if (top >= 0) {
        top = top - offsetHeight;
      }
      refRender.current!.style.top = top + 'px';
    }
  };

  return (
    <div
      className={styles.limarqueWrap}
      ref={ref}
      onWheel={handlerScroll}
      onMouseEnter={() => setAuto(false)}
      onMouseLeave={() => data.length > 7 && setAuto(true)}
    >
      <div ref={refRender} id="test" className={classNames(styles.renderDom, className)}>
        {
          // top
          scrollClock && realDom
        }
        {realDom}
        {
          // button
          scrollClock && realDom
        }
      </div>
    </div>
  );
};

export default ScrollListQuee;
