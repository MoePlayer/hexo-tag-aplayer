import {METING_TAG_OPTION, METING_TAG_MARKER, APLAYER_TAG_MARKER} from '../../common/constant'
import {throwError, extractOptionValue} from '../../common/util'
import {BaseTag} from "./base"

export default class MetingTag extends BaseTag {
  constructor(hexo, args, pid) {
    super(hexo, args, pid)
    this.settings = this.parse(args)
  }

  parse(options) {
    let settings = Object.assign({}, METING_TAG_OPTION);
    ([settings.id, settings.server, settings.type] = options)
    const optionalArgs = options.slice(3)
    optionalArgs.forEach((option, index) => {
      switch (true) {
        case option === 'autoplay':
          settings.autoplay = true
          break
        case option === 'fixed':
          settings.fixed = true
          break
        case option === 'mini':
          settings.mini = true
          break;
        case option.startsWith('loop:'):
          settings.loop = extractOptionValue(option);
          break;
        case option.startsWith('order:'):
          settings.order = extractOptionValue(option);
          break;
        case option.startsWith('volume:'):
          settings.volume = extractOptionValue(option);
          break;
        case option.startsWith('lrctype:'):
          settings.lrctype = extractOptionValue(option);
          break;
        case option === 'listfolded':
          settings.listfolded = true;
          break;
        case option.startsWith('storagename:'):
          settings.storagename = extractOptionValue(option);
          break;
        case option.startsWith('mutex:'):
          settings.mutex = (extractOptionValue(option) === 'true')
          break
        case option.startsWith('mode:'):
          settings.mode = extractOptionValue(option)
          break
        case option.startsWith('listmaxheight:'):
          settings.listmaxheight = extractOptionValue(option)
          break
        case option.startsWith('preload:'):
          settings.preload = extractOptionValue(option)
          break
        case option.startsWith('theme:'):
          settings.theme = extractOptionValue(option)
          break
        default:
          throwError(`Unrecognized tag argument(${index + 1}): ${value}`)
      }
    })
    return settings
  }

  generate() {
    let settingLiteral = ''
    Object.entries(this.settings).forEach(([key, value]) => {
      settingLiteral += ` data-${key}="${value}"`
    })
    return `
    <div id="${this.id}" class="aplayer ${APLAYER_TAG_MARKER} ${METING_TAG_MARKER}"
        ${settingLiteral}
    ></div>`
  }
}