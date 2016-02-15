# hexo-tag-aplayer

Embed APlayer([https://github.com/DIYgod/APlayer](https://github.com/DIYgod/APlayer)) in Hexo posts/pages.

![plugin screenshot](http://7jpp1d.com1.z0.glb.clouddn.com/QQ20160202-5.png)

## Installation

	npm install --save hexo-tag-aplayer

## Usage

	{% aplayer title author url [picture_url, narrow, autoplay] %}

Hexo has an [issue](https://github.com/hexojs/hexo/issues/1455) that cannot use space within tag arguments.

If you encounter this problem, **install the latest (beta) version, and wrap the arguments within a string literal, for example:**

	{% aplayer "Caffeine" "Jeff Williams" "caffeine.mp3" "autoplay" %}

## Customization

You can modify variables `scriptDir`(default: "/assets/js/" ) and `styleDir`(default: "/assets/css/") in `index.js` according to your blog's directory structure.

## Todo

- [x] More options(e.g. autoplay, narrow)
- [ ] Display lyrics
- [x] Fix issue cannot use space within arguments
- [x] Publish it to the [hexo plugin list](https://hexo.io/plugins) and npm

## LICENSE

MIT
