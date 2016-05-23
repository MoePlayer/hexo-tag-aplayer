# hexo-tag-dplayer
感谢某豆子(dixyes)的移植，也感谢源项目https://github.com/grzhan/hexo-tag-aplayer
源项目:hexo-tag-aplayer 作者grzhan
（我不清楚这样会不会违反MIT许可，但如果违反麻烦告诉我我该怎么改，我(Myer921)对英文一窍不通）
本项目是将diygod的dplayer运行在hexo的插件


Embed DPlayer([https://github.com/DIYgod/DPlayer](https://github.com/DIYgod/DPlayer)) in Hexo posts/pages.

## Usage

	{% dplayer key=value ... %}

## Usage

	{% dplayer key=value ... %}

key can be 

	'autoplay': will play automatic or not
	'loop': will loop or not
	'url': video source url
	'pic': video cover picture
	'api': DPlayer danmaku backend url
	'id': see https://github.com/DIYgod/DPlayer
	'token': see https://github.com/DIYgod/DPlayer

for example:

	{% dplayer "url=http://devtest.qiniudn.com/若能绽放光芒.mp4" "api=http://dplayer.daoapp.io" "pic=http://devtest.qiniudn.com/若能绽放光芒.png" "id=9E2E3368B56CDBB4" "loop=yes" "theme=#FADFA3" "autoplay=false" "token=tokendemo" %}

## Customization

You can modify variables `scriptDir`(default: "/assets/js/" ) and `styleDir`(default: "/assets/css/") in `index.js` according to your blog's directory structure.

## Todo

- [ ] Publish it to the [hexo plugin list](https://hexo.io/plugins) and npm

## LICENSE

MIT
