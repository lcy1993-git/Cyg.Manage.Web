import React, { useState } from "react";
import DocxFileViewer from "@/components/docx-file-viewer"
import { Spin } from "antd"
import fileSrc from '@/assets/doc/design.docx'
import './index.less'

const ManualPreview: React.FC = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [catalogList, setCatalogList] = useState<object[]>([]);
  // 给所有的h标签加上锚点，并且根据滚动条让锚点点亮
  const loadSuccessEvent = () => {
    const h1Element = document.getElementsByTagName("h1") ?? [];
    const h2Element = document.getElementsByTagName("h2") ?? [];
    const h3Element = document.getElementsByTagName("h3") ?? [];
    const h4Element = document.getElementsByTagName("h4") ?? [];
    const h5Element = document.getElementsByTagName("h5") ?? [];
    const h6Element = document.getElementsByTagName("h6") ?? [];

    for (let i = 0; i < h1Element.length; i++) {
      h1Element[i].id = "h1_" + i;
    }

    for (let i = 0; i < h2Element.length; i++) {
      h2Element[i].id = "h2_" + i;
    }

    for (let i = 0; i < h3Element.length; i++) {
      h3Element[i].id = "h3_" + i;
    }

    for (let i = 0; i < h4Element.length; i++) {
      h4Element[i].id = "h4_" + i;
    }

    for (let i = 0; i < h5Element.length; i++) {
      h5Element[i].id = "h5_" + i;
    }

    for (let i = 0; i < h6Element.length; i++) {
      h6Element[i].id = "h6_" + i;
    }

    // 然后查看id docx下面的儿子元素中含有id的
    const docxContainer = document.querySelector('#docxContainer');
    const docxElement = docxContainer?.children ?? [];

    let hasIdElement = [];

    for (let i = 0; i < docxElement.length; i++) {
      if (docxElement[i].id) {
        let classNameStr = "";
        if (docxElement[i].id.indexOf("h1") > -1) {
          classNameStr = "h1Title"
        }
        if (docxElement[i].id.indexOf("h2") > -1) {
          classNameStr = "h2Title"
        }
        if (docxElement[i].id.indexOf("h3") > -1) {
          classNameStr = "h3Title"
        }
        if (docxElement[i].id.indexOf("h4") > -1) {
          classNameStr = "h4Title"
        }
        if (docxElement[i].id.indexOf("h5") > -1) {
          classNameStr = "h5Title"
        }
        if (docxElement[i].id.indexOf("h6") > -1) {
          classNameStr = "h6Title"
        }
        hasIdElement.push({
          id: docxElement[i].id,
          text: docxElement[i].textContent,
          className: classNameStr
        });
      }
    }

    setCatalogList(hasIdElement);

    setPageLoading(false)
  }

  const catalogClickEvent = (id: string) => {
    const thisElementTop = document.getElementById(id)?.offsetTop;
    if(document.getElementById("pageShowFileContent") !== null) {
      document.getElementById("pageShowFileContent")!.scrollTop = thisElementTop!;
    }
  }

  const elementStr = catalogList.map((item: any) => {
    return (
      <div className={item.className} key={item.id} onClick={() => catalogClickEvent(item.id)}>
        <span>{item.text}</span>
      </div>
    )
  })

  return (
    <div className="pageShowFile">
      <div className="pageShowFileCatalog">
        <div className="pageShowFileCatalogTitle">
          <span>目录</span>
        </div>
        <div id="pageCatalogContainer">
          {elementStr}
        </div>
      </div>
      <div className="pageShowFileContent" id="pageShowFileContent">
        <div className="pageShowFileTitle">
          设计端说明书
        </div>
        <div id="fileContent">
          <DocxFileViewer filePath={fileSrc} onSuccess={loadSuccessEvent} />
        </div>
      </div>
      {
        pageLoading &&
        <div className="pageLoading">
          <Spin spinning={pageLoading} />
        </div>
      }
    </div>

  )
}

export default ManualPreview
