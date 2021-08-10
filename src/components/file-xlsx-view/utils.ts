
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
