import { useCallback, useEffect } from 'react'
import { HistoryDispatch, HistoryState } from '../store'

type useDrawStatusProps = Pick<HistoryState, 'historyGridVersion' | 'mode'> & {
  dispatch: HistoryDispatch
}

export const useDrawStatus = ({ mode, historyGridVersion }: useDrawStatusProps) => {
  // const [delay, setDelay] = useState<number | undefined>()

  const check = useCallback(async () => {
    const versionId = historyGridVersion.isTemplate && historyGridVersion.id

    if (mode === 'recordEdit' && versionId) {
      // const res = await checkVersionStatus(versionId)
    }
  }, [historyGridVersion, mode])

  useEffect(() => {
    check()
  }, [check])
}
