htmlobj=$.ajax({url:"/courseHelper/header/header.html",async:false});
$("#common-header").html(htmlobj.responseText);

Sortable.create(simpleList, {
    onUpdate:function(){savePerference();}
});
$(document).ready(function(){
    loadPerference();
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
      if ( substrRegex.test(str["no"]) || substrRegex.test(str["name"]) || substrRegex.test(str["teachers"]) ) {
        matches.push(str);
      }
    });
    //console.log(matches);

    cb(matches);
  };
};



var courses = [
  {
    "id": 584582,
    "no": "BIOL110003.01",
    "name": "脑信息处理",
    "code": "BIOL110003",
    "credits": 2,
    "courseId": 37568,
    "startWeek": 1,
    "endWeek": 18,
    "courseTypeId": 112,
    "courseTypeName": "自然科学",
    "courseTypeCode": "06_03_02_03",
    "scheduled": true,
    "hasTextBook": false,
    "period": 36,
    "weekHour": 2,
    "withdrawable": true,
    "textbooks": "",
    "teachers": "曹洋",
    "campusCode": "H",
    "campusName": "邯郸校区",
    "remark": "",
    "arrangeInfo": [
      {
        "weekDay": 1,
        "weekState": "01111111111111111000000000000000000000000000000000000",
        "startUnit": 11,
        "endUnit": 12,
        "weekStateDigest": "1-16",
        "rooms": "H4303"
      }
    ]
  },
  {
    "id": 585501,
    "no": "BIOL110007.06",
    "name": "普通生物学实验",
    "code": "BIOL110007",
    "credits": 3,
    "courseId": 37572,
    "startWeek": 1,
    "endWeek": 18,
    "courseTypeId": 112,
    "courseTypeName": "自然科学",
    "courseTypeCode": "06_03_02_03",
    "scheduled": true,
    "hasTextBook": false,
    "period": 54,
    "weekHour": 3,
    "withdrawable": true,
    "textbooks": "",
    "teachers": "尹隽",
    "campusCode": "H",
    "campusName": "邯郸校区",
    "remark": "校级精品课程\n不接受期中退课",
    "arrangeInfo": [
      {
        "weekDay": 4,
        "weekState": "01111111111111111000000000000000000000000000000000000",
        "startUnit": 11,
        "endUnit": 13,
        "weekStateDigest": "1-16",
        "rooms": "H立人生物楼"
      }
    ]
  },
  {
    "id": 584584,
    "no": "BIOL110007.01",
    "name": "普通生物学实验",
    "code": "BIOL110007",
    "credits": 3,
    "courseId": 37572,
    "startWeek": 1,
    "endWeek": 18,
    "courseTypeId": 112,
    "courseTypeName": "自然科学",
    "courseTypeCode": "06_03_02_03",
    "scheduled": true,
    "hasTextBook": false,
    "period": 54,
    "weekHour": 3,
    "withdrawable": true,
    "textbooks": "",
    "teachers": "梅其春",
    "campusCode": "H",
    "campusName": "邯郸校区",
    "remark": "校级精品课程\n不接受期中退课",
    "arrangeInfo": [
      {
        "weekDay": 3,
        "weekState": "01111111111111111000000000000000000000000000000000000",
        "startUnit": 6,
        "endUnit": 8,
        "weekStateDigest": "1-16",
        "rooms": "H立人生物楼"
      }
    ]
  },
  {
    "id": 585500,
    "no": "BIOL110007.05",
    "name": "普通生物学实验",
    "code": "BIOL110007",
    "credits": 3,
    "courseId": 37572,
    "startWeek": 1,
    "endWeek": 18,
    "courseTypeId": 112,
    "courseTypeName": "自然科学",
    "courseTypeCode": "06_03_02_03",
    "scheduled": true,
    "hasTextBook": false,
    "period": 54,
    "weekHour": 3,
    "withdrawable": true,
    "textbooks": "",
    "teachers": "尹隽",
    "campusCode": "H",
    "campusName": "邯郸校区",
    "remark": "",
    "arrangeInfo": [
      {
        "weekDay": 4,
        "weekState": "01111111111111111000000000000000000000000000000000000",
        "startUnit": 6,
        "endUnit": 8,
        "weekStateDigest": "1-16",
        "rooms": "H立人生物楼"
      }
    ]
  },
  {
    "id": 585497,
    "no": "BIOL110007.02",
    "name": "普通生物学实验",
    "code": "BIOL110007",
    "credits": 3,
    "courseId": 37572,
    "startWeek": 1,
    "endWeek": 18,
    "courseTypeId": 112,
    "courseTypeName": "自然科学",
    "courseTypeCode": "06_03_02_03",
    "scheduled": true,
    "hasTextBook": false,
    "period": 54,
    "weekHour": 3,
    "withdrawable": true,
    "textbooks": "",
    "teachers": "梅其春",
    "campusCode": "H",
    "campusName": "邯郸校区",
    "remark": "校级精品课程\n不接受期中退课",
    "arrangeInfo": [
      {
        "weekDay": 3,
        "weekState": "01111111111111111000000000000000000000000000000000000",
        "startUnit": 11,
        "endUnit": 13,
        "weekStateDigest": "1-16",
        "rooms": "H立人生物楼"
      }
    ]
  }
];
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
    suggestion: Handlebars.compile('<div><strong>{{name}}</strong> <br/>  {{no}} {{teachers}}</div>')
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