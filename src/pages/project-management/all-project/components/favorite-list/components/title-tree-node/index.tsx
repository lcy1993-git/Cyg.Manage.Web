import React, { useRef, useState } from 'react'
import { Button, Input, message, Popconfirm, Tooltip } from 'antd'
import createSrc from '@/assets/icon-image/create-tree.png'
import deleteSrc from '@/assets/icon-image/delete-tree.png'
import editSrc from '@/assets/icon-image/edit-tree.png'
import {
  creatFavorite,
  deleteFavorite,
  modifyFavoriteName,
} from '@/services/project-management/favorite-list'
import styles from './index.less'
import { useUpdateEffect } from 'ahooks'

interface TitleTreeNodeProps {
  id: string
  text: string
  deep: number
  isEdit: boolean
  favName: string | undefined
  parentId?: string
  refresh?: () => void
  onSelect?: boolean
  setIsEdit?: (id: string) => void
  setParentId?: (parentId: string) => void
  createChildNode?: (id: string) => void
  category?: number
}

const TitleTreeNode: React.FC<TitleTreeNodeProps> = ({
  id,
  deep,
  text,
  isEdit,
  category,
  favName,
  parentId,
  refresh,
  onSelect,
  setIsEdit,
  setParentId,
  createChildNode,
}) => {
  const editRef = useRef<HTMLInputElement>(null)
  const [editName, setEditName] = useState<string | undefined>(text)
  const [editFlag, setEditFlag] = useState<boolean>(false)

  const addOrModifyEvent = async () => {
    if (editFlag) {
      if (!editName) {
        message.error('名称不能为空')
        return
      }
      await modifyFavoriteName({ id: id, name: editName })
        .then((res) => {
          setIsEdit?.('')
          setEditFlag(false)
          message.success('修改成功')
          return
        })
        .catch((err) => {})
      return
    }
    creatFavorite({ name: editName, parentId: parentId })
      .then((res) => {
        setIsEdit?.('')
        setParentId?.('')
        message.success('创建成功')
      })
      .catch((err) => {
        return
      })
  }

  useUpdateEffect(() => {
    refresh?.()
  }, [isEdit])

  const deleteEvent = async () => {
    await deleteFavorite(id)
    message.success('已删除')
    refresh?.()
  }

  if (isEdit) {
    return (
      <div className={styles.inputItem}>
        <div style={{ display: 'inline-block' }}>
          <Input
            id="editInput"
            onFocus={() => {
              //@ts-ignore
              document.getElementById('editInput')?.select()
            }}
            value={editName}
            ref={(input) => {
              //@ts-ignore
              editRef.current = input?.focus()
            }}
            style={{ height: '25px', width: '10vw' }}
            onChange={(e: any) => setEditName(e.target.value)}
            maxLength=""
          />
        </div>
        <Button onClick={() => addOrModifyEvent()} style={{ height: '30px', marginTop: '9px' }}>
          确定
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.treeItem}>
      <div>{text}</div>
      {onSelect ? (
        <div>
          {deep !== 3 && category === 4 && (
            <Tooltip title="添加子级">
              <img
                alt=""
                src={createSrc}
                className={styles.iconItem}
                onClick={() => createChildNode?.(id)}
              />
            </Tooltip>
          )}

          {category === 4 && (
            <>
              <Tooltip title="删除">
                <Popconfirm
                  title="您确定要删除当前项目目录?"
                  onConfirm={deleteEvent}
                  okText="确认"
                  cancelText="取消"
                >
                  <img src={deleteSrc} className={styles.iconItem} alt="" />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="重命名">
                <img
                  alt=""
                  src={editSrc}
                  className={styles.iconItem}
                  onClick={() => {
                    setIsEdit?.(id)
                    setEditFlag(true)
                    setEditName(favName)
                    editRef.current?.focus()
                  }}
                />
              </Tooltip>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}

export { TitleTreeNode as default }
