$( document ).ready(function() {
    $("#search-bar").hide();
})

$(".form_datetime").datetimepicker({
    format: "yyyy-mm-dd hh:ii",
    autoclose: true,
    todayBtn: true,
    pickerPosition: "bottom-left"
});

loadMyExams();
loadCountDown(myExams);
$('#calendar').fullCalendar({
    theme: false,
    buttonText: {
        today: '今天',
        //month: '月视图'
    },
    weekends: false,
    titleFormat: {
        month: 'YYYY年 MMMM月'
    },
    monthNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    dayNames: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    header: {
        //left: 'prev,next',
        //right: 'title',
        //right: 'month'
    },
    events: myExams,
    eventClick:function(event){
        for(var i in myExams)
        {
            if(myExams[i].title==event.title)
            {
                modifyExam(i);
                $("#myModal").modal();
                break;
            }
        }
    }
});

function loadCountDown(myExams) {
    var html='',htmlpast='';
    html+='<table class="table">';
    html+='<thead>\
        <tr>\
            <th>倒计时</th>\
            <th>日期</th>\
            <th>时间</th>\
            <th>科目</th>\
            <th>教室</th>\
            <th>方式</th>\
            <th>操作</th>\
        </tr>\
        </thead>';
    html+='<tbody>';
    htmlpast=html.replace("<th>倒计时</th>","");
    for(var i=0;i<myExams.length;i++)
    {
        var today = new Date();
        var time = new Date(myExams[i].start);
        var str="";
        var count=Math.floor((time.getTime() - today.getTime())/ 86400000 + 1);
        str += '<tr>';
        if(count>=0)str += '<td>' + count;
        str += '<td>' + myExams[i].start + '</td>';
        str += '<td>' + myExams[i].time + '</td>';
        str += '<td>' + myExams[i].title + '</td>';
        str += '<td>' + myExams[i].position + '</td>';
        str += '<td>' + $("select[name=method] option[value='" + myExams[i].method + "']").text() + '</td>';
        str += '<td>' + '<button type="button" class="btn btn-warning btn-xs" data-toggle="modal" data-target="#myModal" onclick="modifyExam(' + i + ')">\
  修改\
</button>' + '&nbsp;<button type="button" class="btn btn-danger btn-xs" onclick="deleteExam(' + i + ')">删除</button>'
    + '</td>';
        str += '</tr>';
        if(count>=0)html+=str;else htmlpast+=str;
    }
    html += '</tbody>';
    html += '</table>';
    htmlpast += '</tbody>';
    htmlpast += '</table>';
    $('#countDown').html(html);
    $('#pastExam').html(htmlpast);
}
function refreshPage()
{
    location.reload();
}
var modifiedItem;
function modifyExam(examInfoIndex)
{
    modifiedItem=examInfoIndex;
    if(examInfoIndex>=0)
    {
        $("#modifyExamInfo #title").val(myExams[examInfoIndex].title);
        $("#modifyExamInfo #date_time").val(myExams[examInfoIndex].start + ' ' + myExams[examInfoIndex].time);
        $("#modifyExamInfo #position").val(myExams[examInfoIndex].position);
        $("#modifyExamInfo #method").val(myExams[examInfoIndex].method);
        $('.selectpicker').selectpicker('val', myExams[examInfoIndex].method);
    }
    else
    {
        $("#modifyExamInfo #title").val('');
        $("#modifyExamInfo #date_time").val('2016-07-01 09:00');
        $("#modifyExamInfo #position").val('');

    }
}
function commitModify()
{
    if(modifiedItem==-1)
    {
        myExams.push({});
        modifiedItem=myExams.length-1;
    }
    myExams[modifiedItem].title=$("#modifyExamInfo #title").val();
    myExams[modifiedItem].start=$("#modifyExamInfo #date_time").val().split(' ')[0];
    myExams[modifiedItem].time=$("#modifyExamInfo #date_time").val().split(' ')[1];
    myExams[modifiedItem].position=$("#modifyExamInfo #position").val();
    myExams[modifiedItem].method=$("#modifyExamInfo #method").val();

    sortExamInfo();
    saveExamInfo();
    refreshPage();
}
function removeAllPast()
{

    for(var i=myExams.length-1;i>=0;i--)
    {
        var today = new Date();
        var time = new Date(myExams[i].start);
        var count=Math.floor((time.getTime() - today.getTime())/ 86400000 + 1);
        if(count<=0)myExams.splice(i,1);
    }
    sortExamInfo();
    saveExamInfo();
    refreshPage();
}