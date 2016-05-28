$('.modal').modal('show');
/*$.get("http://www.urp.fudan.edu.cn:78/epstar/app/fudan/ScoreManger/ScoreViewer/Student/Course.jsp",function(){
	alert("ok!");
});*/
/*$.ajax({ 
    url:"", 
    type:'GET', 
    dataType:'JSONP', 
    success: function(data){ 
        alert(data);
    } 
}); */
var textGet;
var personGet={};
$('#iframe1').load(function(){
	
	$('.modal p').html('请手动把urp上的已修课程情况导入本应用：<br/>1.在下面框架内单击鼠标，通过Ctrl+A全选，Ctrl+C复制；<br/>2.在粘贴文本框内通过Ctrl+V粘贴，然后按确定。<br/>由于这个应用是离线存储的，所以你也不用担心什么信息泄露。');
	$('#confirmCommitPersonInfo').attr('disabled',false);
});
$('#paste_text').on('keyup',function(){
	textGet=$('#paste_text').val();
	if(textGet.indexOf("学生基本信息")!=-1&&textGet.indexOf("以下是你的成绩信息:")!=-1)
	{
		$('#paste_text').val("已经读取，请稍候……");
		$('#paste_text').css("color","green");
		extractPersonInfo(textGet);
	}
});
function forceCommitPersonInfo()
{
	textGet=$('#paste_text').val();
	if(textGet.indexOf("学生基本信息")!=-1&&textGet.indexOf("以下是你的成绩信息:")!=-1)
	{
		$('#paste_text').val("读取成功！请稍后……");
		$('#paste_text').css("color","green");
		extractPersonInfo(textGet);
	}
	else
	{
		alert("信息格式有误！");
	}
}
function extractPersonInfo(textGet)
{
	personGet.name=strBetween(textGet,"姓名：\t","\t");
	personGet.id=strBetween(textGet,"学号：\t","\t");
	personGet.sex=strBetween(textGet,"性别：\t","\n");
	personGet.year=strBetween(textGet,"年级：\t","\t");
	personGet.department=strBetween(textGet,"院系：\t","\t");
	personGet.major=strBetween(textGet,"专业：\t","\n");
	personGet.credits=strBetween(textGet,"总学分：\t","\t");
	personGet.courses=[];
	personGet.calcredits=0;
	var regex =new RegExp( /\t[A-Z]{3,4}[0-9]{5,6}\t[^\t]*\t[^\t]*\t/g);
	var getCourses=textGet.match(regex);
	for(var i in getCourses)
	{
		str=getCourses[i].split('\t');
		console.log(str[1] + ":" + str[3]);
		if(str[1]=="ENGL110902")//FET或FCT
		{
			continue;
		}
		personGet.courses.push({no:str[1],credits:str[3]});
		personGet.calcredits+=parseFloat(str[3]);
	}
	localStorage["person"]=JSON.stringify(personGet);
	window.location.href="schedule.html";
}
function strBetween(str,a,b)
{
	var ia=str.indexOf(a);
	if(ia==-1)return "";
	var ib=str.indexOf(b,ia+a.length);
	if(ib==-1)return "";
	return str.substr(ia+a.length,ib-ia-a.length);
}