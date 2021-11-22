import { useCallback, useEffect, useReducer } from 'react'
export * from './fetcher'

type Fetcher<Result, Params extends any[] | never[]> = (...params: Params) => Promise<Result>

type UseApiOptions<R, E, P> = {
  initialData?: R
  fetcherParams?: P
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

const initialOption = {}

export const useApi = <Result, Error, Params extends any[]>(
  fetcher: Fetcher<Result, Params>,
  options: UseApiOptions<Result, Error, Params> = initialOption
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

  const fetchData = useCallback(
    async (flag?: { didCancel: boolean }) => {
      const { fetcherParams, onError, onSuccess, filter } = options

      dispatch({ type: 'FETCH_INIT' })

      try {
        const params = fetcherParams || []
        let data: Result = await fetcher(...(params as Params))

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
    [options, fetcher]
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
