var person={};
var data = {
    labels : ["文理基础","通识选修","专业必修","政治选修","专业选修","六大模块"],
    datasets : [
        {
            fillColor : "rgba(100,220,220,0.5)",
            strokeColor : "rgba(100,220,220,1)",
            pointColor : "rgba(100,220,220,1)",
            pointStrokeColor : "#fff",
            data : [0,0,0,0,0,0]  //顺序是 通识-》专业-》政治-》专选-》六模-》基础
        },
        {
            fillColor : "rgba(220,100,220,0.5)",
            strokeColor : "rgba(220,100,220,1)",
            pointColor : "rgba(220,100,220,1)",
            pointStrokeColor : "#fff",
            data : [0,0,0,0,0,0]  //顺序是 通识-》专业-》政治-》专选-》六模-》基础
        },
        {
            fillColor : "rgba(151,187,205,0)",
            strokeColor : "rgba(151,187,205,0)",
            pointColor : "rgba(151,187,205,0)",
            pointStrokeColor : "#fff",
            data : [100,100,100,100,100,100]
        },
        {
            fillColor : "rgba(151,187,205,0)",
            strokeColor : "rgba(151,187,205,0)",
            pointColor : "rgba(151,187,205,0)",
            pointStrokeColor : "#fff",
            data : [0,0,0,0,0,0]
        },

    ]
}
initCoursetype();
$(document).ready(function(){
    getPersonalInfo();
    loadSelectedCourse();
    initCourseInfo();
    calcPersonComplete();
    calcPersonPlanned();
    drawGraphByData();

});


/*var pieData = {
    labels: [
        "Red",
        "Green",
        "Yellow"
    ],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
    };*/

//showschedule();
function calcCompleteRate(id){
    return completecreditslist[id]*100/requiredcreditslist[id];
}
function calcCompletePercent(id){
    return (completecreditslist[id]*100/requiredcreditslist[id]).toFixed(1) + "%";
}
function calcPlannedRate(id){
    return plannedcreditslist[id]*100/requiredcreditslist[id];
}
function calcPlannedPercent(id){
    return ((plannedcreditslist[id]-completecreditslist[id])*100/requiredcreditslist[id]).toFixed(1) + "%";
}
function drawGraphByData(){

    var html='';
    var courseName = ["文理基础","通识选修","专业必修","政治选修","专业选修","六大模块"];
    var completeRate = [calcCompletePercent(0),calcCompletePercent(1),calcCompletePercent(2),calcCompletePercent(3),calcCompletePercent(4),calcCompletePercent(5)];
    data.datasets[0].data=[calcPlannedRate(1),calcPlannedRate(2),calcPlannedRate(3),calcPlannedRate(4),calcPlannedRate(5),calcPlannedRate(0)];
    var plannedRate = [calcPlannedPercent(0),calcPlannedPercent(1),calcPlannedPercent(2),calcPlannedPercent(3),calcPlannedPercent(4),calcPlannedPercent(5)];
    data.datasets[1].data=[calcCompleteRate(0),calcCompleteRate(1),calcCompleteRate(2),calcCompleteRate(3),calcCompleteRate(4),calcCompleteRate(5)];
    for(var i=0;i<6;i++)
    {
        html+='<div class="row">\
            <div class="col-xs-3">\
                <a href="javascript:showChartForm('+i+');">' +
                    courseName[i] +
                '</a>\
            </div>\
            <div class="progress" style="margin-top: 10px;margin-bottom: 10px;">\
                <div class="progress-bar" style="width: ' + completeRate[i] + ';">' + completeRate[i] +'</div>\
                <div class="progress-bar" style="width: ' + plannedRate[i] + ';background:orange;">' + plannedRate[i] +'</div>\
            </div>\
          </div>';
    }
    $('#scheduleprogress').html(html);
    drawraderchart();
}
function showschedule() {
}

function showChartForm(No) {
    var html='<table class="table table-bordered">';
    html+='<thead>\
        <tr>\
            <th>分类</th>\
            <th>应修</th>\
            <th>已修</th>\
            <th>计划</th>\
            <th>推荐课程</th>\
            <th>操作</th>\
        </tr>\
    </thead>';
    html += '<tbody>';
    for(var i=0;i<typelist[No].length;i++)
    {
        html += '<tr>';
        html += '<td>' + typelist[No][i].name + '</td>';
        html += '<td>' + typelist[No][i].credits + '</td>';
        html += '<td>' + typelist[No][i].complete + '</td>';
        html += '<td>' + (typelist[No][i].planned-typelist[No][i].complete) + '</td>';
        html += '<td class="className" data-toggle="modal" onclick="showCourseDetail(\''+'COMP130138.01'+'\')">' + (typelist[No][i].planned+0.01>typelist[No][i].credits?'':'本学期没开设') + '</td>';
        html += '<td>' + '<button type="button" class="btn btn-success btn-xs" data-toggle="modal" data-target="#selectCousre">更多</button>' + '</td>';
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    console.log(html);
    $('#classReference2').html(html);
}


function drawraderchart() {
    //Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#radarChart").get(0).getContext("2d");
    //This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx).Radar(data);
}

function getPersonalInfo()
{
    if(localStorage["person"]==undefined)
    {
        alert("请先点击右上角登陆/同步以获取你的个人信息~");
    }
    else
    {
        person=eval("["+localStorage["person"]+"]")[0];
        $("#pname").text(person.name);
        $("#pyear").text(person.year);
        $("#pdepartment").text(person.department);
        $("#pavgscore").text('过低');
        $("#pmajor").text(person.major);
        $("#psex").text(person.sex);
        $("#pallcredits").text(person.calcredits);
        $("#pneedcredits").text(152);
    }
}



