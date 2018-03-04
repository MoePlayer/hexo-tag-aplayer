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
let counter = 0;
const fs = require('hexo-fs'),
	util = require('hexo-util'),
	path = require('path'),
	urllib = require('url'),
	srcDir = path.dirname(require.resolve('aplayer')),
	scriptDir = path.join('assets', 'js/'),
	aplayerScript = 'APlayer.min.js',
	registers = [
		[aplayerScript, scriptDir + aplayerScript, path.join(srcDir, aplayerScript)]
	];

const preProcessUrl = (id, url) => {
	if (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('/')) {
		return url;
	}
	const PostAsset = hexo.model('PostAsset')
	const asset = PostAsset.findOne({post: id, slug: url});
	if (!asset) throw new Error(`Specified music file not found ${url}`);
	return urllib.resolve(hexo.config.root, asset.path);
};

registers.forEach((register) => {
	const [regName, path, srcPath] = register;
	hexo.extend.generator.register(regName, () => {
		return {
			path,
			config() {
				return fs.createReadStream(srcPath);
			}
		};
	});
});

const generateAPlayerUrl = () => {
	const aplayerConfig = hexo.config.aplayer || {};
	if (aplayerConfig.externalLink) {
		return aplayerConfig.externalLink;
	} else {
		const root = hexo.config.root ? hexo.config.root : '/';
		return path.join(root, '/', scriptDir, aplayerScript);
	}
};

hexo.extend.filter.register('after_post_render', (data) => {
	data.content =
		util.htmlTag('script', {src: generateAPlayerUrl()}, ' ') +
		data.content;
	return data;
});

// {% aplayer title author url [picture_url, narrow, autoplay] %}
hexo.extend.tag.register('aplayer', function(args) {
	let [title, author, url] = args, lrcPath = '',
		narrow = false, autoplay = false, lrcOpt = false, width = '',
		pic = args[3] && args[3] !== 'narrow' && args[3] !== 'autoplay'
					  && !args[3].includes('lrc:') && !args[3].includes('width:') ? preProcessUrl(this._id, args[3]) : '',
		id = 'aplayer' + (counter++), raw = '', content = '';
	url = preProcessUrl(this._id, url);
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
		if (lrcPath.indexOf('http:') <0 && lrcPath.indexOf('https:') <0) {
			const PostAsset = hexo.database._models.PostAsset;
			const _path = path.join(hexo.base_dir, PostAsset.findOne({post: this._id, slug: lrcPath})._id);
			content = fs.readFileSync(_path);
			raw += `<pre class="aplayer-lrc-content">${content}</pre>`;
		}
	}
	raw +=
		`</div>
		<script>
			var ap = new APlayer({
				element: document.getElementById("${id}"),
				narrow: ${narrow},
				autoplay: ${autoplay},
				showlrc: ${lrcOpt ? (content == '' ? '3' : '2') : '0'},
				music: {
					title: "${title}",
					author: "${author}",
					url: "${url}",
					pic: "${pic}",
					lrc: "${lrcOpt && content == '' ? lrcPath : ''}",
				}
			});
			window.aplayers || (window.aplayers = []);
			window.aplayers.push(ap);
		</script>`;
	return raw;
});

// {% aplayerlrc "title" "author" "url" "autoplay" %} [00:00.00]lrc here {% endaplayerlrc %}
hexo.extend.tag.register('aplayerlrc', function(args, content) {
	let [title, author, url] = args,
		narrow = false, autoplay = false,
		pic = args[3] && args[3] !== 'narrow' && args[3] !== 'autoplay'
			&& !args[3].includes('lrc:') && !args[3].includes('width:') ? preProcessUrl(this._id, args[3]) : '',
		id = 'aplayer' + (counter++), raw = '', width = '';
	url = preProcessUrl(this._id, url);
	if (args.length > 3) {
		const options = args.slice(3);
		narrow = options.includes('narrow');
		autoplay = options.indexOf('autoplay');
		for (let i = 0; i < options.length; i++) {
			const option = options[i];
			width = option.indexOf('width:') == 0 ? option + ';' : width;
		}
	}
	width = narrow ? '' : width;
	raw =  `<div id="${id}" class="aplayer" style="margin-bottom: 20px;${width}">
				<pre class="aplayer-lrc-content">${content}</pre>
			</div>
			<script>
				var ap = new APlayer({
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
				window.aplayers || (window.aplayers = []);
				window.aplayers.push(ap);
			</script>`;
	return raw;
}, {ends: true});

// {% aplayerlist %} {options} {% endaplayerlist %}
hexo.extend.tag.register('aplayerlist', function(args, content) {
	try {
		const options = JSON.parse(content);
		const id = 'aplayer' + (counter++);
		const defaultOptions = {
			narrow: false,
			autoplay: false,
			showlrc: 0
		};
		const resultOptions = Object.assign({}, defaultOptions, options);
		resultOptions.music.forEach(info => {
			info.url = preProcessUrl(this._id, info.url);
			info.pic = info.pic ? preProcessUrl(this._id, info.pic) : '';
		});
		const raw = `
			<div id="${id}" class="aplayer" style="margin-bottom: 20px;"></div>
			<script>
				var options = ${JSON.stringify(resultOptions)};
				options.element = document.getElementById("${id}");
				var ap = new APlayer(options);
				window.aplayers || (window.aplayers = []);
				window.aplayers.push(ap);
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
