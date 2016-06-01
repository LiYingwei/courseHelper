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
    myExams.sort(function(a,b){return a.start==b.start?a.time>b.time:a.start>b.start;});
}
function saveExamInfo()
{
    localStorage["exams"]=JSON.stringify(myExams);
}
function deleteExam(examInfoIndex)
{
    myExams.splice(examInfoIndex,1);
    sortExamInfo();
    saveExamInfo();
    refreshPage();
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
			if(i==1||i==3||i==5)//通识课
			{
				extraGeneral+=typelist[kind][attr].complete-typelist[kind][attr].credit;
			}
			else
			{
				extraAll+=typelist[kind][attr].complete-typelist[kind][attr].credit;
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
        var c={no:courseInfo[selectedCourse[i]].code,credits:courseInfo[selectedCourse[i]].credits};
		if(coursetype[c.no]==undefined)
		{
			extraAll+=c.credits;
			continue;
		}
		var kind=coursetype[c.no].kind,attr=coursetype[c.no].attr;
		
		typelist[kind][attr].planned+=parseFloat(c.credits);
		if(typelist[kind][attr].planned>typelist[kind][attr].credits+0.01)
		{
			if(i==1||i==3||i==5)//通识课
			{
				extraGeneral+=typelist[kind][attr].planned-typelist[kind][attr].credit;
			}
			else
			{
				extraAll+=typelist[kind][attr].planned-typelist[kind][attr].credit;
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
        for(var j in cinfo.arrangeInfo)
        {
            var arrange=cinfo.arrangeInfo[j];
            arrange.cid=cinfo.id;
            if(arrange.weekDay==7)arrange.weekDay=0;
            cinfo.arrangeText+="日一二三四五六"[arrange.weekDay]+arrange.startUnit+"-"+arrange.endUnit+" ";
            for(var k=arrange.startUnit;k<=arrange.endUnit;++k)
            {
                selectableByTime[k][arrange.weekDay].push(arrange);
            }
        }
    }
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
function drawPieChart() {
    //A A- B+ B B- C+ C C- D D- F
    var grade = [0.8,0.8,0.8,0.8];
    var sum = 0;
    for(var i = 0;i < grade.length; i++)
        grade[i] += Math.random(), sum += grade[i];
    for(var i = 0;i < grade.length; i++)
        grade[i] = Math.floor(grade[i] * 100 / sum);
    var pieData = [
    {
        value: 170,
        label: 'A',
        color: "#F38630",
        labelColor : 'white',
        labelFontSize : '16'
    },
    {
        value : grade[1],
        label: 'B',
        color: "#F34353",
        labelColor : 'white',
        labelFontSize : '16'
    },
    {
        value : grade[2],
        label: 'C',
        color: 'blue',
        labelColor : 'white',
        labelFontSize : '16'
    },
    {
        value : grade[3],
        label: 'D',
        color: "green",
        labelColor : 'white',
        labelFontSize : '16'
    }
    ];
    /*var pieData = [{
                value : 30,
                color : "#F38630",
                label : 'Sleep',
                labelColor : 'white',
                labelFontSize : '16'
            },
                  {
                value : 30,
                color : "#F34353",
                label : 'Sleep',
                labelColor : 'white',
                labelFontSize : '16'
            }];*/
    var pieOptions = {
        segmentShowStroke : true,
        animateScale : true,
        inGraphDataShow: true,
        animationSteps: 100,
        animationEasing: 'easeInOutQuart'
    };
    var ctx = $("#pieChart").get(0).getContext("2d");
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
	$('#modal_courseDetail').modal('show');
	setTimeout('drawPieChart()',50);
	$("#dclassno").text(cno);
	$("#dcoursename").text(courseInfo[cno].name);
	$("#dcredits").text(courseInfo[cno].credits);
	$("#dcoursetypename").text(courseInfo[cno].courseTypeName);
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
function clearSelectedCourse()
{
    selectedCourse=[];
    saveSelectedCourse();
    drawcoursetable();
}
function selectCourse(cid)
{
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
	$('#modal_courseDetail').modal('hide');
    $("#tipPanel").fadeOut("fast");
    drawcoursetable();
}
function withdrawCourse(cid)
{
	var remove=selectedCourse.indexOf(cid);
	console.log(cid);
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
	$('#modal_courseDetail').modal('hide');
    $("#tipPanel").fadeOut("fast");
    drawcoursetable();
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
			return i;
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
        			return {able:-1,error:'这门课之前已选一门跨校区课：' + courseInfo[selectedAtTime[k][arrange.weekDay]].name,short:'跨校区'};
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
        			return {able:-1,error:'这门课之后已选一门跨校区课：' + courseInfo[selectedAtTime[k][arrange.weekDay]].name,short:'跨校区'};
        		}
        	}
        }
    }
    var examConflict=examTimeTest(cid);
    if(examConflict!=-1)
    {
    	return {able:-1,error:'这门课考试时间与已安排考试时间过于相近：' + myExams[examConflict].title,short:'考试冲突'};
    }
    return {able:1,error:'',short:''};
}