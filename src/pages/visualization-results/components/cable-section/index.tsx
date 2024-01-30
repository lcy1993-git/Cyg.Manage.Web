import {
  CableSectionProps,
  findHoleDetails,
} from '@/services/visualization-results/visualization-results'
import { handleDecrypto } from '@/utils/utils'
import { useMount } from 'ahooks'
import { message, Tooltip } from 'antd'
import classNames from 'classnames'
import { useRef } from 'react'
import styles from './index.less'
import { initCtx } from './utils'

const CableSection: React.FC<CableSectionProps> = (params) => {
  const { title, layMode, layerType, holeId, arrangement } = params
  const ref = useRef<HTMLCanvasElement>(null)

  useMount(async () => {
    const ctx = ref.current!.getContext('2d')!

    const data: any[] = await findHoleDetails({ layerType, holeId })
      .then((res) => {
        const decryRes = handleDecrypto(res)
        if (decryRes.isSuccess === true) {
          return (
            (layerType === 1
              ? Object(decryRes)?.content?.designCableChannelProfile
              : Object(decryRes)?.content?.dismantleCableChannelProfile) ?? []
          )
        } else {
          message.error(decryRes.message)
          return []
        }
      })
      .catch((err) => {
        message.error(err)
        return []
      })

    // console.log('canvas');

    // console.log(data.map(item => item.usageState + "col" + item.col + "row" +item.row));

    initCtx(ctx, data, layMode, arrangement, title)
  })

  return (
    <div className={styles.canvasWrap}>
      <div className={styles.canvasBox}>
        <canvas
          ref={ref}
          className={classNames(styles.canvas, layMode !== 3 && layMode !== 4 ? styles.border : '')}
          width={150}
          height={150}
        />
        <Tooltip className={styles.title} placement="top" title={title}>
          {title ?? ''}
        </Tooltip>
        {/* <div className={styles.title}>{title ?? ""}</div> */}
        <div className={styles.footer}>
          图例:
          <div className={classNames(styles.icon, styles.green)}></div>
          新建
          <div className={classNames(styles.icon, styles.gray)}></div>
          原有
          <div className={classNames(styles.icon, styles.white)}></div>空
        </div>
      </div>
    </div>
  )
}

export default CableSection
