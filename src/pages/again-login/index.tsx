import CutAccount from '@/layouts/components/cut-account'
import { useLayoutStore } from '@/layouts/context'
import React, { useState } from 'react'

const AgainLogin: React.FC = () => {
  const [againLoginVisible, setAgainLoginVisible] = useState(true)
  const { clearAgainLogin } = useLayoutStore()

  const finishEvent = () => {
    clearAgainLogin?.()
  }

  return (
    <CutAccount
      againLogin={true}
      finishEvent={finishEvent}
      visible={againLoginVisible}
      onChange={setAgainLoginVisible}
    />
  )
}

export default AgainLogin
