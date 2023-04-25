// import { useControllableValue } from 'ahooks'
// import { MenuUnfoldOutlined } from '@ant-design/icons'
// import styles from './index.less'
// import { Drawer } from 'antd'
// interface Props {}

// const RightSideBar: React.FC<Props> = (props) => {
//   const [state, setState] = useControllableValue(props, { valuePropName: '' })
//   return (
//     <div>
//       <Drawer
//         title={'项目名称：' + data[1]}
//         placement="right"
//         closable={false}
//         visible={rightSidebarVisible}
//         destroyOnClose={true}
//         mask={false}
//         className={rightSidebarVisible ? '' : styles.poiontEventNone}
//         getContainer={false}
//         style={{ position: 'absolute', width: 340 }}
//       >
//         <div className={styles.drawerClose} onClick={() => setRightSidebarVisiviabel(false)}>
//           <MenuUnfoldOutlined />
//         </div>
//         {/* <Table
//           bordered
//           style={{ height: 30 }}
//           pagination={false}
//           columns={columns}
//           dataSource={data[0]}
//           rowClassName={styles.row}
//           rowKey={(r) => r.propertyName}
//         /> */}
//       </Drawer>
//     </div>
//   )
// }

// export default RightSideBar
