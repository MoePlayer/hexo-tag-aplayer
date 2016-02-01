/**
* hexo-tag-aplayer
* https://github.com/grzhan/hexo-tag-aplayer
* Copyright (c) 2016, grzhan
* Licensed under the MIT license.
*
* Syntax:
*  {% aplayer title author url [picture_url] %}
*/
var fs = require('hexo-fs'),
	util = require('hexo-util'),
	path = require('path'),
	counter = 0,
	srcDir = path.join(__dirname, 'node_modules', 'aplayer', 'dist'),
	aplayerScript = 'APlayer.min.js',
	aplayerStyle = 'APlayer.min.css',
	aplayerDefaultPic = 'default.jpg',
	aplayerQueue = [],
	aplayerFontFiles = fs.listDirSync(path.join(srcDir,'font')),
	registers = [
		[aplayerStyle, 'assets/css/' + aplayerStyle, path.join(srcDir, aplayerStyle)],
		[aplayerScript, 'assets/js/' + aplayerScript, path.join(srcDir, aplayerScript)],
		['aplayer.default.pic', 'assets/css/' + aplayerDefaultPic, path.join(srcDir, aplayerDefaultPic)]
	];

aplayerFontFiles.map(function(file) {
	registers.push(['APlayer.font', 'assets/css/font/' + file, path.join(srcDir, 'font', file)]);
});

for (var i = 0; i < registers.length; ++i) {
	(function (i) {
		var register = registers[i], regName = register[0],
			pubPath = register[1], srcPath = register[2];
		hexo.extend.generator.register(regName, function(locals) {
			return {
				path: pubPath,
				data: function() {
					return fs.createReadStream(srcPath);
				}
			};
		});
	})(i);
}

hexo.extend.filter.register('after_post_render', function(data) {
	data.content = 
		util.htmlTag('link', {rel: 'stylesheet', type: 'text/css', href: '/assets/css/' + aplayerStyle }) +
		util.htmlTag('script', {src: '/assets/js/' + aplayerScript}, " ")+ 
		data.content;
	for (var i=0, args = []; i < aplayerQueue.length; ++i) {
		args = aplayerQueue[i];
		data.content += 			
			'<script>var '+ args[0] + ' = new APlayer({'+ 
					'element: document.getElementById("'+ args[0] +'"),' +
					'narrow: false,' +
					'autoplay: true,' +
					'showlrc: false,' +
					'music : {' +
						'title: "'+ args[1] +'",' +
						'author: "'+ args[2] +'",' +
						'url: "'+ args[3] + '",' +
						'pic: "'+ args[4] + '"' +
					'}' +
				'});' +
			args[0] + '.init();</script>';
	}
	aplayerQueue = [];
	return data;
});

// {% aplayer title author url [picture_url] %}
hexo.extend.tag.register('aplayer', function(args) {
	var title = args[0],
		author = args[1],
		url = args[2],
		pic = args[3] || '',
		id = 'aplayer' + (counter++);
		raw =  '<div id="'+ id + '" class="aplayer" style="max-width: 500px; margin-bottom: 20px;"></div>';
	aplayerQueue.push([id, title, author, url, pic]);
	return raw;
});



