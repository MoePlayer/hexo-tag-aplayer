import {generateRandomString} from './util'
export const APLAYER_TAG_MARKER = `aplayer-tag-marker-${generateRandomString(5)}`
export const APLAYER_SCRIPT_MARKER = `aplayer-script-marker-${generateRandomString(5)}`
export const APLAYER_SECONDARY_SCRIPT_MARKER = `aplayer-secondary-script-marker-${generateRandomString(5)}`
export const METING_TAG_MARKER = `meting-tag-marker-${generateRandomString(5)}`
export const METING_SCRIPT_MARKER = `meting-script-marker-${generateRandomString(5)}`
export const METING_SECONDARY_SCRIPT_MARKER = `meting-secondary-script-marker-${generateRandomString(5)}`

export const PLAYER_TAG_OPTION = {
  title: '', author: '', url: '',
  narrow: false, autoplay: false, width: '',
  lrcOption: false, lrcPath: ''
}

export const METING_TAG_OPTION = {
  id: '', server: '', type: '', mode: 'circulation',
  autoplay: false, mutex: true, listmaxheight: '340px',
  preload: 'auto', theme: '#ad7a86'
}