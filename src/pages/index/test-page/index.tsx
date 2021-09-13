
import React, { useRef, useState } from 'react';


import FilePdfView from '@/components/api-file-view/componnents/file-pdf-view';
const TestPage = () => {

  const [data, setData] = useState<ArrayBuffer| null>(null)

  useMount(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("get", 'http://10.6.4.87:12333/demo.pdf', true);
    xhr.responseType = "arraybuffer";

    xhr.onreadystatechange = (e) => {
      if(e.target.readyState === 4) {
        console.log(e.target.response);
        setData(e.target.response)
      }
    }
    xhr.send();
  })
  
  return (
    <FilePdfView data={data}/>

    
    // <ApiFileView api ={() => downloadDemolitionTemplate("arrayBuffer")} type="xlsx"/>
  )
};

export default TestPage;
