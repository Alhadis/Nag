(function(){
	"use strict";
	
	
	/*<*/
	var WIN		=	window,
		DOC		=	document,
		TRUE	=	true,
		FALSE	=	false,
		NULL	=	null,
		NOOP	=	function(){},
		UNDEF,

		/** Lengthy method/property names */
		LISTENER			=	"EventListener",
		ADD_LISTENER		=	"add"+LISTENER,
		REMOVE_LISTENER		=	"remove"+LISTENER,
		QUERY				=	"querySelector",
		QUERY_ALL			=	QUERY + "All",
		STRING				=	"string",


		/** Aliased functions */
		forEach				=	Array.prototype.forEach,
		

		/** Get or set the value of a cookie with the designated name. */
		cookie	=	function(e,t,n){var o=DOC.cookie,i=/;\s*/g,r={},s=decodeURIComponent,u,c,d,f;if(!e){for(o=o.split(i),c=0,d=o.length;c<d;++c)if(o[c]&&(u=o[c].indexOf("=")))r[o[c].substr(0,u)]=s(o[c].substr(u+1));return r}if(UNDEF===t){for(o=o.split(i),u=e.length+1,c=0,d=o.length;c<d;++c)if(e+"="===o[c].substr(0,u))return s(o[c].substr(u));return NULL}else{n=n||{};f=n.expires;if(null===t)t="",f=-1;if(f)f=(!f.toUTCString?new Date(Date.now()+864e5*f):f).toUTCString();DOC.cookie=e+"="+encodeURIComponent(t)+(f?"; expires="+f:"")+(n.path?"; path="+n.path:"")+(n.domain?"; domain="+n.domain:"")+(n.secure?"; secure":"")}},
		/*>*/





		/**
		 * Displays an automatic callout to a user, unless it's been previously dismissed.
		 *
		 * Suitable for subscription popups, greetings, notifications of new features, etc.
		 *
		 * @param {HTMLElement} el                 - Container element for the content to reveal.
		 * @param {Object}      opts               - Hash of options to fine-tune Nag's behaviour.
		 * @param {String}      opts.cookieDomain  - Cookie's domain.
		 * @param {Date|Number} opts.cookieExpires - Cookie's expiration as a Date, or the number of days to store it in memory. Defaults to 7.
		 * @param {String}      opts.cookieName    - Name of cookie that controls if the user's closed this nag before.
		 * @param {String}      opts.cookiePath    - Cookie's path. Defaults to site's root: "/"
		 * @param {Boolean}     opts.cookieSecure  - Whether to restrict the cookie to HTTPS.
		 * @param {String}      opts.eventName     - Name of DOM event that triggers the nag. Defaults to "scroll".
		 * @param {EventTarget} opts.eventTarget   - DOM object listening for the nag-triggering event. Defaults to the window object.
		 * @param {Function}    opts.onHide        - Callback run when Nag's dismissed. Defaults to a no-op.
		 * @param {Function}    opts.onShow        - Callback run when Nag's displayed. Defaults to a no-op.
		 * @param {Number}      opts.showAfter     - Milliseconds to wait before nagging user automatically. Empty values disable this behaviour.
		 * @param {String}      opts.showClass     - CSS class that displays the target element.
		 * @param {Boolean}     opts.verbose       - (Unminified code only) Logs debugging messages to console.
		 * @param {Boolean}     lazy               - If TRUE, automatically configures kick handlers on obvious-looking elements.
		 * @constructor
		 */
		Nag	=	function(el, opts, lazy){

			var	THIS			=	this,
			
				/** Arbitrate parameters to allow strings to be passed in for lazy initialisation */
				lazy			=	arguments.length === 1	? TRUE : lazy,
				el				=	STRING === typeof el	? DOC[QUERY](el) : el,
				opts			=	STRING === typeof opts	? {cookieName:opts} : (opts || {}),
				


				/**
				 * Name of the cookie that stores whether the user's dismissed this particular dialogue.
				 *
				 * If omitted, will default to the element's ID prepended with "shown-"; or if the element lacks an ID attribute,
				 * a last resort value of "nag-dismissed". Note that Nag instances should ALWAYS be supplied a unique, explicit
				 * cookie name for predictable behaviour.
				 */
				cookieName		=	opts.cookieName || (el.id ? ("shown-" + el.id) : "") || "nag-dismissed",

				
				/** Config hash to pass to the cookie function, built from "cookie*" properties of opts */
				cookieParams	=	{
					domain:		opts.cookieDomain,
					expires:	opts.cookieExpires	|| 7,
					path:		opts.cookiePath		|| "/",
					secure:		opts.cookieSecure
				},
				

				/** DOM event name that triggers the nag */
				eventName		=	opts.eventName || "scroll",


				/** Target of aforementioned DOM event that receives the event. */
				eventTarget		=	opts.eventTarget || WIN,


				/** Callbacks triggered when hiding/showing element */
				onHide			=	opts.onHide || NOOP,
				onShow			=	opts.onShow || NOOP,


				/** Milliseconds to wait before automatically showing the nag to the user. If empty, no automatic nagging is executed. */
				showAfter		=	opts.showAfter,
				showAfter		=	UNDEF === showAfter ? 4000 : Math.max(0, showAfter),


				/** CSS class that displays the target element. */
				showClass		=	opts.showClass	|| "show",





				/** ID of delayed callback, if opts.showAfter was supplied. */
				timeoutID,


				/** Callback queued to reveal the Nag after a delay, or on an interaction event. */
				triggerShow	=	function(){
					/*~*/if(opts.verbose) console.info("Triggered.");/*~*/

					/** Clear any listeners or queued callbacks. */
					clearTimeout(timeoutID);
					eventTarget[ REMOVE_LISTENER ](eventName, triggerShow);
					
					THIS.show	=	TRUE;
				},


				
				/**
				 * Event handler assigned to an element that signals when a Nag's been kicked by a user.
				 *
				 * Because reinitialising a Nag object will reapply any event listeners set with kickWhen,
				 * we need to make sure the handlers aren't added twice (which could potentially cause unwanted
				 * behaviour). Since addEventListener discards duplicate handlers, using named functions instead
				 * of anonymous functions spares us the trouble of having to remove event listeners from affected
				 * elements.
				 */
				onHardKick	=	function(){
					/*~*/if(opts.verbose) console.info("Kicking...");/*~*/
					THIS.kick();
				},


				/**
				 * Event handler assigned to an element that's used to mark a Nag as dismissed in response to a certain event.
				 *
				 * Refer to the long-winded spiel above.
				 */
				onSoftKick	=	function(){
					/*~*/if(opts.verbose) console.info("Softly Kicking...");/*~*/
					THIS.kick(TRUE);
				},



				/**
				 * Assigns event listeners to disable the Nag in response to user activity.
				 *
				 * @param {Object} args - Object whose keys represent types of events, and whose values are CSS selectors matching the elements listening for them.
				 * @param {Boolean} softly - Whether to kick the Nag "softly" (disable it in future, but not hide it straight away).
				 * @example nag.setKick({"click": "#close-btn"})
				 * @return {Nag}
				 */
				setKick	=	function(args, softly){
					var type, elements;
					for(type in args){

						/** Stringify value in case an array was passed: this implicitly joins multiple selectors with commas */
						elements	= args[type] + "";

						forEach.call(
							el[QUERY_ALL](elements),
							function(o){
								o[ ADD_LISTENER ](type, softly ? onSoftKick : onHardKick)
							}
						);
					}
					return THIS;
				},



				/** Initialiser method called when resetting or creating a new Nag */
				init	=	function(){

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


						/** If kick handlers were specified in the original options object, register them now. */
						setKick(opts.kickWhen);
						setKick(opts.kickSoftlyWhen, TRUE);
					}
				},


				/** Internal */
				show = FALSE,
				silenced;



			/** Take care of getter/setter properties */
			Object.defineProperties(THIS, {

				/** Read-only flag indicating whether this Nag's been dismissed before. */
				silenced: {
					get: function(){ return silenced; }
				},


				/** Whether the Nag's currently visible to the user. */
				show: {
					get: function(){ return show },
					set: function(i){
						i	=	!!i;
						if(i !== show){
							show	=	i;
							el.classList[ show ? "add" : "remove" ](showClass);
							(show ? onShow(THIS) : onHide(THIS));
						}
					}
				}
			});


			/** Automatically add kick handlers if told to. */
			if(lazy){
				setKick({click: ".close, .cancel, .close-btn"});
				setKick({submit: "form"}, true);
			}



			/**
			 * Dismisses a Nag whilst setting a cookie not to show it again.
			 *
			 * Typically called from a close button, but may also be called from a form's submission handler.
			 *
			 * @param {Boolean} soft - If set, will prevent the Nag from showing again, but won't hide it immediately.
			 * @return {Nag}
			 */
			THIS.kick	=	function(soft){
				cookie(cookieName, 1, cookieParams);
				THIS.show	=	soft;
				silenced	=	TRUE;
				return THIS;
			};


			/**
			 * Resets the Nag's cookie, ready to irritate the user once more.
			 *
			 * @param {Boolean} show - If TRUE, will display the Nag to the user as well.
			 * @return {Nag}
			 */
			THIS.reset	=	function(show){
				cookie(cookieName, NULL, cookieParams);
				show && init();
				return THIS;
			};


			/** Expose setKick as a public method. */
			THIS.setKick	=
			THIS.kickWhen	=	setKick;


			/** Start naggin'. */
			init();
		};

	
	/** Export */
	WIN.Nag	=	Nag;
}());
