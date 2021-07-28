import React from 'react';
// @ts-ignore
import mammoth from 'mammoth';
import PDFJS from 'pdfjs-dist';
import { message } from 'antd';
export default class RightComponent extends React.Component {
  componentDidMount() {
    this.getPdfData();
  }
  getPdfData = () => {
    let pdfUrl = 'xxx.pdf'; //同样是pdf文件或者是一个地址
    // 下面就是解析文件或者url
    PDFJS.getDocument(pdfUrl as string)
      .promise.then(async function (pdfDoc_: any) {
        let pdfDoc = pdfDoc_; // 因为不想要分页所以循环生成canvas
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          // 因为不知道把pdf解析了多少页，所以我们需要循环创建canvas并且一定要不同的id
          let canvas = document.createElement('canvas');
          canvas.id = `pdf${i}`;
          let context = canvas.getContext('2d'); // 通过getPage的方法获取到每一页的内容渲染，结束后把当前创建的canvas添加到页面中
          pdfDoc.getPage(i).then((page: any) => {
            var scale = 2;
            var viewport = page.getViewport(scale);
            const canvas = document.createElement('canvas');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            page.render(renderContext);
          }); // 获取到页面定义好的父元素，把生成的canvas添加进去
          // @ts-ignore
          document.getElementById('pdfList').appendChild(canvas);
        }
      })
      .catch(() => {
        message.error('pdf加载失败');
      });
  };
  render() {
    return <div id="pdfList"></div>;
  }
}
