/**
* hexo-tag-aplayer
* https://github.com/grzhan/hexo-tag-aplayer
* Copyright (c) 2016, grzhan
* Licensed under the MIT license.
*
* Syntax:
*  {% aplayer title author url [picture_url, narrow, autoplay] %}
*/
var fs = require('hexo-fs'),
	util = require('hexo-util'),
	path = require('path'),
	counter = 0,
	srcDir = path.dirname(require.resolve('aplayer')),
	scriptDir = 'assets/js/',
	styleDir = 'assets/css/',
	aplayerScript = 'APlayer.min.js',
	aplayerStyle = 'APlayer.min.css',
	aplayerDefaultPic = 'default.jpg',
	aplayerFontFiles = fs.listDirSync(path.join(srcDir,'font')),
	registers = [
		[aplayerStyle, styleDir + aplayerStyle, path.join(srcDir, aplayerStyle)],
		[aplayerScript, scriptDir + aplayerScript, path.join(srcDir, aplayerScript)],
		['aplayer.default.pic', styleDir + aplayerDefaultPic, path.join(srcDir, aplayerDefaultPic)]
	];

aplayerFontFiles.map(function(file) {
	registers.push(['APlayer.font',  styleDir + 'font/' + file, path.join(srcDir, 'font', file)]);
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
		util.htmlTag('link', {rel: 'stylesheet', type: 'text/css', href: '/' + styleDir + aplayerStyle }) +
		util.htmlTag('script', {src: '/' + scriptDir + aplayerScript}, " ") +
		data.content;
	return data;
});

// {% aplayer title author url [picture_url, narrow, autoplay] %}
hexo.extend.tag.register('aplayer', function(args) {
	var title = args[0], author = args[1], url = args[2],
		narrow = false, autoplay = false,
		pic = args[3] && args[3] !== 'narrow' && args[3] !== 'autoplay' ? args[3] : '',
		id = 'aplayer' + (counter++),
		raw =  '<div id="'+ id + '" class="aplayer" style="margin-bottom: 20px;"></div>';
	if (args.length > 3) {
		var options = args.slice(3);
		narrow = options.indexOf('narrow') < 0 ? false : true;
		autoplay = options.indexOf('autoplay') < 0 ? false : true;
	}
	raw +=
		'<script>var '+ id + ' = new APlayer({'+
				'element: document.getElementById("'+ id +'"),' +
				'narrow: ' + (narrow ? 'true' : 'false') + ',' +
				'autoplay: ' + (autoplay ? 'true' : 'false') + ',' +
				'showlrc: 0,' +
				'music : {' +
					'title: "'+ title +'",' +
					'author: "'+ author +'",' +
					'url: "'+ url + '",' +
					'pic: "'+ pic + '"' +
				'}' +
			'});' +
		id + '.init();</script>';
	return raw;
});
hexo.extend.tag.register('aplayerlrc', function(args, content) {
	var title = args[0], author = args[1], url = args[2],
		narrow = false, autoplay = false,
		pic = args[3] && args[3] !== 'narrow' && args[3] !== 'autoplay' ? args[3] : '',
		id = 'aplayer' + (counter++),
		raw =  '<div id="'+ id + '" class="aplayer" style="margin-bottom: 20px;"><pre class="aplayer-lrc-content">'+
        content+'</pre></div>';
	if (args.length > 3) {
		var options = args.slice(3);
		narrow = options.indexOf('narrow') < 0 ? false : true;
		autoplay = options.indexOf('autoplay') < 0 ? false : true;
	}
	raw +=
		'<script>var '+ id + ' = new APlayer({'+
				'element: document.getElementById("'+ id +'"),' +
				'narrow: ' + (narrow ? 'true' : 'false') + ',' +
				'autoplay: ' + (autoplay ? 'true' : 'false') + ',' +
				'showlrc: 2,' +
				'music : {' +
					'title: "'+ title +'",' +
					'author: "'+ author +'",' +
					'url: "'+ url + '",' +
					'pic: "'+ pic + '"' +
				'}' +
			'});' +
		id + '.init();</script>';
	return raw;
}, {ends: true});


