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
import {throwError} from "./common/util"
import util from 'hexo-util'
import {
  APLAYER_SCRIPT_MARKER, APLAYER_TAG_MARKER, APLAYER_SECONDARY_SCRIPT_MARKER,
  METING_TAG_MARKER, METING_SCRIPT_MARKER, METING_SECONDARY_SCRIPT_MARKER, APLAYER_SECONDARY_STYLE_MARKER,
  APLAYER_STYLE_MARKER
} from './common/constant'
import MetingTag from "./lib/tag/playerMeting"
import APlayerTag from './lib/tag/player'
import APlayerLyricTag from './lib/tag/playerLyric'
import APlayerListTag from './lib/tag/playerList'
import PartialView from './lib/view'
import Config from './lib/config'

const log = require('hexo-log')({name: 'hexo-tag-aplayer', debug: false})
const config = new Config(hexo)
const APLAYER_STYLE_LITERAL = `<link rel="stylesheet" class="${APLAYER_SECONDARY_STYLE_MARKER}" href="${config.get('style')}">`
const APLAYER_SCRIPT_LITERAL = `<script src="${config.get('script')}" class="${APLAYER_SECONDARY_SCRIPT_MARKER}"></script>`
const METING_SCRIPT_LITERAL = config.get('meting_api')
  ? `<script>var meting_api='${config.get('meting_api')}?server=:server&type=:type&id=:id&r=:r'</script><script class="${METING_SECONDARY_SCRIPT_MARKER}" src="${config.get('meting_script')}"></script>`
  : `<script class="${METING_SECONDARY_SCRIPT_MARKER}" src="${config.get('meting_script')}"></script>`
let filterEmitted = {after_render: false, after_post_render: false}


config.get('assets').forEach(asset => {
  const [external, name, dstPath, srcPath] = asset
  if (!external && config.get('asset_inject') && fs.existsSync(srcPath)) {
    hexo.extend.generator.register(name, () => {
      return {
        path: dstPath,
        data() {
          return fs.createReadStream(srcPath)
        }
      }
    })
  }
})

hexo.extend.filter.register('after_render:html', function(raw, info) {
  filterEmitted.after_render = true
  if (!config.get('asset_inject')) {
    return
  }
  const view = new PartialView(raw, info)
  if (view.isFullPage()) {
    if (!view.hasHeadTag()) {
      log.warn(`[hexo-tag-aplayer]: <head> not found in ${view.path}, unable to inject script (like 'APlayer.js') in this page.`)
      return
    }
    // Inject APlayer script
    if (view.hasTagMarker(APLAYER_TAG_MARKER) && !view.assetAlreadyInjected(APLAYER_SCRIPT_MARKER)) {
      view.injectAsset(`<link rel="stylesheet" href="${config.get('style')}" class="${APLAYER_STYLE_MARKER}">`)
      view.injectAsset(util.htmlTag('script', {src: config.get('script'), class: APLAYER_SCRIPT_MARKER}, ''))

    }
    // Inject Meting script
    if (config.get('meting') && view.hasTagMarker(METING_TAG_MARKER) && !view.assetAlreadyInjected(METING_SCRIPT_MARKER)) {
      if (config.get('meting_api')) {
        view.injectAsset( `<script>var meting_api='${config.get('meting_api')}?server=:server&type=:type&id=:id&r=:r'</script>`)
      }
      view.injectAsset(util.htmlTag('script', {src: config.get('meting_script'), class: METING_SCRIPT_MARKER}, ''))
    }
    // Remove duplicate scripts
    view.removeLiteral(APLAYER_SCRIPT_LITERAL)
    view.removeLiteral(METING_SCRIPT_LITERAL)
    view.removeLiteral(APLAYER_STYLE_LITERAL)
  }
  return view.content
})

hexo.extend.filter.register('after_post_render', (data) => {
  filterEmitted.after_post_render = true
  if (!config.get('asset_inject')) {
    return
  }
  // Polyfill: filter 'after_render:html' may not be fired in some cases, see https://github.com/hexojs/hexo-inject/issues/1
  if (config.get('meting')) {
    data.content = METING_SCRIPT_LITERAL + data.content
  }
  data.content = APLAYER_STYLE_LITERAL + APLAYER_SCRIPT_LITERAL + data.content
  return data
})

hexo.extend.tag.register('aplayer', function(args) {
  try {
    const tag = new APlayerTag(hexo, args, this._id)
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
  try {
    const tag = new APlayerLyricTag(hexo, args, this._id, content)
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
  try {
    const tag = new APlayerListTag(hexo, content, this._id)
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


hexo.extend.tag.register('meting', function(args) {
  try {
    if (!config.get('meting')) {
      throwError('Meting support is disabled, cannot resolve the meting tags properly.')
    }
    const tag = new MetingTag(hexo, args, this._id)
    const output = tag.generate()
    return output
  } catch (e) {
    console.error(e)
    return `
			<script>
				console.error("${e}");
			</script>`
  }
})

hexo.extend.tag.register('before_exit', function() {
  if (!filterEmitted.after_render && filterEmitted.after_post_render) {
    log.warn('Filter "after_render:html" not emitted during this generation, duplicate scripts would not be removed.')
  }
})
