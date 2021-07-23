// 36
//const baseUrl = "http://10.6.1.36";

// 38
//const baseUrl = "http://171.223.214.154";

// 39
//const baseUrl = "http://39.99.251.67";

// 47
//const baseUrl = "http://47.108.63.23";

// 如果数组里面包含这个ip,那么就代表是IIS部署的，就直接用url + 端口去访问。  如果没包含，代表是nginx部署，那么就用代理

export const ipArray = [];

const thisHostName = window.location.hostname;

const baseUrl = `${document.location.protocol}//${window.location.hostname}`;

const arrayHasIpBaseUrlArray = {
    project: `${baseUrl}:8026/api`,
    common: `${baseUrl}:8022/api`,
    upload: `${baseUrl}:8023/api`,
    resource: `${baseUrl}:8020/api`,
    comment: `${baseUrl}:8013/api`,
    tecEco: `${baseUrl}:8033/api`,
    tecEco1: `${baseUrl}:8080/api`,
    review: `${baseUrl}:8041/api`,

    webGis: `${baseUrl}:8021/api`,
    // webGis
    resourceV1: `${baseUrl}:8015/api`,
    manage: `${baseUrl}:8025/api`,
    webGis5: `${baseUrl}:8032/api`,
    geoserver: `${baseUrl}:8099`,
    ModulesDetails: `${baseUrl}:8020/api`,
    design: `${baseUrl}:8014/api`,
}

const arrayHasNotBaseUrlArray = {
    project: "/manage/v2/api",
    common: "/common/api",
    upload: "/storage/api",
    resource: "/resourcemanage/v2/api",
    webGis: '/webgis/api',
    webGis2: '/webGis2/api',
    comment: '/project/api',
    tecEco: '/quato/api',
    tecEco1: '/technicalEconomy/api',
    review: "/review/api",
    component: '/Component/api',
    material: '/Material/api/',
    resourceV1: '/resource/api',
    manage: '/manage/api',
    geoserver: '/geoserver',
    design: '/design/api',
}

export const logoArray = {
    "218.6.242.125": "ke-rui-logo.png",
    "10.6.1.36": "ke-rui-logo.png",
    "10.6.1.37": "logo.png",
    "171.223.214.154": "logo.png",
    "47.108.63.23": "logo.png",
    "39.99.251.67": "logo.png",
    "10.6.1.38": "logo.png",
}

export const requestBaseUrl = ipArray.includes(thisHostName) ? arrayHasIpBaseUrlArray : arrayHasNotBaseUrlArray;

export const explainUrl = "http://service.pwcloud.cdsrth.com:8200/management";

export const visualUrl = ipArray.includes(thisHostName) ? `${baseUrl}:8021/index.html` : `${baseUrl}/webgis/index.html`;

export const areaStatisticsUrl = ipArray.includes(thisHostName) ? `${baseUrl}:8029/index.html` : `${baseUrl}:${window.location.port}/chart/index.html`;

export const serverCodeArray = {hostName:`${thisHostName}`}

export const version = "1.0.85";

