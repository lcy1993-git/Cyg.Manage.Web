import projectControl from '@/assets/cockpit-assets/projectControl.png';
import delivery from '@/assets/cockpit-assets/delivery.png';
import other from '@/assets/cockpit-assets/other.png';
import projectType from '@/assets/cockpit-assets/projectType.png';

export interface ChildrenData {
  name: string;
  componentProps: string[];
  componentTitles?: string[];
  title: string;
}

export interface CockpitProps {
    name: string;
    w: number;
    key: string;
    h: number;
    x: number;
    y: number;
    edit?: boolean;
    componentProps?: any;
    // 是否需要固定宽度
    fixHeight?: boolean;
  }

export const getHasChooseComponentsProps = (configArray: CockpitProps[], componentName: string) => {
    return configArray.filter((item) => item.name === componentName && item.componentProps).map((item) => item.componentProps).flat();
}

export const cockpitMenuItemData = [
    {
      type: "projectControl",
      name: "项目管控",
      icon: projectControl,
      childrenData: [
        {
          name: 'mapComponent',
          componentProps: ['province'],
          title: '地图'
        },
        {
          name: "personLoad",
          componentProps: ["person", "department", "company"],
          componentTitles: ["生产负荷(员工)", "生产负荷(部组)", "生产负荷(公司)"],
          title: "生产负荷"
        },
        {
          name: "projectRefreshData",
          componentProps: ["projectRefreshData"],
          title: "实时数据"
        },
        {
          name: "projectProgress",
          componentProps: ["gantt"],
          title: "甘特图"
        }
      ]
    },
    {
        type: "projectType",
        name: "工程类型统计",
        icon: projectType,
        childrenData: [
            {
                title: "项目类型",
                componentProps: ["classify", "level", "category", "stage", "buildType"],
                componentTitles: ["建设类型", "项目分类", "项目类别", "项目阶段", "电压等级"],
                name: "projectType"
            },
            {
                title: "项目情况",
                componentProps: ["status", "nature"],
                name: "projectSchedule"
            }
        ]
    },
    {
        type: "delivery",
        name: "交付统计",
        icon: delivery,
        childrenData: [
            {
                title: "项目交付数量/设计费",
                componentProps: ["person", "department", "company"],
                componentTitles: ["交付统计(员工)", "交付统计(部组)", "交付统计(公司)"],
                name: "deliveryManage"
            }
        ]
    },
    {
        type: "other",
        name: "其他",
        icon: other,
        childrenData: [
            {
                title: "通知栏",
                componentProps: ["wait", "arrange", "other"],
                componentTitles: ["待结项", "待安排", "其他消息"],
                name: "toDo"
            }
        ]
    }
];