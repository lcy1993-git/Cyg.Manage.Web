import FileUpload from '@/components/file-upload'
import ManualPreview from '@/pages/backstage-config/manual-management/components/manual-preview'
import { baseUrl } from '@/services/common'
import {
  saveQuotaLibraryCatalogDescription,
  UploadChapterDescriptionFile,
  UploadChapterDescriptionFiles,
} from '@/services/technology-economic'
import { handleSM2Crypto } from '@/utils/utils'
import { DownloadOutlined, ExportOutlined } from '@ant-design/icons'
import { useBoolean } from 'ahooks'
import { Button, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import WangEditor from '../wang-editor'
import styles from './index.less'
interface Props {
  data: string
  id: string
  title?: string
  nodeId?: string
  update: () => void
  fileId: string
  disabledDown: boolean
}
const ChapterInfo: React.FC<Props> = ({
  data,
  id,
  update,
  title,
  nodeId,
  fileId,
  disabledDown,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false)
  const [html, setHtml] = useState<string>(data)
  const [file, setFile] = useState<any[]>([])
  const [docx, setDocx] = useState<any[]>([])
  const [triggerUploadFile, {}] = useBoolean(false)

  const saveData = () => {
    saveQuotaLibraryCatalogDescription({ id, chapterDescription: html })
    setModalVisible(false)
    setHtml('')
    setTimeout(() => {
      update()
    }, 500)
  }

  const onChange = async (val: any) => {
    if (val.length !== 0) {
      setFile(val)
    } else {
      setFile([])
    }
  }

  const isTrans = localStorage.getItem('isTransfer')
  let handleUrl = `${baseUrl.upload}`

  let targetUrl = handleSM2Crypto(`http://172.2.48.22${handleUrl}`)

  let proxyUrl = `http://117.191.93.63:21525/commonGet?param=${targetUrl}`

  let finalUrl = Number(isTrans) === 1 ? proxyUrl : handleUrl

  const downFile = (id: string, down = false) => {
    // 下载文件
    var xhr = new XMLHttpRequest()
    xhr.open('GET', `${finalUrl}/Download/GetFileById?fileId=${id}`, true) // 也可以使用POST方式，根据接口
    xhr.responseType = 'blob' // 返回类型blob
    xhr.setRequestHeader('Authorization', localStorage.getItem('Authorization') as string)
    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    // @ts-ignore
    xhr.onload = function (e) {
      // 请求完成
      if (this.status === 200) {
        // 返回200
        if (!down) {
          // 只展示
          var res = e.target.response
          // @ts-ignore
          setDocx([res])
        } else {
          // 下载
          let blob = new Blob([e.target.response], { type: `application/msword;charset=utf-8` })
          // 获取heads中的filename文件名
          let downloadElement = document.createElement('a')
          // 创建下载的链接
          let href = window.URL.createObjectURL(blob)
          downloadElement.href = href
          // 下载后文件名
          downloadElement.download = `${title}.docx`
          document.body.appendChild(downloadElement)
          // 点击下载
          downloadElement.click()
          // 下载完成移除元素
          document.body.removeChild(downloadElement)
          // 释放掉blob对象
          window.URL.revokeObjectURL(href)
        }
        uploadAuditLog([
          {
            auditType: 1,
            eventType: 5,
            eventDetailType: '文件下载',
            executionResult: '成功',
            auditLevel: 2,
            serviceAdress: `${baseUrl.upload}/Download/GetFileById`,
          },
        ])
      } else {
        message.error('下载失败!')
        setDocx([])
      }
    }
    xhr.send()
  }
  const uploadFile = async () => {
    let type: string = file[0].name.split('.')[1]
    if (disabledDown) {
      message.warning('当前选中目录的不可导入章节说明')
      return
    }
    if (title !== file[0].name.split('.')[0] && type !== 'zip') {
      message.warning('文档名称和选择目录名称不相同')
      return
    }
    if (type === 'zip') {
      await UploadChapterDescriptionFiles({
        files: file,
        quotaLibraryCatalogId: fileId,
      })
      update()
    } else {
      if (title !== file[0].name.split('.')[0]) {
        message.warn('当前选中章节与上传文档的章节说明不匹配,请重新选择章节!')
        return
      }
      await UploadChapterDescriptionFile({
        file: file,
        quotaLibraryCatalogId: nodeId as string,
      })
      update()
    }

    setUploadModalVisible(false)
  }
  const showSuccess = (html: string) => {
    setHtml(html)
  }
  const downWordFile = () => {
    downFile(data, true)
    message.success('已开始下载')
  }
  useEffect(() => {
    setDocx([])
    if (data === '') return
    downFile(data, false)
  }, [data])
  return (
    <div className={styles.chapterInfoWrap}>
      <div className={styles.buttonArea}>
        <Button type="primary" className="mr7" onClick={() => setUploadModalVisible(true)}>
          <ExportOutlined />
          导入说明
        </Button>
        <Button
          type="primary"
          className="mr7"
          onClick={downWordFile}
          disabled={data === '' || disabledDown}
        >
          <DownloadOutlined />
          下载
        </Button>
      </div>
      {docx.length === 0 ? (
        <div />
      ) : (
        <ManualPreview file={docx} fileTitle={``} showDirectory={false} onSuccess={showSuccess} />
      )}
      <Modal
        visible={modalVisible}
        title="编辑-章节说明"
        width="80%"
        destroyOnClose={true}
        onCancel={() => setModalVisible(false)}
        onOk={saveData}
      >
        <WangEditor getHtml={setHtml} html={html} />
      </Modal>
      <Modal
        visible={uploadModalVisible}
        title="导入-章节说明"
        width="30%"
        destroyOnClose={true}
        onCancel={() => setUploadModalVisible(false)}
        onOk={uploadFile}
      >
        <FileUpload
          accept=".zip,.docx,.doc"
          uploadFileBtn={false}
          trigger={triggerUploadFile}
          onChange={onChange}
          maxCount={1}
        />
      </Modal>
    </div>
  )
}

export default ChapterInfo
