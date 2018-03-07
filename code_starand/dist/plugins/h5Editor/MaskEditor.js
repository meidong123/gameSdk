function MaskEditor() {
    MaskEditor.MIN_HEIGHT = 736;
    MaskEditor.DESIGN_WIDTH = 480;
    MaskEditor.DESIGN_HEIGHT = 736;
    MaskEditor.initView = function () {
        var container = document.createElement("div");
        var style = document.createAttribute("style");
        container.setAttributeNode(style);
        container.style.position = "absolute"
        //container.style.backgroundColor = "rgba(255,0,0,.5)";
        container.style.minHeight = BackgroundEditor.MIN_HEIGHT + "px";
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
            var offset = e.offsetTop - e.scrollTop;
            if (e.offsetParent != null) offset += container.getTop(e.offsetParent);
            return offset;
        }
        container.getLeft = function (e) {
            var offset = e.offsetLeft - e.scrollLeft;
            if (e.offsetParent != null) offset += container.getLeft(e.offsetParent);
            return offset;
        }
        container.doDrop = function (event) {
            var id = event.dataTransfer.getData('id');
            var type = event.dataTransfer.getData('type');
            var disX = event.dataTransfer.getData('disX') | 0;
            var disY = event.dataTransfer.getData('disY') | 0;
            if (type != 1) {//type==1才是框架图
                return;
            }

            var rect = container.getBoundingClientRect();
            var view = document.getElementById(id);
            if (view == null) {
                view = container.buildNewView();
            }
            view.style.left = (event.pageX - container.getLeft(container) - disX - parseInt(view.style.borderWidth)) + "px";
            view.style.top = (event.pageY - container.getTop(container) - disY - parseInt(view.style.borderWidth)) + "px";
            return true;
        }
        container.buildNewView = function () {
            var view = new MaskView();
            view.onclick = function (event) {
                container.onCustomClick(view);
            }
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
                } else {
                    container.onCustomClick(view);
                }
            }
            container.appendChild(view);
            container.onCustomClick(view);
            return view;
        }
        container.getBuildHtml = function () {
            log.e(parseInt(container.style.height));
            var result = "<div style=\"width:100%;height:" + ((parseInt(container.style.height) / MaskEditor.DESIGN_HEIGHT) * 100) + "%;" + "position: absolute;\">\n";
            for (var i = 0; i < container.childNodes.length; i++) {
                result += container.childNodes[i].buildHtml(parseInt(container.style.width), parseInt(container.style.height));
            }
            result += "</div>";
            return result;
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
            container.listener(id, 1);
        }
        container.setOnClickListerner = function (listener) {
            container.listener = listener;
        }
        return container;
    }
    return MaskEditor.initView();
}