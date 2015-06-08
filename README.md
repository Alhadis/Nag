Nag
===

Display automatic callouts to a user, unless they've been previously dismissed. Suitable for subscription popups, greetings, notifications of new features, etc.

1. [Usage](#usage)
2. [Option Reference](#option-reference)
	1. [cookieName](#cookiename)
	2. [eventName](#eventname)
	3. [eventTarget](#eventtarget)
	4. [onHide](#onhide)
	5. [onShow](#onshow)
	6. [showAfter](#showafter)
	7. [showClass](#showclass)
	8. [verbose](#verbose)


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
	cookieName:		element.id ? "shown-"+element.id : "nag-dismissed",
	eventName:		"scroll",
	eventTarget:	window,
	onHide:			function(){},
	onShow:			function(){},
	showAfter:		4000,
	showClass:		"show",
	verbose:		false
});
```


## Option Reference

### cookieName
**Type:** String<br/>
**Default:** `"nag-dismissed"` (See below)

Name of the cookie that indicates if the user's closed this nag before.

If omitted, the element's ID will be used, prepended with `"shown‑"`. If the element lacks an ID attribute, a last resort value of `"nag‑dismissed"` will be used instead.

Note that Nag instances should *always* be supplied a unique, explicit cookie name for predictable behaviour.

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
