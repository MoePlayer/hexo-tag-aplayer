import {removeAll} from "../common/util"

export default class PartialView {

  constructor(raw, info) {
    this.content = raw
    this.path = info.path || ''
  }

  isFullPage() {
    return this.content.includes('</html>')
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
    this.content = removeAll(this.content, text)
  }

}