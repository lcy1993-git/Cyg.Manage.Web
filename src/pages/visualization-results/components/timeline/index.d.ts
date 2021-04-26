export interface TimelineProps {
  dates?: (string | undefined)[] | undefined; //传入的日期数组
  height?: number;
  width?: number;
  type: 'observe' | 'normal';
}

export interface TimelineItemProps {
  date: string; //item展示的日期
  index: number; //在数组里面的小标
  active: boolean; //是否处于点击日期之前
  length: number; //数组长度
  click: boolean; //是否被点击
  onClick: (clickIndex: number) => void; //点击事件
}

export interface CircleProps {
  stroke: string; //border颜色
  fill: string; //填充颜色
  strokeWidth: number;
  onClick?: () => void;
}

export interface LineProps {}
