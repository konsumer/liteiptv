# liteiptv
Node interface for [LiteIPTV](https://liteiptv.com/)

Install in your project with `npm i -S liteiptv`

## Class: LiteIPTV

**Example**:
```js
import LiteIPTV from 'liteiptv'
const liteiptv = new LiteIPTV('USERNAME', 'PASSWORD')
```

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

### LiteIPTV.category(id, live) 

Get the streams for a category

**Parameters**

**id**: `number`, The id from `categories()`

**live**: `boolean`, Live or video-on-demand?

**Returns**: `Promise`, Resolves to a list of streams

**Example**:
```js
liteiptv.category()
  .then(streams => console.log(streams))
```