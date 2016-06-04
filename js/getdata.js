
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
var personGet={};
var textGet;
//$(document).ready(function(){
//	postToIframe({'plan.id':'9279','majorPlanId':'9279'},"http://jwfw.fudan.edu.cn/eams/stdPlanCompletedState!instantAudit.action",'iframe1');
//});
$(document).ready(function(){
	if(localStorage['username']!=null)
		personGet.id=$('#textid').val(localStorage['username']);
	$('#infoModal').modal('show');
	$("#postToIframe").submit();
})
var posted=0;
$('#iframe1').load(function(){
	
	$('.modal p').html('请手动把urp上的已修课程情况导入本应用：<br/>(学校教务服务的计划对比可能有错，没关系，我们只获取已修课程数据)<br/>1.在下面框架内单击鼠标，通过Ctrl+A全选，Ctrl+C复制；<br/>2.在粘贴文本框内通过Ctrl+V粘贴，然后按确定。<br/>');
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
	if(textGet.indexOf("计划比对结果详细信息")!=-1&&textGet.indexOf("(三) 通识教育选修课程(所有子项均应满足要求)")!=-1)
	{
		$('#paste_text').val("已经读取，请稍候……");
		$('#paste_text').css("color","green");
		extractPersonInfo(textGet);
	}
});
function commitPersonalForm()
{
	personGet.name=$('#textname').val();
	personGet.id=$('#textid').val();
	personGet.major=$('#textmajor').val();
	personGet.department=$('#textdepartment').val();
	$('#infoModal').modal('hide');
	$('#syncModal').modal('show');
}
function forceCommitPersonInfo()
{
	textGet=$('#paste_text').val();
	if(textGet.indexOf("计划比对结果详细信息")!=-1&&textGet.indexOf("(三) 通识教育选修课程(所有子项均应满足要求)")!=-1)
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
	if(personGet.id!=null&&personGet.id.length==11)
	{
		personGet.year='20'+personGet.id.substr(0,2);
	}
	//personGet.name=strBetween(textGet,"姓名：\t","\t");
	//personGet.id=strBetween(textGet,"学号：\t","\t");
	//personGet.sex=strBetween(textGet,"性别：\t","\n");
	//personGet.year=strBetween(textGet,"年级：\t","\t");
	//personGet.department=strBetween(textGet,"院系：\t","\t");
	//personGet.major=strBetween(textGet,"专业：\t","\n");
	//personGet.credits=strBetween(textGet,"总学分：\t","\t");
	personGet.courses=[];
	personGet.calcredits=0;
	var regex =new RegExp( /\t([A-Z]{3,4}[0-9]{5,6})\t([^\s]+)\t([0-9\.]+)\t([0-9\.]+)\t/g);
	var getCourses=textGet.replace(' ','\t').match(regex);
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
