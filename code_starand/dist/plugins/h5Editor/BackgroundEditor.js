/**
 * 背景编辑器
 * @returns {Element}
 * @constructor
 */
function BackgroundEditor() {
    BackgroundEditor.MIN_HEIGHT = 736;
    BackgroundEditor.DESIGN_HEIGHT = 736;
    BackgroundEditor.initView = function () {
        var container = document.createElement("div");
        var style = document.createAttribute("style");
        container.setAttributeNode(style);
        container.style.position = "absolute"
        // container.style.backgroundColor = "#FF00FF";
        container.style.minHeight = BackgroundEditor.MIN_HEIGHT + "px";
        container.listener = null;
        container.doMouseMove = function (event) {
            for (var i = 0; i < container.childNodes.length; i++) {
                if (container.childNodes[i].doMouseMove(event)) {
                    return true;
                    break;
                }
            }
            return false;
        }
        container.doMouseDown = function (event) {
            for (var i = 0; i < container.childNodes.length; i++) {
                if (container.childNodes[i].doMouseDown(event)) {
                    return true;
                    break;
                }
            }
            return false;
        }
        container.doMouseUp = function (event) {
            for (var i = 0; i < container.childNodes.length; i++) {
                if (container.childNodes[i].doMouseUp(event)) {
                    return true;
                    break;
                }
            }
            return false;
        }
        container.getTop = function (e) {
            var offset = e.offsetTop;
            if (e.offsetParent != null) offset += container.getTop(e.offsetParent);
            return offset;
        }
        container.getLeft = function (e) {
            var offset = e.offsetLeft;
            if (e.offsetParent != null) offset += container.getLeft(e.offsetParent);
            return offset;
        }
        /**
         * 调整编辑器大小
         */
        container.refreshSize = function () {
            var height = 0;
            for (var i = 0; i < container.childNodes.length; i++) {
                height = height + parseInt(container.childNodes[i].style.height) + parseInt(container.childNodes[i].style.borderWidth | 0) * 2;
            }
            if (height > parseInt(container.style.minHeight)) {
                container.style.height = height + "px";
            } else {
                container.style.height = container.minHeight;
            }
            if (container.onChageSizeListener != null) {
                container.onChageSizeListener(parseInt(container.style.width), parseInt(container.style.height));
            }
        }
        /*编辑器大小变化的回调，函数签名为：void onChageSizeListener(width,height)*/
        container.onChageSizeListener = null;
        container.doDrop = function (event) {
            var id = event.dataTransfer.getData('id');
            var type = event.dataTransfer.getData('type');
            if (type != 0) {//type==0才是背景视图
                return false;
            }
            var view = document.getElementById(id);
            if (view == null) {
                view = container.buildNewView();
            }
            var currentIndex = container.getIndexByPosition(event);//取得当前鼠标覆盖到的子View索引
            var newIndex = container.getIndexFromView(view);
            if (currentIndex != newIndex) {
                this.removeChild(view);
                this.insertBefore(view, container.childNodes[currentIndex]);
            }
            container.refreshSize();
            return true;
        }
        container.buildNewView = function () {
            var view = new BackgroundView();
            view.onclick = function (event) {
                container.onCustomClick(view);
            }
            view.setImageChangeListener(container.refreshSize);
            view.ondragend = function (event) {
                var rect = container.getBoundingClientRect()
                var viewRect = view.getBoundingClientRect()
                if (event.pageX + viewRect.width < rect.x
                    || event.pageX > rect.x + rect.width
                    || event.pageY < 0
                    || event.pageY - viewRect.height > container.getTop(container) + rect.height
                ) {
                    this.parentNode.removeChild(this);//当超出边界则删除。
                    container.onCustomClick(container.childNodes.length > 0 ? container.childNodes[0] : null);
                    container.refreshSize();
                } else {
                    container.onCustomClick(view);
                }
            }
            container.appendChild(view);
            container.onCustomClick(view);
            return view;
        }
        container.getIndexByPosition = function (event) {
            for (var i = 0; i < container.childNodes.length; i++) {
                var viewRect = container.childNodes[i].getBoundingClientRect();
                if (event.clientY > viewRect.y
                    && event.clientY < viewRect.y + viewRect.height) {
                    return i;
                }
            }
            return -1;
        }

        container.getIndexFromView = function (view) {
            for (var i = 0; i < container.childNodes.length; i++) {
                if (view == container.childNodes[i]) {
                    return i;
                }
            }
            return -1;
        }

        container.lastSelectedView = null;
        /**
         * 触发自定义click
         */
        container.onCustomClick = function (view) {
            var id = "";
            if (view != null) {
                id = view.id;
            }
            /*以下代码用于增加选中效果，但实际并不美观，影响体验，所以先注释
            else {
                           container.lastSelectedView = null;
                       }
                       if (container.lastSelectedView != view) {
                           if (container.lastSelectedView != null) {
                               container.lastSelectedView.setSelected(false);
                           }
                           container.lastSelectedView = view;
                           view.setSelected(true);
                       }*/
            container.listener(id, 0);
        }
        container.setOnClickListerner = function (listener) {
            container.listener = listener;
        }


        container.getBuildHtml = function () {
            var result = "<div style=\"width:100%;height:" + parseInt(container.style.height) / BackgroundEditor.DESIGN_HEIGHT * 100 + "%;position: absolute;\">\n";
            for (var i = 0; i < container.childNodes.length; i++) {
                result += container.childNodes[i].buildHtml(container.style.width, container.style.height);
            }
            result += "</div>";
            return result;
        }

        return container;
    }
    return BackgroundEditor.initView();
}