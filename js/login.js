$("#login_goto").attr("value",window.location.href);
$(function(){
    $('.button-checkbox').each(function(){
		var $widget = $(this),
			$button = $widget.find('button'),
			$checkbox = $widget.find('input:checkbox'),
			color = $button.data('color'),
			settings = {
					on: {
						icon: 'glyphicon glyphicon-check'
					},
					off: {
						icon: 'glyphicon glyphicon-unchecked'
					}
			};
		$button.on('click', function () {
			$checkbox.prop('checked', !$checkbox.is(':checked'));
			$checkbox.triggerHandler('change');
			updateDisplay();
		});

		$checkbox.on('change', function () {
			updateDisplay();
		});

		function updateDisplay() {
			var isChecked = $checkbox.is(':checked');
			// Set the button's state
			$button.data('state', (isChecked) ? "on" : "off");

			// Set the button's icon
			$button.find('.state-icon')
				.removeClass()
				.addClass('state-icon ' + settings[$button.data('state')].icon);

			// Update the button's color
			if (isChecked) {
				$button
					.removeClass('btn-default')
					.addClass('btn-' + color + ' active');
			}
			else
			{
				$button
					.removeClass('btn-' + color + ' active')
					.addClass('btn-default');
			}
		}
		function init() {
			updateDisplay();
			// Inject the icon if applicable
			if ($button.find('.state-icon').length == 0) {
				$button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
			}
		}
		init();
	});
});
$(document).ready(function(){
	$('#loginbutton').click(function(){
		//alert($('[name=IDToken1]').val());
		localStorage['username']=$('[name=IDToken1]').val();
	});
});
var killevent=false;
$('#iframe1').load(function(){
	if(killevent)
	{
		killevent=false;
		return;
	}
	var addr="";
	try
	{
		addr=$('#iframe1')[0].contentWindow.location.href;
		if(addr==window.location.href)
		{
			window.location.href="getdata.html";
		}
	}
	catch(err){}
	$('#errdiv').css('height','500px').css('width','960px');
	$('#errdiv p').html('登陆失败，请手动在urp上登陆！');
	$('#login').hide();
	$('#iframe1')[0].contentWindow.location.href="https://uis1.fudan.edu.cn/amserver/UI/Login?goto=" + window.location.href;
	killevent=true;
});