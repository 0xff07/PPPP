'use strict'

function img_section_html(title, src){
		return "" +
		"<div class=\"container\">"+
	        "<div class=\"row\">"+
	            "<div class=\"col-lg-12\">"+
	                "<h1 class=\"section-heading\">" + title + "</h1>"+
		            "<img class=\"img-responsive img-center\" src=\"" + src +  "\" />" +
		        "</div>" +
		    "</div>" +
		"</div>" + "<br>" + "<br>" + "<br>";
}

/* regullar expressions for parsing */
	const DCARD_HOST = "https://www.dcard.tw";
	const REG_DCARD_IMAGE = /(https?:\/\/imgur\.dcard\.tw\/\S+\.jpg)/g;
	const REG_DCARD_PAGE = /<a class="PostEntry_entry_2rsgm" href="(\S+)"\s+\S+>/g;
	var debug = 0;
	var src = "https://www.dcard.tw/f/sex?latest=true";

	function cat(theUrl, callback)
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
	    	callback(xmlHttp.responseText);
	  }
	  xmlHttp.open("GET", theUrl, true); // true for asynchronous
	  xmlHttp.send(null);
	}

	function grep(source, format, callback){
		if(!source){
			return;
		}
		var res = source.match(format);
		if(res == null){
			return -1;
		}
		for(var i = 0; i < res.length; i++){
			res[i] = res[i].replace(format, "$1");
			if(callback)callback(res[i]);
		}
	}



	/* Dcard use "last post sent id" as postfix in request header. It sends responses in JSON*/
	function scroll(LAST_ID, depth){
		if(!depth)return;
		var next = "https://www.dcard.tw/_api/forums/sex/posts?popular=false&before=" + LAST_ID;
		cat(next, function(content){
			var res = JSON.parse(content);
			if(debug)console.log(res);
			for(var i = 0; i < res.length; i++){
				var link = "https://www.dcard.tw/f/sex/p/" + res[i].id;
				if(debug)console.log(link);
				cat(link, function(content){
					grep(content, REG_DCARD_IMAGE, function(link){
	          console.log(link);
						var child = document.createElement('section');
						child.innerHTML = img_section_html("", link);
						child = child.firstChild;
						document.getElementById('dcard_sex_pics').appendChild(child);
					})
				})
			}
			//scroll(res[res.length - 1].id, depth - 1);
		})
	}


	/* However, first request is HTML, which should be handled seperately */
	function view_menu(url){
		var LAST_ID = "";
	    cat(url, function(content){
			var depth = 3;
			grep(content, REG_DCARD_PAGE, function(link){
				link = DCARD_HOST + link;
				if(debug)console.log(link);
				cat(link, function(content){
					grep(content, REG_DCARD_IMAGE, function(link){
						console.log(link);
					})
				})
				LAST_ID = link.replace(/.*\//g, "");
			})
			if(debug)console.log(LAST_ID);
			scroll(LAST_ID, depth - 1);
		})

	}

/* the only code that will be executed for parsing is this */
view_menu("https://www.dcard.tw/f/sex?latest=true");
