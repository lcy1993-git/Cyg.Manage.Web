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
    project: "/project/api",
    common: "/common/api",
    upload: "/upload/api",
    resource: "/resource/api"
}

export const requestBaseUrl = ipArray.includes(thisHostName) ? arrayHasIpBaseUrlArray : arrayHasNotBaseUrlArray;

export const explainUrl = "http://service.pwcloud.cdsrth.com:8200/management";

export const visualUrl = `${baseUrl}:8021/index.html`;

export const areaStatisticsUrl = `${baseUrl}:8029/index.html`;