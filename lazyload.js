/*
* ujoyLazy图片延迟加载
* imglazy，延迟加载图片需要增加的class类标识
* data-src，图片自定义属性（存放图片源地址）
* */
(function(W,D){

    /*
    * 页面加载完毕
    * doc,保存document对象
    * imgs,获取延迟加载图片对象集合
    * len,保存集合总数
    * n,用于统计是否图片是否都加载完毕
    * */
    var doc = D,
        imgs = getElementsByClassName(doc,"imglazy"),
        len = imgs.length,
        n = 0,
        classname = [];

    /*
    * 图片加载执行函数
    * @method lazyLoading
    * */
    function lazyLoading(){

        for(var i = 0; i < len; i++){
            //获取自定义属性的图片地址,即图片源地址
            var img = imgs[i],
                datasrc = img.getAttribute("data-src");
                classname[i] = img.className;
            if(datasrc){
                var wh = doc.documentElement.clientHeight,//视窗高度
                    th = img.getBoundingClientRect().top,//元素top与视窗顶部距离
                    bh = img.getBoundingClientRect().bottom,//元素bottom与视窗顶部距离
                    ds = img.style.display;
                if( (bh > 0 && th < wh) || ds == "none"){
                    img.setAttribute("src",datasrc);
                    img.removeAttribute("data-src");
                    img.className =  classname[i]+' fadein';
                    n++;
                }
                //加载完毕，卸载函数，销毁变量，释放内存
                if(n == len){
                    delEvent(W,"scroll",lazyLoading);
                    delEvent(W,"resize",lazyLoading);
                    doc = null;
                    img = null;
                    len = null;
                    n = null;
                    return false;
                }
            }
        }
    }

    /*
    * getElementsByClassName兼容性写法
    * @method getElementsByClassName
    * @papram {object} node,对象或父节点对象
    * @papram {string} classname,目标类
    * @return 返回获取到的类的集合
    * */
    function getElementsByClassName(node,classname){
        if(node.getElementsByClassName){
            return node.getElementsByClassName(classname);
        }else {
            var tagarr = [];
            var elems = node.getElementsByTagName("*");
            for(var i=0; i < elems.length; i++){
                if(elems[i].className.indexOf(classname) !=-1){
                    tagarr[tagarr.length] = elems[i];
                }
            }
            return tagarr;
        }
    }

    /*
     * 附加事件
     * @method delEvent
     * @papram {object} elem,对象
     * @papram {event} ev,事件类型
     * @papram {function} fun,附加处理函数
     * */
    function addEvent(elem,ev,fun){
        if(elem.attachEvent){
            elem.attachEvent("on" + ev, fun);
        }else{
            elem.addEventListener(ev, fun, false);
        }
    }

    /*
    * 卸载事件
    * @method delEvent
    * @papram {object} elem,对象
    * @papram {event} ev,事件类型
    * @papram {function} fun,卸载处理函数
    * */
    function delEvent(elem,ev,fun){
        if(elem.removeEventListener){
            elem.removeEventListener(ev, fun, false);
        }else{
            elem.detachEvent("on" + ev, fun);
        }
    }

    /*
     * 节流函数，或者防抖函数，当窗口变化时监听函数会频繁触发
     * @method debounce
     * @papram {function} func,执行节流函数或代码
     * @papram {number} wait,执行时间频率,单位毫秒
     * @papram {boolean} immediate,是在时间段的开始还是结束时执行，默认true
     * @return {function},返回一个包装好的函数
     * */
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    //初始化
    if(len > 0){
        lazyLoading();
        addEvent(W,"scroll",lazyLoading);
        addEvent(W,"resize",debounce(lazyLoading,200));
    }

})(window,document);
