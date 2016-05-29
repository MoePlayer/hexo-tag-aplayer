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
	request = require('sync-request'),
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
	var title = args[0], author = args[1], url = args[2], lrcPath = '',
		narrow = false, autoplay = false, lrcOpt = false, width = '',
		pic = args[3] && args[3] !== 'narrow' && args[3] !== 'autoplay' ? args[3] : '',
		id = 'aplayer' + (counter++), raw = '', content = '';
	// Parse optional arguments
	if (args.length > 3) {
		var options = args.slice(3);
		narrow = options.indexOf('narrow') < 0 ? false : true;
		autoplay = options.indexOf('autoplay') < 0 ? false : true;
		for (var i = 0; i < options.length; i++) {
			var option = options[i];
			lrcOpt = option.indexOf('lrc:') == 0 ? true : lrcOpt;
			lrcPath = option.indexOf('lrc:') == 0 ? option.slice(option.indexOf(':') + 1) : lrcPath;
			width = option.indexOf('width:') == 0 ? option + ';' : width;
		}
	}
	width = narrow ? '' : width;
	raw = '<div id="'+ id + '" class="aplayer" style="margin-bottom: 20px;'+ width + '">';
	if (lrcOpt) {
		// Generate lyric texts
		if (lrcPath.indexOf('http:') ==0 || lrcPath.indexOf('https:') ==0) {
			content = request('GET', lrcPath).getBody();
		} else {
			var PostAsset = hexo.database._models.PostAsset;
			var _path = path.join(hexo.base_dir, PostAsset.findOne({post: this._id, slug: lrcPath})._id);
			content = fs.readFileSync(_path);
		}
		raw += '<pre class="aplayer-lrc-content">' + content + '</pre>';
	}
	raw +=
		'</div><script>var '+ id + ' = new APlayer({'+
				'element: document.getElementById("'+ id +'"),' +
				'narrow: ' + (narrow ? 'true' : 'false') + ',' +
				'autoplay: ' + (autoplay ? 'true' : 'false') + ',' +
				'showlrc: ' + (lrcOpt ? '2' : '0') + ',' +
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

// {% aplayerlrc "title" "author" "url" "autoplay" %} [00:00.00]lrc here {% endaplayerlrc %}
hexo.extend.tag.register('aplayerlrc', function(args, content) {
	var title = args[0], author = args[1], url = args[2],
		narrow = false, autoplay = false,
		pic = args[3] && args[3] !== 'narrow' && args[3] !== 'autoplay' ? args[3] : '',
		id = 'aplayer' + (counter++), raw = '', width = '';
	if (args.length > 3) {
		var options = args.slice(3);
		narrow = options.indexOf('narrow') < 0 ? false : true;
		autoplay = options.indexOf('autoplay') < 0 ? false : true;
		for (var i = 0; i < options.length; i++) {
			var option = options[i];
			width = option.indexOf('width:') == 0 ? option + ';' : width;
		}
	}
	width = narrow ? '' : width;
	raw =  '<div id="'+ id + '" class="aplayer" style="margin-bottom: 20px;' + width + '">' +
			'<pre class="aplayer-lrc-content">' + content + '</pre></div>';
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
