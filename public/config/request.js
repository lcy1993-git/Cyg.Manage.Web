// 36
//const baseUrl = "http://10.6.1.36";

// 38
//const baseUrl = "http://171.223.214.154";

// 39
//const baseUrl = "http://39.99.251.67";

// 47
//const baseUrl = "http://47.108.63.23";

// 如果数组里面包含这个ip,那么就代表是IIS部署的，就直接用url + 端口去访问。  如果没包含，代表是nginx部署，那么就用代理

const ipArray = ["10.6.1.36","10.6.1.37","171.223.214.154","47.108.63.23","39.99.251.67","10.6.1.38"];

const thisHostName = window.location.hostname;

const baseUrl = `${document.location.protocol}//${window.location.hostname}`;

const arrayHasIpBaseUrlArray = {
    project: `${baseUrl}:8026/api`,
    common: `${baseUrl}:8022/api`,
    upload: `${baseUrl}:8023/api`,
    resource: `${baseUrl}:8020/api`
}

const arrayHasNotBaseUrlArray = {
    project: "/manage/v2/api",
    common: "/common/api",
    upload: "/storage/api",
    resource: "/resourcemanage/v2/api"
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

const mapConfig = {
    "10.6.1.36": {areaId: "620000", mapName: "gansu"},
    "10.6.1.37": {areaId: "650000", mapName: "xinjiang"},
    "10.6.1.38": {areaId: "640000", mapName: "ningxia"},
    "171.223.214.154": {areaId: "640000", mapName: "ningxia"},
    "218.6.242.125": {areaId: "510000", mapName: "sichuan"},
    "39.99.251.67": {areaId: "650000", mapName: "xinjiang"},
    "47.108.63.23": {areaId: "650000", mapName: "xinjiang"},
}
// 默认是新疆
export const mapInfo = mapConfig[thisHostName] ? mapConfig[thisHostName] : {areaId: "650000", mapName: "xinjiang"};

export const requestBaseUrl = ipArray.includes(thisHostName) ? arrayHasIpBaseUrlArray : arrayHasNotBaseUrlArray;

export const explainUrl = "http://service.pwcloud.cdsrth.com:8200/management";

export const visualUrl = ipArray.includes(thisHostName) ? `${baseUrl}:8021/index.html` : `${baseUrl}/webgis/index.html`;

export const areaStatisticsUrl = ipArray.includes(thisHostName) ? `${baseUrl}:8029/index.html` : `${baseUrl}/chart/index.html`;

export const serverCodeArray = {
    "localhost":"10.6.1.36",
    "218.6.242.125":"218.6.242.125", 
    "10.6.1.36":"10.6.1.36",
    "10.6.1.37":"10.6.1.37",
    "171.223.214.154":"171.223.214.154",
    "47.108.63.23":"47.108.63.23",
    "39.99.251.67":"39.99.251.67",
    "10.6.1.38":"10.6.1.38"
}

export const version = "1.0.28";