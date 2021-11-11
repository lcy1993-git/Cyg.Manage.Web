import React, { useRef, useState, useMemo, useEffect } from 'react';
import { message } from 'antd';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import { PDFPageProxy } from 'pdfjs-dist/types/display/api';
import { add, subtract, multiply, divide } from 'lodash';

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

import styles from './index.less';
import { useMount } from 'ahooks';

interface PdfFileViewProps {
  params: any;
  hasAuthorization: boolean;
}

const PdfFileView: React.FC<PdfFileViewProps> = ({ params, hasAuthorization = false }) => {
  const zoom = 0.2;
  const [savePage, setSavePage] = useState<PDFPageProxy | null>(null);

  // transform缩放
  const [cssScale, setCssScale] = useState(1);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [downPosition, setDownPosition] = useState<[number, number]>([0, 0]);
  const [activePosition, setActivePosition] = useState<[number, number]>([0, 0]);
  const maxScale = useRef<number>(0);
  const minScale = useRef<number>(1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const wrapCanvasRef = useRef<HTMLDivElement>(null);

  const initPdfFileViewer = () => {
    const token = localStorage.getItem('Authorization');
    pdfjsLib
      .getDocument(
        Object.assign(
          params,
          token && ('httpHeaders' in params || !hasAuthorization)
            ? { httpHeaders: { Authorization: token } }
            : {},
        ),
      )
      .promise.then((pdf) => {
        initPdfPage(pdf);
      });
  };

  const initPdfPage = (pdfInfo: any) => {
    pdfInfo.getPage(1).then((page: any) => {
      if (!page._pdfBug) {
        const [_0, _1, width, height] = page.view;
        maxScale.current = +parseInt((Math.min(4000 / width, 4000 / height) as unknown) as string);
        minScale.current = +parseFloat(
          (Math.min(
            wrapRef.current!.clientWidth / width,
            wrapRef.current!.clientHeight / height,
          ) as unknown) as string,
        ).toFixed(1);

        const viewport = page.getViewport({ scale: minScale.current });
        setCssScale(minScale.current);
        wrapCanvasRef.current!.style.width = `${minScale.current * 100}%`;
        wrapCanvasRef.current!.style.height = `${minScale.current * 100}%`;

        wrapRef.current!.scrollLeft = (wrapCanvasRef.current!.clientWidth - wrapRef.current!.clientWidth) / 2;
        wrapRef.current!.scrollTop = (wrapCanvasRef.current!.clientHeight - wrapRef.current!.clientHeight) / 2;

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

  const onWheel = (e: React.WheelEvent) => {
    // 等待状态不能进行缩放操作

    if (wrapRef.current!.style.cursor === 'wait') return;
    let currentscale;
    if (e.nativeEvent.deltaY < 0) {
      currentscale = cssScale + zoom;
    } else {
      currentscale = cssScale - zoom;
    }
    // 缩放边界限定,若缩放边界超出则不执行
    if (currentscale < minScale.current) {
      return setCssScale(minScale.current);
    }
    if (currentscale > maxScale.current) {
      return setCssScale(maxScale.current);
    }
    // 计算点的偏移量
    const viewport = savePage!.getViewport({ scale: currentscale });

    const currentScaleX = add(e.currentTarget.offsetLeft, e.nativeEvent.offsetX);
    const afterScaleX = multiply(divide(currentScaleX, cssScale), currentscale);
    const xDiff = subtract(afterScaleX, currentScaleX);

    const currentScaleY = add(e.currentTarget.offsetTop, e.nativeEvent.offsetY);
    const afterScaleY = multiply(divide(currentScaleY, cssScale), currentscale);
    const yDiff = subtract(afterScaleY, currentScaleY);
    wrapCanvasRef.current!.style.width = `${currentscale * 100}%`;
    wrapCanvasRef.current!.style.height = `${currentscale * 100}%`;

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

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDrag(true);
    if (wrapRef.current) {
      wrapRef.current!.style.cursor = 'pointer';
    }

    setDownPosition([e.clientX, e.clientY]);
    setActivePosition([wrapRef.current!.scrollLeft, wrapRef.current!.scrollTop]);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDrag) {
      wrapRef.current!.scrollLeft = activePosition[0] + downPosition[0] - e.clientX;
      wrapRef.current!.scrollTop = activePosition[1] + downPosition[1] - e.clientY;
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    setIsDrag(false);
    if (wrapRef.current) {
      wrapRef.current!.style.cursor = 'unset';
    }
  };

  return (
    <div className={styles.viewContent} ref={wrapRef} style={{ height: window.innerHeight - 100 }}>
      <div
        ref={wrapCanvasRef}
        className={styles.wrapCanvasContent}
        style={{ width: `100%`, height: `100%` }}
      >
        <div
          className={styles.canvas}
          ref={canvasRef}
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseUp}
          onMouseUp={onMouseUp}
        ></div>
      </div>
    </div>
  );
};

export default PdfFileView;
