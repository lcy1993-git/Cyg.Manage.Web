import html2pdf from 'html2pdf.js'

// const cloneCanvas = (oldCanvas: HTMLCanvasElement) => {
//   const newCanvas = document.createElement('canvas')
//   const context = newCanvas.getContext('2d')

//   newCanvas.width = oldCanvas.width
//   newCanvas.height = oldCanvas.height

//   context?.drawImage(oldCanvas, 0, 0)

//   return newCanvas
// }

// const cloneNoTableNode = (node: HTMLElement) => {
//   const cloneNode = node.cloneNode(true) as HTMLElement
//   const canvases: any = cloneNode.getElementsByTagName('canvas')
//   if (canvases.length) {
//     const originCanvases = node.getElementsByTagName('canvas')
//     canvases.forEach((canvas: HTMLCanvasElement, index: any) => {
//       const newCanvas = cloneCanvas(originCanvases[index])
//       const pNode = canvas.parentNode as HTMLElement
//       pNode.appendChild(newCanvas)
//       pNode.removeChild(canvas)
//     })
//   }
//   return cloneNode
// }

const createPdfDom = (nodes: [HTMLElement]) => {
  const container = document.createElement('div')
  nodes.forEach((node) => {
    const preAppendNode = node.parentNode ? node.cloneNode(true) : node
    container.appendChild(preAppendNode)
  })
  return container
}

const savePdf = (nodes: [HTMLElement], name?: string) => {
  const pdfDom = createPdfDom(nodes)

  const worker = html2pdf()
    .set({
      pagebreak: { mode: 'avoid-all', before: '#page2el' },
    })
    .from(pdfDom)
    .save(name)

  return worker
}

export default savePdf
