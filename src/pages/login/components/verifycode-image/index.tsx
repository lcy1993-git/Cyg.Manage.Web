import { baseUrl } from '@/services/common'
import { Input } from 'antd'
import classnames from 'classnames'
import { useRef } from 'react'
import { LoginType } from '../login-form'
import styles from './index.less'

interface VerifycodeImageProps {
  userKey?: string | undefined
  needVerifycode: boolean
  onChange: (v: string) => void
  hasErr: boolean
  setHasErr: (b: boolean) => void
  reloadSign: string
  refreshCode: () => void
  activeKey?: LoginType
  loginKey?: string
}

const VerifycodeImage: React.FC<VerifycodeImageProps> = ({
  needVerifycode,
  onChange,
  hasErr,
  setHasErr,
  reloadSign,
  refreshCode,
  activeKey,
  loginKey,
}) => {
  const codeRef = useRef<Input>(null)

  const isTrans = localStorage.getItem('isTransfer')
  //场内测试
  // let handleUrl = `${baseUrl.upload}`.slice(4)
  // let targetUrl = encodeURIComponent(`https://srthkf2.gczhyun.com:21530${handleUrl}`)'
  // let proxyUrl = `http://10.6.1.111:8082/commonGet?target_url=${targetUrl}`
  let handleUrl = `${baseUrl.common}`

  let targetUrl = encodeURIComponent(`http://172.2.48.22${handleUrl}`)

  let proxyUrl = `http://117.191.93.63:21525/commonGet?target_url=${targetUrl}`

  let finalUrl = Number(isTrans) === 1 ? proxyUrl : handleUrl

  return activeKey && needVerifycode ? (
    <div className={styles.verifycodeImageWrap}>
      <div className={styles.InputWrap}>
        <div>
          <Input
            ref={codeRef}
            onFocus={() => hasErr && setHasErr(false)}
            maxLength={4}
            placeholder={'请输入右边的验证码'}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <div className={styles.error}>{hasErr ? '验证码错误' : ''}</div>
      </div>
      <div className={styles.imgWrap} onClick={refreshCode}>
        <img
          title="看不清？换一张"
          className={styles.img}
          src={`${finalUrl}/VerifyCode/Get?category=1&codeType=1&codeLength=4&reloadSign=${reloadSign}&sessionKey=${loginKey}`}
          alt="刷新"
        />
        <span className={classnames(styles.changeText, 'link')}>看不清？换一张</span>
      </div>
    </div>
  ) : (
    <div className={styles.empty} />
  )
}

export default VerifycodeImage
