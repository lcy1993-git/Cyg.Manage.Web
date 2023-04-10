import { useRef } from 'react'

import styles from './index.less'

const FilePDFReact = () => {
  const div1 = useRef<HTMLDivElement>(null)
  const div2 = useRef<HTMLDivElement>(null)

  const click = () => {
    window.a = div2.current
  }

  return (
    <div className={styles.filePDFReactWrapper}>
      <div className={styles.viewWrap}>
        <div ref={div1} className={styles.div1}></div>
        <div ref={div2} className={styles.div2} onClick={click}></div>
      </div>
    </div>
  )
}

export default FilePDFReact
