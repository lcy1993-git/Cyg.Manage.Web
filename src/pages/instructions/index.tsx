import React, {useEffect, useState} from 'react';

import ManualPreview from "@/pages/backstage-config/manual-management/components/manual-preview";
import {Empty, message, Spin} from 'antd';
import {useMount} from "ahooks";
import { getLatestInstructions } from '@/services/system-config/manual-management';
import {baseUrl} from "@/services/common";

interface Props {
}
const pageType = [
  {
    path:'instructionsManage',
    category:1
  },{
    path:'instructionsInvestigate',
    category:2
  },{
    path:'instructionsDesign',
    category:3
  },{
    path:'instructionsReview',
    category:4
  },{
    path:'instructionsCost',
    category:5
  },
]
const ManualUpload: React.FC<Props> = () => {
  const [current, setCurrent] = useState<number>(0)
  const [file, setFile] = useState([])

  useMount(()=>{
    let url = window.location.pathname;
    let str = url.substring(url.lastIndexOf('/') + 1, url.length);
    let num = pageType.find(item=>{
      return item.path === str
    })
    if (num !== undefined){
      setCurrent(num.category)
    }
  })
  const downFile =  (id:string,token:string)=>{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${baseUrl.upload}/Download/GetFileById?fileId=${id}&token=${token}`, true,);    // 也可以使用POST方式，根据接口
    xhr.responseType = "blob";  // 返回类型blob
    xhr.setRequestHeader('Authorization', token as string);
    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    // @ts-ignore
    xhr.onload = function (e) {
      // 请求完成
      if (this.status === 200) {
        // 返回200
        // @ts-ignore
        var res = e.target.response;
        // @ts-ignore
        setFile([res])
      }
    }
    xhr.send()
  }
  const getFile = async ()=>{
    const str = window.location.search.split('token=')[1]
    if (str === undefined){
      message.warn('缺少请求token')
      return
    }
    const newFile = await getLatestInstructions(current)
    console.log(!newFile)
    if (!newFile) {
      message.warn('没有找到可用的说明书!')
      return
    }
    downFile(newFile.fileId,str)
  }
  useEffect(()=>{
    if (current === 0) return
    getFile()
  },[current])
  return (
    <div>
      {
        file.length !== 0 &&
          <ManualPreview file={file}  height={'96vh'}/>
      }
       {/*<div style={{margin:'100px auto',display :empty ? 'block' : 'none'}}>*/}
       {/*   <Empty description={'请先上传说明书!'}/>*/}
       {/* </div>*/}
    </div>
  );
};

export default ManualUpload;
