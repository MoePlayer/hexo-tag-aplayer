import {APLAYER_TAG_MARKER} from '../common/constant'
import util from "hexo-util"

export default class PartialView {

  constructor(raw, info) {
    this.content = raw
    this.path = info.path || ''
  }

  isFullPage() {
    return this.content.includes('</html>')
  }

  hasAPlayerTag() {
    return this.content.includes(APLAYER_TAG_MARKER)
  }

  hasTagMarker(marker) {
    return this.content.includes(marker)
  }

  hasHeadTag() {
    return this.content.includes('</head>')
  }

  assetAlreadyInjected(marker) {
    return this.content.includes(marker)
  }

  injectAsset(tag) {
    this.content = this.content.replace('</head>',  tag + '\n</head>')
  }

  removeLiteral(text) {
    this.content = this.content.replace(text, '')
  }

}