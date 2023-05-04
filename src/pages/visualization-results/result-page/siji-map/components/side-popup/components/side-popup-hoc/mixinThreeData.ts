// import { TableDataType } from '../../index'

// const getValue = (data: TableDataType[], key: string) => {
//   const currentData = data.find((item) => item.propertyName === key)
//   return currentData?.data
// }

const mixinThreeData = (data: any) => {
  // let router: string = "";
  // switch (getValue(data, "元素类型")) {
  //   case "杆塔":
  //     switch (getValue(data, "类型")) {
  //       case "D":
  //         router = "cabledevice-hwx"
  //       case "Z":
  //         router = "cablechannel-gcps"
  //       case "NJ1":
  //         router = "tower-zxsn"
  //     }
  //     break;
  //   case "故障指示器":
  //     switch (getValue(data, "类型")) {
  //       case "架空型故障指示器":
  //         router = "faultindicator-overhead"
  //     }
  //     return ""
  //   case "电缆井":
  //     switch (getValue(data, "类型")) {
  //       case "直路井":
  //         router = "faultindicator-overhead"
  //     }
  //     break;
  //   case "电气设备":
  //     switch (getValue(data, "类型")) {
  //       case "环网箱":

  //         break;

  //       default:
  //         break;
  //     }
  //     break;
  //   case "柱上设备":
  //     switch (getValue(data, "类型")) {
  //       case "柱上断路器":

  //         break;

  //       default:
  //         break;
  //     }
  //     break;
  //   case "户表":
  //     switch (getValue(data, "类型")) {
  //       case "380V":

  //         break;

  //       default:
  //         break;
  //     }
  //     break;
  //   case "杆塔":

  //     break;

  //   default:
  //     break;
  // }
  return data
}

export default mixinThreeData
