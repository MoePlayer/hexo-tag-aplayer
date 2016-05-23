/**
* hexo-tag-dplayer
* https://github.com/NextMoe/hexo-tag-dplayer
* Copyright (c) 2016, grzhan
* Licensed under the MIT license.
*
* Syntax:
*  {% dplayer url api key=value ... %}
*/
var fs = require('hexo-fs'),
	util = require('hexo-util'),
	path = require('path'),
	counter = 0,
	srcDir = path.dirname(require.resolve('dplayer')),
	scriptDir = 'assets/js/',
	styleDir = 'assets/css/',
	dplayerScript = 'DPlayer.min.js',
	dplayerStyle = 'DPlayer.min.css',
	//dplayerDefaultPic = 'default.jpg',
	registers = [
		[dplayerStyle, styleDir + dplayerStyle, path.join(srcDir, dplayerStyle)],
		[dplayerScript, scriptDir + dplayerScript, path.join(srcDir, dplayerScript)],
		//['dplayer.default.pic', styleDir + dplayerDefaultPic, path.join(srcDir, dplayerDefaultPic)]
	];

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
		util.htmlTag('link', {rel: 'stylesheet', type: 'text/css', href: '/' + styleDir + dplayerStyle }) +
		util.htmlTag('script', {src: '/' + scriptDir + dplayerScript}, " ") +
		data.content;
	return data;
});

// {% dplayer url api key=value ... %}
hexo.extend.tag.register('dplayer', function(args) {
	var	url = args[0], api = args[1],
        loop = false, autoplay = false, theme = "null", pic="null", did="null", token="null";
        id = 'dplayer' + (counter++);
		raw =  '<div id="'+ id + '" class="dplayer" style="margin-bottom: 20px;"></div>';
    for (var i = 0; i < args.length; ++i) {
        arg=args[i];
        if(arg.split('=').length!=2)
            continue;
        switch(arg.split('=')[0]){
            case 'autoplay':
                if(arg.split('=')[1]=='true'||arg.split('=')[1]=='yes'||arg.split('=')[1]=='1')
                    autoplay = true;
                break;
            case 'loop':
                if(arg.split('=')[1]=='true'||arg.split('=')[1]=='yes'||arg.split('=')[1]=='1')
                    loop = true;
                break;
            case 'pic':
                pic = arg.split('=')[1];
                break;
            case 'id':
                did = arg.split('=')[1];
                break;
            case 'token':
                token = arg.split('=')[1];
                break;
        }
    }
    
	raw +=
		'<script>var '+ id + ' = new DPlayer({'+
				'element: document.getElementById("'+ id +'"),' +
				'autoplay: ' + (autoplay ? 'true' : 'false') + ',' +
                'loop: ' + (loop ? 'true' : 'false') + ',' +
                (theme == 'null' ? '': 'theme: "' + theme + '",') +
				'video : {' +
					'url: "'+ url + '",' +
					(pic == 'null' ? '': 'pic: "'+ pic + '"') +
				'}, ' +
                'danmaku : {' +
					(did == 'null' ? '': 'id: "'+ did + '"') +
					'api: "'+ api + '",' +
                    (token == 'null' ? '': 'token: "'+ token + '"') +
				'}' +
			'});' +
		id + '.init();</script>';
	return raw;
});