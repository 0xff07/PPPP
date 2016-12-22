function img_section_html(title, src){
		return "" +
		"<div class='container'>"+
	        "<div class='row'>"+
	            "<div class='col-lg-12'>"+
	                "<h1 class='section-heading'>" + title + "</h1>"+
		            "<img class='img-responsive img-center' src='" + src +  "' >" +
		        "</div>" +
		    "</div>" +
		"</div>" + "<br>" + "<br>" + "<br>";
}

/* regullar expressions for parsing */
	const DCARD_HOST = "https://www.dcard.tw";
	const REG_DCARD_IMAGE = /(https?:\/\/imgur\.dcard\.tw\/\S+\.jpg)/g;
	const REG_DCARD_PAGE = /<a class="PostEntry_entry_2rsgm" href="(\S+)"\s+\S+>/g;
	const DCARD_SEX_PFX = "https://www.dcard.tw/f/sex/p/";
	var debug = 1;

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


	function addDOMElement(link){
		console.log(link);
		var child = document.createElement('section');
		child.innerHTML = img_section_html("", link);
		child = child.firstChild;
		document.getElementById('dcard_sex_pics').appendChild(child);
	}


const pfx = "https://www.dcard.tw/_api/forums/sex/posts?popular=false";
function scroll(postfix){
	cat(src, function(content){
		res = JSON.parse(content)
		console.log(res);
		last_id = 0;
		for(var i = 0; i < res.length; i++){
			for(var j = 0; j < res[i].media.length; j++){
				link = res[i].media[j].url;
				console.log(link);
				addDOMElement(link);
			}
			last_id = res[i].id;
		}
	})
	scroll(pfx + "&before="+last_id);
}

/* main */
scroll(pfx);
