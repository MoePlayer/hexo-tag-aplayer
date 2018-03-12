import fs from 'hexo-fs'
import path from 'path'
import {clone} from '../common/util'
const APLAYER_DIR = path.dirname(require.resolve('aplayer'))
const METING_DIR = path.dirname(require.resolve('meting'))
const APLAYER_FILENAME = 'APlayer.min.js'
const APLAYER_STYLENAME = 'APlayer.min.css'
const METING_FILENAME = `Meting.min.js`
const DEFAULT_SCRIPT_DIR = path.join('assets', 'js/')
const DEFAULT_STYLE_DIR = path.join('assets', 'css/')
const ASSETS = [
  // 四元组：引用非本地文件标识符，文件名, 文件的目标部署路径, 资源文件源路径
  [false, APLAYER_FILENAME, path.join(DEFAULT_SCRIPT_DIR, APLAYER_FILENAME), path.join(APLAYER_DIR, APLAYER_FILENAME)],
  [false, APLAYER_STYLENAME, path.join(DEFAULT_STYLE_DIR, APLAYER_STYLENAME), path.join(APLAYER_DIR, APLAYER_STYLENAME)],
  [false, METING_FILENAME, path.join(DEFAULT_SCRIPT_DIR, METING_FILENAME), path.join(METING_DIR, METING_FILENAME)]
]

/*
* Aplayer configuration example in _config.yml:
*
* aplayer:
*   script_dir: some/place                        # Script asset path in public directory, default: 'assets/js'
*   style_dir: some/palce                         # Style asset path in public directory, default: 'assets/css'
*   cdn: http://xxx/aplayer.min.js                # External APlayer.js url
*   style_cdn: http://xxx/aplayer.min.css         # External APlayer.css url
*   meting: true                                  # Meting support, default: false
*   meting_api: http://xxx/api.php                # Meting api url
*   meting_cdn: http://xxx/Meing.min.js           # External Meting.js url
*   externalLink: http://xxx/aplayer.min.js       # Deprecated, use 'cdn' instead
*   asset_inject: true                            # Auto asset injection, default: true
* */
export default class Config {
  constructor(hexo) {
    this.root = hexo.config.root ? hexo.config.root : '/'
    this.config = {
      assets: ASSETS,
      asset_inject: true,
      script_dir: DEFAULT_SCRIPT_DIR,
      style_dir: DEFAULT_STYLE_DIR,
      script: path.join(this.root, '/', DEFAULT_SCRIPT_DIR, APLAYER_FILENAME),
      style: path.join(this.root, '/', DEFAULT_STYLE_DIR, APLAYER_STYLENAME),
      meting: false, meting_api: null,
      meting_script: path.join(this.root, '/', DEFAULT_SCRIPT_DIR, METING_FILENAME),
    }
    if (hexo.config.aplayer) {
      this._parse(clone(hexo.config.aplayer))
    }
  }

  _parse(source) {
    let isExternal = {aplayer: false, aplayerStyle: false, meting: false}
    // Parse script_dir
    if (source.script_dir) {
      this.set('script_dir', source.script_dir)
    }
    // Parse style_dir
    if (source.style_dir) {
      this.set('style_dir', source.style_dir)
    }
    // Asset auto-injection
    if (source.asset_inject === false) {
      this.set('asset_inject', source.asset_inject)
    }
    // Deprecated: externalLink option
    if (source.externalLink) {
      source.cdn = source.externalLink
    }
    // Parse aplayer external script
    if (source.cdn) {
      this.set('script', source.cdn)
      isExternal.aplayer = true
    } else {
      this.set('script', path.join(this.root, '/', this.get('script_dir'), APLAYER_FILENAME))
    }
    // Parse aplayer external style
    if (source.style_cdn) {
      this.set('style', source.style_cdn)
      isExternal.aplayerStyle = true
    } else {
      this.set('style', path.join(this.root, '/', this.get('style_dir'), APLAYER_STYLENAME))
    }
    let assets = [
      [isExternal['aplayer'], APLAYER_FILENAME, path.join(this.get('script_dir'), APLAYER_FILENAME),
        path.join(APLAYER_DIR, APLAYER_FILENAME)],
      [isExternal['aplayerStyle'], APLAYER_STYLENAME, path.join(this.get('style_dir'), APLAYER_STYLENAME),
        path.join(APLAYER_DIR, APLAYER_STYLENAME)]
    ]
    // Meting Config
    if (source.meting !== false) {
      this.set('meting', source.meting)
      if (source.meting_cdn) {
        this.set('meting_script', source.meting_cdn)
        isExternal.meting = true
      } else {
        this.set('meting_script', path.join(this.root, '/', this.get('script_dir'), METING_FILENAME))
      }
      if (source.meting_api) {
        this.set('meting_api', source.meting_api)
      }
      assets.push([isExternal['meting'], METING_FILENAME, path.join(this.get('script_dir'), METING_FILENAME),
        path.join(METING_DIR, METING_FILENAME)])
    }
    // Reset assets config
    this.set('assets', assets)
  }

  get(name) {
    return this.config[name]
  }

  set(name, value) {
    this.config[name] = value
  }
}