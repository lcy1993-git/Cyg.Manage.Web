import React, { useRef, useState, useMemo, useEffect } from 'react';
import { message } from 'antd';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import { PDFPageProxy } from 'pdfjs-dist/types/display/api';
import { add, subtract, multiply, divide } from 'lodash';

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

import styles from './index.less';
import { useMount, useSize } from 'ahooks';

const PdfFileView: React.FC = (params) => {
  const scale = 1;
  const zoom = 0.2;
  const maxScale = 4;
  const [savePage, setSavePage] = useState<PDFPageProxy | null>(null);

  // transform缩放
  const [cssScale, setCssScale] = useState(1);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const wrapCanvasRef = useRef<HTMLDivElement>(null);

  const wrapSize = useSize(wrapRef);

  const initPdfFileViewer = () => {
    pdfjsLib
      .getDocument({
        url: 'http://10.6.5.239:8000/test8.pdf',
      })
      .promise.then((pdf) => {
        initPdfPage(pdf);
      });
  };

  const initPdfPage = (pdfInfo: any) => {
    pdfInfo.getPage(1).then((page: any) => {
      if (!page._pdfBug) {
        const viewport = page.getViewport({ scale });
        loadCanvas(canvasRef, viewport, page);

        setSavePage(page);
      } else {
        message.error('获取文件失败');
      }
    });
  };

  // 加载canvas到ref
  const loadCanvas = (ref: any, viewport: any, thisPage: any) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context!,
      viewport,
    };

    thisPage!.render(renderContext);

    ref.current.innerHTML = '';
    ref.current.style.width = viewport.width + 'px';
    ref.current.style.height = viewport.height + 'px';
    ref.current.append(canvas);
  };

  const onWheel = (e: { nativeEvent: { deltaY: number; offsetX: number; offsetY: number } }) => {
    // 等待状态不能进行缩放操作

    if (wrapRef.current!.style.cursor === 'wait') return;
    let currentscale;
    if (e.nativeEvent.deltaY < 0) {
      currentscale = cssScale + zoom;
    } else {
      currentscale = cssScale - zoom;
    }
    // 缩放边界限定,若缩放边界超出则不执行
    if (currentscale < 1 || currentscale > maxScale) return;
    // 计算点的偏移量
    const viewport = savePage!.getViewport({ scale: currentscale });

    const currentScaleX = add(e.currentTarget.offsetLeft, e.nativeEvent.offsetX);
    const afterScaleX = multiply(divide(currentScaleX, cssScale), currentscale);
    const xDiff = subtract(afterScaleX, currentScaleX);

    const currentScaleY = add(e.currentTarget.offsetTop, e.nativeEvent.offsetY);
    const afterScaleY = multiply(divide(currentScaleY, cssScale), currentscale);
    const yDiff = subtract(afterScaleY, currentScaleY);
    wrapCanvasRef!.current.style.width = `${currentscale * 100}%`;
    wrapCanvasRef!.current.style.height = `${currentscale * 100}%`;
    wrapRef.current!.scrollLeft = wrapRef.current!.scrollLeft + xDiff;
    wrapRef.current!.scrollTop = wrapRef.current!.scrollTop + yDiff;

    setCssScale(currentscale);
    loadCanvas(canvasRef, viewport, savePage);
  };

  useMount(() => {
    initPdfFileViewer();
  });

  useEffect(() => {
    // @ts-ignore
    // 隔离原生onwhell事件
    wrapRef.current.onmousewheel = function () {
      return false;
    };
  }, []);

  return (
    <div className={styles.viewContent} ref={wrapRef}>
      <div
        ref={wrapCanvasRef}
        className={styles.wrapCanvasContent}
        style={{ width: `100%`, height: `100%` }}
      >
        <div className={styles.canvas} ref={canvasRef} onWheel={onWheel}></div>
      </div>
    </div>
  );
};

export default PdfFileView;
