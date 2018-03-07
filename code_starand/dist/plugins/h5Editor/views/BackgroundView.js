function BackgroundView() {
    BackgroundView.DEFAULT_HEIGHT = 200;
    BackgroundView.DEFAULT_IMAGE = "images/none.jpg";
    BackgroundView.initView = function () {
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
        container.style.width = "100%";
        container.style.height = BackgroundView.DEFAULT_HEIGHT + "px";
        container.style.position = "relative";
        container.draggable = true;
        //创建背景
        var image = document.createElement("img");
        var imageStyle = document.createAttribute("style");
        image.setAttributeNode(imageStyle);
        image.style.position = "absolute"
        image.zIndex = -1;
        image.style.width = "100%";
        image.style.pointerEvents = "none";
        image.src = BackgroundView.DEFAULT_IMAGE;
        image.onload = function () {
            var rect = image.getBoundingClientRect();
            mask.style.height = rect.height + "px";
            container.style.height = rect.height + "px";
            if (container.isChange) {
                container.isChange = false;
                container.imageChangeListener();
            }
        }
        container.appendChild(image);
        //创建遮罩层
        var mask = document.createElement('div');
        var maskStyle = document.createAttribute("style");
        mask.setAttributeNode(maskStyle);
        mask.style.display = "none";
        mask.style.top = 0;
        mask.style.left = 0;
        mask.style.backgroundColor = "blue";
        mask.style.width = "100%";
        mask.style.height = BackgroundView.DEFAULT_HEIGHT + "px";
        mask.style.opacity = 0.5;
        mask.style.pointerEvents = "none";
        mask.style.position = "absolute"
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
        container.onmouseover = function (event) {
            mask.style.display = "block";
        }
        container.onmouseout = function (event) {
            container.setSelected(container.isSelected);
        }
        container.setImage = function (path) {
            image.src = path;
            container.isChange = true;
        }
        container.setImageChangeListener = function (changeListener) {
            container.imageChangeListener = changeListener;
        }
        container.ondragstart = function (event) {
            event.dataTransfer.setData('id', container.id);
            event.dataTransfer.setData('disX', event.offsetX);
            event.dataTransfer.setData('disY', event.offsetY);
            event.dataTransfer.setData('type', 0);
        }
        container.doMouseMove = function (event) {
            return false;
        }
        container.doMouseDown = function (event) {
            return false;
        }
        container.doMouseUp = function (event) {
            return false;
        }
        container.buildHtml = function (width, height) {
            return image.outerHTML.replace("position: absolute;","") + "\n";
        }
        return container;
    }

    return BackgroundView.initView();
}