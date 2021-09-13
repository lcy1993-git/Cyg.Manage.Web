import React from "react"

// @ts-ignore
import mammoth from 'mammoth';
import { useMount } from "ahooks";

interface DocxFileViewerProps {
    filePath: string,
    onSuccess?: () => void
}

const DocxFileViewer: React.FC<DocxFileViewerProps> = (props) => {
    const { filePath, onSuccess } = props;

    const loadFile = () => {
        const jsonFile = new XMLHttpRequest();
        jsonFile.open('GET', filePath, true);
        jsonFile.send();
        jsonFile.responseType = 'arraybuffer';
        jsonFile.onreadystatechange = () => {
            if (jsonFile.readyState === 4 && jsonFile.status === 200) {
                mammoth.convertToHtml(
                    { arrayBuffer: jsonFile.response },
                    { includeDefaultStyleMap: true },
                )
                    .then((result: any) => {

                        const docEl = document.createElement('div');
                        docEl.id = 'docxContainer';

                        docEl.innerHTML = result.value;
                        if (document.getElementById('docx') !== null) {
                            document.getElementById('docx')!.innerHTML = docEl.outerHTML;
                        }
                        onSuccess?.();
                    })
                    .catch((a: any) => {
                        console.log('alexei: something went wrong', a);
                    })
                    .done();
            }
        };
    }

    useMount(() => {
        loadFile();
    })

    return (
        <div id="docx">

        </div>
    )
}

export default DocxFileViewer
