import React, { useEffect } from 'react'

// @ts-ignore
import mammoth from 'mammoth'
import { useMount } from 'ahooks'
import { message } from 'antd'

interface DocxFileViewerProps {
  filePath: ArrayBuffer | null
  onSuccess?: (val: string) => void
}

const DocxFileViewer: React.FC<DocxFileViewerProps> = (props) => {
  const { filePath, onSuccess } = props
  const loadFile = () => {
    try {
      mammoth
        .convertToHtml({ arrayBuffer: filePath }, { includeDefaultStyleMap: true })
        .then((result: any) => {
          const docEl = document.createElement('div')
          docEl.id = 'docxContainer'
          docEl.innerHTML = result.value
          if (document.getElementById('docx') !== null) {
            document.getElementById('docx')!.innerHTML = docEl.outerHTML
          }
          onSuccess?.(result.value)
        })
        .catch(() => {})
        .done()
    } catch {
      message.warn('文件解析失败')
    }
  }

  useMount(() => {
    loadFile()
  })
  useEffect(() => {
    loadFile()
  }, [filePath])
  return <div id="docx"></div>
}

export default DocxFileViewer
