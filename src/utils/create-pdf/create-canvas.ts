import * as echarts from 'echarts'

const createCanvas = (options: object, { width = '800px', height = '600px' }) => {
  const node = document.createElement('div')
  node.style.width = width
  node.style.height = height
  node.style.paddingLeft = '6px'
  node.style.paddingRight = '6px'
  const exp = echarts.init(node)
  exp.setOption({ ...options, animation: false })
  return node
}

export default createCanvas
