
import React, { useRef } from 'react';

import ChooseDesignAndSurvey, { ChooseDesignAndSurveyValue } from '@/pages/project-management/all-project/components/choose-design-and-survey';
import XLSX from 'xlsx'

import styles from './index.less';
import FileXlsxView from '@/components/file-xlsx-view';

const TestPage = (data) => {
  // const xhr = new XMLHttpRequest();
  // xhr.open('GET', 'http://10.6.4.87:8000/123.xlsx', true)
  // xhr.responseType = "blob";
  // xhr.onreadystatechange = (e) => {
  //   console.log(e.target.response);
    
  //   const fileReader = new FileReader()
    
  //   fileReader.onload = (e) => {
      
  //     console.log(e.target.result);
  //     const dataArr = new Uint8Array(e.target.result);
  //     const arr = []
  //     for (let i = 0; i !== dataArr.length; i += 1) {
  //       arr.push(String.fromCharCode(dataArr[i]));
  //     }
  //     const workbook = XLSX.read(arr.join(''), { type: 'binary' });
  //     console.log(workbook);
  //   }
  //   setTimeout(() => {
  //     fileReader.readAsArrayBuffer(e.target.response)
  //   },1000)






    
  // }
  // xhr.send();
  return <FileXlsxView />
};

export default TestPage;
