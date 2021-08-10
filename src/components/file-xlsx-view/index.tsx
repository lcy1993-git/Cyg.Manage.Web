/* eslint-disable no-plusplus */
import { useState, useRef } from 'react';
import XLSX from 'xlsx';
import { downloadDemolitionTemplate } from '@/services/technology-economic/common-rate';
import { useMount, useRequest } from 'ahooks';
import { useMemo } from 'react';
import CsvViewer from './components/csv-viewer';

const FileXlsxView = (props ={}) => {
  const [data, setData] = useState<any>();
  const ref= useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  useMount(() => {
    downloadDemolitionTemplate('arrayBuffer').then((res) => {
      const arr = [];
      const dataArr = new Uint8Array(res);
      const len = dataArr.length;
      for(let i: number = 0; i < len; i ++) {
        arr.push(String.fromCharCode(dataArr[i]))
      }
      const workBook = XLSX.read(arr.join(""), {type: 'binary'})
      setData(workBook)
    })
  })

  const propsData =  useMemo(() => {
    if(data) {
      const names = Object.keys(data.Sheets);
      const sheets = names.map(name => (
        XLSX.utils.sheet_to_csv(data.Sheets[name])
      ));
  
      return { sheets, names };
    }
    return null;
  }, [data])

  const renderSheetNames = (names: any) => {
    const sheets = names.map((name: string, index: number) => (
      <input
        key={name}
        type="button"
        value={name}
        onClick={() => {
          setCurrentIndex(index);
        }}
      />
    ));

    return (
      <div className="sheet-names">
        {sheets}
      </div>
    );
  }

  const renderSheetData = (sheet: any) => {
    const csvProps = { ...props, data: sheet};
    return (
      <CsvViewer {...csvProps} />
    );
  }

  console.log(propsData);
  

  return (
    <div ref={ref} >

    </div>
  )
};

export default FileXlsxView;