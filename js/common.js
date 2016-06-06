var coursetype={};
var courseInfo={};

var requiredcreditslist=[];
var completecreditslist=[];
var plannedcreditslist=[];

var selectableByTime=[];
var selectedCourse=[];
var selectedAtTime=[];
var selectedArrangeAtTime=[];
var myExams = [];
var gpabyteacher=[];
var gpabycourse=[];
var gpabyteachercourse=[];
var gpainited = false;
var personalplaninited=false;

var perference=[];
var coursefilter=[];

var testExamInfo = [
        /*{
            title  : '人机交互',
            start  : '2016-05-10',
            time   : '08:00',
            position:'Z2333',
            method : '1'
        },
        {
            title  : '十遍含数',
            start  : '2016-05-23',
            time   : '02:20',
            position:'H2222',
            method : '2'
        },
        {
            title  : '局部解剖学',
            start  : '2016-05-31',
            time   : '12:00',
            position:'F5201',
            method : '3'
        },
        {
            title  : '鬼畜心理学',
            start  : '2016-05-31',
            time   : '17:00',
            position:'Z计算机机房1',
            method : '1'
        }*/
    ];

function loadMyExams()
{
    if(localStorage["exams"]==undefined)
    {
        myExams=testExamInfo;
    }
    else
    {
        myExams=eval("["+localStorage["exams"]+"]")[0];
    }
}
function sortExamInfo()
{
    myExams.sort(function(a,b){return a.start==b.start?a.time==b.time?0:a.time>b.time?1:-1:a.start>b.start?1:-1;});
}
function saveExamInfo()
{
    localStorage["exams"]=JSON.stringify(myExams);
    //todo: show a hint
}
function deleteExam(examInfoIndex)
{
	swal({
        title: "确定删除吗？",
        text: "你将失去这门考试!",   
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#DD6B55",   
        confirmButtonText: "确定",   
        cancelButtonText: "取消",   
        closeOnConfirm: false,   
        closeOnCancel: false 
    }, function(isConfirm){   
        if (isConfirm) {
            swal("删除成功！", "不用考试啦~！", "success");
            myExams.splice(examInfoIndex,1);
		    sortExamInfo();
		    saveExamInfo();
		    refreshPage();
        } else {     
            swal("取消惹", "果然没有勇气放弃吧哈哈哈", "error");   
        } 
    });
}
function initCoursetype()
{
	for(var i=0;i<6;++i)
	{
		requiredcreditslist[i]=i==4?-20.0:0.0;//专业选修分组
		for(var s in typelist[i])
		{
			requiredcreditslist[i]+=typelist[i][s].credits;
			for(var k in typelist[i][s].list)
			{
				var course=typelist[i][s].list[k];
				coursetype[course]={};
				coursetype[course].kind=i;
				coursetype[course].attr=s;
			}
		}
	}
}

function getPersonalInfo()
{
    if(localStorage["person"]==undefined)
    {
        alert("请先点击右上角同步以获取你的个人信息~");
        window.location.href="login.html";
        return false;
    }
    else
    {
        person=eval("["+localStorage["person"]+"]")[0];
        return true;
    }
}
function calcPersonComplete(){
	var extraGeneral=0.0,extraAll=0.0;
	for(var i=0;i<6;++i)
	{
		completecreditslist[i]=0.0;
		for(var s in typelist[i])
		{
			typelist[i][s].complete=0.0;
		}
	}
	for(var i in person.courses)
	{
		var c=person.courses[i];
		console.log(coursetype[c.no]);
		console.log(c.no);
		if(coursetype[c.no]==undefined)
		{
			extraAll+=c.credits;
			continue;
		}
		var kind=coursetype[c.no].kind,attr=coursetype[c.no].attr;
		
		typelist[kind][attr].complete+=parseFloat(c.credits);
		if(typelist[kind][attr].complete>typelist[kind][attr].credits+0.01)
		{
			if(kind==1||kind==3||kind==5)//通识课
			{
				extraGeneral+=typelist[kind][attr].complete-typelist[kind][attr].credits;
			}
			else
			{
				extraAll+=typelist[kind][attr].complete-typelist[kind][attr].credits;
			}
			typelist[kind][attr].complete=typelist[kind][attr].credits;
		}
	}
	typelist[1][3].complete+=extraGeneral;
	if(typelist[1][3].complete>typelist[1][3].credits+0.01)
	{
		extraAll+=typelist[1][3].complete-typelist[1][3].credit;
		typelist[1][3].complete=typelist[1][3].credits;
	}
	//alert("额外学分："+extraAll + "!");
	for(var i=0;i<6;++i)
	{
		for(var s in typelist[i])
		{
			completecreditslist[i]+=typelist[i][s].complete;
		}
		if(i==4)//专业选修分组
		{
			var firstSection=Math.max(typelist[i][0].complete,
				typelist[i][1].complete,typelist[i][2].complete);
			completecreditslist[i]=firstSection+
				Math.min(completecreditslist[i]-firstSection,typelist[i][3].credits);
		}
	}
}
function calcPersonPlanned(){
	var extraGeneral=0.0,extraAll=0.0;
	for(var i=0;i<6;++i)
	{
		plannedcreditslist[i]=0;
		for(var s in typelist[i])
		{
			typelist[i][s].planned=typelist[i][s].complete;
		}
	}
    for(var i in selectedCourse)
    {
        var c={no:courseInfo[selectedCourse[i]].no.split('.')[0],credits:courseInfo[selectedCourse[i]].credits};
		if(coursetype[c.no]==undefined)
		{
			extraAll+=c.credits;
			continue;
		}
		var kind=coursetype[c.no].kind,attr=coursetype[c.no].attr;
		typelist[kind][attr].planned+=parseFloat(c.credits);
		if(typelist[kind][attr].planned>typelist[kind][attr].credits+0.01)
		{
			if(kind==1||kind==3||kind==5)//通识课
			{
				extraGeneral+=typelist[kind][attr].planned-typelist[kind][attr].credits;
			}
			else
			{
				extraAll+=typelist[kind][attr].planned-typelist[kind][attr].credits;
			}
			typelist[kind][attr].planned=typelist[kind][attr].credits;
		}
	}
	typelist[1][3].planned+=extraGeneral;
	if(typelist[1][3].planned>typelist[1][3].credits+0.01)
	{
		extraAll+=typelist[1][3].planned-typelist[1][3].credit;
		typelist[1][3].planned=typelist[1][3].credits;
	}
	//alert("额外学分："+extraAll + "!");
	for(var i=0;i<6;++i)
	{
		for(var s in typelist[i])
		{
			plannedcreditslist[i]+=typelist[i][s].planned;
		}
		if(i==4)//专业选修分组
		{
			var firstSection=Math.max(typelist[i][0].planned,
				typelist[i][1].planned,typelist[i][2].planned);
			plannedcreditslist[i]=firstSection+
				Math.min(plannedcreditslist[i]-firstSection,typelist[i][3].credits);
		}
	}
}
function initCourseInfo()
{

    for(var i = 1; i <= 14; i++)
    {
        selectableByTime[i]=[];
        for(var j = 0; j < 7; j++)
            selectableByTime[i][j]=[];
    }
    for(var i in lessonJSONs)
    {
        var cinfo=lessonJSONs[i];
        cinfo.arrangeText="";
        courseInfo[cinfo.id]=cinfo;
        courseInfo[cinfo.no]=cinfo;
        cinfo.credits=parseFloat(cinfo.credits);
        var collectCellInfo=true;
        if(coursefilter[0]!=null)//课程种类搜索
        {
        	var type=coursetype[cinfo.no.split('.')[0]];
			if(type==null||type.kind!=coursefilter[0].kind||type.attr!=coursefilter[0].attr)
				collectCellInfo=false;
        }
        if(coursefilter[1]!=null)//文字搜索
        {
        	if(!cinfo.no.toUpperCase().includes(coursefilter[1].toUpperCase())&&
        		!cinfo.name.toUpperCase().includes(coursefilter[1].toUpperCase())&&
        		!cinfo.teachers.toUpperCase().includes(coursefilter[1].toUpperCase()))
        		collectCellInfo=false;
        }
    	for(var j in cinfo.arrangeInfo)
        {
            var arrange=cinfo.arrangeInfo[j];
            arrange.cid=cinfo.id;
            if(arrange.weekDay==7)arrange.weekDay=0;
            arrange.startUnit=parseInt(arrange.startUnit);
            arrange.endUnit=parseInt(arrange.endUnit);
            cinfo.arrangeText+="日一二三四五六"[arrange.weekDay]+arrange.startUnit+"-"+arrange.endUnit+" ";
            if(collectCellInfo)
            {
	            for(var k=arrange.startUnit;k<=arrange.endUnit;++k)
	            {
	                selectableByTime[k][arrange.weekDay].push(arrange);
	            }
            }
        }
    }
}
function initGPAInfo()
{
	for(var i in GPATool)
	{
		var gpa=GPATool[i];
		var delta=parseInt(GPATool[i].sum);
		var tc=gpa.teacher + '<>' + gpa.name;
		if(gpabyteachercourse[tc]==null)
			gpabyteachercourse[tc]=[];
		if(gpabyteacher[gpa.teacher]==null)
			gpabyteacher[gpa.teacher]=[];
		if(gpabycourse[gpa.name]==null)
			gpabycourse[gpa.name]=[];
		if(gpabyteachercourse[tc][gpa.score]==null)
			gpabyteachercourse[tc][gpa.score]=0;
		if(gpabyteacher[gpa.teacher][gpa.score]==null)
			gpabyteacher[gpa.teacher][gpa.score]=0;
		if(gpabycourse[gpa.name][gpa.score]==null)
			gpabycourse[gpa.name][gpa.score]=0;
		gpabyteachercourse[tc][gpa.score]+=delta;
		gpabyteacher[gpa.teacher][gpa.score]+=delta;
		gpabycourse[gpa.name][gpa.score]+=delta;
	}
	gpainited=true;
}
function getCoursesAtTime(unit,weekday)
{
    var res=[];
    for(var i in selectableByTime[unit][weekday])
    {
        var arrange=selectableByTime[unit][weekday][i];
        //console.log(arrange);
        res.push(arrange);
    }
    //console.log(res);
    return res;
}
function saveSelectedCourse()
{
    localStorage["SelectedCourse"]=selectedCourse.toString();
}
function loadSelectedCourse()
{
    if(localStorage["SelectedCourse"]==undefined)
    {
        localStorage["SelectedCourse"]="";
    }
    selectedCourse=eval("["+localStorage["SelectedCourse"]+"]");
}
function drawPieChart(cno) {
	if(!gpainited)
	{
		initGPAInfo();
	}
	var cinfo=courseInfo[cno];
	var course=cinfo.name,teacher=cinfo.teachers.split(',')[0];
	var tc=teacher + '<>' + course;
	var op;
	var chartTitle;
	if(gpabyteachercourse[tc]!=null)
	{
		op=gpabyteachercourse[tc];
		chartTitle='本课程历年给分情况';
	}
	else if(gpabyteacher[teacher]!=null)
	{
		op=gpabyteacher[teacher];
		chartTitle= teacher + '老师历年给分情况';
	}
	else if(gpabycourse[course]!=null)
	{
		op=gpabycourse[course];
		chartTitle = '该课程其他老师历年给分情况';
	}
	else
	{
		op=null;
		chartTitle = '历年给分情况';
	}
	$('#pieChartTitle').html(chartTitle);
	var gradelist=['A','A-','B+','B','B-','C+','C','C-','D','D-','F'];
	var colorlist = ["#00BFFF","#87CEEB","#228B22","#32CD32","#98FB98","#FF8C00","#FFA500","#F4A460","#FFD700","#FFFF00","#FF0000"];
	var pieData = [];
	var grade=[];
	var sum=0.0;
	if(op==null)
	{
		pieData.push({
			value:1,
			label:'No data',
			color:"#AAAAAA",
			labelColor:'black',
			labelFontSize:'16'
		});
	}
	else
	{
		for(var i in gradelist)
		{
			if(op[gradelist[i]]!=null)sum+=op[gradelist[i]];
		}
		for(var i in gradelist)
		{
			if(op[gradelist[i]]!=null)grade[i]=op[gradelist[i]]/sum;else grade[i]=0;
			pieData.push({
				value:grade[i],
				label:gradelist[i],
				color:colorlist[i],
				labelColor:'white',
				labelFontSize:'16'
			});
		}

	}
    var pieOptions = {
        segmentShowStroke : true,
        animateScale : true,
        inGraphDataShow: true,
        animationSteps: 100,
        animationEasing: 'easeInOutQuart'
    };
    $('#pieChart').replaceWith('<canvas id="pieChart" class="raw" width="300px" height="300px"></canvas>');
    var ctx = $("#pieChart").get(0).getContext("2d");
    var canvas = $("#pieChart").get(0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var pieChart = new Chart(ctx).Pie(pieData, pieOptions);
}
function showCourseDetail(cno)
{
	if(courseInfo[cno]==undefined)
	{
		alert('不存在的选课号！');
		return;
	}
	if(selectedCourse.indexOf(courseInfo[cno].id)>=0)
	{
		$('.select-course-button').hide();
		$('.withdraw-course-button').unbind('click').click(function(){
			withdrawCourse(courseInfo[cno].id);
		}).show();
	}
	else
	{
		$('.withdraw-course-button').hide();
		$('.select-course-button').unbind('click').click(function(){
			selectCourse(courseInfo[cno].id);
		}).show();

	}
	var ctype=getCourseTypeInfo(cno);
	$('#modal_courseDetail').modal('show');
	setTimeout('drawPieChart("'+cno+'")',50);
	$("#dclassno").text(cno);
	$("#dcoursename").text(courseInfo[cno].name);
	$("#dcredits").text(courseInfo[cno].credits);
	if(ctype.kind==6||typelist[ctype.kind][ctype.attr].name==courseInfo[cno].name)
	{
		$("#dcoursetypename").text(typenamelist[ctype.kind]);
	}
	else
	{
		$("#dcoursetypename").text(typenamelist[ctype.kind] + '-' + typelist[ctype.kind][ctype.attr].name);
	}
	//.text(courseInfo[cno].courseTypeName);
	$("#dteacher").text(courseInfo[cno].teachers);
	if(examList[cno]!=undefined)
	{
		$("#dexamtime").text(examList[cno].date_time);
	}
	else
	{
		$("#dexamtime").text('不详');
	}
	$("#dtime").text(courseInfo[cno].arrangeText);
	$("#dplace").text(courseInfo[cno].arrangeInfo[0].rooms);
}

function prepareSelectAtTime()
{
    var visibleCell=[];
    for(var i = 1; i <= 14; ++i)
    {
        selectedAtTime[i]=[];
        selectedArrangeAtTime[i]=[];
        visibleCell[i]=[];
        for(var j = 0; j < 7; ++j)
        {
            selectedAtTime[i][j]=0;
            selectedArrangeAtTime[i][j]=undefined;
            visibleCell[i][j]=true;
        }
    }
    for(var i in selectedCourse)
    {
        var cinfo=courseInfo[selectedCourse[i]];
        for(var j in cinfo.arrangeInfo)
        {
            var arrange=cinfo.arrangeInfo[j];
            if(arrange.weekDay==7)arrange.weekDay=0;
            selectedAtTime[arrange.startUnit][arrange.weekDay]=selectedCourse[i];
            selectedArrangeAtTime[arrange.startUnit][arrange.weekDay]=arrange;
            for(var k=arrange.startUnit+1;k<=arrange.endUnit;++k)
            {
                selectedAtTime[k][arrange.weekDay]=selectedCourse[i];
                selectedArrangeAtTime[k][arrange.weekDay]=arrange;
                visibleCell[k][arrange.weekDay]=false;
            }
        }
    }
    return visibleCell;
}
function tempcomparer(a,b)
{
	return a.coursetype.kind==b.coursetype.kind?
		a.test.able==b.test.able?
		b.coursetype.require==a.coursetype.require?
		a.coursetype.attr-b.coursetype.attr:
		b.coursetype.require-a.coursetype.require:
		b.test.able-a.test.able:
		perference[a.coursetype.kind]-perference[b.coursetype.kind];
}
function clearSelectedCourse()
{
    selectedCourse=[];
    saveSelectedCourse();
    drawcoursetable();
}
function selectCourse(cid)
{
	console.log('选课啦:'+cid);
	if(selectableTest(cid).able==0)
	{
		$('#modal_courseDetail').modal('hide');
    	$.notify({message: selectableTest(cid).error},{type: 'danger'});
    	return;
	}
	if(cid==-1)
	{
		alert('错误：不存在的选课号！');
		return;
	}
	var exam=examList[courseInfo[cid].no];
	if(exam!=null)
	{
		myExams.push({title:courseInfo[cid].name,
			start:exam.date_time.split(' ')[0],
			time:exam.date_time.split(' ')[1],
			position:exam.position,
			method:['杂技表演','论文','闭卷','开卷'].indexOf(exam.method)
		});
	    sortExamInfo();
		saveExamInfo();
	}
    selectedCourse.push(cid);
    saveSelectedCourse();
    calcPersonPlanned();
	$('#modal_courseDetail').modal('hide');
    $("#tipModal").modal("hide");
    $.notify({message: '选课成功'},{type: 'success'});
    if($('#coursetable').length>0)
    {
    	drawcoursetable();
    }
    else
    {
    	localStorage['refreshHint']='选课成功，到课程表页面查看你的课表吧！';
    	location.href=location.href;
    }
}
function withdrawCourse(cid)
{
	var remove=selectedCourse.indexOf(cid);
	console.log('退课啦:'+cid);
	if(remove==-1)
	{
		alert('错误：没有选过这门课！');
		return;
	}
	for(var i=myExams.length-1;i>=0;--i)
	{
		if(myExams[i].title==courseInfo[cid].name)
		{
			myExams.splice(i,1);
		}
	}
    sortExamInfo();
	saveExamInfo();
    selectedCourse.splice(remove,1);
    saveSelectedCourse();
    calcPersonPlanned();
	$('#modal_courseDetail').modal('hide');
	$("#tipModal").modal("hide");
    $.notify({message: '退课成功'},{type: 'success'});
    if($('#coursetable').length>0)
    {
    	drawcoursetable();
    }
    else
    {
    	localStorage['refreshHint']='退课成功，到课程表页面查看你的课表吧！';
    	location.href=location.href;
    }
}
function examTimeTest(cid)
{
	var exam=examList[courseInfo[cid].no];
	if(exam==null)return -1;
	var newdate=new Date(examList[courseInfo[cid].no].date_time);
	for(var i in myExams)
	{
		var mydate=new Date(myExams[i].start + ' ' + myExams[i].time);
		var delta=Math.abs(newdate.getTime() - mydate.getTime())/ 86400000;

		if(delta<0.1249)
		{
			return {exam:i,delta:Math.round(delta*1440)};
		}
	}
	return -1;
}
function selectableTest(cid)
{
	var cinfo=courseInfo[cid];
	for(var i in selectedCourse)
	{
		if(courseInfo[selectedCourse[i]].name==cinfo.name)
		{
			return {able:0,error:'您课表上已经有相关课程了！',short:'重复'};
		}
	}
    for(var j in cinfo.arrangeInfo)
    {
        var arrange=cinfo.arrangeInfo[j];
        if(arrange.weekDay==7)arrange.weekDay=0;
        for(var k=arrange.startUnit;k<=arrange.endUnit;++k)
        {
        	if(selectedAtTime[k][arrange.weekDay]!=0)
        	{
        		return {able:0,error:'课表上有时间冲突的课：' + courseInfo[selectedAtTime[k][arrange.weekDay]].name,short:'冲突'};
        	}
        }
    }
    for(var i in person.courses)
    {
    	if(cinfo.no.split('.')[0]==person.courses[i].no)
    	{
    		return {able:1,error:'你已经修读过这门课了。',short:'重修'};
    	}
    }
    for(var j in cinfo.arrangeInfo)
    {
        var arrange=cinfo.arrangeInfo[j];
        if(arrange.weekDay==7)arrange.weekDay=0;
        var newCampus=arrange.rooms[0];
        if("ZJHF".indexOf(newCampus)==-1)continue;
        var k=arrange.startUnit-1;
        if(k>=1&&selectedAtTime[k][arrange.weekDay]!=0)
        {
        	var oldCampus=selectedArrangeAtTime[k][arrange.weekDay].rooms[0];
        	if("ZJHF".indexOf(oldCampus)!=-1)
        	{
        		if(oldCampus!=newCampus)
        		{
        			return {able:1,error:'这门课前紧跟一门跨校区课：' + courseInfo[selectedAtTime[k][arrange.weekDay]].name,short:'选课'};
        		}
        	}
        }
        k=arrange.endUnit+1;
        if(k<=14&&selectedAtTime[k][arrange.weekDay]!=0)
        {
        	var oldCampus=selectedArrangeAtTime[k][arrange.weekDay].rooms[0];
        	if("ZJHF".indexOf(oldCampus)!=-1)
        	{
        		if(oldCampus!=newCampus)
        		{
        			return {able:1,error:'这门课后紧跟一门跨校区课：' + courseInfo[selectedAtTime[k][arrange.weekDay]].name,short:'选课'};
        		}
        	}
        }
    }
    var examConflict=examTimeTest(cid);
    if(examConflict!=-1)
    {
    	if(examConflict.delta==0)
    	{
    		return {able:1,error:'这门课考试时间与某已安排考试时间重合：' + myExams[examConflict.exam].title,short:'选课'};
    	}
    	return {able:1,error:'这门课考试时间与某已安排考试时间差小于' + examConflict.delta + '分钟：' + myExams[examConflict.exam].title,short:'选课'};
    }
    return {able:2,error:'',short:''};
}

function getCourseTypeInfo(cno)
{
    var courseID=cno.split('.')[0];
    if(coursetype[courseID]==null)return {kind:6,attr:0,require:0};
    var kind=coursetype[courseID].kind,attr=parseInt(coursetype[courseID].attr);
    //console.log(typelist[kind][attr].credits+","+typelist[kind][attr].planned);
    var require=typelist[kind][attr].credits-typelist[kind][attr].planned;
    return {kind:kind,attr:attr,require:require};
}