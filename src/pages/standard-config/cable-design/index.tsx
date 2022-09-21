// import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import CommonTitle from '@/components/common-title'
import React, { useRef, useState } from 'react'
import CableDesignTab from './components/cableDesign-tab'
import ImportCableModal from './components/import-form'
import styles from './index.less'

import { useGetButtonJurisdictionArray } from '@/utils/hooks'

interface libParams {
  libId: string
}

const CableDesign: React.FC<libParams> = (props) => {
  const { libId } = props
  const [importCableVisible, setImportCableVisible] = useState<boolean>(false)
  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()
  const uploadRefresh = useRef()

  // 列表刷新
  const refresh = () => {
    if (uploadRefresh && uploadRefresh.current) {
      // @ts-ignore
      uploadRefresh.current.refresh()
    }
  }

  const importCableDesignEvent = () => {
    setImportCableVisible(true)
  }

  return (
    // <PageCommonWrap noPadding={true}>
    <>
      <div className={styles.cableDesign}>
        <div className={styles.cableTable}>
          <div className="flex">
            <div className="flex1 flex">
              <CommonTitle>电缆设计</CommonTitle>
            </div>
            <div>
              {/* {buttonJurisdictionArray?.includes('cable-design-import') && (
                <Button className="mr7" onClick={() => importCableDesignEvent()}>
                  <ImportOutlined />
                  导入(电缆井+电缆通道)
                </Button>
              )} */}
            </div>
          </div>
          <CableDesignTab ref={uploadRefresh} libId={libId} />
        </div>
      </div>
      <ImportCableModal
        libId={libId}
        requestSource="resource"
        visible={importCableVisible}
        changeFinishEvent={refresh}
        onChange={setImportCableVisible}
      />
      {/* </PageCommonWrap> */}
    </>
  )
}

export default CableDesign
