htmlobj=$.ajax({url:"/courseHelper/header/header.html",async:false});
$("#common-header").html(htmlobj.responseText);
$('navbarInput-01.typeahead').typeahead
({
	/*source: function (query, process) 
	{
    	$.ajax({
      	url: '/js/courseinfo.js',
       	type: 'POST',
       	dataType: 'JSON',
       	data: query,
       	success: function(data) 
       	{
      		console.log(data);
      		process(data);
        }
      	});
   	}*/
   	source: function(query, process) 
   	{
         return ["Deluxe Bicycle", "Super Deluxe Trampoline", "Super Duper Scooter"];
    }
});
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