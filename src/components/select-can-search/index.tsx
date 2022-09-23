import { getDataByUrl } from '@/services/common'
import { useMount, useRequest } from 'ahooks'
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
  searchKey?: string
  dataStructure?: string
}
// 选择选项时的开关，以及失去焦点时暂存组件的value值
let isFocus = false
const SelectCanSearch: React.FC<SelectCanEditAndSearchProps> = (props) => {
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
    searchKey = 'name',
    dataStructure,
  } = props
  const [val, setVal] = useState<string>('')
  const inputRef = useRef<HTMLDivElement>(null)
  const listRef: any = useRef()

  // throttleSearch
  const { run: throttleSearch } = useRequest(
    (value) => {
      let params = { ...extraParams }
      params[searchKey] = value
      return getDataByUrl(url, params, requestSource, requestType, postType)
    },
    {
      ready: !!url,
      debounceInterval: 600,
      manual: true,
      onSuccess: (res) => {
        if (dataStructure) {
          const list = res[dataStructure].map((item: any) => {
            return {
              label: item[titlekey],
              value: item[valuekey],
            }
          })
          listRef.current = list
          showDropMenu(list)
        } else {
          const list = res.map((item) => {
            return {
              label: item[titlekey],
              value: item[valuekey],
            }
          })
          listRef.current = list
          showDropMenu(list)
        }
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
    dropdown.style.width = width + 'px'
    dropdown.style.height = 8 * 32 + 'px'
    dropdown.style.left = left + 'px'
    dropdown.style.top = Number(top) + 27 + 5 + 'px'
    dropdown.style.position = 'absolute'
    dropdown.style.zIndex = '1025'
    dropdown.setAttribute('class', 'rxq-dropdown')
    dropdown.style.backgroundColor = '#ffffff'
    dropdown.style.boxShadow =
      '0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)'
    dropdown.style.overflowY = 'scroll'
    dropdown.style.overflowX = 'hidden'
    dropdown.style.maxHeight = 8 * 32 + 'px'
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
    // 允许滚轮
    if (classNameList.includes('rxq-dropdown')) {
      return
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
    throttleSearch(value)
    onChange?.(value, 'input')
  }
  const selectHandle = (data: any) => {
    const obj = JSON.parse(data)
    setVal(obj.value)
    onChange?.(obj.value, 'select')
  }
  useMount(() => {
    let params = { ...extraParams }
    params[searchKey] = value
    getDataByUrl(url, params, requestSource, requestType, postType).then((res) => {
      if (dataStructure) {
        const list = res[dataStructure].map((item: any) => {
          return {
            label: item[titlekey],
            value: item[valuekey],
          }
        })
        listRef.current = list
        const el = document.getElementById('rxq-dropWrap')
        if (el) showDropMenu(list)
      } else {
        const list = res.map((item) => {
          return {
            label: item[titlekey],
            value: item[valuekey],
          }
        })
        listRef.current = list
        const el = document.getElementById('rxq-dropWrap')
        if (el) showDropMenu(list)
      }
    })
  })

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
export default SelectCanSearch
