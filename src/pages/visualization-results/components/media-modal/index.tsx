import React, { useMemo } from 'react'
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons'
import getComponentsByData from './getComponentsByData'
import type { MediaData } from './getComponentsByData'
import styles from './index.less'

interface MediaModalProps {
  content: MediaData[]
  currentIndex: number
  setCurrentIndex: (i: number) => void
}

// 节流
let flag = true

const MediaModal: React.FC<MediaModalProps> = ({ content, currentIndex, setCurrentIndex }) => {
  const authorization = window.localStorage.getItem('Authorization')

  const currentData = useMemo(() => {
    return content[currentIndex] ? Object.assign(content[currentIndex], { authorization }) : null
  }, [currentIndex])

  // 下一页
  const nextPage = () => {
    let realIndex = currentIndex + 1
    if (realIndex >= content.length) {
      realIndex = 0
    }
    setCurrentIndex(realIndex)
  }

  // 上一页
  const prePage = () => {
    let realIndex = currentIndex - 1
    if (realIndex < 0) {
      realIndex = content.length - 1
    }
    setCurrentIndex(realIndex)
  }

  const preFullClick = () => {
    let realIndex = currentIndex
    do {
      realIndex = currentIndex - 1
      if (realIndex < 0) {
        realIndex = content.length - 1
      }
    } while (content[realIndex].type === 1)
    setCurrentIndex(realIndex)
  }

  const nextFullClick = () => {
    let realIndex = currentIndex
    do {
      realIndex = currentIndex + 1
      if (realIndex > content.length) {
        realIndex = 0
      }
    } while (content[realIndex].type === 1)
    setCurrentIndex(realIndex)
  }

  const onWheel = (e) => {
    if (flag) {
      flag = false
      setTimeout(() => {
        flag = true
      }, 300)
      if (e.deltaY > 0) {
        nextPage()
      } else if (e.deltaY < 0) {
        prePage()
      }
    }
  }

  return (
    <div className={styles.mediaWrap} onWheel={onWheel}>
      <div className={styles.mediaIconWrapLeft}>
        <DoubleLeftOutlined
          style={{ fontSize: 50 }}
          className={styles.mediaIcon}
          onClick={prePage}
        />
      </div>
      <div className={styles.mediaIconWrapRight}>
        <DoubleRightOutlined
          style={{ fontSize: 50 }}
          className={styles.mediaIcon}
          onClick={nextPage}
        />
      </div>
      <div className={styles.meadiaView}>
        {currentData &&
          getComponentsByData(currentData, currentIndex, preFullClick, nextFullClick, content)}
      </div>
    </div>
  )
}

export default MediaModal
