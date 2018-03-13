import {BaseTag} from "./base"
import {APLAYER_TAG_MARKER} from "../../common/constant"


export default class APlayerListTag extends BaseTag {
  constructor(hexo, args,pid) {
    super(hexo, args, pid)
    this.settings = this.parse(args)
  }

  parse(options) {
    let settings = Object.assign({
      narrow: false,
      autoplay: false,
      showlrc: 0
    }, JSON.parse(options))
    settings.music.forEach(info => {
      info.url = this.processUrl(info.url)
      info.pic = info.pic ? this.processUrl(info.pic) : ''
    })
    return settings
  }

  generate() {
    const settings = JSON.stringify(this.settings)
    return `
        <div id="${this.id}" class="aplayer ${APLAYER_TAG_MARKER}" style="margin-bottom: 20px;"></div>
			  <script>
				  var options = ${settings};
				  options.element = document.getElementById("${this.id}");
				  var ap = new APlayer(options);
			    window.aplayers || (window.aplayers = []);
				  window.aplayers.push(ap);
			  </script>`
  }
}