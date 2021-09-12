import { useEffect } from '@umijs/renderer-react/node_modules/@types/react';
import { useMount, useUpdateEffect } from 'ahooks';
import React, { forwardRef, Ref, useImperativeHandle } from 'react';

const jquery = require('jquery');
// @ts-ignore
window.jQuery = jquery;
// @ts-ignore
window.$ = jquery;
const uuid = require('node-uuid');
// @ts-ignore
window.uuid = uuid;
require('jquery-mousewheel');
require('spectrum-colorpicker');
require('@/utils/lucky-sheet/plugins/css/pluginsCss.css');
require('@/utils/lucky-sheet/plugins/plugins.css');
require('@/utils/lucky-sheet/css/luckysheet.css');
require('@/utils/lucky-sheet/assets/iconfont/iconfont.css');
require('@/utils/lucky-sheet/plugins/js/plugin.js');
const luckysheet = require('@/utils/lucky-sheet/luckysheet.umd.js');
const luckyExcel = require('@/utils/lucky-sheet/luckyexcel.umd');

const onlyViewTableConfig = {
  container: 'onlyViewComponent',
  column: 18,
  row: 18,
  showtoolbar: false,
  showsheetbarConfig: {
    add: false, // 新增sheet
  },
  cellRightClickConfig: {
    copy: false, // 复制
    copyAs: false, // 复制为
    paste: false, // 粘贴
    insertRow: false, // 插入行
    insertColumn: false, // 插入列
    deleteRow: false, // 删除选中行
    deleteColumn: false, // 删除选中列
    deleteCell: false, // 删除单元格
    hideRow: false, // 隐藏选中行和显示选中行
    hideColumn: false, // 隐藏选中列和显示选中列
    rowHeight: false, // 行高
    columnWidth: false, // 列宽
    clear: false, // 清除内容
    matrix: false, // 矩阵操作选区
    sort: false, // 排序选区
    filter: false, // 筛选选区
    chart: false, // 图表生成
    image: false, // 插入图片
    link: false, // 插入链接
    data: false, // 数据验证
    cellFormat: false, // 设置单元格格式
  },
  sheetRightClickConfig: {
    delete: false, // 删除
    copy: false, // 复制
    rename: false, // 重命名
    color: false, // 更改颜色
    hide: false, // 隐藏，取消隐藏
    move: false, // 向左移，向右移
  },
};

interface XlsxViewerProps {
  url: string;
  name: string;
}

const XlsxViewer: React.FC<XlsxViewerProps> = (props) => {
  const { url, name = '' } = props;
  const initTableData = () => {
    luckyExcel.transformExcelToLuckyByUrl(
      'http://localhost:8000/api/storage/api/Download/GetProjectOutcomeFile?path=%252fapp%252fFiles%252fProject%252fOutcomeDocument%252f1403621276340887553%255cUnZip%252f%25e6%25b5%258b%25e8%25af%2595%25e9%25a1%25b9%25e7%259b%25ae%25e6%2588%2590%25e6%259e%259c%25e9%25a1%25b9%25e7%259b%25ae%252f%25e8%25ae%25be%25e8%25ae%25a1%25e5%259b%25be%25e5%25b1%2582%25e6%2588%2590%25e6%259e%259c%252f%25e7%25bb%25bc%25e5%2590%2588%25e9%2583%25a8%25e5%2588%2586%252f%25e6%259d%2590%25e6%2596%2599%25e6%25b1%2587%25e6%2580%25bb%25e5%258f%258a%25e8%25af%25b4%25e6%2598%258e%252f%25e5%2588%2586%25e7%25b1%25bb%25e6%259d%2590%25e6%2596%2599%25e8%25a1%25a8.xlsx&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjE0MDAzODgzNDIwNTIzOTcwNTYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidGh5ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkNvbXBhbnlBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvY29tcGFueSI6IjE0MDAzODc2MjYzNjU3MjI2MjQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2lzc3VwZXJhZG1pbiI6IkZhbHNlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlaWQiOiIxMjY4ODA2MzMwNzA4MTIzNjQ4IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9jbGllbnRpcCI6IjEwLjYuMS40MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvY2xpZW50Y2F0ZWdvcnkiOiIyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMDkvMTMvMjAyMSAwNjo0Mjo0MyIsIm5iZiI6MTYzMTQyNzM0MywiZXhwIjoxNjMxNTE1MzYzLCJpc3MiOiJjeWdAMjAxOSIsImF1ZCI6ImN5Z0AyMDE5In0.s6bKgXXc35JbTaL3VoxeLJNZX5toKC8rKpKDi9SO-ek',
      name,
      function (exportJson: any) {
        if (exportJson.sheets == null || exportJson.sheets.length == 0) {
          alert(
            'Failed to read the content of the excel file, currently does not support xls files!',
          );
          return;
        }        
        luckysheet.create({
          ...onlyViewTableConfig,
          data: exportJson.sheets,
        });
      },
    );
  };

  useMount(() => {
    initTableData();
  });

  return (
    <div id="onlyViewComponent" style={{ width: '100%', height: '800px', position: 'relative' }} />
  );
};

export default XlsxViewer;
