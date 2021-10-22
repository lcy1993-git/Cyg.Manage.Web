import { useEffect, useRef } from 'react';
import { message } from 'antd';
import classNames from 'classnames';
import mammoth from 'mammoth';
import docStyle from './index.less'
export interface FileDocxViewProps {
  data: ArrayBuffer;
  className?: StyleSheet;
}

const FileDocxView: React.FC<FileDocxViewProps> = ({
  data,
  className
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      mammoth.convertToHtml(
        { arrayBuffer: data },
        { includeDefaultStyleMap: true }
      ).then((res: { value: any; }) => {
        const html = res.value;
        const newHTML = html.replace(//g, '')
        .replace('<h1>', '<h1 style="text-align: center;">')
        .replace('<ul>', '<ol>')
        .replace('<ol/>', '<ol/>')
        // .replace(/<table>/g, '<table style="border-collapse: collapse;">')
        // .replace(/<tr>/g, '<tr style="height: 30px;">')
        // .replace(/<td>/g, '<td style="border: 1px solid pink;">')
        // .replace(/<p>/g, '<p style="text-indent: 2em;">');
        console.log(newHTML);
        
        ref.current!.innerHTML = newHTML;
      })
    } catch (error) {
      message.error("文件解析失败")
    }
  }, [data])
  
  return (
    <div ref={ref} style={{minHeight: window.innerHeight - 100}} className={classNames(className, docStyle.table)} />
  )
}

export default FileDocxView;
