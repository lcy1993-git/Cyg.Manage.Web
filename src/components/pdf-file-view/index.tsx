import React, { useRef, useState } from 'react';
import { message } from 'antd';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import { PDFPageProxy } from 'pdfjs-dist/types/display/api';

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

import styles from './index.less';
import { useMount } from 'ahooks';
const PdfFileView: React.FC = (params) => {
  const scale = 1;
  const [page, setPage] = useState<PDFPageProxy | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const spareRef = useRef<HTMLDivElement>(null);
  // 用于做定时器节流
  const timerRef = useRef<any>(null);
  const kScaleRef = useRef<any>(null);

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
        loadCanvas(spareRef, viewport, page);
      } else {
        message.error('获取文件失败');
      }
    });
  };

  // 加载canvas到ref
  const loadCanvas = (ref: any, viewport: any, thisPage) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context!,
      viewport,
    };

    thisPage!.render(renderContext);
    // var completeCallback = pageRendering._internalRenderTask.callback;
    // pageRendering._internalRenderTask.callback = function (err: any) {
    //   completeCallback.call(this, err);
    // };
    ref.current.innerHTML = "";
    ref.current.append(canvas);
  };

  useMount(() => {
    initPdfFileViewer();
  });

  return (
    <div className={styles.viewContent} ref={wrapRef}>
      <div className={styles.canvas} ref={canvasRef}></div>
      <div className={styles.spare} ref={spareRef}></div>
    </div>
  );
};

export default PdfFileView;
