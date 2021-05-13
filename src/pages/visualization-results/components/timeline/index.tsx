import React, { useState, FC, useEffect, createRef } from 'react';
import _ from 'lodash';
import styles from './index.less';
import { TimelineProps } from './index.d';
import TimelineItem from './components/TimelineItem';
import Scrollbars from 'react-custom-scrollbars';
import { useContainer } from '../../result-page/mobx-store';
import { observer } from 'mobx-react-lite';

interface dataItem {
  idx: number;
  date: string;
  active: boolean;
  click: boolean;
}
//容器组件初始化传进来的日期数组，对数组进行排序
const Timeline: FC<TimelineProps> = observer((props: TimelineProps) => {
  const { dates, height, type } = props;
  const store = useContainer();
  const [activeList, setActiveList] = useState<dataItem[]>();

  //默认scroll到最右边
  const scrollbars = createRef<Scrollbars>();
  useEffect(() => {
    setActiveList(
      dates.map((v: string, idx: number) => {
        return {
          idx: idx,
          date: v,
          active: true,
          click: false,
        };
      }),
    );
    if (dates.length > 1) {
      scrollbars.current?.scrollToRight();
    }
  }, [dates]);
  //点击scroll到右边
  const onClickScrollLeft = () => {
    scrollbars.current?.scrollToLeft();
  };

  //点击scroll到左边
  const onClickScrollRight = () => {
    scrollbars.current?.scrollToRight();
  };

  /**
   *
   * @param clickIndex 点击的日期的在数组里面的下标
   *
   *
   * 对数组进行处理
   * 分为等于，大于，小于三种情况
   * 分别对数组里面的日期进行状态处理
   * active === true时高亮
   * click时来标记是否被点击
   * 被click前面的数据都需要绿色高亮，被点击的需要有白色stroke包围
   * 最后深复制数组更新状态
   */
  const onClick = (clickIndex: number) => {
    const newList = activeList?.map(({ idx, active, date }) => {
      if (clickIndex === idx) {
        return {
          idx: idx,
          date: date,
          active: true,
          click: true,
        };
      } else if (clickIndex > idx) {
        return {
          idx: idx,
          active: true,
          date: date,
          click: false,
        };
      } else {
        return {
          idx: idx,
          active: false,
          date: date,
          click: false,
        };
      }
    });

    setActiveList(_.cloneDeep(newList));
    if (newList) {
      store.setClickDate(newList[clickIndex].date, type);
    }
  };

  return (
    <Scrollbars
      autoHide
      ref={scrollbars}
      style={{ width: dates.length > 7 ? 600 : dates.length * 70 + 16, height: height }}
    >
      <div
        className={styles.timeline}
        style={{
          width: `${dates.length > 7 ? dates.length * 70 + 36 : dates.length * 70 + 16}px`,
          height: `${height}px`,
          paddingLeft: '8px',
          paddingRight: '8px',
        }}
      >
        {/* 是否显示滚动到最后 */}
        {dates.length > 10 ? (
          <div onClick={onClickScrollLeft} className={styles.leftArrow}>
            {'<'}
          </div>
        ) : null}
        {/* 是否显示滚动到最开始 */}
        {dates.length > 10 ? (
          <div onClick={onClickScrollRight} className={styles.rightArrow}>
            {'>'}
          </div>
        ) : null}
        {activeList?.map(({ date, active, idx, click }) => {
          return (
            <TimelineItem
              key={date}
              index={idx}
              click={click}
              date={date}
              length={activeList.length}
              onClick={onClick}
              active={active}
            />
          );
        })}
      </div>
    </Scrollbars>
  );
});

export default Timeline;
