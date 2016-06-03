//my:585302,590248,583838,587271,586870,586521,588193,590458,585851,588041

/*tablehtml += '<p>总学分：'+ getSelectedCredits() +'</p>';*/

$('#modal_courseDetail').on('hidden.bs.modal', function (e) {
    $('body').addClass('modal-open');
});

$(document).ready(function(){
    initCoursetype();
    initFilter();
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
    var visibleCell=prepareSelectAtTime();
    tablehtml+='<tbody id = "coursebody">';
    for(var i = 1; i <= 14; ++i)
    {
    	tablehtml+='<tr>';
        if(i == 14) tablehtml+='<td style = "border-bottom-left-radius: 20px">第' + i + '节</td>';
        else tablehtml+='<td>第' + i + '节</td>';
    	for(var j = 0; j < 7; ++j)
        {
            if(!visibleCell[i][j])continue;
            tablehtml+='<td class="xkCell ' + (selectedAtTime[i][j]!=0?'courseCell':'noCourseCell') +'" unit=' + i + ' weekday=' + j;
            if(i == 14 && j == 6) tablehtml+='<td style = "border-bottom-right-radius: 20px" ';
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
                    var coursetext=cinfo.no + '<br />' + cinfo.name + '<br /><strong>' + arrange.rooms[0] + '</strong>' + arrange.rooms.substring(1);
                    if(coursefilter[0]!=null)
                    {
                        var type=getCourseTypeInfo(cinfo.no);
                        if(type.kind==coursefilter[0].kind&&type.attr==coursefilter[0].attr)
                        {
                            coursetext='<strong style="color:#16a085">'+coursetext+'</strong>';
                        }
                    }
                    tablehtml+=coursetext;
                }
                
            }
            else if(selectedAtTime[i][j]==0)
            {
                if(selectableByTime[i][j].length>0)
                    tablehtml+=selectableByTime[i][j].length;
            }
            tablehtml+='</td>';
        }
    		
    	tablehtml+='</tr>';

    }
    tablehtml+='</tbody>';
    tablehtml += '</table>';
    getSelectedCredits();
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
function getSelectedCredits()
{
    var res=0;
    for(var i in selectedCourse)
    {
        res+=courseInfo[selectedCourse[i]].credits;
    }
    $('#courseCredit').html("已选学分：<span>"+ res.toFixed(1) + "</span>");
    return res;
}
function getCoursesResult(list)
{
    var sortlist=[];
    for(var i in list)
    {
        var arrange=list[i];
        var cid=arrange.cid;
        var cinfo=courseInfo[cid];
        var ctype=getCourseTypeInfo(courseInfo[cid].no);
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


function initFilter()
{
    $('.tagsinput').tagsinput('removeAll');
    $('.tagsinput-primary').show();
    var filtertype=localStorage['filtertype'];
    var filterattr=localStorage['filterattr'];
    if(filtertype!=null&&filterattr!=null)
    {
        $('.tagsinput').tagsinput('add','课程类别筛选：' + typenamelist[filtertype] + '-' + typelist[filtertype][filterattr].name);
        coursefilter[0]={kind:filtertype,attr:filterattr};
    }
    var filtertext=localStorage['filtertext'];
    if(filtertext!=null)
    {
        $('.tagsinput').tagsinput('add','课程信息包含：' + filtertext);
        coursefilter[1]=filtertext;
    }

    $('.tagsinput-primary span').unbind('click').click(function(){
        if($(this).parent().text().includes('课程类别筛选：'))
        {
            localStorage.removeItem('filtertype');
            localStorage.removeItem('filterattr');
            location.href="coursetable.html";
        }
        else if($(this).parent().text().includes('课程信息包含：'))
        {
            localStorage.removeItem('filtertext');
            location.href="coursetable.html";
        }
    });
}