function MaskView() {
    MaskView.DEFAULT_HEIGHT = 50;
    MaskView.DEFAULT_WIDTH = 50;
    MaskView.initView = function () {
        var container = document.createElement("div");
        //图片是否变更
        container.isChange = false;
        container.imageChangeListener = null;
        container.id = new UUID();
        //设置默认属性
        var style = document.createAttribute("style");
        container.setAttributeNode(style);
        container.style.cursor = "move";
        container.style.pointerEvents = "auto";
        container.style.width = MaskView.DEFAULT_HEIGHT + "px";
        container.style.height = MaskView.DEFAULT_HEIGHT + "px";
        container.style.position = "absolute";
        container.style.borderWidth = "1px";
        container.style.borderColor = "#000";
        container.style.borderStyle = "dashed";
        container.resizeEnable = true;//是否可以使用鼠标调整尺寸
        container.draggable = true;
        //创建遮罩层
        var mask = document.createElement('div');
        var maskStyle = document.createAttribute("style");
        mask.setAttributeNode(maskStyle);
        mask.style.display = "none";
        mask.style.top = 0;
        mask.style.left = 0;
        mask.style.backgroundColor = "blue";
        mask.style.width = MaskView.DEFAULT_HEIGHT + "px";
        mask.style.height = MaskView.DEFAULT_HEIGHT + "px";
        mask.style.opacity = 0.5;
        mask.style.pointerEvents = "none";
        mask.style.position = "absolute"
        container.enterRange = false;
        container.appendChild(mask);
        container.isSelected = false;
        container.setSelected = function (selected) {
            container.isSelected = selected;
            if (selected) {
                mask.style.display = "block";
            } else {
                mask.style.display = "none";
            }
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
        container.onmouseover = function (event) {
            mask.style.display = "block";
            container.enterRange = true;
        }
        container.onmouseout = function (event) {
            container.setSelected(container.isSelected);
            container.enterRange = false;
        }
        container.ondragstart = function (event) {
            event.dataTransfer.setData('id', container.id);
            event.dataTransfer.setData('disX', event.offsetX);
            event.dataTransfer.setData('disY', event.offsetY);
            event.dataTransfer.setData('type', 1);
        }

        //-----------------------------处理放大缩小事件------------------
        container.checkDirection = function (event) {
            var direction = -1;
            var rect = container.getBoundingClientRect()
            if (Math.abs(rect.x - event.clientX) <= 3) {//左边
                direction = 1;
            } else if (Math.abs(rect.y - event.clientY) <= 3) {//上边
                direction = 2;
            } else if (Math.abs(rect.y + rect.height - event.clientY) <= 3) {//下边
                direction = 3;
            } else if (Math.abs(rect.x + rect.width - event.clientX) <= 3) {//右边
                direction = 4;
            } else if (event.clientY > rect.y
                && event.clientY < event.clientY + rect.height
                && event.clientX > rect.x
                && event.clientX < event.clientX + rect.width) {
                direction = 0;
            }
            return direction;
        }
        container.doMouseMove = function (event) {
            if (!this.resizeEnable) {
                return false;
            }
            if (!container.resizeDown) {
                var direction = container.checkDirection(event);
                if (direction < 0) {
                    return false;
                }
                if (direction != container.currentDirection) {
                    container.currentDirection = direction;
                    switch (direction) {
                        case 1:
                        case 4:
                            container.style.cursor = "col-resize";
                            return true;
                        case 2:
                        case 3:
                            container.style.cursor = "row-resize";
                            return true;
                        default:
                            container.style.cursor = "move";
                            return true;
                    }
                }
            } else {
                container.move(event);
                return true;
            }
        }
        container.setSize = function (width, height) {
            container.style.width = width + "px";
            container.style.height = height + "px";
            mask.style.width = container.style.width;
            mask.style.height = container.style.height;
        }
        container.move = function (event) {
            var disX = container.resizeLastX - event.clientX;
            var disY = container.resizeLastY - event.clientY;
            switch (container.currentDirection) {
                case 1://左
                    container.resizeLastX = event.clientX;
                    var offset = parseInt(container.style.width) + disX;
                    container.style.width = offset + "px";
                    container.style.left = (parseInt(container.style.left) - disX) + "px";
                    break;
                case 2://上
                    container.resizeLastY = event.clientY;
                    var offset = parseInt(container.style.height) + disY;
                    container.style.height = offset + "px";
                    container.style.top = (parseInt(container.style.top) - disY) + "px";
                    break;
                case 3://下
                    container.resizeLastY = event.clientY;
                    var offset = parseInt(container.style.height) - disY;
                    container.style.height = offset + "px";
                    break;
                case 4://右
                    container.resizeLastX = event.clientX;
                    var offset = parseInt(container.style.width) - disX;
                    container.style.width = offset + "px";
                    break;
            }
            mask.style.width = container.style.width;
            mask.style.height = container.style.height;
        }
        container.doMouseDown = function (event) {
            if (container.checkDirection(event) > 0 && container.resizeEnable && container.enterRange) {
                container.resizeDown = true;
                container.resizeLastX = event.clientX;
                container.resizeLastY = event.clientY;
                container.draggable = false;
                return true;
            }
            return false;
        }
        container.doMouseUp = function (event) {
            if (container.resizeDown) {
                container.resizeDown = false;
                container.draggable = true;
            }
            return false;
        }
        //-----------------------------处理结束------------------
        container.buildHtml = function (width, height) {
            var result = document.createElement("div");
            var style = document.createAttribute("style");
            result.setAttributeNode(style);
            result.style.width = (parseInt(container.style.width) / width * 100) + "%";
            result.style.height = (parseInt(container.style.height) / height * 100) + "%";
            result.style.position = "absolute";
            result.style.left = (parseInt(container.style.left) / width * 100) + "%";
            result.style.top = (parseInt(container.style.top) / height * 100) + "%";
            result.style.cursor = "pointer"
            if (container.actionType == 1) {
                //链接地址
                var link = "#";
                if (container.actionText.indexOf("http") < 0) {
                    link = "http://" + container.actionText;
                } else {
                    link = container.actionText;
                }
                result = "<a target='_blank' style='display:block;' href=\"" + link + "\">" + result.outerHTML + "\n</a>";
            } else if (container.actionType == 2) {
           
                //跳转资源
                var link ="#";
                var id = container.actionText;
                link="http://oss2.yicheku.com.cn/temp/4sres/" +md5(id) + '.html?state=2';
                result = "<a target='_blank' style='display:block;' href=\"" + link + "\">" + result.outerHTML + "\n</a>";
            } else if (container.actionType == 3) {
                //拨打电话
                result = "<a style='display:block;' href=\"tel:" + container.actionText + "\">" + result.outerHTML + "\n</a>";
            }else{
                result ="<span></span>"
            }

            return result + "\n";
        }

        return container;
    }

    return MaskView.initView();
}