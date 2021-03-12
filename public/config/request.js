// 36
//const baseUrl = "http://10.6.1.36";

// 38
//const baseUrl = "http://171.223.214.154";

// 39
//const baseUrl = "http://39.99.251.67";

// 47
//const baseUrl = "http://47.108.63.23";

const baseUrl = `${document.location.protocol}//${window.location.hostname}`;

export const requestBaseUrl = {
    project: `${baseUrl}:8026/api`,
    common: `${baseUrl}:8022/api`,
    upload: `${baseUrl}:8023/api`,
    resource: `${baseUrl}:8020/api`
}

export const explainUrl = "http://service.pwcloud.cdsrth.com:8200/management";


export const visualUrl = `${baseUrl}:8021/index.html`;

export const areaStatisticsUrl = `${baseUrl}:8029/index.html`;