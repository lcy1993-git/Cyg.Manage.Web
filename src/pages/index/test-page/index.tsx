import data from './data'

interface Data {
  id: number;
  parentID: number;
  [key: string]: any
}

function formatDatatoTree(data: Data[]) {
  const cloneData = data.map((item) => {
    return { ...item }
  })
  const root = cloneData.filter(item => item.parentID === -1)
  const childrens = cloneData.filter(item => item.parentID !== -1)
  recursion(root, childrens)
  return root
  function recursion(parents: Data[], childrens: Data[]) {
    parents.forEach((p) => {
      childrens.forEach(() => {

      })
    })
  }
}

const Test = () => {
  console.log(formatDatatoTree(data));
  return null
}

export default Test

