import FileDocxView from './componnents/file-docx-view';
import FileXlsxView from './componnents/file-excel-view';

import type { FileDocxViewProps } from './componnents/file-docx-view';
import type { FileXlsxViewProps } from './componnents/file-xlsx-view';

export type FileType = 'xlsx' | 'docx' | 'dwg' | 'pdf' | 'png' | 'doc' | 'xls';

const context = new Map<FileType, React.FC<FileDocxViewProps | FileXlsxViewProps>>();

context.set('docx', FileDocxView);
context.set('xlsx', FileXlsxView);

const getStrategyComponent = (type: FileType) => {
  return context.get(type);
};

export { getStrategyComponent as default };
