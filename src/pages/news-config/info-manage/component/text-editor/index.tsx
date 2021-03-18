import { Form, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import Editors from 'wangeditor';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

interface EditorParams {
  onChange: Dispatch<SetStateAction<string>>;
  titleForm: any;
  htmlContent?: string;
  type: 'edit' | 'add';
}

const TextEditorModal: React.FC<EditorParams> = (props: any) => {
  const { onChange, titleForm, htmlContent, type } = props;

  if (type === 'add') {
    useEffect(() => {
      const editor = new Editors('#div1');
      editor.config.uploadImgShowBase64 = true;
      editor.config.showLinkImg = false;
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
      const editor = new Editors('#div1');
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
        <Form.Item style={{ display: 'block' }} label="标题" name="title" required>
          <Input placeholder="标题" />
        </Form.Item>
      </Form>

      <Form.Item style={{ display: 'block' }} name="content" label="内容" required>
        <div id="div1"></div>
      </Form.Item>
    </>
  );
};

export default TextEditorModal;
