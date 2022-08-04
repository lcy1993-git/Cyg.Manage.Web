import { Input } from 'antd'
import { baseUrl } from '@/services/common'
import styles from './index.less'
import { useRef } from 'react'
import classnames from 'classnames'
import { LoginType } from '../login-form'

interface VerifycodeImageProps {
  userKey: string | undefined
  needVerifycode: boolean
  onChange: (v: string) => void
  hasErr: boolean
  setHasErr: (b: boolean) => void
  reloadSign: string
  refreshCode: () => void
  activeKey?: LoginType
}

const VerifycodeImage: React.FC<VerifycodeImageProps> = ({
  userKey,
  needVerifycode,
  onChange,
  hasErr,
  setHasErr,
  reloadSign,
  refreshCode,
  activeKey,
}) => {
  const codeRef = useRef<Input>(null)

  return activeKey && needVerifycode ? (
    <div className={styles.verifycodeImageWrap}>
      {/* <div className={styles.reload} onClick={refreshCode}><ReloadOutlined title="看不清？换一张" className={styles.icon}/></div> */}
      <div className={styles.InputWrap}>
        <div>
          <Input
            ref={codeRef}
            onFocus={() => hasErr && setHasErr(false)}
            onChange={(e) => onChange(e.target.value)}
          ></Input>
        </div>
        <div className={styles.error}>{hasErr ? '验证码错误' : ''}</div>
      </div>
      <div className={styles.imgWrap} onClick={refreshCode}>
        <img
          title="看不清？换一张"
          className={styles.img}
          src={`${baseUrl.common}/VerifyCode/Get?key=${userKey}&codeLength=4&random=${reloadSign}`}
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
