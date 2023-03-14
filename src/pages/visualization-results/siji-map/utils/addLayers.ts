/**
 * 加载点位，自定义样式
 * @param map 地图对象
 * @param imageUrl 图标url
 * @param id 图层ID
 * @param features 数据集合
 */
export const addIcon = (map: any, imageUrl: any, id: string, features: any) => {
  const imageId = id + '_poi'
  //画图片点，需要先加载图片 图片路径在页面部署在服务上时可以用相对路径
  map.loadImage(imageUrl, (error: any, image: any) => {
    //添加图片到map，第一个参数为图片设置id
    map.addImage(imageId, image)
    map.addLayer({
      id: id,
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features,
        },
      },
      layout: {
        // 为图层设置引用的图片ID
        'icon-image': imageId,
        'icon-size': 1,
        'icon-ignore-placement': true,
      },
    })
  })
}

/**
 * 加载点位，圆点样式
 * @params map: 地图对象
 * @params id: 图层ID, 例如： tower_G
 * @params features: 数据集合
 * @params color: 点位颜色
 **/
export const addCircle = (map: any, id: string, features: any[], color: string) => {
  map.addLayer({
    id,
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    },
    paint: {
      // 圆半径
      'circle-radius': 10,
      // 圆颜色
      'circle-color': color,
      // 圆环颜色
      'circle-stroke-color': '#4aabf7',
      // 圆环宽度
      'circle-stroke-width': 3,
    },
  })
}

/**
 * 加载点位
 * @params map: 地图对象
 * @params id: 线路图层ID
 * @params features: 数据集合
 * @params color:
 * */
export const addLine = (map: any, id: string, features: any, color: string) => {
  map.addLayer({
    id,
    type: 'line',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': color,
      'line-width': 4,
    },
  })
}
