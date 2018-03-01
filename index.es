/**
* hexo-tag-aplayer
* https://github.com/grzhan/hexo-tag-aplayer
* Copyright (c) 2016, grzhan
* Licensed under the MIT license.
*
* Syntax:
*  {% aplayer title author url [picture_url, narrow, autoplay] %}
*/
require('babel-polyfill')

import fs from 'hexo-fs'
import util from 'hexo-util'
import {APLAYER_ASSETS} from './common/constant'
import {generateAPlayerUrl} from './common/util'
import APlayerTag from './lib/player'
import APlayerLyricTag from './lib/playerLyric'
import APlayerListTag from './lib/playerList'

let tagCounter = 0

APLAYER_ASSETS.forEach(asset => {
  const [name, dstPath, srcPath] = asset
  hexo.extend.generator.register(name, () => {
    return {
      path: dstPath,
      data() {
        return fs.createReadStream(srcPath)
      }
    }
  })
})

hexo.extend.filter.register('after_post_render', function (data) {
  data.content =
    util.htmlTag('script', {src: generateAPlayerUrl(hexo)}, ' ') +
    data.content
  return data
})

hexo.extend.tag.register('aplayer', function(args) {
  tagCounter += 1
  try {
    const tag = new APlayerTag(hexo, args, `aplayer-${tagCounter}`, this._id)
    const output =  tag.generate()
    return output
  } catch (e) {
    console.error(e);
    return  `
			<script>
				console.error("${e}");
			</script>`;
  }
})

hexo.extend.tag.register('aplayerlrc', function(args, content) {
  tagCounter += 1
  try {
    const tag = new APlayerLyricTag(hexo, args, `aplayer-${tagCounter}`,
      this._id, content)
    const output =  tag.generate()
    return output
  } catch (e) {
    console.error(e);
    return  `
			<script>
				console.error("${e}");
			</script>`
  }
}, {ends: true})


hexo.extend.tag.register('aplayerlist', function(args, content) {
  tagCounter += 1
  try {
    const tag = new APlayerListTag(hexo, content, `aplayer-${tagCounter}`, this._id)
    const output =  tag.generate()
    return output
  } catch (e) {
    console.error(e)
    return  `
			<script>
				console.error("${e}");
			</script>`
  }
}, {ends: true})

