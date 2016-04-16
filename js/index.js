$(document).ready(function(){
    loadtab1();
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
    $('#tab1').addClass("active");
    $('#tab2').removeClass("active");
    $('#tab3').removeClass("active");
    drawcoursetable();
}

function loadtab2()
{
    $('#maintab1').addClass('hidden');
    $('#maintab2').removeClass('hidden');
    $('#maintab3').addClass('hidden');
    $('#tab1').removeClass("active");
    $('#tab2').addClass("active");
    $('#tab3').removeClass("active");
    showschedule();
    drawraderchart();
}