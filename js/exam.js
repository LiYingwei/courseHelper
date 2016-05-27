$(".form_datetime").datetimepicker({
    format: "yyyy-mm-dd hh:ii",
    autoclose: true,
    todayBtn: true,
    pickerPosition: "bottom-left"
});
var examInfo = [];
var testExamInfo = [
        {
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
        }
    ];


loadExamInfo();
loadCountDown(examInfo);
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
    events: examInfo,
});

function loadCountDown(examInfo) {
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
    for(var i=0;i<examInfo.length;i++)
    {
        var today = new Date();
        var time = new Date(examInfo[i].start);
        var str="";
        var count=Math.floor((time.getTime() - today.getTime())/ 86400000 + 1);
        str += '<tr>';
        if(count>=0)str += '<td>' + count;
        str += '<td>' + examInfo[i].start + '</td>';
        str += '<td>' + examInfo[i].time + '</td>';
        str += '<td>' + examInfo[i].title + '</td>';
        str += '<td>' + examInfo[i].position + '</td>';
        str += '<td>' + $("select[name=method] option[value='" + examInfo[i].method + "']").text() + '</td>';
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
function sortExamInfo()
{
    examInfo.sort(function(a,b){return a.start==b.start?a.time>b.time:a.start>b.start;});
}
function saveExamInfo()
{
    localStorage["exams"]=JSON.stringify(examInfo);
}
function refreshPage()
{
    location.reload();
}
function loadExamInfo()
{
    if(localStorage["exams"]==undefined)
    {
        examInfo=testExamInfo;
    }
    else
    {
        examInfo=eval("["+localStorage["exams"]+"]")[0];
    }
}
var modifiedItem;
function deleteExam(examInfoIndex)
{
    examInfo.splice(examInfoIndex,1);
    sortExamInfo();
    saveExamInfo();
    refreshPage();
}
function modifyExam(examInfoIndex)
{
    modifiedItem=examInfoIndex;
    if(examInfoIndex>=0)
    {
        $("#modifyExamInfo #title").val(examInfo[examInfoIndex].title);
        $("#modifyExamInfo #date_time").val(examInfo[examInfoIndex].start + ' ' + examInfo[examInfoIndex].time);
        $("#modifyExamInfo #position").val(examInfo[examInfoIndex].position);
        $("#modifyExamInfo #method").val(examInfo[examInfoIndex].method);
        $('.selectpicker').selectpicker('val', examInfo[examInfoIndex].method);
    }
}
function commitModify()
{
    if(modifiedItem==-1)
    {
        examInfo.push({});
        modifiedItem=examInfo.length-1;
    }
    examInfo[modifiedItem].title=$("#modifyExamInfo #title").val();
    examInfo[modifiedItem].start=$("#modifyExamInfo #date_time").val().split(' ')[0];
    examInfo[modifiedItem].time=$("#modifyExamInfo #date_time").val().split(' ')[1];
    examInfo[modifiedItem].position=$("#modifyExamInfo #position").val();
    examInfo[modifiedItem].method=$("#modifyExamInfo #method").val();

    sortExamInfo();
    saveExamInfo();
    refreshPage();
}
function removeAllPast()
{

    for(var i=examInfo.length-1;i>=0;i--)
    {
        var today = new Date();
        var time = new Date(examInfo[i].start);
        var count=Math.floor((time.getTime() - today.getTime())/ 86400000 + 1);
        if(count<=0)examInfo.splice(i,1);
    }
    sortExamInfo();
    saveExamInfo();
    refreshPage();
}