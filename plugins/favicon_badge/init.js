(function() {
	var init = function()
	{
		console.log("Init favicon");
		setInterval(checkTitle, 1000);
	}

  	var checkTitle = function()
	{
		var count = document.title.match(/\((\d+)\)/);
		
		if(count)
			favicon.badge(count[1]);
		else
			favicon.badge();
	}

	init();
})();