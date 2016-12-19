'use strict'

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
function scroll(LAST_ID){
	var next = "https://www.dcard.tw/_api/forums/sex/posts?popular=false&before=" + LAST_ID;
	cat(next, function(content){
		var res = JSON.parse(content);
		if(debug)console.log(res);
		for(var i = 0; i < res.length; i++){
			var link = "https://www.dcard.tw/f/sex/p/" + res[i].id;
			if(debug)console.log(link);
			//fs.writeFileSync(".dcard_pages", link, {flag:'a+'});
			cat(link, function(content){
				grep(content, REG_DCARD_IMAGE, function(link){
          console.log(link);
          //alert(link);
          var img = new Image();
          var div = document.getElementById("Dcard-Sex-Pics");

          img.onload = function() {
            div.appendChild(img);
          };

          img.src = link;


				})
			})
		}
		//scroll(res[res.length - 1].id);
	})
}


/* However, first request is HTML, which should be handled seperately */
function view_menu(url){
	var LAST_ID = "";
    cat(url, function(content){
		grep(content, REG_DCARD_PAGE, function(link){
			link = DCARD_HOST + link;
			//fs.writeFileSync(".dcard_pages", link, {flag:'a+'});
			if(debug)console.log(link);
			cat(link, function(content){
				grep(content, REG_DCARD_IMAGE, function(link){
					console.log(link);
					//fs.writeFileSync(".photo_link.txt", link + "\n", {flag:'a+'});
				})
			})
			LAST_ID = link.replace(/.*\//g, "");
		})
		if(debug)console.log(LAST_ID);
		scroll(LAST_ID);
	})

}


/* the only code that will be executed for parsing is this */
//fs.writeFileSync(".photo_link.txt", "www.dcard.com" + "\n", {flag:'a+'});
view_menu("https://www.dcard.tw/f/sex?latest=true");
