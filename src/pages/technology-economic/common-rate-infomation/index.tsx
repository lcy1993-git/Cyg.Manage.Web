import { useState } from 'react'
import { useMount, useRequest } from 'ahooks'
import { Button, Modal, message, Spin, Space } from 'antd'
import WrapperComponent from '@/components/page-common-wrap'
import CommonTitle from '@/components/common-title'
import { getRateTypeList } from '@/services/technology-economic/common-rate'
import CommonRateTable from './components/common-rate-table'
import { downloadTemplate, importRateTable } from '@/services/technology-economic/common-rate'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import styles from './index.less'
import FileUpload from '@/components/file-upload'
import { history } from '@@/core/history'

interface ListData {
  value: string | number
  text: string
}

interface Params {
  id: string
  isDemolition: boolean
}
const urlToJson = (url = window.location.href) => {
  // 箭头函数默认传值为当前页面url

  let obj = {},
    index = url.indexOf('?'), // 看url有没有参数
    params = url.substr(index + 1) // 截取url参数部分 id = 1 & type = 2

  if (index != -1) {
    // 有参数时
    let parr = params.split('&') // 将参数分割成数组 ["id = 1 ", " type = 2"]
    for (let i of parr) {
      // 遍历数组
      let arr = i.split('=') // 1） i id = 1   arr = [id, 1]  2）i type = 2  arr = [type, 2]
      obj[arr[0]] = arr[1] // obj[arr[0]] = id, obj.id = 1   obj[arr[0]] = type, obj.type = 2
    }
  }

  return obj
}
const CommonRateInfomation: React.FC = () => {
  const [activeValue, setActiveValue] = useState<ListData>({ value: '', text: '' })

  const [importVisibel, setImportVisibel] = useState<boolean>(false)
  const [update, setUpdate] = useState<boolean>(true)

  const [fileList, setFileList] = useState<File[]>([])

  let res = urlToJson()
  let params = { ...res, name: decodeURI(res.name), isDemolition: res?.isDemolition === 'true' }
  const {
    data: listData = [],
    run: listDataRun,
    loading: preLoading,
  } = useRequest<ListData[]>(getRateTypeList, {
    manual: true,
    onSuccess: (res) => {
      setActiveValue(res[0])
    },
  })

  useMount(() => {
    if ((params as Params).id) {
      listDataRun((params as Params).id)
    } else {
      message.error('当前费率详情的rateFileId的值为空')
    }
  })

  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  const listDataElement = listData.map((item) => {
    return (
      <div
        className={`${styles.listElementItem} ${
          item.value === activeValue.value ? styles.listActive : ''
        }`}
        key={item.value + String((params as Params).isDemolition)}
        onClick={() => setActiveValue(item)}
      >
        {item.text}
      </div>
    )
  })

  const onOK = () => {
    if (fileList.length === 0) {
      message.error('当前未上传文件')
    } else {
      setUpdate(false)
      importRateTable((params as Params).id, fileList[0])
        .then(() => {
          message.success('上传成功')
          setImportVisibel(false)
          listDataRun((params as Params).id)
          setUpdate(true)
        })
        .finally(() => {
          setUpdate(true)
        })
    }
  }

  const downLoad = async () => {
    let res
    let name = decodeURI(window.location.search.split('=')[2])
    if (name === '拆除取费表费率') {
      res = await downloadTemplate(2)
    } else if (name === '建筑安装取费表费率') {
      res = await downloadTemplate(1)
    }
    const blob = new Blob([res], {
      type: 'application/xlsx',
    })
    const finalyFileName = '费率表导入模版.xlsx'
    // for IE
    // @ts-ignore
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // @ts-ignore
      window.navigator.msSaveOrOpenBlob(blob, finalyFileName)
    } else {
      // for Non-IE
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.setAttribute('download', finalyFileName)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
    }
    message.success('导出成功')
  }
  const linkToArea = () => {
    history.push(`/technology-economic/area-type-manage`)
  }
  return (
    <WrapperComponent>
      <div className={styles.imfomationModalWrap}>
        <div className={styles.topContainer}>
          <div className={styles.topContainerTitle}>
            <CommonTitle>费率详情</CommonTitle>
          </div>
          <div className={styles.importButton}>
            <Space>
              {!buttonJurisdictionArray?.includes('quotainfo-import') && (
                <Button type="primary" onClick={() => setImportVisibel(true)}>
                  导入费率
                </Button>
              )}
              {activeValue.value === 51 && (
                <Button type={'primary'} onClick={linkToArea}>
                  地区分类
                </Button>
              )}
            </Space>
          </div>
        </div>
        <Spin spinning={preLoading}>
          <div className={styles.bottomContainer}>
            <div className={styles.containerLeft}>
              <div className={styles.containerLeftTitle}>目录</div>
              <div className={styles.listElement}>{listDataElement}</div>
            </div>
            <div className={styles.containerRight}>
              <div className={styles.body}>
                {update && (
                  <CommonRateTable
                    rateFileId={(params as Params).id}
                    id={activeValue.value}
                    type={activeValue.value}
                    demolition={(params as Params).isDemolition}
                  />
                )}
              </div>
            </div>
          </div>
        </Spin>
      </div>
      <Modal
        title="导入费率"
        onOk={onOK}
        onCancel={() => setImportVisibel(false)}
        visible={importVisibel}
      >
        <div className={styles.modalWrap}>
          <div className={styles.row}>
            <span className={styles.label}>文件模板</span>
            <Button type="primary" onClick={downLoad}>
              下载模板
            </Button>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>上传文件</span>
            <FileUpload
              uploadFileBtn={false}
              maxCount={1}
              accept=".xlsx"
              trigger={false}
              process={true}
              onChange={(e) => setFileList(e)}
              className={styles.file}
              uploadFileFn={async () => {}}
            />
          </div>
        </div>
      </Modal>
    </WrapperComponent>
  )
}

export default CommonRateInfomation
