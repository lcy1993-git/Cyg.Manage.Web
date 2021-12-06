import { useMount } from 'ahooks'
import { message } from 'antd'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry'
// import { PDFPageProxy } from 'pdfjs-dist/types/display/api'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker

interface PdfFileViewProps {
  params: any
  hasAuthorization: boolean
}

const PdfFileView: React.FC<PdfFileViewProps> = ({ params, hasAuthorization = false }) => {
  const zoom = 0.2
  // const [savePage, setSavePage] = useState<PDFPageProxy | null>(null)

  // transform缩放
  const [cssScale, setCssScale] = useState(2)
  const maxScale = useRef<number>(2.5)
  const minScale = useRef<number>(0.5)
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [pdf, setPdf] = useState<any>()
  const initPdfFileViewer = () => {
    const token = localStorage.getItem('Authorization')
    pdfjsLib
      .getDocument(
        Object.assign(
          params,
          token && ('httpHeaders' in params || !hasAuthorization)
            ? { httpHeaders: { Authorization: token } }
            : {}
        )
      )
      .promise.then((pdf) => {
        setPdf(pdf)
        initPdfPage(pdf)
      })
  }

  const initPdfPage = (pdfInfo: any) => {
    if (canvasRef && canvasRef.current) {
      canvasRef.current.innerHTML = ''
    }
    for (let i = 1; i <= pdfInfo.numPages; i++) {
      pdfInfo.getPage(i).then((page: any) => {
        if (!page._pdfBug) {
          // const [_0, _1, width, height] = page.view
          const viewport = page.getViewport({ scale: cssScale })
          const divContent = document.createElement('div')
          divContent.className = 'pdfItem'
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width
          const renderContext = {
            canvasContext: context!,
            viewport: viewport,
          }
          page.render(renderContext)
          if (canvasRef && canvasRef.current) {
            divContent.append(canvas)
            // console.log(divContent)

            canvasRef.current.appendChild(divContent)
          }
          // setSavePage(page)
        } else {
          message.error('获取文件失败')
        }
      })
    }
  }

  const onWheel = (e: React.WheelEvent) => {
    // 等待状态不能进行缩放操作

    if (wrapRef.current!.style.cursor === 'wait') return

    let currentscale
    if (e.nativeEvent.deltaY < 0) {
      currentscale = cssScale + zoom
    } else {
      currentscale = cssScale - zoom
    }
    // 缩放边界限定,若缩放边界超出则不执行
    if (currentscale < minScale.current) {
      return setCssScale(minScale.current)
    }
    if (currentscale > maxScale.current) {
      return setCssScale(maxScale.current)
    }
    setCssScale(currentscale)
    initPdfPage(pdf)
  }

  useMount(() => {
    initPdfFileViewer()
  })

  useEffect(() => {
    // @ts-ignore
    // 隔离原生onwhell事件
    wrapRef.current.onmousewheel = function () {
      return false
    }
  }, [])

  return (
    <div style={{ maxHeight: window.innerHeight - 220, overflowY: 'scroll' }}>
      <div className={styles.viewContent} ref={wrapRef}>
        <div className={styles.canvas} ref={canvasRef} onWheel={onWheel}></div>
      </div>
    </div>
  )
}

export default PdfFileView
