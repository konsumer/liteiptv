/* global describe it */
import { expect } from 'chai'
import LiteIPTV from '../src/index'

if (!process.env.LITEIPTV_USER || !process.env.LITEIPTV_PASSWORD) {
  console.log('You need to set these environment variables: LITEIPTV_USER, LITEIPTV_PASSWORD')
  process.exit(1)
}

// make sure to set these environment variables
const lite = new LiteIPTV(process.env.LITEIPTV_USER, process.env.LITEIPTV_PASSWORD)

// this will be used to test standalone m3u function
let categories

describe('LiteIPTV', () => {
  it('should get panel info', () => lite.panel().then(p => {
    expect(p).to.include.all.keys('user_info', 'server_info', 'categories', 'available_channels')
  }))

  it('should get available live categories', () => lite.categories()
    .then(avail => {
      expect(avail.length).to.be.gt(10)
    })
  )

  it('should get available on-demand categories', () => lite.categories(false)
    .then(avail => {
      expect(avail.length).to.be.gt(5)
    })
  )

  it('should be able to get all live-streams in ENGLISH', () => lite.category(4)
    .then(streams => {
      categories = streams
      expect(streams.length).to.be.gt(10)
    })
  )

  it('should be able to make a live-stream ENGLISH m3u', () => lite.category(4, true, true)
    .then(m3u => {
      expect(m3u.length).to.be.gt(100)
    })
  )

  it('should be able to generate an m3u from output from category(4)', () => LiteIPTV.categoryToM3u(categories)
    .then(m3u => {
      console.log(m3u)
    })
  )
})
