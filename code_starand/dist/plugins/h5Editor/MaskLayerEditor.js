function MaskLayerEditor(){
    /**
     * 继承自DropContainer
     * @type {DropContainer}
     */
    var container=new DropContainer();

    container.doDrop=function(event){
        var id=event.dataTransfer.getData('id');
        var disX=event.dataTransfer.getData('disX');
        var disY=event.dataTransfer.getData('disY');
        var view=document.getElementById(id);
        if(view.viewType!=0){
            return false;
        }
        if(view.parentNode!=this){//如果元素不是本容器内的元素，则复制它
            view=view.clone();
            view.ondragend=function(event){
                var rect = container.getBoundingClientRect()
                var viewRect=view.getBoundingClientRect()
                if(event.pageX+viewRect.width<rect.x
                    || event.pageX>rect.x+rect.width
                    || event.pageY<0
                    || event.pageY-viewRect.height>rect.y+rect.height
                ){
                    this.parentNode.removeChild(this);//当超出边界则删除。
                }
            }
            view.style.position="absolute";
            this.append(view);
        }
        view.style.left=(event.offsetX-disX)+"px";
        view.style.top=(event.offsetY-disY)+"px";
        view.resizeEnable=true;
        return true;
    }

    return container;
}