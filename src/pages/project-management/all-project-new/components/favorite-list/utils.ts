
export default (data, id) => {
  return deepLoop(data, id)
}

function deepLoop (data, id){

  for(let i = 0; i < data.length; i ++) {
    console.log(data[i]);
    
    if(data[i].id === id) {
      return data[i]
    }

    if(data.children && data.children.length > 0) {
      
      const res = deepLoop(data.children, id)
      if(res) {
        return res
      }
    }
  }
}