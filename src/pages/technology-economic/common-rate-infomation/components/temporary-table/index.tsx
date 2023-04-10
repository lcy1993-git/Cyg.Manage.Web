import commonLess from '../common.less'
import classNames from 'classnames'
interface TemporaryTableProps {
  head: React.ReactNode
  data: any[]
}

const TemporaryTable: React.FC<TemporaryTableProps> = ({ head, data }) => {
  const getDom = (type, city) => {
    const typeData = data.find((item) => item.costRateType === type)
    return typeData ? typeData?.[`level_${city}`] : ''
  }
  return (
    <>
      <table className={classNames(commonLess.table)}>
        <thead>
          <tr>
            <th colSpan={4}>{head}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>工程类别</td>
            <td>建筑工程</td>
            <td>安装工程</td>
          </tr>
          <tr>
            <td rowSpan={3}>费率(%)</td>
            <td>城区</td>
            <td>{getDom(1, 1)}</td>
            <td>{getDom(2, 1)}</td>
          </tr>
          <tr>
            <td>郊区</td>
            <td>{getDom(1, 2)}</td>
            <td>{getDom(2, 2)}</td>
          </tr>
          <tr>
            <td>乡村</td>
            <td>{getDom(1, 3)}</td>
            <td>{getDom(2, 3)}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default TemporaryTable
