import path from 'path'
import {clone} from '../common/util'
const APLAYER_DIR = path.dirname(require.resolve('aplayer'))
const METING_DIR = path.dirname(require.resolve('meting'))
const APLAYER_FILENAME = 'Aplayer.min.js'
const METING_FILENAME = `Meting.min.js`
const DEFAULT_SCRIPT_DIR = path.join('assets', 'js/')
const ASSETS = [
  // 四元组：引用非本地文件标识符，文件名, 文件的目标部署路径, 资源文件源路径
  [false, APLAYER_FILENAME, path.join(DEFAULT_SCRIPT_DIR, APLAYER_FILENAME), path.join(APLAYER_DIR, APLAYER_FILENAME)],
  [false, METING_FILENAME, path.join(DEFAULT_SCRIPT_DIR, METING_FILENAME), path.join(METING_DIR, METING_FILENAME)]
]

/*
* Aplayer configuration example in _config.yml:
*
* aplayer:
*   script_dir: some/place                        # Script asset path in public directory, default: 'assets/js'
*   cdn: http://xxx/aplayer.min.js                # External APlayer.js url
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
      asset_inejct: true,
      script_dir: DEFAULT_SCRIPT_DIR,
      script: path.join(this.root, '/', DEFAULT_SCRIPT_DIR, APLAYER_FILENAME),
      meting: false, meting_api: null,
      meting_script: path.join(this.root, '/', DEFAULT_SCRIPT_DIR, METING_FILENAME),
    }
    if (hexo.config.aplayer) {
      this._parse(clone(hexo.config.aplayer))
    }
  }

  _parse(source) {
    let isExternal = {aplayer: false, meting: false}
    // Parse script_dir
    if (source.script_dir) {
      this.set('script_dir', source.script_dir)
    }
    // Asset auto-injection
    if (source.asset_inject) {
      this.set('asset_inject', source.asset_inject)
    }
    // Deprecated: externalLink option
    if (source.externalLink) {
      source.cdn = source.externalLink
    }
    // Parse aplayer external resource
    if (source.cdn) {
      this.set('script', source.cdn)
      isExternal.aplayer = true
    } else {
      this.set('script', path.join(this.root, '/', this.get('script_dir'), APLAYER_FILENAME))
    }
    let assets = [
      [isExternal['aplayer'], APLAYER_FILENAME, path.join(this.get('script_dir'), APLAYER_FILENAME),
        path.join(APLAYER_DIR, APLAYER_FILENAME)]
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