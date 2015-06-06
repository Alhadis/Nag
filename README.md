Nag
===

Display automatic callouts to a user, unless they've been previously dismissed. Suitable for subscription popups, greetings, notifications of new features, etc.

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

### Option Reference

| Name			| Type			|	Description	 |
|---------------|---------------|---------------------------------------|
| cookieName	| String		|	Name of the cookie that indicates if the user's closed this nag before.<br/><br/>If omitted, the element's ID will be used, prepended with `"shown‑"`. If the element lacks an ID attribute, a last resort value of `"nag‑dismissed"` will be used instead.<br/><br/>Note that Nag instances should *always* be supplied a unique, explicit cookie name for predictable behaviour. |
| eventName		| String		|	DOM event that triggers the nag. Defaults to `"scroll"`. |
| eventTarget	| [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) | DOM object listening for the nag-triggering event. Defaults to `window`. |
| onHide		| Function		|	Run when Nag's dismissed. Defaults to a no-op. |
| onShow		| Function		|	Run when Nag's dismissed. Defaults to a no-op. |
| showAfter		| Number		|	Milliseconds to wait before nagging user automatically. Defaults to `4000` if undefined; any other falsy values will disable this behaviour. |
| showClass		| String		|	CSS class for displaying the target element. Defaults to `"show"`.<br/><br/>It's assumed that the element is hidden by default, and will be rendered visible to the user if this class is added to it. |
| verbose		| Boolean		|	**(Unminified code only)** Sends debugging messages to the console during the Nag's lifespan. Default: `false`. |
