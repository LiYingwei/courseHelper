$(document).ready(function(){
    loadtab2();
    //$('#maintab1').addClass('hidden');
    //$('#maintab2').addClass('hidden');
    //$('#maintab3').addClass('hidden');
	//drawcoursetable();
    //showschedule();
    //drawraderchart();
})

function loadtab1()
{
    $('#maintab1').removeClass('hidden');
    $('#maintab2').addClass('hidden');
    $('#maintab3').addClass('hidden');
    $('#login').addClass('hidden');

    $('#tab1').addClass("active");
    $('#tab2').removeClass("active");
    $('#tab3').removeClass("active");
    $('#login').removeClass("active");
    drawcoursetable();
}

function loadtab2()
{
    $('#maintab1').addClass('hidden');
    $('#maintab2').removeClass('hidden');
    $('#maintab3').addClass('hidden');
    $('#login').addClass('hidden');

    $('#tab1').removeClass("active");
    $('#tab2').addClass("active");
    $('#tab3').removeClass("active");
    $('#login').removeClass("active");
    showschedule();
    if($('#radarChart').hasClass("raw")) {
        $('#radarChart').removeClass("raw")
        drawraderchart();
    }
}

function loadtab3()
{
    $('#maintab1').addClass('hidden');
    $('#maintab2').addClass('hidden');
    $('#maintab3').removeClass('hidden');
    $('#login').addClass('hidden');

    $('#tab1').removeClass("active");
    $('#tab2').removeClass("active");
    $('#tab3').addClass("active");
    $('#login').removeClass("active");
    loadCountDown([
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
    ]);
}

function loadlogin()
{
    $('#maintab1').addClass('hidden');
    $('#maintab2').addClass('hidden');
    $('#maintab3').addClass('hidden');
    $('#login').removeClass('hidden');

    $('#maintab1').removeClass("active");
    $('#maintab2').removeClass("active");
    $('#maintab3').removeClass("active");
    $('#login').addClass("active");
}