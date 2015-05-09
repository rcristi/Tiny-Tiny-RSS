(function() {
	var init = function()
	{
	setInterval(checkTitle, 1000);
	}


  	var checkTitle = function()
	{	
	var count = document.title.match(/^\((\d+)\)/);
		if(count)
			Tinycon.setBubble(count[1]);			
		else			
			Tinycon.setBubble();			
	}
	init();
})();