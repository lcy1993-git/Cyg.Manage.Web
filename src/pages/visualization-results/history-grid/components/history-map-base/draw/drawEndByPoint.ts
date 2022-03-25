import { Coordinate } from 'ol/coordinate'
import Feature from 'ol/Feature'
import LineString from 'ol/geom/LineString'
import { saveData, saveHistoryData } from '../../../service'
import { ElectricLineData, UpdateHistoryData } from '../typings'
import { DrawEndByLineStringProps, pointOnLine, transform } from './drawEndByLineString'

export function drawEndByPoint({
  formData,
  sourceRef,
  drawProps,
  mode,
  preId,
  reFetchDraw,
}: DrawEndByLineStringProps) {
  const currentState = drawProps.currentState as Coordinate

  // 需要传递给后台的数据
  const updateHistoryData: UpdateHistoryData = {
    equipments: [],
    lines: [],
    toBeDeletedEquipmentIds: [],
    toBeDeletedLineIds: [],
  }
  const features =
    mode === 'history'
      ? sourceRef.historyLineSource.getFeatures()
      : sourceRef.designLineSource.getFeatures()

  let currentFeature: Feature<LineString> | null = null
  let isPointInLine = features.some(
    (f) => pointOnLine(currentState, f.getGeometry()?.getCoordinates()!) && (currentFeature = f)
  )

  const transformState = transform(currentState)

  if (isPointInLine) {
    const { geometry, id, ...data } = currentFeature!.getProperties()
    const [start, end] = currentFeature!
      .getGeometry()!
      .getCoordinates()
      .map(transform) as Coordinate[]
    updateHistoryData.lines.push(
      {
        ...(data as ElectricLineData),
        startLng: start[0],
        startLat: start[1],
        endLng: transformState[0],
        endLat: transformState[1],
      },
      {
        ...(data as ElectricLineData),
        startLng: transformState[0],
        startLat: transformState[1],
        endLng: end[0],
        endLat: end[1],
      }
    )
    updateHistoryData.toBeDeletedLineIds.push(currentFeature!.get('id'))
  }
  updateHistoryData.equipments.push({
    ...formData,
    lng: transformState[0],
    lat: transformState[1],
  })

  const save = mode === 'history' ? saveHistoryData : saveData
  const idProps = mode === 'history' ? {} : { id: preId! }

  save({ ...updateHistoryData, ...idProps }).then(() => {
    reFetchDraw()
  })

  sourceRef.drawSource.clear()
}
