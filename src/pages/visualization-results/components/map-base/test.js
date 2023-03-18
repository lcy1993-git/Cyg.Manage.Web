const getPostion = () => {
  const promise = new Promise((res, rej) => {
    const a = 1
    const data = a + 3
    res(data)
  })
  promise.then((value) => {
    return value
  })
  return promise
}

console.log(getPostion())
