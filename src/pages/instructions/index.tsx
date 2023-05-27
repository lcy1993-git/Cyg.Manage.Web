import ManualPreview from '@/pages/backstage-config/manual-management/components/manual-preview'
import { baseUrl } from '@/services/common'
import { getLatestInstructions } from '@/services/system-config/manual-management'
import { useMount } from 'ahooks'
import { message } from 'antd'
import React, { useEffect, useState } from 'react'

interface Props {}
const pageType = [
  {
    path: 'instructionsManage', // 管理端
    category: 1,
    title: '工程智慧云 | 管理',
  },
  {
    path: 'instructionsInvestigate', // 勘察端
    category: 2,
    title: '工程智慧云 | 勘察',
  },
  {
    path: 'instructionsDesign', // 设计端
    category: 3,
    title: '工程智慧云 | 设计',
  },
  {
    path: 'instructionsReview', // 评审端
    category: 4,
    title: '工程智慧云 | 评审',
  },
  {
    path: 'instructionsCost', // 造价端
    category: 5,
    title: '工程智慧云 | 造价',
  },
]
const ManualUpload: React.FC<Props> = () => {
  const [current, setCurrent] = useState<number>(0)
  const [file, setFile] = useState([])
  const [isMobile, setisMobile] = useState(false)
  const isTrans = localStorage.getItem('isTransfer')

  useMount(() => {
    let url = window.location.pathname
    let str = url.substring(url.lastIndexOf('/') + 1, url.length)
    let num = pageType.find((item) => {
      return item.path === str
    })
    if (num !== undefined) {
      setCurrent(num.category)
    }
    if (!/windows phone|iphone|android/gi.test(window.navigator.userAgent)) {
      setisMobile(true)
    } else {
      setisMobile(false)
    }
  })

  let handleUrl = `${baseUrl.upload}`

  let targetUrl = encodeURIComponent(`http://172.2.48.22${handleUrl}`)

  let proxyUrl = `http://117.191.93.63:21525/commonGet?target_url=${targetUrl}`

  let finalUrl = Number(isTrans) === 1 ? proxyUrl : handleUrl

  const downFile = (id: string, token: string) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', `${finalUrl}/Download/GetFileById?fileId=${id}&token=${token}`, true) // 也可以使用POST方式，根据接口
    xhr.responseType = 'blob' // 返回类型blob
    xhr.setRequestHeader('Authorization', token as string)
    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    // @ts-ignore
    xhr.onload = function (e) {
      // 请求完成
      if (this.status === 200) {
        // 返回200
        // @ts-ignore
        var res = e.target.response
        // @ts-ignore
        setFile([res])
      }
    }
    xhr.send()
  }
  const getFile = async () => {
    const str = window.location.search.split('token=')[1]
    if (str === undefined) {
      message.warn('缺少请求token')
      return
    }

    const docTitle = pageType.find((item) => `/${item.path}` === window.location.pathname)
    if (docTitle) {
      document.title = docTitle.title
    }

    const newFile = await getLatestInstructions(current)
    if (!newFile) {
      message.warn('没有找到可用的说明书!')
      return
    }
    downFile(newFile.fileId, str)
  }
  useEffect(() => {
    if (current === 0) return
    getFile()
  }, [current])
  return (
    <div>
      {file.length !== 0 && <ManualPreview file={file} showDirectory={isMobile} height={'96vh'} />}
      {/*<div style={{margin:'100px auto',display :empty ? 'block' : 'none'}}>*/}
      {/*   <Empty description={'请先上传说明书!'}/>*/}
      {/* </div>*/}
    </div>
  )
}

export default ManualUpload
