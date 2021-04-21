import React, { useState, FC, useEffect, createRef } from 'react';
import moment from 'moment';
import _ from 'lodash';
import styles from './index.less';
import { TimelineProps } from './index.d';
import TimelineItem from './components/TimelineItem';
import Scrollbars from 'react-custom-scrollbars';

interface dataItem {
  idx: number;
  date: string;
  active: boolean;
  click: boolean;
}
//容器组件初始化传进来的日期数组，对数组进行排序
const Timeline: FC<TimelineProps> = (props: TimelineProps) => {
  const { dates, height, width } = props;

  const [activeList, setActiveList] = useState<dataItem[]>([]);

  //默认scroll到最右边
  const scrollbars = createRef<Scrollbars>();
  useEffect(() => {
    if (dates) {
      let d = dates
        .filter((v: string) => v !== '')
        .map((v: string) => moment(v).valueOf())

        .sort((a: number, b: number) => a - b)
        .map((v: number, idx: number) => {
          return {
            idx: idx,
            date: moment(v).format('YYYY/MM/DD'),
            active: true,
            click: false,
          };
        });

      setActiveList(d);
    }

    scrollbars.current?.scrollToRight();
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
  };
  return (
    <Scrollbars autoHide ref={scrollbars} style={{ width: width, height: height }}>
      <div
        className={styles.timeline}
        style={{
          width: activeList.length < 5 ? 400 : activeList.length * 100 + 30,
          height: `${height}px`,
          paddingLeft: '8px',
          paddingRight: '8px',
        }}
      >
        {/* 是否显示滚动到最后 */}
        {activeList.length > 5 ? (
          <div onClick={onClickScrollLeft} className={styles.leftArrow}>
            {'<'}
          </div>
        ) : null}
        {/* 是否显示滚动到最开始 */}
        {activeList.length > 5 ? (
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
};

export default Timeline;
