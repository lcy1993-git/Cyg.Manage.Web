import { Space } from 'antd'

import React, { useEffect, useState } from 'react'
import styles from './index.less'
import TopographicIncreaseFactor from '../topographic-increase-factor'
import AttritionRate from '../atrition-rate'
import TableImportButton from '@/components/table-import-button'
import EarthworkParameters from '../earthwork-parameters'
import PageCommonWrap from '@/components/page-common-wrap'
import { useMount } from 'ahooks'

interface Props {}

const UsualQuotaTableDetail: React.FC<Props> = () => {
  const [active, setActive] = useState<number>(1)
  const [name, setName] = useState<string>('')
  const getTabList = async () => {
    setName('')
    const urlName = decodeURI(window.location.search.split('=')[1]).replace('&id', '')
    setName(urlName)
    if (urlName === '地形增加系数') {
      setActive(3)
    } else if (urlName === '未计价材料施工损耗率') {
      setActive(4)
    } else if (urlName === '土方参数') {
      setActive(5)
    }
  }
  useEffect(() => {
    getTabList()
  }, [])
  const setSuccessful = (e: boolean) => {
    e && getTabList()
  }
  useMount(() => {
    setName(decodeURI(window.location.search.split('=')[1]).replace('&id', '') ?? '')
  })
  const detailId = window.location.search.split('=')[2]
  return (
    <PageCommonWrap>
      <div className={styles.costTemplate}>
        <div className={styles.leftMenu}>
          {/*<h3 className={styles.content}>目录</h3>*/}
          <div className={styles.topButton}>
            <Space>
              <TableImportButton
                extraParams={{
                  commonlyTableType: active,
                  RateFileId: detailId,
                }}
                modalTitle={'导入费率'}
                buttonTitle={'导入费率'}
                style={{ zIndex: 99 }}
                template={true}
                downType={active}
                requestSource={'tecEco1'}
                importUrl={'/RateTable/ImportRateTable'}
                setSuccessful={setSuccessful}
              />
              {/*<TableImportButton*/}
              {/*  extraParams={{ commonlyTableType: active }}*/}
              {/*  modalTitle={'导入费率'}*/}
              {/*  buttonTitle={'导入费率'}*/}
              {/*  style={{ zIndex: 99, display: name == '土方参数' ? 'block' : 'none' }}*/}
              {/*  template={true}*/}
              {/*  downType={active}*/}
              {/*  requestSource={'tecEco1'}*/}
              {/*  importUrl={'/Earthwork/ImportEarthwork'}*/}
              {/*  setSuccessful={setSuccessful}*/}
              {/*/>*/}
              <TableImportButton
                modalTitle={'导入土方参数图形'}
                buttonTitle={'导入土方参数图形'}
                style={{ zIndex: 99, display: name === '土方参数' ? 'block' : 'none' }}
                downType={active}
                accept={'.zip'}
                requestSource={'tecEco1'}
                importUrl={`/Earthwork/UploadEarthworkPictures`}
                setSuccessful={setSuccessful}
              />
            </Space>
          </div>
          <div style={{ paddingTop: '15px' }}>
            {name === '地形增加系数' && <TopographicIncreaseFactor id={detailId} />}
            {name === '未计价材料施工损耗率' && <AttritionRate id={detailId} />}
            {name === '土方参数' && <EarthworkParameters id={detailId} />}
          </div>
        </div>
      </div>
    </PageCommonWrap>
  )
}

export default UsualQuotaTableDetail
