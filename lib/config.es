import path from 'path'
import {clone} from '../common/util'
const APLAYER_DIR = path.dirname(require.resolve('aplayer'))
const METING_DIR = path.dirname(require.resolve('meting'))
const APLAYER_FILENAME = 'Aplayer.min.js'
const METING_FILENAME = `Meting.min.js`
const DEFAULT_SCRIPT_DIR = path.join('assets', 'js/')
const ASSETS = [
  // 四元组：引用非本地文件标识符，文件名, 文件的目标部署路径, 资源文件源路径
  [false, path.join(DEFAULT_SCRIPT_DIR, APLAYER_FILENAME), path.join(APLAYER_DIR, APLAYER_FILENAME)],
  [false, METING_FILENAME, path.join(DEFAULT_SCRIPT_DIR, METING_FILENAME), path.join(METING_DIR, METING_FILENAME)]
]

/*
* Aplayer Configuration Example in _config.yml:
*
* aplayer:
*   script_dir: some/place                        # Optional, default: assets/js
*   meting_api: http://xxx/api.php                # Required if you use meting tag
*   meting_cdn: http://xxx/Meing.min.js           # Optional default: null
*   aplayer_cdn: http://xxx/aplayer.min.js        # default: null
*   externalLink: http://xxx/aplayer.min.js       # Deprecated, please use 'aplayer_cdn'
* */
export default class Config {
  constructor(hexo) {
    this.source = hexo.config.aplayer
    const root = hexo.config.root ? hexo.config.root : '/'

    this.config = {
      ASSETS,
      script_dir: DEFAULT_SCRIPT_DIR,
      script: path.join(root, '/', DEFAULT_SCRIPT_DIR, APLAYER_FILENAME),
      meting_script: null, meting_api: null
    }
    this._parse(hexo.config.aplayer)
  }

  _parse(source) {
    let isExternal = {aplayer: false, meting: false}
    if (!source) {
      return
    }
    source = clone(source)
    // Parse script_dir
    if (source.script_dir) {
      this.set('script_dir', source.script_dir)
    }
    // Deprecated: externalLink option
    if (source.externalLink) {
      source.aplayer_cdn = source.externalLink
    }
    // Parse aplayer external resource
    if (source.aplayer_cdn) {
      this.set('script', source.aplayer_cdn)
      isExternal.aplayer = true
    } else {
      this.set('script', path.join(root, '/', this.get('script_dir'), APLAYER_FILENAME))
    }
    // Meting Config
    if (source.meting_cdn) {
      this.set(`meting_script`, source.meting_cdn)
      isExternal.meting = true
    } else {
      this.set(`meting_script`, path.join(root, '/', this.get('script_dir'), METING_FILENAME))
    }
    if (source.meting_api) {
      this.set('meting_api', source.meting_api)
    }
    // Reset assets config
    this.set('assets', [
      [isExternal['aplayer'], APLAYER_FILENAME, path.join(this.get('script_dir'), APLAYER_FILENAME),
        path.join(APLAYER_DIR, APLAYER_FILENAME)],
      [isExternal['meting'], METING_FILENAME, path.join(this.get('script_dir'), METING_FILENAME),
        path.join(METING_DIR, METING_FILENAME)]
    ])
  }

  get(name) {
    return this.config[name]
  }

  set(name, value) {
    this.config[name] = value
  }
}