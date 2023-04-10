import PageCommonWrap from '@/components/page-common-wrap'
import { useState } from 'react'
import { Button } from 'antd'
import StandingBook from './components/standing-book'
// import { testGet } from '@/services/backstage-config/visual-config'
const Test = () => {
  // const [data, setData] = useState(null)
  const [visible, setVisible] = useState<boolean>(false)
  // useEffect(() => {
  //   downLoadFileItem({ fileId: '1522494038355251200' }).then((res) => {
  //     setData(res)
  //   })
  // }, [])

  // useEffect(() => {
  //   testGet()
  // })

  return (
    <PageCommonWrap noPadding>
      <Button onClick={() => setVisible(true)}>台账总览</Button>
      <StandingBook visible={visible} onChange={setVisible} />
    </PageCommonWrap>
  )
}

export default Test
