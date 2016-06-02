//my:585302,590248,583838,587271,586870,586521,588193,590458,585851,588041

$(document).ready(function(){
    initCoursetype();
    initCourseInfo();
    getPersonalInfo();
    loadSelectedCourse();
    loadMyExams();
    calcPersonComplete();
    calcPersonPlanned();
	drawcoursetable();
    $('#search-bar').show();
});
function drawcoursetable() {
	var tablehtml;
	tablehtml = '<table class="table table-bordered">';
	tablehtml += '<thead id=\"coursehead">\
              <tr>\
              	<th style = "border-top-left-radius: 20px"> 时间 </th>\
                <th>星期日</th>\
                <th>星期一</th>\
                <th>星期二</th>\
                <th>星期三</th>\
                <th>星期四</th>\
                <th>星期五</th>\
                <th style = "border-top-right-radius: 20px">星期六</th>\
              </tr>\
            </thead>';
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
    tablehtml+='<tbody id = "coursebody">';
    for(var i = 1; i <= 14; ++i)
    {
    	tablehtml+='<tr>';
        if(i == 14) tablehtml+='<td style = "border-bottom-left-radius: 20px">第' + i + '节</td>';
        else tablehtml+='<td>第' + i + '节</td>';
    	for(var j = 0; j < 7; ++j)
        {
            if(!visibleCell[i][j])continue;
            tablehtml+='<td class="xkCell" unit=' + i + ' weekday=' + j;
            if(i == 14 && j == 6) tablehtml+='<td style = "border-bottom-right-radius: 20px">';
            var arrange=selectedArrangeAtTime[i][j];
            var cinfo;
            if(selectedAtTime[i][j]>0)
            {
                cinfo=courseInfo[selectedAtTime[i][j]];
                tablehtml+=' cid="' + cinfo.no + '" rowspan=' + (arrange.endUnit-arrange.startUnit+1);
            }
            tablehtml+='>';
            if(selectedAtTime[i][j]>0)
            {
                if(arrange.rooms!='')
                {
                    tablehtml+=cinfo.no + '<br />' + cinfo.name + '<br /><strong>' + arrange.rooms[0] + '</strong>' + arrange.rooms.substring(1);
                }
                
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
    }).unbind('click').click(function(){
        if($(this).attr("cid")!=undefined){
            showCourseDetail($(this).attr("cid"));
        }
        else{
            $("#tipForm tbody").html(getCoursesResult(getCoursesAtTime(
                $(this).attr("unit"),$(this).attr("weekday")
            )));
            $('[data-toggle="tooltip"]').tooltip();
            /*$("#tipPanel").hide().fadeIn("fast")
            .css("top",$(this).offset().top+$(this).height()/2)
            .css("left",$(this).offset().left+$(this).width()/2);*/
            $("#tipModal").modal('show');
        }
    });
}

function getCourseType(cno)
{
    var courseID=cno.split('.')[0];
    if(coursetype[courseID]==null)return {kind:6,attr:0,require:0};
    var kind=coursetype[courseID].kind,attr=parseInt(coursetype[courseID].attr);
    console.log(typelist[kind][attr].credits+","+typelist[kind][attr].planned);
    var require=typelist[kind][attr].credits-typelist[kind][attr].planned;
    return {kind:kind,attr:attr,require:require};
}
function getCoursesResult(list)
{
    var sortlist=[];
    for(var i in list)
    {
        var arrange=list[i];
        var cid=arrange.cid;
        var cinfo=courseInfo[cid];
        var ctype=getCourseType(courseInfo[cid].no);
        sortlist.push({arrange:list[i],coursetype:ctype,test:selectableTest(cid)});
    }
    perference=getuiPerference();
    sortlist.sort(tempcomparer);
    //console.log(sortlist);
    var res="";
    for(var i in sortlist)
    {
        var arrange=sortlist[i].arrange;
        var cid=arrange.cid;
        var cinfo=courseInfo[cid];
        var ctag='';
        if(sortlist[i].coursetype.kind<6)
        {
            var type=typelist[sortlist[i].coursetype.kind][sortlist[i].coursetype.attr];
            if(type.name!='通识选修') //通识选修没意义
            {
                var taginfo='',tagicon='';
                ctag=type.tag;
                if(ctag==null)ctag='';
                if(type.credits<=type.planned+0.01)
                {
                    if(type.planned-type.complete>=0.01)
                    {
                        taginfo='您已在本学期安排至少'+(type.planned-type.complete)+'学分，可以修读完本类别';
                    }
                    else
                    {
                        taginfo='您已在之前学期修读完本类别';
                    }
                    tagicon='<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>';
                }
                else
                {
                    if(type.planned-type.complete>=0.01)
                    {
                        taginfo='您已在本学期安排'+(type.planned-type.complete)+'学分，本类别还需额外'+(type.credits-type.planned)+'/'+ type.credits+'学分';
                    }
                    else
                    {
                        taginfo='本类别还需要'+(type.credits-type.planned)+'/'+ type.credits+'学分';
                    }
                    tagicon='<span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span>';
                }
                ctag='<a href="javascript:void(0);" style="color:black" data-toggle="tooltip" data-placement="left" title="'+taginfo+'">'
                    +tagicon+ctag+"</a>";
                
            }
            //console.log(sortlist[i].coursetype.kind + "," + sortlist[i].coursetype.attr + ":" + typelist[sortlist[i].coursetype.kind][sortlist[i].coursetype.attr].tag);
        }
        if(i==0||sortlist[i].coursetype.kind!=sortlist[i-1].coursetype.kind)
        {
            //console.log(sortlist[i].coursetype);
            res+="<tr><td colspan=8><strong>" + typenamelist[sortlist[i].coursetype.kind] + "</strong></td></tr>";
        }
        res+="<tr><td>" + cinfo.no + "</td><td>" + 
            "<a href=\"javascript:showCourseDetail('" + cinfo.no + "');\">" + cinfo.name + "</a>" + "</td><td>"
            + cinfo.credits + "</td><td>"
            + cinfo.teachers + "</td><td>" + arrange.startUnit + "-" + arrange.endUnit + " " + arrange.rooms + "</td><td>"
            + ctag + "</td><td>";
        var test=sortlist[i].test;
        if(test.able==2)
        {
            res+='<a title="选课" href="#" onclick="selectCourse(' + cinfo.id + ')">选课</a>'
        }
        else if(test.able==0)
        {
            res+='<a href="javascript:void(0);" style="color:red" data-toggle="tooltip" data-placement="left" title="'+
            test.error+'">'
            + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
            + test.short+'</a>'
        }
        else if(test.able==1)
        {
            res+='<a href="javascript:void(0);" style="color:orange" data-toggle="tooltip" data-placement="left" title="'+
            test.error+'" onclick="selectCourse(' + cinfo.id + ')">'
            + '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'
            + test.short+'</a>'
        }
        res+='</td></tr>';
    }
    return res;
}
