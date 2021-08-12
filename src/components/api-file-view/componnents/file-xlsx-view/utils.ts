
// csv 数据转换为 table
export const csv2table = (csv: string, showTab = false) => {
  let html = '<table>';
  const rows = csv.split('\n');
  rows.pop(); // 最后一行没用的
  rows.forEach(function (row, idx) {
    const columns = row.split(',');
    if (showTab) {
      columns.unshift(idx + 1); // 添加行索引
      if (idx == 0) {
        // 添加列索引
        html += '<tr>';
        for (let i = 0; i < columns.length; i++) {
          html += '<th>' + (i == 0 ? '' : String.fromCharCode(65 + i - 1)) + '</th>';
        }
        html += '</tr>';
      }
    }
    html += '<tr>';
    columns.forEach(function (column) {
      html += '<td>' + column + '</td>';
    });
    html += '</tr>';
  });
  html += '</table>';
  return html;
};

// 合并单元格
export const mergeTable =(mergeInfo, hasTab = false, document: HTMLDivElement) => {
  // let SheetNames = workbook.SheetNames[0];
  // let mergeInfo = workbook.Sheets[SheetNames]["!merges"];
  console.log(mergeInfo);

  let result = document;

  // 是否显示了tab
  const baiseAdd = hasTab ? 1 : 0;

  mergeInfo.forEach((item) => {
    
    let start_r = item.s.r + baiseAdd;
    let end_r = item.e.r + baiseAdd;

    let start_c = item.s.c + baiseAdd;
    let end_c = item.e.c + baiseAdd;

    // eslint-disable-next-line no-plusplus
    for (let i = start_r; i <= end_r; i++) {
      
      const row = result.getElementsByTagName("tr")[i];
      
      // eslint-disable-next-line no-plusplus
      for (let child = start_c; child <= end_c; child++) {
        if (child === start_c && i === start_r) {
          // 循环到就是第一个单元格，以这个单元格为开始进行合并
          row?.children[child].classList.add("will_span");
          row?.children[child].setAttribute("row", end_r - start_r + 1);
          row?.children[child].setAttribute("col", end_c - start_c + 1);
        } else {
          // 只做标记，不在这里删除
          row?.children[child]?.classList.add("remove");
        }
      }
    }
  });
  
  // 移除对应的td
  Array.from(result.getElementsByClassName("remove")).forEach((item) => {
    item.parentNode!.removeChild(item);
  });

  // 为大的td设置跨单元格合并
  Array.from(result.getElementsByClassName("will_span")).forEach((item) => {
    
    item.classList.remove("will_span");
    item.classList.add("spanElement")
    item.rowSpan = item.getAttribute("row");
    item.colSpan = item.getAttribute("col");
  });
}

