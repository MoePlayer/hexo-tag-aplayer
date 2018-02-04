import path from 'path'
import {SCRIPT_DIR, APLAYER_FILENAME} from './constant'

export const generateAPlayerUrl = function(hexo) {
	const config = hexo.config.aplayer || {}
	if (config.externalLink) {
		return config.externalLink
	} else {
		const root = hexo.config.root ? hexo.config.root : '/'
		return path.join(root, '/', SCRIPT_DIR, APLAYER_FILENAME)
	}
}

export const throwError = (message) => {
  throw new Error(`[hexo-tag-aplayer] ${message}`)
}