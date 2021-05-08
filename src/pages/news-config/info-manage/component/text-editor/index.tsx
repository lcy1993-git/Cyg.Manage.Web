import { Form, Input, Switch, TreeSelect } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import E from 'wangeditor';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import UrlSelect from '@/components/url-select';
import CyFormItem from '@/components/cy-form-item';
import { useRequest } from 'ahooks';
// import { getCompanyGroupTreeList } from '@/services/operation-config/company-group';
// @ts-ignore
import mammoth from 'mammoth';
import { getGroupInfo } from '@/services/project-management/all-project';
import uuid from 'node-uuid';

import pdfjs from 'pdfjs-dist';

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
              <label for="wangUploadFile" style="
                width: 40px;
                height: 40px;
                padding-top: 10px;
                cursor: pointer;
              "><i class="w-e-icon-upload2"></i></label>
              <input id="wangUploadFile" type="file" style="display:none" accept=".docx,.pdf" />
          </div>`,
    );

    super($elem, editor);

    this.$elem.elems[0].children[1].addEventListener('change', (e) => {
      this.readFile(this, e);
    });
  }

  readFile(newThat: any, event: any) {
    const that = newThat.editor;
    if (event.target.files[0] !== undefined) {
      const selectedFile = event.target.files[0];
      const reader = new FileReader();
      if (selectedFile.name.includes('.docx')) {
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = function (e) {
          //@ts-ignore
          const docEle = e.target.result;

          mammoth
            .convertToHtml({ arrayBuffer: docEle }, { includeDefaultStyleMap: true })
            .then((result: any) => {
              that.txt.append(result.value);
              // console.log(that.txt.html());
            })
            .catch((a: any) => {
              console.log('error', a);
            })
            .done();

          event.target.value = '';
        };
      } else {
        reader.readAsDataURL(selectedFile);
        reader.onload = function (e) {
          const res = e.target?.result;
          pdfjs
            .getDocument(res as string)
            .promise.then(async function (pdf: any) {
              const numPages = pdf.numPages;
              for (let i = 1; i <= numPages; i++) {
                await pdf.getPage(i).then(async function getPageHelloWorld(page: any) {
                  var scale = 2;
                  var viewport = page.getViewport(scale);
                  const canvas = document.createElement('canvas');
                  var context = canvas.getContext('2d');
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;
                  var renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                  };
                  await page.render(renderContext);
                  that.txt.append(
                    `<image style="width:100%;height:auto" src="${canvas.toDataURL(
                      'image/png',
                    )}"></image>`,
                  );
                  // console.log(that.txt.html());
                });
              }
            })
            .catch((err: any) => {
              console.log('文件读取失败');
            });
        };
        event.target.value = '';
      }
    }
  }

  tryChangeActive() {
    // 激活菜单
    // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
    // 2. this.this.isActive === true
    // this.active();
    // // 取消激活菜单
    // // 1. 菜单 DOM 节点会删掉 .w-e-active
    // 2. this.this.isActive === false
    // this.unActive()
  }
}

// }

const TextEditorModal: React.FC<EditorParams> = (props: any) => {
  const { onChange, titleForm, htmlContent, type } = props;
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [allIds, setAllIds] = useState<string[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);

  const { data: groupData = [] } = useRequest(() => getGroupInfo('-1'));
  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      key: uuid.v1(),
      children: data.children ? data.children.map(mapTreeData) : [],
    };
  };

  //获取当前列表全部用户id
  const getUserIds = (groupArray: any) => {
    (function deep(groupArray) {
      groupArray.forEach((item: any) => {
        if (item.children) {
          if (item.children?.length > 0) {
            deep(item.children);
          } else {
            allIds.push(item.id);
          }
        }
      });
    })(groupArray);
    return allIds;
  };

  const allUserIds = getUserIds(groupData);

  const handleData = useMemo(() => {
    const copyOptions = JSON.parse(JSON.stringify(groupData))?.map(mapTreeData);
    copyOptions.unshift({ title: '所有人', value: allUserIds, children: groupData });
    return copyOptions
      .map((item: any) => {
        return {
          title: item.title,
          value: item.value,
          children: item.children ? item.children.map(mapTreeData) : [],
        };
      })
      .slice(0, 1);
  }, [JSON.stringify(groupData)]);

  // const parentIds = handleData?.map((item: any) => {
  //   return item.key;
  // });

  // const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(parentIds);

  if (type === 'add') {
    useEffect(() => {
      const menuKey = 'alertMenuKey';

      E.registerMenu(menuKey, AlertMenu);

      const editor = new E('#div1');
      editor.config.uploadImgShowBase64 = true;
      editor.config.showLinkImg = false;
      // editor.config.menus = ['bold', 'head', 'link', 'italic', 'underline'];
      // editor.config.uploadImgServer = '/upload';
      //上传图片到服务器
      editor.config.uploadFileName = 'myFile'; //设置文件上传的参数名称
      // editor.config.uploadImgServer = '/upload'; //设置上传文件的服务器路径
      // editor.config.uploadImgMaxSize = 3 * 1024 * 1024; // 将图片大小限制为 3M

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

  //   const onExpand = (expandedKeysValue: React.Key[]) => {
  //   setExpandedKeys(expandedKeysValue);
  //   setAutoExpandParent(false);
  // };

  const hasCheckEvent = (checkedValue: string[]) => {
    setUserIds(checkedValue);
  };

  console.log(userIds);

  return (
    <>
      <Form form={titleForm}>
        <CyFormItem label="标题" name="title" required labelWidth={60}>
          <Input placeholder="标题" />
        </CyFormItem>

        <CyFormItem label="状态" name="isEnable" required labelWidth={60}>
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
        <CyFormItem label="对象" name="userIds" required labelWidth={60}>
          <TreeSelect
            placeholder="请选择对象"
            treeCheckable
            treeData={handleData}
            // showCheckedStrategy="SHOW_PARENT"
            treeDefaultExpandAll
            onChange={hasCheckEvent}
          />
        </CyFormItem>
        <CyFormItem label="端口" labelWidth={60} name="clientCategorys" required>
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
      </Form>
      <CyFormItem name="content" label="内容" required labelWidth={60}>
        <div id="div1"></div>
      </CyFormItem>
    </>
  );
};

export default TextEditorModal;
