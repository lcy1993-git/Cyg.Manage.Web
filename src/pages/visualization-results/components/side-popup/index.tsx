import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Table, Modal, Input, message } from 'antd';
import SidePopupMergeThreeHoc from './components/side-popup-hoc/index';
import { CloseOutlined, StepBackwardOutlined } from '@ant-design/icons';

import { useContainer } from '../../result-page/mobx-store';
import CommentList from './components/comment-list';

import moment from 'moment';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';

import { findEnumKeyByCN } from '../../utils/loadEnum';
import { formDataMateral } from '@/utils/utils';
import { getlibId_new, getMedium, getMaterialItemData } from '@/services/visualization-results/visualization-results';
import { CommentRequestType, addComment, fetchCommentList, porjectIsExecutor } from '@/services/visualization-results/side-popup';
import styles from './index.less';
import CableSection from '../cable-section';
import MediaModal from '../media-modal';
import classnames from 'classnames';

export interface TableDataType {
  [propName: string]: any;
}

export interface SidePopupProps {
  data: TableDataType[];
  rightSidebarVisible: boolean;
  setRightSidebarVisiviabel: (arg0: boolean) => void;
  height: number;
}

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
    render(v: number) {
      return v ? String(v) : ""
    }
  },

  {
    title: '单价(元)',
    width: 100,
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    ellipsis: true,
    render(v: number) {
      return v ? String(v) : ""
    }
  },
  {
    title: '单重(kg)',
    width: 100,
    dataIndex: 'pieceWeight',
    key: 'pieceWeight',
    ellipsis: true,
    render(v: number) {
      return v ? String(v) : ""
    }
  },
  {
    title: '状态',
    width: 100,
    dataIndex: 'state',
    key: 'state',
    render(r: string | number) {
      return r || "";
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
const SidePopup: React.FC<SidePopupProps> = observer((props) => {

  const { data: dataResource, rightSidebarVisible, setRightSidebarVisiviabel, height } = props;
  const [commentRquestBody, setcommentRquestBody] = useState<CommentRequestType>();

  const [activeType, setActiveType] = useState<string | undefined>(undefined);
  const [threeModal, setThtreeModal] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState(dataResource);

  const [threeRouter, setThreeRouter] = useState<string>("duanluqi");

  const setMmaterialRefNone = () => {
    if (materialRef?.current?.innerHTML) {
      materialRef.current.innerHTML = '暂无数据';
      materialRef.current.className = '';
    }
  }

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

  const { run: reviewRun } = useRequest(porjectIsExecutor, {
    manual: true,
    onSuccess(data) {
      if (data) {
        reviewRef.current!.innerHTML = '查看';
        reviewRef.current!.className = 'mapSideBarlinkBtn';
      } else {
        reviewRef.current!.innerHTML = '暂无数据';
        reviewRef.current!.className = '';
      }
    },
  })

  const { data: materialData, run: materialDataRun } = useRequest(getMaterialItemData, {
    manual: true,
    onSuccess(data) {
      if (data?.content?.length > 0) {
        data.content.forEach((item: any) => {
          if (item.unit === 'km') {
            item.itemNumber = item.itemNumber / 1000;
          }
        })
        materialRef.current!.innerHTML = '查看';
        materialRef.current!.className = 'mapSideBarlinkBtn';
      } else {
        materialRef.current!.innerHTML = '暂无数据';
        materialRef.current!.className = '';
      }
    },
  });

  const returnlibId = async (materialParams: any) => {
    await getlibId_new({ projectId: materialParams?.getProperties.project_id }).then((data) => {
      if (data.isSuccess) {
        const resourceLibID = data?.content;
        materialDataRun({ resourceLibID, ...materialParams.rest, layerName: materialParams.rest.layerName });
      }
    });
  };

  useEffect(() => {
    if (rightSidebarVisible) {
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
        ?.params ?? {};
      if (materialParams?.rest?.objectID && materialParams?.getProperties.project_id) {
        returnlibId(materialParams);
      } else {
        setMmaterialRefNone();
      }
      // 审阅数据
      const reviewData = dataResource?.find((item: any) => item.propertyName === '审阅')?.data ?? {};
      if(reviewData?.id) {
        reviewRun(reviewData.id)
      }
    } 
  }, [JSON.stringify(dataResource), rightSidebarVisible]);

  const mediaRef = useRef<HTMLSpanElement>(null);
  const materialRef = useRef<HTMLSpanElement>(null);
  const reviewRef = useRef<HTMLSpanElement>(null);

  const [Comment, setComment] = useState('');
  const [mediaVisiable, setMediaVisiable] = useState(false);
  const [mediaIndex, setMediaIndex] = useState<number>(0);
  const store = useContainer();
  // const { vState, setMediaListVisibel } = useContainer();
  const { checkedProjectIdList, mediaListVisibel, mediaListData } = store.vState;

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
    if (materialRef.current?.innerHTML === '查看') {
      setActiveType('material');
    }
  };

  const columns = [
    {
      title: '属性名',
      dataIndex: 'propertyName',
      ellipsis: true,
    },
    {
      title: '属性值',
      dataIndex: 'data',
      width: 164,
      ellipsis: true,
      render(value: any, record: any, index: any) {
        if (record.propertyName === 'title') return null;
        if (record.propertyName === '三维模型') {
          if(record.data){
            return <span
            key={record.id}
            className={styles.link}
            onClick={() => {
              setThreeRouter(value)
              setThtreeModal(true)
            }}
          >查看</span>
          }
        }
        if (typeof value === 'string' || typeof value === 'number')
          return <span key={index}>{value}</span>;
        if (record.propertyName === '多媒体') {
          return (
            <span onClick={handlerMediaClick} ref={mediaRef}>
              {mediaRef ? '暂无数据' : '数据请求中'}
            </span>
          );
        } else if (record.propertyName === '材料表') {
          return (
            <span onClick={handlerMaterialClick} ref={materialRef}>
              {materialRef ? '暂无数据' : '数据请求中'}
            </span>
          );
        } else if (record.propertyName === '审阅') {
          return <span onClick={() => {
            if(reviewRef.current?.innerHTML=== "查看") {
              onOpenAddCommentModal(value)
            }
          }} ref={reviewRef}>暂无权限</span>
          // if (checkedProjectIdList.flat(2).find((i) => i.id === value.id)?.isExecutor) {
          //   return (
          //     <span
          //       className={styles.link}
          //       onClick={() => onOpenAddCommentModal(value)}
          //       key={index}
          //     >
          //       添加审阅
          //     </span>
          //   );
          // } else {
          //   return (
          //     <span key={index} className={styles.none}>
          //       暂无权限
          //     </span>
          //   );
          // }
        } else if (record.propertyName === "穿孔示意图") {
          return <CableSection key={JSON.stringify({ ...value })} {...value} />
        }
        return <span key={index}>暂无权限</span>;
      },
    },
  ];

  const mediaColumns = [
    {
      title: '类型/序号',
      dataIndex: 'type',
      key: 'type',
      render(t: any, r: any) {
        if (t === 1) {
          return <span key={r.id}>图片</span>;
        } else if (t === 2) {
          return <span key={r.id}>音频</span>;
        }
        return t ?? '';
      },
    },
    {
      title: '勘测人',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '勘测日期',
      dataIndex: 'surveyTime',
      key: 'surveyTime',
      render(t: number) {
        return moment(t).format('YYYY-MM-DD');
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render(value: any, record: any, index: number) {
        return (
          <span
            key={record.id}
            className={styles.link}
            onClick={() => {
              setMediaVisiable(true);
              setMediaIndex(index)
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
      // deviceId在审阅获取数据时拿不到id名称，这里的id有误故修改id获取方式
      // const deviceId = split[1];
      const deviceId = feature.values_?.id;

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

  // 解决意外关闭弹窗时，三维模型框没有响应关闭的bug
  useEffect(() => {
    if(!rightSidebarVisible){
      setThtreeModal(false);
    }
  }, [rightSidebarVisible])

  useEffect(() => {
    setRightSidebarVisiviabel(false);
  }, [JSON.stringify(checkedProjectIdList)]);

  const materialDataRes = useMemo(() => {

    const materialParams = dataResource?.find((item: any) => item.propertyName === '材料表')?.data
      ?.params ?? {};

    return materialData?.content && materialData?.content.length > 0
      ? formDataMateral(materialData?.content, materialParams.getProperties)
      : [];

  }, [JSON.stringify(materialData)]);

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
          destroyOnClose={true}
          className={styles.mediaModal}
        >
          <MediaModal content={mediaData?.content ?? []} currentIndex={mediaIndex} setCurrentIndex={setMediaIndex} />
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
            dataSource={materialDataRes ?? []}
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
      <Modal
        title="查看多媒体文件"
        centered
        visible={mediaListVisibel}
        width="96%"
        onOk={onOkClick}
        onCancel={() => store.setMediaListVisibel(false)}
        width={1200}
        maskClosable={true}
      >
        <Table
          columns={mediaColumns}
          dataSource={mediaListData}
          rowKey={(e) => e.id}
          pagination={false}
        ></Table>
        <Modal
          title="多媒体查看"
          visible={mediaVisiable}
          width="96%"
          onCancel={() => setMediaVisiable(false)}
          onOk={() => setMediaVisiable(false)}
          destroyOnClose={true}
          className={styles.mediaModal}
        >
          <MediaModal content={mediaListData} currentIndex={mediaIndex} setCurrentIndex={setMediaIndex} />
        </Modal>
      </Modal>
      {
        rightSidebarVisible ? <div
          title={'项目名称：' + data[1]}
          className={styles.sidePopupWrap}
        >
          <div className={styles.title}>
            <span className={styles.head}>项目名称：</span>
            <span className={styles.body}>{data[1]}</span>
          </div>
          <div className={styles.drawerClose} onClick={() => {
            setRightSidebarVisiviabel(false)
            setThtreeModal(false)
          }}>
            <CloseOutlined />
          </div>
          <Table
            key={JSON.stringify(dataResource)}
            bordered
            style={{ height: 30 }}
            pagination={false}
            columns={columns}
            dataSource={data[0]}
            rowClassName={styles.row}
            scroll={{ y: height - 160 }}
            rowKey={(r) => r.propertyName}
          />
        </div> : null
      }
      {
        rightSidebarVisible && threeModal ? <div
          className={styles.threeModalWrap}
          style={{
            width: window.innerWidth - 540,
            height: window.innerHeight - 228,
          }}>
          <div
            className={classnames(styles.closeButton, styles.link)}
            onClick={() => setThtreeModal(false)}
          ><StepBackwardOutlined />收起</div>
          <iframe key={threeRouter} width="100%" height="100%" src={`${window.location.origin}/visiual3d/?type=${threeRouter}`} style={{ backgroundColor: "#fff" }}></iframe>
        </div> : null
      }
    </div>
  );
});

export default SidePopup;
