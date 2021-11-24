import { useCallback, useEffect, useReducer, useRef } from 'react'
export * from './fetcher'

type Fetcher<Result> = () => Promise<Result>

type UseApiOptions<R, E> = {
  initialData?: R
  onError?: (error?: E) => void
  onSuccess?: (result: R) => void
  filter?: (result: R) => R
}

type ApiReducerState<R, E> = {
  data?: R
  error?: E
  loading: boolean
}

type ApiReducerAction<R> = {
  type: 'FETCH_INIT' | 'FETCH_SUCCESS' | 'FETCH_FAILURE'
  payload?: R
}

export const useApi = <Result, Error>(
  fetcher: Fetcher<Result>,
  options: UseApiOptions<Result, Error> = {}
) => {
  const [state, dispatch] = useReducer(
    (state: ApiReducerState<Result, Error>, action: ApiReducerAction<Result | Error>) => {
      switch (action.type) {
        case 'FETCH_INIT':
          return {
            ...state,
            loading: true,
          }
        case 'FETCH_SUCCESS':
          return {
            ...state,
            loading: false,
            data: action.payload as Result,
          }
        case 'FETCH_FAILURE':
          return {
            ...state,
            loading: false,
            error: action.payload as Error,
          }
        default:
          throw new Error()
      }
    },
    {
      loading: false,
      data: options.initialData,
    }
  )

  const _options = useRef(options)

  const fetchData = useCallback(
    async (flag?: { didCancel: boolean }) => {
      const { onError, onSuccess, filter } = _options.current

      dispatch({ type: 'FETCH_INIT' })

      try {
        let data: Result = await fetcher()

        if (typeof filter === 'function') {
          data = filter(data)
        }

        if (!flag || !flag.didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: data })
          typeof onSuccess === 'function' && onSuccess(data)
        }

        return Promise.resolve(data)
      } catch (error) {
        if (!flag || !flag.didCancel) {
          dispatch({ type: 'FETCH_FAILURE', payload: error as Error })
          typeof onError === 'function' && onError(error as Error)
        }

        return Promise.reject(error)
      }
    },
    [fetcher]
  )

  useEffect(() => {
    let flag = { didCancel: false }
    fetchData(flag)

    return () => {
      flag.didCancel = true
    }
  }, [fetchData])

  return {
    ...state,
    update: fetchData,
    setData: (data: Result) => dispatch({ type: 'FETCH_SUCCESS', payload: data }),
  }
}
