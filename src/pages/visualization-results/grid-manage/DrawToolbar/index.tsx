import { Button, Radio } from 'antd'
import { useMyContext } from '../Context'

interface PropsType {
  style: React.CSSProperties
}

const DrawToolbar = (props: PropsType) => {
  const { style } = props
  // const store = useContainer()
  const { setdrawToolbarVisible } = useMyContext()
  const toolbarOptions = [
    { label: '杆塔', value: 'Tower' },
    { label: '柱上断路器', value: 'Breaker' },
    { label: '箱变', value: 'BoxTransformer' },
    { label: '环网柜', value: 'HXGN' },
    { label: '配电室', value: 'DistributionRoom' },
    { label: '开闭所', value: 'SSP' },
    { label: '电缆分支箱', value: 'DFW' },
    { label: '变电站', value: 'Substation' },
    { label: '电源', value: 'PowerPack' },
  ]
  /**
   * 选择将要绘制的要素
   * */
  const selectDrawFeature = (result: any) => {}
  return (
    <div className="absolute h-14 top-5 right-5" style={{ ...style }}>
      <div className="h-full flex justify-center items-center">
        <Radio.Group options={toolbarOptions} onChange={selectDrawFeature} />
        <Button type="primary" onClick={() => setdrawToolbarVisible(false)}>
          关闭工具栏
        </Button>
      </div>
    </div>
  )
}
export default DrawToolbar
