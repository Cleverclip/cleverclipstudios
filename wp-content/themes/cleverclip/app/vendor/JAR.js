window.getCookie = function (name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))

  if (match) {
    return match[2]
  }
}

const isAdRelevantVisit = () => {
  return document.referrer.includes('google.com') || document.referrer.includes('bing.com') || location.search.includes('utm_source') || location.search.includes('gclid')
}

const getVisitedDate = () => {
  const date = new Date()

  return date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate() + 'T' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':00Z'
}

const getParameters = () => {
  const result = {}

  let tmp = null

  location.search.substr(1).split('&').forEach(item => {
    tmp = item.split('=')

    result[tmp[0]] = decodeURIComponent(tmp[1])
  })

  return result
}

const converParametersToString = params => {
  const result = {}

  Object.keys(params).forEach(function (key) {
    if (key === 'utm_source' || key === 'utm_medium' || key === 'utm_campaign' || key === 'utm_term' || key === 'utm_content' || key === 'gclid' || key === 'utm_content' || key === 'utm_term') {
      result[key] = params[key]
    } else if (document.referrer.includes('google.com') || document.referrer.includes('bing.com')) {
      result = {
        utm_source: 'organic'
      }
    }
  })

  result.visit = getVisitedDate()

  return result
}

const writeCookieWithUTMParameters = params => {
  let cookieValue = [params]

  if (document.cookie.indexOf('smartUTMJar=') >= 0) {
      lastCookieValue = JSON.parse(getCookie('smartUTMJar'));
      cookieValue = cookieValue.concat(lastCookieValue);
  }

  document.cookie = 'smartUTMJar='.concat(JSON.stringify(cookieValue))
}

const writeUTMField = () => {
  if (document.cookie.indexOf('smartUTMJar=') >= 0) {
      hf = document.getElementById('smujarHistory')

      if (!hf) {
        hf = document.getElementsByName('smujarHistory')[0]
      }

      if (hf) {
        hf.value = getCookie('smartUTMJar')
      }

      hf = document.getElementById('smujarFirstVisit')

      if (!hf) {
        hf = document.getElementsByName('smujarFirstVisit')[0]
      }

      if (hf) {
        const cookie = JSON.parse(getCookie('smartUTMJar'))
        const { gclid, utm_source, utm_medium, utm_campaign, utm_content, utm_term } = cookie[cookie.length - 1]

        hf.value = (utm_source || '') + (('-' + utm_medium) || '') + (('-' + gclid) || '') + (('-' + utm_campaign) || '') + (('-' + utm_content) || '') + (('-' + utm_term) || '')
      }

      hf = document.getElementById('smujarFirstVisitTime')

      if (!hf) {
        hf = document.getElementsByName('smujarFirstVisitTime')[0]
      }

      if (hf) {
        const cookie = JSON.parse(getCookie('smartUTMJar'))

        hf.value = cookie[cookie.length - 1].visit
      }
  }
}

const maintainLength = () => {
  if (document.cookie.indexOf('smartUTMJar=') >= 0) {
    let lastCookieValue = JSON.parse(getCookie('smartUTMJar'))

    if (lastCookieValue.length > 20) {
      const cookieValue = lastCookieValue.slice(lastCookieValue.length-1, lastCookieValue.length)

      document.cookie = 'smartUTMJar='.concat(JSON.stringify(cookieValue))
    }
  }
}

const disableSmujarCookie = () => {
  document.cookie = 'smartUTMJar=DoNotTrack'

  hf = document.getElementById('smujarFirstVisit')

  if (hf) hf.value = ''

  hf = document.getElementById('smujarHistory')

  if (hf) hf.value = ''

  hf = document.getElementById('smujarFirstVisitTime')

  if (hf) hf.value = ''

  hf = document.getElementsByName('smujarFirstVisit')

  if (hf.length > 0) hf[0].value = ''

  hf = document.getElementsByName('smujarHistory')

  if (hf.length > 0) hf[0].value = ''

  hf = document.getElementsByName('smujarFirstVisitTime')

  if (hf.length > 0) hf[0].value = ''
}

const isTrackEnabled = () => {
  return getCookie('smartUTMJar') != 'DoNotTrack'
}

window.addEventListener('load', () => {
  if (isAdRelevantVisit() && isTrackEnabled()) {
    writeCookieWithUTMParameters(converParametersToString(getParameters()))
  }

  if (isTrackEnabled()) {
    maintainLength()
    writeUTMField()
  }
})
