
let enums: any = null; 
let mappingTagsDictionary: any =null;
// 属性栏字段转中文
function getMappingTagsDictionary() {
  if(mappingTagsDictionary) return mappingTagsDictionary;
  mappingTagsDictionary = Object.create(null);
  const enumsData = localStorage.getItem('loadEnumsData');
  if (enumsData && enumsData !== 'undefined') {
    if(!enums) {
      enums = JSON.parse(enumsData) ;
    }
    // const enumsDataParse = JSON.parse(enumsData)
    // enums = enums ? enums : JSON.parse(enumsData) ;
    mappingTagsDictionary.cable = {
      mappingTags1: {
        "code": "名称",
        "type": "类型",
        "mode": "型号",
        "state": "状态",
        "surveyor": "勘测人员",
        "survey_time": "勘测时间",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTags2: {
        "code": "名称",
        "type": "类型",
        "mode": "型号",
        "azimuth": "转角度数",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTagValues: {
        "type": findenumsValue("CableType"),
        "state": findenumsValue("SurveyState"),
      }
    };
    mappingTagsDictionary.tower = {
      mappingTags1: {
        "code": "名称",
        "type": "杆型",
        "rod": "杆规格",
        "segment": "分段方式",
        "sort": "排列方式",
        "state": "状态",
        "surveyor": "勘测人员",
        "survey_time": "勘测日期",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTags2: {
        "code": "名称",
        "pole_type_code": "类型",
        "rod": "杆梢径(mm)",
        "height": "高度(m)",
        "segment": "分段方式",
        "sort": "排列方式",
        "state": "状态",
        "azimuth": "方位角",
        "hcg": "呼称高",
        "depth": "埋深(m)",
        "mode": "型号",
        "loop_name": "所属回路",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTagValues: {
        "sort": findenumsValue("Arrangement"),
        "state": findenumsValue("SurveyState"),
        "segment": findenumsValue("SegmentMode")
      }
    };
    mappingTagsDictionary.track = {
      mappingTags: {
        "id": "ID",
        "record_date": "记录日期",
        "recorder": "记录者",
        "company": "所属公司",
        "type": "轨迹类型",
        "project_id": "title"
      },
      mappingTagValues: {
        "type": findenumsValue("ProjectTraceRecordType"),
      }
    };
    mappingTagsDictionary.trackline = {
      mappingTags: {
        "project_id": "title"
      },
      mappingTagValues: {
      }
    };
    mappingTagsDictionary.pull_line = {
      mappingTags: {
        "id": "拉线ID",
        "mode_id": "拉线型号",
        "main_id": "所属杆塔",
        "azimuth": "方位角",
        "mode": "拉线型号",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTagValues: {}
    };

    enums.push({
      key: 'LoopLevel',
      value: [{
        value: 0,
        text: '主干道'
      },
      {
        value: 1,
        text: '一级分支'
      },
      {
        value: 2,
        text: '二级分支等'
      }
      ]
    });
    mappingTagsDictionary.line = {
      mappingTags1: {
        "start_id": "线路起点",
        "end_id": "线路终点",
        "length": "长度(m)",
        "name": "线路名称",
        "kv_level": "电压等级",
        "mode": "线路型号",
        "state": "线路状态",
        "surveyor": "勘测人员",
        "survey_time": "勘测日期",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title",
      },
      mappingTags2: {
        "type": "导线类型",
        "mode": "导线型号",
        "length": "长度(m)",
        "kv_level": "电压等级",
        "loop_name": "回路名称",
        "loop_level": "回路层级",
        "state": "状态",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTags3: {
        "type": "导线类型",
        "mode": "导线型号",
        "length": "长度(m)",
        "kv_level": "电压等级",
        "state": "状态",
        "name": "线路名称",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTagValues: {
        "state": findenumsValue("SurveyState"),
        "kv_level": findenumsValue("KVLevel"),
        "loop_level": findenumsValue("LoopLevel")
      }
    };
    mappingTagsDictionary.user_line = {
      mappingTags1: {
        "kv_level": "电压等级",
        "parent_id": "所属杆塔",
        "mode": "导线型号",
        "state": "状态",
        "length": "长度(m)",
        "surveyor": "勘测人员",
        "survey_time": "勘测日期",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTags2: {
        "kv_level": "电压等级",
        "parent_id": "所属杆塔",
        "mode": "导线型号",
        "entry_mode": "下户方式",
        "state": "状态",
        "length": "长度(m)",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title",
      },
      mappingTagValues: {
        "state": findenumsValue("SurveyState"),
        "kv_level": findenumsValue("KVLevel")
      }
    };
    mappingTagsDictionary.cable_channel = {
      mappingTags1: {
        "length": "长度(m)",
        "lay_mode": "敷设方式",
        "mode": "通道类型",
        "state": "通道状态",
        "surveyor": "勘测人员",
        "survey_time": "勘测时间",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title",
      },
      mappingTags2: {
        "lay_mode": "敷设方式",
        "mode": "通道型号",
        "arrangement": "排列方式",
        "length": "长度(m)",
        "state": "状态",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTagValues: {
        "lay_mode": findenumsValue("CableLayMode"),
        "state": findenumsValue("SurveyState"),
      }
    };
    mappingTagsDictionary.transformer = {
      mappingTags1: {
        "name": "名称",
        "main_id": "所属杆塔",
        "capacity": "容量",
        "state": "状态",
        "fix_mode": "安装方法",
        "surveyor": "勘测人员",
        "survey_time": "勘测时间",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTags2: {
        "name": "名称",
        "main_id": "主杆编号",
        "sub_id": "副杆编号",
        "capacity": "容量",
        "state": "状态",
        "mode": "型号",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTagValues: {
        "state": findenumsValue("SurveyState"),
        "fix_mode": findenumsValue("OverheadEquipmentFixMode"),
      }
    };
    mappingTagsDictionary.cable_equipment = {
      mappingTags1: {
        "code": "名称",
        "type": "类型",
        "equip_model": "型号",
        "state": "状态",
        "surveyor": "勘测人员",
        "survey_time": "勘测时间",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title",
      },
      mappingTags2: {
        "code": "名称",
        "type": "类型",
        "equip_model": "型号",
        "state": "状态",
        "azimuth": "方位角",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title",
      },
      mappingTagValues: {
        "type": findenumsValue("CableEquipmentType"),
        "state": findenumsValue("SurveyState")
      }
    };
    mappingTagsDictionary.mark = {
      mappingTags1: {
        "type": "地物类型",
        "name": "地物名称",
        "width": "宽度(m)",
        "height": "高度(m)",
        "road_level": "道路等级",
        "line_kv_level": "电压等级",
        "surveyor": "勘测人员",
        "survey_time": "勘测时间",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title",
      },
      mappingTags2: {
        "type": "地物类型",
        "name": "地物名称",
        "width": "宽度(m)",
        "height": "高度(m)",
        "road_level": "道路等级",
        "line_kv_level": "电压等级",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title",
      },
      mappingTagValues: {
        "type": findenumsValue("MarkType"),
        "state": findenumsValue("SurveyState"),
        "road_level": findenumsValue("RoadLevel"),
        "line_kv_level": findenumsValue("LineKvLevel")
      }
    };

    mappingTagsDictionary.electric_meter = {
      mappingTags1: {
        "kv_level": "电压等级",
        "parent_id": "所属杆塔",
        "entry_type": "下户方式",
        "entry_mode": "下户类型",
        "type": "户表类型",
        "mode": "户表型号",
        "state": "户表状态",
        "total_count": "户表位",
        "count": "户表数",
        "surveyor": "勘测人员",
        "survey_time": "勘测时间",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTags2: {
        "name": "名称",
        "kv_level": "电压等级",
        "parent_id": "所属杆塔/设备",
        "entry_type": "下户方式",
        "entry_mode": "下户类型",
        "type": "户表类型",
        "mode": "户表型号",
        "state": "户表状态",
        "total_count": "户表位",
        "count": "户表数",
        "linePhase": "导线相数",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTagValues: {
        "type": findenumsValue("ElectricMeterType"),
        "kv_level": findenumsValue("KVLevel"),
        "state": findenumsValue("SurveyState"),
        "entry_type": findenumsValue("EntryMode")
      }
    };
    mappingTagsDictionary.cross_arm = {
      mappingTags1: {
        "project_id": "title"
      },
      mappingTags2: {
        "model": "型号",
        "voltage": "电压等级",
        'parent_id': "所属杆塔",
        "state": "状态",
        "isupgraded": "是否改造",
        "project_id": "title"
      },
      mappingTagValues: {
        "voltage": findenumsValue("KVLevel"),
        "state": findenumsValue("SurveyState"),
      }
    };
    mappingTagsDictionary.hole = {
      mappingTags1: {
        "project_id": "title"
      },
      mappingTags2: {
        "code": "穿孔编号",
        "hole_profile": "穿孔示意图",
        'hole_direction': "方向",
        "isupgraded": "是否改造",
        "project_id": "title"
      }
    };
    enums.push({
      key: 'OverHeadDeviceType',
      value: [{
        value: 0,
        text: '无'
      },
      {
        value: 1,
        text: '柱上变压器'
      },
      {
        value: 2,
        text: '柱上熔断器'
      },
      {
        value: 3,
        text: '柱上断路器'
      },
      {
        value: 4,
        text: '柱上隔离开关'
      },
      {
        value: 5,
        text: '柱上避雷器'
      },
      {
        value: 6,
        text: '拉线'
      },
      {
        value: 7,
        text: '电力引下'
      },
      {
        value: 8,
        text: '无功补偿'
      },
      {
        value: 9,
        text: '高压计量'
      },
      {
        value: 10,
        text: 'PT'
      }
      ]
    });
    mappingTagsDictionary.over_head_device = {
      mappingTags1: {
        "type": "类型",
        "name": "设备名称",
        "main_id": "所属杆塔",
        "state": "状态",
        "surveyor": "勘测人员",
        "survey_time": "勘测时间",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTags2: {
        "type": "类型",
        "name": "设备名称",
        "main_id": "所属杆塔",
        "mode": "型号",
        "state": "状态",
        "isupgraded": "是否改造",
        "remark": "备注",
        "project_id": "title"
      },
      mappingTagValues: {
        "voltage": findenumsValue("KVLevel"),
        "type": findenumsValue("OverHeadDeviceType"),
        "state": findenumsValue("SurveyState")
      }
    };
    mappingTagsDictionary.fault_indicator = {
      mappingTags: {
        "mode": "故障指示器型号",
        "state": "状态",
        "azimuth": "方位角",
        "project_id": "所属项目",
        "isupgraded": "是否改造",
        "remark": "备注"
      },
      mappingTagValues: {
        "state": findenumsValue("SurveyState") || ""
      }
    };

    return JSON.stringify(mappingTagsDictionary);
  } else {
    console.log("mappingTagsDictionary异常！！！请重新加载。。。'")
    return;
  }


}
/**
 * 根据键名获取相应枚举值
 * @param key 键名
 * @returns ArrayLick
 */
 function findenumsValue(key: any) {
  return enums.find((e: any) => e.key === key)?.value.map((i: {value: number; text: string;}) => i.text) ?? [];
}
// function findenumsValue(key: any) {
//   return Object(
//     enums.find((e: any) => e.key === key)?.value
//     .map((i: {value: number; text: string;}) => i.text)
//   );
// }
// function convertEnums(enumsParam: any) {
  
//   var result = {};
//   for (var e in enumsParam) {
//     var eValue = enumsParam[e];
//     result[eValue.value] = eValue.text;
//   }
//   return enumsParam.map((i: {value: number; text: string;}) => i.text);
// }

export default getMappingTagsDictionary;