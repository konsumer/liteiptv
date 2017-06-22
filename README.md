# liteiptv
Node interface for [LiteIPTV](https://liteiptv.com/)

Install in your project with `npm i -S liteiptv`

## Class: LiteIPTV

**Example**:
```js
import LiteIPTV from 'liteiptv'
const liteiptv = new LiteIPTV('USERNAME', 'PASSWORD')
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

### LiteIPTV.categoryToM3u(channels) 

Generate an M3U playlist for the output of `category()` if you are cacheing your output.

This is great

**Parameters**

**channels**: `object`, The output from `category()`

**Returns**: `string`, M3U playlist

### LiteIPTV.panel() 

Get all info at once. This is a built-in endpoint that is useful if you want to grab all the data at once.

**Returns**: `Promise`, Resolves to a large object with all your info

**Example**:
```js
liteiptv.panel()
  .then(info => console.log(info))
```