import { divide, multiply, subtract } from 'lodash';
import uuid from 'node-uuid';
/**
 * initConfigArray函数处理计算坐标首页驾驶舱自定义布局信息
 * data 请求到的数据
 * return 处理后具有坐标信息的数组
 */
export default (data: any) => {
  const windowHeight = window.innerHeight - 115 > 828 ? window.innerHeight - 115 : 828;
  if (data) {
    const hasSaveConfig = JSON.parse(data);
    if (hasSaveConfig.config && hasSaveConfig.config.length > 0) {
      const windowPercent = divide(windowHeight, hasSaveConfig.configWindowHeight);
      const thisConfigArray = hasSaveConfig.config.map((item: any) => {
        const actualHeight = windowPercent
          ? Math.floor(multiply(item.h, windowPercent) * 100) / 100
          : item.h;
        const actualY = windowPercent ? multiply(item.y, windowPercent) : item.y;
        return {
          ...item,
          y: actualY,
          h: actualHeight,
        };
      });
      return thisConfigArray;
    }
  } else {
    const thisBoxHeight = windowHeight - 75;
    const totalHeight = divide(thisBoxHeight, 18);
    return ([
      { name: 'toDo', x: 0, y: 0, w: 3, h: 11, key: uuid.v1() },
      {
        name: 'mapComponent',
        x: 3,
        y: 0,
        w: 6,
        h: subtract(totalHeight, divide(totalHeight - 11, 2)),
        key: uuid.v1(),
      },
      { name: 'projectType', x: 9, y: 0, w: 3, h: 11, key: uuid.v1() },
      {
        name: 'projectRefreshData',
        x: 0,
        y: 11,
        w: 3,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
      },
      { name: 'personLoad', x: 9, y: 11, w: 3, h: divide(totalHeight - 11, 2), key: uuid.v1() },
      {
        name: 'deliveryManage',
        x: 0,
        y: divide(totalHeight - 11, 2) + 11,
        w: 6,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
      },
      {
        name: 'projectProgress',
        x: 6,
        y: divide(totalHeight - 11, 2) + 11,
        w: 6,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
      },
    ]);
  }
}
