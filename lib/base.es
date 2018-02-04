import urllib from 'url'
import {throwError} from '../common/util'

export class BaseTag {
  /*
    args: Tag arguments
    id: Instance ID 
    pid: Post ID
  */
  constructor(hexo, args, id, pid) {
    this.config = hexo.config.aplayer || {}
    this.pid = pid
    this.id = id
    this.hexo = hexo
  }

  processUrl(url) {
    if (/^https?:\/\/|^\//.test(url)) {
      return url
    }
    const PostAsset = this.hexo.model('PostAsset')
    const asset = PostAsset.findOne({post: this.pid, slug: url})
    if (!asset) throwError(`Specified asset file not found (${url})`)
    return urllib.resolve(this.hexo.config.root, asset.path)
  }

  parse() {
    throwError("Unimplemented method: parse")
  }

  generate() {
    throwError('Unimplemented method: generate')
  }
}