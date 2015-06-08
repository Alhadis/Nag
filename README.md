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
