import React, { memo, useEffect } from "react";

interface ChartBoxLineProps {
    align: "left" | 'center'
    width: number
    tltleWidthLevel?: "normal" | "big"
}

const ChartBoxLine: React.FC<ChartBoxLineProps> = (props) => {
    const { align, width = 500, tltleWidthLevel = "normal" } = props;
    const divRef = React.useRef<HTMLCanvasElement>(null);

    const initLine = () => {
        if (divRef && divRef.current) {
            const canvas = divRef.current;
            const context = divRef.current.getContext("2d");

            if (context) {
                let [firstLineX, secondLineX, threeLineX, fourLineX, fiveLineX] = [0, 0, 0, 0, 0]
                context.lineWidth = 2;
                context.beginPath();//开始绘制线条，若不使用beginPath，则不能绘制多条线条
                if (align === "center") {
                    firstLineX = canvas.width * 0.335;
                    secondLineX = canvas.width * 0.355;
                    threeLineX = canvas.width * 0.645;
                    fourLineX = canvas.width * 0.665;
                    fiveLineX = canvas.width;

                    context.moveTo(0, 5.5);//线条开始位置
                    context.lineTo(firstLineX, 5.5);//线条经过点
                    context.lineTo(secondLineX, 0);
                    context.lineTo(threeLineX, 0);
                    context.lineTo(fourLineX, 5.5);
                    context.lineTo(fiveLineX, 5.5);
                    context.strokeStyle = "#18A360";
                    context.stroke();
                } else {
                    if (tltleWidthLevel === "normal") {
                        firstLineX = canvas.width * 0.010;
                        secondLineX = canvas.width * 0.190;
                        threeLineX = canvas.width * 0.200;
                        fourLineX = canvas.width;

                        context.moveTo(0, 5.5);//线条开始位置
                        context.lineTo(firstLineX, 0);//线条经过点
                        context.lineTo(secondLineX, 0);
                        context.lineTo(threeLineX, 5.5);
                        context.lineTo(fourLineX, 5.5);
                    }else {
                        firstLineX = canvas.width * 0.010;
                        secondLineX = canvas.width * 0.390;
                        threeLineX = canvas.width * 0.400;
                        fourLineX = canvas.width;

                        context.moveTo(0, 5.5);//线条开始位置
                        context.lineTo(firstLineX, 0);//线条经过点
                        context.lineTo(secondLineX, 0);
                        context.lineTo(threeLineX, 5.5);
                        context.lineTo(fourLineX, 5.5);
                    }
                }
                context.strokeStyle = "#18A360";
                context.stroke();
            }
        }
    }

    useEffect(() => {
        if (width) {
            initLine();
        }
    }, [width])

    return (
        <canvas ref={divRef} width={width} height={7}></canvas>
    )
}

export default memo(ChartBoxLine)