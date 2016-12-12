/* show only photo link if debug = 0*/
debug = 1;
fs = require('fs');

/* regullar expressions for parsing */
const DCARD_HOST = "https://www.dcard.tw";
const REG_DCARD_IMAGE = /(https?:\/\/imgur\.dcard\.tw\/\S+\.jpg)/g;
const REG_DCARD_PAGE = /<a class="PostEntry_entry_2rsgm" href="(\S+)"\s+\S+>/g;

/* works like a UNIX cat, but it cat a URL */
function cat(URL, callback)
{
	var request = require('request')
	URL = encodeURI(URL);

	request({url:URL, method:'GET'}, function(e, r, b){
		if(callback)
			callback(b);
	})
}

/* works just like UNIX grep */
function grep(source, format, callback){
	if(!source){
		return;
	}
	res = source.match(format);
	if(res == null){
		return -1;
	}
	for(var i = 0; i < res.length; i++){
		res[i] = res[i].replace(format, "$1");
		if(callback)callback(res[i]);
	}
}



/*
   what scroll(url) does :
   1. cat content of archive page
   2. grep post links(and save it to .page_link.txt)
   3. cat the content of post
   4. grep image link
   5. grep photo links and write to .photo_link.txt
   6. send request to get more content(i.e. to scroll down), and go to 1.
*/


/* Dcard use "last post sent id" as postfix in request header. It sends responses in JSON*/
function scroll(LAST_ID){
	next = "https://www.dcard.tw/_api/forums/sex/posts?popular=false&before=" + LAST_ID;
	cat(next, function(content){
		res = JSON.parse(content);
		if(debug)console.log(res);
		for(var i = 0; i < res.length; i++){
			link = "https://www.dcard.tw/f/sex/p/" + res[i].id;
			if(debug)console.log(link);
			fs.writeFileSync(".dcard_pages", link, {flag:'a+'});
			cat(link, function(content){
				grep(content, REG_DCARD_IMAGE, function(link){
					console.log(link)
					fs.writeFileSync(".photo_link.txt", link + "\n", {flag:'a+'});
				})
			})
		}
		scroll(res[res.length - 1].id);
	})
}


/* However, first request is HTML, which should be handled seperately */
function view_menu(url){
	fs = require('fs');
	LAST_ID = "";
    cat(url, function(content){
		grep(content, REG_DCARD_PAGE, function(link){
			link = DCARD_HOST + link;
			fs.writeFileSync(".dcard_pages", link, {flag:'a+'});
			if(debug)console.log(link);
			cat(link, function(content){
				grep(content, REG_DCARD_IMAGE, function(link){
					console.log(link);
					fs.writeFileSync(".photo_link.txt", link + "\n", {flag:'a+'});
				})
			})
			LAST_ID = link.replace(/.*\//g, "");
		})
		if(debug)console.log(LAST_ID);
		scroll(LAST_ID);
	})
	
}


/* the only code that will be executed for parsing is this */
fs.writeFileSync(".photo_link.txt", "www.dcard.com" + "\n", {flag:'a+'});
view_menu("https://www.dcard.tw/f/sex?latest=true");
