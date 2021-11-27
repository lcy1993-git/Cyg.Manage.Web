import { getPointResolution } from 'ol/proj'
import ProjUnits from 'ol/proj/Units'
import { ViewRef } from './../typings/index'

interface OpsSize {
  mode: string
  viewRef: ViewRef
}

/**
 * 修改当前比例尺
 * @param param0
 */
export function handlerGeographicSize({ mode, viewRef }: OpsSize) {
  const size = document.getElementById(`grid_map_size_${mode}`)
  if (size) size.innerText = getScale(viewRef) || ''
}

// 获取比例尺
function getScale(viewRef: ViewRef) {
  const view = viewRef.view
  // let center = view.getCenter();
  // let projection = view.getProjection();
  // let resolution = view.getResolution();
  // let pointResolution = getPointResolution(
  //   projection,
  //   resolution,
  //   center,
  //   ProjUnits.METERS
  // );
  let pointResolution = getPointResolution(
    view.getProjection(),
    view.getResolution()!,
    view.getCenter()!,
    ProjUnits.METERS
  )

  let minWidth = 64
  let nominalCount = minWidth * pointResolution
  let suffix = ''
  if (nominalCount < 0.001) {
    suffix = 'μm'
    pointResolution *= 1000000
  } else if (nominalCount < 1) {
    suffix = 'mm'
    pointResolution *= 1000
  } else if (nominalCount < 1000) {
    suffix = 'm'
  } else {
    suffix = 'km'
    pointResolution /= 1000
  }

  let i = 3 * Math.floor(Math.log(minWidth * pointResolution) / Math.log(10))
  let count, width, decimalCount
  const LEADING_DIGITS = [1, 2, 5]

  while (true) {
    decimalCount = Math.floor(i / 3)
    const decimal = Math.pow(10, decimalCount)
    count = LEADING_DIGITS[((i % 3) + 3) % 3] * decimal
    width = Math.round(count / pointResolution)
    if (isNaN(width)) {
      // this.element.style.display = 'none';
      // this.renderedVisible_ = false;
      return
    } else if (width >= minWidth) {
      break
    }
    ++i
  }
  let text = count.toFixed(decimalCount < 0 ? -decimalCount : 0) + ' ' + suffix
  return '1 : ' + text
}
