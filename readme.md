PPDP
A node.js script that trasverse all posts on Dcard sex forum and save all imgur photo links in .photo_link.txt.
You can use any download tools to download all the pictures on the list(e.g. wget, curl etc.).
The .photo_link.txt in the repo is all the imgur links posted before 12, Dec, 2016.
If you want to trasverse all the links on your own : 

* install node.js. Go to 

		https://nodejs.org/en/

	to download a version that suits your computer.

* Install request package:

		npm install request

	or
		yarn add request

* then run the grepcard.js script:

	ndoe grepcard.js

* You can then use other package to download pictures(or simply writeFileSync() in binary). If you have GNU wget, there is a script for download all the pictures on the list:

	sh pgdl.sh


enjoy.

GPL license, thanks.
