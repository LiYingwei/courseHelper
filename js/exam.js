var event = [
        {
            title  : '人机交互',
            start  : '2016-05-10',
            time   : '8:00',
            position:'Z2333',
            method : '论文'
        },
        {
            title  : '十遍含数',
            start  : '2016-05-23',
            time   : '2:22',
            position:'H2222',
            method : '闭卷'
        },
        {
            title  : '局部解剖学',
            start  : '2016-05-31',
            time   : '12:07',
            position:'F5201',
            method : '开卷'
        }
    ];

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
    events: event,
});

function loadCountDown(event) {
    var html='<h1>倒计时&nbsp;&nbsp;&nbsp;' + '<button type="button" class="btn btn-primary btn-md" data-toggle="modal" data-target="#myModalNew">\
  新增\
</button></h1>';

    html+='<div class="modal fade" id="myModalNew" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
  <div class="modal-dialog" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="myModalLabel">新增</h4>\
      </div>\
      <div class="modal-body">\
        此处新增的表\
      </div>\
      <div class="modal-footer">\
        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
        <button type="button" class="btn btn-primary">保存</button>\
      </div>\
    </div>\
  </div>\
</div>';
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
    for(var i=0;i<event.length;i++)
    {
        var today = new Date();
        var time = new Date(event[i].start);
        html += '<tr>';
        html += '<td>' + Math.floor((time.getTime() - today.getTime())/ 86400000 + 1)  + '</td>';
        html += '<td>' + event[i].start + '</td>';
        html += '<td>' + event[i].time + '</td>';
        html += '<td>' + event[i].title + '</td>';
        html += '<td>' + event[i].position + '</td>';
        html += '<td>' + event[i].method + '</td>';
        html += '<td>' + '<button type="button" class="btn btn-warning btn-xs" data-toggle="modal" data-target="#myModalChange'+i+'">\
  修改\
</button>' + '&nbsp;<button type="button" class="btn btn-danger btn-xs">删除</button>'
    +
     '<div class="modal fade" id="myModalChange'+i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
    <div class="modal-dialog" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="myModalLabel">修改</h4>\
      </div>\
      <div class="modal-body">\
        此处一堆东西\
      </div>\
      <div class="modal-footer">\
        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
        <button type="button" class="btn btn-primary">保存</button>\
      </div>\
    </div>\
  </div>\
</div>'+
'</td>';
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    $('#countDown').html(html);
}
