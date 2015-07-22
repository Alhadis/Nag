Nag
===

Display automatic callouts to a user, unless they've been previously dismissed. Suitable for subscription popups, greetings, notifications of new features, etc.

1. [Usage](#usage)
2. [Option Reference](#option-reference)
	1. [cookieDomain] (#cookiedomain)
	2. [cookieExpires] (#cookieexpires)
	3. [cookieName] (#cookiename)
	4. [cookiePath] (#cookiepath)
	5. [cookieSecure] (#cookiesecure)
	6. [eventName] (#eventname)
	7. [eventTarget] (#eventtarget)
	8. [onHide] (#onhide)
	9. [onShow] (#onshow)
	10. [showAfter] (#showafter)
	11. [showClass] (#showclass)
	12. [verbose] (#verbose)


## Usage

First argument is a reference to an HTML element:
```js
var element	=	document.querySelector("#subscribe-now");
var nag		=	new Nag(element);
```

Second argument is an optional hash of properties to fine-tune the Nag's behaviour:
```js
/** Possible options and their default values are depicted below: */
var nag	=	new Nag(element, {
	cookieDomain:	undefined,
	cookieExpires:	7,
	cookieName:		element.id ? "shown-"+element.id : "nag-dismissed",
	cookiePath:		"/",
	cookieSecure:	undefined,
	eventName:		"scroll",
	eventTarget:	window,
	onHide:			function(){},
	onShow:			function(){},
	showAfter:		4000,
	showClass:		"show",
	verbose:		undefined
});
```


## Option Reference

### cookieDomain
**Type:** String<br/>
**Default:** `undefined`

Cookie's "domain" attribute. Defaults to the current host, as per [RFC 6265](http://tools.ietf.org/html/rfc6265#section-4.1.2.3).

### cookieExpires
**Type:** Date | Number<br/>
**Default:** `7`

Cookie's expiration as a Date, or the number of days to store it in memory. Defaults to 7.

### cookieName
**Type:** String<br/>
**Default:** `"nag-dismissed"` (See below)

Name of the cookie that indicates if the user's closed this nag before.

If omitted, the element's ID will be used, prepended with `"shown‑"`. If the element lacks an ID attribute, a last resort value of `"nag‑dismissed"` will be used instead.

Note that Nag instances should *always* be supplied a unique, explicit cookie name for predictable behaviour.

### cookiePath
**Type:** String<br/>
**Default:** `"/"` (Site root)

Cookie's "path" attribute, as per [RFC 6265](http://tools.ietf.org/html/rfc6265#section-4.1.2.4).

### cookieSecure
**Type:** Boolean<br/>
**Default:** `undefined`

Cookie's "secure" attribute, as per [RFC 6265](http://tools.ietf.org/html/rfc6265#section-4.1.2.5).

### eventName
**Type:** String<br/>
**Default:** `"scroll"`

DOM event that triggers the nag.

### eventTarget
**Type:** [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) <br/>
**Default:** `window`

DOM object listening for the nag-triggering event.

### onHide
**Type:** Function<br/>
**Default:** `function(){}` (No-op)

Run when Nag's dismissed.

### onShow
**Type:** Function<br/>
**Default:** `function(){}` (No-op)

Run when Nag's displayed.

### showAfter
**Type:** Number<br/>
**Default:** `4000`

Milliseconds to wait before nagging user automatically. Defaults to `4000` if undefined; any other falsy values will disable this behaviour.

### showClass
**Type:** String<br/>
**Default:** `"show"`

CSS class for displaying the target element. It's assumed that the element is hidden by default, and will be rendered visible to the user if this class is added to it.

### verbose
**Type:** Boolean<br/>
**Default:** `undefined`

**(Unminified code only)**<br/>
Sends debugging messages to the console during the Nag's lifespan.
