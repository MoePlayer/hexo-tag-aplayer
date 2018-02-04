import path from 'path';

export const APLAYER_DIR = path.dirname(require.resolve('aplayer'))
export const APLAYER_FILENAME = 'Aplayer.min.js'
export const SCRIPT_DIR = path.join('assets', 'js/')
export const APLAYER_ASSETS = [
  [APLAYER_FILENAME, path.join(SCRIPT_DIR, APLAYER_FILENAME), path.join(APLAYER_DIR, APLAYER_FILENAME)]
]
export const PLAYER_TAG_OPTION = {
  title: '', author: '', url: '',
  narrow: false, autoplay: false, width: '',
  lrcOption: false, lrcPath: ''
}