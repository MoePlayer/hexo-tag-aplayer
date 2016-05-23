# hexo-tag-dplayer

Embed DPlayer([https://github.com/DIYgod/APlayer](https://github.com/DIYgod/DPlayer)) in Hexo posts/pages.

## Usage

	{% dplayer url api key=value ... %}

Hexo has an [issue](https://github.com/hexojs/hexo/issues/1455) that cannot use space within tag arguments.

If you encounter this problem, **install the latest (beta) version, and wrap the arguments within a string literal, for example:**

	{% dplayer "grigirieye.mp4" "http://dplayer.daoapp.io" "id=2333" "loop=true" "theme=#878787" "autoplay=yes" %}

## Customization

You can modify variables `scriptDir`(default: "/assets/js/" ) and `styleDir`(default: "/assets/css/") in `index.js` according to your blog's directory structure.

## Todo

- [ ] Publish it to the [hexo plugin list](https://hexo.io/plugins) and npm

## LICENSE

MIT
