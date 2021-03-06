/* istanbul ignore file */
/**
 * @file define dom functions
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import {fn} from '../../util'
import css from '../../util/dom/css'
import platform from '../../util/platform'

import {MIP_IFRAME_CONTAINER} from '../const/index'
import {transitionEndEvent, animationEndEvent} from './feature-detect'
import {normalizeLocation} from './route'
import viewport from '../../viewport'

const {raf} = fn

const MIP_SHELL_HEADER = 'mip-shell-header'
const MIP_PAGE_LOADING_WRAPPER = 'mip-page-loading-wrapper'
const MIP_PAGE_FADE_HEADER_WRAPPER = 'mip-page-fade-header-wrapper'

/* eslint-disable indent */
export const BACK_BUTTON_SVG = [
  '<svg t="1530857979993" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3173"',
    'xmlns:xlink="http://www.w3.org/1999/xlink">',
    '<path  fill="currentColor" d="M348.949333 511.829333L774.250667 105.728C783.978667 96 789.333333 83.712 789.333333 71.104c0-12.629333-5.354667-24.917333-15.082666-34.645333-9.728-9.728-22.037333-15.082667-34.645334-15.082667-12.586667 0-24.917333 5.333333-34.624 15.082667L249.557333 471.616A62.570667 62.570667 0 0 0 234.666667 512c0 10.410667 1.130667 25.408 14.890666 40.042667l455.424 435.605333c9.706667 9.728 22.016 15.082667 34.624 15.082667s24.917333-5.354667 34.645334-15.082667c9.728-9.728 15.082667-22.037333 15.082666-34.645333 0-12.608-5.354667-24.917333-15.082666-34.645334L348.949333 511.829333z"',
      'p-id="3174"></path>',
  '</svg>'
].join('')
/* eslint-enable indent */

export function createIFrame ({fullpath, pageId}, {onLoad, onError} = {}) {
  let container = document.querySelector(`.${MIP_IFRAME_CONTAINER}[data-page-id="${pageId}"]`)

  // if exists, delete it first
  if (container) {
    container.parentNode.removeChild(container)
  }

  container = document.createElement('iframe')
  container.onload = () => {
    typeof onLoad === 'function' && onLoad(container)
  }
  container.onerror = () => {
    typeof onError === 'function' && onError(container)
  }
  // TODO: use XHR to load iframe so that we can get httpRequest.status 404
  let targetOrigin = normalizeLocation(pageId).origin
  let pageMeta = JSON.stringify({
    standalone: window.MIP.standalone,
    isRootPage: false,
    isCrossOrigin: targetOrigin !== window.location.origin,
    rootName: window.MIP.viewer.rootName
  })
  container.setAttribute('name', pageMeta)

  if (!window.MIP.standalone) {
    if (fullpath.indexOf('#') === -1) {
      fullpath += '#mipservice=' + window.mipService
    } else {
      fullpath += '&mipservice=' + window.mipService
    }
  }
  container.setAttribute('src', fullpath)
  container.setAttribute('class', MIP_IFRAME_CONTAINER)

  /**
   * Fix an iOS iframe width bug, see examples/mip1/test.html
   * https://stackoverflow.com/questions/23083462/how-to-get-an-iframe-to-be-responsive-in-ios-safari
   */
  container.style.height = `${viewport.getHeight()}px`
  container.setAttribute('width', '100%')
  container.setAttribute('scrolling', platform.isIos() ? 'no' : 'yes')

  container.setAttribute('data-page-id', pageId)
  container.setAttribute('sandbox', 'allow-top-navigation allow-popups allow-scripts allow-forms allow-pointer-lock allow-popups-to-escape-sandbox allow-same-origin allow-modals')
  document.body.appendChild(container)

  return container
}

export function removeIFrame (pageId) {
  let container = document.querySelector(`.${MIP_IFRAME_CONTAINER}[data-page-id="${pageId}"]`)
  if (container) {
    container.parentNode.removeChild(container)
  }
}

export function getIFrame (iframe) {
  if (typeof iframe === 'string') {
    return document.querySelector(`.${MIP_IFRAME_CONTAINER}[data-page-id="${iframe}"]`)
  }

  return iframe
}

export function hideAllIFrames () {
  let iframes = document.querySelectorAll(`.${MIP_IFRAME_CONTAINER}`)
  if (iframes) {
    for (let i = 0; i < iframes.length; i++) {
      css(iframes[i], {
        display: 'none',
        opacity: 0
      })
    }
  }
}

function getHeaderHTML (logo, isFake) {
  /* eslint-disable indent */
  return [
    `<div class="${MIP_SHELL_HEADER}">`,
      `<span ${isFake ? '' : 'mip-header-btn'} class="back-button">`,
        BACK_BUTTON_SVG,
      '</span>',
      `<div class="${MIP_SHELL_HEADER}-logo-title">`,
        `<img class="${MIP_SHELL_HEADER}-logo" src="${logo}">`,
        `<span class="${MIP_SHELL_HEADER}-title"></span>`,
      '</div>',
    '</div>'
  ].join('')
  /* eslint-enable indent */
}

/**
 * Create loading div
 *
 * @param {Object} pageMeta Page meta info
 */
export function createLoading (pageMeta) {
  let loading = document.querySelector('#' + MIP_PAGE_LOADING_WRAPPER)
  if (loading) {
    return loading
  }

  let logo = pageMeta ? (pageMeta.header.logo || '') : ''
  loading = document.createElement('mip-fixed')
  loading.id = MIP_PAGE_LOADING_WRAPPER
  loading.setAttribute('class', MIP_PAGE_LOADING_WRAPPER)
  loading.innerHTML = getHeaderHTML(logo, false)
  document.body.appendChild(loading)
  return loading
}

// @TODO 可能已经没人用，之后考虑删除吧

export function setHeaderColor (container, dom, color, backgroundColor, borderColor) {
  css(container, 'background-color', backgroundColor)
  css(dom.querySelectorAll('svg'), 'fill', color)
  css(dom.querySelector(`.${MIP_SHELL_HEADER}-title`), 'color', color)
  css(dom.querySelector(`.${MIP_SHELL_HEADER}-logo`), 'border-color', borderColor)
  css(dom.querySelector(`.${MIP_SHELL_HEADER}-button-group`), 'border-color', borderColor)
  css(dom.querySelector(`.${MIP_SHELL_HEADER}-button-group .split`), 'background-color', borderColor)
}

/**
 * Change loading according to targetMeta
 * Return loading div
 *
 * @param {Object} targetMeta Page meta of target page
 * @param {Object} options
 * @param {boolean} options.onlyHeader Moving out only needs header, not loading body
 * @param {boolean} options.transitionContainsHeader Whether transition contains header
 * @returns {HTMLElement}
 */
export function getLoading (targetMeta, {onlyHeader, transitionContainsHeader} = {}) {
  let loadingSelector = '#' + MIP_PAGE_LOADING_WRAPPER
  let loading = document.querySelector(loadingSelector)
  if (!loading) {
    createLoading()
    loading = document.querySelector(loadingSelector)
  }

  if (!targetMeta) {
    return loading
  }

  // Transition only need header (frameMoveOut) but doesn't contains header (extended from child mip-shell-xxx)
  // Means doesn't need loading
  if (!transitionContainsHeader && onlyHeader) {
    css(loading, 'display', 'none')
    return loading
  }

  loading.classList.toggle('transition-without-header', !transitionContainsHeader)
  if (transitionContainsHeader) {
    loading.classList.toggle('only-header', !!onlyHeader)
  }

  let mipShellHeader = loading.querySelector('.' + MIP_SHELL_HEADER)
  if (!transitionContainsHeader || !targetMeta.header.show) {
    css(mipShellHeader, 'display', 'none')
  } else {
    css(mipShellHeader, 'display', 'flex')
  }

  let $logo = loading.querySelector(`.${MIP_SHELL_HEADER}-logo`)
  if (targetMeta.header.logo) {
    $logo.setAttribute('src', targetMeta.header.logo)
    css($logo, 'display', 'block')
  } else {
    css($logo, 'display', 'none')
  }

  if (targetMeta.header.title) {
    loading.querySelector(`.${MIP_SHELL_HEADER}-title`).innerHTML = targetMeta.header.title
  }

  css(loading.querySelector('.back-button'), 'display', targetMeta.view.isIndex ? 'none' : 'flex')

  if (transitionContainsHeader && targetMeta.header.show) {
    // Set color & borderColor & backgroundColor
    let {
      color = '#000000',
      borderColor,
      backgroundColor = '#ffffff'
    } = targetMeta.header
    let loadingContainer = loading.querySelector('.' + MIP_SHELL_HEADER)

    setHeaderColor(loadingContainer, loading, color, backgroundColor, borderColor)
  }

  return loading
}

export function createFadeHeader (pageMeta) {
  let fadeHeader = document.querySelector('#' + MIP_PAGE_FADE_HEADER_WRAPPER)
  if (fadeHeader) {
    return fadeHeader
  }

  let logo = pageMeta ? (pageMeta.header.logo || '') : ''
  fadeHeader = document.createElement('mip-fixed')
  fadeHeader.id = MIP_PAGE_FADE_HEADER_WRAPPER
  fadeHeader.setAttribute('class', MIP_PAGE_FADE_HEADER_WRAPPER)
  fadeHeader.innerHTML = getHeaderHTML(logo, true)
  document.body.appendChild(fadeHeader)
  return fadeHeader
}

/**
 * Change fade header according to targetMeta
 * Return fade header div
 *
 * @param {Object} targetMeta Page meta of target page
 * @param {Object} sourceMeta Page meta of source page (undefined when frameMoveIn, NOT undefined when frameMoveOut)
 * @returns {HTMLElement}
 */
export function getFadeHeader (targetMeta, sourceMeta) {
  let fadeHeaderSelector = '#' + MIP_PAGE_FADE_HEADER_WRAPPER
  let fadeHeader = document.querySelector(fadeHeaderSelector)
  if (!fadeHeader) {
    createFadeHeader()
    fadeHeader = document.querySelector(fadeHeaderSelector)
  }

  if (!targetMeta) {
    return fadeHeader
  }

  let $logo = fadeHeader.querySelector(`.${MIP_SHELL_HEADER}-logo`)
  if (targetMeta.header.logo) {
    $logo.setAttribute('src', targetMeta.header.logo)
    css($logo, 'display', 'block')
  } else {
    css($logo, 'display', 'none')
  }

  if (targetMeta.header.title) {
    fadeHeader.querySelector(`.${MIP_SHELL_HEADER}-title`).innerHTML = targetMeta.header.title
  }

  css(fadeHeader.querySelector('.back-button'), 'display', targetMeta.view.isIndex ? 'none' : 'flex')

  // Set color & borderColor & backgroundColor
  let colorConfig = sourceMeta ? sourceMeta.header : {}
  let {
    color = '#000000',
    borderColor = '#e1e1e1',
    backgroundColor = '#ffffff'
  } = colorConfig
  let fadeHeaderContainer = fadeHeader.querySelector('.' + MIP_SHELL_HEADER)

  setHeaderColor(fadeHeaderContainer, fadeHeader, color, backgroundColor, borderColor)

  return fadeHeader
}

/**
 * Toggle fade header
 * Invoked by `refreshShell` in MIP Shell with `asyncRefresh` is `true`
 *
 * @param {boolean} toggle Show/Hide fade header
 * @param {Object} pageMeta pageMeta of current page. `undefined` when `toggle` is `false`
 */
export function toggleFadeHeader (toggle, pageMeta) {
  let fadeHeader = getFadeHeader(pageMeta)

  if (!toggle) {
    css(fadeHeader, 'display', 'none')
    return
  }

  css(fadeHeader, 'display', 'block')
  fadeHeader.classList.add('fade-enter', 'fade-enter-active')

  // trigger layout
  /* eslint-disable no-unused-expressions */
  fadeHeader.offsetWidth
  /* eslint-enable no-unused-expressions */

  whenTransitionEnds(fadeHeader, 'transition', () => {
    fadeHeader.classList.remove('fade-enter-to', 'fade-enter')
  })

  nextFrame(() => {
    fadeHeader.classList.add('fade-enter-to')
    fadeHeader.classList.remove('fade-enter')
  })
}

/**
 * Add empty `<mip-shell>` if not found in page
 */
export function ensureMIPShell () {
  if (!document.querySelector('mip-shell') && !document.querySelector('[mip-shell]')) {
    let shell = document.createElement('mip-shell')
    let script = document.createElement('script')
    script.setAttribute('type', 'application/json')
    script.innerHTML = '{"ignoreWarning": true}'
    shell.appendChild(script)
    document.body.appendChild(shell)
  }
}

/**
 * Returns whether mip-shell needs to be disabled.
 *
 * @returns {boolean}
 */
export function isMIPShellDisabled () {
  return !!(window.MIP.standalone && document.querySelector('mip-shell[disabled]'))
}

export function nextFrame (fn) {
  raf(() => {
    raf(fn)
  })
}

export function whenTransitionEnds (el, type, cb) {
  if (!type) {
    return cb()
  }

  const event = type === 'transition' ? transitionEndEvent : animationEndEvent
  const onEnd = e => {
    if (e.target === el) {
      end()
    }
  }
  const end = () => {
    el.removeEventListener(event, onEnd)
    cb()
  }
  el.addEventListener(event, onEnd)
}

/**
 * Append <script>
 */
export function appendScript (src) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    script.onload = resolve
    script.onerror = reject
    script.src = src
    document.body.appendChild(script)
  })
}
