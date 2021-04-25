import React, { useRef, useState } from 'react';
import { Drawer, Table, Modal, Carousel, Input } from 'antd';
import { MenuUnfoldOutlined, DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { publishMessage } from "@/services/visualization-results/visualization-results";
import uuid from 'node-uuid';
import styles from './index.less';



export interface TableDataType {
  propertyName: string;
  data: string;
}

export interface Props {
  data: TableDataType[];
  rightSidebarVisible: boolean;
  setRightSidebarVisiviabel: (arg0: boolean) => void;
}

const mediaItem = (data: any) => {
  return data.map((item: any, index: any) => {
    return (<div  className={styles.mediaItem} key={index}>
      <img className={styles.img} src="http://171.223.214.154:8023/api/Download/GetFileById?fileId=1383744607473659904&amp;securityKey=1201332565548359680&amp;token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEyNzAyNDQzMTczNjk2OTYyNTYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoieGpzZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkNvbXBhbnlBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvY29tcGFueSI6IjEyNzAyMzk3MTMxMzk1ODkxMjAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2lzc3VwZXJhZG1pbiI6IkZhbHNlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlaWQiOiIxMjY4ODA2MzMwNzA4MTIzNjQ4IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9jbGllbnRpcCI6IjIyMS4yMzcuMTQuMjA3IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjAyMS80LzIzIDEzOjUxOjMxIiwibmJmIjoxNjE5MDcwNjkxLCJleHAiOjE2MTkxNTcwOTEsImlzcyI6ImN5Z0AyMDE5IiwiYXVkIjoiY3lnQDIwMTkifQ.bASBHOH5aa7KOA6j5bLp_bm7mQNYa2NHeCgFSz4thAk"></img>
    </div>)
  })
}

interface ModalData {
  type?: "media" | "material" | "annotation" | undefined;
  media?: any;
}

const modalTitle = {
  media: "查看多媒体文件",
  material: "查看材料表",
  annotation: "创建批注"
}

const SidePopup: React.FC<Props> = (props) => {
  const { data, rightSidebarVisible, setRightSidebarVisiviabel } = props;
  const [ modalData ] = useState<ModalData>({ type: "media", media: [{type: 1}] });
  const [activeType, setActiveType] = useState<"media" | "material" | "annotation" | undefined>(undefined);
  const [annotation, setAnnotation] = useState("");
  const [mediaVisiable, setMediaVisiable] = useState(false);
  const carouselRef = useRef<any>(null);
  const columns = [
    {
      title: '属性名',
      dataIndex: 'propertyName',
    },
    {
      title: '属性值',
      dataIndex: 'data',
      render(value: any, record: any, index: any) {
        if (typeof value === "string") return <span key={index}>{value}</span>;
        if (record.propertyName === "多媒体") {
          console.log(record);
          if (!value) return <span key={index} className={styles.none}>暂无数据</span>
          return <span className={styles.link} key={index} onClick={() => setActiveType("media")}>查看</span>
        } else if (record.propertyName === "材料表") {
          console.log(record);
          return <span className={styles.link} key={index} onClick={() => setActiveType("material")}>查看</span>
        } else if (record.propertyName === "批注") {
          console.log(record);
          return <span className={styles.link} onClick={() => setActiveType("annotation")} key={index}>添加批注</span>
        }
        return <span key={index}></span>
      }
    },
  ];

  const mediaColumns = [
    {
      title: "类型、序号",
      dataIndex: "type",
      key: uuid.v1()
    },
    {
      title: "勘测人",
      dataIndex: "account",
      key: uuid.v1()
    },
    {
      title: "勘测日期",
      dataIndex: "surveyTime",
      key: uuid.v1()
    },
    {
      title: "操作",
      dataIndex: "id",
      key: uuid.v1(),
      render(value: any, record: any, index: any){
        return <span key={uuid.v1()} className={styles.link} onClick={()=>setMediaVisiable(true)}>查看</span>
      }
    },
  ];

  const onOkClick = () => {
    if (modalData?.type === "annotation") {
      publishMessage({ content: annotation, projectId: "" })
    }
    setActiveType(undefined)
  }

  console.log(carouselRef)

  return (
    <div className={styles.wrap}>
      <Modal
        title={activeType ? modalTitle[activeType!] : ""}
        centered
        visible={!!activeType}
        onOk={onOkClick}
        onCancel={() => setActiveType(undefined)}
        width={1200}
      >
        <Modal
          title="多媒体查看"
          visible={mediaVisiable}
          width="96%"
          onCancel={()=>setMediaVisiable(false)}
        >
          <div className={styles.mediaIconWrapLeft}>
            <DoubleLeftOutlined style={{fontSize: 50}} className={styles.mediaIcon} onClick={()=> carouselRef?.current?.prev() } />

          </div>
          <div className={styles.mediaIconWrapRight}>
            <DoubleRightOutlined style={{fontSize: 50}} className={styles.mediaIcon} onClick={()=> carouselRef?.current?.next() } />
          </div>
            <Carousel
              effect="fade"
              ref={carouselRef}
              dots={false}
            >
              {mediaItem([1, 2, 3, 4, 5])}
            </Carousel>
        </Modal>
        {activeType === "media" &&
          <Table
            columns={mediaColumns}
            dataSource={modalData.media ?? []}
            pagination={false}>
            key={uuid.v1()}
          </Table>
        }
        {activeType === "material" &&
          <Table
            key={uuid.v1()}
          >
          </Table>
        }
        {activeType === "annotation" &&
          <Input.TextArea
            placeholder="请输入输入框推送内容..."
            autoSize={{ minRows: 8, maxRows: 8 }}
            defaultValue={annotation}
            value={annotation}
            onChange={(e) => setAnnotation(e.target.value)}
          />
        }
      </Modal>
      <Drawer
        placement="right"
        closable={false}
        visible={rightSidebarVisible}
        destroyOnClose={true}
        mask={false}
        getContainer={false}
        style={{ position: 'absolute', width: 340 }}
      >
        <div className={styles.drawerClose} onClick={() => setRightSidebarVisiviabel(false)}>
          <MenuUnfoldOutlined />
        </div>
        <Table style={{ height: 30 }} pagination={false} columns={columns} dataSource={data} rowClassName={styles.row} />
      </Drawer>
    </div>
  );
};

export default SidePopup;
