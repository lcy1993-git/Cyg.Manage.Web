import { divide } from "@umijs/deps/compiled/lodash"
import VirtualScroll from "./components/virtual-scroll"

const Test = () => {
  const data = Array(100).fill(1)
  console.log(data);
  
  return <VirtualScroll data={data} component={() => <div style={{height: 30, border: "1px solid red"}}>123</div>}/>
}

export default Test