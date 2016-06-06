htmlobj=$.ajax({url:"header/header.html",async:false});
$("#common-header").html(htmlobj.responseText);

Sortable.create(simpleList, {
    onUpdate:function(){savePerference();}
});
function getuiPerference() {
    var preference = [];
    $('#simpleList li').each(function(i)
    {
        preference[parseInt($(this).attr('rel'))]=i;
        //preference.push($(this).attr('rel'));
    });
    preference[6]=6;
    return preference;
}
function savePerference(){
    localStorage["perference"]=getuiPerference().toString();
    //$.notify({message: '设置已经保存'},{type: 'success'});
    $('#confighint').hide().css('color','red').html('设置已经保存').fadeIn('fast').fadeOut('slow');
}
function loadPerference(){
    var namelist=[];
    if(localStorage["perference"]!=null)
    {
        var preference=eval("[" + localStorage["perference"] + "]");
        $('#simpleList li').each(function(i)
        {
            namelist[i]=$(this).html();
        });
        for(var i=0;i<6;++i)
        {
            $('#simpleList li:eq('+preference[i]+')').html(namelist[i]);
            $('#simpleList li:eq('+preference[i]+')').attr('rel',i);
        }
    }
}
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
        var type=coursetype[str.no.split('.')[0]];
        if(coursefilter[0]==null||(type!=null&&type.kind==coursefilter[0].kind&&type.attr==coursefilter[0].attr))
        {
          if ( substrRegex.test(str["no"]) || substrRegex.test(str["name"]) || substrRegex.test(str["teachers"]) ) {
            matches.push(str);
          }
        }
    });
    //console.log(matches);

    cb(matches);
  };
};
$(document).ready(function(){
    loadPerference();
    $('#the-basics .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 0
    },
    {
        name: 'courses',
        display: 'no',
        source: substringMatcher(lessonJSONs),
        templates: {
        empty: [
            '<div class="empty-message">',
            '找不到相关信息',
            '</div>'
        ].join('\n'),
        suggestion: Handlebars.compile('<div onclick="javascript:showCourseDetail(\'{{no}}\');"><strong>{{name}}</strong> <br/>  {{no}} {{teachers}}</div>')
        }
    });
    $('#the-basics .tt-input').mouseup(function(){
        $(this).select();
    })
    $('#the-basics .tt-input').keypress(function (e) {
        if (e.which == 13) {
            var text=$('#the-basics .tt-input').val().toUpperCase();
            if(courseInfo[text]!=null)
            {
                showCourseDetail(text);
            }
            else
            {
                localStorage['filtertext']=text;
                location.href="coursetable.html";
            }
            return false;    //<---- Add this line
        }
    });

    /*$("#the-basics .typeahead").on("click", function () {
        $("#the-basics .typeahead").typeahead("open");
    });*/

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
});
