/**获取当前时间**/
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds()+seperator2+date.getMilliseconds();
    return currentdate;
}
/**日志输出简易封装**/
function Log(){
	var log=new Object;
	log.level=5;
	log.debug=true;
	log.i=function(msg){
			if(this.level>4 && log.debug)
			console.log("%c [info]  "+getNowFormatDate()+" "+msg,'color:green');
	};
	log.d=function(msg){
			if(this.level>3 && log.debug)
			console.log("%c [debug] "+getNowFormatDate()+" "+msg,'color:blue');
	};
	log.w=function(msg){
			if(this.level>2 && log.debug)
			console.log("%c [warn]  "+getNowFormatDate()+" "+msg,'color:orange');
	};
	log.e=function(msg){
			if(this.level>1 && log.debug)
			console.log("%c [error] "+getNowFormatDate()+" "+msg,'color:red');
	};
	return log;
}
var log=new Log();