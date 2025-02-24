/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
import { useMount, useUpdateEffect } from 'ahooks'
import { message, Spin } from 'antd'
import classNames from 'classnames'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry'
import { PDFPageProxy } from 'pdfjs-dist/types/display/api'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'
import type { PDFWorker } from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker

interface FileDwgViewProps {
  // 最大缩放倍数
  maxScale?: number
  // 单次缩放强度
  zoom?: number
  params: any
  // 加载时间
  loaddingTime?: number
  hasAuthorization: boolean
}

type PointerState = 'pointer' | 'wait'

const FileDwgView: React.FC<FileDwgViewProps> = ({
  maxScale = 8,
  zoom = 0.5,
  loaddingTime = 2000,
  hasAuthorization = false,
  params,
}) => {
  // 加载动画
  const [spinning, setSpinning] = useState(true)

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const spareRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  // 用于做定时器节流
  const timerRef = useRef<any>(null)
  const kScaleRef = useRef<any>(null)
  // 是否为可拖动状态
  const [isDrag, setIsDrag] = useState(false)
  // 设置缩放
  const [scale, setScale] = useState(1)

  // transform缩放
  const [cssScale, setCssScale] = useState(1)
  const [displacement, setDisplacement] = useState({ x: 0, y: 0 })
  const [page, setPage] = useState<PDFPageProxy | null>(null)
  const [downPosition, setDownPositon] = useState({ x: 0, y: 0 })
  const [downScroll, setDownScroll] = useState({ x: 0, y: 0 })

  // 初始化缩放比
  const initkScale = (page: any) => {
    // setScale(wrapRef.current!.clientWidth / page.view[2])

    return +(wrapRef.current!.clientWidth / page.view[2]).toFixed(2) / 1.8
  }

  // 初始化page
  const initPdfPage = (pdfInfo: any) => {
    pdfInfo.getPage(1).then((page: any) => {
      // eslint-disable-next-line no-underscore-dangle

      if (!page._pdfBug) {
        // 获取缩放比
        kScaleRef.current = initkScale(page)

        setPage(page)
      } else {
        message.error('获取文件失败')
      }
    })
  }

  useMount(() => {
    const obz = new ResizeObserver(([dom]) => {
      const parentNode = dom.target.parentNode! as HTMLDivElement
      parentNode.scrollTop = (parentNode.scrollHeight - parentNode.clientHeight) / 2
      obz.unobserve(canvasRef.current!)
    })
    obz.observe(canvasRef.current!)
    return () => obz.unobserve(canvasRef.current!)
  })

  // 请求数据
  const initPdfViewer = () => {
    const token = localStorage.getItem('Authorization')
    // pdfjsLib.getDocument({ url: 'http://26.26.26.1:12333/test8.pdf' })
    pdfjsLib
      .getDocument(
        Object.assign(
          params,
          token && ('httpHeaders' in params || !hasAuthorization)
            ? { httpHeaders: { Authorization: token } }
            : {}
        )
      )
      .promise.then((pdf: PDFWorker) => {
        initPdfPage(pdf)
      })
  }

  // 模式切换 为true时表示当前canvas 为false时表示替用状态的canvas
  const changeMode = (flag: boolean) => {
    if (!canvasRef.current) return
    if (flag) {
      canvasRef.current!.style.display = 'block'
      spareRef.current!.style.display = 'none'
    } else {
      canvasRef.current!.style.display = 'none'
      spareRef.current!.style.display = 'block'
    }
  }

  // 加载canvas到ref
  const loadCanvas = (ref: any, viewport: any) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.height = viewport.height
    canvas.width = viewport.width
    const renderContext = {
      canvasContext: context!,
      viewport,
    }

    const pageRendering = page!.render(renderContext)
    var completeCallback = pageRendering._internalRenderTask.callback
    pageRendering._internalRenderTask.callback = function (err: any) {
      completeCallback.call(this, err)
      cssScale !== 1 && changeMode(true)
    }

    ref.current.innerHTML = ''
    ref.current.append(canvas)
  }
  // 设置离屏的canvas缩放
  const spareScalc = (s: number) => {
    const ks = s * kScaleRef.current
    spareRef.current!.style.transform = `scale(${ks}, ${ks})`
  }
  // 中心缩放调整偏移度
  const spareDisplacement = () => {
    wrapRef.current!.scrollTop = wrapRef.current!.scrollTop + displacement.y * kScaleRef.current
    wrapRef.current!.scrollLeft = wrapRef.current!.scrollLeft + displacement.x * kScaleRef.current
  }

  // 设置鼠标展示状态
  const setMouseState = (flag: PointerState) => {
    // 当等待状态时不可切换状态
    if (flag === 'wait') {
      if (wrapRef.current) {
        wrapRef.current!.style.cursor = 'wait'
      }
      setTimeout(() => {
        setMouseState('pointer')
      }, 800)
    } else {
      setTimeout(() => {
        if (wrapRef.current) {
          wrapRef.current!.style.cursor = 'pointer'
        }
      }, 800)
    }
  }

  useMount(() => {
    initPdfViewer()
    setTimeout(() => {
      setSpinning(false)
    }, loaddingTime)
  })

  useEffect(() => {
    if (!spinning && wrapRef.current) {
      wrapRef.current.addEventListener('wheel', (e) => {
        e.preventDefault()
      })
    }
    if (centerRef.current) {
      centerRef.current.style.display = 'flex'
    }
  }, [spinning])

  // 副作用函数渲染canvas
  useEffect(() => {
    if (page && wrapRef.current) {
      const viewport = page.getViewport({ scale: scale * kScaleRef.current })
      loadCanvas(canvasRef, viewport)
      setMouseState('pointer')
      if (spareRef.current!.children.length === 0) {
        const viewport1 = page.getViewport({ scale })
        loadCanvas(spareRef, viewport1)
        spareScalc(scale)
      }
    }
  }, [scale])
  // page改变表示是第一次渲染 需要初始化滚动条
  useEffect(() => {
    if (page && wrapRef.current) {
      if (centerRef.current?.children.length === 0) {
        const viewport = page.getViewport({ scale: scale * kScaleRef.current })
        loadCanvas(centerRef, viewport, true)
      }
      const viewport = page.getViewport({ scale: scale * kScaleRef.current })
      loadCanvas(canvasRef, viewport, true)
      setMouseState('pointer')
      if (spareRef.current!.children.length === 0) {
        const viewport1 = page.getViewport({ scale })
        loadCanvas(spareRef, viewport1, true)
        spareScalc(scale)
      }
    }
  }, [page])

  useUpdateEffect(() => {
    if (cssScale === 1) {
      clearTimeout(timerRef.current)
      canvasRef.current!.style.display = 'none'
      spareRef.current!.style.display = 'none'
      centerRef.current!.style.display = 'flex'
    } else {
      // 设置css缩放
      spareScalc(cssScale)
      // 设置滚动条偏移
      spareDisplacement()
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        // wrapRef.current.style.cursor = "wait"
        setMouseState('wait')
        setScale(cssScale)
      }, 1000)
    }
  }, [cssScale])

  /** Mouse Event */
  const onmouseUp = () => {
    setIsDrag(false)
  }

  const onmouseMove = (e: { nativeEvent: { clientX: number; clientY: number } }) => {
    if (isDrag) {
      // 鼠标偏移距离
      const pX = e.nativeEvent.clientX - downPosition.x
      const pY = e.nativeEvent.clientY - downPosition.y
      // 计算滚动条偏移距离
      wrapRef.current!.scrollLeft = downScroll.x - pX
      wrapRef.current!.scrollTop = downScroll.y - pY
    }
  }

  const onWheel = (e: { nativeEvent: { deltaY: number; offsetX: number; offsetY: number } }) => {
    // 等待状态不能进行缩放操作
    if (wrapRef.current!.style.cursor === 'wait') return
    let currentscale
    if (e.nativeEvent.deltaY < 0) {
      currentscale = cssScale + zoom
    } else {
      currentscale = cssScale - zoom
    }
    // 缩放边界限定,若缩放边界超出则不执行
    if (currentscale < 1 || currentscale > maxScale) return
    changeMode(false)
    setCssScale(currentscale)
    setDisplacement({
      x: e.nativeEvent.offsetX * (currentscale - cssScale),
      y: e.nativeEvent.offsetY * (currentscale - cssScale),
    })
  }

  const onMouseDown = (e: any) => {
    setIsDrag(true)
    setDownPositon({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY })
    setDownScroll({
      x: wrapRef.current!.scrollLeft,
      y: wrapRef.current!.scrollTop,
    })

    setDownPositon({
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY,
    })
  }

  return (
    <div
      ref={wrapRef}
      style={{ height: window.innerHeight - 100 }}
      className={classNames(styles.dwgWrap)}
      onWheel={onWheel}
      onMouseUp={onmouseUp}
      onMouseMove={onmouseMove}
      onMouseDownCapture={onMouseDown}
      onMouseLeave={onmouseUp}
    >
      <Spin spinning={spinning} className={styles.loading} size="large"></Spin>
      <>
        <div className={styles.canvas} ref={canvasRef} />
        <div className={styles.spare} ref={spareRef} />
        <div className={styles.center} ref={centerRef}></div>
      </>
    </div>
  )
}

export default FileDwgView
