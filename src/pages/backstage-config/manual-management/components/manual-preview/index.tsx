import React, {useState} from "react";
import DocxFileViewer from "@/components/docx-file-viewer"
import { Spin } from "antd"
import styles from './index.less'
import {useMount} from "ahooks";

interface Props{
  file:any[];
  onSuccess?: (val:string) => void;
  height?: string
  fileTitle?: string
  showDirectory ?: boolean
}
const ManualPreview: React.FC<Props> = (props) => {
  const {file,onSuccess,height='70vh',fileTitle,showDirectory=true} = props
  const [pageLoading, setPageLoading] = useState(true);
  const [catalogList, setCatalogList] = useState<object[]>([]);
  const [src,setSrc] = useState<ArrayBuffer | null>(null)

  // 给所有的h标签加上锚点，并且根据滚动条让锚点点亮
  const loadSuccessEvent = (text:string) => {
    onSuccess?.(text)
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
  const turnFileToBlob = (file: any)=>{
    let reader = new FileReader();
    reader.onload = function(e){
      // target.result 该属性表示目标对象的DataURL
      // @ts-ignore
      let res = e.target.result
      if(Object.prototype.toString.call(res) === "[object ArrayBuffer]"){
        // @ts-ignore
        setSrc(res)
      }
    }
    reader.readAsArrayBuffer(file[0]);
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
  useMount(()=>{
    turnFileToBlob(file)
    console.log('start')
    setTimeout(()=>{
      setPageLoading(false)
    },2000)
  })
  return (
    <div className={styles.pageShowFile} style={{height:height}}>
      <div className={styles.pageShowFileCatalog} style={{display: showDirectory ? 'block' : 'none'}}>
        <div className={styles.pageShowFileCatalogTitle} >
          <span>目录</span>
        </div>
        <div id="pageCatalogContainer">
          {elementStr}
        </div>
      </div>
      <div className={styles.pageShowFileContent} id="pageShowFileContent">
        <div className={styles.pageShowFileTitle}>
          {fileTitle}
        </div>
        <div id="fileContent">
          <DocxFileViewer filePath={src} onSuccess={loadSuccessEvent} />
        </div>
      </div>
      {
        pageLoading &&
        <div className={styles.pageLoading}>
          <Spin spinning={pageLoading} tip={'加载中...'}/>
        </div>
      }
    </div>

  )
}

export default ManualPreview
