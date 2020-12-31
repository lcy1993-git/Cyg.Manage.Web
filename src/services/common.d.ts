export interface RequestDataType<T> {
    code: number
    content: T
    isSuccess: boolean
    message?: string
    traceId?: string
}