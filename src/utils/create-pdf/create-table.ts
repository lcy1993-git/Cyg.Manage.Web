const bTdStyle = {
  borderBottom: '1px solid #f0f0f0',
  transition: 'background 0.3s',
  position: 'relative',
  padding: '16px 16px',
  overflowWrap: 'break-word',
}
const htdStyle = {
  position: 'relative',
  color: 'rgba(0, 0, 0, 0.85)',
  fontWeight: 500,
  textAlign: 'left',
  background: '#fafafa',
  borderBottom: '1px solid #f0f0f0',
  transition: 'background 0.3s ease',
  padding: '16px 16px',
  overflowWrap: 'break-word',
}
const tableStyle = {
  tableLayout: 'auto',
  width: '100%',
  textAlign: 'left',
  borderRadius: '2px 2px 0 0',
  borderCollapse: 'separate',
  borderSpacing: 0,
}
const setStyle = (style: Object, config: Object) => {
  for (const key in config) {
    style[key] = config[key]
  }
}
type Column = {
  title: any
  key: any
  pdfFormat: (value: any) => void
  [key: string]: any
}
type Data = {
  [key: string]: any
}
type Config = {
  excludeColumns?: [String]
}
const createTable = (columns: [Column], data: [Data], config: Config = {}) => {
  const newColumns = config.excludeColumns
    ? columns.filter((column) => !config.excludeColumns?.includes(column.key))
    : columns
  const table = document.createElement('table')
  setStyle(table.style, tableStyle)
  const thead = document.createElement('thead')
  const tr = document.createElement('tr')
  newColumns.forEach((column) => {
    const td = document.createElement('td')
    td.innerHTML = column.title
    setStyle(td.style, htdStyle)
    tr.appendChild(td)
  })

  thead.appendChild(tr)

  const tbody = document.createElement('tbody')
  data.forEach((item) => {
    const tr = document.createElement('tr')
    newColumns.forEach((column) => {
      const td = document.createElement('td')
      td.innerHTML = column.pdfFormat ? column.pdfFormat(item[column.key]) : item[column.key]
      setStyle(td.style, bTdStyle)
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })

  table.appendChild(thead)
  table.appendChild(tbody)

  return table
}

export default createTable
