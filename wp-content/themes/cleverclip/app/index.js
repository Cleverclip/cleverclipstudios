import '@babel/polyfill'

import './vendor/JAR'

import Cookies from 'js-cookie'
import FontFaceObserver from 'fontfaceobserver'
import QueryString from 'query-string'
import { each } from 'lodash'
import Scroll from 'scroll-to'

import Loader from 'classes/Loader'
import Responsive from 'classes/Responsive'

import Cookie from 'components/Cookies'
import Footer from 'components/Footer'
import Menu from 'components/Menu'

import About from 'pages/About'
import Blog from 'pages/Blog'
import Case from 'pages/Case'
import Clients from 'pages/Clients'
import Contract from 'pages/Contract'
import Home from 'pages/Home'
import How from 'pages/How'
import Industries from 'pages/Industries'
import Industry from 'pages/Industry'
import Jobs from 'pages/Jobs'
import Post from 'pages/Post'
import Press from 'pages/Press'
import Service from 'pages/Service'
import Services from 'pages/Services'
import Question from 'pages/Question'

import { get } from 'utils/ajax'
import { getOffset } from 'utils/dom'

class App {
  constructor () {
    this.createParameters()
    this.createResponsive()

    const fontTiemposHeadline = new FontFaceObserver('Tiempos Headline')
    const fontWorkSans = new FontFaceObserver('Work Sans')

    Promise.all([
      fontTiemposHeadline.load(),
      fontWorkSans.load()
    ]).then(() => {
      this.createApp()
      this.createCookies()
      this.createMenu()

      this.addEventListeners()
    })
  }

  createParameters () {
    this.query = QueryString.parse(window.location.search)

    each(this.query, (value, key) => {
      if (key.indexOf('utm') > -1) {
        Cookies.set(key, value, {
          expires: 30
        })
      }
    })

    if (!document.referrer.includes('cleverclipstudios.com')) {
      Cookies.set('referrer', document.referrer)
    }
  }

  createResponsive () {
    this.responsive = new Responsive()
  }

  createApp () {
    this.content = document.querySelector('.content')
    this.slug = this.content.dataset.slug

    this.pages = new Map()

    this.pages.set('home', new Home())
    this.pages.set('front-page', new Home())
    this.pages.set('about', new About())
    this.pages.set('blog', new Blog())
    this.pages.set('case', new Case())
    this.pages.set('clients', new Clients())
    this.pages.set('contract', new Contract())
    this.pages.set('how', new How())
    this.pages.set('industries', new Industries())
    this.pages.set('industry', new Industry())
    this.pages.set('jobs', new Jobs())
    this.pages.set('post', new Post())
    this.pages.set('press', new Press())
    this.pages.set('service', new Service())
    this.pages.set('services', new Services())
    this.pages.set('question', new Question())

    for (const page of this.pages.values()) {

    }

    this.onNavigate()

    this.addLinksEventListeners()
  }

  createCookies () {
    this.cookies = new Cookie()
  }

  createFooter () {
    this.footer = new Footer()
  }

  createMenu () {
    this.menu = new Menu()
  }

  onPopState (event) {
    this.onChange({
      push: false,
      url: window.location.href
    })
  }

  async onChange ({ push = true, url = null }) {
    if (this.isLoading) {
      return
    }

    this.isLoading = true

    if (!IS_DEVELOPMENT && url.indexOf('http://') > -1) {
      url = url.replace('http://', 'https://')
    }

    this.loader = new Loader()

    get(url).then(response => {
      this.onRequest({
        push,
        response,
        url
      })
    }).catch(response => {
      this.onRequest({
        push,
        response,
        url: '/404'
      })
    })
  }

  async onRequest ({ push, response, url }) {
    this.isLoading = false

    this.loader.hide()
    this.loader = null

    const html = document.createElement('div')

    html.innerHTML = response

    const content = html.querySelector('.content')

    this.previous = this.page

    await this.page.hide()

    window.scrollTo(0, 0)

    this.content.innerHTML = content.innerHTML
    this.slug = content.dataset.slug

    document.title = html.querySelector('title').textContent

    this.onNavigate()

    if (push) {
      window.history.pushState({}, document.title, url)
    }

    this.addLinksEventListeners()
  }

  async onNavigate () {
    this.page = this.pages.get(this.slug)

    this.page.show(this.previous)

    if (this.menu) {
      this.menu.close()
    }

    this.createFooter()
  }

  onResize () {
    this.responsive.onResize()
  }

  onScroll (event) {
    const scroll = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop

    if (this.page.onScroll) {
      this.page.onScroll(scroll)
    }
  }

  addEventListeners () {
    this.onPopStateEvent = this.onPopState.bind(this)
    this.onResizeEvent = this.onResize.bind(this)
    this.onScrollEvent = this.onScroll.bind(this)

    window.addEventListener('popstate', this.onPopStateEvent)
    window.addEventListener('resize', this.onResizeEvent)
    window.addEventListener('scroll', this.onScrollEvent)
  }

  addLinksEventListeners () {
    const links = document.querySelectorAll('a:not([target="_blank"])')

    each(links, link => {
      const isAnchor = link.href.indexOf('#') > -1
      const isCleverclip = link.href.indexOf('cleverclipstudios') > -1 || link.href.indexOf('localhost') > -1

      if (!isCleverclip) {
        return
      }

      if (isAnchor) {
        link.onclick = event => {
          console.log(event)

          const id = event.target.href.replace(window.location.origin + window.location.pathname, '')

          const element = document.querySelector(id)
          const elementOffset = getOffset(element).top

          const menu = document.querySelector('.menu')
          const menuHeight = menu.clientHeight

          event.preventDefault()

          Scroll(0, elementOffset - menuHeight - 100, {
            duration: 1000,
            ease: 'in-out-expo'
          })
        }

        return
      }

      link.onclick = event => {
        event.preventDefault()

        this.onChange({
          url: link.href
        })
      }
    })
  }
}

new App()
