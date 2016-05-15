$(document).ready(function(){
	drawcoursetable();
})
function drawcoursetable() {
	var tablehtml;
	tablehtml = '<table class="table table-bordered">';
	tablehtml += '<thead>\
              <tr>\
              	<th> 时间 </th>\
                <th>星期天</th>\
                <th>星期一</th>\
                <th>星期二</th>\
                <th>星期三</th>\
                <th>星期四</th>\
                <th>星期五</th>\
                <th>星期六</th>\
              </tr>\
            </thead>';
    for(var i = 1; i <= 13; i++)
    {
    	tablehtml+='<tbody>';
    	tablehtml+='<tr>';
    	tablehtml+='<td>第' + i + '节</td>';
    	for(var j = 0; j < 7; j++)
    		tablehtml+='<td> </td>';
    	tablehtml+='</tr>';
    	tablehtml+='</tbody>';

    }
    tablehtml += '</table>';
	$('#coursetable').html(tablehtml);
}