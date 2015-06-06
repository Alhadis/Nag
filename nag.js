(function(){
	"use strict";
	
	
	/*<*/
	var WIN		=	window,
		DOC		=	document,
		TRUE	=	true,
		FALSE	=	false,
		NOOP	=	function(){},
		UNDEF,

		/** Lengthy method/property names */
		ADD_LISTENER		=	"addEventListener",
		REMOVE_LISTENER		=	"removeEventListener",
		QUERY				=	"querySelector",
		QUERY_ALL			=	QUERY + "All",

		/** Aliased functions */
		forEach				=	Array.prototype.forEach,
		

		/** Get or set the value of a cookie with the designated name. */
		cookie	=	function (e,n,o){if(!e){var t=document.cookie.split(/;\s*/g),i={},r,s,u;for(s=0,u=t.length;s<u;++s)if(r=t[s].indexOf("="))i[t[s].substr(0,r)]=decodeURIComponent(t[s].substr(r+1));return i}if(undefined===n){t=document.cookie.split(/;\s*/g),r=e.length+1;for(var s=0,u=t.length;s<u;++s)if(e+"="===t[s].substr(0,r))return decodeURIComponent(t[s].substr(r));return null}else{o=o||{};if(null===n){n="";o.expires=-1}if(o.expires){var d=o.expires,d=(!d.toUTCString?new Date(Date.now()+864e5*d):d).toUTCString()}document.cookie=e+"="+encodeURIComponent(n)+(d?"; expires="+d:"")+(o.path?"; path="+o.path:"")+(o.domain?"; domain="+o.domain:"")+(o.secure?"; secure":"")}},
		/*>*/





		/**
		 * Displays an automatic callout to a user, unless it's been previously dismissed.
		 *
		 * Suitable for subscription popups, greetings, notifications of new features, etc.
		 *
		 * @param {HTMLElement} el               - Container element for the content to reveal.
		 * @param {Object}      opts             - Hash of options to fine-tune Nag's behaviour.
		 * @param {String}      opts.cookieName  - Name of cookie that controls if the user's closed this nag before.
		 * @param {EventTarget} opts.eventTarget - DOM object listening for the nag-triggering event. Defaults to the window object.
		 * @param {Function}    opts.onHide      - Callback run when Nag's dismissed. Defaults to a no-op.
		 * @param {Function}    opts.onShow      - Callback run when Nag's displayed. Defaults to a no-op.
		 * @param {Number}      opts.showAfter   - Milliseconds to wait before nagging user automatically. Empty values disable this behaviour.
		 * @param {String}      opts.showClass   - CSS class that displays the target element.
		 * @param {String}      opts.showOn      - Name of DOM event that triggers the nag. Defaults to "scroll".
		 * @param {Boolean}     opts.verbose     - (Unminified code only) Logs debugging messages to console.
		 * @constructor
		 */
		Nag	=	function(el, opts){

			var	THIS			=	this,


				/**
				 * Name of the cookie that stores whether the user's dismissed this particular dialogue.
				 *
				 * If omitted, will default to the element's ID prepended with "shown-"; or if the element lacks an ID attribute,
				 * a last resort value of "nag-dismissed". Note that Nag instances should ALWAYS be supplied a unique, explicit
				 * cookie name for predictable behaviour.
				 */
				cookieName		=	opts.cookieName || (el.id ? ("shown-" + el.id) : "") || "nag-dismissed",


				/** DOM event name that triggers the nag */
				eventName		=	opts.showOn || "scroll",


				/** Target of aforementioned DOM event that receives the event. */
				eventTarget		=	opts.eventTarget || WIN,


				/** Callbacks triggered when hiding/showing element */
				onHide			=	opts.onHide || NOOP,
				onShow			=	opts.onShow || NOOP,


				/** Milliseconds to wait before automatically showing the nag to the user. If empty, no automatic nagging is executed. */
				showAfter		=	Math.max(0, opts.showAfter) || 4000,


				/** CSS class that displays the target element. */
				showClass		=	opts.showClass	|| "show",





				/** ID of delayed callback, if opts.showAfter was supplied. */
				timeoutID,


				/** Callback queued to reveal the Nag after a delay, or on an interaction event. */
				triggerShow	=	function(){
					console.info("Triggered.");

					/** Clear any listeners or queued callbacks. */
					clearTimeout(timeoutID);
					eventTarget[ REMOVE_LISTENER ](eventName, triggerShow);
					
					THIS.show	=	TRUE;
				},


				/** Internal */
				show		=	FALSE,
				silenced;



			/** Take care of getter/setter properties */
			Object.defineProperties(THIS, {

				/** Read-only flag indicating whether this Nag's been dismissed before. */
				silenced:	{
					get: function(){ return silenced; }
				},


				/** Whether the Nag's currently visible to the user. */
				show:	{
					get:	function(){ return show },
					set:	function(i){
						i	=	!!i;
						if(i !== show){
							show	=	i;
							el.classList[show ? "add" : "remove" ](showClass);
							(show ? onShow(THIS) : onHide(THIS));
						}
					}
				}
			});




			/** Haven't dismissed this nag yet, so let's irritate the user. */
			if(!+cookie(cookieName)){

				/** Show nag on a DOM event */
				if(eventName){

					/** Add listener after a brief delay to prevent the page's initial scroll-point from erroneously triggering an onScroll event on page-load. */
					setTimeout(function(){
						eventTarget[ ADD_LISTENER ](eventName, triggerShow);
					}, 100);
				}


				/** Show nag automatically after X number of milliseconds. */
				if(showAfter)
					timeoutID	=	setTimeout(triggerShow, showAfter);


				/*~*/
				if(opts.verbose){
					if(eventName && timeoutID)	console.info("Set to nag after " + (showAfter / 1000) + " seconds, or on the \""+eventName+"\" event, whichever happens first.");
					else if(eventName)			console.info("Registering callback for \"" + eventName + "\" event.");
					else if(showAfter)			console.info("Showing nag after " + (showAfter / 1000) + " seconds.");
					else						console.error("No event or timer delay specified! Wrong arguments?");
				}
				/*~*/
			}



			/**
			 * Dismisses a Nag whilst setting a cookie not to show it again.
			 *
			 * Typically called from a "close button", but may also be called from a form's submission handler.
			 * @return {Nag}
			 */
			THIS.kick	=	function(){
				cookie(cookieName, 1);
				THIS.show	=	FALSE;
				silenced	=	TRUE;
				return THIS;
			};


			/**
			 * Resets the Nag's cookie, ready to irritate the user once more.
			 *
			 * @return {Nag}
			 */
			THIS.reset	=	function(){
				cookie(cookieName, 0);
				return THIS;
			};


			/**
			 * Assigns a number of event listeners to the target element's contents, which dismiss the Nag from showing again when invoked.
			 *
			 * @param {Object} args - Object whose keys represent DOM selectors, and whose values represent event types to listen for.
			 * @example .resetOn( {"#close-btn": "click"} )
			 * @return {Nag}
			 */
			THIS.kickOn	=	function(args){
				var i, e;
				for(i in args){
					e	=	args[i];
					forEach.call(el[QUERY_ALL](i), function(i){
						i[ ADD_LISTENER ](e, function(){
							
							/*~*/if(opts.verbose) console.info("Kicking...");/*~*/
							THIS.kick();
						});
					});
				}
				return THIS;
			};
		};

	
	/** Export */
	WIN.Nag	=	Nag;
}());
