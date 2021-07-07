import { Fragment } from 'react';
import CommonTitle from '@/components/common-title';
import { Checkbox, Form } from 'antd';
import { ChildrenData } from '../../utils';
import { useCallback } from 'react';
interface EditFormItemProps {
  childrenData: ChildrenData[];
  configArray: any[];
}

const EditFormItem: React.FC<EditFormItemProps> = ({ childrenData, configArray=[] }) => {
  
  const childrenDataDom = () => {
    // const isCheck = (name, v, configArray) => {
    //   console.log(configArray);
      
    //   return configArray.find((item) => item.name === name)?.componentProps.includes(v)
    // }
    return childrenData.map((item) => {
      return (
        <>
          <CommonTitle key={item.title}>{item.title}</CommonTitle>
          <Form.Item name={item.name} key={item.name}>
            <Checkbox.Group>
              {item.componentProps.map((v, i) => {
                return (
                  <Checkbox key={v} value={v}>{ item.componentTitles ? item.componentTitles[i] : item.title }</Checkbox>
                );
              })}
            </Checkbox.Group>
          </Form.Item>
        </>
      )
    })
  }

  return (
    <Fragment>
      { childrenDataDom() }
    </Fragment>
  )
}

export default EditFormItem;

// {
//   <CommonTitle>地图</CommonTitle>
// <Form.Item name="mapComponent">
//   <Checkbox.Group>
//     <Checkbox value="province">项目数量（地图）</Checkbox>
//     {/* <Checkbox value="city">市</Checkbox> */}
//   </Checkbox.Group>
// </Form.Item>
// <CommonTitle>生产负荷</CommonTitle>
// <Form.Item name="personLoad">
//   <Checkbox.Group>
//     <Checkbox value="person">生产负荷(员工)</Checkbox>
//     <Checkbox value="department">生产负荷(部组)</Checkbox>
//     <Checkbox value="company">生产负荷(公司)</Checkbox>
//     {/* <Checkbox value="city">市</Checkbox> */}
//   </Checkbox.Group>
// </Form.Item>
// <CommonTitle>实时数据</CommonTitle>
// <Form.Item name="projectRefreshData">
//   <Checkbox.Group>
//     <Checkbox value="projectRefreshData">实时数据</Checkbox>
//     {/* <Checkbox value="city">市</Checkbox> */}
//   </Checkbox.Group>
// </Form.Item>
// <CommonTitle>甘特图</CommonTitle>
// <Form.Item name="projectProgress">
//   <Checkbox.Group>
//     <Checkbox value="gantt">甘特图</Checkbox>
//     {/* <Checkbox value="city">市</Checkbox> */}
//   </Checkbox.Group>
// </Form.Item>
// }