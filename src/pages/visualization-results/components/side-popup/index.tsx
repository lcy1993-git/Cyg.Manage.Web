import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Drawer, Table, Modal, Carousel, Input, message } from 'antd';
import { useContainer } from '../../result-page/mobx-store'
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

const surveyData = JSON.parse(window.localStorage.getItem('loadEnumsData')!) ?? [];
const surveyEnum = surveyData.find((i: any) => i.key === 'SurveyState')?.value;

const materiaColumns = [
  {
    title: '物料名称',
    width: 180,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    ellipsis: true
  },
  {
    title: '物料类型',
    width: 120,
    dataIndex: 'type',
    key: 'type',
    ellipsis: true
  },

  {
    title: '物料编号',
    width: 160,
    dataIndex: 'code',
    key: 'code',
    ellipsis: true
  },
  {
    title: '物料单位',
    width: 100,
    dataIndex: 'unit',
    key: 'unit',
    ellipsis: true
  },
  {
    title: '数量',
    width: 100,
    dataIndex: 'itemNumber',
    key: 'itemNumber',
    ellipsis: true
  },

  {
    title: '单价(元)',
    width: 100,
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    ellipsis: true
  },
  {
    title: '单量',
    width: 100,
    dataIndex: 'pieceWeight',
    key: 'pieceWeight',
    ellipsis: true
  },
  {
    title: '状态',
    width: 100,
    dataIndex: 'state',
    key: 'state',
    render(r: string | number) {
      return surveyEnum.find((i: any) => i.value == r)?.text;
    },
    ellipsis: true
  },
  {
    title: '物料型号',
    width: 140,
    dataIndex: 'spec',
    key: 'spec',
    ellipsis: true
  },
  {
    title: '描述',
    width: 100,
    dataIndex: 'description',
    key: 'description',
    ellipsis: true
  },
  {
    title: '供给方',
    width: 100,
    dataIndex: 'supplySide',
    key: 'supplySide',
    ellipsis: true
  },
  {
    title: '备注',
    width: 140,
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true
  },
];

const mediaItem = (data: any) => {
  const authorization = window.localStorage.getItem("Authorization");
  return data.map((item: any, index: any) => {
    if(item.type === 1) {
      return (<div className={styles.mediaItem} key={index}>
        <img className={styles.img} crossOrigin={""} src={`http://10.6.1.36:8023/api/Download/GetFileById?fileId=${item.filePath}&securityKey=1201332565548359680&token=${authorization}`} />
      </div>)
    }else if(item.type !== 1) {
      return (<div className={styles.mediaItem} key={index}>
        {/* <audio controls={true} /> */}
        <audio className={styles.audio} src={`http://10.6.1.36:8023/api/Download/GetFileById?fileId=${item.filePath}&securityKey=1201332565548359680&token=${authorization}`} controls={true}/>
      </div>);

    }
    return <div className={styles.mediaItem} key={index} />
  })
}

const modalTitle = {
  media: "查看多媒体文件",
  material: "查看材料表",
  annotation: "创建批注"
}

const SidePopup: React.FC<Props> = (props) => {
  const { data, rightSidebarVisible, setRightSidebarVisiviabel } = props;

  const { checkedProjectIdList } = useContainer().vState;

  useEffect(() => {
    setRightSidebarVisiviabel(false);
  }, [JSON.stringify(checkedProjectIdList)])

  const modalData = useMemo(() => {
    const media = removeEmptChildren(data.find((item: any) => item.propertyName === "多媒体")?.data);
    const material = removeEmptChildren(data.find((item: any) => item.propertyName === "材料表")?.data);
    function removeEmptChildren(v: any): any[] {
      if (Array.isArray(v)) {
        return v.map((item) => {
          if (item.children) {
            if (item.children.length === 0) {
              delete item.children;
            } else {
              item.children = removeEmptChildren(item.children)
            }
          }
          return item;
        })
      }
      return [];
    }

    return {
      type: "undefined",
      media,
      material,
    }
  }, [JSON.stringify(data)])
  // const [ modalData ] = useState<ModalData>({ type: "media", media: [] });
  const [activeType, setActiveType] = useState<string | undefined>(undefined);
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
          if (value?.length === 0) {
            return <span key={index} className={styles.none}>暂无数据</span>
          }
          return <span className={styles.link} key={index} onClick={() => setActiveType("media")}>查看</span>
        } else if (record.propertyName === "材料表") {
          if (value?.length === 0) {
            return <span key={index} className={styles.none}>暂无数据</span>
          }
          return <span className={styles.link} key={index} onClick={() => setActiveType("material")}>查看</span>
        } else if (record.propertyName === "批注") {
          if (checkedProjectIdList.flat(2).find(i => i.id === value.id)?.isExecutor) {
            return <span className={styles.link} onClick={() => setActiveType("annotation&" + value.id)} key={index}>添加批注</span>
          } else {
            return <span key={index} className={styles.none}>暂无权限</span>
          }
        }
        return <span key={index}></span>
      }
    },
  ];

  const mediaColumns = [
    {
      title: "类型、序号",
      dataIndex: "type",
      key: uuid.v1(),
      render(t: any) {
        if (t === 1) {
          return "图片";
        } else if (t === 2) {
          return "音频";
        }
        return t;
      }
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
      render(value: any, record: any, index: any) {
        return <span key={uuid.v1()} className={styles.link} onClick={() => {
          carouselRef.current?.goTo(index, true);
          setMediaVisiable(true);
        }}>查看</span>
      }
    },
  ];

  const onOkClick = (id: string | undefined) => {
    if (activeType?.split("&")[0] === "annotation") {
      publishMessage({ content: annotation, projectId: activeType.split("&")[1] }).then(res => {
        if (res.code === 200 && res.isSuccess === true) {
          message.success("批注推送成功");
        } else {
          message.error("批注推送失败")
        }

      })
    }
    setActiveType(undefined);
  }

  return (
    <div className={styles.wrap}>
      <Modal
        title={activeType ? modalTitle[activeType!] ?? "创建批注" : ""}
        centered
        visible={!!activeType}
        onOk={onOkClick}
        onCancel={() => setActiveType(undefined)}
        width={1200}
        maskClosable={true}
      >
        <Modal
          title="多媒体查看"
          visible={mediaVisiable}
          width="96%"
          onCancel={() => setMediaVisiable(false)}
        >
          <div className={styles.mediaIconWrapLeft}>
            <DoubleLeftOutlined style={{ fontSize: 50 }} className={styles.mediaIcon} onClick={() => carouselRef?.current?.prev()} />

          </div>
          <div className={styles.mediaIconWrapRight}>
            <DoubleRightOutlined style={{ fontSize: 50 }} className={styles.mediaIcon} onClick={() => carouselRef?.current?.next()} />
          </div>
          <Carousel
            ref={carouselRef}
            dots={false}
          >
            {mediaItem(modalData.media)}
          </Carousel>
        </Modal>
        {activeType === "media" &&
          <Table
            key="media"
            columns={mediaColumns}
            dataSource={modalData.media ?? []}
            rowKey={() => uuid.v1()}
            pagination={false}>
          </Table>
        }
        {activeType === "material" &&
          <Table
            key="material"
            columns={materiaColumns}
            pagination={false}
            rowKey={(r) => r.objID}
            dataSource={modalData.material ?? []}
            scroll={{ x: 1400, y: 350 }}
          >
          </Table>
        }
        {activeType?.split("&")[0] === "annotation" &&
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
