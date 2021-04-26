import { Form, Input, Switch, TreeSelect, Upload } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import E from 'wangeditor';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import UrlSelect from '@/components/url-select';
import CyFormItem from '@/components/cy-form-item';
import { useRequest } from 'ahooks';
import { getCompanyGroupTreeList } from '@/services/operation-config/company-group';
import FileUpload from '@/components/file-upload';
// import uuid from 'node-uuid';
// import createPanelConf, {
//   ImgPanelConf,
// } from '../../../../../../node_modules/wangeditor/src/menus/img/create-panel-conf';

interface EditorParams {
  onChange: Dispatch<SetStateAction<string>>;
  titleForm: any;
  htmlContent?: string;
  type: 'edit' | 'add';
}

const { BtnMenu } = E;
class AlertMenu extends BtnMenu {
  constructor(editor: any) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    let $elem = E.$(
      `<div class="w-e-menu" data-title="附件">
              <label for="wangUploadFile"><i class="w-e-icon-upload2"></i></label>
              <input id="wangUploadFile" type="file" style="display:none" />
          </div>`,
    );

    super($elem, editor);
    // const filePanelConfig = createPanelConf(editor)
  }
  // 菜单点击事件
  clickHandler() {
    document.execCommand('Open');
    this.editor.txt.append('<p>追加的内容</p>');
    // 做任何你想做的事情
    // 可参考【常用 API】文档，来操作编辑器
  }
  // 菜单是否被激活（如果不需要，这个函数可以空着）
  // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
  // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态

  tryChangeActive() {
    // 激活菜单
    // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
    // 2. this.this.isActive === true
    this.active();
    // // 取消激活菜单
    // // 1. 菜单 DOM 节点会删掉 .w-e-active
    // 2. this.this.isActive === false
    // this.unActive()
  }
}

const TextEditorModal: React.FC<EditorParams> = (props: any) => {
  const { onChange, titleForm, htmlContent, type } = props;
  const [isChecked, setIsChecked] = useState<boolean>(true);

  const { data: groupData = [] } = useRequest(() => getCompanyGroupTreeList());

  const mapTreeData = (data: any) => {
    return {
      title: data.name,
      value: data.id,
      // key: uuid.v1(),

      children: data.children?.map(mapTreeData),
    };
  };

  const handleData = useMemo(() => {
    const copyOptions = JSON.parse(JSON.stringify(groupData))?.map(mapTreeData);
    copyOptions.unshift({ title: '所有人', value: '0', children: null });
    return copyOptions.map((item: any) => {
      return {
        title: item.title,
        value: item.value,
        children: item.children,
      };
    });
  }, [JSON.stringify(groupData)]);

  if (type === 'add') {
    useEffect(() => {
      const menuKey = 'alertMenuKey';

      E.registerMenu(menuKey, AlertMenu);

      const editor = new E('#div1');
      editor.config.uploadImgShowBase64 = true;
      editor.config.showLinkImg = false;
      // editor.config.uploadImgServer = '/upload';
      //上传图片到服务器
      editor.config.uploadFileName = 'myFile'; //设置文件上传的参数名称
      // editor.config.uploadImgServer = '/upload'; //设置上传文件的服务器路径
      // editor.config.uploadImgMaxSize = 3 * 1024 * 1024; // 将图片大小限制为 3M
      //自定义上传图片事件
      editor.config.uploadImgHooks = {
        before: function (xhr, editor, files) {},
        success: function (xhr, editor, result) {
          console.log('上传成功');
        },
        fail: function (xhr, editor, result) {
          console.log('上传失败,原因是' + result);
        },
        error: function (xhr, editor) {
          console.log('上传出错');
        },
        timeout: function (xhr, editor) {
          console.log('上传超时');
        },
        customInsert: function (insertImgFn, result) {
          // result 即服务端返回的接口
          console.log('customInsert', result);

          // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
          // insertImgFn(result.data[0])
        },
      };

      editor.config.onchange = (newHtml: string) => {
        onChange(newHtml);
      };
      editor.create();
      return () => {
        editor.destroy();
      };
    }, []);
  }

  if (type === 'edit') {
    useEffect(() => {
      const editor = new E('#div1');
      editor.config.uploadImgShowBase64 = true;
      editor.config.showLinkImg = false;
      editor.config.onchange = (newHtml: string) => {
        onChange(newHtml);
      };
      editor.create();

      editor.txt.html(htmlContent);

      return () => {
        editor.destroy();
      };
    }, []);
  }

  return (
    <>
      <Form form={titleForm}>
        <CyFormItem label="标题" name="title" required labelWidth={60}>
          <Input placeholder="标题" />
        </CyFormItem>
      </Form>
      <CyFormItem label="状态" name="status" required labelWidth={60}>
        <Switch onChange={() => setIsChecked(!isChecked)} defaultChecked />
        {isChecked ? (
          <span className="ml10" style={{ color: '#2e815c' }}>
            启用
          </span>
        ) : (
          <span className="ml10" style={{ color: '#8c8c8c' }}>
            禁用
          </span>
        )}
      </CyFormItem>
      <CyFormItem label="对象" name="user" required labelWidth={60}>
        <TreeSelect
          placeholder="请选择对象"
          treeCheckable
          treeData={handleData}
          showCheckedStrategy="SHOW_PARENT"
          treeDefaultExpandAll
        />
      </CyFormItem>
      <CyFormItem label="端口" labelWidth={60} name="duankou" required>
        <UrlSelect
          mode="multiple"
          requestSource="project"
          showSearch
          url="/CompanyUser/GetClientCategorys"
          titleKey="text"
          valueKey="value"
          placeholder="请选择授权端口"
        />
      </CyFormItem>
      <CyFormItem name="content" label="内容" required labelWidth={60}>
        {/* <button style={{ marginBottom: '5px' }}> */}
        <FileUpload>添加附件</FileUpload>
        {/* </button> */}
        <div id="div1"></div>
      </CyFormItem>
    </>
  );
};

export default TextEditorModal;
