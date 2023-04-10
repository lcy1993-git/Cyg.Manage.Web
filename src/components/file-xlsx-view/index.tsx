/* eslint-disable no-plusplus */
import { useState, useRef } from 'react'
import { Button } from 'antd'
import XLSX from 'xlsx'
import { useMount } from 'ahooks'
import classnames from 'classnames'
import { csv2table, mergeTable } from './utils'
import { useEffect } from 'react'
import styles from './index.less'
import { domStringPurify } from '@/utils/dom-string-purify'

interface FileXlsxViewProps {
  data: ArrayBuffer
  // 是否需要外边框刻度栏
  coordinateaxis?: boolean
  classname?: StyleSheet
}

const FileXlsxView: React.FC<FileXlsxViewProps> = ({ coordinateaxis = false, data, classname }) => {
  const [workBook, setworkBook] = useState<any>()
  const ref = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(6)
  const [sheets, setSheets] = useState<any[]>([])
  useMount(() => {
    const arr = []
    const dataArr = new Uint8Array(data)
    const len = dataArr.length
    for (let i: number = 0; i < len; i++) {
      arr.push(String.fromCharCode(dataArr[i]))
    }
    setworkBook(XLSX.read(arr.join(''), { type: 'binary' }))
  })

  useEffect(() => {
    if (workBook) {
      const sheetNames = workBook.SheetNames // 工作表名称集合
      const currentWorksheet = workBook.Sheets[sheetNames[currentIndex]] // 这里我们只读取第一张sheet

      const keys = Object.keys(currentWorksheet)

      const endRef = keys[keys.length - 3]

      if (endRef.length === 2) {
        currentWorksheet['!ref'] = 'A1:' + endRef
      }

      const csv = XLSX.utils.sheet_to_csv(currentWorksheet)

      const html = csv2table(csv, coordinateaxis)
      ref.current!.innerHTML = domStringPurify(html)

      mergeTable(currentWorksheet['!merges'], coordinateaxis, ref.current!)
    }
  }, [JSON.stringify(workBook), currentIndex])

  useEffect(() => {
    setCurrentIndex(0)

    if (workBook) {
      setSheets(workBook.SheetNames)
    }
  }, [JSON.stringify(workBook)])

  const sheetTitles = () => {
    return sheets.map((item, index) => {
      // eslint-disable-next-line react/no-array-index-key
      return (
        <div className={styles.title}>
          <Button key={index + item} onClick={() => setCurrentIndex(index)}>
            {item}
          </Button>
        </div>
      )
    })
  }

  return (
    <div className={styles.xlsxWrap}>
      <div className={classnames(styles.titles, classname)}>
        {sheets.length > 1 && sheetTitles()}
      </div>
      <div ref={ref}></div>
    </div>
  )
}

export default FileXlsxView
