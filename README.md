# hexo-tag-aplayer

Embed [aplayer](https://github.com/DIYgod/APlayer) in Hexo posts/pages.

![plugin screenshot](http://7jpp1d.com1.z0.glb.clouddn.com/QQ20160202-5.png)

## Installation

	npm install hexo-tag-aplayer

## Usage

	{% aplayer title author url [picture_url, narrow, autoplay] %}

**Wrap the arguments within a string literal, for example:**

	{% aplayer "Caffeine" "Jeff Williams" "caffeine.mp3" %}

## Customization

You can modify variables `scriptDir`(default: "/assets/js/" ) and `styleDir`(default: "/assets/css/") in `index.js` according to your blog's directory structure.

## Todo

- [x] More options(e.g. autoplay, narrow)
- [ ] Display lyrics
- [x] Fix issue cannot use space within arguments
- [ ] Publish it to the [hexo plugin list](https://hexo.io/plugins) and npm

## LICENSE

MIT