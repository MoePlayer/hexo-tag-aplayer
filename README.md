# hexo-tag-dplayer
感谢某豆子的移植，也感谢源项目https://github.com/grzhan/hexo-tag-aplayer


Embed DPlayer([https://github.com/DIYgod/DPlayer](https://github.com/DIYgod/DPlayer)) in Hexo posts/pages.

## Usage

	{% dplayer url api key=value ... %}

for example:

	{% dplayer "http://devtest.qiniudn.com/若能绽放光芒.mp4" "http://dplayer.daoapp.io" "pic=http://devtest.qiniudn.com/若能绽放光芒.png" "id=9E2E3368B56CDBB4" "loop=yes" "theme=#FADFA3" "autoplay=false" "token=tokendemo" %}

## Customization

You can modify variables `scriptDir`(default: "/assets/js/" ) and `styleDir`(default: "/assets/css/") in `index.js` according to your blog's directory structure.

## Todo

- [ ] Publish it to the [hexo plugin list](https://hexo.io/plugins) and npm

## LICENSE

MIT
