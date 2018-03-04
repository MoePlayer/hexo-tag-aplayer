import {BaseTag} from "./base"
import {APLAYER_TAG_MARKER, PLAYER_TAG_OPTION} from "../../common/constant"
import {throwError} from "../../common/util"

export default class APlayerLyricTag extends BaseTag {
  constructor(hexo, args, pid, lyrics) {
    super(hexo, args, pid)
    this.settings = this.parse(args)
    this.lyrics = lyrics
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
    let {title, author, url, narrow, pic,
      autoplay, width} = this.settings
    return  `<div id="${this.id}" class="aplayer ${APLAYER_TAG_MARKER}" style="margin-bottom: 20px;${width}">
				<pre class="aplayer-lrc-content">${this.lyrics}</pre>
			</div>
			<script>
				var ap = new APlayer({
					element: document.getElementById("${this.id}"),
					narrow: ${narrow},
					autoplay: ${autoplay},
					showlrc: 2,
					music: {
						title: "${title}",
						author: "${author}",
						url: "${url}",
						pic: "${pic}",
					}
				});
				window.aplayers || (window.aplayers = []);
				window.aplayers.push(ap);
			</script>`
  }
}