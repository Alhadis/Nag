Nag
===

Display automatic callouts to a user, unless they've been previously dismissed. Suitable for subscription popups, greetings, notifications of new features, etc.

1. [Usage](#usage)
2. [Option Reference](#option-reference)
	1. [cookieDomain](#cookiedomain)
	2. [cookieExpires](#cookieexpires)
	3. [cookieName](#cookiename)
	4. [cookiePath](#cookiepath)
	5. [cookieSecure](#cookiesecure)
	6. [eventName](#eventname)
	7. [eventTarget](#eventtarget)
	8. [kickWhen](#kickwhen)
	9. [kickSoftlyWhen](#kicksoftlywhen)
	10. [onHide](#onhide)
	11. [onShow](#onshow)
	12. [showAfter](#showafter)
	13. [showClass](#showclass)
	14. [verbose](#verbose)
3. [Methods](#methods)
	1. [kick](#kick)
	2. [kickWhen](#kickwhen)
	3. [reset](#reset)
	4. [setKick](#setkick)


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
	kickWhen:		undefined,
	kickSoftlyWhen:	undefined,
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

### kickWhen
**Type:** Object<br/>
**Default:** `undefined`

Configures which events will hide the Nag and prevent it showing again, expressed as a hash of element selectors keyed by event type. For example:
```js
kickWhen: {
	click: "#close-btn, .cancel",

	/* Arrays may be used too: */
	click: ["#close-btn", ".cancel"]
}
```
Remember, a Nag can still be dismissed by manually calling its `kick` method. Using the `kickWhen` option simply obviates the need to register very simple event listeners to hide the nag in response to predicted user activity.

In other words, the code block above is functionally equivalent to this:
```js
var nag			= new Nag(element);
var closeBtn	= document.querySelector("#close-btn");
closeBtn.addEventListener("click", function(e){
	nag.kick();
});
```
A [convenience method](#setkick) is also available for setting these handlers on a Nag after instantiation.

### kickSoftlyWhen
**Type:** Object<br/>
**Default:** `undefined`

Analoguous to `kickWhen`, with the exception that the triggered events don't hide the Nag immediately after they fire.

Consider a subscription form that presents a *"thank you!"* message to users who sign up. Were a user to navigate to another page without closing the dialogue, the Nag would still reappear on their next visit. Conversely, kicking the Nag upon a form submission would prevent the thanks message from even appearing in the first place.

This is where this option comes into play: a "soft kick" means disabling a Nag from showing again, but keeping it visible to the reader until another event (usually clicking a close button) invokes a "hard kick". For instance, the hypothetical example above would be resolved with this:
```js
kickSoftlyWhen: {
	submit: "form"
}
```

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




## Methods
Each of the methods described below return a reference to the Nag instance to permit chaining.


### kick
Dismisses a Nag whilst setting a cookie not to show it again.

Typically called from a close button, but may also be called from a form's submission handler.

##### Parameters:
*  **soft (Boolean)**  
   If set, will prevent the Nag from showing again, but won't hide it immediately.


### kickWhen
Aliased form of [setKick](#setkick) (see below).

### reset
Resets the Nag's cookie, ready to irritate the user once more.

**Parameters:**
*	**show (Boolean)**  
	If TRUE, will display the Nag to the user as well.


### setKick
Assigns event listeners to disable the Nag in response to user activity.

**Parameters:**
*	**args (Object)**  
	Object whose keys represent types of events, and whose values are CSS selectors matching the elements listening for them.

*	**softly (Boolean)**  
	Whether to kick the Nag "softly" (disable it in future, but not hide it straight away).

**Example:**
```js
nag.setKick({click: "#close-btn"});
nag.setKick({submit: "form"}, true);
```
