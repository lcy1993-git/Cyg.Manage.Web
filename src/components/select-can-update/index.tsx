import { getDataByUrl } from '@/services/common'
import { useRequest } from 'ahooks'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'

interface SelectCanEditAndSearchProps {
  onChange?: (a: string, b: string) => void
  value?: string
  placeholder?: string
  url?: string
  extraParams?: object
  titlekey?: string
  valuekey?: string
  requestSource?: 'project' | 'common' | 'resource' | 'material' | 'component' | 'tecEco'
  requestType?: 'post' | 'get'
  postType?: 'query' | 'body'
  // 依赖的参数值
  update?: string
}
// 选择选项时的开关，以及失去焦点时暂存组件的value值
let isFocus = false
const SelectCanUpdate: React.FC<SelectCanEditAndSearchProps> = (props) => {
  const {
    onChange,
    value,
    placeholder,
    url = '',
    extraParams = {},
    titlekey = 'text',
    valuekey = 'values',
    requestSource = 'project',
    requestType = 'get',
    postType = 'body',
    update,
  } = props
  const [val, setVal] = useState<string>('')
  const inputRef = useRef<HTMLDivElement>(null)
  const listRef: any = useRef()

  const { run } = useRequest(
    () => getDataByUrl(url, { ...extraParams, name: update }, requestSource, requestType, postType),
    {
      ready: !!url,
      refreshDeps: [url, JSON.stringify(extraParams)],
      manual: true,
      onSuccess: (res) => {
        listRef.current = res.map((item) => {
          return {
            label: item[titlekey],
            value: item[valuekey],
          }
        })
      },
    }
  )

  const showDropMenu = (list: any = []) => {
    // 已展示菜单
    const el = document.getElementById('rxq-dropWrap')
    if (el) el.remove()
    const input = inputRef.current
    // fixme
    let left = input?.getBoundingClientRect().left
    let top = input?.getBoundingClientRect().top
    const width = input?.getBoundingClientRect().width
    const dropdown = document.createElement('div')
    const scrollTop =
      document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
    const scrollLeft =
      document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft
    // @ts-ignore
    top += scrollTop
    // @ts-ignore
    left += scrollLeft

    //
    dropdown.setAttribute('class', 'dropdown')
    dropdown.style.width = width + 'px'
    dropdown.style.height = list.length * 32 + 'px'
    dropdown.style.left = left + 'px'
    dropdown.style.top = Number(top) + 27 + 5 + 'px'
    dropdown.style.position = 'absolute'
    dropdown.style.zIndex = '1025'
    dropdown.setAttribute('class', 'rxq-dropdown')
    dropdown.style.backgroundColor = '#ffffff'
    dropdown.style.boxShadow =
      '0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)'
    // wrap
    const dropWrap = document.createElement('div')
    dropWrap.setAttribute('id', 'rxq-dropWrap')
    dropWrap.style.position = 'absolute'
    dropWrap.style.left = '0px'
    dropWrap.style.top = '0px'
    dropWrap.appendChild(dropdown)

    for (let i = 0; i < list.length; i++) {
      const item = document.createElement('div')
      item.setAttribute('class', 'rxq-item')
      item.style.width = width + 'px'
      item.style.height = 32 + 'px'
      item.innerHTML = list[i].label
      dropdown.appendChild(item)
      item.dataset.datasource = JSON.stringify(list[i])
    }
    document.body.appendChild(dropWrap)
  }
  const removeDropMenu = (e: any) => {
    // 不是鼠标左键
    if (e.which !== 1) return
    if (e.target === inputRef.current) {
      return
    }
    const classNameList = [...e.target.classList]
    if (classNameList.includes('rxq-item')) {
      selectHandle(e.target.dataset.datasource)
    }
    const el = document.getElementById('rxq-dropWrap')
    el && el.remove()
    document.removeEventListener('mousedown', removeDropMenu)
  }
  const focusHandle = () => {
    isFocus = true
    setTimeout(() => {
      isFocus = false
    }, 200)
    showDropMenu(listRef.current)
    document.addEventListener('mousedown', removeDropMenu)
  }

  const clickHandle = () => {
    if (isFocus) return
    const el = document.getElementById('rxq-dropWrap')
    el && el.remove()
    !el && showDropMenu(listRef.current)
  }
  const inputeHanle = (e: any) => {
    // @ts-ignore
    const value = inputRef.current?.value as string
    setVal(value)
    onChange?.(value, 'input')
  }
  const selectHandle = (data: any) => {
    const obj = JSON.parse(data)
    setVal(obj.value)
    onChange?.(obj.value, 'select')
  }
  useEffect(() => {
    run()
  }, [update, run])

  useEffect(() => {
    value && setVal(value)
  }, [value])

  return (
    <div className={styles.wrap}>
      <input
        // @ts-ignore
        ref={inputRef}
        className={styles.input}
        type="text"
        id="input"
        value={val}
        autoComplete="off"
        placeholder={placeholder}
        onChange={() => {}}
        onFocus={focusHandle}
        onClick={clickHandle}
        onInput={inputeHanle}
      />
    </div>
  )
}
export default SelectCanUpdate
