import PageCommonWrap from '@/components/page-common-wrap'
import { Table } from 'antd'
// import { testGet } from '@/services/backstage-config/visual-config'

interface DataType {
  danwei: string
  shejidanwei: string
  number: number
  yiyanshou: number
  rate: string
  sjNumber: number
}

const Test = () => {
  const columns = [
    {
      title: '项目单位',
      dataIndex: 'danwei',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        }
        if (index === 1) {
          obj.props.rowSpan = 2 // 当index等于2的时候 表示第3行，rowSpan等于2表示占据2行
        }
        if (index === 2) {
          obj.props.rowSpan = 0 // 当index等于3的时候 表示第4行，rowSpan等于0表示不渲染，上面那行已把它合并了
        }
        return obj
      },
    },
    {
      title: '总项目数',
      dataIndex: 'number',
      render: (text) => <a>{text}</a>,
    },

    {
      title: '设计单位',
      dataIndex: 'shejidanwei',
    },

    {
      title: '已验收',
      dataIndex: 'yiyanshou',
    },
    {
      title: '竣工图完成率',
      dataIndex: 'rate',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        }
        if (index === 1) {
          obj.props.rowSpan = 2 // 当index等于2的时候 表示第3行，rowSpan等于2表示占据2行
        }
        if (index === 2) {
          obj.props.rowSpan = 0 // 当index等于3的时候 表示第4行，rowSpan等于0表示不渲染，上面那行已把它合并了
        }
        return obj
      },
    },
  ]

  const data: DataType[] = [
    {
      danwei: '乌鲁木齐',
      number: 32,
      yiyanshou: 5,
      shejidanwei: '新疆光源',
      rate: '100%',
      sjNumber: 23,
    },
    {
      danwei: '昌吉',
      number: 22,
      yiyanshou: 8,
      shejidanwei: '新疆新能里',
      rate: '100%',
      sjNumber: 4,
    },
    {
      danwei: '昌吉',
      number: 22,
      yiyanshou: 8,
      shejidanwei: '昌吉州恒光电力',
      rate: '100%',
      sjNumber: 12,
    },
  ]

  return (
    <PageCommonWrap noPadding>
      <div>123213213123</div>
      <Table columns={columns} dataSource={data} bordered />;
    </PageCommonWrap>
  )
}

export default Test
