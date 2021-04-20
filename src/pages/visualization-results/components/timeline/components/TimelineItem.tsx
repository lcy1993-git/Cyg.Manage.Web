import React, { FC } from "react";
import { TimelineItemProps } from "../index.d";
import styles from '../index.less';
import Circle from "./Circle";

/**
 *
 * @param props
 * @returns
 *
 * item子组件
 *
 * 对子组件的渲染分为三种情况
 * 1.第一个点
 * 2.2-length - 1个，
 * 3.最后一个点
 *
 *
 */
const TimelineItem: FC<TimelineItemProps> = (props: TimelineItemProps) => {
  //length表示数组的长度
  const { date, index, active, length, click, onClick } = props;
  const activedStyle = {
    fontSize: "10px",
    fontWeight: 400,
    color: "#0E7B3B",
    textAlign: "left",
  };

  const unActivedStyle = {
    fontSize: "10px",
    fontWeight: 400,
    color: "#898B8D",
    textAlign: "left",
  };

  return (
    <div className={styles.timelineItem}>
      <div className={styles.time}>
        <div className="timeValue">
          <div className="status">
            {/* 第一个点和第一个点特殊对待 */}

            {/* 第一个点 */}
            {index === 0 ? (
              <svg width="100" height="20">
                {length > 1 ? (
                  <line
                    x1="8"
                    y1="10"
                    x2="100"
                    y2="10"
                    strokeWidth="5"
                    style={{
                      stroke:
                        active && !click
                          ? activedStyle.color
                          : unActivedStyle.color,
                    }}
                  ></line>
                ) : null}

                <Circle
                  stroke={click ? "white" : unActivedStyle.color}
                  strokeWidth={click ? 1.5 : 0}
                  fill={active ? activedStyle.color : unActivedStyle.color}
                />
              </svg>
            ) : null}
            {/* 中间的点 */}
            {length > 1 && index !== 0 && index !== length - 1 ? (
              <svg width="100" height="20">
                <line
                  x1="9"
                  y1="10"
                  x2="100"
                  y2="10"
                  strokeWidth="5"
                  style={{
                    stroke:
                      active && !click
                        ? activedStyle.color
                        : unActivedStyle.color,
                    strokeLinejoin: "round",
                  }}
                ></line>
                <Circle
                  stroke={click ? "white" : unActivedStyle.color}
                  strokeWidth={click ? 1.5 : 0}
                  fill={active ? activedStyle.color : unActivedStyle.color}
                />
              </svg>
            ) : null}
            {/* 最后一个点 */}
            {length > 1 && length - 1 === index ? (
              <svg width="70" height="20">
                <Circle
                  stroke={click ? "white" : unActivedStyle.color}
                  strokeWidth={click ? 2 : 0}
                  fill={active ? activedStyle.color : unActivedStyle.color}
                />
              </svg>
            ) : null}

            <div
              onClick={() => onClick(index)}
              style={{
                color: active ? activedStyle.color : unActivedStyle.color,
                fontSize: unActivedStyle.fontSize,
                fontWeight: unActivedStyle.fontWeight,
                textAlign: "left",
                width: length - 1 === index ? "70px" : "100px",
              }}
            >
              {date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
