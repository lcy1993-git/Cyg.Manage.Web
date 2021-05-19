import { Form, Input, TreeSelect } from 'antd';
import React, { useEffect, useMemo } from 'react';
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
import FormSwitch from '@/components/form-switch';
import { getClientCategorys } from '@/services/personnel-config/company-user';

interface EditorParams {
  onChange: Dispatch<SetStateAction<string>>;
  titleForm: any;
  htmlContent?: string;
  type?: 'edit' | 'add';
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
              let pdfHtml = "";
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
                  pdfHtml += `<image style="width:100%;height:auto" src="${canvas.toDataURL(
                    'image/png',
                  )}"></image>`
                  // console.log(that.txt.html());
                });
                that.txt.append(pdfHtml);
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
}

// }

const TextEditorModal = (props: EditorParams) => {
  const { onChange, titleForm, htmlContent } = props;

  const { data: groupData = [] } = useRequest(() => getGroupInfo('-1'));
  const { data } = useRequest(() => getClientCategorys(), {});

  const categoryData = useMemo(() => {
    if (data) {
      return data
        .map((item: any) => {
          if (item.value === 4 || item.value === 8) {
            return {
              value: item.value,
              text: item.text,
            };
          }
          return;
        })
        .filter(Boolean);
    }
    return;
  }, [data]);

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
    let allIds: any[] = [];
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

  // useEffect(() => {

  //   const menuKey = 'alertMenuKey';

  //   E.registerMenu(menuKey, AlertMenu);
  //   const editor = new E('#div1');
  //   editor.config.uploadImgShowBase64 = true;
  //   editor.config.showLinkImg = false;
  //   // editor.config.menus = ['bold', 'head', 'link', 'italic', 'underline'];
  //   // editor.config.uploadImgServer = '/upload';
  //   //上传图片到服务器
  //   editor.config.uploadFileName = 'myFile'; //设置文件上传的参数名称
  //   // editor.config.uploadImgServer = '/upload'; //设置上传文件的服务器路径
  //   // editor.config.uploadImgMaxSize = 3 * 1024 * 1024; // 将图片大小限制为 3M

  //   editor.config.onchange = (newHtml: string) => {
  //     onChange(newHtml);
  //   };
  //   editor.create();

  //   return () => {
  //     editor.destroy();
  //   };

  // }, []);

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
    editor.config.onchange = (newHtml: string) => {
      onChange(newHtml);
    };
    editor.create();
    editor.txt.html(htmlContent);
    onChange(htmlContent!);

    return () => {
      editor.destroy();
    };
  }, [htmlContent]);

  return (
    <>
      <Form form={titleForm}>
        <CyFormItem label="标题" name="title" required labelWidth={60}>
          <Input placeholder="标题" />
        </CyFormItem>

        <CyFormItem label="状态" name="isEnable" required labelWidth={60}>
          {/* <Switch checked={isChecked} onChange={() => setIsChecked(!isChecked)} /> */}
          <FormSwitch />
        </CyFormItem>
        <CyFormItem label="对象" name="userIds" required labelWidth={60}>
          <TreeSelect
            placeholder="请选择对象"
            treeCheckable
            treeData={handleData}
            treeDefaultExpandAll
          />
        </CyFormItem>
        <CyFormItem label="端口" labelWidth={60} name="clientCategorys" required>
          <UrlSelect
            mode="multiple"
            requestSource="project"
            showSearch
            defaultData={categoryData}
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
