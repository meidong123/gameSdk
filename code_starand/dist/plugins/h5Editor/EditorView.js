/**
 * 可视化编辑窗口
 * @constructor
 */
function EditorView(width, height) {
    var container = document.createElement("div");
    var style = document.createAttribute("style");
    container.setAttributeNode(style);
    container.style.width = width + "px";
    container.style.height = height + "px";
    container.style.overflowY = "scroll";
    container.style.position = "relative";
    container.style.backgroundColor = "#FFF";
    var backgroundEditor = new BackgroundEditor();
    backgroundEditor.style.width = width + "px";
    backgroundEditor.style.height = height + "px";
    container.appendChild(backgroundEditor);

    var maskEditor = new MaskEditor();
    maskEditor.style.width = width + "px";
    maskEditor.style.height = height + "px";
    maskEditor.style.pointerEvents = "none";
    container.appendChild(maskEditor);
    //设置背景编辑器的尺寸变化监听器
    backgroundEditor.onChageSizeListener = function (width, height) {
        maskEditor.style.width = width + "px";
        maskEditor.style.height = height + "px";
    }


    container.buildNewView = function (type) {
        if (type == 0) {
            backgroundEditor.buildNewView();
        } else if (type == 1) {
            maskEditor.buildNewView();
        }

    }

    container.ondragover = function (event) {
        event.preventDefault();
    }
    container.ondrop = function (event) {
        for (var i = 0; i < container.childNodes.length; i++) {
            if (container.childNodes[i].doDrop(event)) {
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
    };
    container.doMouseMove = function (event) {
        for (var i = 0; i < container.childNodes.length; i++) {
            if (container.childNodes[i].doMouseMove(event)) {
                return true;
                break;
            }
        }
        return false;
    };
    container.doMouseUp = function (event) {
        for (var i = 0; i < container.childNodes.length; i++) {
            if (container.childNodes[i].doMouseUp(event)) {
                return true;
                break;
            }
        }
        return false;
    };

    container.setOnClickListerner = function (listener) {
        backgroundEditor.setOnClickListerner(listener);
        maskEditor.setOnClickListerner(listener);
    }

    container.buildHtmlForMobile = function (title, desc) {
        log.i("build html");
        var html = "<!DOCTYPE html>\n";
        html = container.buildHtmlTagStart(html);

        html = container.buildHeadTagStart(html);
        html = container.buildMeta(html);
        html = container.buildTitle(html, title);
        html = container.buildDesc(html, desc);
        html = container.buildCss(html);

        html = container.buildFunction(html);
        html = container.buildHeadTagEnd(html);
        html = container.buildBodyTagStart(html);

        html = container.buildBackgroundView(html);


        html = container.buildBodyTagEnd(html);
        html = container.buildHtmlTagEnd(html);
        return html;

    }
    container.buildFunction = function (html) {
        html += "<script type=\"text/javascript\">\n";
        html += "function initialization() {\n" +
            "            var viewPort = document.getElementById(\"viewport\");\n" +
            "            var rate = window.innerWidth / 480;\n" +
            "            viewPort.style.width = window.innerWidth + \"px\";\n" +
            "            viewPort.style.height = (736 * rate) + \"px\";\n" +
            "        }";
        html += "</script>\n";
        return html;
    }
    //******以下为HTML生成工具********
    container.buildBackgroundView = function (html) {
        html = html + "<div id=\"viewport\" style=\"margin:auto auto;width:480px;height:736px;position: relative;\">\n";
        var background = backgroundEditor.getBuildHtml();
        html = html + background;

        var maskEdit = maskEditor.getBuildHtml();
        html = html + maskEdit;
        html = html + "</div>\n";
        return html;
    }

    container.buildCss = function (html) {
        html = html + "<style type=\"text/css\">\n";
        html = html + "* {\n" +
            "    margin: 0;\n" +
            "    padding: 0;\n" +
            "}";
        html = html + "</style>\n";
        return html;
    }
    container.buildDesc = function (html, desc) {
        return html + '<meta name="description" content="' + desc + '">\n';
    }
    container.buildHtmlTagStart = function (html) {
        return html + "<html>\n";
    }
    container.buildHtmlTagEnd = function (html) {
        return html + "</html>\n";
    }
    container.buildHeadTagStart = function (html) {
        return html + "<head>\n";
    }
    container.buildMeta = function (html) {
        var result;
        result = html + "<meta charset=\"UTF-8\">\n";
        result = result + "<meta name=\"viewport\" content=\"width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no\">\n"
        return result;
    }
    container.buildTitle = function (html, title) {
        return html + "<title>" + title + "</title>\n";
    }
    container.buildHeadTagEnd = function (html) {
        return html + "</head>\n";
    }
    container.buildBodyTagStart = function (html) {
        return html + "<body onload=\"initialization();\">\n";
    }
    container.buildBodyTagEnd = function (html) {
        return html + "</body>\n";
    }
    //*************结束**************
    return container;
}
