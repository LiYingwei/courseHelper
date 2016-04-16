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

function drawraderchart() {
    //Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#radarChart").get(0).getContext("2d");
    //This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx).Radar(data);
;

}