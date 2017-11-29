# hexo-tag-aplayer

![npm](https://img.shields.io/npm/v/hexo-tag-aplayer.svg)  ![npm](https://img.shields.io/npm/l/hexo-tag-aplayer.svg)

Embed APlayer([https://github.com/DIYgod/APlayer](https://github.com/DIYgod/APlayer)) in Hexo posts/pages.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

- [Installation](#installation)
- [Usage](#usage)
  - [Arguments](#arguments)
  - [With lyrics](#with-lyrics)
  - [Upstream Issue](#upstream-issue)
- [Customization](#customization)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


![plugin screenshot](http://7jpp1d.com1.z0.glb.clouddn.com/QQ20160202-5.png)


## Installation

	npm install --save hexo-tag-aplayer

## Usage

	{% aplayer title author url [picture_url, narrow, autoplay, width:xxx, lrc:xxx] %}

### Arguments

+ `title` : music title
+ `author`: music author
+ `url`: music file url
+ `picture_url`: optional, music picture url
+ `narrow`: optional, narrow style
+ `autoplay`: optional, autoplay music, not supported by mobile browsers
+ `width:xxx`: optional, prefix `width:`, player's width (default: 100%)
+ `lrc:xxx`: optional, prefix `lrc:`, LRC file url

With [post asset folders](https://hexo.io/docs/asset-folders.html#Tag-Plugins-For-Relative-Path-Referencing) enabled, you can easily place your image, music and LRC file into asset folder, and reference them like:

	{% aplayer "Caffeine" "Jeff Williams" "caffeine.mp3" "picture.jpg" "lrc:caffeine.txt" %}

### With lyrics

Besides 'lrc' option, you can use `aplayerlrc` which has end tag to show lyrics.

	{% aplayerlrc "title" "author" "url" "autoplay" %}
	[00:00.00]lrc here
	{% endaplayerlrc %}

### With playlist (new in 2.0)

	{% aplayerlist %}
	{
		"narrow": false,						// Optional, narrow style
	    "autoplay": true,						// Optional, autoplay song(s), not supported by mobile browsers
	    "mode": "random",						// Optional, play mode, can be `random` `single` `circulation`(loop) `order`(no loop), default: `circulation`
	    "showlrc": 3,							// Optional, show lrc, can be 1, 2, 3
	    "mutex": true,							// Optional, pause other players when this player playing
	    "theme": "#e6d0b2",						// Optional, theme color, default: #b7daff
		"preload": "metadata",					// Optional, the way to load music, can be 'none' 'metadata' 'auto', default: 'auto'
		"listmaxheight": "513px",				// Optional, max height of play list
	    "music": [
	        {
	            "title": "CoCo",
	            "author": "Jeff Williams",
	            "url": "caffeine.mp3",
	            "pic": "caffeine.jpeg",
	            "lrc": "caffeine.txt"
	        },
	        {
	            "title": "アイロニ",
	            "author": "鹿乃",
	            "url": "irony.mp3",
	            "pic": "irony.jpg"
	        }
	    ]
	}
	{% endaplayerlist %}


### PJAX compatible

```js
$(document).on('pjax:start', function () {
    if (window.aplayers) {
        for (let i = 0; i < window.aplayers.length; i++) {
            window.aplayers[i].destroy();
        }
        window.aplayers = [];
    }
});
```

### Upstream Issue

Hexo has an [issue](https://github.com/hexojs/hexo/issues/1455) that cannot use space within tag arguments.

If you encounter this problem, **install the latest (beta) version, and wrap the arguments within a string literal, for example:**

	{% aplayer "Caffeine" "Jeff Williams" "caffeine.mp3" "autoplay" "width:70%" "lrc:caffeine.txt" %}

## Customization

You can modify variables `scriptDir`(default: "/assets/js/" ) in `index.js` according to your blog's directory structure.


## LICENSE

MIT
