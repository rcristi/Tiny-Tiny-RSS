<?php
class Favicon_Badge extends Plugin {

	function about() {
		return array(1.0,
			"Add a badge to favicon",
			"ZeGuigui");
	}

	function get_js() {
		$js1 = file_get_contents(dirname(__FILE__) . "/favicon.js");
		$js2 = file_get_contents(dirname(__FILE__) . "/init.js");
		return $js1 . "\n" . $js2;
	}

}
?>
