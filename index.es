/**
* hexo-tag-aplayer
* https://github.com/grzhan/hexo-tag-aplayer
* Copyright (c) 2016, grzhan
* Licensed under the MIT license.
*
* Syntax:
*  {% aplayer title author url [picture_url, narrow, autoplay] %}
*/
require('babel-polyfill');
let fs = require('hexo-fs'),
	util = require('hexo-util'),
	path = require('path'),
	request = require('sync-request'),
	counter = 0,
	srcDir = path.dirname(require.resolve('aplayer')),
	scriptDir = path.join('assets', 'js/'),
	aplayerScript = 'APlayer.min.js',
	registers = [
		[aplayerScript, scriptDir + aplayerScript, path.join(srcDir, aplayerScript)]
	];

registers.forEach((register) => {
	let [regName, path, srcPath] = register;
	hexo.extend.generator.register(regName, () => {
		return {
			path,
			data() {
				return fs.createReadStream(srcPath);
			}
		};
	});
});


hexo.extend.filter.register('after_post_render', (data) => {
    const root = hexo.config.root ? hexo.config.root : '/';
	data.content =
		util.htmlTag('script', {src: path.join(root, '/', scriptDir, aplayerScript)}, ' ') +
		data.content;
	return data;
});

// {% aplayer title author url [picture_url, narrow, autoplay] %}
hexo.extend.tag.register('aplayer', function(args) {
	let [title, author, url] = args, lrcPath = '',
		narrow = false, autoplay = false, lrcOpt = false, width = '',
		pic = args[3] && args[3] !== 'narrow' && args[3] !== 'autoplay'
					  && !args[3].includes('lrc:') && !args[3].includes('width:') ? args[3] : '',
		id = 'aplayer' + (counter++), raw = '', content = '';
	// Parse optional arguments
	if (args.length > 3) {
		let options = args.slice(3);
		narrow = options.includes('narrow');
		autoplay = options.includes('autoplay');
		for (let i = 0; i < options.length; i++) {
			let option = options[i];
			lrcOpt = option.indexOf('lrc:') == 0 ? true : lrcOpt;
			lrcPath = option.indexOf('lrc:') == 0 ? option.slice(option.indexOf(':') + 1) : lrcPath;
			width = option.indexOf('width:') == 0 ? option + ';' : width;
		}
	}
	width = narrow ? '' : width;
	raw = `<div id="${id}" class="aplayer" style="margin-bottom: 20px;${width}">`;
	if (lrcOpt) {
		// Generate lyric texts
		if (lrcPath.indexOf('http:') ==0 || lrcPath.indexOf('https:') ==0) {
			content = request('GET', lrcPath).getBody();
		} else {
			let PostAsset = hexo.database._models.PostAsset;
			let _path = path.join(hexo.base_dir, PostAsset.findOne({post: this._id, slug: lrcPath})._id);
			content = fs.readFileSync(_path);
		}
		raw += `<pre class="aplayer-lrc-content">${content}</pre>`;
	}
	raw +=
		`</div>
		<script>
			new APlayer({
				element: document.getElementById("${id}"),
				narrow: ${narrow},
				autoplay: ${autoplay},
				showlrc: ${lrcOpt ? '2' : '0'},
				music: {
					title: "${title}",
					author: "${author}",
					url: "${url}",
					pic: "${pic}",
				}
			});
		</script>`;
	return raw;
});

// {% aplayerlrc "title" "author" "url" "autoplay" %} [00:00.00]lrc here {% endaplayerlrc %}
hexo.extend.tag.register('aplayerlrc', function(args, content) {
	let [title, author, url] = args,
		narrow = false, autoplay = false,
        pic = args[3] && args[3] !== 'narrow' && args[3] !== 'autoplay'
            && !args[3].includes('lrc:') && !args[3].includes('width:') ? args[3] : '',
		id = 'aplayer' + (counter++), raw = '', width = '';
	if (args.length > 3) {
		let options = args.slice(3);
		narrow = options.includes('narrow');
		autoplay = options.indexOf('autoplay');
		for (let i = 0; i < options.length; i++) {
			let option = options[i];
			width = option.indexOf('width:') == 0 ? option + ';' : width;
		}
	}
	width = narrow ? '' : width;
	raw =  `<div id="${id}" class="aplayer" style="margin-bottom: 20px;${width}">
				<pre class="aplayer-lrc-content">'${content}</pre>
			</div>
			<script>
				new APlayer({
					element: document.getElementById("${id}"),
					narrow: ${narrow},
					autoplay: ${autoplay},
					showlrc: 2,
					music: {
						title: "${title}",
						author: "${author}",
						url: "${url}",
						pic: "${pic}",
					}
				});
			</script>`;
	return raw;
}, {ends: true});

// {% aplayerlist %} {options} {% endaplayerlist %}
hexo.extend.tag.register('aplayerlist', function(args, content) {
	try {
		let options = JSON.parse(content);
		let id = 'aplayer' + (counter++);
		let defaultOptions = {
			narrow: false,
			autoplay: false,
			showlrc: 0
		};
		let resultOptions = Object.assign({}, defaultOptions, options);
		let raw = `
			<div id="${id}" class="aplayer" style="margin-bottom: 20px;"></div>
			<script>
				var options = ${JSON.stringify(resultOptions)};
				options.element = document.getElementById("${id}");
				new APlayer(options);
			</script>

		`;
		return raw;
	} catch (e) {
		console.error(e);
		return  `
			<script>
				console.error("${e}");
			</script>`;
	}

}, {ends: true});
