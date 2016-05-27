var person={};
var data = {
    labels : ["文理基础","通识选修","专业必修","政治选修","专业选修","六大模块"],
    datasets : [
        {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [30,20,50,80,66,60]  //顺序是 通识-》专业-》政治-》专选-》六模-》基础
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
getPersonalInfo();



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

showschedule();
drawraderchart();
function showschedule() {
	var html='';
    var courseName = new Array("文理基础","通识选修","专业必修","政治选修","专业选修","六大模块");
    var completeRate = new Array("60%","30%","20%","50%","80%","66%");

    for(var i=0;i<6;i++)
    {
        html+='<div class="row">\
            <div class="col-xs-3">'
              + courseName[i] +
            '</div>\
            <div class="progress" style="margin-top: 10px;margin-bottom: 10px;">\
                <div class="progress-bar" style="width: ' + completeRate[i] + ';">' + completeRate[i] +'</div>\
            </div>\
          </div>';
    }
	$('#scheduleprogress').html(html);
}

var classReference = {
  "reference": [
    [
      {
        "type": "理科基础",
        "need": 40,
        "total": 15,
        "class": "数学分析（上）",
        "classID": "MATH120000.00"
      }
    ],
    [
      {
        "type": "通识选修",
        "need": 2,
        "total": 0,
        "class": "哲学导论",
        "classID": "PHIL110000.00"
      }
    ],
    [],
    [],
    [],
    [
      {
        "type": "一模",
        "need": 2,
        "total": 0,
        "class": "古典诗词导读",
        "classID": "CHIN119000.00"
      },
      {
        "type": "一模",
        "need": 2,
        "total": 0,
        "class": "小说",
        "classID": "CHIN119001.00"
      }
    ]
  ]
}

function showChartForm(No) {
    var html='<table class="table table-bordered">';
    html+='<thead>\
        <tr>\
            <th>分类</th>\
            <th>应修</th>\
            <th>已修</th>\
            <th>推荐课程</th>\
            <th>操作</th>\
        </tr>\
    </thead>';
    html += '<tbody>';
    for(var i=0;i<classReference.reference[No-1].length;i++)
    {
        html += '<tr>';
        html += '<td>' + classReference.reference[No-1][i].type + '</td>';
        html += '<td>' + classReference.reference[No-1][i].need + '</td>';
        html += '<td>' + classReference.reference[No-1][i].total + '</td>';
        html += '<td class="className" data-toggle="modal" onclick="setTimeout(\'drawPieChart()\',50)" data-target="#courseInfo">' + classReference.reference[No-1][i].class + '</td>';
        html += '<td>' + '<button type="button" class="btn btn-success btn-xs" data-toggle="modal" data-target="#selectCousre">选课</button>' + '</td>';
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
    }
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

    /*$('#basicInfo').html('<h6>基本信息</h6>\
        <table class="table">\
                                <tr>\
                                    <th>课程序号</th>\
                                    <td>COMP130001.01</td>\
                                    <th>联系方式</th>\
                                    <td>couresHelper@fudan.edu.cn</td>\
                                </tr>\
                                <tr>\
                                    <th>课程名称</th>\
                                    <td>人机交互</td>\
                                    <th>作业量</td>\
                                    <td>每周额外2小时</td>\
                                </tr>\
                                <tr>\
                                    <th>教师</th>\
                                    <td>丁向华</td>\
                                    <th>考试时间</th>\
                                    <td>2016.6.22</th>\
                                </tr>\
                                <tr>\
                                    <th>时间</th>\
                                    <td>周二8-9</td>\
                                    <th>地点</th>\
                                    <td>Z2333</td>\
                                </tr> \
                            </table>');*/
    /*$('#bbsInfo').html('<h6>BBS评价</h6>\
        <ul>\
            <li>这门课虽然是计算机系专业课但是涉及心理学，社会学等多学科的交叉，一学期上下来收获很大！</li>\
            <li>美女老师人很好！和颜悦色通情达理而且还找来新加坡的教授来给我们讲座！</li>\
        </ul>');*/
    /*$('#scoreInfo').html('<h6>评分要求</h6>\
        <ul>\
            <li>虽然实现项目码代码花了很多时间，但是报告真的很重要！！因为报告中包括了做项目的全部过程，比如纸模型，调研之类的。老师更关注这些。</li>\
            <li>pre占25%，期中20%，期末60%，平时15%</li>\
        </ul>');*/
}


