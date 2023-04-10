import { useMount } from 'ahooks'
import pdfjs from 'pdfjs-dist'

interface FilePdfViewProps {
  data: ArrayBuffer
}

const FilePdfView: React.FC<FilePdfViewProps> = () => {
  useMount(() => {
    return pdfjs
  })
  return <span>pdf</span>
}

export default FilePdfView
