# liteiptv
Node interface for [LiteIPTV](https://liteiptv.com/)

Install in your project with `npm i -S liteiptv`

## Class: LiteIPTV


### LiteIPTV.panel() 

Get all info at once

**Returns**: `Promise`, Resolves to a large object with all your info

**Example**:
```js
liteiptv.panel()
  .then(info => console.log(info))
```

### LiteIPTV.categories(live) 

Get list of available stream categories

**Parameters**

**live**: `boolean`, Live or video-on-demand?

**Returns**: `Promise`, Resolves to a list of available categories

**Example**:
```js
liteiptv.categories()
  .then(streams => console.log(streams))
```

### LiteIPTV.category(id, live, m3u) 

Get the streams for a category

**Parameters**

**id**: `number`, The id from `categories()`

**live**: `boolean`, Live or video-on-demand?

**m3u**: `boolean`, Return an M3U playlist for this stream list?

**Returns**: `Promise`, Resolves to a list of streams

**Example**:
```js
liteiptv.category(4)
  .then(streams => console.log(streams))
```

### LiteIPTV.epg(id) 

Get all available EPG records for a stream

**Parameters**

**id**: `Number`, stream_id to get EPG for

**Returns**: `Promise`, Resolves to EPG data about a single stream

### LiteIPTV.categoryToM3u(channels) 

Generate an M3U playlist for the output of `category()`

**Parameters**

**channels**: `object`, The output from `category()`

**Returns**: `string`, M3U playlist
