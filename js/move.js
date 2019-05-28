/**
 * 获取某个属性的值
 * @param {Object} elem 当前元素
 * @param {String} attr 属性
 */
function getStyle(elem, attr) {
    if (window.getComputedStyle) {
      return window.getComputedStyle(elem, null)[attr];
    } else {
      return elem.currentStyle[attr];
    }
  }
  
  /**
   * 缓冲运动函数
   * @param {Object}   elem 当前元素
   * @param {Object}   json 要操作的属性 // 传透明度属性时，范围是0-100
   * @param {Function} fn   回调函数
   * @param {Number}   slow 动画的缓慢程度 // 数值越大，动画越迟缓。
   * @param {Number}   time 每次动画执行时间
   */
  function startMove(elem, json, fn = null, slow = 10, time = 15) {
    clearInterval(elem.timer);
  
    elem.timer = setInterval(function() {
      var bStop = true;
  
      for (var attr in json) {
        var iCur = 0;
        var target = json[attr];
  
        if (attr === "opacity") {
          iCur = getStyle(elem, attr) * 100 || 1;
        } else {
          iCur = parseInt(getStyle(elem, attr)) || 0;
        }
  
        var iSpeed = (target - iCur) / slow;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
        iCur += iSpeed;
  
        if (attr === "opacity") {
          elem.style.filter = "alpha(opacity=" + iCur + ")";
          elem.style[attr] = iCur / 100;
        } else if (attr === "zIndex") {
          elem.style.zIndex = target;
        } else {
          elem.style[attr] = iCur + "px";
        }
  
        iCur != target && (bStop = false);
      }
  
      if (bStop) {
        clearInterval(elem.timer);
        fn && fn();
      }
    }, time);
  }

window.onload = function() {
    var IMG_DATAS = [
      {
        index: 0,
        width: 300,
        top: -20,
        left: 150,
        opacity: 20,
        zIndex: 2
      },
      {
        index: 1,
        width: 500,
        top: 30,
        left: 50,
        opacity: 80,
        zIndex: 3
      },
      {
        index: 2,
        width: 600,
        top: 100,
        left: 300,
        opacity: 100,
        zIndex: 4
      },
      {
        index: 3,
        width: 500,
        top: 30,
        left: 650,
        opacity: 80,
        zIndex: 3
      },
      {
        index: 4,
        width: 300,
        top: -20,
        left: 750,
        opacity: 20,
        zIndex: 2
      }
    ];
  
    var oBtnLeft = document.getElementById("slider-arrow-left");
    var oBtnRight = document.getElementById("slider-arrow-right");
    var oImgsWrapper = document.getElementById("slider-imgs");
    var aImgs = oImgsWrapper.getElementsByTagName("li");
    // 计算中间的图片的索引
    var nMiddleImgIndex = Math.floor(aImgs.length / 2);
  
    for (let i = 0; i < aImgs.length; i++) {
      aImgs[i].onclick = function() {
        // 计算数据需要模拟队列移动的次数
        var nMoveLen = IMG_DATAS[i].index - nMiddleImgIndex;
  
        if (!nMoveLen) return; // 图片已经在中间
        if (nMoveLen < 0) {
          // 点击左边的图片，图片右移
          for (let j = 0; j < Math.abs(nMoveLen); j++) {
            IMG_DATAS.push(IMG_DATAS.shift());
          }
        } else {
          // 点击右边的图片，图片左移
          for (let j = 0; j < nMoveLen; j++) {
            IMG_DATAS.unshift(IMG_DATAS.pop());
          }
        }
  
        sliderMove();
      };
    }
  
    // 图片轮播
    function sliderMove() {
      IMG_DATAS.forEach(function(item, index) {
        startMove(aImgs[index], item);
      });
    }
  
    // 页面初始加载，执行一次动画
    sliderMove();
  
    // 点击左按钮
    oBtnLeft.onclick = function() {
      IMG_DATAS.push(IMG_DATAS.shift());
      sliderMove();
    };
  
    // 点击右按钮
    oBtnRight.onclick = function() {
      IMG_DATAS.unshift(IMG_DATAS.pop());
      sliderMove();
    };
};