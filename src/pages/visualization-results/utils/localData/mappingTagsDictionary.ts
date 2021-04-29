// 属性栏字段转中文
function getMappingTagsDictionary() {
  let mappingTagsDictionary: any = {};
  const enumsData = localStorage.getItem('loadEnumsData')
  if (enumsData) {
    const enums = JSON.parse(enumsData)
    mappingTagsDictionary.cable = {
      mappingTags: {
        "code": "电缆井编号",
        "type": "电缆井类型",
        "state": "状态",
        "mode_id": "型号",
        "mode": "方案型号",
        "project_id": "所属项目",
        "electrified_work": "带电作业",
        "remark": "备注",
        "surveyor": "勘测人员",
        "survey_time": "勘测时间"
      },
      mappingTagValues: {
        "type": convertEnums(enums && enums[enums.findIndex((e: any) => e.key == "CableType")].value),
        "state": convertEnums(enums && enums[enums.findIndex((e: any) => e.key == "SurveyState")].value),
        "lay_mode": convertEnums(enums && enums[enums.findIndex((e: any) => e.key == "CableLayMode")].value),
        "electrified_work": {
          false: "不带电",
          true: "带电"
        }
      }
    };
    mappingTagsDictionary.tower = {
      mappingTags: {
        "code": "杆塔编号",
        "type": "杆塔类型",
        "mode_id": "型号",
        "rod": "杆梢径(mm)",
        "segment": "分段方式",
        "height": "高度(m)",
        "state": "状态",
        "pole_type_code": "型号",
        "sort": "排序",
        "remark": "备注",
        "loop_name": "所属回路",
        "loop_level": "回路层级",
        "project_id": "所属项目",
        "electrified_work": "带电作业",
        "surveyor": "勘测人员",
        "survey_time": "勘测日期"
      },
      mappingTagValues: {
        "sort": convertEnums(enums[enums.findIndex((e: any) => e.key == "Arrangement")].value),
        "state": convertEnums(enums[enums.findIndex((e: any) => e.key == "SurveyState")].value),
        "segement": convertEnums(enums[enums.findIndex((e: any) => e.key == "SegmentMode")].value),
        "kv_level": convertEnums(enums[enums.findIndex((e: any) => e.key == "KVLevel")].value),
        "pre_node_type": convertEnums(enums[enums.findIndex((e: any) => e.key == "NodeType")].value),
        "electrified_work": {
          false: "不带电",
          true: "带电"
        }
      }
    };
    mappingTagsDictionary.track = {
      mappingTags: {
        "id": "拉线ID",
        "record_date": "记录日期",
        "recorder": "记录者",
        "company": "所属公司",
        "type": "轨迹类型",
        "project_id": "所属项目"
      },
      mappingTagValues: {
        "type": convertEnums(enums[enums.findIndex((e: any) => e.key == "ProjectTraceRecordType")].value)
      }
    };
    mappingTagsDictionary.pull_line = {
      mappingTags: {
        "id": "拉线ID",
        "mode_id": "拉线型号",
        "main_id": "杆塔",
        "azimuth": "方位角",
        "mode": "拉线型号",
        "remark": "备注",
        "project_id": "所属项目"
      },
      mappingTagValues: {}
    };
    mappingTagsDictionary.line = {
      mappingTags: {
        "name": "导线名称",
        "state": "状态",
        "kv_level": "电压等级",
        "type": "导线类型",
        "mode": "导线型号",
        "length": "长度",
        "remark": "备注",
        "loop_name": "回路名称",
        "project_id": "所属项目",
        "surveyor": "勘测人员",
        "survey_time": "勘测日期"
      },
      mappingTagValues: {
        "state": convertEnums(enums[enums.findIndex((e: any) => e.key == "SurveyState")].value),
        "kv_level": convertEnums(enums[enums.findIndex((e: any) => e.key == "KVLevel")].value)
      }
    };
    mappingTagsDictionary.user_line = {
      mappingTags: {
        "name": "下户线名称",
        "state": "状态",
        "kv_level": "电压等级",
        "type": "导线类型",
        "mode": "导线型号",
        "length": "长度",
        "remark": "备注",
        "loop_name": "回路名称",
        "project_id": "所属项目",
        "surveyor": "勘测人员",
        "survey_time": "勘测日期"
      },
      mappingTagValues: {
        "state": convertEnums(enums[enums.findIndex((e: any) => e.key == "SurveyState")].value)
        // "kv_level": convertEnums(enums[enums.findIndex((e) => e.key == "KVLevel")].value)
      }
    };
    mappingTagsDictionary.cable_channel = {
      mappingTags: {
        "code": "电缆通道编号",
        "lay_mode": "敷设方式",
        "state": "状态",
        "duct_spec": "电缆管材质型号",
        "mode": "电缆通道型号",
        "remark": "备注",
        "length": "长度",
        "voltage": "电压等级",
        "project_id": "所属项目",
        "surveyor": "勘测人员",
        "survey_time": "勘测时间"
      },
      mappingTagValues: {
        "lay_mode": convertEnums(enums[enums.findIndex((e: any) => e.key == "CableLayMode")].value),
        "state": convertEnums(enums[enums.findIndex((e: any) => e.key == "SurveyState")].value)
      }
    };
    mappingTagsDictionary.transformer = {
      mappingTags: {
        "name": "变压器名称",
        "state": "状态",
        "survey_time": "勘测时间",
        "mode": "变压器型号",
        "surveyor": "勘测人员"
      },
      mappingTagValues: {
        "state": convertEnums(enums[enums.findIndex((e: any) => e.key == "SurveyState")].value)
      }
    };
    mappingTagsDictionary.cable_equipment = {
      mappingTags: {
        "name": "设备名称",
        "type": "设备类型",
        "equip_model": "型号",
        "length": "长",
        "width": "宽",
        "height": "高",
        "state": "状态",
        "remark": "备注",
        "code": "设备编号",
        "project_id": "所属项目",
        "surveyor": "勘测人员",
        "survey_time": "勘测时间"
      },
      mappingTagValues: {
        "type": convertEnums(enums[enums.findIndex((e: any) => e.key == "CableEquipmentType")].value),
        "state": convertEnums(enums[enums.findIndex((e: any) => e.key == "SurveyState")].value)
      }
    };
    mappingTagsDictionary.mark = {
      mappingTags: {
        "name": "地物名称",
        "type": "地物类型",
        "azimuth": "方位角",
        "project_id": "所属项目",
        "width": "宽",
        "height": "高",
        "state": "状态",
        "floors": "楼层数",
        "remark": "备注",
        "surveyor": "勘测人员",
        "survey_time": "勘测时间"
      },
      mappingTagValues: {
        "type": convertEnums(enums[enums.findIndex((e: any) => e.key == "MarkType")].value),
        "state": convertEnums(enums[enums.findIndex((e: any) => e.key == "SurveyState")].value)
      }
    };

    mappingTagsDictionary.electric_meter = {
      mappingTags: {
        "name": "户表名称",
        "entry_mode": "下户类型",
        "type": "户表类型",
        "state": "状态",
        "kv_level": "电压等级",
        "mode": "型号",
        "total_count": "表位",
        "count": "表数",
        "project_id": "所属项目",
        "remark": "备注"
      },
      mappingTagValues: {
        "type": convertEnums(enums[enums.findIndex((e: any) => e.key == "ElectricMeterType")].value),
        "kv_level": convertEnums(enums[enums.findIndex((e: any) => e.key == "KVLevel")].value),
        "state": convertEnums(enums[enums.findIndex((e: any) => e.key == "SurveyState")].value)
      }
    };
    mappingTagsDictionary.cross_arm = {
      mappingTags: {
        "model": "横担型号",
        "voltage": "电压等级",
        "state": "状态"
      },
      mappingTagValues: {
        "voltage": convertEnums(enums[enums.findIndex((e: any) => e.key == "KVLevel")].value),
        "state": convertEnums(enums[enums.findIndex((e: any) => e.key == "SurveyState")].value)
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
      mappingTags: {
        "name": "杆上设备名称",
        "type": "杆上设备类型",
        "state": "状态",
        "mode": "型号",
        "project_id": "所属项目",
        "remark": "备注"
      },
      mappingTagValues: {
        "voltage": convertEnums(enums[enums.findIndex((e: any) => e.key == "KVLevel")].value),
        "type": convertEnums(enums[enums.findIndex((e: any) => e.key == "OverHeadDeviceType")].value),
        "state": convertEnums(enums[enums.findIndex((e: any) => e.key == "SurveyState")].value)
      }
    };
    mappingTagsDictionary.fault_indicator = {
      mappingTags: {
        "mode": "故障指示器型号",
        "state": "状态",
        "azimuth": "方位角",
        "project_id": "所属项目",
        "remark": "备注"
      },
      mappingTagValues: {
        "state": convertEnums(enums[enums.findIndex((e: any) => e.key == "SurveyState")].value)
      }
    };

    return JSON.stringify(mappingTagsDictionary);
  } else {
    console.log("mappingTagsDictionary异常！！！请重新加载。。。'")
    // $('.error').text('网络异常！！！请重新加载。。。').animate({
    //     top: '30px',
    //     opacity: 1
    // }, 2000, function () {
    //     setTimeout(() => {
    //         $(this).animate({
    //             top: '-200px',
    //             opacity: 0
    //         }, 0)
    //     }, 1000)
    // });
    return;
  }


}

function convertEnums(enumsParam: any) {
  var result = {};
  for (var e in enumsParam) {
    var eValue = enumsParam[e];
    result[eValue.value] = eValue.text;
  }
  return result;
}

export default getMappingTagsDictionary;