/* global fetch atob */

import { parseString } from 'xml2js'

if (typeof Promise === 'undefined') {
  require('es6-promise').polyfill()
}

if (typeof fetch === 'undefined') {
  require('isomorphic-fetch')
}

if (typeof atob === 'undefined') {
  global.atob = require('atob')
}

export const config = {
  base: 'http://ok2.se:8000',
  urls: {
    categories: '/enigma2.php?username=%user&password=%pass',
    panel: '/panel_api.php?username=%user&password=%pass',
    channel: '/enigma2.php?username=%user&password=%pass&type=get_vod_streams&cat_id=',
    epg: '/streaming/timeshift.php?username=%user&password=%pass&action=get_epg&stream_id='
  },
  titleRegex: /(.+) \[([0-9]{2}:[0-9]{2}) - ([0-9]{2}:[0-9]{2})\] \+ -.+ {2}(.+)/
}

class LiteIPTV {
/**
 * Class for messing with LiteIPTV
 * @class LiteIPTV
 * @param  {string} username Your LiteIPTV username
 * @param  {string} password Your LiteIPTV password
 * @example
 * import LiteIPTV from 'liteiptv'
 * const liteiptv = new LiteIPTV('USERNAME', 'PASSWORD')
 */
  constructor (username, password) {
    this.username = username
    this.password = password
  }

  getJSON (url) {
    const u = url.replace(/%user/g, this.username).replace(/%pass/g, this.password)
    return fetch(`${config.base}${u}`)
      .then(r => {
        return r.json().then(j => {
          if (j && j.user_info && j.user_info && j.user_info.auth === 0) {
            throw new Error('Not Authorized')
          }
          if (r.status !== 200) {
            throw (j)
          }
          return j
        })
      })
  }

  getXML (url) {
    const u = url.replace(/%user/g, this.username).replace(/%pass/g, this.password)
    return fetch(`${config.base}${u}`)
      .then(r => {
        return r.text().then(x => {
          return new Promise((resolve, reject) => {
            parseString(x, (err, ret) => {
              if (err) return reject(new Error(x))
              resolve(ret)
            })
          })
        })
      })
  }

  /**
   * Get all info at once
   * @method panel
   * @return {Promise} Resolves to a large object with all your info
   * @example
   * liteiptv.panel()
   *   .then(info => console.log(info))
   */
  panel () {
    return this.getJSON(config.urls.panel)
  }

  /**
   * Get list of available stream categories
   * @method categories
   * @param {boolean} live Live or video-on-demand?
   * @return {Promise} Resolves to a list of available categories
   * @example
   * liteiptv.categories()
   *   .then(streams => console.log(streams))
   */
  categories (live = true) {
    const type = live ? 'live' : 'vod'
    return this.getXML(`${config.urls.categories}&type=get_${type}_categories`)
      .then(x => x.items.channel.map(c => {
        return {
          title: atob(c.title[0]),
          id: c.category_id[0]
        }
      }))
  }

  /**
   * Get the streams for a category
   * @param  {number} id   The id from `categories()`
   * @param {boolean} live Live or video-on-demand?
   * @param {boolean} m3u  Return an M3U playlist for this stream list?
   * @return {Promise} Resolves to a list of streams
   * @example
   * liteiptv.category(4)
   *   .then(streams => console.log(streams))
   */
  category (id, live = true, m3u = false) {
    const type = live ? 'live' : 'vod'
    return this.getXML(`${config.urls.channel}&type=get_${type}_streams&cat_id=${id}`)
      .then(x => x.items.channel.map(c => {
        const out = {
          url: c.stream_url[0],
          description: atob(c.description[0]),
          image: c.desc_image[0],
          id: c.stream_url[0].match(/([0-9]+)\.ts$/)[1]
        }
        if (c.title && c.title[0]) {
          const m = atob(c.title[0]).match(config.titleRegex)
          if (m) {
            out.channel = m[1]
            out.start = m[2]
            out.end = m[3]
            out.title = m[4]
          }
        }
        return out
      }))
      .then(channels => !m3u ? channels : LiteIPTV.categoryToM3u(channels))
  }

  /**
   * Generate an M3U playlist for the output of `category()`
   * @param  {object} channels The output from `category()`
   * @return {string} M3U playlist
   */
  static categoryToM3u (channels) {
    return channels.map(channel => `#EXTINF:-1,${channel.channel ? channel.id + ' ' + channel.channel : channel.id}\n${channel.url}`).join('\n')
  }
}

export default LiteIPTV
