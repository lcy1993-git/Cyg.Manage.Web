import { parseInt } from "lodash";
import {
  grooveEnum,
  getMatrixData,
  getGrooveData,
  pipeMode5,
  pipeJacking
} from './canvasData';

interface DataOptions {
  x: number;
  y: number;
  r: number;
  stroke?: string;
  fill?: string;
  lineWidth?: number;
}

const sortDataByRowCol = (data: any[]) => {
  if (Array.isArray(data)) {

    const res = data.map(v => ({ ...v, sortId: v.row * 10 + v.col }))
      .sort((a, b) => a.sortId - b.sortId);

    return res;
  } else {
    return []
  }
}

const simpleMixIn = (org, resRedData) => {

  if (Array.isArray(org)) {
    return org.map((item, index) => {

      if (resRedData[index]?.usageState === 1) {
        item.fill = "green"
      } else if (resRedData[index]?.usageState === 2) {
        item.fill = "gray"
      }
      else if (resRedData[index]?.usageState === 3) {
        item.fill = "#fff"
      } else {
        item.fill = "rgba(0,0,0,0)"
      }
      return item;
    })
  } else {
    return []
  }

}

const mixInArray = (org: any[], sortData: any[], layMode: number, row: number) => {
  let redData1;
  let redData2;
  switch (layMode) {
    case 2:
      const sortDataClone = JSON.parse(JSON.stringify(sortData.filter((item => item.col !== 0))));
      redData1 = sortData.findIndex((item) => item.row === 1 && item.col === 0)
      redData2 = sortData.findIndex((item) => item.row === 0 && item.col === 0)

      const resRedData = [...sortDataClone, redData1[0], redData2[0]];

      return org.map((item, index) => {

        if (resRedData[index]?.usageState === 1) {
          item.fill = "green"
        } else if (resRedData[index]?.usageState === 2) {
          item.fill = "gray"
        }
        else if (resRedData[index]?.usageState === 3) {
          item.fill = "#fff"
        } else {
          item.fill = "rgba(0,0,0,0)"
        }
        return item
      })
      break;
    case 4:
      break;
    case 6:
      break;

    default:
      break;
  }

  return []

}

const drawCircular = (data: DataOptions[], ctx: CanvasRenderingContext2D, otherData: any[] | undefined = undefined) => {
  
  if (!ctx) return;
  data.forEach((item) => {
    if(!item) return;
    const {
      x,
      y,
      r,
      stroke,
      fill,
      lineWidth
    } = item;
    ctx.beginPath();
    ctx.lineWidth = .5;
    if (stroke) {
      ctx.strokeStyle = stroke;
    } else {
      ctx.strokeStyle = '#000';
    }
    // ctx.strokeStyle = "#0f0";

    if (fill) {
      ctx.fillStyle = fill;
    } else {
      ctx.fillStyle = '#fff'
    }
    // ctx.fillStyle = "#0f0";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  });

  if (otherData && Array.isArray(otherData)) {
    otherData.forEach((item: any) => {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(item.start[0], item.start[1]);
      ctx.lineTo(item.end[0], item.end[1]);
      if (item.stroke) {
        ctx.strokeStyle = item.stroke;
      }
      ctx.stroke();
      ctx.closePath();
    })
  }
};

export const initCtx = (ctx: CanvasRenderingContext2D, data: any, layMode: number, arrangement: string | null, title: string) => {
  
  const sortData = sortDataByRowCol(data)

  switch (layMode) {
    case 1:
      
      if (arrangement && typeof arrangement === 'string') {
        const getArray = getMatrixData(parseInt(arrangement[0]), parseInt(arrangement[2]), false);
        
        drawCircular(simpleMixIn(getArray, sortData), ctx)
      }
      break;
    case 2:
      if (arrangement && typeof arrangement === 'string') {
        const getArray = getMatrixData(parseInt(arrangement[0]), parseInt(arrangement[2]), true);

        // const res = mixInArray(getArray, sortData, layMode, parseInt(arrangement[0])) ?? [];

        drawCircular(simpleMixIn(getArray, sortData), ctx)
      }
      break;
    case 3:
      let type3Org: any[] = [];
      let type3Line: any[] = [];
      if (title.includes("1200")) {
        type3Org = pipeJacking.type1200
      } else if (title.includes("1500")) {
        type3Org = pipeJacking.type1500
      } else if (title.includes("2200")) {
        [type3Org, type3Line] = pipeJacking.type2200();
      } else if (title.includes("2400")) {
        [type3Org, type3Line] = pipeJacking.type2400();
      } else if (title.includes("2600")) {
        [type3Org, type3Line] = pipeJacking.type2600();
      }
      console.log(simpleMixIn(type3Org, sortData));
      
      drawCircular(simpleMixIn(type3Org, sortData), ctx, type3Line)
      break;
    case 4:
      const sign = title[0];

      drawCircular(simpleMixIn(pipeMode5?.["type" + sign], sortData), ctx)
      break;
    case 5:
      const enumText = title.split("mm")[0];
      const [a, b] = enumText.split("×")
      
      const mode5RowCol = grooveEnum?.["t" + a + b];
      console.log(enumText);
      console.log(grooveEnum);
      
      const type5Data = getGrooveData(mode5RowCol.row, mode5RowCol.col, title.includes("双"));

      drawCircular(simpleMixIn(type5Data[0], sortData), ctx, type5Data[1])
      break;
    case 6:

      switch (title) {
        case "1.65×2.1m单侧支架布置电缆隧道":
        case "1.65×2.3m单侧支架布置暗挖电缆隧道":
          
          const res61 = getGrooveData(6, 4);
          
          drawCircular(simpleMixIn(res61[0], sortData), ctx, res61[1])
          break;
        case "2.0×2.1m双侧支架布置电缆隧道":
        case "2.0×2.3m双侧支架布置暗挖电缆隧道":
          
          const res62 = getGrooveData(6, 3, true);
          drawCircular(simpleMixIn(res62[0], sortData), ctx, res62[1])
          break;
        default:
          console.log("out");
          
          break;
      }
      break;
    default:
      break;
  }
}