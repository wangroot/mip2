/**
 * @file const
 * @author wangyisheng@baidu.com (wangyisheng)
 */

export const MIP_IFRAME_CONTAINER = 'mip-page__iframe'
// delete me
export const DEFAULT_SHELL_CONFIG = {
  header: {
    title: '',
    logo: '',
    xiongzhang: false,
    buttonGroup: [],
    show: false,
    bouncy: true
  },
  view: {
    isIndex: false,
    transition: {
      mode: 'slide',
      effect: 'slide-left',
      alwaysBackPages: []
    }
  },
  footer: {}
}

export const MESSAGE_ROUTER_PUSH = 'router-push'
export const MESSAGE_ROUTER_REPLACE = 'router-replace'
export const MESSAGE_APPSHELL_HEADER_SLIDE_UP = 'appshell-header-slide-up'
export const MESSAGE_APPSHELL_HEADER_SLIDE_DOWN = 'appshell-header-slide-down'
export const MESSAGE_REGISTER_GLOBAL_COMPONENT = 'register-global-component'
export const MESSAGE_SET_MIP_SHELL_CONFIG = 'set-mip-shell-config'
export const MESSAGE_UPDATE_MIP_SHELL_CONFIG = 'update-mip-shell-config'
export const MESSAGE_SYNC_PAGE_CONFIG = 'sync-page-config'
export const MESSAGE_CROSS_ORIGIN = 'page-cross-origin'
export const MESSAGE_BROADCAST_EVENT = 'page-broadcast-event'

export const NON_EXISTS_PAGE_ID = 'non-exists-page-id'
export const CUSTOM_EVENT_SCROLL_TO_ANCHOR = 'scroll-to-anchor'
export const CUSTOM_EVENT_SHOW_PAGE = 'show-page'
export const CUSTOM_EVENT_HIDE_PAGE = 'hide-page'

export const BUILT_IN_COMPONENTS = [
  'mip-data',
  'mip-carousel',
  'mip-iframe',
  'mip-img',
  'mip-pix',
  'mip-video',
  'mip-shell'
]

export const MAX_PAGE_NUM = 6
