import CommonTitle from '@/components/common-title'
import WrapperComponent from '@/components/page-common-wrap'
import { baseUrl } from '@/services/common'
import { getEnabledAdjustmentFiles } from '@/services/technology-economic/spread-coefficient'
import { handleGetUrl } from '@/utils/utils'
import { useEffect, useState } from 'react'
import PdfFileView from './components/pdf-file-view'
import styles from './index.less'
interface ListData {
  id: string
  name: string
  [key: string]: string
}
const AdjustmentFileDetails: React.FC = () => {
  const [listData, setListData] = useState<ListData[]>([])
  const [activeValue, setActiveValue] = useState<ListData>({ id: '', name: '', path: '' })
  const [path, setPath] = useState('')
  const [api, setApi] = useState({})
  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    const result: any = await getEnabledAdjustmentFiles()

    setListData(result)
    if (result && result[0]) {
      result[0].path && getApi(result[0].path)
      setActiveValue(result[0])
      setPath(result[0].path)
    }
  }
  const listDataElement = listData.map((item: any) => {
    return (
      <div
        className={`${styles.listElementItem} ${
          item.id === activeValue.id ? styles.listActive : ''
        }`}
        key={item.id}
        onClick={() => {
          item.path && getApi(item.path)
          setActiveValue(item)
          setPath(item.path)
        }}
      >
        {item.name}
      </div>
    )
  })

  const requestHost = localStorage.getItem('requestHost')
  const currentHost =
    requestHost && requestHost !== 'undefined' ? requestHost : `http://${window.location.host}/api`

  const handleUrl = `${baseUrl.upload}/Download/GetFileById`

  const finalUrl = `${currentHost}/commonGet`

  const getApi = (id: string) => {
    const api = {
      url: `${finalUrl}${handleGetUrl(
        {
          fileId: id,
          securityKey: '1202531026526199123',
        },
        handleUrl
      )}`,
      httpHeaders: {
        Authorization: window.localStorage.getItem('Authorization'),
      },
    }
    setApi(api)
  }
  return (
    <WrapperComponent>
      <div className={styles.allDiv}>
        <div className={styles.topDiv}>
          <div className={styles.topDivTitle}>
            <CommonTitle>调整文件详情</CommonTitle>
          </div>
        </div>
        {/* <Spin spinning={preLoading}> */}
        <div className={styles.bottomContainer}>
          <div className={styles.containerLeft}>
            <div className={styles.containerLeftTitle}>目录</div>
            <div className={styles.listElement}>{listDataElement}</div>
          </div>
          <div className={styles.containerRight}>
            <div className={styles.body}>
              {/* {path && <FilePdfView params={api} hasAuthorization={true} />} */}
              {path && <PdfFileView params={api} hasAuthorization={true} />}
            </div>
          </div>
        </div>
        {/* </Spin> */}
      </div>
    </WrapperComponent>
  )
}

export default AdjustmentFileDetails
