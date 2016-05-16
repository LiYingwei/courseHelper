var courseInfo={};
var selectableByTime=[];
var selectedCourse=[];
$(document).ready(function(){
    initCourseInfo();
    loadSelectedCourse();
	drawcoursetable();
});
function drawcoursetable() {
	var tablehtml;
	tablehtml = '<table class="table table-bordered">';
	tablehtml += '<thead>\
              <tr>\
              	<th> 时间 </th>\
                <th>星期日</th>\
                <th>星期一</th>\
                <th>星期二</th>\
                <th>星期三</th>\
                <th>星期四</th>\
                <th>星期五</th>\
                <th>星期六</th>\
              </tr>\
            </thead>';
    var selectedAtTime=[];
    var selectedArrangeAtTime=[];
    for(var i = 1; i <= 14; ++i)
    {
        selectedAtTime[i]=[];
        selectedArrangeAtTime[i]=[];
        for(var j = 0; j < 7; ++j)
        {
            selectedAtTime[i][j]=0;
            selectedArrangeAtTime[i][j]=undefined;
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
                selectedAtTime[k][arrange.weekDay]=-1;
            }
        }
    }
    tablehtml+='<tbody>';
    for(var i = 1; i <= 14; ++i)
    {
    	tablehtml+='<tr>';
    	tablehtml+='<td>第' + i + '节</td>';
    	for(var j = 0; j < 7; ++j)
        {
            if(selectedAtTime[i][j]<0)continue;
            tablehtml+='<td class="xkCell" unit=' + i + ' weekday=' + j;
            var arrange=selectedArrangeAtTime[i][j];
            if(selectedAtTime[i][j]>0)
            {
                tablehtml+=' rowspan=' + (arrange.endUnit-arrange.startUnit+1);
            }
            tablehtml+='>';
            if(selectedAtTime[i][j]>0)
            {
                var cinfo=courseInfo[selectedAtTime[i][j]];
                tablehtml+=cinfo.no + '<br />' + cinfo.name;
            }
            else if(selectedAtTime[i][j]==0)
            {
                tablehtml+=selectableByTime[i][j].length;
            }
            tablehtml+='</td>';
        }
    		
    	tablehtml+='</tr>';

    }
    tablehtml+='</tbody>';
    tablehtml += '</table>';
	$('#coursetable').html(tablehtml);
    $("tbody>tr>.xkCell").hover(function(){
        $(this).css("background-color","#EEEEEE");
    },function(){
        $(this).css("background-color","white");
    }).click(function(){
        $("#tipPanel tbody").html(showCoursesResult(getCoursesAtTime(
            $(this).attr("unit"),$(this).attr("weekday")
        )));
        $("#tipPanel").hide().fadeIn("fast")
        .css("top",$(this).offset().top+$(this).height()/2)
        .css("left",$(this).offset().left+$(this).width()/2);
    });
}
function showCoursesResult(list)
{
    var res="";
    for(var i in list)
    {
        var arrange=list[i];
        var cid=arrange.cid;
        var cinfo=courseInfo[cid];
        res+="<tr><td>" + cinfo.no + "</td><td>" + 
            cinfo.name + "</td><td>" + cinfo.credits + "</td><td>"
            + cinfo.teachers + "</td><td>" + arrange.startUnit + "-" + arrange.endUnit + "</td><td>" + "0" + 
            '</td><td><a title="选课" href="###" onclick="selectCourse(' + cinfo.id + ')">选课</a></td></tr>';
    }
    return res;
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
        courseInfo[cinfo.id]=cinfo;
        courseInfo[cinfo.no]=cinfo;
        for(var j in cinfo.arrangeInfo)
        {
            var arrange=cinfo.arrangeInfo[j];
            arrange.cid=cinfo.id;
            if(arrange.weekDay==7)arrange.weekDay=0;
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
function clearSelectedCourse()
{
    selectedCourse=[];
    saveSelectedCourse();
    drawcoursetable();
}
function selectCourse(cid)
{
    selectedCourse.push(cid);
    saveSelectedCourse();
    $("#tipPanel").fadeOut("fast");
    drawcoursetable();
}