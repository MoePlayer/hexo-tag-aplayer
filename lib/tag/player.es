import fs from 'hexo-fs'
import path from 'path'
import {BaseTag} from "./base"
import {PLAYER_TAG_OPTION, APLAYER_TAG_MARKER} from "../../common/constant"
import {throwError, extractOptionValue} from "../../common/util"

export default class APlayerTag extends BaseTag {
    constructor(hexo, args, pid) {
      super(hexo, args, pid)
      this.settings = this.parse(args)
    }

    parse(options) {
        let settings = Object.assign({}, PLAYER_TAG_OPTION);
        ([settings.title, settings.author, settings.url] = options)
        const optionalArgs = options.slice(3)
        optionalArgs.forEach((value,index) => {
            switch(true) {
                case value === 'narrow':
                    settings.narrow = true
                    break
                case value === 'autoplay':
                    settings.autoplay = true
                    break
                case /^lrc:/.test(value):
                    settings.lrcOption = 1
                    settings.lrcPath = extractOptionValue(value)
                    break
                case /^width:/.test(value):
                    settings.width = value + ';'
                    break
                case index === 0:
                    settings.pic = this.processUrl(value)
                    break
                default:
                    throwError(`Unrecognized tag argument(${index+1}): ${value}`)
            }
        })
        settings.width =  settings.narrow ? '' : settings.width
        return settings
    }

    generate() {
        const hexo = this.hexo
        let content = ''
        let {title, author, url, narrow, pic,
            autoplay, lrcOption, lrcPath, width} = this.settings
        if (lrcOption) {
          if (!/^https?/.test(lrcPath)) {
            const PostAsset = hexo.database._models.PostAsset
            const _path = path.join(hexo.base_dir, PostAsset.findOne({post: this.pid, slug: lrcPath})._id)
            content = fs.readFileSync(_path)
            lrcOption = 2
          } else {
            lrcOption = 3
          }
        }
        return `
        <div id="${this.id}" class="aplayer ${APLAYER_TAG_MARKER}" style="margin-bottom: 20px;${width}">
            <pre class="aplayer-lrc-content">${content}</pre>
        </div>
        <script>
          var ap = new APlayer({
            element: document.getElementById("${this.id}"),
            narrow: ${narrow},
            autoplay: ${autoplay},
            showlrc: ${lrcOption},
            music: {
              title: "${title}",
              author: "${author}",
              url: "${url}",
              pic: "${pic}",
              lrc: "${lrcPath}"
            }
          });
          window.aplayers || (window.aplayers = []);
          window.aplayers.push(ap);
        </script>`
    }
}