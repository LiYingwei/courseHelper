
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
	personGet={};
	$('#paste_text').val("");
	if(localStorage['username']!=null)
		personGet.id=$('#textid').val(localStorage['username']);
	$('#infoModal').modal('show');
	$("#postToIframe").submit();
	$('#confirmCommitPersonInfo').attr('disabled',false);
})
var posted=0;
$('#paste_text').on('keyup',function(){
	textGet=$('#paste_text').val();
	/*
	if(textGet.indexOf("学生基本信息")!=-1&&textGet.indexOf("以下是你的成绩信息:")!=-1)
	{
		$('#paste_text').val("已经读取，请稍候……");
		$('#paste_text').css("color","green");
		extractPersonInfo(textGet);
	}*/
	if(textGet.indexOf("替代课程")!=-1&&textGet.indexOf("课程代码")!=-1)
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
	if(textGet.indexOf("替代课程")!=-1&&textGet.indexOf("课程代码")!=-1)
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
	/*var regex =new RegExp( /\t([A-Z]{3,4}[0-9]{5,6})\t([^\s]+)\t([0-9\.]+)\t([0-9\.]+)\t/g);
	var getCourses=textGet.replace(/\s+/g,'\t').match(regex);
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
	}*/
	var regex =new RegExp( /\t([A-Z]{3,4}[0-9]{5,6})\t/g);
	var getCourses=textGet.replace(/\s+/g,'\t').match(regex);
	var foundCourse=[];
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
	window.location.href="getdata-s2.html";
}
function strBetween(str,a,b)
{
	var ia=str.indexOf(a);
	if(ia==-1)return "";
	var ib=str.indexOf(b,ia+a.length);
	if(ib==-1)return "";
	return str.substr(ia+a.length,ib-ia-a.length);
}
