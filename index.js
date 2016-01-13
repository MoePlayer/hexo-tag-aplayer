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
	aplayerFontFiles = fs.listDirSync(path.join(srcDir,'font')),
	aplayerQueue = [];

hexo.extend.generator.register(aplayerStyle , function(locals) {
	return {
		path: 'assets/css/' + aplayerStyle,
		data: function() {
			return fs.createReadStream(path.join(srcDir, aplayerStyle));
		}
	};
});

hexo.extend.generator.register(aplayerScript, function(locals) {
	return {
		path: 'assets/js/' + aplayerScript,
		data: function() {
			return fs.createReadStream(path.join(srcDir, aplayerScript));
		}
	};
});

hexo.extend.generator.register('aplayer.default.pic', function(locals) {
	return {
		path: 'assets/css/' + aplayerDefaultPic,
		data: function() {
			return fs.createReadStream(path.join(srcDir, aplayerDefaultPic));
		}
	};
});


hexo.extend.generator.register('APlayer.font', function(locals) {
	return aplayerFontFiles.map(function(file) {
		return {
			path: 'assets/css/font/' + file,
			data: function() {
				return fs.createReadStream(path.join(srcDir, 'font', file));
			}
		};
	});
});

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



