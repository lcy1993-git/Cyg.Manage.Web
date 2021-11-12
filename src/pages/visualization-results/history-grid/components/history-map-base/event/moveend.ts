import { getScale } from '@/pages/visualization-results/utils/methods'
import { MapEvent } from 'ol'

export default function moveend(e: MapEvent) {
  const scaleDom = document.getElementById('historyGridScale')
  if (scaleDom) {
    scaleDom.innerHTML = `比列：${getScale(e.map)}`
  }
}
