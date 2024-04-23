import { Table } from 'antd'
import { useEffect, useState } from 'react'
const columns = [
  {
    title: '',
    dataIndex: 'name',
    key: 'name',
    colSpan: 0,
    width: 500,
  },
  {
    title: '人工系数调差(%)',
    dataIndex: 'number',
    key: 'number',
    colSpan: 2,
  },
]
// const columnsTwo = [
//   {
//     title: '建筑材机系数调差(%)',
//     children: [
//       {
//         title: '专业属性',
//         dataIndex: 'name',
//         key: 'name',
//       },
//       {
//         title: '材料系数',
//         dataIndex: 'number1',
//         key: 'number1',
//       },
//       {
//         title: '机械系数',
//         dataIndex: 'number2',
//         key: 'number2',
//       },
//     ],
//   },
// ]

const columnsThree = [
  {
    title: '安装材机系数调差(%)',
    children: [
      {
        title: '专业属性',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '材料系数',
        dataIndex: 'number1',
        key: 'number1',
      },
      {
        title: '机械系数',
        dataIndex: 'number2',
        key: 'number2',
      },
    ],
  },
]

// const columnsFour = [
//   {
//     title: '建筑拆除材机系数调差(%)',
//     children: [
//       {
//         title: '专业属性',
//         dataIndex: 'name',
//         key: 'name',
//       },
//       {
//         title: '材料系数',
//         dataIndex: 'number1',
//         key: 'number1',
//       },
//       {
//         title: '机械系数',
//         dataIndex: 'number2',
//         key: 'number2',
//       },
//     ],
//   },
// ]

const columnsFive = [
  {
    title: '安装拆除材机系数调差(%)',
    children: [
      {
        title: '专业属性',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '材料系数',
        dataIndex: 'number1',
        key: 'number1',
      },
      {
        title: '机械系数',
        dataIndex: 'number2',
        key: 'number2',
      },
    ],
  },
]
const RightComponent = (props: any) => {
  const { rightData } = props
  const [data, setData] = useState<any>(rightData)
  useEffect(() => {
    setData(rightData)
  }, [rightData])
  // 人工系数调差
  const dataSource = [
    {
      name: '建筑工程',
      number: data?.mabProject,
    },
    {
      name: '安装工程',
      number: data?.maiProject,
    },
    {
      name: '建筑拆除工程',
      number: data?.mabrProject,
    },
    {
      name: '安装拆除工程',
      number: data?.mairProject,
    },
  ]
  // 建筑材机系数调差
  // const dataSourceTwo = [
  //   {
  //     name: '配电、开关站',
  //     number1: data?.bmdsWithMaterial,
  //     number2: data?.bmdsWithMachine,
  //   },
  //   {
  //     name: '充电、换电站',
  //     number1: data?.bmssWithMaterial,
  //     number2: data?.bmssWithMachine,
  //   },
  //   {
  //     name: '电缆线路',
  //     number1: data?.bmclWithMaterial,
  //     number2: data?.bmclWithMachine,
  //   },
  // ]
  // 安装材机系数调差
  const dataSourceThree = [
    {
      name: '配电、开关站',
      number1: data?.imdsWithMaterial,
      number2: data?.imdsWithMachine,
    },
    {
      name: '充电、换电站',
      number1: data?.imssWithMaterial,
      number2: data?.imssWithMachine,
    },
    {
      name: '架空线路',
      number1: data?.imolWithMaterial,
      number2: data?.imolWithMachine,
    },
    {
      name: '陆上电缆',
      number1: data?.imllWithMaterial,
      number2: data?.imllWithMachine,
    },

    {
      name: '海底电缆',
      number1: data?.imslWithMaterial,
      number2: data?.imslWithMachine,
    },
    {
      name: '通信站',
      number1: data?.imcsWithMaterial,
      number2: data?.imcsWithMachine,
    },
    {
      name: '通信线路',
      number1: data?.imcmlWithMaterial,
      number2: data?.imcmlWithMachine,
    },
  ]
  // 建筑拆除材机系数调差
  // const dataSourceFour = [
  //   {
  //     name: '配电、开关站',
  //     number1: data?.brmdsWithMaterial,
  //     number2: data?.brmdsWithMachine,
  //   },
  //   {
  //     name: '电缆线路',
  //     number1: data?.brmclWithMaterial,
  //     number2: data?.brmclWithMachine,
  //   },
  // ]
  // 安装拆除材机系数调差
  const dataSourceFive = [
    {
      name: '配电、开关站',
      number1: data?.irmdsWithMaterial,
      number2: data?.irmdsWithMachine,
    },
    {
      name: '充电、换电站',
      number1: data?.irmssWithMaterial,
      number2: data?.irmssWithMachine,
    },
    {
      name: '架空线路',
      number1: data?.irmolWithMaterial,
      number2: data?.irmolWithMachine,
    },
    {
      name: '陆上电缆',
      number1: data?.irmllWithMaterial,
      number2: data?.irmllWithMachine,
    },

    {
      name: '海底电缆',
      number1: data?.irmslWithMaterial,
      number2: data?.irmslWithMachine,
    },
    {
      name: '通信站',
      number1: data?.irmcsWithMaterial,
      number2: data?.irmcsWithMachine,
    },
    {
      name: '通信线路',
      number1: data?.irmcmlWithMaterial,
      number2: data?.irmcmlWithMachine,
    },
  ]
  return (
    <div>
      <Table columns={columns} bordered dataSource={dataSource} pagination={false} />

      <div style={{ marginTop: '20px' }}>
        <Table columns={columnsThree} bordered dataSource={dataSourceThree} pagination={false} />
      </div>

      <div style={{ marginTop: '20px' }}>
        <Table columns={columnsFive} bordered dataSource={dataSourceFive} pagination={false} />
      </div>
    </div>
  )
}
export default RightComponent
