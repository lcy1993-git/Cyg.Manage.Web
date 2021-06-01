  
import { useMount, useUnmount } from 'ahooks';
import React, { useState, useRef } from 'react';
import TEditot from 'wangeditor/dist/editor/index';
import E from 'wangeditor';

interface Props {
  getHtml: React.Dispatch<React.SetStateAction<string>>
}

let editor: TEditot;
const WangEditor: React.FC<Props> = ({getHtml}) => {

  const [content, setContent] = useState<string>('')

  const ref = useRef<HTMLDivElement>(null);
  useMount(() => {
    editor= new E(ref.current) as TEditot;

    editor.config.onchange = (newHtml: string) => {
      setContent(newHtml)
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