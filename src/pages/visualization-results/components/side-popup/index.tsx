import React, { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { Drawer, Table, Modal, Carousel, Input, message } from 'antd';
import { useContainer } from '../../result-page/mobx-store';
import { MenuUnfoldOutlined, DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import {
  CommentRequestType,
  addComment,
  fetchCommentList,
} from '@/services/visualization-results/side-popup';
// import { publishMessage } from '@/services/news-config/Comment-manage';
import CommentList from './components/comment-list';
import uuid from 'node-uuid';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { baseUrl } from '@/services/common';
import moment from 'moment';
import { EnumItem, EnumValue, findEnumKeyByType, findEnumKeyByCN } from '../../utils/loadEnum';
import {
  getlibId,
  getMedium,
  getMaterialItemData,
} from '@/services/visualization-results/visualization-results';
import { removeEmptChildren } from '@/utils/utils';
export interface TableDataType {
  [propName: string]: any;
}

export interface Props {
  data: TableDataType[];
  rightSidebarVisible: boolean;
  setRightSidebarVisiviabel: (arg0: boolean) => void;
}

const loadEnumsData = window.localStorage.getItem('loadEnumsData');
const surveyData = loadEnumsData && loadEnumsData !== 'undefined' ? JSON.parse(loadEnumsData) : [];
const surveyEnum = surveyData.find((i: any) => i.key === 'SurveyState')?.value;

const materiaColumns = [
  {
    title: '物料名称',
    width: 180,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    ellipsis: true,
  },
  {
    title: '物料类型',
    width: 120,
    dataIndex: 'type',
    key: 'type',
    ellipsis: true,
  },

  {
    title: '物料编号',
    width: 160,
    dataIndex: 'code',
    key: 'code',
    ellipsis: true,
  },
  {
    title: '物料单位',
    width: 100,
    dataIndex: 'unit',
    key: 'unit',
    ellipsis: true,
  },
  {
    title: '数量',
    width: 100,
    dataIndex: 'itemNumber',
    key: 'itemNumber',
    ellipsis: true,
  },

  {
    title: '单价(元)',
    width: 100,
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    ellipsis: true,
  },
  {
    title: '单量',
    width: 100,
    dataIndex: 'pieceWeight',
    key: 'pieceWeight',
    ellipsis: true,
  },
  {
    title: '状态',
    width: 100,
    dataIndex: 'state',
    key: 'state',
    render(r: string | number) {
      return surveyEnum.find((i: any) => i.value == r)?.text;
    },
    ellipsis: true,
  },
  {
    title: '物料型号',
    width: 140,
    dataIndex: 'spec',
    key: 'spec',
    ellipsis: true,
  },
  {
    title: '描述',
    width: 100,
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: '供给方',
    width: 100,
    dataIndex: 'supplySide',
    key: 'supplySide',
    ellipsis: true,
  },
  {
    title: '备注',
    width: 140,
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true,
  },
];

const mediaItem = (data: any) => {
  const authorization = window.localStorage.getItem('Authorization');

  return data?.map((item: any, index: any) => {
    if (item.type === 1) {
      return (
        <div className={styles.mediaItem} key={item.id}>
          <img
            className={styles.img}
            crossOrigin={''}
            src={`${baseUrl.upload}/Download/GetFileById?fileId=${item.filePath}&securityKey=1201332565548359680&token=${authorization}`}
          />
        </div>
      );
    } else if (item.type !== 1) {
      return (
        <div className={styles.mediaItem} key={item.id}>
          {/* <audio controls={true} /> */}
          <audio
            className={styles.audio}
            src={`${baseUrl.upload}/Download/GetFileById?fileId=${item.filePath}&securityKey=1201332565548359680&token=${authorization}`}
            controls={true}
          />
        </div>
      );
    }
    return <div className={styles.mediaItem} key={item.id} />;
  });
};

const modalTitle = {
  media: '查看多媒体文件',
  material: '查看材料表',
  annotation: '创建审阅',
};

const DEVICE_TYPE: { [propertyName: string]: string } = {
  tower: '杆塔',
  cable: '电缆井',
  cable_equipment: '电气设备',
  mark: '地物',
  transformer: '变压器',
  over_head_device: '柱上设备',
  line: '线路' || '电缆',
  cable_channel: '电缆通道',
  electric_meter: '户表',
  cross_arm: '横担',
  user_line: '下户线',
  fault_indicator: '故障指示器',
  pull_line: '拉线',
  Track: '轨迹点',
  TrackLine: '轨迹线',
};

const LAYER_TYPE: { [propertyName: string]: string } = {
  survey: '勘察',
  plan: '方案',
  design: '设计',
  dismantle: '拆除',
};

export interface CommentListItemDataType {
  author: string;
  content: React.ReactNode;
  datetime: React.ReactNode;
}
const SidePopup: React.FC<Props> = observer((props) => {
  const { data: dataResource, rightSidebarVisible, setRightSidebarVisiviabel } = props;
  const [commentRquestBody, setcommentRquestBody] = useState<CommentRequestType>();
  const [activeType, setActiveType] = useState<string | undefined>(undefined);

  const [dataSource, setDataSource] = useState(dataResource);

  const { data: mediaData, run: mediaDataRun } = useRequest(getMedium, {
    manual: true,
    onSuccess(data) {
      if (data?.content?.length > 0) {
        mediaRef.current!.innerHTML = '查看';
        mediaRef.current!.className = 'mapSideBarlinkBtn';
      } else {
        mediaRef.current!.innerHTML = '暂无数据';
        mediaRef.current!.className = '';
      }
    },
  });

  const { data: materialData, run: materialDataRun } = useRequest(getMaterialItemData, {
    manual: true,
    onSuccess(data) {
      if (data?.content?.length > 0) {
        materialRef.current!.innerHTML = '查看';
        materialRef.current!.className = 'mapSideBarlinkBtn';
      } else {
        materialRef.current!.innerHTML = '暂无数据';
        materialRef.current!.className = '';
      }
    },
  });

  const returnlibId = async (data: any) => {
    if (data.isSucceess) {
      return await data.content.libId;
    }
  };

  useEffect(() => {
    setDataSource(dataResource);
    // 多媒体数据请求
    const mediaParams = dataResource?.find((item: any) => item.propertyName === '多媒体')?.data
      ?.params;
    if (mediaParams) {
      mediaDataRun(mediaParams);
    } else if (mediaRef.current) {
      mediaRef.current.innerHTML = '暂无数据';
      mediaRef.current.className = '';
    }
    // 材料表数据请求
    const materialParams = dataResource?.find((item: any) => item.propertyName === '材料表')?.data
      ?.params;
    if (materialParams && materialParams.id) {
      const { id, ...restParams } = mediaParams;
      const resourceLibID = returnlibId(id);
      if (resourceLibID) {
        materialDataRun({ resourceLibID, ...restParams });
      } else if (materialRef.current) {
        materialData.current.innerHTML = '暂无数据';
        materialData.current.className = '';
      }
    }
  }, [JSON.stringify(dataResource)]);

  const mediaRef = useRef<HTMLSpanElement>(null);
  const materialRef = useRef<HTMLSpanElement>(null);

  const [Comment, setComment] = useState('');
  const [mediaVisiable, setMediaVisiable] = useState(false);
  const carouselRef = useRef<any>(null);
  const { checkedProjectIdList } = useContainer().vState;

  const data = useMemo(() => {
    const title = dataSource.find((o) => o.propertyName === 'title')?.data;
    return [dataSource.filter((o) => o.propertyName !== 'title'), title ? title : ''];
  }, [JSON.stringify(dataSource)]);

  const handlerMediaClick = () => {
    if (mediaRef.current?.innerHTML === '查看') {
      setActiveType('media');
    }
  };

  const handlerMaterialClick = () => {
    if (mediaRef.current?.innerHTML === '查看') {
      setActiveType('material');
    }
  };

  const columns = [
    {
      title: '属性名',
      dataIndex: 'propertyName',
      width: 55,
      ellipsis: true,
    },
    {
      title: '属性值',
      dataIndex: 'data',
      width: 65,
      ellipsis: true,
      render(value: any, record: any, index: any) {
        if (record.propertyName === 'title') return null;
        if (typeof value === 'string' || typeof value === 'number')
          return <span key={index}>{value}</span>;
        if (record.propertyName === '多媒体') {
          return (
            <span onClick={handlerMediaClick} ref={mediaRef}>
              数据请求中
            </span>
          );
        } else if (record.propertyName === '材料表') {
          return (
            <span onClick={handlerMaterialClick} ref={materialRef}>
              数据请求中
            </span>
          );
        } else if (record.propertyName === '审阅') {
          if (checkedProjectIdList.flat(2).find((i) => i.id === value.id)?.isExecutor) {
            return (
              <span
                className={styles.link}
                onClick={() => onOpenAddCommentModal(value)}
                key={index}
              >
                添加审阅
              </span>
            );
          } else {
            return (
              <span key={index} className={styles.none}>
                暂无权限
              </span>
            );
          }
        }
        return <span key={index}></span>;
      },
    },
  ];

  const mediaColumns = [
    {
      title: '类型、序号',
      dataIndex: 'type',
      key: uuid.v1(),
      render(t: any) {
        if (t === 1) {
          return <span key={uuid.v1()}>图片</span>;
        } else if (t === 2) {
          return <span key={uuid.v1()}>音频</span>;
        }
        return t ?? '';
      },
    },
    {
      title: '勘测人',
      dataIndex: 'account',
      key: uuid.v1(),
    },
    {
      title: '勘测日期',
      dataIndex: 'surveyTime',
      key: uuid.v1(),
      render(t: number) {
        return moment(t).format('YYYY-MM-DD');
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: uuid.v1(),
      render(value: any, record: any, index: any) {
        return (
          <span
            key={uuid.v1()}
            className={styles.link}
            onClick={() => {
              carouselRef.current?.goTo(index, true);
              setMediaVisiable(true);
            }}
          >
            查看
          </span>
        );
      },
    },
  ];

  /**
   * 获取评审list
   */
  const {
    data: commentListResponseData,
    run: fetchCommentListRequest,
    loading: fetchCommentListloading,
  } = useRequest(fetchCommentList, {
    manual: true,
    onError: () => {
      message.error('获取审阅失败');
    },
  });
  /**
   * 添加评审
   */
  const { run: addCommentRequest } = useRequest(addComment, {
    manual: true,
    onSuccess: () => {
      message.success('添加成功');
      fetchCommentListRequest({
        layer: commentRquestBody?.layerType,
        deviceId: commentRquestBody?.deviceId,
        projectId: commentRquestBody?.projectId,
      });
      setComment('');
    },
    onError: () => {
      message.error('添加失败');
    },
  });

  const onOpenAddCommentModal = (value: any) => {
    setActiveType('annotation&' + value.id);

    const feature = data[0].find((item: any) => item.propertyName === '审阅')?.data.feature;

    /**
     * 从feature这个对象里面取出关键信息，
     * 由于localstorage里面存的是中文枚举值，
     * 这里取出来的是英文，所以要根据中英文转换一下
     */
    if (feature) {
      const { id_ } = feature;
      const { project_id: projectId } = feature.values_;
      /**
       * "survey_tower.1386220338212147281" 切割该字符串获取图层type，设备类型，设备id
       * survey_device_type.1386220338212147281
       */
      const split = id_.split('.');
      const deviceId = split[1];
      const deviceAndLayer = split[0].split('_');

      /**
       * 初始化请求body
       * LAYER_TYPE[deviceAndLayer[0]]这里是英文转换成中文，
       * 因为feature里面的数据是英文的，
       * 但是本地存储的是中文？？？？？
       */

      let body = {
        layerType: findEnumKeyByCN(LAYER_TYPE[deviceAndLayer[0]], 'ProjectCommentLayer'),
        deviceType: findEnumKeyByCN(
          DEVICE_TYPE[deviceAndLayer.slice(1).join('_')],
          'ProjectCommentDevice',
        ),
        deviceId,
        projectId,
        content: '',
      };

      setcommentRquestBody(body);
      fetchCommentListRequest({ layer: body.layerType, deviceId: body.deviceId, projectId });
    }
  };

  useEffect(() => {
    setRightSidebarVisiviabel(false);
  }, [JSON.stringify(checkedProjectIdList)]);

  const materialDataRes = useMemo(() => {
    // const media = removeEmptChildren(
    //   data[0].find((item: any) => item.propertyName === '多媒体')?.data,
    // );
    // const material = removeEmptChildren(
    //   data[0].find((item: any) => item.propertyName === '材料表')?.data,
    // );
    return materialData?.content && materialData?.content.length > 0
      ? removeEmptChildren(materialData?.content)
      : [];
    // function removeEmptChildren(v: any): any[] {
    //   if (Array.isArray(v)) {
    //     return v.map((item) => {
    //       if (item.children) {
    //         if (item.children.length === 0) {
    //           delete item.children;
    //         } else {
    //           item.children = removeEmptChildren(item.children);
    //         }
    //       }
    //       return item;
    //     });
    //   }
    //   return [];
    // }
  }, [JSON.stringify(materialData)]);
  // const [ modalData ] = useState<ModalData>({ type: "media", media: [] });

  /**
   * 当modal click确定的时候
   * @param id
   */
  const onOkClick = () => {
    /**
     * 如果要在添加审阅相应事件只能在这个if下面
     */
    if (activeType?.split('&')[0] === 'annotation') {
      addCommentRequest({
        projectId: commentRquestBody?.projectId ?? '',
        layerType: commentRquestBody?.layerType ?? -100,
        deviceType: commentRquestBody?.deviceType ?? -100,
        deviceId: commentRquestBody?.deviceId ?? '-100',
        content: Comment,
      });
    } else {
      setActiveType(void 0);
    }
  };

  const DrawerWrap = useMemo(() => {
    return (
      <Drawer
        title={'项目名称：' + data[1]}
        placement="right"
        closable={false}
        visible={rightSidebarVisible}
        destroyOnClose={true}
        mask={false}
        className={rightSidebarVisible ? '' : styles.poiontEventNone}
        getContainer={false}
        // key={uuid.v1()}
        style={{ position: 'absolute', width: 340 }}
      >
        <div className={styles.drawerClose} onClick={() => setRightSidebarVisiviabel(false)}>
          <MenuUnfoldOutlined />
        </div>
        <Table
          bordered
          style={{ height: 30 }}
          pagination={false}
          columns={columns}
          dataSource={data[0]}
          rowClassName={styles.row}
          rowKey={(r) => r.propertyName}
        />
      </Drawer>
    );
  }, [rightSidebarVisible, JSON.stringify(data)]);

  return (
    <div className={styles.wrap}>
      <Modal
        title={activeType ? modalTitle[activeType!] ?? '添加审阅' : ''}
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
          onOk={() => setMediaVisiable(false)}
        >
          <div className={styles.mediaIconWrapLeft}>
            <DoubleLeftOutlined
              style={{ fontSize: 50 }}
              className={styles.mediaIcon}
              onClick={() => carouselRef?.current?.prev()}
            />
          </div>
          <div className={styles.mediaIconWrapRight}>
            <DoubleRightOutlined
              style={{ fontSize: 50 }}
              className={styles.mediaIcon}
              onClick={() => carouselRef?.current?.next()}
            />
          </div>
          <Carousel ref={carouselRef} dots={false}>
            {mediaItem(mediaData?.content ?? [])}
          </Carousel>
        </Modal>
        {activeType === 'media' && (
          <Table
            key="media"
            columns={mediaColumns}
            dataSource={mediaData?.content ?? []}
            rowKey={(e) => e.id}
            pagination={false}
          ></Table>
        )}
        {activeType === 'material' && (
          <Table
            key="material"
            columns={materiaColumns}
            pagination={false}
            rowKey={(r) => r.objID}
            dataSource={materialData?.content ?? []}
            scroll={{ x: 1400, y: 350 }}
          ></Table>
        )}
        {activeType?.split('&')[0] === 'annotation' && (
          <>
            <div>
              <CommentList
                horizontal
                height={300}
                commentList={commentListResponseData}
                loading={fetchCommentListloading}
              />

              <div className="flex">
                <div style={{ width: '8%' }}>添加审阅</div>
                <Input.TextArea
                  maxLength={200}
                  placeholder="请输入"
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  defaultValue={Comment}
                  value={Comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
          </>
        )}
      </Modal>
      {DrawerWrap}
    </div>
  );
});

export default SidePopup;
