import BaseEvent from 'ol/events/Event'
import { InterActionRef } from './../index'

interface Ops {
  interActionRef: InterActionRef
}

export default function mapClick(e: BaseEvent, { interActionRef }: Ops) {
  // 当处于框选状态时，清理所有框选元素
  if (interActionRef.isDragBox === true) {
    interActionRef.select!.boxSelect.getFeatures().clear()
  }

  console.log('mapClick')
}
