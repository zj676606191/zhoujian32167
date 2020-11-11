//该代码本质是对类似window.addEventListener（"orientationchange"，function（）{
(function(doc, win) {
	var docEl = doc.documentElement,
        //如果当前浏览器支持orientationchange，则使用orientationchange来调整屏幕尺寸，否则使用resize来调整
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			var clientWidth = docEl.clientWidth;
			if(!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 375) + 'px'; //根据屏幕的宽度进行等比例调整
		};
 
	if(!doc.addEventListener) return; //如果不支持监听则终止函数
	win.addEventListener(resizeEvt, recalc, false);  //第一个参数是事件的类型 (如 "click" 或 "mousedown").第二个参数是事件触发后调用的函数。第三个参数是个布尔值用于描述事件是冒泡还是捕获。该参数是可选的。true - 事件句柄在捕获阶段执行。false- 默认。事件句柄在冒泡阶段执行
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);