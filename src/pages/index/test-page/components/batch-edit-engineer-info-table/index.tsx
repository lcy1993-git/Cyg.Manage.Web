import { Button, Cascader, Checkbox } from "antd"
import uuid from "node-uuid"
import React, { useEffect, useState } from "react"
import { useMemo } from "react"
import styles from "./index.less"
import city from '@/assets/local-data/area';
import { useGetSelectData } from "@/utils/hooks"
import DataSelect from '@/components/data-select';
import { cloneDeep } from "lodash"
import useRequest from "@ahooksjs/use-request"
import { getCommonSelectData } from "@/services/common"
import EditBulkEngineer from "@/pages/project-management/all-project-new/components/bulk-import-project/edit-bulk-engineer"


const excelModalData = [{ "engineer": { "name": "导入工程1", "province": null, "city": null, "area": null, "libId": null, "inventoryOverviewId": null, "warehouseId": null, "compiler": "编制人1", "compileTime": 1620403200000, "organization": "编制单位1", "startTime": 1620489600000, "endTime": 1623081600000, "company": null, "importance": 1, "plannedYear": 2024, "grade": 1 }, "projects": [{ "name": "导入工程1-项目1", "category": 1, "pType": 1, "kvLevel": 1, "totalInvest": 25.5, "natures": ["128"], "startTime": 1620403200000, "endTime": 1620489600000, "assetsNature": 5, "majorCategory": 1, "isAcrossYear": false, "reformCause": 2, "reformAim": 3, "powerSupply": null, "assetsOrganization": "资产所属单位1", "cityCompany": "所属市公司1", "regionAttribute": 1, "countyCompany": "所属县公司1", "constructType": 1, "pCategory": 2, "stage": 4, "batch": 3, "pAttribute": 1, "meteorologic": 0, "disclosureRange": 50, "pileRange": 50, "deadline": 1620489600000, "dataSourceType": 0 }, { "name": "导入工程1-项目2", "category": 1, "pType": 1, "kvLevel": 1, "totalInvest": 25.5, "natures": ["128"], "startTime": 1620403200000, "endTime": 1620489600000, "assetsNature": 5, "majorCategory": 1, "isAcrossYear": false, "reformCause": 2, "reformAim": 3, "powerSupply": null, "assetsOrganization": "资产所属单位1", "cityCompany": "所属市公司1", "regionAttribute": 1, "countyCompany": "所属县公司1", "constructType": 1, "pCategory": 2, "stage": 4, "batch": 3, "pAttribute": 1, "meteorologic": 0, "disclosureRange": 50, "pileRange": 50, "deadline": 1620489600000, "dataSourceType": 0 }] }, { "engineer": { "name": "导入工程2", "province": null, "city": null, "area": null, "libId": null, "inventoryOverviewId": null, "warehouseId": null, "compiler": "编制人2", "compileTime": 1623081600000, "organization": "编制单位2", "startTime": 1623168000000, "endTime": 1625673600000, "company": null, "importance": 1, "plannedYear": 2025, "grade": 2 }, "projects": [{ "name": "导入工程2-项目1", "category": 1, "pType": 1, "kvLevel": 1, "totalInvest": 25.5, "natures": ["128"], "startTime": 1620403200000, "endTime": 1620489600000, "assetsNature": 5, "majorCategory": 1, "isAcrossYear": false, "reformCause": 2, "reformAim": 3, "powerSupply": null, "assetsOrganization": "资产所属单位1", "cityCompany": "所属市公司1", "regionAttribute": 1, "countyCompany": "所属县公司1", "constructType": 1, "pCategory": 2, "stage": 4, "batch": 3, "pAttribute": 1, "meteorologic": 0, "disclosureRange": 50, "pileRange": 50, "deadline": 1620489600000, "dataSourceType": 0 }] }]

const BatchEditEngineerInfoTable: React.FC = () => {
    const [engineerInfo, setEngineerInfo] = useState<any[]>([])
    const [currentChooseEngineerInfo, setCurrentChooseEngineerInfo] = useState<any>()

    const [currentClickEngineerInfo, setCurrentClickEngineerInfo] = useState<any>()

    const [editEngineerModalVisible, setEditEngineerModalVisible] = useState<boolean>(false)

    const mapHandleCityData = (data: any) => {
        return {
            label: data.text,
            value: data.id,
            children: data.children
                ? [
                    { label: '无', value: `${data.id}_null`, children: undefined },
                    ...data.children.map(mapHandleCityData),
                ]
                : undefined,
        };
    };

    const afterHandleData = useMemo(() => {
        return city.map(mapHandleCityData);
    }, [JSON.stringify(city)]);

    const { run: getInventoryOverviewSelectData } = useRequest(getCommonSelectData, { manual: true })

    const { run: getWarehouseSelectData } = useRequest(getCommonSelectData, { manual: true })
    const { run: getCompanySelectData } = useRequest(getCommonSelectData, { manual: true })
    const { run: getDepartmentSelectData } = useRequest(getCommonSelectData, { manual: true })

    const { data: libSelectData = [] } = useGetSelectData({
        url: '/ResourceLibrary/GetList',
        extraParams: { pId: '-1' },
    });

    useEffect(() => {
        const newData = excelModalData.map((item, index) => {
            return {
                ...item,
                id: uuid.v1(),
                checked: index === 0 ? true : false,
                selectData: {
                    inventoryOverviewSelectData: [],
                    warehouseSelectData: [],
                    companySelectData: [],
                    departmentSelectData: []
                }
            }
        })
        setEngineerInfo(newData)
        setCurrentChooseEngineerInfo(newData[0])
    }, [JSON.stringify(excelModalData)])

    const areaChangeEvent = async (value: any, numberIndex: number) => {
        const [province, city, area] = value;
        const copyEngineerInfo = cloneDeep(engineerInfo);

        const warehouseSelectData = await getWarehouseSelectData(
            { url: "/WarehouseOverview/GetList", method: "get", params: { areaId: province }, requestSource: "project" }
        )

        const companySelectData = await getCompanySelectData(
            { url: "/ElectricityCompany/GetListByAreaId", method: "get", params: { areaId: province }, requestSource: "project" }
        )

        const handleWarehouseSelectData = warehouseSelectData.map((item: any) => {
            return {
                label: item.text,
                value: item.value
            }
        })

        const handleCompanySelectData = companySelectData.map((item: any) => {
            return {
                label: item.text,
                value: item.text
            }
        })

        const handleData = copyEngineerInfo.map((item, index) => {
            if (index === numberIndex) {
                const handleProjects = item.projects.map((ite: any) => {
                    return {
                        ...ite,
                        powerSupply: ""
                    }
                })
                if (item.checked) {
                    setCurrentChooseEngineerInfo({
                        ...item,
                        engineer: {
                            ...item.engineer,
                            province,
                            city,
                            area,
                            warehouseId: "",
                            company: ""
                        },
                        selectData: {
                            ...item.selectData,
                            warehouseSelectData: handleWarehouseSelectData,
                            companySelectData: handleCompanySelectData
                        },
                        projects: handleProjects
                    })
                }
                return {
                    ...item,
                    engineer: {
                        ...item.engineer,
                        province,
                        city,
                        area,
                        warehouseId: "",
                        company: ""
                    },
                    selectData: {
                        ...item.selectData,
                        warehouseSelectData: handleWarehouseSelectData,
                        companySelectData: handleCompanySelectData
                    },
                    projects: handleProjects
                }
            }
            return item
        })

        setEngineerInfo(handleData)
    }

    const libChangeEvent = async (value: any, numberIndex: number) => {
        const copyEngineerInfo = cloneDeep(engineerInfo);
        const inventoryOverviewSelectData = await getInventoryOverviewSelectData(
            { url: "/InventoryOverview/GetList", method: "get", params: { libId: value }, requestSource: "project" }
        )

        const handleInventoryOverviewSelectData = inventoryOverviewSelectData.map((item: any) => {
            return {
                label: item.text,
                value: item.value
            }
        })

        const handleData = copyEngineerInfo.map((item, index) => {
            if (index === numberIndex) {
                return {
                    ...item,
                    engineer: {
                        ...item.engineer,
                        libId: value,
                        inventoryOverviewId: ""
                    },
                    selectData: {
                        ...item.selectData,
                        inventoryOverviewSelectData: handleInventoryOverviewSelectData
                    }
                }
            }
            return item
        })

        setEngineerInfo(handleData)
    }

    const wareHouseChangeEvent = (value: any, numberIndex: number) => {
        const copyEngineerInfo = cloneDeep(engineerInfo);

        const handleData = copyEngineerInfo.map((item, index) => {
            if (index === numberIndex) {
                return {
                    ...item,
                    engineer: {
                        ...item.engineer,
                        warehouseId: value
                    }
                }
            }
            return item
        })

        setEngineerInfo(handleData)
    }

    const companyChangeEvent = async (value: any, numberIndex: number) => {
        const copyEngineerInfo = cloneDeep(engineerInfo);

        const departmentSelectData = await getDepartmentSelectData({ url: "/ElectricityCompany/GetPowerSupplys", method: "post", params: { areaId: copyEngineerInfo[numberIndex].engineer.areaId, company: value }, requestSource: "project" })

        const handleDepartmentSelectData = departmentSelectData.map((item: any) => {
            return {
                label: item.text,
                value: item.value
            }
        })

        const handleData = copyEngineerInfo.map((item, index) => {
            if (index === numberIndex) {
                const handleProjects = item.projects.map((ite: any) => {
                    return {
                        ...ite,
                        powerSupply: ""
                    }
                })
                if (item.checked) {
                    setCurrentChooseEngineerInfo({
                        ...item,
                        engineer: {
                            ...item.engineer,
                            company: value
                        },
                        selectData: {
                            ...item.selectData,
                            departmentSelectData: handleDepartmentSelectData
                        },
                        projects: handleProjects
                    })
                }
                return {
                    ...item,
                    engineer: {
                        ...item.engineer,
                        company: value
                    },
                    selectData: {
                        ...item.selectData,
                        departmentSelectData: handleDepartmentSelectData
                    },
                    projects: handleProjects
                }
            }
            return item
        })

        setEngineerInfo(handleData)
    }

    const inventoryOverviewChange = (value: any, numberIndex: number) => {
        const copyEngineerInfo = cloneDeep(engineerInfo);

        const handleData = copyEngineerInfo.map((item, index) => {
            if (index === numberIndex) {
                return {
                    ...item,
                    engineer: {
                        ...item.engineer,
                        inventoryOverviewId: value
                    }
                }
            }
            return item
        })

        setEngineerInfo(handleData)
    }

    const checkboxChangeEvent = (value: any, numberIndex: number) => {
        const copyEngineerInfo = cloneDeep(engineerInfo);

        const handleData = copyEngineerInfo.map((item, index) => {
            if (index === numberIndex) {
                setCurrentChooseEngineerInfo(item)
                return {
                    ...item,
                    checked: true
                }
            }

            return {
                ...item,
                checked: false
            }
        })

        setEngineerInfo(handleData)
    }

    const editEngineerInfo = (engineerInfo: any) => {
        setEditEngineerModalVisible(true)
        setCurrentClickEngineerInfo(engineerInfo)
    }

    const engineerTrElement = engineerInfo.map((item, index) => {
        let provinceValue = [
            item?.engineer.province,
            item?.engineer.city ? item?.engineer.city : (item?.engineer.province ? `${item?.engineer.province}_null` : undefined),
            item?.engineer.area ? item?.engineer.area : (item?.engineer.city ? `${item?.engineer.city}_null` : undefined)
        ];
        if (!item?.engineer.province) {
            provinceValue = []
        }

        if (index === 0) {
            return (
                <tr key={item.id}>
                    <td>
                        <Checkbox onChange={(checked) => checkboxChangeEvent(checked, index)} checked={item.checked} />
                    </td>
                    <td>
                        {item.engineer.name}
                    </td>
                    <td>
                        <Cascader style={{width: "100%"}} value={provinceValue} onChange={(value) => areaChangeEvent(value, index)} options={afterHandleData} />
                    </td>
                    <td>
                        <DataSelect style={{width: "100%"}} value={item.engineer.libId} onChange={(value) => libChangeEvent(value, index)} options={libSelectData} placeholder="-资源库-" />
                    </td>
                    <td>
                        <DataSelect style={{width: "100%"}} value={item.engineer.inventoryOverviewId} onChange={(value) => inventoryOverviewChange(value, index)} options={item.selectData.inventoryOverviewSelectData} placeholder="请先选择资源库" />
                    </td>
                    <td>
                        <DataSelect style={{width: "100%"}} value={item.engineer.warehouseId} onChange={(value) => wareHouseChangeEvent(value, index)} options={item.selectData.warehouseSelectData} placeholder="请先选择区域" />
                    </td>
                    <td>
                        <DataSelect style={{width: "100%"}} value={item.engineer.company} onChange={(value) => companyChangeEvent(value, index)} options={item.selectData.companySelectData} placeholder="请先选择区域" />
                    </td>
                    <td>
                        <Button type="text" onClick={() => editEngineerInfo({...item, index})}>编辑</Button>
                    </td>
                </tr>
            )
        }
        return (
            <tr key={item.id}>
                <td>
                    <Checkbox onChange={(checked) => checkboxChangeEvent(checked, index)} checked={item.checked} />
                </td>
                <td>
                    {item.engineer.name}
                </td>
                <td>
                    <Cascader style={{width: "100%"}} value={provinceValue} onChange={(value) => areaChangeEvent(value, index)} options={afterHandleData} placeholder="同上" />
                </td>
                <td>
                    <DataSelect style={{width: "100%"}} value={item.engineer.libId} onChange={(value) => libChangeEvent(value, index)} options={libSelectData} placeholder="同上" />
                </td>
                <td>
                    <DataSelect style={{width: "100%"}} value={item.engineer.inventoryOverviewId} onChange={(value) => inventoryOverviewChange(value, index)} options={item.selectData.inventoryOverviewSelectData} placeholder="同上" />
                </td>
                <td>
                    <DataSelect style={{width: "100%"}} value={item.engineer.warehouseId} onChange={(value) => wareHouseChangeEvent(value, index)} options={item.selectData.warehouseSelectData} placeholder="同上" />
                </td>
                <td>
                    <DataSelect style={{width: "100%"}} value={item.engineer.company} onChange={(value) => companyChangeEvent(value, index)} options={item.selectData.companySelectData} placeholder="同上" />
                </td>
                <td>
                    <Button type="text" onClick={() => editEngineerInfo({...item, index})}>编辑</Button>
                </td>
            </tr>
        )
    })

    const departmentChangeEvent = (value: any, numberIndex: number) => {
        const copyProjectInfo = cloneDeep(currentChooseEngineerInfo.projects);

        const handleData = copyProjectInfo.map((item: any, index: number) => {
            if (index === numberIndex) {
                return {
                    ...item,
                    powerSupply: value
                }
            }

            return item
        })

        const copyEngineerInfo = cloneDeep(engineerInfo);
        const handleEngineerData = copyEngineerInfo.map((item: any, index: number) => {
            if (item.checked) {
                return {
                    ...item,
                    projects: handleData
                }
            }
            return item
        })

        setCurrentChooseEngineerInfo({
            ...currentChooseEngineerInfo,
            projects: handleData
        })
        setEngineerInfo(handleEngineerData)
    }

    const projectTrElement = currentChooseEngineerInfo?.projects.map((item: any, index: number) => {
        if (index === 0) {
            return (
                <tr key={`${currentChooseEngineerInfo.id}_${index}`}>
                    <td>
                        {item.name}
                    </td>
                    <td>
                        <DataSelect style={{width: "100%"}} value={item.powerSupply} onChange={(value) => departmentChangeEvent(value, index)} options={currentChooseEngineerInfo.selectData.departmentSelectData} placeholder="部组" />
                    </td>
                    <td>
                        <Button type="text">编辑</Button>
                    </td>
                </tr>
            )
        }
        return (
            <tr key={`${currentChooseEngineerInfo.id}_${index}`}>
                <td>
                    {item.name}
                </td>
                <td>
                    <DataSelect style={{width: "100%"}} value={item.powerSupply} onChange={(value) => departmentChangeEvent(value, index)} options={currentChooseEngineerInfo.selectData.departmentSelectData} placeholder="同上" />
                </td>
                <td>
                    <Button type="text">编辑</Button>
                </td>
            </tr>
        )
    })

    const engineerFinishEditInfo = () => {

    }

    return (
        <div className={styles.batchEditEngineerInfoTable}>
            <div className={styles.batchEditEngineerTableContent}>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>工程名称</th>
                            <th>
                                区域
                            </th>
                            <th>
                                资源库
                            </th>
                            <th>
                                协议库
                            </th>
                            <th>
                                利旧协议库
                            </th>
                            <th>
                                所属公司
                            </th>
                            <th>
                                已录入信息
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            engineerTrElement
                        }
                    </tbody>
                </table>
            </div>
            <div className={styles.batchEditProjectTable}>
                <table>
                    <thead>
                        <tr>
                            <th>项目名称</th>
                            <th>
                                供电公司/班组
                            </th>
                            <th>
                                已录入信息
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectTrElement}
                    </tbody>
                </table>
            </div>
            {
                editEngineerModalVisible &&
                <EditBulkEngineer engineerInfo={currentClickEngineerInfo} finishEvent={engineerFinishEditInfo} visible={editEngineerModalVisible} onChange={setEditEngineerModalVisible} />
            }
        </div>
    )
}

export default BatchEditEngineerInfoTable