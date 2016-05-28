htmlobj=$.ajax({url:"/courseHelper/header/header.html",async:false});
$("#common-header").html(htmlobj.responseText);

if($("#maintab1").length>0)
{
    $('#tab1').addClass("active");
}

if($("#maintab2").length>0)
{
    $('#tab2').addClass("active");
}

if($("#maintab3").length>0)
{
    $('#tab3').addClass("active");
}