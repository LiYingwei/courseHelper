
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
//$(document).ready(function(){
//	postToIframe({'plan.id':'9279','majorPlanId':'9279'},"http://jwfw.fudan.edu.cn/eams/stdPlanCompletedState!instantAudit.action",'iframe1');
//});
$(document).ready(function(){
	$('#syncModal').modal('show');
	$("#postToIframe").submit();
})
var posted=0;
$('#iframe1').load(function(){
	// no need to step 2 at current time
	window.location.href="schedule.html";
	$('.modal p').html('请手动把urp上的已修课程情况导入本应用：<br/>(学校教务服务的计划对比可能有错，没关系，应用只获取已修课程数据)<br/>1.在下面框架内单击鼠标，通过Ctrl+A全选，Ctrl+C复制；<br/>2.在粘贴文本框内通过Ctrl+V粘贴，然后按确定；<br/>3.如果一直提示获取失败，请尝试刷新本页面重试一次或更换浏览器。<br/>');
	$('#confirmCommitPersonInfo').attr('disabled',false);
});
$('#paste_text').on('keyup',function(){
	textGet=$('#paste_text').val();
	/*
	if(textGet.indexOf("学生基本信息")!=-1&&textGet.indexOf("以下是你的成绩信息:")!=-1)
	{
		$('#paste_text').val("已经读取，请稍候……");
		$('#paste_text').css("color","green");
		extractPersonInfo(textGet);
	}*/
	if(textGet.indexOf("课表格式说明：教师姓名")!=-1&&textGet.indexOf("备注")!=-1)
	{
		$('#paste_text').val("已经读取，请稍候……");
		$('#paste_text').css("color","green");
		extractPersonInfo(textGet);
	}
});
function forceCommitPersonInfo()
{
	textGet=$('#paste_text').val();
	if(textGet.indexOf("课表格式说明：教师姓名")!=-1&&textGet.indexOf("备注")!=-1)
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
var allcoursecredits=[];
function initCourse()
{
	for(var i in courseJSON)
	{
		allcoursecredits[courseJSON[i][1]]=courseJSON[i][3];
	}
}
function extractPersonInfo(textGet)
{
	personGet=eval("["+localStorage["person"]+"]")[0];
	var regex =new RegExp( /\t([A-Z]{3,4}[0-9]{5,6})\t/g);
	var getCourses=textGet.replace(/\s+/g,'\t').match(regex);
	var foundCourse=[];
	for(var i in personGet.courses)
	{
		foundCourse[personGet.courses[i].no]=true;
	}
	initCourse();
	for(var i in getCourses)
	{
		str=getCourses[i].split('\t');
		console.log(str[1]);
		if(str[1]=="ENGL110902")//FET或FCT
		{
			continue;
		}
		if(foundCourse[str[1]]==null)
		{
			foundCourse[str[1]]=true;
			var credits=allcoursecredits[str[1]];
			personGet.courses.push({no:str[1],credits:credits});
			personGet.calcredits+=parseFloat(credits);
		}
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
