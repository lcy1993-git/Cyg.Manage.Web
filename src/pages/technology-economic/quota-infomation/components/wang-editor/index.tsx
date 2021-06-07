  
import { useMount, useUnmount } from 'ahooks';
import React, { useRef } from 'react';
import TEditot from 'wangeditor/dist/editor/index';
import E from 'wangeditor';

interface Props {
  getHtml: React.Dispatch<React.SetStateAction<string>>
}

let editor: TEditot;
const WangEditor: React.FC<Props> = ({getHtml}) => {

  const ref = useRef<HTMLDivElement>(null);
  useMount(() => {
    editor= new E(ref.current) as TEditot;

    /**
     * 剔除不需要的表情视频按钮,表情按钮目前上传时候后台会提示报错
     */
    editor.config.excludeMenus = [
      'emoticon',
      'video'
    ]

    editor.config.onchange = (newHtml: string) => {

      getHtml(newHtml)
    }
    editor.create()
  })
 
  useUnmount(() => {
    editor.destroy()
  })

  return (
    <div>
      <div ref={ref}></div>
    </div>
  );
}

export default WangEditor;