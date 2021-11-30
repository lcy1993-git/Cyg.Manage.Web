declare type IsNever<T> = Exclude<T, never> extends never ? true : false
