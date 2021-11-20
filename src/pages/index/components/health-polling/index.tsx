import { pollingHealth } from '@/services/index'
import { useInterval, useRequest } from 'ahooks'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'umi'

const HealthPolling: React.FC = () => {
  const [requestFlag, setRequestFlag] = useState(true)
  const location = useLocation()
  //轮询
  const { run } = useRequest(() => pollingHealth(), {
    manual: true,
  })

  useEffect(() => {
    if (location.pathname && location.pathname === '/again-login') {
      setRequestFlag(false)
    } else {
      setRequestFlag(true)
    }
  }, [location.pathname])

  useInterval(() => {
    if (requestFlag) {
      run()
    }
  }, 3000)
  return <div></div>
}

export default HealthPolling
