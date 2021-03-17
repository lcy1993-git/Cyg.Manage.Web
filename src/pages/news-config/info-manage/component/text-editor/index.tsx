import { Form, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import Editors from 'wangeditor';

// interface EditorParams {
//   editorForm: any;
// }

const TextEditorModal: React.FC = () => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const editor = new Editors('#div1');
    editor.config.uploadImgShowBase64 = true;
    editor.config.showLinkImg = false;

    editor.config.onchange = (newHtml: string) => {
      // const textData = editor.txt.html();
      setContent(newHtml);
    };

    editor.create();

    return () => {
      editor.destroy();
    };
  }, []);

  const getHtml = () => {
    console.log(content);
  };
  getHtml();

  return (
    <Form>
      <Form.Item style={{ display: 'block' }} label="标题" name="title" required>
        <Input placeholder="标题" />
      </Form.Item>
      <Form.Item style={{ display: 'block' }} name="content" label="内容" required>
        <div id="div1"></div>
      </Form.Item>
    </Form>
  );
};

export default TextEditorModal;
