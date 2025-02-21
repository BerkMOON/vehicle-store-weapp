import Taro from "@tarojs/taro";
import { View, Canvas } from "@tarojs/components";
import { Input, Button } from "@nutui/nutui-react-taro";
import { useState, useEffect } from "react";
// 画随机线函数
function drawline(canvas, context) {
  // 随机线的起点x坐标是画布x坐标0位置，y坐标是画布高度的随机数
  context.moveTo(
    Math.floor(Math.random() * canvas.width),
    Math.floor(Math.random() * canvas.height)
  );
  // 随机线的终点x坐标是画布宽度，y坐标是画布高度的随机数
  context.lineTo(
    Math.floor(Math.random() * canvas.width),
    Math.floor(Math.random() * canvas.height)
  );
  // 线条的款
  context.lineWidth = 0.5;
  // 线条的描边属性：颜色透明度
  context.strokeStyle = "rgba(50,50,50,0.3)";
  // 在画布上画线
  context.stroke();
}

// 画随机点函数
function drawDot(canvas, context) {
  let px = Math.floor(Math.random() * canvas.width),
    py = Math.floor(Math.random() * canvas.height);
  context.moveTo(px, py);
  context.lineTo(px + 1, py + 1);
  context.lineWidth = 0.1;
  context.stroke();
}

const Captcha = () => {
  const [text, setText] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    drawCaptcha();
  }, []);

  const drawCaptcha = () => {
    const nums = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      // "A",
      // "B",
      // "C",
      // "D",
      // "E",
      // "F",
      // "G",
      // "H",
      // "I",
      // "J",
      // "K",
      // "L",
      // "M",
      // "N",
      // "P",
      // "Q",
      // "R",
      // "S",
      // "T",
      // "U",
      // "V",
      // "W",
      // "X",
      // "Y",
      // "Z",
      // "a",
      // "b",
      // "c",
      // "d",
      // "e",
      // "f",
      // "g",
      // "h",
      // "i",
      // "j",
      // "k",
      // "l",
      // "m",
      // "n",
      // "p",
      // "q",
      // "r",
      // "s",
      // "t",
      // "u",
      // "v",
      // "w",
      // "x",
      // "y",
      // "z",
    ];

    // 创建 canvas 画布,并设置宽高
    const context = Taro.createCanvasContext("myCanvas");

    // canvas.width = 98;
    // canvas.height = 45;
    const canvas = {
      width: 98,
      height: 45,
    };
    // 画布填充色
    context.setFillStyle("#00BEFD");
    // 清空画布
    context.fillRect(0, 0, canvas.width, canvas.height);
    // 设置字体颜色
    context.fillStyle = "white";
    // 设置字体
    context.font = "25px Microsoft YaHei";

    const rand: string[] = [],
      x: number[] = [],
      y: number[] = [];
    // 绘制校验码到画布上
    for (let i = 0; i < 4; i++) {
      rand.push(rand[i]);
      rand[i] = nums[Math.floor(Math.random() * nums.length)];
      x[i] = i * 20 + 10;
      y[i] = Math.random() * 20 + 20;
      context.fillText(rand[i], x[i], y[i]);
    }

    // 画2条随机线,可以根据需要增减，画随机线主要是为了提高识别难度，防范机器识别
    for (let i = 0; i < 2; i++) {
      drawline(canvas, context);
    }

    // 画20个随机点，随机点的意义同随即线
    for (let i = 0; i < 20; i++) {
      drawDot(canvas, context);
    }
    context.draw();
    const currentText = rand.join("").toUpperCase();
    setText(currentText);
    console.log("res", currentText);
  };

  const validateCode = () => {
    if (value.toUpperCase() === text) {
      console.log("正确");
    } else {
      console.log("错误");
    }
  };

  return (
    <View>
      <Canvas
        id="myCanvas"
        canvasId="myCanvas"
        style="width: 100px; height: 50px;"
      />
      <span onClick={drawCaptcha}>看不清换一张</span>
      <Input
        cursorSpacing={100}
        placeholder="输入验证码"
        value={value}
        onChange={(value) => setValue(value)}
      />
      <Button onClick={validateCode}>验证</Button>
    </View>
  );
};

export default Captcha;

