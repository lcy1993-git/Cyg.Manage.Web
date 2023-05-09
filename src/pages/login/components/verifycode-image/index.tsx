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
}

const VerifycodeImage: React.FC<VerifycodeImageProps> = ({
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
          src={`${baseUrl.common}/VerifyCode/Get?category=1&codeType=1&codeLength=4&reloadSign=${reloadSign}`}
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
