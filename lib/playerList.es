import {BaseTag} from "./base"


export default class APlayerListTag extends BaseTag {
  constructor(hexo, args,id, pid) {
    super(hexo, args, id, pid)
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
      info.pic = info.pic ? this.processUrl(this._id, info.pic) : ''
    })
    return settings
  }

  generate() {
    const settings = JSON.stringify(this.settings)
    try {
      return `
        <div id="${this.id}" class="aplayer" style="margin-bottom: 20px;"></div>
			  <script>
				  var options = ${settings};
				  options.element = document.getElementById("${this.id}");
				  var ap = new APlayer(options);
			    window.aplayers || (window.aplayers = []);
				  window.aplayers.push(ap);
			  </script>`
    } catch (e) {
      console.error(e);
      return  `
			<script>
				console.error("${e}");
			</script>`;
    }
  }
}