## 深瑞同华组件说明文档

### 1. annular-figure 组件
#### 首页用环状图组件 

```
// @params options是环状图的配置
<AnnularFigure options={options} />
```

### 2. authortiy-export-item
#### 导出系统的基本权限

```
// @params exportUrl 导出权限的url
// @params extraParams  导出需要的额外的参数
// @params fileName 自定义导出文件的名称
<ExportAuthorityButton />

```


### 3. bar-chart
#### 柱状图带自动监听大小

```
@params options 代表barChart的配置
<BarChart options={options} />
```

### 4. checkbox-tree-table

#### 根据树状数据生成一个checkbox树，主要用于分配授权功能

```
@params treeData 分配授权的树状数据
@params onChange 用于表单直接获取到组件的内部勾选值的变化
<CheckboxTreeTable treeData={treeData} onChange={onChange}>
```

### 5. common-title

#### 常用的title组件，带一个绿色前缀方块的那个
```

<CommonTitle>公用title</CommonTitle>
```

