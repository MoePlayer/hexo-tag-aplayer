# hexo-tag-aplayer

![npm](https://img.shields.io/npm/v/hexo-tag-aplayer.svg)  ![npm](https://img.shields.io/npm/l/hexo-tag-aplayer.svg)

Embed APlayer([https://github.com/DIYgod/APlayer](https://github.com/DIYgod/APlayer)) in Hexo posts/pages.

[中文文档](https://github.com/MoePlayer/hexo-tag-aplayer/blob/master/docs/README-zh_cn.md)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Dependency](#dependency)
- [Usage](#usage)
  - [Option](#option)
  - [With lyrics](#with-lyrics)
  - [With playlist](#with-playlist)
  - [MeingJS support (new in 3.0)](#meingjs-support-new-in-30)
  - [PJAX compatible](#pjax-compatible)
- [Customization (new in 3.0)](#customization-new-in-30)
- [Troubleshoot](#troubleshoot)
  - [Space within arguments](#space-within-arguments)
  - [Duplicate APlayer.JS loading](#duplicate-aplayerjs-loading)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->




![plugin screenshot](http://7jpp1d.com1.z0.glb.clouddn.com/QQ20160202-5.png)


## Installation

	npm install --save hexo-tag-aplayer
## Dependency

+ APlayer.js  >= 1.10.0
+ Meting.js >= 1.2.0

## Usage

	{% aplayer title author url [picture_url, narrow, autoplay, width:xxx, lrc:xxx] %}

### Option

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

### With playlist

	{% aplayerlist %}
	{
	    "narrow": false,                          // Optional, narrow style
	    "autoplay": true,                         // Optional, autoplay song(s), not supported by mobile browsers
	    "mode": "random",                         // Optional, play mode, can be `random` `single` `circulation`(loop) `order`(no loop), default: `circulation`
	    "showlrc": 3,                             // Optional, show lrc, can be 1, 2, 3
	    "mutex": true,                            // Optional, pause other players when this player playing
	    "theme": "#e6d0b2",	                      // Optional, theme color, default: #b7daff
	    "preload": "metadata",                    // Optional, the way to load music, can be 'none' 'metadata' 'auto', default: 'auto'
	    "listmaxheight": "513px",                 // Optional, max height of play list
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

### MeingJS support (new in 3.0)

When you use MetingJS, your blog can play musics from Tencent, Netease, Xiami, Kugou, Baidu and more.

See [metowolf/MetingJS](https://github.com/metowolf/MetingJS) and [metowolf/Meting](https://github.com/metowolf/Meting) in detail.

If you want to use MetingJS in `hexo-tag-aplayer`, you need enable it in `_config.yml`

```yaml
aplayer:
  meting: true
```

Now you can use `{% meting ...%}` in your post:

```
<!-- Simple example (id, server, type)  -->
{% meting "60198" "netease" "playlist" %}

<!-- Advanced example -->
{% meting "60198" "netease" "playlist" "autoplay" "mutex:false" "listmaxheight:340px" "preload:none" "theme:#ad7a86"%}
```

The  `{% meting %}`  options are shown below:

| Option        | Default      | Description                                                  |
| ------------- | ------------ | ------------------------------------------------------------ |
| id            | **required** | song id / playlist id / album id / search keyword            |
| server        | **required** | Music platform: `netease`, `tencent`, `kugou`, `xiami`, `baidu` |
| type          | **required** | `song`, `playlist`, `album`, `search`, `artist`              |
| fixed         | `false`      | Enable fixed mode                                            |
| mini          | `false`      | Enable mini mode                                             |
| loop          | `all`        | Player loop play, values: 'all', 'one', 'none'               |
| order         | `list`       | Player play order, values: 'list', 'random'                  |
| volume        | 0.7          | Default volume, notice that player will remember user setting, default volume will not work after user set volume themselves |
| lrctype       | 0            | Lyric type                                                   |
| listfolded    | `false`      | Indicate whether list should folded at first                 |
| autoplay      | `false`      | Autoplay song(s), not supported by mobile browsers           |
| mutex         | `true`       | Pause other players when this player playing                 |
| listmaxheight | `340px`      | Max height of play list                                      |
| preload       | `auto`       | The way to load music, can be `none`, `metadata`, `auto`     |
| storagename   | `metingjs`   | LocalStorage key that store player setting                   |
| theme         | `#ad7a86`    | Theme color                                                  |

Read section [customization](#customization-new-in-30)  to learn how to configure self-host meting api server in `hexo-tag-aplayer` and other configuration.

### PJAX compatible

You need destroy APlayer instances manually when you use PJAX.

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

## Customization (new in 3.0)

You can configure `hexo-tag-aplayer` in `_config.yml`:

```yaml
aplayer:
  script_dir: some/place                        # Script asset path in public directory, default: 'assets/js'
  style_dir: some/place                         # Style asset path in public directory, default: 'assets/css'
  cdn: http://xxx/aplayer.min.js                # External APlayer.js url (CDN)
  style_cdn: http://xxx/aplayer.min.css         # External APlayer.css url (CDN)
  meting: true                                  # Meting support, default: false
  meting_api: http://xxx/api.php                # Meting api url
  meting_cdn: http://xxx/Meing.min.js           # External Meting.js url (CDN)
  asset_inject: true                            # Auto asset injection, default: true
  externalLink: http://xxx/aplayer.min.js       # Deprecated, use 'cdn' instead
```

## Troubleshoot

### Space within arguments

Hexo has an [issue](https://github.com/hexojs/hexo/issues/1455) that cannot use space within tag arguments.

If you encounter this problem, **install the latest (beta) version, and wrap the arguments within a string literal, for example:**

```
{% aplayer "Caffeine" "Jeff Williams" "caffeine.mp3" "autoplay" "width:70%" "lrc:caffeine.txt" %}
```

### Duplicate APlayer.JS loading 

The plugin hooks filter `after_render:html` , and it would inject `APlayer.js` and `Meting.js` in `<head>`:

```html
<html>
  <head>
    ...
    <script src="assets/js/aplayer.min.js"></script>
    <script src="assets/js/meting.min.js"></script>
  </head>
  ...
</html>
```

However, `after_render:html` is not fired in some cases :

+ [Does not work with hexo-renderer-jade](https://github.com/hexojs/hexo-inject/issues/1)
+ `after_render:html` seems not to get emitted in default settings of hexo server module (`hexo server`), it means you have to use static serving mode( `hexo server -s`) instead.

In such cases, the plugin would hook`after_post_render` as a fallback, which has a possibility to cause duplicate asset loadings.

If you want to solve this issue definitely, you can disable this auto-injection feature in `_config.yml` and insert the scripts by yourself:

```yaml
aplayer:
  asset_inject: false
```

## LICENSE

MIT
