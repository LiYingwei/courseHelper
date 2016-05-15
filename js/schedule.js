var data = {
    labels : ["文理基础","通识选修","专业必修","政治选修","专业选修","六大模块"],
    datasets : [
        {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [60,30,20,50,80,66]
        },
        {
            fillColor : "rgba(151,187,205,0)",
            strokeColor : "rgba(151,187,205,0)",
            pointColor : "rgba(151,187,205,0)",
            pointStrokeColor : "#fff",
            data : [100,100,100,100,100,100]
        }
    ]
}

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
        html += '<td class="className" data-toggle="modal" data-target="#courseInfo'+ (No-1) + '_' + i+'">' + classReference.reference[No-1][i].class + '</td>';
        html += '<div class="modal fade" id="courseInfo'+ (No-1) + '_' + i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
                    <div class="modal-dialog" role="document">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                        <h4 class="modal-title" id="myModalLabel">'+ classReference.reference[No-1][i].class +'</h4>\
                      </div>\
                      <div class="modal-body">\
                        此处显示各种相关信息\
                      </div>\
                      <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#selectCousre'+ (No-1) + '_' + i+'">选课</button>\
                      </div>\
                    </div>\
                  </div>\
                </div>'+ '</td>';

        html += '<td>' + '<button type="button" class="btn btn-success btn-xs" data-toggle="modal" data-target="#selectCousre'+ (No-1) + '_' + i+'">选课</button>' ;
        html += '<div class="modal fade" id="selectCousre'+ (No-1) + '_' + i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
                    <div class="modal-dialog" role="document">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                        <h4 class="modal-title" id="myModalLabel">选课成功</h4>\
                      </div>\
                      <div class="modal-body">\
                        已经排到你的课表上\
                      </div>\
                    </div>\
                  </div>\
                </div>'+ '</td>';
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    $('#classReference2').html(html);
}


function drawraderchart() {
    //Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#radarChart").get(0).getContext("2d");
    //This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx).Radar(data);
}