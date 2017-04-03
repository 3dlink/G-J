// var Swiper = function (selector, params) {
//     'use strict';
//
//     /*=========================
//       A little bit dirty but required part for IE8 and old FF support
//       ===========================*/
//     if (document.body.__defineGetter__) {
//         if (HTMLElement) {
//             var element = HTMLElement.prototype;
//             if (element.__defineGetter__) {
//                 element.__defineGetter__('outerHTML', function () { return new XMLSerializer().serializeToString(this); });
//             }
//         }
//     }
//
//     if (!window.getComputedStyle) {
//         window.getComputedStyle = function (el, pseudo) {
//             this.el = el;
//             this.getPropertyValue = function (prop) {
//                 var re = /(\-([a-z]){1})/g;
//                 if (prop === 'float') prop = 'styleFloat';
//                 if (re.test(prop)) {
//                     prop = prop.replace(re, function () {
//                         return arguments[2].toUpperCase();
//                     });
//                 }
//                 return el.currentStyle[prop] ? el.currentStyle[prop] : null;
//             };
//             return this;
//         };
//     }
//     if (!Array.prototype.indexOf) {
//         Array.prototype.indexOf = function (obj, start) {
//             for (var i = (start || 0), j = this.length; i < j; i++) {
//                 if (this[i] === obj) { return i; }
//             }
//             return -1;
//         };
//     }
//     if (!document.querySelectorAll) {
//         if (!window.jQuery) return;
//     }
//     function $$(selector, context) {
//         if (document.querySelectorAll)
//             return (context || document).querySelectorAll(selector);
//         else
//             return jQuery(selector, context);
//     }
//
//     /*=========================
//       Check for correct selector
//       ===========================*/
//     if (typeof selector === 'undefined') return;
//
//     if (!(selector.nodeType)) {
//         if ($$(selector).length === 0) return;
//     }
//
//      /*=========================
//       _this
//       ===========================*/
//     var _this = this;
//
//      /*=========================
//       Default Flags and vars
//       ===========================*/
//     _this.touches = {
//         start: 0,
//         startX: 0,
//         startY: 0,
//         current: 0,
//         currentX: 0,
//         currentY: 0,
//         diff: 0,
//         abs: 0
//     };
//     _this.positions = {
//         start: 0,
//         abs: 0,
//         diff: 0,
//         current: 0
//     };
//     _this.times = {
//         start: 0,
//         end: 0
//     };
//
//     _this.id = (new Date()).getTime();
//     _this.container = (selector.nodeType) ? selector : $$(selector)[0];
//     _this.isTouched = false;
//     _this.isMoved = false;
//     _this.activeIndex = 0;
//     _this.centerIndex = 0;
//     _this.activeLoaderIndex = 0;
//     _this.activeLoopIndex = 0;
//     _this.previousIndex = null;
//     _this.velocity = 0;
//     _this.snapGrid = [];
//     _this.slidesGrid = [];
//     _this.imagesToLoad = [];
//     _this.imagesLoaded = 0;
//     _this.wrapperLeft = 0;
//     _this.wrapperRight = 0;
//     _this.wrapperTop = 0;
//     _this.wrapperBottom = 0;
//     _this.isAndroid = navigator.userAgent.toLowerCase().indexOf('android') >= 0;
//     var wrapper, slideSize, wrapperSize, direction, isScrolling, containerSize;
//
//     /*=========================
//       Default Parameters
//       ===========================*/
//     var defaults = {
//         eventTarget: 'wrapper', // or 'container'
//         mode : 'horizontal', // or 'vertical'
//         touchRatio : 1,
//         speed : 300,
//         freeMode : false,
//         freeModeFluid : false,
//         momentumRatio: 1,
//         momentumBounce: true,
//         momentumBounceRatio: 1,
//         slidesPerView : 1,
//         slidesPerGroup : 1,
//         slidesPerViewFit: true, //Fit to slide when spv "auto" and slides larger than container
//         simulateTouch : true,
//         followFinger : true,
//         shortSwipes : true,
//         longSwipesRatio: 0.5,
//         moveStartThreshold: false,
//         onlyExternal : false,
//         createPagination : true,
//         pagination : false,
//         paginationElement: 'span',
//         paginationClickable: false,
//         paginationAsRange: true,
//         resistance : true, // or false or 100%
//         scrollContainer : false,
//         preventLinks : true,
//         preventLinksPropagation: false,
//         noSwiping : false, // or class
//         noSwipingClass : 'swiper-no-swiping', //:)
//         initialSlide: 0,
//         keyboardControl: false,
//         mousewheelControl : false,
//         mousewheelControlForceToAxis : false,
//         useCSS3Transforms : true,
//         // Autoplay
//         autoplay: false,
//         autoplayDisableOnInteraction: true,
//         autoplayStopOnLast: false,
//         //Loop mode
//         loop: false,
//         loopAdditionalSlides: 0,
//         // Round length values
//         roundLengths: false,
//         //Auto Height
//         calculateHeight: false,
//         cssWidthAndHeight: false,
//         //Images Preloader
//         updateOnImagesReady : true,
//         //Form elements
//         releaseFormElements : true,
//         //Watch for active slide, useful when use effects on different slide states
//         watchActiveIndex: false,
//         //Slides Visibility Fit
//         visibilityFullFit : false,
//         //Slides Offset
//         offsetPxBefore : 0,
//         offsetPxAfter : 0,
//         offsetSlidesBefore : 0,
//         offsetSlidesAfter : 0,
//         centeredSlides: false,
//         //Queue callbacks
//         queueStartCallbacks : false,
//         queueEndCallbacks : false,
//         //Auto Resize
//         autoResize : true,
//         resizeReInit : false,
//         //DOMAnimation
//         DOMAnimation : true,
//         //Slides Loader
//         loader: {
//             slides: [], //array with slides
//             slidesHTMLType: 'inner', // or 'outer'
//             surroundGroups: 1, //keep preloaded slides groups around view
//             logic: 'reload', //or 'change'
//             loadAllSlides: false
//         },
//         //Namespace
//         slideElement: 'div',
//         slideClass: 'swiper-slide',
//         slideActiveClass: 'swiper-slide-active',
//         slideVisibleClass: 'swiper-slide-visible',
//         slideDuplicateClass: 'swiper-slide-duplicate',
//         wrapperClass: 'swiper-wrapper',
//         paginationElementClass: 'swiper-pagination-switch',
//         paginationActiveClass: 'swiper-active-switch',
//         paginationVisibleClass: 'swiper-visible-switch'
//     };
//     params = params || {};
//     for (var prop in defaults) {
//         if (prop in params && typeof params[prop] === 'object') {
//             for (var subProp in defaults[prop]) {
//                 if (! (subProp in params[prop])) {
//                     params[prop][subProp] = defaults[prop][subProp];
//                 }
//             }
//         }
//         else if (! (prop in params)) {
//             params[prop] = defaults[prop];
//         }
//     }
//     _this.params = params;
//     if (params.scrollContainer) {
//         params.freeMode = true;
//         params.freeModeFluid = true;
//     }
//     if (params.loop) {
//         params.resistance = '100%';
//     }
//     var isH = params.mode === 'horizontal';
//
//     /*=========================
//       Define Touch Events
//       ===========================*/
//     var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
//     if (_this.browser.ie10) desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
//     if (_this.browser.ie11) desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
//
//     _this.touchEvents = {
//         touchStart : _this.support.touch || !params.simulateTouch  ? 'touchstart' : desktopEvents[0],
//         touchMove : _this.support.touch || !params.simulateTouch ? 'touchmove' : desktopEvents[1],
//         touchEnd : _this.support.touch || !params.simulateTouch ? 'touchend' : desktopEvents[2]
//     };
//
//     /*=========================
//       Wrapper
//       ===========================*/
//     for (var i = _this.container.childNodes.length - 1; i >= 0; i--) {
//         if (_this.container.childNodes[i].className) {
//             var _wrapperClasses = _this.container.childNodes[i].className.split(/\s+/);
//             for (var j = 0; j < _wrapperClasses.length; j++) {
//                 if (_wrapperClasses[j] === params.wrapperClass) {
//                     wrapper = _this.container.childNodes[i];
//                 }
//             }
//         }
//     }
//
//     _this.wrapper = wrapper;
//     /*=========================
//       Slide API
//       ===========================*/
//     _this._extendSwiperSlide = function  (el) {
//         el.append = function () {
//             if (params.loop) {
//                 el.insertAfter(_this.slides.length - _this.loopedSlides);
//             }
//             else {
//                 _this.wrapper.appendChild(el);
//                 _this.reInit();
//             }
//
//             return el;
//         };
//         el.prepend = function () {
//             if (params.loop) {
//                 _this.wrapper.insertBefore(el, _this.slides[_this.loopedSlides]);
//                 _this.removeLoopedSlides();
//                 _this.calcSlides();
//                 _this.createLoop();
//             }
//             else {
//                 _this.wrapper.insertBefore(el, _this.wrapper.firstChild);
//             }
//             _this.reInit();
//             return el;
//         };
//         el.insertAfter = function (index) {
//             if (typeof index === 'undefined') return false;
//             var beforeSlide;
//
//             if (params.loop) {
//                 beforeSlide = _this.slides[index + 1 + _this.loopedSlides];
//                 if (beforeSlide) {
//                     _this.wrapper.insertBefore(el, beforeSlide);
//                 }
//                 else {
//                     _this.wrapper.appendChild(el);
//                 }
//                 _this.removeLoopedSlides();
//                 _this.calcSlides();
//                 _this.createLoop();
//             }
//             else {
//                 beforeSlide = _this.slides[index + 1];
//                 _this.wrapper.insertBefore(el, beforeSlide);
//             }
//             _this.reInit();
//             return el;
//         };
//         el.clone = function () {
//             return _this._extendSwiperSlide(el.cloneNode(true));
//         };
//         el.remove = function () {
//             _this.wrapper.removeChild(el);
//             _this.reInit();
//         };
//         el.html = function (html) {
//             if (typeof html === 'undefined') {
//                 return el.innerHTML;
//             }
//             else {
//                 el.innerHTML = html;
//                 return el;
//             }
//         };
//         el.index = function () {
//             var index;
//             for (var i = _this.slides.length - 1; i >= 0; i--) {
//                 if (el === _this.slides[i]) index = i;
//             }
//             return index;
//         };
//         el.isActive = function () {
//             if (el.index() === _this.activeIndex) return true;
//             else return false;
//         };
//         if (!el.swiperSlideDataStorage) el.swiperSlideDataStorage = {};
//         el.getData = function (name) {
//             return el.swiperSlideDataStorage[name];
//         };
//         el.setData = function (name, value) {
//             el.swiperSlideDataStorage[name] = value;
//             return el;
//         };
//         el.data = function (name, value) {
//             if (typeof value === 'undefined') {
//                 return el.getAttribute('data-' + name);
//             }
//             else {
//                 el.setAttribute('data-' + name, value);
//                 return el;
//             }
//         };
//         el.getWidth = function (outer, round) {
//             return _this.h.getWidth(el, outer, round);
//         };
//         el.getHeight = function (outer, round) {
//             return _this.h.getHeight(el, outer, round);
//         };
//         el.getOffset = function () {
//             return _this.h.getOffset(el);
//         };
//         return el;
//     };
//
//     //Calculate information about number of slides
//     _this.calcSlides = function (forceCalcSlides) {
//         var oldNumber = _this.slides ? _this.slides.length : false;
//         _this.slides = [];
//         _this.displaySlides = [];
//         for (var i = 0; i < _this.wrapper.childNodes.length; i++) {
//             if (_this.wrapper.childNodes[i].className) {
//                 var _className = _this.wrapper.childNodes[i].className;
//                 var _slideClasses = _className.split(/\s+/);
//                 for (var j = 0; j < _slideClasses.length; j++) {
//                     if (_slideClasses[j] === params.slideClass) {
//                         _this.slides.push(_this.wrapper.childNodes[i]);
//                     }
//                 }
//             }
//         }
//         for (i = _this.slides.length - 1; i >= 0; i--) {
//             _this._extendSwiperSlide(_this.slides[i]);
//         }
//         if (oldNumber === false) return;
//         if (oldNumber !== _this.slides.length || forceCalcSlides) {
//
//             // Number of slides has been changed
//             removeSlideEvents();
//             addSlideEvents();
//             _this.updateActiveSlide();
//             if (_this.params.pagination) _this.createPagination();
//             _this.callPlugins('numberOfSlidesChanged');
//         }
//     };
//
//     //Create Slide
//     _this.createSlide = function (html, slideClassList, el) {
//         slideClassList = slideClassList || _this.params.slideClass;
//         el = el || params.slideElement;
//         var newSlide = document.createElement(el);
//         newSlide.innerHTML = html || '';
//         newSlide.className = slideClassList;
//         return _this._extendSwiperSlide(newSlide);
//     };
//
//     //Append Slide
//     _this.appendSlide = function (html, slideClassList, el) {
//         if (!html) return;
//         if (html.nodeType) {
//             return _this._extendSwiperSlide(html).append();
//         }
//         else {
//             return _this.createSlide(html, slideClassList, el).append();
//         }
//     };
//     _this.prependSlide = function (html, slideClassList, el) {
//         if (!html) return;
//         if (html.nodeType) {
//             return _this._extendSwiperSlide(html).prepend();
//         }
//         else {
//             return _this.createSlide(html, slideClassList, el).prepend();
//         }
//     };
//     _this.insertSlideAfter = function (index, html, slideClassList, el) {
//         if (typeof index === 'undefined') return false;
//         if (html.nodeType) {
//             return _this._extendSwiperSlide(html).insertAfter(index);
//         }
//         else {
//             return _this.createSlide(html, slideClassList, el).insertAfter(index);
//         }
//     };
//     _this.removeSlide = function (index) {
//         if (_this.slides[index]) {
//             if (params.loop) {
//                 if (!_this.slides[index + _this.loopedSlides]) return false;
//                 _this.slides[index + _this.loopedSlides].remove();
//                 _this.removeLoopedSlides();
//                 _this.calcSlides();
//                 _this.createLoop();
//             }
//             else _this.slides[index].remove();
//             return true;
//         }
//         else return false;
//     };
//     _this.removeLastSlide = function () {
//         if (_this.slides.length > 0) {
//             if (params.loop) {
//                 _this.slides[_this.slides.length - 1 - _this.loopedSlides].remove();
//                 _this.removeLoopedSlides();
//                 _this.calcSlides();
//                 _this.createLoop();
//             }
//             else _this.slides[_this.slides.length - 1].remove();
//             return true;
//         }
//         else {
//             return false;
//         }
//     };
//     _this.removeAllSlides = function () {
//         for (var i = _this.slides.length - 1; i >= 0; i--) {
//             _this.slides[i].remove();
//         }
//     };
//     _this.getSlide = function (index) {
//         return _this.slides[index];
//     };
//     _this.getLastSlide = function () {
//         return _this.slides[_this.slides.length - 1];
//     };
//     _this.getFirstSlide = function () {
//         return _this.slides[0];
//     };
//
//     //Currently Active Slide
//     _this.activeSlide = function () {
//         return _this.slides[_this.activeIndex];
//     };
//
//     /*=========================
//      Wrapper for Callbacks : Allows additive callbacks via function arrays
//      ===========================*/
//     _this.fireCallback = function () {
//         var callback = arguments[0];
//         if (Object.prototype.toString.call(callback) === '[object Array]') {
//             for (var i = 0; i < callback.length; i++) {
//                 if (typeof callback[i] === 'function') {
//                     callback[i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
//                 }
//             }
//         } else if (Object.prototype.toString.call(callback) === '[object String]') {
//             if (params['on' + callback]) _this.fireCallback(params['on' + callback], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
//         } else {
//             callback(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
//         }
//     };
//     function isArray(obj) {
//         if (Object.prototype.toString.apply(obj) === '[object Array]') return true;
//         return false;
//     }
//
//     /**
//      * Allows user to add callbacks, rather than replace them
//      * @param callback
//      * @param func
//      * @return {*}
//      */
//     _this.addCallback = function (callback, func) {
//         var _this = this, tempFunc;
//         if (_this.params['on' + callback]) {
//             if (isArray(this.params['on' + callback])) {
//                 return this.params['on' + callback].push(func);
//             } else if (typeof this.params['on' + callback] === 'function') {
//                 tempFunc = this.params['on' + callback];
//                 this.params['on' + callback] = [];
//                 this.params['on' + callback].push(tempFunc);
//                 return this.params['on' + callback].push(func);
//             }
//         } else {
//             this.params['on' + callback] = [];
//             return this.params['on' + callback].push(func);
//         }
//     };
//     _this.removeCallbacks = function (callback) {
//         if (_this.params['on' + callback]) {
//             _this.params['on' + callback] = null;
//         }
//     };
//
//     /*=========================
//       Plugins API
//       ===========================*/
//     var _plugins = [];
//     for (var plugin in _this.plugins) {
//         if (params[plugin]) {
//             var p = _this.plugins[plugin](_this, params[plugin]);
//             if (p) _plugins.push(p);
//         }
//     }
//     _this.callPlugins = function (method, args) {
//         if (!args) args = {};
//         for (var i = 0; i < _plugins.length; i++) {
//             if (method in _plugins[i]) {
//                 _plugins[i][method](args);
//             }
//         }
//     };
//
//     /*=========================
//       Windows Phone 8 Fix
//       ===========================*/
//     if ((_this.browser.ie10 || _this.browser.ie11) && !params.onlyExternal) {
//         _this.wrapper.classList.add('swiper-wp8-' + (isH ? 'horizontal' : 'vertical'));
//     }
//
//     /*=========================
//       Free Mode Class
//       ===========================*/
//     if (params.freeMode) {
//         _this.container.className += ' swiper-free-mode';
//     }
//
//     /*==================================================
//         Init/Re-init/Resize Fix
//     ====================================================*/
//     _this.initialized = false;
//     _this.init = function (force, forceCalcSlides) {
//         var _width = _this.h.getWidth(_this.container, false, params.roundLengths);
//         var _height = _this.h.getHeight(_this.container, false, params.roundLengths);
//         if (_width === _this.width && _height === _this.height && !force) return;
//
//         _this.width = _width;
//         _this.height = _height;
//
//         var slideWidth, slideHeight, slideMaxHeight, wrapperWidth, wrapperHeight, slideLeft;
//         var i; // loop index variable to avoid JSHint W004 / W038
//         containerSize = isH ? _width : _height;
//         var wrapper = _this.wrapper;
//
//         if (force) {
//             _this.calcSlides(forceCalcSlides);
//         }
//
//         if (params.slidesPerView === 'auto') {
//             //Auto mode
//             var slidesWidth = 0;
//             var slidesHeight = 0;
//
//             //Unset Styles
//             if (params.slidesOffset > 0) {
//                 wrapper.style.paddingLeft = '';
//                 wrapper.style.paddingRight = '';
//                 wrapper.style.paddingTop = '';
//                 wrapper.style.paddingBottom = '';
//             }
//             wrapper.style.width = '';
//             wrapper.style.height = '';
//             if (params.offsetPxBefore > 0) {
//                 if (isH) _this.wrapperLeft = params.offsetPxBefore;
//                 else _this.wrapperTop = params.offsetPxBefore;
//             }
//             if (params.offsetPxAfter > 0) {
//                 if (isH) _this.wrapperRight = params.offsetPxAfter;
//                 else _this.wrapperBottom = params.offsetPxAfter;
//             }
//
//             if (params.centeredSlides) {
//                 if (isH) {
//                     _this.wrapperLeft = (containerSize - this.slides[0].getWidth(true, params.roundLengths)) / 2;
//                     _this.wrapperRight = (containerSize - _this.slides[_this.slides.length - 1].getWidth(true, params.roundLengths)) / 2;
//                 }
//                 else {
//                     _this.wrapperTop = (containerSize - _this.slides[0].getHeight(true, params.roundLengths)) / 2;
//                     _this.wrapperBottom = (containerSize - _this.slides[_this.slides.length - 1].getHeight(true, params.roundLengths)) / 2;
//                 }
//             }
//
//             if (isH) {
//                 if (_this.wrapperLeft >= 0) wrapper.style.paddingLeft = _this.wrapperLeft + 'px';
//                 if (_this.wrapperRight >= 0) wrapper.style.paddingRight = _this.wrapperRight + 'px';
//             }
//             else {
//                 if (_this.wrapperTop >= 0) wrapper.style.paddingTop = _this.wrapperTop + 'px';
//                 if (_this.wrapperBottom >= 0) wrapper.style.paddingBottom = _this.wrapperBottom + 'px';
//             }
//             slideLeft = 0;
//             var centeredSlideLeft = 0;
//             _this.snapGrid = [];
//             _this.slidesGrid = [];
//
//             slideMaxHeight = 0;
//             for (i = 0; i < _this.slides.length; i++) {
//                 slideWidth = _this.slides[i].getWidth(true, params.roundLengths);
//                 slideHeight = _this.slides[i].getHeight(true, params.roundLengths);
//                 if (params.calculateHeight) {
//                     slideMaxHeight = Math.max(slideMaxHeight, slideHeight);
//                 }
//                 var _slideSize = isH ? slideWidth : slideHeight;
//                 if (params.centeredSlides) {
//                     var nextSlideWidth = i === _this.slides.length - 1 ? 0 : _this.slides[i + 1].getWidth(true, params.roundLengths);
//                     var nextSlideHeight = i === _this.slides.length - 1 ? 0 : _this.slides[i + 1].getHeight(true, params.roundLengths);
//                     var nextSlideSize = isH ? nextSlideWidth : nextSlideHeight;
//                     if (_slideSize > containerSize) {
//                         if (params.slidesPerViewFit) {
//                             _this.snapGrid.push(slideLeft + _this.wrapperLeft);
//                             _this.snapGrid.push(slideLeft + _slideSize - containerSize + _this.wrapperLeft);
//                         }
//                         else {
//                             for (var j = 0; j <= Math.floor(_slideSize / (containerSize + _this.wrapperLeft)); j++) {
//                                 if (j === 0) _this.snapGrid.push(slideLeft + _this.wrapperLeft);
//                                 else _this.snapGrid.push(slideLeft + _this.wrapperLeft + containerSize * j);
//                             }
//                         }
//                         _this.slidesGrid.push(slideLeft + _this.wrapperLeft);
//                     }
//                     else {
//                         _this.snapGrid.push(centeredSlideLeft);
//                         _this.slidesGrid.push(centeredSlideLeft);
//                     }
//                     centeredSlideLeft += _slideSize / 2 + nextSlideSize / 2;
//                 }
//                 else {
//                     if (_slideSize > containerSize) {
//                         if (params.slidesPerViewFit) {
//                             _this.snapGrid.push(slideLeft);
//                             _this.snapGrid.push(slideLeft + _slideSize - containerSize);
//                         }
//                         else {
//                             if (containerSize !== 0) {
//                                 for (var k = 0; k <= Math.floor(_slideSize / containerSize); k++) {
//                                     _this.snapGrid.push(slideLeft + containerSize * k);
//                                 }
//                             }
//                             else {
//                                 _this.snapGrid.push(slideLeft);
//                             }
//                         }
//
//                     }
//                     else {
//                         _this.snapGrid.push(slideLeft);
//                     }
//                     _this.slidesGrid.push(slideLeft);
//                 }
//
//                 slideLeft += _slideSize;
//
//                 slidesWidth += slideWidth;
//                 slidesHeight += slideHeight;
//             }
//             if (params.calculateHeight) _this.height = slideMaxHeight;
//             if (isH) {
//                 wrapperSize = slidesWidth + _this.wrapperRight + _this.wrapperLeft;
//                 wrapper.style.width = (slidesWidth) + 'px';
//                 wrapper.style.height = (_this.height) + 'px';
//             }
//             else {
//                 wrapperSize = slidesHeight + _this.wrapperTop + _this.wrapperBottom;
//                 wrapper.style.width = (_this.width) + 'px';
//                 wrapper.style.height = (slidesHeight) + 'px';
//             }
//
//         }
//         else if (params.scrollContainer) {
//             //Scroll Container
//             wrapper.style.width = '';
//             wrapper.style.height = '';
//             wrapperWidth = _this.slides[0].getWidth(true, params.roundLengths);
//             wrapperHeight = _this.slides[0].getHeight(true, params.roundLengths);
//             wrapperSize = isH ? wrapperWidth : wrapperHeight;
//             wrapper.style.width = wrapperWidth + 'px';
//             wrapper.style.height = wrapperHeight + 'px';
//             slideSize = isH ? wrapperWidth : wrapperHeight;
//
//         }
//         else {
//             //For usual slides
//             if (params.calculateHeight) {
//                 slideMaxHeight = 0;
//                 wrapperHeight = 0;
//                 //ResetWrapperSize
//                 if (!isH) _this.container.style.height = '';
//                 wrapper.style.height = '';
//
//                 for (i = 0; i < _this.slides.length; i++) {
//                     //ResetSlideSize
//                     _this.slides[i].style.height = '';
//                     slideMaxHeight = Math.max(_this.slides[i].getHeight(true), slideMaxHeight);
//                     if (!isH) wrapperHeight += _this.slides[i].getHeight(true);
//                 }
//                 slideHeight = slideMaxHeight;
//                 _this.height = slideHeight;
//
//                 if (isH) wrapperHeight = slideHeight;
//                 else {
//                     containerSize = slideHeight;
//                     _this.container.style.height = containerSize + 'px';
//                 }
//             }
//             else {
//                 slideHeight = isH ? _this.height : _this.height / params.slidesPerView;
//                 if (params.roundLengths) slideHeight = Math.round(slideHeight);
//                 wrapperHeight = isH ? _this.height : _this.slides.length * slideHeight;
//             }
//             slideWidth = isH ? _this.width / params.slidesPerView : _this.width;
//             if (params.roundLengths) slideWidth = Math.round(slideWidth);
//             wrapperWidth = isH ? _this.slides.length * slideWidth : _this.width;
//             slideSize = isH ? slideWidth : slideHeight;
//
//             if (params.offsetSlidesBefore > 0) {
//                 if (isH) _this.wrapperLeft = slideSize * params.offsetSlidesBefore;
//                 else _this.wrapperTop = slideSize * params.offsetSlidesBefore;
//             }
//             if (params.offsetSlidesAfter > 0) {
//                 if (isH) _this.wrapperRight = slideSize * params.offsetSlidesAfter;
//                 else _this.wrapperBottom = slideSize * params.offsetSlidesAfter;
//             }
//             if (params.offsetPxBefore > 0) {
//                 if (isH) _this.wrapperLeft = params.offsetPxBefore;
//                 else _this.wrapperTop = params.offsetPxBefore;
//             }
//             if (params.offsetPxAfter > 0) {
//                 if (isH) _this.wrapperRight = params.offsetPxAfter;
//                 else _this.wrapperBottom = params.offsetPxAfter;
//             }
//             if (params.centeredSlides) {
//                 if (isH) {
//                     _this.wrapperLeft = (containerSize - slideSize) / 2;
//                     _this.wrapperRight = (containerSize - slideSize) / 2;
//                 }
//                 else {
//                     _this.wrapperTop = (containerSize - slideSize) / 2;
//                     _this.wrapperBottom = (containerSize - slideSize) / 2;
//                 }
//             }
//             if (isH) {
//                 if (_this.wrapperLeft > 0) wrapper.style.paddingLeft = _this.wrapperLeft + 'px';
//                 if (_this.wrapperRight > 0) wrapper.style.paddingRight = _this.wrapperRight + 'px';
//             }
//             else {
//                 if (_this.wrapperTop > 0) wrapper.style.paddingTop = _this.wrapperTop + 'px';
//                 if (_this.wrapperBottom > 0) wrapper.style.paddingBottom = _this.wrapperBottom + 'px';
//             }
//
//             wrapperSize = isH ? wrapperWidth + _this.wrapperRight + _this.wrapperLeft : wrapperHeight + _this.wrapperTop + _this.wrapperBottom;
//             if (!params.cssWidthAndHeight) {
//                 if (parseFloat(wrapperWidth) > 0) {
//                     wrapper.style.width = wrapperWidth + 'px';
//                 }
//                 if (parseFloat(wrapperHeight) > 0) {
//                     wrapper.style.height = wrapperHeight + 'px';
//                 }
//             }
//             slideLeft = 0;
//             _this.snapGrid = [];
//             _this.slidesGrid = [];
//             for (i = 0; i < _this.slides.length; i++) {
//                 _this.snapGrid.push(slideLeft);
//                 _this.slidesGrid.push(slideLeft);
//                 slideLeft += slideSize;
//                 if (!params.cssWidthAndHeight) {
//                     if (parseFloat(slideWidth) > 0) {
//                         _this.slides[i].style.width = slideWidth + 'px';
//                     }
//                     if (parseFloat(slideHeight) > 0) {
//                         _this.slides[i].style.height = slideHeight + 'px';
//                     }
//                 }
//             }
//
//         }
//
//         if (!_this.initialized) {
//             _this.callPlugins('onFirstInit');
//             if (params.onFirstInit) _this.fireCallback(params.onFirstInit, _this);
//         }
//         else {
//             _this.callPlugins('onInit');
//             if (params.onInit) _this.fireCallback(params.onInit, _this);
//         }
//         _this.initialized = true;
//     };
//
//     _this.reInit = function (forceCalcSlides) {
//         _this.init(true, forceCalcSlides);
//     };
//
//     _this.resizeFix = function (reInit) {
//         _this.callPlugins('beforeResizeFix');
//
//         _this.init(params.resizeReInit || reInit);
//
//         // swipe to active slide in fixed mode
//         if (!params.freeMode) {
//             _this.swipeTo((params.loop ? _this.activeLoopIndex : _this.activeIndex), 0, false);
//             // Fix autoplay
//             if (params.autoplay) {
//                 if (_this.support.transitions && typeof autoplayTimeoutId !== 'undefined') {
//                     if (typeof autoplayTimeoutId !== 'undefined') {
//                         clearTimeout(autoplayTimeoutId);
//                         autoplayTimeoutId = undefined;
//                         _this.startAutoplay();
//                     }
//                 }
//                 else {
//                     if (typeof autoplayIntervalId !== 'undefined') {
//                         clearInterval(autoplayIntervalId);
//                         autoplayIntervalId = undefined;
//                         _this.startAutoplay();
//                     }
//                 }
//             }
//         }
//         // move wrapper to the beginning in free mode
//         else if (_this.getWrapperTranslate() < -maxWrapperPosition()) {
//             _this.setWrapperTransition(0);
//             _this.setWrapperTranslate(-maxWrapperPosition());
//         }
//
//         _this.callPlugins('afterResizeFix');
//     };
//
//     /*==========================================
//         Max and Min Positions
//     ============================================*/
//     function maxWrapperPosition() {
//         var a = (wrapperSize - containerSize);
//         if (params.freeMode) {
//             a = wrapperSize - containerSize;
//         }
//         // if (params.loop) a -= containerSize;
//         if (params.slidesPerView > _this.slides.length && !params.centeredSlides) {
//             a = 0;
//         }
//         if (a < 0) a = 0;
//         return a;
//     }
//
//     /*==========================================
//         Event Listeners
//     ============================================*/
//     function initEvents() {
//         var bind = _this.h.addEventListener;
//         var eventTarget = params.eventTarget === 'wrapper' ? _this.wrapper : _this.container;
//         //Touch Events
//         if (! (_this.browser.ie10 || _this.browser.ie11)) {
//             if (_this.support.touch) {
//                 bind(eventTarget, 'touchstart', onTouchStart);
//                 bind(eventTarget, 'touchmove', onTouchMove);
//                 bind(eventTarget, 'touchend', onTouchEnd);
//             }
//             if (params.simulateTouch) {
//                 bind(eventTarget, 'mousedown', onTouchStart);
//                 bind(document, 'mousemove', onTouchMove);
//                 bind(document, 'mouseup', onTouchEnd);
//             }
//         }
//         else {
//             bind(eventTarget, _this.touchEvents.touchStart, onTouchStart);
//             bind(document, _this.touchEvents.touchMove, onTouchMove);
//             bind(document, _this.touchEvents.touchEnd, onTouchEnd);
//         }
//
//         //Resize Event
//         if (params.autoResize) {
//             bind(window, 'resize', _this.resizeFix);
//         }
//         //Slide Events
//         addSlideEvents();
//         //Mousewheel
//         _this._wheelEvent = false;
//         if (params.mousewheelControl) {
//             if (document.onmousewheel !== undefined) {
//                 _this._wheelEvent = 'mousewheel';
//             }
//             if (!_this._wheelEvent) {
//                 try {
//                     new WheelEvent('wheel');
//                     _this._wheelEvent = 'wheel';
//                 } catch (e) {}
//             }
//             if (!_this._wheelEvent) {
//                 _this._wheelEvent = 'DOMMouseScroll';
//             }
//             if (_this._wheelEvent) {
//                 bind(_this.container, _this._wheelEvent, handleMousewheel);
//             }
//         }
//
//         //Keyboard
//         function _loadImage(src) {
//             var image = new Image();
//             image.onload = function () {
//                 if (_this && _this.imagesLoaded !== undefined) _this.imagesLoaded++;
//                 if (_this.imagesLoaded === _this.imagesToLoad.length) {
//                     _this.reInit();
//                     if (params.onImagesReady) _this.fireCallback(params.onImagesReady, _this);
//                 }
//             };
//             image.src = src;
//         }
//
//         if (params.keyboardControl) {
//             bind(document, 'keydown', handleKeyboardKeys);
//         }
//         if (params.updateOnImagesReady) {
//             _this.imagesToLoad = $$('img', _this.container);
//
//             for (var i = 0; i < _this.imagesToLoad.length; i++) {
//                 _loadImage(_this.imagesToLoad[i].getAttribute('src'));
//             }
//         }
//     }
//
//     //Remove Event Listeners
//     _this.destroy = function () {
//         var unbind = _this.h.removeEventListener;
//         var eventTarget = params.eventTarget === 'wrapper' ? _this.wrapper : _this.container;
//         //Touch Events
//         if (! (_this.browser.ie10 || _this.browser.ie11)) {
//             if (_this.support.touch) {
//                 unbind(eventTarget, 'touchstart', onTouchStart);
//                 unbind(eventTarget, 'touchmove', onTouchMove);
//                 unbind(eventTarget, 'touchend', onTouchEnd);
//             }
//             if (params.simulateTouch) {
//                 unbind(eventTarget, 'mousedown', onTouchStart);
//                 unbind(document, 'mousemove', onTouchMove);
//                 unbind(document, 'mouseup', onTouchEnd);
//             }
//         }
//         else {
//             unbind(eventTarget, _this.touchEvents.touchStart, onTouchStart);
//             unbind(document, _this.touchEvents.touchMove, onTouchMove);
//             unbind(document, _this.touchEvents.touchEnd, onTouchEnd);
//         }
//
//         //Resize Event
//         if (params.autoResize) {
//             unbind(window, 'resize', _this.resizeFix);
//         }
//
//         //Init Slide Events
//         removeSlideEvents();
//
//         //Pagination
//         if (params.paginationClickable) {
//             removePaginationEvents();
//         }
//
//         //Mousewheel
//         if (params.mousewheelControl && _this._wheelEvent) {
//             unbind(_this.container, _this._wheelEvent, handleMousewheel);
//         }
//
//         //Keyboard
//         if (params.keyboardControl) {
//             unbind(document, 'keydown', handleKeyboardKeys);
//         }
//
//         //Stop autoplay
//         if (params.autoplay) {
//             _this.stopAutoplay();
//         }
//         _this.callPlugins('onDestroy');
//
//         //Destroy variable
//         _this = null;
//     };
//
//     function addSlideEvents() {
//         var bind = _this.h.addEventListener,
//             i;
//
//         //Prevent Links Events
//         if (params.preventLinks) {
//             var links = $$('a', _this.container);
//             for (i = 0; i < links.length; i++) {
//                 bind(links[i], 'click', preventClick);
//             }
//         }
//         //Release Form Elements
//         if (params.releaseFormElements) {
//             var formElements = $$('input, textarea, select', _this.container);
//             for (i = 0; i < formElements.length; i++) {
//                 bind(formElements[i], _this.touchEvents.touchStart, releaseForms, true);
//             }
//         }
//
//         //Slide Clicks & Touches
//         if (params.onSlideClick) {
//             for (i = 0; i < _this.slides.length; i++) {
//                 bind(_this.slides[i], 'click', slideClick);
//             }
//         }
//         if (params.onSlideTouch) {
//             for (i = 0; i < _this.slides.length; i++) {
//                 bind(_this.slides[i], _this.touchEvents.touchStart, slideTouch);
//             }
//         }
//     }
//     function removeSlideEvents() {
//         var unbind = _this.h.removeEventListener,
//             i;
//
//         //Slide Clicks & Touches
//         if (params.onSlideClick) {
//             for (i = 0; i < _this.slides.length; i++) {
//                 unbind(_this.slides[i], 'click', slideClick);
//             }
//         }
//         if (params.onSlideTouch) {
//             for (i = 0; i < _this.slides.length; i++) {
//                 unbind(_this.slides[i], _this.touchEvents.touchStart, slideTouch);
//             }
//         }
//         //Release Form Elements
//         if (params.releaseFormElements) {
//             var formElements = $$('input, textarea, select', _this.container);
//             for (i = 0; i < formElements.length; i++) {
//                 unbind(formElements[i], _this.touchEvents.touchStart, releaseForms, true);
//             }
//         }
//         //Prevent Links Events
//         if (params.preventLinks) {
//             var links = $$('a', _this.container);
//             for (i = 0; i < links.length; i++) {
//                 unbind(links[i], 'click', preventClick);
//             }
//         }
//     }
//     /*==========================================
//         Keyboard Control
//     ============================================*/
//     function handleKeyboardKeys(e) {
//         var kc = e.keyCode || e.charCode;
//         if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
//         if (kc === 37 || kc === 39 || kc === 38 || kc === 40) {
//             var inView = false;
//             //Check that swiper should be inside of visible area of window
//             var swiperOffset = _this.h.getOffset(_this.container);
//             var scrollLeft = _this.h.windowScroll().left;
//             var scrollTop = _this.h.windowScroll().top;
//             var windowWidth = _this.h.windowWidth();
//             var windowHeight = _this.h.windowHeight();
//             var swiperCoord = [
//                 [swiperOffset.left, swiperOffset.top],
//                 [swiperOffset.left + _this.width, swiperOffset.top],
//                 [swiperOffset.left, swiperOffset.top + _this.height],
//                 [swiperOffset.left + _this.width, swiperOffset.top + _this.height]
//             ];
//             for (var i = 0; i < swiperCoord.length; i++) {
//                 var point = swiperCoord[i];
//                 if (
//                     point[0] >= scrollLeft && point[0] <= scrollLeft + windowWidth &&
//                     point[1] >= scrollTop && point[1] <= scrollTop + windowHeight
//                 ) {
//                     inView = true;
//                 }
//
//             }
//             if (!inView) return;
//         }
//         if (isH) {
//             if (kc === 37 || kc === 39) {
//                 if (e.preventDefault) e.preventDefault();
//                 else e.returnValue = false;
//             }
//             if (kc === 39) _this.swipeNext();
//             if (kc === 37) _this.swipePrev();
//         }
//         else {
//             if (kc === 38 || kc === 40) {
//                 if (e.preventDefault) e.preventDefault();
//                 else e.returnValue = false;
//             }
//             if (kc === 40) _this.swipeNext();
//             if (kc === 38) _this.swipePrev();
//         }
//     }
//
//     _this.disableKeyboardControl = function () {
//         params.keyboardControl = false;
//         _this.h.removeEventListener(document, 'keydown', handleKeyboardKeys);
//     };
//
//     _this.enableKeyboardControl = function () {
//         params.keyboardControl = true;
//         _this.h.addEventListener(document, 'keydown', handleKeyboardKeys);
//     };
//
//     /*==========================================
//         Mousewheel Control
//     ============================================*/
//     var lastScrollTime = (new Date()).getTime();
//     function handleMousewheel(e) {
//         var we = _this._wheelEvent;
//         var delta = 0;
//
//         //Opera & IE
//         if (e.detail) delta = -e.detail;
//         //WebKits
//         else if (we === 'mousewheel') {
//             if (params.mousewheelControlForceToAxis) {
//                 if (isH) {
//                     if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) delta = e.wheelDeltaX;
//                     else return;
//                 }
//                 else {
//                     if (Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)) delta = e.wheelDeltaY;
//                     else return;
//                 }
//             }
//             else {
//                 delta = e.wheelDelta;
//             }
//         }
//         //Old FireFox
//         else if (we === 'DOMMouseScroll') delta = -e.detail;
//         //New FireFox
//         else if (we === 'wheel') {
//             if (params.mousewheelControlForceToAxis) {
//                 if (isH) {
//                     if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) delta = -e.deltaX;
//                     else return;
//                 }
//                 else {
//                     if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) delta = -e.deltaY;
//                     else return;
//                 }
//             }
//             else {
//                 delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? - e.deltaX : - e.deltaY;
//             }
//         }
//
//         if (!params.freeMode) {
//             if ((new Date()).getTime() - lastScrollTime > 60) {
//                 if (delta < 0) _this.swipeNext();
//                 else _this.swipePrev();
//             }
//             lastScrollTime = (new Date()).getTime();
//
//         }
//         else {
//             //Freemode or scrollContainer:
//             var position = _this.getWrapperTranslate() + delta;
//
//             if (position > 0) position = 0;
//             if (position < -maxWrapperPosition()) position = -maxWrapperPosition();
//
//             _this.setWrapperTransition(0);
//             _this.setWrapperTranslate(position);
//             _this.updateActiveSlide(position);
//
//             // Return page scroll on edge positions
//             if (position === 0 || position === -maxWrapperPosition()) return;
//         }
//         if (params.autoplay) _this.stopAutoplay(true);
//
//         if (e.preventDefault) e.preventDefault();
//         else e.returnValue = false;
//         return false;
//     }
//     _this.disableMousewheelControl = function () {
//         if (!_this._wheelEvent) return false;
//         params.mousewheelControl = false;
//         _this.h.removeEventListener(_this.container, _this._wheelEvent, handleMousewheel);
//         return true;
//     };
//
//     _this.enableMousewheelControl = function () {
//         if (!_this._wheelEvent) return false;
//         params.mousewheelControl = true;
//         _this.h.addEventListener(_this.container, _this._wheelEvent, handleMousewheel);
//         return true;
//     };
//
//     /*=========================
//       Grab Cursor
//       ===========================*/
//     if (params.grabCursor) {
//         var containerStyle = _this.container.style;
//         containerStyle.cursor = 'move';
//         containerStyle.cursor = 'grab';
//         containerStyle.cursor = '-moz-grab';
//         containerStyle.cursor = '-webkit-grab';
//     }
//
//     /*=========================
//       Slides Events Handlers
//       ===========================*/
//
//     _this.allowSlideClick = true;
//     function slideClick(event) {
//         if (_this.allowSlideClick) {
//             setClickedSlide(event);
//             _this.fireCallback(params.onSlideClick, _this, event);
//         }
//     }
//
//     function slideTouch(event) {
//         setClickedSlide(event);
//         _this.fireCallback(params.onSlideTouch, _this, event);
//     }
//
//     function setClickedSlide(event) {
//
//         // IE 6-8 support
//         if (!event.currentTarget) {
//             var element = event.srcElement;
//             do {
//                 if (element.className.indexOf(params.slideClass) > -1) {
//                     break;
//                 }
//                 element = element.parentNode;
//             } while (element);
//             _this.clickedSlide = element;
//         }
//         else {
//             _this.clickedSlide = event.currentTarget;
//         }
//
//         _this.clickedSlideIndex     = _this.slides.indexOf(_this.clickedSlide);
//         _this.clickedSlideLoopIndex = _this.clickedSlideIndex - (_this.loopedSlides || 0);
//     }
//
//     _this.allowLinks = true;
//     function preventClick(e) {
//         if (!_this.allowLinks) {
//             if (e.preventDefault) e.preventDefault();
//             else e.returnValue = false;
//             if (params.preventLinksPropagation && 'stopPropagation' in e) {
//                 e.stopPropagation();
//             }
//             return false;
//         }
//     }
//     function releaseForms(e) {
//         if (e.stopPropagation) e.stopPropagation();
//         else e.returnValue = false;
//         return false;
//
//     }
//
//     /*==================================================
//         Event Handlers
//     ====================================================*/
//     var isTouchEvent = false;
//     var allowThresholdMove;
//     var allowMomentumBounce = true;
//     function onTouchStart(event) {
//         if (params.preventLinks) _this.allowLinks = true;
//         //Exit if slider is already was touched
//         if (_this.isTouched || params.onlyExternal) {
//             return false;
//         }
//
//         if (params.noSwiping && (event.target || event.srcElement) && noSwipingSlide(event.target || event.srcElement)) return false;
//         allowMomentumBounce = false;
//         //Check For Nested Swipers
//         _this.isTouched = true;
//         isTouchEvent = event.type === 'touchstart';
//
//         if (!isTouchEvent || event.targetTouches.length === 1) {
//             _this.callPlugins('onTouchStartBegin');
//
//             if (!isTouchEvent && !_this.isAndroid) {
//                 if (event.preventDefault) event.preventDefault();
//                 else event.returnValue = false;
//             }
//
//             var pageX = isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX);
//             var pageY = isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY);
//
//             //Start Touches to check the scrolling
//             _this.touches.startX = _this.touches.currentX = pageX;
//             _this.touches.startY = _this.touches.currentY = pageY;
//
//             _this.touches.start = _this.touches.current = isH ? pageX : pageY;
//
//             //Set Transition Time to 0
//             _this.setWrapperTransition(0);
//
//             //Get Start Translate Position
//             _this.positions.start = _this.positions.current = _this.getWrapperTranslate();
//
//             //Set Transform
//             _this.setWrapperTranslate(_this.positions.start);
//
//             //TouchStartTime
//             _this.times.start = (new Date()).getTime();
//
//             //Unset Scrolling
//             isScrolling = undefined;
//
//             //Set Treshold
//             if (params.moveStartThreshold > 0) {
//                 allowThresholdMove = false;
//             }
//
//             //CallBack
//             if (params.onTouchStart) _this.fireCallback(params.onTouchStart, _this, event);
//             _this.callPlugins('onTouchStartEnd');
//
//         }
//     }
//     var velocityPrevPosition, velocityPrevTime;
//     function onTouchMove(event) {
//         // If slider is not touched - exit
//         if (!_this.isTouched || params.onlyExternal) return;
//         if (isTouchEvent && event.type === 'mousemove') return;
//
//         var pageX = isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX);
//         var pageY = isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY);
//
//         //check for scrolling
//         if (typeof isScrolling === 'undefined' && isH) {
//             isScrolling = !!(isScrolling || Math.abs(pageY - _this.touches.startY) > Math.abs(pageX - _this.touches.startX));
//         }
//         if (typeof isScrolling === 'undefined' && !isH) {
//             isScrolling = !!(isScrolling || Math.abs(pageY - _this.touches.startY) < Math.abs(pageX - _this.touches.startX));
//         }
//         if (isScrolling) {
//             _this.isTouched = false;
//             return;
//         }
//
//         //Check For Nested Swipers
//         if (event.assignedToSwiper) {
//             _this.isTouched = false;
//             return;
//         }
//         event.assignedToSwiper = true;
//
//         //Block inner links
//         if (params.preventLinks) {
//             _this.allowLinks = false;
//         }
//         if (params.onSlideClick) {
//             _this.allowSlideClick = false;
//         }
//
//         //Stop AutoPlay if exist
//         if (params.autoplay) {
//             _this.stopAutoplay(true);
//         }
//         if (!isTouchEvent || event.touches.length === 1) {
//
//             //Moved Flag
//             if (!_this.isMoved) {
//                 _this.callPlugins('onTouchMoveStart');
//
//                 if (params.loop) {
//                     _this.fixLoop();
//                     _this.positions.start = _this.getWrapperTranslate();
//                 }
//                 if (params.onTouchMoveStart) _this.fireCallback(params.onTouchMoveStart, _this);
//             }
//             _this.isMoved = true;
//
//             // cancel event
//             if (event.preventDefault) event.preventDefault();
//             else event.returnValue = false;
//
//             _this.touches.current = isH ? pageX : pageY;
//
//             _this.positions.current = (_this.touches.current - _this.touches.start) * params.touchRatio + _this.positions.start;
//
//             //Resistance Callbacks
//             if (_this.positions.current > 0 && params.onResistanceBefore) {
//                 _this.fireCallback(params.onResistanceBefore, _this, _this.positions.current);
//             }
//             if (_this.positions.current < -maxWrapperPosition() && params.onResistanceAfter) {
//                 _this.fireCallback(params.onResistanceAfter, _this, Math.abs(_this.positions.current + maxWrapperPosition()));
//             }
//             //Resistance
//             if (params.resistance && params.resistance !== '100%') {
//                 var resistance;
//                 //Resistance for Negative-Back sliding
//                 if (_this.positions.current > 0) {
//                     resistance = 1 - _this.positions.current / containerSize / 2;
//                     if (resistance < 0.5)
//                         _this.positions.current = (containerSize / 2);
//                     else
//                         _this.positions.current = _this.positions.current * resistance;
//                 }
//                 //Resistance for After-End Sliding
//                 if (_this.positions.current < -maxWrapperPosition()) {
//
//                     var diff = (_this.touches.current - _this.touches.start) * params.touchRatio + (maxWrapperPosition() + _this.positions.start);
//                     resistance = (containerSize + diff) / (containerSize);
//                     var newPos = _this.positions.current - diff * (1 - resistance) / 2;
//                     var stopPos = -maxWrapperPosition() - containerSize / 2;
//
//                     if (newPos < stopPos || resistance <= 0)
//                         _this.positions.current = stopPos;
//                     else
//                         _this.positions.current = newPos;
//                 }
//             }
//             if (params.resistance && params.resistance === '100%') {
//                 //Resistance for Negative-Back sliding
//                 if (_this.positions.current > 0 && !(params.freeMode && !params.freeModeFluid)) {
//                     _this.positions.current = 0;
//                 }
//                 //Resistance for After-End Sliding
//                 if (_this.positions.current < -maxWrapperPosition() && !(params.freeMode && !params.freeModeFluid)) {
//                     _this.positions.current = -maxWrapperPosition();
//                 }
//             }
//             //Move Slides
//             if (!params.followFinger) return;
//
//             if (!params.moveStartThreshold) {
//                 _this.setWrapperTranslate(_this.positions.current);
//             }
//             else {
//                 if (Math.abs(_this.touches.current - _this.touches.start) > params.moveStartThreshold || allowThresholdMove) {
//                     if (!allowThresholdMove) {
//                         allowThresholdMove = true;
//                         _this.touches.start = _this.touches.current;
//                         return;
//                     }
//                     _this.setWrapperTranslate(_this.positions.current);
//                 }
//                 else {
//                     _this.positions.current = _this.positions.start;
//                 }
//             }
//
//             if (params.freeMode || params.watchActiveIndex) {
//                 _this.updateActiveSlide(_this.positions.current);
//             }
//
//             //Grab Cursor
//             if (params.grabCursor) {
//                 _this.container.style.cursor = 'move';
//                 _this.container.style.cursor = 'grabbing';
//                 _this.container.style.cursor = '-moz-grabbin';
//                 _this.container.style.cursor = '-webkit-grabbing';
//             }
//             //Velocity
//             if (!velocityPrevPosition) velocityPrevPosition = _this.touches.current;
//             if (!velocityPrevTime) velocityPrevTime = (new Date()).getTime();
//             _this.velocity = (_this.touches.current - velocityPrevPosition) / ((new Date()).getTime() - velocityPrevTime) / 2;
//             if (Math.abs(_this.touches.current - velocityPrevPosition) < 2) _this.velocity = 0;
//             velocityPrevPosition = _this.touches.current;
//             velocityPrevTime = (new Date()).getTime();
//             //Callbacks
//             _this.callPlugins('onTouchMoveEnd');
//             if (params.onTouchMove) _this.fireCallback(params.onTouchMove, _this, event);
//
//             return false;
//         }
//     }
//     function onTouchEnd(event) {
//         //Check For scrolling
//         if (isScrolling) {
//             _this.swipeReset();
//         }
//         // If slider is not touched exit
//         if (params.onlyExternal || !_this.isTouched) return;
//         _this.isTouched = false;
//
//         //Return Grab Cursor
//         if (params.grabCursor) {
//             _this.container.style.cursor = 'move';
//             _this.container.style.cursor = 'grab';
//             _this.container.style.cursor = '-moz-grab';
//             _this.container.style.cursor = '-webkit-grab';
//         }
//
//         //Check for Current Position
//         if (!_this.positions.current && _this.positions.current !== 0) {
//             _this.positions.current = _this.positions.start;
//         }
//
//         //For case if slider touched but not moved
//         if (params.followFinger) {
//             _this.setWrapperTranslate(_this.positions.current);
//         }
//
//         // TouchEndTime
//         _this.times.end = (new Date()).getTime();
//
//         //Difference
//         _this.touches.diff = _this.touches.current - _this.touches.start;
//         _this.touches.abs = Math.abs(_this.touches.diff);
//
//         _this.positions.diff = _this.positions.current - _this.positions.start;
//         _this.positions.abs = Math.abs(_this.positions.diff);
//
//         var diff = _this.positions.diff;
//         var diffAbs = _this.positions.abs;
//         var timeDiff = _this.times.end - _this.times.start;
//
//         if (diffAbs < 5 && (timeDiff) < 300 && _this.allowLinks === false) {
//             if (!params.freeMode && diffAbs !== 0) _this.swipeReset();
//             //Release inner links
//             if (params.preventLinks) {
//                 _this.allowLinks = true;
//             }
//             if (params.onSlideClick) {
//                 _this.allowSlideClick = true;
//             }
//         }
//
//         setTimeout(function () {
//             //Release inner links
//             if (params.preventLinks) {
//                 _this.allowLinks = true;
//             }
//             if (params.onSlideClick) {
//                 _this.allowSlideClick = true;
//             }
//         }, 100);
//
//         var maxPosition = maxWrapperPosition();
//
//         //Not moved or Prevent Negative Back Sliding/After-End Sliding
//         if (!_this.isMoved && params.freeMode) {
//             _this.isMoved = false;
//             if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
//             _this.callPlugins('onTouchEnd');
//             return;
//         }
//         if (!_this.isMoved || _this.positions.current > 0 || _this.positions.current < -maxPosition) {
//             _this.swipeReset();
//             if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
//             _this.callPlugins('onTouchEnd');
//             return;
//         }
//
//         _this.isMoved = false;
//
//         //Free Mode
//         if (params.freeMode) {
//             if (params.freeModeFluid) {
//                 var momentumDuration = 1000 * params.momentumRatio;
//                 var momentumDistance = _this.velocity * momentumDuration;
//                 var newPosition = _this.positions.current + momentumDistance;
//                 var doBounce = false;
//                 var afterBouncePosition;
//                 var bounceAmount = Math.abs(_this.velocity) * 20 * params.momentumBounceRatio;
//                 if (newPosition < -maxPosition) {
//                     if (params.momentumBounce && _this.support.transitions) {
//                         if (newPosition + maxPosition < -bounceAmount) newPosition = -maxPosition - bounceAmount;
//                         afterBouncePosition = -maxPosition;
//                         doBounce = true;
//                         allowMomentumBounce = true;
//                     }
//                     else newPosition = -maxPosition;
//                 }
//                 if (newPosition > 0) {
//                     if (params.momentumBounce && _this.support.transitions) {
//                         if (newPosition > bounceAmount) newPosition = bounceAmount;
//                         afterBouncePosition = 0;
//                         doBounce = true;
//                         allowMomentumBounce = true;
//                     }
//                     else newPosition = 0;
//                 }
//                 //Fix duration
//                 if (_this.velocity !== 0) momentumDuration = Math.abs((newPosition - _this.positions.current) / _this.velocity);
//
//                 _this.setWrapperTranslate(newPosition);
//
//                 _this.setWrapperTransition(momentumDuration);
//
//                 if (params.momentumBounce && doBounce) {
//                     _this.wrapperTransitionEnd(function () {
//                         if (!allowMomentumBounce) return;
//                         if (params.onMomentumBounce) _this.fireCallback(params.onMomentumBounce, _this);
//                         _this.callPlugins('onMomentumBounce');
//
//                         _this.setWrapperTranslate(afterBouncePosition);
//                         _this.setWrapperTransition(300);
//                     });
//                 }
//
//                 _this.updateActiveSlide(newPosition);
//             }
//             if (!params.freeModeFluid || timeDiff >= 300) _this.updateActiveSlide(_this.positions.current);
//
//             if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
//             _this.callPlugins('onTouchEnd');
//             return;
//         }
//
//         //Direction
//         direction = diff < 0 ? 'toNext' : 'toPrev';
//
//         //Short Touches
//         if (direction === 'toNext' && (timeDiff <= 300)) {
//             if (diffAbs < 30 || !params.shortSwipes) _this.swipeReset();
//             else _this.swipeNext(true);
//         }
//
//         if (direction === 'toPrev' && (timeDiff <= 300)) {
//             if (diffAbs < 30 || !params.shortSwipes) _this.swipeReset();
//             else _this.swipePrev(true);
//         }
//
//         //Long Touches
//         var targetSlideSize = 0;
//         if (params.slidesPerView === 'auto') {
//             //Define current slide's width
//             var currentPosition = Math.abs(_this.getWrapperTranslate());
//             var slidesOffset = 0;
//             var _slideSize;
//             for (var i = 0; i < _this.slides.length; i++) {
//                 _slideSize = isH ? _this.slides[i].getWidth(true, params.roundLengths) : _this.slides[i].getHeight(true, params.roundLengths);
//                 slidesOffset += _slideSize;
//                 if (slidesOffset > currentPosition) {
//                     targetSlideSize = _slideSize;
//                     break;
//                 }
//             }
//             if (targetSlideSize > containerSize) targetSlideSize = containerSize;
//         }
//         else {
//             targetSlideSize = slideSize * params.slidesPerView;
//         }
//         if (direction === 'toNext' && (timeDiff > 300)) {
//             if (diffAbs >= targetSlideSize * params.longSwipesRatio) {
//                 _this.swipeNext(true);
//             }
//             else {
//                 _this.swipeReset();
//             }
//         }
//         if (direction === 'toPrev' && (timeDiff > 300)) {
//             if (diffAbs >= targetSlideSize * params.longSwipesRatio) {
//                 _this.swipePrev(true);
//             }
//             else {
//                 _this.swipeReset();
//             }
//         }
//         if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
//         _this.callPlugins('onTouchEnd');
//     }
//
//
//     /*==================================================
//         noSwiping Bubble Check by Isaac Strack
//     ====================================================*/
//     function noSwipingSlide(el) {
//         /*This function is specifically designed to check the parent elements for the noSwiping class, up to the wrapper.
//         We need to check parents because while onTouchStart bubbles, _this.isTouched is checked in onTouchStart, which stops the bubbling.
//         So, if a text box, for example, is the initial target, and the parent slide container has the noSwiping class, the _this.isTouched
//         check will never find it, and what was supposed to be noSwiping is able to be swiped.
//         This function will iterate up and check for the noSwiping class in parents, up through the wrapperClass.*/
//
//         // First we create a truthy variable, which is that swiping is allowd (noSwiping = false)
//         var noSwiping = false;
//
//         // Now we iterate up (parentElements) until we reach the node with the wrapperClass.
//         do {
//
//             // Each time, we check to see if there's a 'swiper-no-swiping' class (noSwipingClass).
//             if (el.className.indexOf(params.noSwipingClass) > -1)
//             {
//                 noSwiping = true; // If there is, we set noSwiping = true;
//             }
//
//             el = el.parentElement;  // now we iterate up (parent node)
//
//         } while (!noSwiping && el.parentElement && el.className.indexOf(params.wrapperClass) === -1); // also include el.parentElement truthy, just in case.
//
//         // because we didn't check the wrapper itself, we do so now, if noSwiping is false:
//         if (!noSwiping && el.className.indexOf(params.wrapperClass) > -1 && el.className.indexOf(params.noSwipingClass) > -1)
//             noSwiping = true; // if the wrapper has the noSwipingClass, we set noSwiping = true;
//
//         return noSwiping;
//     }
//
//     function addClassToHtmlString(klass, outerHtml) {
//         var par = document.createElement('div');
//         var child;
//
//         par.innerHTML = outerHtml;
//         child = par.firstChild;
//         child.className += ' ' + klass;
//
//         return child.outerHTML;
//     }
//
//
//     /*==================================================
//         Swipe Functions
//     ====================================================*/
//     _this.swipeNext = function (internal) {
//         if (!internal && params.loop) _this.fixLoop();
//         if (!internal && params.autoplay) _this.stopAutoplay(true);
//         _this.callPlugins('onSwipeNext');
//         var currentPosition = _this.getWrapperTranslate();
//         var newPosition = currentPosition;
//         if (params.slidesPerView === 'auto') {
//             for (var i = 0; i < _this.snapGrid.length; i++) {
//                 if (-currentPosition >= _this.snapGrid[i] && -currentPosition < _this.snapGrid[i + 1]) {
//                     newPosition = -_this.snapGrid[i + 1];
//                     break;
//                 }
//             }
//         }
//         else {
//             var groupSize = slideSize * params.slidesPerGroup;
//             newPosition = -(Math.floor(Math.abs(currentPosition) / Math.floor(groupSize)) * groupSize + groupSize);
//         }
//         if (newPosition < -maxWrapperPosition()) {
//             newPosition = -maxWrapperPosition();
//         }
//         if (newPosition === currentPosition) return false;
//         swipeToPosition(newPosition, 'next');
//         return true;
//     };
//     _this.swipePrev = function (internal) {
//         if (!internal && params.loop) _this.fixLoop();
//         if (!internal && params.autoplay) _this.stopAutoplay(true);
//         _this.callPlugins('onSwipePrev');
//
//         var currentPosition = Math.ceil(_this.getWrapperTranslate());
//         var newPosition;
//         if (params.slidesPerView === 'auto') {
//             newPosition = 0;
//             for (var i = 1; i < _this.snapGrid.length; i++) {
//                 if (-currentPosition === _this.snapGrid[i]) {
//                     newPosition = -_this.snapGrid[i - 1];
//                     break;
//                 }
//                 if (-currentPosition > _this.snapGrid[i] && -currentPosition < _this.snapGrid[i + 1]) {
//                     newPosition = -_this.snapGrid[i];
//                     break;
//                 }
//             }
//         }
//         else {
//             var groupSize = slideSize * params.slidesPerGroup;
//             newPosition = -(Math.ceil(-currentPosition / groupSize) - 1) * groupSize;
//         }
//
//         if (newPosition > 0) newPosition = 0;
//
//         if (newPosition === currentPosition) return false;
//         swipeToPosition(newPosition, 'prev');
//         return true;
//
//     };
//     _this.swipeReset = function () {
//         _this.callPlugins('onSwipeReset');
//         var currentPosition = _this.getWrapperTranslate();
//         var groupSize = slideSize * params.slidesPerGroup;
//         var newPosition;
//         var maxPosition = -maxWrapperPosition();
//         if (params.slidesPerView === 'auto') {
//             newPosition = 0;
//             for (var i = 0; i < _this.snapGrid.length; i++) {
//                 if (-currentPosition === _this.snapGrid[i]) return;
//                 if (-currentPosition >= _this.snapGrid[i] && -currentPosition < _this.snapGrid[i + 1]) {
//                     if (_this.positions.diff > 0) newPosition = -_this.snapGrid[i + 1];
//                     else newPosition = -_this.snapGrid[i];
//                     break;
//                 }
//             }
//             if (-currentPosition >= _this.snapGrid[_this.snapGrid.length - 1]) newPosition = -_this.snapGrid[_this.snapGrid.length - 1];
//             if (currentPosition <= -maxWrapperPosition()) newPosition = -maxWrapperPosition();
//         }
//         else {
//             newPosition = currentPosition < 0 ? Math.round(currentPosition / groupSize) * groupSize : 0;
//         }
//         if (params.scrollContainer)  {
//             newPosition = currentPosition < 0 ? currentPosition : 0;
//         }
//         if (newPosition < -maxWrapperPosition()) {
//             newPosition = -maxWrapperPosition();
//         }
//         if (params.scrollContainer && (containerSize > slideSize)) {
//             newPosition = 0;
//         }
//
//         if (newPosition === currentPosition) return false;
//
//         swipeToPosition(newPosition, 'reset');
//         return true;
//     };
//
//     _this.swipeTo = function (index, speed, runCallbacks) {
//         index = parseInt(index, 10);
//         _this.callPlugins('onSwipeTo', {index: index, speed: speed});
//         if (params.loop) index = index + _this.loopedSlides;
//         var currentPosition = _this.getWrapperTranslate();
//         if (index > (_this.slides.length - 1) || index < 0) return;
//         var newPosition;
//         if (params.slidesPerView === 'auto') {
//             newPosition = -_this.slidesGrid[index];
//         }
//         else {
//             newPosition = -index * slideSize;
//         }
//         if (newPosition < - maxWrapperPosition()) {
//             newPosition = - maxWrapperPosition();
//         }
//
//         if (newPosition === currentPosition) return false;
//
//         runCallbacks = runCallbacks === false ? false : true;
//         swipeToPosition(newPosition, 'to', {index: index, speed: speed, runCallbacks: runCallbacks});
//         return true;
//     };
//
//     function swipeToPosition(newPosition, action, toOptions) {
//         var speed = (action === 'to' && toOptions.speed >= 0) ? toOptions.speed : params.speed;
//         var timeOld = + new Date();
//
//         function anim() {
//             var timeNew = + new Date();
//             var time = timeNew - timeOld;
//             currentPosition += animationStep * time / (1000 / 60);
//             condition = direction === 'toNext' ? currentPosition > newPosition : currentPosition < newPosition;
//             if (condition) {
//                 _this.setWrapperTranslate(Math.round(currentPosition));
//                 _this._DOMAnimating = true;
//                 window.setTimeout(function () {
//                     anim();
//                 }, 1000 / 60);
//             }
//             else {
//                 if (params.onSlideChangeEnd) {
//                     if (action === 'to') {
//                         if (toOptions.runCallbacks === true) _this.fireCallback(params.onSlideChangeEnd, _this);
//                     }
//                     else {
//                         _this.fireCallback(params.onSlideChangeEnd, _this);
//                     }
//
//                 }
//                 _this.setWrapperTranslate(newPosition);
//                 _this._DOMAnimating = false;
//             }
//         }
//
//         if (_this.support.transitions || !params.DOMAnimation) {
//             _this.setWrapperTranslate(newPosition);
//             _this.setWrapperTransition(speed);
//         }
//         else {
//             //Try the DOM animation
//             var currentPosition = _this.getWrapperTranslate();
//             var animationStep = Math.ceil((newPosition - currentPosition) / speed * (1000 / 60));
//             var direction = currentPosition > newPosition ? 'toNext' : 'toPrev';
//             var condition = direction === 'toNext' ? currentPosition > newPosition : currentPosition < newPosition;
//             if (_this._DOMAnimating) return;
//
//             anim();
//         }
//
//         //Update Active Slide Index
//         _this.updateActiveSlide(newPosition);
//
//         //Callbacks
//         if (params.onSlideNext && action === 'next') {
//             _this.fireCallback(params.onSlideNext, _this, newPosition);
//         }
//         if (params.onSlidePrev && action === 'prev') {
//             _this.fireCallback(params.onSlidePrev, _this, newPosition);
//         }
//         //'Reset' Callback
//         if (params.onSlideReset && action === 'reset') {
//             _this.fireCallback(params.onSlideReset, _this, newPosition);
//         }
//
//         //'Next', 'Prev' and 'To' Callbacks
//         if (action === 'next' || action === 'prev' || (action === 'to' && toOptions.runCallbacks === true))
//             slideChangeCallbacks(action);
//     }
//     /*==================================================
//         Transition Callbacks
//     ====================================================*/
//     //Prevent Multiple Callbacks
//     _this._queueStartCallbacks = false;
//     _this._queueEndCallbacks = false;
//     function slideChangeCallbacks(direction) {
//         //Transition Start Callback
//         _this.callPlugins('onSlideChangeStart');
//         if (params.onSlideChangeStart) {
//             if (params.queueStartCallbacks && _this.support.transitions) {
//                 if (_this._queueStartCallbacks) return;
//                 _this._queueStartCallbacks = true;
//                 _this.fireCallback(params.onSlideChangeStart, _this, direction);
//                 _this.wrapperTransitionEnd(function () {
//                     _this._queueStartCallbacks = false;
//                 });
//             }
//             else _this.fireCallback(params.onSlideChangeStart, _this, direction);
//         }
//         //Transition End Callback
//         if (params.onSlideChangeEnd) {
//             if (_this.support.transitions) {
//                 if (params.queueEndCallbacks) {
//                     if (_this._queueEndCallbacks) return;
//                     _this._queueEndCallbacks = true;
//                     _this.wrapperTransitionEnd(function (swiper) {
//                         _this.fireCallback(params.onSlideChangeEnd, swiper, direction);
//                     });
//                 }
//                 else {
//                     _this.wrapperTransitionEnd(function (swiper) {
//                         _this.fireCallback(params.onSlideChangeEnd, swiper, direction);
//                     });
//                 }
//             }
//             else {
//                 if (!params.DOMAnimation) {
//                     setTimeout(function () {
//                         _this.fireCallback(params.onSlideChangeEnd, _this, direction);
//                     }, 10);
//                 }
//             }
//         }
//     }
//
//     /*==================================================
//         Update Active Slide Index
//     ====================================================*/
//     _this.updateActiveSlide = function (position) {
//         if (!_this.initialized) return;
//         if (_this.slides.length === 0) return;
//         _this.previousIndex = _this.activeIndex;
//         if (typeof position === 'undefined') position = _this.getWrapperTranslate();
//         if (position > 0) position = 0;
//         var i;
//         if (params.slidesPerView === 'auto') {
//             var slidesOffset = 0;
//             _this.activeIndex = _this.slidesGrid.indexOf(-position);
//             if (_this.activeIndex < 0) {
//                 for (i = 0; i < _this.slidesGrid.length - 1; i++) {
//                     if (-position > _this.slidesGrid[i] && -position < _this.slidesGrid[i + 1]) {
//                         break;
//                     }
//                 }
//                 var leftDistance = Math.abs(_this.slidesGrid[i] + position);
//                 var rightDistance = Math.abs(_this.slidesGrid[i + 1] + position);
//                 if (leftDistance <= rightDistance) _this.activeIndex = i;
//                 else _this.activeIndex = i + 1;
//             }
//         }
//         else {
//             _this.activeIndex = Math[params.visibilityFullFit ? 'ceil' : 'round'](-position / slideSize);
//         }
//
//         if (_this.activeIndex === _this.slides.length) _this.activeIndex = _this.slides.length - 1;
//         if (_this.activeIndex < 0) _this.activeIndex = 0;
//
//         // Check for slide
//         if (!_this.slides[_this.activeIndex]) return;
//
//         // Calc Visible slides
//         _this.calcVisibleSlides(position);
//
//         // Mark visible and active slides with additonal classes
//         if (_this.support.classList) {
//             var slide;
//             for (i = 0; i < _this.slides.length; i++) {
//                 slide = _this.slides[i];
//                 slide.classList.remove(params.slideActiveClass);
//                 if (_this.visibleSlides.indexOf(slide) >= 0) {
//                     slide.classList.add(params.slideVisibleClass);
//                 } else {
//                     slide.classList.remove(params.slideVisibleClass);
//                 }
//             }
//             _this.slides[_this.activeIndex].classList.add(params.slideActiveClass);
//         } else {
//             var activeClassRegexp = new RegExp('\\s*' + params.slideActiveClass);
//             var inViewClassRegexp = new RegExp('\\s*' + params.slideVisibleClass);
//
//             for (i = 0; i < _this.slides.length; i++) {
//                 _this.slides[i].className = _this.slides[i].className.replace(activeClassRegexp, '').replace(inViewClassRegexp, '');
//                 if (_this.visibleSlides.indexOf(_this.slides[i]) >= 0) {
//                     _this.slides[i].className += ' ' + params.slideVisibleClass;
//                 }
//             }
//             _this.slides[_this.activeIndex].className += ' ' + params.slideActiveClass;
//         }
//
//         //Update loop index
//         if (params.loop) {
//             var ls = _this.loopedSlides;
//             _this.activeLoopIndex = _this.activeIndex - ls;
//             if (_this.activeLoopIndex >= _this.slides.length - ls * 2) {
//                 _this.activeLoopIndex = _this.slides.length - ls * 2 - _this.activeLoopIndex;
//             }
//             if (_this.activeLoopIndex < 0) {
//                 _this.activeLoopIndex = _this.slides.length - ls * 2 + _this.activeLoopIndex;
//             }
//             if (_this.activeLoopIndex < 0) _this.activeLoopIndex = 0;
//         }
//         else {
//             _this.activeLoopIndex = _this.activeIndex;
//         }
//         //Update Pagination
//         if (params.pagination) {
//             _this.updatePagination(position);
//         }
//     };
//     /*==================================================
//         Pagination
//     ====================================================*/
//     _this.createPagination = function (firstInit) {
//         if (params.paginationClickable && _this.paginationButtons) {
//             removePaginationEvents();
//         }
//         _this.paginationContainer = params.pagination.nodeType ? params.pagination : $$(params.pagination)[0];
//         if (params.createPagination) {
//             var paginationHTML = '';
//             var numOfSlides = _this.slides.length;
//             var numOfButtons = numOfSlides;
//             if (params.loop) numOfButtons -= _this.loopedSlides * 2;
//             for (var i = 0; i < numOfButtons; i++) {
//                 paginationHTML += '<' + params.paginationElement + ' class="' + params.paginationElementClass + '"></' + params.paginationElement + '>';
//             }
//             _this.paginationContainer.innerHTML = paginationHTML;
//         }
//         _this.paginationButtons = $$('.' + params.paginationElementClass, _this.paginationContainer);
//         if (!firstInit) _this.updatePagination();
//         _this.callPlugins('onCreatePagination');
//         if (params.paginationClickable) {
//             addPaginationEvents();
//         }
//     };
//     function removePaginationEvents() {
//         var pagers = _this.paginationButtons;
//         if (pagers) {
//             for (var i = 0; i < pagers.length; i++) {
//                 _this.h.removeEventListener(pagers[i], 'click', paginationClick);
//             }
//         }
//     }
//     function addPaginationEvents() {
//         var pagers = _this.paginationButtons;
//         if (pagers) {
//             for (var i = 0; i < pagers.length; i++) {
//                 _this.h.addEventListener(pagers[i], 'click', paginationClick);
//             }
//         }
//     }
//     function paginationClick(e) {
//         var index;
//         var target = e.target || e.srcElement;
//         var pagers = _this.paginationButtons;
//         for (var i = 0; i < pagers.length; i++) {
//             if (target === pagers[i]) index = i;
//         }
//         _this.swipeTo(index);
//     }
//     _this.updatePagination = function (position) {
//         if (!params.pagination) return;
//         if (_this.slides.length < 1) return;
//         var activePagers = $$('.' + params.paginationActiveClass, _this.paginationContainer);
//         if (!activePagers) return;
//
//         //Reset all Buttons' class to not active
//         var pagers = _this.paginationButtons;
//         if (pagers.length === 0) return;
//         for (var i = 0; i < pagers.length; i++) {
//             pagers[i].className = params.paginationElementClass;
//         }
//
//         var indexOffset = params.loop ? _this.loopedSlides : 0;
//         if (params.paginationAsRange) {
//             if (!_this.visibleSlides) _this.calcVisibleSlides(position);
//             //Get Visible Indexes
//             var visibleIndexes = [];
//             var j; // lopp index - avoid JSHint W004 / W038
//             for (j = 0; j < _this.visibleSlides.length; j++) {
//                 var visIndex = _this.slides.indexOf(_this.visibleSlides[j]) - indexOffset;
//
//                 if (params.loop && visIndex < 0) {
//                     visIndex = _this.slides.length - _this.loopedSlides * 2 + visIndex;
//                 }
//                 if (params.loop && visIndex >= _this.slides.length - _this.loopedSlides * 2) {
//                     visIndex = _this.slides.length - _this.loopedSlides * 2 - visIndex;
//                     visIndex = Math.abs(visIndex);
//                 }
//                 visibleIndexes.push(visIndex);
//             }
//
//             for (j = 0; j < visibleIndexes.length; j++) {
//                 if (pagers[visibleIndexes[j]]) pagers[visibleIndexes[j]].className += ' ' + params.paginationVisibleClass;
//             }
//
//             if (params.loop) {
//                 if (pagers[_this.activeLoopIndex] !== undefined) {
//                     pagers[_this.activeLoopIndex].className += ' ' + params.paginationActiveClass;
//                 }
//             }
//             else {
//                 pagers[_this.activeIndex].className += ' ' + params.paginationActiveClass;
//             }
//         }
//         else {
//             if (params.loop) {
//                 if (pagers[_this.activeLoopIndex]) pagers[_this.activeLoopIndex].className += ' ' + params.paginationActiveClass + ' ' + params.paginationVisibleClass;
//             }
//             else {
//                 pagers[_this.activeIndex].className += ' ' + params.paginationActiveClass + ' ' + params.paginationVisibleClass;
//             }
//         }
//     };
//     _this.calcVisibleSlides = function (position) {
//         var visibleSlides = [];
//         var _slideLeft = 0, _slideSize = 0, _slideRight = 0;
//         if (isH && _this.wrapperLeft > 0) position = position + _this.wrapperLeft;
//         if (!isH && _this.wrapperTop > 0) position = position + _this.wrapperTop;
//
//         for (var i = 0; i < _this.slides.length; i++) {
//             _slideLeft += _slideSize;
//             if (params.slidesPerView === 'auto')
//                 _slideSize  = isH ? _this.h.getWidth(_this.slides[i], true, params.roundLengths) : _this.h.getHeight(_this.slides[i], true, params.roundLengths);
//             else _slideSize = slideSize;
//
//             _slideRight = _slideLeft + _slideSize;
//             var isVisibile = false;
//             if (params.visibilityFullFit) {
//                 if (_slideLeft >= -position && _slideRight <= -position + containerSize) isVisibile = true;
//                 if (_slideLeft <= -position && _slideRight >= -position + containerSize) isVisibile = true;
//             }
//             else {
//                 if (_slideRight > -position && _slideRight <= ((-position + containerSize))) isVisibile = true;
//                 if (_slideLeft >= -position && _slideLeft < ((-position + containerSize))) isVisibile = true;
//                 if (_slideLeft < -position && _slideRight > ((-position + containerSize))) isVisibile = true;
//             }
//
//             if (isVisibile) visibleSlides.push(_this.slides[i]);
//
//         }
//         if (visibleSlides.length === 0) visibleSlides = [_this.slides[_this.activeIndex]];
//
//         _this.visibleSlides = visibleSlides;
//     };
//
//     /*==========================================
//         Autoplay
//     ============================================*/
//     var autoplayTimeoutId, autoplayIntervalId;
//     _this.startAutoplay = function () {
//         if (_this.support.transitions) {
//             if (typeof autoplayTimeoutId !== 'undefined') return false;
//             if (!params.autoplay) return;
//             _this.callPlugins('onAutoplayStart');
//             if (params.onAutoplayStart) _this.fireCallback(params.onAutoplayStart, _this);
//             autoplay();
//         }
//         else {
//             if (typeof autoplayIntervalId !== 'undefined') return false;
//             if (!params.autoplay) return;
//             _this.callPlugins('onAutoplayStart');
//             if (params.onAutoplayStart) _this.fireCallback(params.onAutoplayStart, _this);
//             autoplayIntervalId = setInterval(function () {
//                 if (params.loop) {
//                     _this.fixLoop();
//                     _this.swipeNext(true);
//                 }
//                 else if (!_this.swipeNext(true)) {
//                     if (!params.autoplayStopOnLast) _this.swipeTo(0);
//                     else {
//                         clearInterval(autoplayIntervalId);
//                         autoplayIntervalId = undefined;
//                     }
//                 }
//             }, params.autoplay);
//         }
//     };
//     _this.stopAutoplay = function (internal) {
//         if (_this.support.transitions) {
//             if (!autoplayTimeoutId) return;
//             if (autoplayTimeoutId) clearTimeout(autoplayTimeoutId);
//             autoplayTimeoutId = undefined;
//             if (internal && !params.autoplayDisableOnInteraction) {
//                 _this.wrapperTransitionEnd(function () {
//                     autoplay();
//                 });
//             }
//             _this.callPlugins('onAutoplayStop');
//             if (params.onAutoplayStop) _this.fireCallback(params.onAutoplayStop, _this);
//         }
//         else {
//             if (autoplayIntervalId) clearInterval(autoplayIntervalId);
//             autoplayIntervalId = undefined;
//             _this.callPlugins('onAutoplayStop');
//             if (params.onAutoplayStop) _this.fireCallback(params.onAutoplayStop, _this);
//         }
//     };
//     function autoplay() {
//         autoplayTimeoutId = setTimeout(function () {
//             if (params.loop) {
//                 _this.fixLoop();
//                 _this.swipeNext(true);
//             }
//             else if (!_this.swipeNext(true)) {
//                 if (!params.autoplayStopOnLast) _this.swipeTo(0);
//                 else {
//                     clearTimeout(autoplayTimeoutId);
//                     autoplayTimeoutId = undefined;
//                 }
//             }
//             _this.wrapperTransitionEnd(function () {
//                 if (typeof autoplayTimeoutId !== 'undefined') autoplay();
//             });
//         }, params.autoplay);
//     }
//     /*==================================================
//         Loop
//     ====================================================*/
//     _this.loopCreated = false;
//     _this.removeLoopedSlides = function () {
//         if (_this.loopCreated) {
//             for (var i = 0; i < _this.slides.length; i++) {
//                 if (_this.slides[i].getData('looped') === true) _this.wrapper.removeChild(_this.slides[i]);
//             }
//         }
//     };
//
//     _this.createLoop = function () {
//         if (_this.slides.length === 0) return;
//         if (params.slidesPerView === 'auto') {
//             _this.loopedSlides = params.loopedSlides || 1;
//         }
//         else {
//             _this.loopedSlides = params.slidesPerView + params.loopAdditionalSlides;
//         }
//
//         if (_this.loopedSlides > _this.slides.length) {
//             _this.loopedSlides = _this.slides.length;
//         }
//
//         var slideFirstHTML = '',
//             slideLastHTML = '',
//             i;
//         var slidesSetFullHTML = '';
//         /**
//                 loopedSlides is too large if loopAdditionalSlides are set.
//                 Need to divide the slides by maximum number of slides existing.
//
//                 @author        Tomaz Lovrec <tomaz.lovrec@blanc-noir.at>
//         */
//         var numSlides = _this.slides.length;
//         var fullSlideSets = Math.floor(_this.loopedSlides / numSlides);
//         var remainderSlides = _this.loopedSlides % numSlides;
//         // assemble full sets of slides
//         for (i = 0; i < (fullSlideSets * numSlides); i++) {
//             var j = i;
//             if (i >= numSlides) {
//                 var over = Math.floor(i / numSlides);
//                 j = i - (numSlides * over);
//             }
//             slidesSetFullHTML += _this.slides[j].outerHTML;
//         }
//         // assemble remainder slides
//         // assemble remainder appended to existing slides
//         for (i = 0; i < remainderSlides;i++) {
//             slideLastHTML += addClassToHtmlString(params.slideDuplicateClass, _this.slides[i].outerHTML);
//         }
//         // assemble slides that get preppended to existing slides
//         for (i = numSlides - remainderSlides; i < numSlides;i++) {
//             slideFirstHTML += addClassToHtmlString(params.slideDuplicateClass, _this.slides[i].outerHTML);
//         }
//         // assemble all slides
//         var slides = slideFirstHTML + slidesSetFullHTML + wrapper.innerHTML + slidesSetFullHTML + slideLastHTML;
//         // set the slides
//         wrapper.innerHTML = slides;
//
//         _this.loopCreated = true;
//         _this.calcSlides();
//
//         //Update Looped Slides with special class
//         for (i = 0; i < _this.slides.length; i++) {
//             if (i < _this.loopedSlides || i >= _this.slides.length - _this.loopedSlides) _this.slides[i].setData('looped', true);
//         }
//         _this.callPlugins('onCreateLoop');
//
//     };
//
//     _this.fixLoop = function () {
//         var newIndex;
//         //Fix For Negative Oversliding
//         if (_this.activeIndex < _this.loopedSlides) {
//             newIndex = _this.slides.length - _this.loopedSlides * 3 + _this.activeIndex;
//             _this.swipeTo(newIndex, 0, false);
//         }
//         //Fix For Positive Oversliding
//         else if ((params.slidesPerView === 'auto' && _this.activeIndex >= _this.loopedSlides * 2) || (_this.activeIndex > _this.slides.length - params.slidesPerView * 2)) {
//             newIndex = -_this.slides.length + _this.activeIndex + _this.loopedSlides;
//             _this.swipeTo(newIndex, 0, false);
//         }
//     };
//
//     /*==================================================
//         Slides Loader
//     ====================================================*/
//     _this.loadSlides = function () {
//         var slidesHTML = '';
//         _this.activeLoaderIndex = 0;
//         var slides = params.loader.slides;
//         var slidesToLoad = params.loader.loadAllSlides ? slides.length : params.slidesPerView * (1 + params.loader.surroundGroups);
//         for (var i = 0; i < slidesToLoad; i++) {
//             if (params.loader.slidesHTMLType === 'outer') slidesHTML += slides[i];
//             else {
//                 slidesHTML += '<' + params.slideElement + ' class="' + params.slideClass + '" data-swiperindex="' + i + '">' + slides[i] + '</' + params.slideElement + '>';
//             }
//         }
//         _this.wrapper.innerHTML = slidesHTML;
//         _this.calcSlides(true);
//         //Add permanent transitionEnd callback
//         if (!params.loader.loadAllSlides) {
//             _this.wrapperTransitionEnd(_this.reloadSlides, true);
//         }
//     };
//
//     _this.reloadSlides = function () {
//         var slides = params.loader.slides;
//         var newActiveIndex = parseInt(_this.activeSlide().data('swiperindex'), 10);
//         if (newActiveIndex < 0 || newActiveIndex > slides.length - 1) return; //<-- Exit
//         _this.activeLoaderIndex = newActiveIndex;
//         var firstIndex = Math.max(0, newActiveIndex - params.slidesPerView * params.loader.surroundGroups);
//         var lastIndex = Math.min(newActiveIndex + params.slidesPerView * (1 + params.loader.surroundGroups) - 1, slides.length - 1);
//         //Update Transforms
//         if (newActiveIndex > 0) {
//             var newTransform = -slideSize * (newActiveIndex - firstIndex);
//             _this.setWrapperTranslate(newTransform);
//             _this.setWrapperTransition(0);
//         }
//         var i; // loop index
//         //New Slides
//         if (params.loader.logic === 'reload') {
//             _this.wrapper.innerHTML = '';
//             var slidesHTML = '';
//             for (i = firstIndex; i <= lastIndex; i++) {
//                 slidesHTML += params.loader.slidesHTMLType === 'outer' ? slides[i] : '<' + params.slideElement + ' class="' + params.slideClass + '" data-swiperindex="' + i + '">' + slides[i] + '</' + params.slideElement + '>';
//             }
//             _this.wrapper.innerHTML = slidesHTML;
//         }
//         else {
//             var minExistIndex = 1000;
//             var maxExistIndex = 0;
//
//             for (i = 0; i < _this.slides.length; i++) {
//                 var index = _this.slides[i].data('swiperindex');
//                 if (index < firstIndex || index > lastIndex) {
//                     _this.wrapper.removeChild(_this.slides[i]);
//                 }
//                 else {
//                     minExistIndex = Math.min(index, minExistIndex);
//                     maxExistIndex = Math.max(index, maxExistIndex);
//                 }
//             }
//             for (i = firstIndex; i <= lastIndex; i++) {
//                 var newSlide;
//                 if (i < minExistIndex) {
//                     newSlide = document.createElement(params.slideElement);
//                     newSlide.className = params.slideClass;
//                     newSlide.setAttribute('data-swiperindex', i);
//                     newSlide.innerHTML = slides[i];
//                     _this.wrapper.insertBefore(newSlide, _this.wrapper.firstChild);
//                 }
//                 if (i > maxExistIndex) {
//                     newSlide = document.createElement(params.slideElement);
//                     newSlide.className = params.slideClass;
//                     newSlide.setAttribute('data-swiperindex', i);
//                     newSlide.innerHTML = slides[i];
//                     _this.wrapper.appendChild(newSlide);
//                 }
//             }
//         }
//         //reInit
//         _this.reInit(true);
//     };
//
//     /*==================================================
//         Make Swiper
//     ====================================================*/
//     function makeSwiper() {
//         _this.calcSlides();
//         if (params.loader.slides.length > 0 && _this.slides.length === 0) {
//             _this.loadSlides();
//         }
//         if (params.loop) {
//             _this.createLoop();
//         }
//         _this.init();
//         initEvents();
//         if (params.pagination) {
//             _this.createPagination(true);
//         }
//
//         if (params.loop || params.initialSlide > 0) {
//             _this.swipeTo(params.initialSlide, 0, false);
//         }
//         else {
//             _this.updateActiveSlide(0);
//         }
//         if (params.autoplay) {
//             _this.startAutoplay();
//         }
//         /**
//          * Set center slide index.
//          *
//          * @author        Tomaz Lovrec <tomaz.lovrec@gmail.com>
//          */
//         _this.centerIndex = _this.activeIndex;
//
//         // Callbacks
//         if (params.onSwiperCreated) _this.fireCallback(params.onSwiperCreated, _this);
//         _this.callPlugins('onSwiperCreated');
//     }
//
//     makeSwiper();
// };
//
// Swiper.prototype = {
//     plugins : {},
//
//     /*==================================================
//         Wrapper Operations
//     ====================================================*/
//     wrapperTransitionEnd : function (callback, permanent) {
//         'use strict';
//         var a = this,
//             el = a.wrapper,
//             events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
//             i;
//
//         function fireCallBack() {
//             callback(a);
//             if (a.params.queueEndCallbacks) a._queueEndCallbacks = false;
//             if (!permanent) {
//                 for (i = 0; i < events.length; i++) {
//                     a.h.removeEventListener(el, events[i], fireCallBack);
//                 }
//             }
//         }
//
//         if (callback) {
//             for (i = 0; i < events.length; i++) {
//                 a.h.addEventListener(el, events[i], fireCallBack);
//             }
//         }
//     },
//
//     getWrapperTranslate : function (axis) {
//         'use strict';
//         var el = this.wrapper,
//             matrix, curTransform, curStyle, transformMatrix;
//
//         // automatic axis detection
//         if (typeof axis === 'undefined') {
//             axis = this.params.mode === 'horizontal' ? 'x' : 'y';
//         }
//
//         if (this.support.transforms && this.params.useCSS3Transforms) {
//             curStyle = window.getComputedStyle(el, null);
//             if (window.WebKitCSSMatrix) {
//                 // Some old versions of Webkit choke when 'none' is passed; pass
//                 // empty string instead in this case
//                 transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
//             }
//             else {
//                 transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
//                 matrix = transformMatrix.toString().split(',');
//             }
//
//             if (axis === 'x') {
//                 //Latest Chrome and webkits Fix
//                 if (window.WebKitCSSMatrix)
//                     curTransform = transformMatrix.m41;
//                 //Crazy IE10 Matrix
//                 else if (matrix.length === 16)
//                     curTransform = parseFloat(matrix[12]);
//                 //Normal Browsers
//                 else
//                     curTransform = parseFloat(matrix[4]);
//             }
//             if (axis === 'y') {
//                 //Latest Chrome and webkits Fix
//                 if (window.WebKitCSSMatrix)
//                     curTransform = transformMatrix.m42;
//                 //Crazy IE10 Matrix
//                 else if (matrix.length === 16)
//                     curTransform = parseFloat(matrix[13]);
//                 //Normal Browsers
//                 else
//                     curTransform = parseFloat(matrix[5]);
//             }
//         }
//         else {
//             if (axis === 'x') curTransform = parseFloat(el.style.left, 10) || 0;
//             if (axis === 'y') curTransform = parseFloat(el.style.top, 10) || 0;
//         }
//         return curTransform || 0;
//     },
//
//     setWrapperTranslate : function (x, y, z) {
//         'use strict';
//         var es = this.wrapper.style,
//             coords = {x: 0, y: 0, z: 0},
//             translate;
//
//         // passed all coordinates
//         if (arguments.length === 3) {
//             coords.x = x;
//             coords.y = y;
//             coords.z = z;
//         }
//
//         // passed one coordinate and optional axis
//         else {
//             if (typeof y === 'undefined') {
//                 y = this.params.mode === 'horizontal' ? 'x' : 'y';
//             }
//             coords[y] = x;
//         }
//
//         if (this.support.transforms && this.params.useCSS3Transforms) {
//             translate = this.support.transforms3d ? 'translate3d(' + coords.x + 'px, ' + coords.y + 'px, ' + coords.z + 'px)' : 'translate(' + coords.x + 'px, ' + coords.y + 'px)';
//             es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = translate;
//         }
//         else {
//             es.left = coords.x + 'px';
//             es.top  = coords.y + 'px';
//         }
//         this.callPlugins('onSetWrapperTransform', coords);
//         if (this.params.onSetWrapperTransform) this.fireCallback(this.params.onSetWrapperTransform, this, coords);
//     },
//
//     setWrapperTransition : function (duration) {
//         'use strict';
//         var es = this.wrapper.style;
//         es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = (duration / 1000) + 's';
//         this.callPlugins('onSetWrapperTransition', {duration: duration});
//         if (this.params.onSetWrapperTransition) this.fireCallback(this.params.onSetWrapperTransition, this, duration);
//
//     },
//
//     /*==================================================
//         Helpers
//     ====================================================*/
//     h : {
//         getWidth: function (el, outer, round) {
//             'use strict';
//             var width = window.getComputedStyle(el, null).getPropertyValue('width');
//             var returnWidth = parseFloat(width);
//             //IE Fixes
//             if (isNaN(returnWidth) || width.indexOf('%') > 0) {
//                 returnWidth = el.offsetWidth - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
//             }
//             if (outer) returnWidth += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
//             if (round) return Math.round(returnWidth);
//             else return returnWidth;
//         },
//         getHeight: function (el, outer, round) {
//             'use strict';
//             if (outer) return el.offsetHeight;
//
//             var height = window.getComputedStyle(el, null).getPropertyValue('height');
//             var returnHeight = parseFloat(height);
//             //IE Fixes
//             if (isNaN(returnHeight) || height.indexOf('%') > 0) {
//                 returnHeight = el.offsetHeight - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
//             }
//             if (outer) returnHeight += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
//             if (round) return Math.round(returnHeight);
//             else return returnHeight;
//         },
//         getOffset: function (el) {
//             'use strict';
//             var box = el.getBoundingClientRect();
//             var body = document.body;
//             var clientTop  = el.clientTop  || body.clientTop  || 0;
//             var clientLeft = el.clientLeft || body.clientLeft || 0;
//             var scrollTop  = window.pageYOffset || el.scrollTop;
//             var scrollLeft = window.pageXOffset || el.scrollLeft;
//             if (document.documentElement && !window.pageYOffset) {
//                 //IE7-8
//                 scrollTop  = document.documentElement.scrollTop;
//                 scrollLeft = document.documentElement.scrollLeft;
//             }
//             return {
//                 top: box.top  + scrollTop  - clientTop,
//                 left: box.left + scrollLeft - clientLeft
//             };
//         },
//         windowWidth : function () {
//             'use strict';
//             if (window.innerWidth) return window.innerWidth;
//             else if (document.documentElement && document.documentElement.clientWidth) return document.documentElement.clientWidth;
//         },
//         windowHeight : function () {
//             'use strict';
//             if (window.innerHeight) return window.innerHeight;
//             else if (document.documentElement && document.documentElement.clientHeight) return document.documentElement.clientHeight;
//         },
//         windowScroll : function () {
//             'use strict';
//             if (typeof pageYOffset !== 'undefined') {
//                 return {
//                     left: window.pageXOffset,
//                     top: window.pageYOffset
//                 };
//             }
//             else if (document.documentElement) {
//                 return {
//                     left: document.documentElement.scrollLeft,
//                     top: document.documentElement.scrollTop
//                 };
//             }
//         },
//
//         addEventListener : function (el, event, listener, useCapture) {
//             'use strict';
//             if (typeof useCapture === 'undefined') {
//                 useCapture = false;
//             }
//
//             if (el.addEventListener) {
//                 el.addEventListener(event, listener, useCapture);
//             }
//             else if (el.attachEvent) {
//                 el.attachEvent('on' + event, listener);
//             }
//         },
//
//         removeEventListener : function (el, event, listener, useCapture) {
//             'use strict';
//             if (typeof useCapture === 'undefined') {
//                 useCapture = false;
//             }
//
//             if (el.removeEventListener) {
//                 el.removeEventListener(event, listener, useCapture);
//             }
//             else if (el.detachEvent) {
//                 el.detachEvent('on' + event, listener);
//             }
//         }
//     },
//     setTransform : function (el, transform) {
//         'use strict';
//         var es = el.style;
//         es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transform;
//     },
//     setTranslate : function (el, translate) {
//         'use strict';
//         var es = el.style;
//         var pos = {
//             x : translate.x || 0,
//             y : translate.y || 0,
//             z : translate.z || 0
//         };
//         var transformString = this.support.transforms3d ? 'translate3d(' + (pos.x) + 'px,' + (pos.y) + 'px,' + (pos.z) + 'px)' : 'translate(' + (pos.x) + 'px,' + (pos.y) + 'px)';
//         es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transformString;
//         if (!this.support.transforms) {
//             es.left = pos.x + 'px';
//             es.top = pos.y + 'px';
//         }
//     },
//     setTransition : function (el, duration) {
//         'use strict';
//         var es = el.style;
//         es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = duration + 'ms';
//     },
//     /*==================================================
//         Feature Detection
//     ====================================================*/
//     support: {
//
//         touch : (window.Modernizr && Modernizr.touch === true) || (function () {
//             'use strict';
//             return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
//         })(),
//
//         transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
//             'use strict';
//             var div = document.createElement('div').style;
//             return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
//         })(),
//
//         transforms : (window.Modernizr && Modernizr.csstransforms === true) || (function () {
//             'use strict';
//             var div = document.createElement('div').style;
//             return ('transform' in div || 'WebkitTransform' in div || 'MozTransform' in div || 'msTransform' in div || 'MsTransform' in div || 'OTransform' in div);
//         })(),
//
//         transitions : (window.Modernizr && Modernizr.csstransitions === true) || (function () {
//             'use strict';
//             var div = document.createElement('div').style;
//             return ('transition' in div || 'WebkitTransition' in div || 'MozTransition' in div || 'msTransition' in div || 'MsTransition' in div || 'OTransition' in div);
//         })(),
//
//         classList : (function () {
//             'use strict';
//             var div = document.createElement('div').style;
//             return 'classList' in div;
//         })()
//     },
//
//     browser : {
//
//         ie8 : (function () {
//             'use strict';
//             var rv = -1; // Return value assumes failure.
//             if (navigator.appName === 'Microsoft Internet Explorer') {
//                 var ua = navigator.userAgent;
//                 var re = new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
//                 if (re.exec(ua) !== null)
//                     rv = parseFloat(RegExp.$1);
//             }
//             return rv !== -1 && rv < 9;
//         })(),
//
//         ie10 : window.navigator.msPointerEnabled,
//         ie11 : window.navigator.pointerEnabled
//     }
// };
//
// /*=========================
//   jQuery & Zepto Plugins
//   ===========================*/
// if (window.jQuery || window.Zepto) {
//     (function ($) {
//         'use strict';
//         $.fn.swiper = function (params) {
//             var s = new Swiper($(this)[0], params);
//             $(this).data('swiper', s);
//             return s;
//         };
//     })(window.jQuery || window.Zepto);
// }
//
// // component
// if (typeof(module) !== 'undefined')
// {
//     module.exports = Swiper;
// }
//
// // requirejs support
// if (typeof define === 'function' && define.amd) {
//     define([], function () {
//         'use strict';
//         return Swiper;
//     });
// }

/**
 * Swiper 3.3.1
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 *
 * http://www.idangero.us/swiper/
 *
 * Copyright 2016, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under MIT
 *
 * Released on: February 7, 2016
 */
!function(){"use strict";function e(e){e.fn.swiper=function(a){var r;return e(this).each(function(){var e=new t(this,a);r||(r=e)}),r}}var a,t=function(e,i){function s(e){return Math.floor(e)}function n(){b.autoplayTimeoutId=setTimeout(function(){b.params.loop?(b.fixLoop(),b._slideNext(),b.emit("onAutoplay",b)):b.isEnd?i.autoplayStopOnLast?b.stopAutoplay():(b._slideTo(0),b.emit("onAutoplay",b)):(b._slideNext(),b.emit("onAutoplay",b))},b.params.autoplay)}function o(e,t){var r=a(e.target);if(!r.is(t))if("string"==typeof t)r=r.parents(t);else if(t.nodeType){var i;return r.parents().each(function(e,a){a===t&&(i=t)}),i?t:void 0}if(0!==r.length)return r[0]}function l(e,a){a=a||{};var t=window.MutationObserver||window.WebkitMutationObserver,r=new t(function(e){e.forEach(function(e){b.onResize(!0),b.emit("onObserverUpdate",b,e)})});r.observe(e,{attributes:"undefined"==typeof a.attributes?!0:a.attributes,childList:"undefined"==typeof a.childList?!0:a.childList,characterData:"undefined"==typeof a.characterData?!0:a.characterData}),b.observers.push(r)}function p(e){e.originalEvent&&(e=e.originalEvent);var a=e.keyCode||e.charCode;if(!b.params.allowSwipeToNext&&(b.isHorizontal()&&39===a||!b.isHorizontal()&&40===a))return!1;if(!b.params.allowSwipeToPrev&&(b.isHorizontal()&&37===a||!b.isHorizontal()&&38===a))return!1;if(!(e.shiftKey||e.altKey||e.ctrlKey||e.metaKey||document.activeElement&&document.activeElement.nodeName&&("input"===document.activeElement.nodeName.toLowerCase()||"textarea"===document.activeElement.nodeName.toLowerCase()))){if(37===a||39===a||38===a||40===a){var t=!1;if(b.container.parents(".swiper-slide").length>0&&0===b.container.parents(".swiper-slide-active").length)return;var r={left:window.pageXOffset,top:window.pageYOffset},i=window.innerWidth,s=window.innerHeight,n=b.container.offset();b.rtl&&(n.left=n.left-b.container[0].scrollLeft);for(var o=[[n.left,n.top],[n.left+b.width,n.top],[n.left,n.top+b.height],[n.left+b.width,n.top+b.height]],l=0;l<o.length;l++){var p=o[l];p[0]>=r.left&&p[0]<=r.left+i&&p[1]>=r.top&&p[1]<=r.top+s&&(t=!0)}if(!t)return}b.isHorizontal()?((37===a||39===a)&&(e.preventDefault?e.preventDefault():e.returnValue=!1),(39===a&&!b.rtl||37===a&&b.rtl)&&b.slideNext(),(37===a&&!b.rtl||39===a&&b.rtl)&&b.slidePrev()):((38===a||40===a)&&(e.preventDefault?e.preventDefault():e.returnValue=!1),40===a&&b.slideNext(),38===a&&b.slidePrev())}}function d(e){e.originalEvent&&(e=e.originalEvent);var a=b.mousewheel.event,t=0,r=b.rtl?-1:1;if("mousewheel"===a)if(b.params.mousewheelForceToAxis)if(b.isHorizontal()){if(!(Math.abs(e.wheelDeltaX)>Math.abs(e.wheelDeltaY)))return;t=e.wheelDeltaX*r}else{if(!(Math.abs(e.wheelDeltaY)>Math.abs(e.wheelDeltaX)))return;t=e.wheelDeltaY}else t=Math.abs(e.wheelDeltaX)>Math.abs(e.wheelDeltaY)?-e.wheelDeltaX*r:-e.wheelDeltaY;else if("DOMMouseScroll"===a)t=-e.detail;else if("wheel"===a)if(b.params.mousewheelForceToAxis)if(b.isHorizontal()){if(!(Math.abs(e.deltaX)>Math.abs(e.deltaY)))return;t=-e.deltaX*r}else{if(!(Math.abs(e.deltaY)>Math.abs(e.deltaX)))return;t=-e.deltaY}else t=Math.abs(e.deltaX)>Math.abs(e.deltaY)?-e.deltaX*r:-e.deltaY;if(0!==t){if(b.params.mousewheelInvert&&(t=-t),b.params.freeMode){var i=b.getWrapperTranslate()+t*b.params.mousewheelSensitivity,s=b.isBeginning,n=b.isEnd;if(i>=b.minTranslate()&&(i=b.minTranslate()),i<=b.maxTranslate()&&(i=b.maxTranslate()),b.setWrapperTransition(0),b.setWrapperTranslate(i),b.updateProgress(),b.updateActiveIndex(),(!s&&b.isBeginning||!n&&b.isEnd)&&b.updateClasses(),b.params.freeModeSticky?(clearTimeout(b.mousewheel.timeout),b.mousewheel.timeout=setTimeout(function(){b.slideReset()},300)):b.params.lazyLoading&&b.lazy&&b.lazy.load(),0===i||i===b.maxTranslate())return}else{if((new window.Date).getTime()-b.mousewheel.lastScrollTime>60)if(0>t)if(b.isEnd&&!b.params.loop||b.animating){if(b.params.mousewheelReleaseOnEdges)return!0}else b.slideNext();else if(b.isBeginning&&!b.params.loop||b.animating){if(b.params.mousewheelReleaseOnEdges)return!0}else b.slidePrev();b.mousewheel.lastScrollTime=(new window.Date).getTime()}return b.params.autoplay&&b.stopAutoplay(),e.preventDefault?e.preventDefault():e.returnValue=!1,!1}}function u(e,t){e=a(e);var r,i,s,n=b.rtl?-1:1;r=e.attr("data-swiper-parallax")||"0",i=e.attr("data-swiper-parallax-x"),s=e.attr("data-swiper-parallax-y"),i||s?(i=i||"0",s=s||"0"):b.isHorizontal()?(i=r,s="0"):(s=r,i="0"),i=i.indexOf("%")>=0?parseInt(i,10)*t*n+"%":i*t*n+"px",s=s.indexOf("%")>=0?parseInt(s,10)*t+"%":s*t+"px",e.transform("translate3d("+i+", "+s+",0px)")}function c(e){return 0!==e.indexOf("on")&&(e=e[0]!==e[0].toUpperCase()?"on"+e[0].toUpperCase()+e.substring(1):"on"+e),e}if(!(this instanceof t))return new t(e,i);var m={direction:"horizontal",touchEventsTarget:"container",initialSlide:0,speed:300,autoplay:!1,autoplayDisableOnInteraction:!0,autoplayStopOnLast:!1,iOSEdgeSwipeDetection:!1,iOSEdgeSwipeThreshold:20,freeMode:!1,freeModeMomentum:!0,freeModeMomentumRatio:1,freeModeMomentumBounce:!0,freeModeMomentumBounceRatio:1,freeModeSticky:!1,freeModeMinimumVelocity:.02,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",coverflow:{rotate:50,stretch:0,depth:100,modifier:1,slideShadows:!0},flip:{slideShadows:!0,limitRotation:!0},cube:{slideShadows:!0,shadow:!0,shadowOffset:20,shadowScale:.94},fade:{crossFade:!1},parallax:!1,scrollbar:null,scrollbarHide:!0,scrollbarDraggable:!1,scrollbarSnapOnRelease:!1,keyboardControl:!1,mousewheelControl:!1,mousewheelReleaseOnEdges:!1,mousewheelInvert:!1,mousewheelForceToAxis:!1,mousewheelSensitivity:1,hashnav:!1,breakpoints:void 0,spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:"column",slidesPerGroup:1,centeredSlides:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,onlyExternal:!1,threshold:0,touchMoveStopPropagation:!0,uniqueNavElements:!0,pagination:null,paginationElement:"span",paginationClickable:!1,paginationHide:!1,paginationBulletRender:null,paginationProgressRender:null,paginationFractionRender:null,paginationCustomRender:null,paginationType:"bullets",resistance:!0,resistanceRatio:.85,nextButton:null,prevButton:null,watchSlidesProgress:!1,watchSlidesVisibility:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,lazyLoading:!1,lazyLoadingInPrevNext:!1,lazyLoadingInPrevNextAmount:1,lazyLoadingOnTransitionStart:!1,preloadImages:!0,updateOnImagesReady:!0,loop:!1,loopAdditionalSlides:0,loopedSlides:null,control:void 0,controlInverse:!1,controlBy:"slide",allowSwipeToPrev:!0,allowSwipeToNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",slideClass:"swiper-slide",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",slideNextClass:"swiper-slide-next",slidePrevClass:"swiper-slide-prev",wrapperClass:"swiper-wrapper",bulletClass:"swiper-pagination-bullet",bulletActiveClass:"swiper-pagination-bullet-active",buttonDisabledClass:"swiper-button-disabled",paginationCurrentClass:"swiper-pagination-current",paginationTotalClass:"swiper-pagination-total",paginationHiddenClass:"swiper-pagination-hidden",paginationProgressbarClass:"swiper-pagination-progressbar",observer:!1,observeParents:!1,a11y:!1,prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}",runCallbacksOnInit:!0},h=i&&i.virtualTranslate;i=i||{};var f={};for(var g in i)if("object"!=typeof i[g]||null===i[g]||(i[g].nodeType||i[g]===window||i[g]===document||"undefined"!=typeof r&&i[g]instanceof r||"undefined"!=typeof jQuery&&i[g]instanceof jQuery))f[g]=i[g];else{f[g]={};for(var v in i[g])f[g][v]=i[g][v]}for(var w in m)if("undefined"==typeof i[w])i[w]=m[w];else if("object"==typeof i[w])for(var y in m[w])"undefined"==typeof i[w][y]&&(i[w][y]=m[w][y]);var b=this;if(b.params=i,b.originalParams=f,b.classNames=[],"undefined"!=typeof a&&"undefined"!=typeof r&&(a=r),("undefined"!=typeof a||(a="undefined"==typeof r?window.Dom7||window.Zepto||window.jQuery:r))&&(b.$=a,b.currentBreakpoint=void 0,b.getActiveBreakpoint=function(){if(!b.params.breakpoints)return!1;var e,a=!1,t=[];for(e in b.params.breakpoints)b.params.breakpoints.hasOwnProperty(e)&&t.push(e);t.sort(function(e,a){return parseInt(e,10)>parseInt(a,10)});for(var r=0;r<t.length;r++)e=t[r],e>=window.innerWidth&&!a&&(a=e);return a||"max"},b.setBreakpoint=function(){var e=b.getActiveBreakpoint();if(e&&b.currentBreakpoint!==e){var a=e in b.params.breakpoints?b.params.breakpoints[e]:b.originalParams,t=b.params.loop&&a.slidesPerView!==b.params.slidesPerView;for(var r in a)b.params[r]=a[r];b.currentBreakpoint=e,t&&b.destroyLoop&&b.reLoop(!0)}},b.params.breakpoints&&b.setBreakpoint(),b.container=a(e),0!==b.container.length)){if(b.container.length>1){var x=[];return b.container.each(function(){x.push(new t(this,i))}),x}b.container[0].swiper=b,b.container.data("swiper",b),b.classNames.push("swiper-container-"+b.params.direction),b.params.freeMode&&b.classNames.push("swiper-container-free-mode"),b.support.flexbox||(b.classNames.push("swiper-container-no-flexbox"),b.params.slidesPerColumn=1),b.params.autoHeight&&b.classNames.push("swiper-container-autoheight"),(b.params.parallax||b.params.watchSlidesVisibility)&&(b.params.watchSlidesProgress=!0),["cube","coverflow","flip"].indexOf(b.params.effect)>=0&&(b.support.transforms3d?(b.params.watchSlidesProgress=!0,b.classNames.push("swiper-container-3d")):b.params.effect="slide"),"slide"!==b.params.effect&&b.classNames.push("swiper-container-"+b.params.effect),"cube"===b.params.effect&&(b.params.resistanceRatio=0,b.params.slidesPerView=1,b.params.slidesPerColumn=1,b.params.slidesPerGroup=1,b.params.centeredSlides=!1,b.params.spaceBetween=0,b.params.virtualTranslate=!0,b.params.setWrapperSize=!1),("fade"===b.params.effect||"flip"===b.params.effect)&&(b.params.slidesPerView=1,b.params.slidesPerColumn=1,b.params.slidesPerGroup=1,b.params.watchSlidesProgress=!0,b.params.spaceBetween=0,b.params.setWrapperSize=!1,"undefined"==typeof h&&(b.params.virtualTranslate=!0)),b.params.grabCursor&&b.support.touch&&(b.params.grabCursor=!1),b.wrapper=b.container.children("."+b.params.wrapperClass),b.params.pagination&&(b.paginationContainer=a(b.params.pagination),b.params.uniqueNavElements&&"string"==typeof b.params.pagination&&b.paginationContainer.length>1&&1===b.container.find(b.params.pagination).length&&(b.paginationContainer=b.container.find(b.params.pagination)),"bullets"===b.params.paginationType&&b.params.paginationClickable?b.paginationContainer.addClass("swiper-pagination-clickable"):b.params.paginationClickable=!1,b.paginationContainer.addClass("swiper-pagination-"+b.params.paginationType)),(b.params.nextButton||b.params.prevButton)&&(b.params.nextButton&&(b.nextButton=a(b.params.nextButton),b.params.uniqueNavElements&&"string"==typeof b.params.nextButton&&b.nextButton.length>1&&1===b.container.find(b.params.nextButton).length&&(b.nextButton=b.container.find(b.params.nextButton))),b.params.prevButton&&(b.prevButton=a(b.params.prevButton),b.params.uniqueNavElements&&"string"==typeof b.params.prevButton&&b.prevButton.length>1&&1===b.container.find(b.params.prevButton).length&&(b.prevButton=b.container.find(b.params.prevButton)))),b.isHorizontal=function(){return"horizontal"===b.params.direction},b.rtl=b.isHorizontal()&&("rtl"===b.container[0].dir.toLowerCase()||"rtl"===b.container.css("direction")),b.rtl&&b.classNames.push("swiper-container-rtl"),b.rtl&&(b.wrongRTL="-webkit-box"===b.wrapper.css("display")),b.params.slidesPerColumn>1&&b.classNames.push("swiper-container-multirow"),b.device.android&&b.classNames.push("swiper-container-android"),b.container.addClass(b.classNames.join(" ")),b.translate=0,b.progress=0,b.velocity=0,b.lockSwipeToNext=function(){b.params.allowSwipeToNext=!1},b.lockSwipeToPrev=function(){b.params.allowSwipeToPrev=!1},b.lockSwipes=function(){b.params.allowSwipeToNext=b.params.allowSwipeToPrev=!1},b.unlockSwipeToNext=function(){b.params.allowSwipeToNext=!0},b.unlockSwipeToPrev=function(){b.params.allowSwipeToPrev=!0},b.unlockSwipes=function(){b.params.allowSwipeToNext=b.params.allowSwipeToPrev=!0},b.params.grabCursor&&(b.container[0].style.cursor="move",b.container[0].style.cursor="-webkit-grab",b.container[0].style.cursor="-moz-grab",b.container[0].style.cursor="grab"),b.imagesToLoad=[],b.imagesLoaded=0,b.loadImage=function(e,a,t,r,i){function s(){i&&i()}var n;e.complete&&r?s():a?(n=new window.Image,n.onload=s,n.onerror=s,t&&(n.srcset=t),a&&(n.src=a)):s()},b.preloadImages=function(){function e(){"undefined"!=typeof b&&null!==b&&(void 0!==b.imagesLoaded&&b.imagesLoaded++,b.imagesLoaded===b.imagesToLoad.length&&(b.params.updateOnImagesReady&&b.update(),b.emit("onImagesReady",b)))}b.imagesToLoad=b.container.find("img");for(var a=0;a<b.imagesToLoad.length;a++)b.loadImage(b.imagesToLoad[a],b.imagesToLoad[a].currentSrc||b.imagesToLoad[a].getAttribute("src"),b.imagesToLoad[a].srcset||b.imagesToLoad[a].getAttribute("srcset"),!0,e)},b.autoplayTimeoutId=void 0,b.autoplaying=!1,b.autoplayPaused=!1,b.startAutoplay=function(){return"undefined"!=typeof b.autoplayTimeoutId?!1:b.params.autoplay?b.autoplaying?!1:(b.autoplaying=!0,b.emit("onAutoplayStart",b),void n()):!1},b.stopAutoplay=function(e){b.autoplayTimeoutId&&(b.autoplayTimeoutId&&clearTimeout(b.autoplayTimeoutId),b.autoplaying=!1,b.autoplayTimeoutId=void 0,b.emit("onAutoplayStop",b))},b.pauseAutoplay=function(e){b.autoplayPaused||(b.autoplayTimeoutId&&clearTimeout(b.autoplayTimeoutId),b.autoplayPaused=!0,0===e?(b.autoplayPaused=!1,n()):b.wrapper.transitionEnd(function(){b&&(b.autoplayPaused=!1,b.autoplaying?n():b.stopAutoplay())}))},b.minTranslate=function(){return-b.snapGrid[0]},b.maxTranslate=function(){return-b.snapGrid[b.snapGrid.length-1]},b.updateAutoHeight=function(){var e=b.slides.eq(b.activeIndex)[0];if("undefined"!=typeof e){var a=e.offsetHeight;a&&b.wrapper.css("height",a+"px")}},b.updateContainerSize=function(){var e,a;e="undefined"!=typeof b.params.width?b.params.width:b.container[0].clientWidth,a="undefined"!=typeof b.params.height?b.params.height:b.container[0].clientHeight,0===e&&b.isHorizontal()||0===a&&!b.isHorizontal()||(e=e-parseInt(b.container.css("padding-left"),10)-parseInt(b.container.css("padding-right"),10),a=a-parseInt(b.container.css("padding-top"),10)-parseInt(b.container.css("padding-bottom"),10),b.width=e,b.height=a,b.size=b.isHorizontal()?b.width:b.height)},b.updateSlidesSize=function(){b.slides=b.wrapper.children("."+b.params.slideClass),b.snapGrid=[],b.slidesGrid=[],b.slidesSizesGrid=[];var e,a=b.params.spaceBetween,t=-b.params.slidesOffsetBefore,r=0,i=0;if("undefined"!=typeof b.size){"string"==typeof a&&a.indexOf("%")>=0&&(a=parseFloat(a.replace("%",""))/100*b.size),b.virtualSize=-a,b.rtl?b.slides.css({marginLeft:"",marginTop:""}):b.slides.css({marginRight:"",marginBottom:""});var n;b.params.slidesPerColumn>1&&(n=Math.floor(b.slides.length/b.params.slidesPerColumn)===b.slides.length/b.params.slidesPerColumn?b.slides.length:Math.ceil(b.slides.length/b.params.slidesPerColumn)*b.params.slidesPerColumn,"auto"!==b.params.slidesPerView&&"row"===b.params.slidesPerColumnFill&&(n=Math.max(n,b.params.slidesPerView*b.params.slidesPerColumn)));var o,l=b.params.slidesPerColumn,p=n/l,d=p-(b.params.slidesPerColumn*p-b.slides.length);for(e=0;e<b.slides.length;e++){o=0;var u=b.slides.eq(e);if(b.params.slidesPerColumn>1){var c,m,h;"column"===b.params.slidesPerColumnFill?(m=Math.floor(e/l),h=e-m*l,(m>d||m===d&&h===l-1)&&++h>=l&&(h=0,m++),c=m+h*n/l,u.css({"-webkit-box-ordinal-group":c,"-moz-box-ordinal-group":c,"-ms-flex-order":c,"-webkit-order":c,order:c})):(h=Math.floor(e/p),m=e-h*p),u.css({"margin-top":0!==h&&b.params.spaceBetween&&b.params.spaceBetween+"px"}).attr("data-swiper-column",m).attr("data-swiper-row",h)}"none"!==u.css("display")&&("auto"===b.params.slidesPerView?(o=b.isHorizontal()?u.outerWidth(!0):u.outerHeight(!0),b.params.roundLengths&&(o=s(o))):(o=(b.size-(b.params.slidesPerView-1)*a)/b.params.slidesPerView,b.params.roundLengths&&(o=s(o)),b.isHorizontal()?b.slides[e].style.width=o+"px":b.slides[e].style.height=o+"px"),b.slides[e].swiperSlideSize=o,b.slidesSizesGrid.push(o),b.params.centeredSlides?(t=t+o/2+r/2+a,0===e&&(t=t-b.size/2-a),Math.abs(t)<.001&&(t=0),i%b.params.slidesPerGroup===0&&b.snapGrid.push(t),b.slidesGrid.push(t)):(i%b.params.slidesPerGroup===0&&b.snapGrid.push(t),b.slidesGrid.push(t),t=t+o+a),b.virtualSize+=o+a,r=o,i++)}b.virtualSize=Math.max(b.virtualSize,b.size)+b.params.slidesOffsetAfter;var f;if(b.rtl&&b.wrongRTL&&("slide"===b.params.effect||"coverflow"===b.params.effect)&&b.wrapper.css({width:b.virtualSize+b.params.spaceBetween+"px"}),(!b.support.flexbox||b.params.setWrapperSize)&&(b.isHorizontal()?b.wrapper.css({width:b.virtualSize+b.params.spaceBetween+"px"}):b.wrapper.css({height:b.virtualSize+b.params.spaceBetween+"px"})),b.params.slidesPerColumn>1&&(b.virtualSize=(o+b.params.spaceBetween)*n,b.virtualSize=Math.ceil(b.virtualSize/b.params.slidesPerColumn)-b.params.spaceBetween,b.wrapper.css({width:b.virtualSize+b.params.spaceBetween+"px"}),b.params.centeredSlides)){for(f=[],e=0;e<b.snapGrid.length;e++)b.snapGrid[e]<b.virtualSize+b.snapGrid[0]&&f.push(b.snapGrid[e]);b.snapGrid=f}if(!b.params.centeredSlides){for(f=[],e=0;e<b.snapGrid.length;e++)b.snapGrid[e]<=b.virtualSize-b.size&&f.push(b.snapGrid[e]);b.snapGrid=f,Math.floor(b.virtualSize-b.size)-Math.floor(b.snapGrid[b.snapGrid.length-1])>1&&b.snapGrid.push(b.virtualSize-b.size)}0===b.snapGrid.length&&(b.snapGrid=[0]),0!==b.params.spaceBetween&&(b.isHorizontal()?b.rtl?b.slides.css({marginLeft:a+"px"}):b.slides.css({marginRight:a+"px"}):b.slides.css({marginBottom:a+"px"})),b.params.watchSlidesProgress&&b.updateSlidesOffset()}},b.updateSlidesOffset=function(){for(var e=0;e<b.slides.length;e++)b.slides[e].swiperSlideOffset=b.isHorizontal()?b.slides[e].offsetLeft:b.slides[e].offsetTop},b.updateSlidesProgress=function(e){if("undefined"==typeof e&&(e=b.translate||0),0!==b.slides.length){"undefined"==typeof b.slides[0].swiperSlideOffset&&b.updateSlidesOffset();var a=-e;b.rtl&&(a=e),b.slides.removeClass(b.params.slideVisibleClass);for(var t=0;t<b.slides.length;t++){var r=b.slides[t],i=(a-r.swiperSlideOffset)/(r.swiperSlideSize+b.params.spaceBetween);if(b.params.watchSlidesVisibility){var s=-(a-r.swiperSlideOffset),n=s+b.slidesSizesGrid[t],o=s>=0&&s<b.size||n>0&&n<=b.size||0>=s&&n>=b.size;o&&b.slides.eq(t).addClass(b.params.slideVisibleClass)}r.progress=b.rtl?-i:i}}},b.updateProgress=function(e){"undefined"==typeof e&&(e=b.translate||0);var a=b.maxTranslate()-b.minTranslate(),t=b.isBeginning,r=b.isEnd;0===a?(b.progress=0,b.isBeginning=b.isEnd=!0):(b.progress=(e-b.minTranslate())/a,b.isBeginning=b.progress<=0,b.isEnd=b.progress>=1),b.isBeginning&&!t&&b.emit("onReachBeginning",b),b.isEnd&&!r&&b.emit("onReachEnd",b),b.params.watchSlidesProgress&&b.updateSlidesProgress(e),b.emit("onProgress",b,b.progress)},b.updateActiveIndex=function(){var e,a,t,r=b.rtl?b.translate:-b.translate;for(a=0;a<b.slidesGrid.length;a++)"undefined"!=typeof b.slidesGrid[a+1]?r>=b.slidesGrid[a]&&r<b.slidesGrid[a+1]-(b.slidesGrid[a+1]-b.slidesGrid[a])/2?e=a:r>=b.slidesGrid[a]&&r<b.slidesGrid[a+1]&&(e=a+1):r>=b.slidesGrid[a]&&(e=a);(0>e||"undefined"==typeof e)&&(e=0),t=Math.floor(e/b.params.slidesPerGroup),t>=b.snapGrid.length&&(t=b.snapGrid.length-1),e!==b.activeIndex&&(b.snapIndex=t,b.previousIndex=b.activeIndex,b.activeIndex=e,b.updateClasses())},b.updateClasses=function(){b.slides.removeClass(b.params.slideActiveClass+" "+b.params.slideNextClass+" "+b.params.slidePrevClass);var e=b.slides.eq(b.activeIndex);e.addClass(b.params.slideActiveClass);var t=e.next("."+b.params.slideClass).addClass(b.params.slideNextClass);b.params.loop&&0===t.length&&b.slides.eq(0).addClass(b.params.slideNextClass);var r=e.prev("."+b.params.slideClass).addClass(b.params.slidePrevClass);if(b.params.loop&&0===r.length&&b.slides.eq(-1).addClass(b.params.slidePrevClass),b.paginationContainer&&b.paginationContainer.length>0){var i,s=b.params.loop?Math.ceil((b.slides.length-2*b.loopedSlides)/b.params.slidesPerGroup):b.snapGrid.length;if(b.params.loop?(i=Math.ceil((b.activeIndex-b.loopedSlides)/b.params.slidesPerGroup),i>b.slides.length-1-2*b.loopedSlides&&(i-=b.slides.length-2*b.loopedSlides),i>s-1&&(i-=s),0>i&&"bullets"!==b.params.paginationType&&(i=s+i)):i="undefined"!=typeof b.snapIndex?b.snapIndex:b.activeIndex||0,"bullets"===b.params.paginationType&&b.bullets&&b.bullets.length>0&&(b.bullets.removeClass(b.params.bulletActiveClass),b.paginationContainer.length>1?b.bullets.each(function(){a(this).index()===i&&a(this).addClass(b.params.bulletActiveClass)}):b.bullets.eq(i).addClass(b.params.bulletActiveClass)),"fraction"===b.params.paginationType&&(b.paginationContainer.find("."+b.params.paginationCurrentClass).text(i+1),b.paginationContainer.find("."+b.params.paginationTotalClass).text(s)),"progress"===b.params.paginationType){var n=(i+1)/s,o=n,l=1;b.isHorizontal()||(l=n,o=1),b.paginationContainer.find("."+b.params.paginationProgressbarClass).transform("translate3d(0,0,0) scaleX("+o+") scaleY("+l+")").transition(b.params.speed)}"custom"===b.params.paginationType&&b.params.paginationCustomRender&&(b.paginationContainer.html(b.params.paginationCustomRender(b,i+1,s)),b.emit("onPaginationRendered",b,b.paginationContainer[0]))}b.params.loop||(b.params.prevButton&&b.prevButton&&b.prevButton.length>0&&(b.isBeginning?(b.prevButton.addClass(b.params.buttonDisabledClass),b.params.a11y&&b.a11y&&b.a11y.disable(b.prevButton)):(b.prevButton.removeClass(b.params.buttonDisabledClass),b.params.a11y&&b.a11y&&b.a11y.enable(b.prevButton))),b.params.nextButton&&b.nextButton&&b.nextButton.length>0&&(b.isEnd?(b.nextButton.addClass(b.params.buttonDisabledClass),b.params.a11y&&b.a11y&&b.a11y.disable(b.nextButton)):(b.nextButton.removeClass(b.params.buttonDisabledClass),b.params.a11y&&b.a11y&&b.a11y.enable(b.nextButton))))},b.updatePagination=function(){if(b.params.pagination&&b.paginationContainer&&b.paginationContainer.length>0){var e="";if("bullets"===b.params.paginationType){for(var a=b.params.loop?Math.ceil((b.slides.length-2*b.loopedSlides)/b.params.slidesPerGroup):b.snapGrid.length,t=0;a>t;t++)e+=b.params.paginationBulletRender?b.params.paginationBulletRender(t,b.params.bulletClass):"<"+b.params.paginationElement+' class="'+b.params.bulletClass+'"></'+b.params.paginationElement+">";b.paginationContainer.html(e),b.bullets=b.paginationContainer.find("."+b.params.bulletClass),b.params.paginationClickable&&b.params.a11y&&b.a11y&&b.a11y.initPagination()}"fraction"===b.params.paginationType&&(e=b.params.paginationFractionRender?b.params.paginationFractionRender(b,b.params.paginationCurrentClass,b.params.paginationTotalClass):'<span class="'+b.params.paginationCurrentClass+'"></span> / <span class="'+b.params.paginationTotalClass+'"></span>',b.paginationContainer.html(e)),"progress"===b.params.paginationType&&(e=b.params.paginationProgressRender?b.params.paginationProgressRender(b,b.params.paginationProgressbarClass):'<span class="'+b.params.paginationProgressbarClass+'"></span>',b.paginationContainer.html(e)),"custom"!==b.params.paginationType&&b.emit("onPaginationRendered",b,b.paginationContainer[0])}},b.update=function(e){function a(){r=Math.min(Math.max(b.translate,b.maxTranslate()),b.minTranslate()),b.setWrapperTranslate(r),b.updateActiveIndex(),b.updateClasses()}if(b.updateContainerSize(),b.updateSlidesSize(),b.updateProgress(),b.updatePagination(),b.updateClasses(),b.params.scrollbar&&b.scrollbar&&b.scrollbar.set(),e){var t,r;b.controller&&b.controller.spline&&(b.controller.spline=void 0),b.params.freeMode?(a(),b.params.autoHeight&&b.updateAutoHeight()):(t=("auto"===b.params.slidesPerView||b.params.slidesPerView>1)&&b.isEnd&&!b.params.centeredSlides?b.slideTo(b.slides.length-1,0,!1,!0):b.slideTo(b.activeIndex,0,!1,!0),t||a())}else b.params.autoHeight&&b.updateAutoHeight()},b.onResize=function(e){b.params.breakpoints&&b.setBreakpoint();var a=b.params.allowSwipeToPrev,t=b.params.allowSwipeToNext;b.params.allowSwipeToPrev=b.params.allowSwipeToNext=!0,b.updateContainerSize(),b.updateSlidesSize(),("auto"===b.params.slidesPerView||b.params.freeMode||e)&&b.updatePagination(),b.params.scrollbar&&b.scrollbar&&b.scrollbar.set(),b.controller&&b.controller.spline&&(b.controller.spline=void 0);var r=!1;if(b.params.freeMode){var i=Math.min(Math.max(b.translate,b.maxTranslate()),b.minTranslate());b.setWrapperTranslate(i),b.updateActiveIndex(),b.updateClasses(),b.params.autoHeight&&b.updateAutoHeight()}else b.updateClasses(),r=("auto"===b.params.slidesPerView||b.params.slidesPerView>1)&&b.isEnd&&!b.params.centeredSlides?b.slideTo(b.slides.length-1,0,!1,!0):b.slideTo(b.activeIndex,0,!1,!0);b.params.lazyLoading&&!r&&b.lazy&&b.lazy.load(),b.params.allowSwipeToPrev=a,b.params.allowSwipeToNext=t};var T=["mousedown","mousemove","mouseup"];window.navigator.pointerEnabled?T=["pointerdown","pointermove","pointerup"]:window.navigator.msPointerEnabled&&(T=["MSPointerDown","MSPointerMove","MSPointerUp"]),b.touchEvents={start:b.support.touch||!b.params.simulateTouch?"touchstart":T[0],move:b.support.touch||!b.params.simulateTouch?"touchmove":T[1],end:b.support.touch||!b.params.simulateTouch?"touchend":T[2]},(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&("container"===b.params.touchEventsTarget?b.container:b.wrapper).addClass("swiper-wp8-"+b.params.direction),b.initEvents=function(e){var a=e?"off":"on",t=e?"removeEventListener":"addEventListener",r="container"===b.params.touchEventsTarget?b.container[0]:b.wrapper[0],s=b.support.touch?r:document,n=b.params.nested?!0:!1;b.browser.ie?(r[t](b.touchEvents.start,b.onTouchStart,!1),s[t](b.touchEvents.move,b.onTouchMove,n),s[t](b.touchEvents.end,b.onTouchEnd,!1)):(b.support.touch&&(r[t](b.touchEvents.start,b.onTouchStart,!1),r[t](b.touchEvents.move,b.onTouchMove,n),r[t](b.touchEvents.end,b.onTouchEnd,!1)),!i.simulateTouch||b.device.ios||b.device.android||(r[t]("mousedown",b.onTouchStart,!1),document[t]("mousemove",b.onTouchMove,n),document[t]("mouseup",b.onTouchEnd,!1))),window[t]("resize",b.onResize),b.params.nextButton&&b.nextButton&&b.nextButton.length>0&&(b.nextButton[a]("click",b.onClickNext),b.params.a11y&&b.a11y&&b.nextButton[a]("keydown",b.a11y.onEnterKey)),b.params.prevButton&&b.prevButton&&b.prevButton.length>0&&(b.prevButton[a]("click",b.onClickPrev),b.params.a11y&&b.a11y&&b.prevButton[a]("keydown",b.a11y.onEnterKey)),b.params.pagination&&b.params.paginationClickable&&(b.paginationContainer[a]("click","."+b.params.bulletClass,b.onClickIndex),b.params.a11y&&b.a11y&&b.paginationContainer[a]("keydown","."+b.params.bulletClass,b.a11y.onEnterKey)),(b.params.preventClicks||b.params.preventClicksPropagation)&&r[t]("click",b.preventClicks,!0)},b.attachEvents=function(){b.initEvents()},b.detachEvents=function(){b.initEvents(!0)},b.allowClick=!0,b.preventClicks=function(e){b.allowClick||(b.params.preventClicks&&e.preventDefault(),b.params.preventClicksPropagation&&b.animating&&(e.stopPropagation(),e.stopImmediatePropagation()))},b.onClickNext=function(e){e.preventDefault(),(!b.isEnd||b.params.loop)&&b.slideNext()},b.onClickPrev=function(e){e.preventDefault(),(!b.isBeginning||b.params.loop)&&b.slidePrev()},b.onClickIndex=function(e){e.preventDefault();var t=a(this).index()*b.params.slidesPerGroup;b.params.loop&&(t+=b.loopedSlides),b.slideTo(t)},b.updateClickedSlide=function(e){var t=o(e,"."+b.params.slideClass),r=!1;if(t)for(var i=0;i<b.slides.length;i++)b.slides[i]===t&&(r=!0);if(!t||!r)return b.clickedSlide=void 0,void(b.clickedIndex=void 0);if(b.clickedSlide=t,b.clickedIndex=a(t).index(),b.params.slideToClickedSlide&&void 0!==b.clickedIndex&&b.clickedIndex!==b.activeIndex){var s,n=b.clickedIndex;if(b.params.loop){if(b.animating)return;s=a(b.clickedSlide).attr("data-swiper-slide-index"),b.params.centeredSlides?n<b.loopedSlides-b.params.slidesPerView/2||n>b.slides.length-b.loopedSlides+b.params.slidesPerView/2?(b.fixLoop(),n=b.wrapper.children("."+b.params.slideClass+'[data-swiper-slide-index="'+s+'"]:not(.swiper-slide-duplicate)').eq(0).index(),setTimeout(function(){b.slideTo(n)},0)):b.slideTo(n):n>b.slides.length-b.params.slidesPerView?(b.fixLoop(),n=b.wrapper.children("."+b.params.slideClass+'[data-swiper-slide-index="'+s+'"]:not(.swiper-slide-duplicate)').eq(0).index(),setTimeout(function(){b.slideTo(n)},0)):b.slideTo(n)}else b.slideTo(n)}};var S,C,z,M,E,P,k,I,L,B,D="input, select, textarea, button",H=Date.now(),A=[];b.animating=!1,b.touches={startX:0,startY:0,currentX:0,currentY:0,diff:0};var G,O;if(b.onTouchStart=function(e){if(e.originalEvent&&(e=e.originalEvent),G="touchstart"===e.type,G||!("which"in e)||3!==e.which){if(b.params.noSwiping&&o(e,"."+b.params.noSwipingClass))return void(b.allowClick=!0);if(!b.params.swipeHandler||o(e,b.params.swipeHandler)){var t=b.touches.currentX="touchstart"===e.type?e.targetTouches[0].pageX:e.pageX,r=b.touches.currentY="touchstart"===e.type?e.targetTouches[0].pageY:e.pageY;if(!(b.device.ios&&b.params.iOSEdgeSwipeDetection&&t<=b.params.iOSEdgeSwipeThreshold)){if(S=!0,C=!1,z=!0,E=void 0,O=void 0,b.touches.startX=t,b.touches.startY=r,M=Date.now(),b.allowClick=!0,b.updateContainerSize(),b.swipeDirection=void 0,b.params.threshold>0&&(I=!1),"touchstart"!==e.type){var i=!0;a(e.target).is(D)&&(i=!1),document.activeElement&&a(document.activeElement).is(D)&&document.activeElement.blur(),i&&e.preventDefault()}b.emit("onTouchStart",b,e)}}}},b.onTouchMove=function(e){if(e.originalEvent&&(e=e.originalEvent),!G||"mousemove"!==e.type){if(e.preventedByNestedSwiper)return b.touches.startX="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,void(b.touches.startY="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY);if(b.params.onlyExternal)return b.allowClick=!1,void(S&&(b.touches.startX=b.touches.currentX="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,b.touches.startY=b.touches.currentY="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,M=Date.now()));if(G&&document.activeElement&&e.target===document.activeElement&&a(e.target).is(D))return C=!0,void(b.allowClick=!1);if(z&&b.emit("onTouchMove",b,e),!(e.targetTouches&&e.targetTouches.length>1)){if(b.touches.currentX="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,b.touches.currentY="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,"undefined"==typeof E){var t=180*Math.atan2(Math.abs(b.touches.currentY-b.touches.startY),Math.abs(b.touches.currentX-b.touches.startX))/Math.PI;E=b.isHorizontal()?t>b.params.touchAngle:90-t>b.params.touchAngle}if(E&&b.emit("onTouchMoveOpposite",b,e),"undefined"==typeof O&&b.browser.ieTouch&&(b.touches.currentX!==b.touches.startX||b.touches.currentY!==b.touches.startY)&&(O=!0),S){if(E)return void(S=!1);if(O||!b.browser.ieTouch){b.allowClick=!1,b.emit("onSliderMove",b,e),e.preventDefault(),b.params.touchMoveStopPropagation&&!b.params.nested&&e.stopPropagation(),C||(i.loop&&b.fixLoop(),k=b.getWrapperTranslate(),b.setWrapperTransition(0),b.animating&&b.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"),b.params.autoplay&&b.autoplaying&&(b.params.autoplayDisableOnInteraction?b.stopAutoplay():b.pauseAutoplay()),B=!1,b.params.grabCursor&&(b.container[0].style.cursor="move",b.container[0].style.cursor="-webkit-grabbing",b.container[0].style.cursor="-moz-grabbin",b.container[0].style.cursor="grabbing")),C=!0;var r=b.touches.diff=b.isHorizontal()?b.touches.currentX-b.touches.startX:b.touches.currentY-b.touches.startY;r*=b.params.touchRatio,b.rtl&&(r=-r),b.swipeDirection=r>0?"prev":"next",P=r+k;var s=!0;if(r>0&&P>b.minTranslate()?(s=!1,b.params.resistance&&(P=b.minTranslate()-1+Math.pow(-b.minTranslate()+k+r,b.params.resistanceRatio))):0>r&&P<b.maxTranslate()&&(s=!1,b.params.resistance&&(P=b.maxTranslate()+1-Math.pow(b.maxTranslate()-k-r,b.params.resistanceRatio))),
s&&(e.preventedByNestedSwiper=!0),!b.params.allowSwipeToNext&&"next"===b.swipeDirection&&k>P&&(P=k),!b.params.allowSwipeToPrev&&"prev"===b.swipeDirection&&P>k&&(P=k),b.params.followFinger){if(b.params.threshold>0){if(!(Math.abs(r)>b.params.threshold||I))return void(P=k);if(!I)return I=!0,b.touches.startX=b.touches.currentX,b.touches.startY=b.touches.currentY,P=k,void(b.touches.diff=b.isHorizontal()?b.touches.currentX-b.touches.startX:b.touches.currentY-b.touches.startY)}(b.params.freeMode||b.params.watchSlidesProgress)&&b.updateActiveIndex(),b.params.freeMode&&(0===A.length&&A.push({position:b.touches[b.isHorizontal()?"startX":"startY"],time:M}),A.push({position:b.touches[b.isHorizontal()?"currentX":"currentY"],time:(new window.Date).getTime()})),b.updateProgress(P),b.setWrapperTranslate(P)}}}}}},b.onTouchEnd=function(e){if(e.originalEvent&&(e=e.originalEvent),z&&b.emit("onTouchEnd",b,e),z=!1,S){b.params.grabCursor&&C&&S&&(b.container[0].style.cursor="move",b.container[0].style.cursor="-webkit-grab",b.container[0].style.cursor="-moz-grab",b.container[0].style.cursor="grab");var t=Date.now(),r=t-M;if(b.allowClick&&(b.updateClickedSlide(e),b.emit("onTap",b,e),300>r&&t-H>300&&(L&&clearTimeout(L),L=setTimeout(function(){b&&(b.params.paginationHide&&b.paginationContainer.length>0&&!a(e.target).hasClass(b.params.bulletClass)&&b.paginationContainer.toggleClass(b.params.paginationHiddenClass),b.emit("onClick",b,e))},300)),300>r&&300>t-H&&(L&&clearTimeout(L),b.emit("onDoubleTap",b,e))),H=Date.now(),setTimeout(function(){b&&(b.allowClick=!0)},0),!S||!C||!b.swipeDirection||0===b.touches.diff||P===k)return void(S=C=!1);S=C=!1;var i;if(i=b.params.followFinger?b.rtl?b.translate:-b.translate:-P,b.params.freeMode){if(i<-b.minTranslate())return void b.slideTo(b.activeIndex);if(i>-b.maxTranslate())return void(b.slides.length<b.snapGrid.length?b.slideTo(b.snapGrid.length-1):b.slideTo(b.slides.length-1));if(b.params.freeModeMomentum){if(A.length>1){var s=A.pop(),n=A.pop(),o=s.position-n.position,l=s.time-n.time;b.velocity=o/l,b.velocity=b.velocity/2,Math.abs(b.velocity)<b.params.freeModeMinimumVelocity&&(b.velocity=0),(l>150||(new window.Date).getTime()-s.time>300)&&(b.velocity=0)}else b.velocity=0;A.length=0;var p=1e3*b.params.freeModeMomentumRatio,d=b.velocity*p,u=b.translate+d;b.rtl&&(u=-u);var c,m=!1,h=20*Math.abs(b.velocity)*b.params.freeModeMomentumBounceRatio;if(u<b.maxTranslate())b.params.freeModeMomentumBounce?(u+b.maxTranslate()<-h&&(u=b.maxTranslate()-h),c=b.maxTranslate(),m=!0,B=!0):u=b.maxTranslate();else if(u>b.minTranslate())b.params.freeModeMomentumBounce?(u-b.minTranslate()>h&&(u=b.minTranslate()+h),c=b.minTranslate(),m=!0,B=!0):u=b.minTranslate();else if(b.params.freeModeSticky){var f,g=0;for(g=0;g<b.snapGrid.length;g+=1)if(b.snapGrid[g]>-u){f=g;break}u=Math.abs(b.snapGrid[f]-u)<Math.abs(b.snapGrid[f-1]-u)||"next"===b.swipeDirection?b.snapGrid[f]:b.snapGrid[f-1],b.rtl||(u=-u)}if(0!==b.velocity)p=b.rtl?Math.abs((-u-b.translate)/b.velocity):Math.abs((u-b.translate)/b.velocity);else if(b.params.freeModeSticky)return void b.slideReset();b.params.freeModeMomentumBounce&&m?(b.updateProgress(c),b.setWrapperTransition(p),b.setWrapperTranslate(u),b.onTransitionStart(),b.animating=!0,b.wrapper.transitionEnd(function(){b&&B&&(b.emit("onMomentumBounce",b),b.setWrapperTransition(b.params.speed),b.setWrapperTranslate(c),b.wrapper.transitionEnd(function(){b&&b.onTransitionEnd()}))})):b.velocity?(b.updateProgress(u),b.setWrapperTransition(p),b.setWrapperTranslate(u),b.onTransitionStart(),b.animating||(b.animating=!0,b.wrapper.transitionEnd(function(){b&&b.onTransitionEnd()}))):b.updateProgress(u),b.updateActiveIndex()}return void((!b.params.freeModeMomentum||r>=b.params.longSwipesMs)&&(b.updateProgress(),b.updateActiveIndex()))}var v,w=0,y=b.slidesSizesGrid[0];for(v=0;v<b.slidesGrid.length;v+=b.params.slidesPerGroup)"undefined"!=typeof b.slidesGrid[v+b.params.slidesPerGroup]?i>=b.slidesGrid[v]&&i<b.slidesGrid[v+b.params.slidesPerGroup]&&(w=v,y=b.slidesGrid[v+b.params.slidesPerGroup]-b.slidesGrid[v]):i>=b.slidesGrid[v]&&(w=v,y=b.slidesGrid[b.slidesGrid.length-1]-b.slidesGrid[b.slidesGrid.length-2]);var x=(i-b.slidesGrid[w])/y;if(r>b.params.longSwipesMs){if(!b.params.longSwipes)return void b.slideTo(b.activeIndex);"next"===b.swipeDirection&&(x>=b.params.longSwipesRatio?b.slideTo(w+b.params.slidesPerGroup):b.slideTo(w)),"prev"===b.swipeDirection&&(x>1-b.params.longSwipesRatio?b.slideTo(w+b.params.slidesPerGroup):b.slideTo(w))}else{if(!b.params.shortSwipes)return void b.slideTo(b.activeIndex);"next"===b.swipeDirection&&b.slideTo(w+b.params.slidesPerGroup),"prev"===b.swipeDirection&&b.slideTo(w)}}},b._slideTo=function(e,a){return b.slideTo(e,a,!0,!0)},b.slideTo=function(e,a,t,r){"undefined"==typeof t&&(t=!0),"undefined"==typeof e&&(e=0),0>e&&(e=0),b.snapIndex=Math.floor(e/b.params.slidesPerGroup),b.snapIndex>=b.snapGrid.length&&(b.snapIndex=b.snapGrid.length-1);var i=-b.snapGrid[b.snapIndex];b.params.autoplay&&b.autoplaying&&(r||!b.params.autoplayDisableOnInteraction?b.pauseAutoplay(a):b.stopAutoplay()),b.updateProgress(i);for(var s=0;s<b.slidesGrid.length;s++)-Math.floor(100*i)>=Math.floor(100*b.slidesGrid[s])&&(e=s);return!b.params.allowSwipeToNext&&i<b.translate&&i<b.minTranslate()?!1:!b.params.allowSwipeToPrev&&i>b.translate&&i>b.maxTranslate()&&(b.activeIndex||0)!==e?!1:("undefined"==typeof a&&(a=b.params.speed),b.previousIndex=b.activeIndex||0,b.activeIndex=e,b.rtl&&-i===b.translate||!b.rtl&&i===b.translate?(b.params.autoHeight&&b.updateAutoHeight(),b.updateClasses(),"slide"!==b.params.effect&&b.setWrapperTranslate(i),!1):(b.updateClasses(),b.onTransitionStart(t),0===a?(b.setWrapperTranslate(i),b.setWrapperTransition(0),b.onTransitionEnd(t)):(b.setWrapperTranslate(i),b.setWrapperTransition(a),b.animating||(b.animating=!0,b.wrapper.transitionEnd(function(){b&&b.onTransitionEnd(t)}))),!0))},b.onTransitionStart=function(e){"undefined"==typeof e&&(e=!0),b.params.autoHeight&&b.updateAutoHeight(),b.lazy&&b.lazy.onTransitionStart(),e&&(b.emit("onTransitionStart",b),b.activeIndex!==b.previousIndex&&(b.emit("onSlideChangeStart",b),b.activeIndex>b.previousIndex?b.emit("onSlideNextStart",b):b.emit("onSlidePrevStart",b)))},b.onTransitionEnd=function(e){b.animating=!1,b.setWrapperTransition(0),"undefined"==typeof e&&(e=!0),b.lazy&&b.lazy.onTransitionEnd(),e&&(b.emit("onTransitionEnd",b),b.activeIndex!==b.previousIndex&&(b.emit("onSlideChangeEnd",b),b.activeIndex>b.previousIndex?b.emit("onSlideNextEnd",b):b.emit("onSlidePrevEnd",b))),b.params.hashnav&&b.hashnav&&b.hashnav.setHash()},b.slideNext=function(e,a,t){if(b.params.loop){if(b.animating)return!1;b.fixLoop();b.container[0].clientLeft;return b.slideTo(b.activeIndex+b.params.slidesPerGroup,a,e,t)}return b.slideTo(b.activeIndex+b.params.slidesPerGroup,a,e,t)},b._slideNext=function(e){return b.slideNext(!0,e,!0)},b.slidePrev=function(e,a,t){if(b.params.loop){if(b.animating)return!1;b.fixLoop();b.container[0].clientLeft;return b.slideTo(b.activeIndex-1,a,e,t)}return b.slideTo(b.activeIndex-1,a,e,t)},b._slidePrev=function(e){return b.slidePrev(!0,e,!0)},b.slideReset=function(e,a,t){return b.slideTo(b.activeIndex,a,e)},b.setWrapperTransition=function(e,a){b.wrapper.transition(e),"slide"!==b.params.effect&&b.effects[b.params.effect]&&b.effects[b.params.effect].setTransition(e),b.params.parallax&&b.parallax&&b.parallax.setTransition(e),b.params.scrollbar&&b.scrollbar&&b.scrollbar.setTransition(e),b.params.control&&b.controller&&b.controller.setTransition(e,a),b.emit("onSetTransition",b,e)},b.setWrapperTranslate=function(e,a,t){var r=0,i=0,n=0;b.isHorizontal()?r=b.rtl?-e:e:i=e,b.params.roundLengths&&(r=s(r),i=s(i)),b.params.virtualTranslate||(b.support.transforms3d?b.wrapper.transform("translate3d("+r+"px, "+i+"px, "+n+"px)"):b.wrapper.transform("translate("+r+"px, "+i+"px)")),b.translate=b.isHorizontal()?r:i;var o,l=b.maxTranslate()-b.minTranslate();o=0===l?0:(e-b.minTranslate())/l,o!==b.progress&&b.updateProgress(e),a&&b.updateActiveIndex(),"slide"!==b.params.effect&&b.effects[b.params.effect]&&b.effects[b.params.effect].setTranslate(b.translate),b.params.parallax&&b.parallax&&b.parallax.setTranslate(b.translate),b.params.scrollbar&&b.scrollbar&&b.scrollbar.setTranslate(b.translate),b.params.control&&b.controller&&b.controller.setTranslate(b.translate,t),b.emit("onSetTranslate",b,b.translate)},b.getTranslate=function(e,a){var t,r,i,s;return"undefined"==typeof a&&(a="x"),b.params.virtualTranslate?b.rtl?-b.translate:b.translate:(i=window.getComputedStyle(e,null),window.WebKitCSSMatrix?(r=i.transform||i.webkitTransform,r.split(",").length>6&&(r=r.split(", ").map(function(e){return e.replace(",",".")}).join(", ")),s=new window.WebKitCSSMatrix("none"===r?"":r)):(s=i.MozTransform||i.OTransform||i.MsTransform||i.msTransform||i.transform||i.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),t=s.toString().split(",")),"x"===a&&(r=window.WebKitCSSMatrix?s.m41:16===t.length?parseFloat(t[12]):parseFloat(t[4])),"y"===a&&(r=window.WebKitCSSMatrix?s.m42:16===t.length?parseFloat(t[13]):parseFloat(t[5])),b.rtl&&r&&(r=-r),r||0)},b.getWrapperTranslate=function(e){return"undefined"==typeof e&&(e=b.isHorizontal()?"x":"y"),b.getTranslate(b.wrapper[0],e)},b.observers=[],b.initObservers=function(){if(b.params.observeParents)for(var e=b.container.parents(),a=0;a<e.length;a++)l(e[a]);l(b.container[0],{childList:!1}),l(b.wrapper[0],{attributes:!1})},b.disconnectObservers=function(){for(var e=0;e<b.observers.length;e++)b.observers[e].disconnect();b.observers=[]},b.createLoop=function(){b.wrapper.children("."+b.params.slideClass+"."+b.params.slideDuplicateClass).remove();var e=b.wrapper.children("."+b.params.slideClass);"auto"!==b.params.slidesPerView||b.params.loopedSlides||(b.params.loopedSlides=e.length),b.loopedSlides=parseInt(b.params.loopedSlides||b.params.slidesPerView,10),b.loopedSlides=b.loopedSlides+b.params.loopAdditionalSlides,b.loopedSlides>e.length&&(b.loopedSlides=e.length);var t,r=[],i=[];for(e.each(function(t,s){var n=a(this);t<b.loopedSlides&&i.push(s),t<e.length&&t>=e.length-b.loopedSlides&&r.push(s),n.attr("data-swiper-slide-index",t)}),t=0;t<i.length;t++)b.wrapper.append(a(i[t].cloneNode(!0)).addClass(b.params.slideDuplicateClass));for(t=r.length-1;t>=0;t--)b.wrapper.prepend(a(r[t].cloneNode(!0)).addClass(b.params.slideDuplicateClass))},b.destroyLoop=function(){b.wrapper.children("."+b.params.slideClass+"."+b.params.slideDuplicateClass).remove(),b.slides.removeAttr("data-swiper-slide-index")},b.reLoop=function(e){var a=b.activeIndex-b.loopedSlides;b.destroyLoop(),b.createLoop(),b.updateSlidesSize(),e&&b.slideTo(a+b.loopedSlides,0,!1)},b.fixLoop=function(){var e;b.activeIndex<b.loopedSlides?(e=b.slides.length-3*b.loopedSlides+b.activeIndex,e+=b.loopedSlides,b.slideTo(e,0,!1,!0)):("auto"===b.params.slidesPerView&&b.activeIndex>=2*b.loopedSlides||b.activeIndex>b.slides.length-2*b.params.slidesPerView)&&(e=-b.slides.length+b.activeIndex+b.loopedSlides,e+=b.loopedSlides,b.slideTo(e,0,!1,!0))},b.appendSlide=function(e){if(b.params.loop&&b.destroyLoop(),"object"==typeof e&&e.length)for(var a=0;a<e.length;a++)e[a]&&b.wrapper.append(e[a]);else b.wrapper.append(e);b.params.loop&&b.createLoop(),b.params.observer&&b.support.observer||b.update(!0)},b.prependSlide=function(e){b.params.loop&&b.destroyLoop();var a=b.activeIndex+1;if("object"==typeof e&&e.length){for(var t=0;t<e.length;t++)e[t]&&b.wrapper.prepend(e[t]);a=b.activeIndex+e.length}else b.wrapper.prepend(e);b.params.loop&&b.createLoop(),b.params.observer&&b.support.observer||b.update(!0),b.slideTo(a,0,!1)},b.removeSlide=function(e){b.params.loop&&(b.destroyLoop(),b.slides=b.wrapper.children("."+b.params.slideClass));var a,t=b.activeIndex;if("object"==typeof e&&e.length){for(var r=0;r<e.length;r++)a=e[r],b.slides[a]&&b.slides.eq(a).remove(),t>a&&t--;t=Math.max(t,0)}else a=e,b.slides[a]&&b.slides.eq(a).remove(),t>a&&t--,t=Math.max(t,0);b.params.loop&&b.createLoop(),b.params.observer&&b.support.observer||b.update(!0),b.params.loop?b.slideTo(t+b.loopedSlides,0,!1):b.slideTo(t,0,!1)},b.removeAllSlides=function(){for(var e=[],a=0;a<b.slides.length;a++)e.push(a);b.removeSlide(e)},b.effects={fade:{setTranslate:function(){for(var e=0;e<b.slides.length;e++){var a=b.slides.eq(e),t=a[0].swiperSlideOffset,r=-t;b.params.virtualTranslate||(r-=b.translate);var i=0;b.isHorizontal()||(i=r,r=0);var s=b.params.fade.crossFade?Math.max(1-Math.abs(a[0].progress),0):1+Math.min(Math.max(a[0].progress,-1),0);a.css({opacity:s}).transform("translate3d("+r+"px, "+i+"px, 0px)")}},setTransition:function(e){if(b.slides.transition(e),b.params.virtualTranslate&&0!==e){var a=!1;b.slides.transitionEnd(function(){if(!a&&b){a=!0,b.animating=!1;for(var e=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],t=0;t<e.length;t++)b.wrapper.trigger(e[t])}})}}},flip:{setTranslate:function(){for(var e=0;e<b.slides.length;e++){var t=b.slides.eq(e),r=t[0].progress;b.params.flip.limitRotation&&(r=Math.max(Math.min(t[0].progress,1),-1));var i=t[0].swiperSlideOffset,s=-180*r,n=s,o=0,l=-i,p=0;if(b.isHorizontal()?b.rtl&&(n=-n):(p=l,l=0,o=-n,n=0),t[0].style.zIndex=-Math.abs(Math.round(r))+b.slides.length,b.params.flip.slideShadows){var d=b.isHorizontal()?t.find(".swiper-slide-shadow-left"):t.find(".swiper-slide-shadow-top"),u=b.isHorizontal()?t.find(".swiper-slide-shadow-right"):t.find(".swiper-slide-shadow-bottom");0===d.length&&(d=a('<div class="swiper-slide-shadow-'+(b.isHorizontal()?"left":"top")+'"></div>'),t.append(d)),0===u.length&&(u=a('<div class="swiper-slide-shadow-'+(b.isHorizontal()?"right":"bottom")+'"></div>'),t.append(u)),d.length&&(d[0].style.opacity=Math.max(-r,0)),u.length&&(u[0].style.opacity=Math.max(r,0))}t.transform("translate3d("+l+"px, "+p+"px, 0px) rotateX("+o+"deg) rotateY("+n+"deg)")}},setTransition:function(e){if(b.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),b.params.virtualTranslate&&0!==e){var t=!1;b.slides.eq(b.activeIndex).transitionEnd(function(){if(!t&&b&&a(this).hasClass(b.params.slideActiveClass)){t=!0,b.animating=!1;for(var e=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],r=0;r<e.length;r++)b.wrapper.trigger(e[r])}})}}},cube:{setTranslate:function(){var e,t=0;b.params.cube.shadow&&(b.isHorizontal()?(e=b.wrapper.find(".swiper-cube-shadow"),0===e.length&&(e=a('<div class="swiper-cube-shadow"></div>'),b.wrapper.append(e)),e.css({height:b.width+"px"})):(e=b.container.find(".swiper-cube-shadow"),0===e.length&&(e=a('<div class="swiper-cube-shadow"></div>'),b.container.append(e))));for(var r=0;r<b.slides.length;r++){var i=b.slides.eq(r),s=90*r,n=Math.floor(s/360);b.rtl&&(s=-s,n=Math.floor(-s/360));var o=Math.max(Math.min(i[0].progress,1),-1),l=0,p=0,d=0;r%4===0?(l=4*-n*b.size,d=0):(r-1)%4===0?(l=0,d=4*-n*b.size):(r-2)%4===0?(l=b.size+4*n*b.size,d=b.size):(r-3)%4===0&&(l=-b.size,d=3*b.size+4*b.size*n),b.rtl&&(l=-l),b.isHorizontal()||(p=l,l=0);var u="rotateX("+(b.isHorizontal()?0:-s)+"deg) rotateY("+(b.isHorizontal()?s:0)+"deg) translate3d("+l+"px, "+p+"px, "+d+"px)";if(1>=o&&o>-1&&(t=90*r+90*o,b.rtl&&(t=90*-r-90*o)),i.transform(u),b.params.cube.slideShadows){var c=b.isHorizontal()?i.find(".swiper-slide-shadow-left"):i.find(".swiper-slide-shadow-top"),m=b.isHorizontal()?i.find(".swiper-slide-shadow-right"):i.find(".swiper-slide-shadow-bottom");0===c.length&&(c=a('<div class="swiper-slide-shadow-'+(b.isHorizontal()?"left":"top")+'"></div>'),i.append(c)),0===m.length&&(m=a('<div class="swiper-slide-shadow-'+(b.isHorizontal()?"right":"bottom")+'"></div>'),i.append(m)),c.length&&(c[0].style.opacity=Math.max(-o,0)),m.length&&(m[0].style.opacity=Math.max(o,0))}}if(b.wrapper.css({"-webkit-transform-origin":"50% 50% -"+b.size/2+"px","-moz-transform-origin":"50% 50% -"+b.size/2+"px","-ms-transform-origin":"50% 50% -"+b.size/2+"px","transform-origin":"50% 50% -"+b.size/2+"px"}),b.params.cube.shadow)if(b.isHorizontal())e.transform("translate3d(0px, "+(b.width/2+b.params.cube.shadowOffset)+"px, "+-b.width/2+"px) rotateX(90deg) rotateZ(0deg) scale("+b.params.cube.shadowScale+")");else{var h=Math.abs(t)-90*Math.floor(Math.abs(t)/90),f=1.5-(Math.sin(2*h*Math.PI/360)/2+Math.cos(2*h*Math.PI/360)/2),g=b.params.cube.shadowScale,v=b.params.cube.shadowScale/f,w=b.params.cube.shadowOffset;e.transform("scale3d("+g+", 1, "+v+") translate3d(0px, "+(b.height/2+w)+"px, "+-b.height/2/v+"px) rotateX(-90deg)")}var y=b.isSafari||b.isUiWebView?-b.size/2:0;b.wrapper.transform("translate3d(0px,0,"+y+"px) rotateX("+(b.isHorizontal()?0:t)+"deg) rotateY("+(b.isHorizontal()?-t:0)+"deg)")},setTransition:function(e){b.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),b.params.cube.shadow&&!b.isHorizontal()&&b.container.find(".swiper-cube-shadow").transition(e)}},coverflow:{setTranslate:function(){for(var e=b.translate,t=b.isHorizontal()?-e+b.width/2:-e+b.height/2,r=b.isHorizontal()?b.params.coverflow.rotate:-b.params.coverflow.rotate,i=b.params.coverflow.depth,s=0,n=b.slides.length;n>s;s++){var o=b.slides.eq(s),l=b.slidesSizesGrid[s],p=o[0].swiperSlideOffset,d=(t-p-l/2)/l*b.params.coverflow.modifier,u=b.isHorizontal()?r*d:0,c=b.isHorizontal()?0:r*d,m=-i*Math.abs(d),h=b.isHorizontal()?0:b.params.coverflow.stretch*d,f=b.isHorizontal()?b.params.coverflow.stretch*d:0;Math.abs(f)<.001&&(f=0),Math.abs(h)<.001&&(h=0),Math.abs(m)<.001&&(m=0),Math.abs(u)<.001&&(u=0),Math.abs(c)<.001&&(c=0);var g="translate3d("+f+"px,"+h+"px,"+m+"px)  rotateX("+c+"deg) rotateY("+u+"deg)";if(o.transform(g),o[0].style.zIndex=-Math.abs(Math.round(d))+1,b.params.coverflow.slideShadows){var v=b.isHorizontal()?o.find(".swiper-slide-shadow-left"):o.find(".swiper-slide-shadow-top"),w=b.isHorizontal()?o.find(".swiper-slide-shadow-right"):o.find(".swiper-slide-shadow-bottom");0===v.length&&(v=a('<div class="swiper-slide-shadow-'+(b.isHorizontal()?"left":"top")+'"></div>'),o.append(v)),0===w.length&&(w=a('<div class="swiper-slide-shadow-'+(b.isHorizontal()?"right":"bottom")+'"></div>'),o.append(w)),v.length&&(v[0].style.opacity=d>0?d:0),w.length&&(w[0].style.opacity=-d>0?-d:0)}}if(b.browser.ie){var y=b.wrapper[0].style;y.perspectiveOrigin=t+"px 50%"}},setTransition:function(e){b.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)}}},b.lazy={initialImageLoaded:!1,loadImageInSlide:function(e,t){if("undefined"!=typeof e&&("undefined"==typeof t&&(t=!0),0!==b.slides.length)){var r=b.slides.eq(e),i=r.find(".swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)");!r.hasClass("swiper-lazy")||r.hasClass("swiper-lazy-loaded")||r.hasClass("swiper-lazy-loading")||(i=i.add(r[0])),0!==i.length&&i.each(function(){var e=a(this);e.addClass("swiper-lazy-loading");var i=e.attr("data-background"),s=e.attr("data-src"),n=e.attr("data-srcset");b.loadImage(e[0],s||i,n,!1,function(){if(i?(e.css("background-image",'url("'+i+'")'),e.removeAttr("data-background")):(n&&(e.attr("srcset",n),e.removeAttr("data-srcset")),s&&(e.attr("src",s),e.removeAttr("data-src"))),e.addClass("swiper-lazy-loaded").removeClass("swiper-lazy-loading"),r.find(".swiper-lazy-preloader, .preloader").remove(),b.params.loop&&t){var a=r.attr("data-swiper-slide-index");if(r.hasClass(b.params.slideDuplicateClass)){var o=b.wrapper.children('[data-swiper-slide-index="'+a+'"]:not(.'+b.params.slideDuplicateClass+")");b.lazy.loadImageInSlide(o.index(),!1)}else{var l=b.wrapper.children("."+b.params.slideDuplicateClass+'[data-swiper-slide-index="'+a+'"]');b.lazy.loadImageInSlide(l.index(),!1)}}b.emit("onLazyImageReady",b,r[0],e[0])}),b.emit("onLazyImageLoad",b,r[0],e[0])})}},load:function(){var e;if(b.params.watchSlidesVisibility)b.wrapper.children("."+b.params.slideVisibleClass).each(function(){b.lazy.loadImageInSlide(a(this).index())});else if(b.params.slidesPerView>1)for(e=b.activeIndex;e<b.activeIndex+b.params.slidesPerView;e++)b.slides[e]&&b.lazy.loadImageInSlide(e);else b.lazy.loadImageInSlide(b.activeIndex);if(b.params.lazyLoadingInPrevNext)if(b.params.slidesPerView>1||b.params.lazyLoadingInPrevNextAmount&&b.params.lazyLoadingInPrevNextAmount>1){var t=b.params.lazyLoadingInPrevNextAmount,r=b.params.slidesPerView,i=Math.min(b.activeIndex+r+Math.max(t,r),b.slides.length),s=Math.max(b.activeIndex-Math.max(r,t),0);for(e=b.activeIndex+b.params.slidesPerView;i>e;e++)b.slides[e]&&b.lazy.loadImageInSlide(e);for(e=s;e<b.activeIndex;e++)b.slides[e]&&b.lazy.loadImageInSlide(e)}else{var n=b.wrapper.children("."+b.params.slideNextClass);n.length>0&&b.lazy.loadImageInSlide(n.index());var o=b.wrapper.children("."+b.params.slidePrevClass);o.length>0&&b.lazy.loadImageInSlide(o.index())}},onTransitionStart:function(){b.params.lazyLoading&&(b.params.lazyLoadingOnTransitionStart||!b.params.lazyLoadingOnTransitionStart&&!b.lazy.initialImageLoaded)&&b.lazy.load()},onTransitionEnd:function(){b.params.lazyLoading&&!b.params.lazyLoadingOnTransitionStart&&b.lazy.load()}},b.scrollbar={isTouched:!1,setDragPosition:function(e){var a=b.scrollbar,t=b.isHorizontal()?"touchstart"===e.type||"touchmove"===e.type?e.targetTouches[0].pageX:e.pageX||e.clientX:"touchstart"===e.type||"touchmove"===e.type?e.targetTouches[0].pageY:e.pageY||e.clientY,r=t-a.track.offset()[b.isHorizontal()?"left":"top"]-a.dragSize/2,i=-b.minTranslate()*a.moveDivider,s=-b.maxTranslate()*a.moveDivider;i>r?r=i:r>s&&(r=s),r=-r/a.moveDivider,b.updateProgress(r),b.setWrapperTranslate(r,!0)},dragStart:function(e){var a=b.scrollbar;a.isTouched=!0,e.preventDefault(),e.stopPropagation(),a.setDragPosition(e),clearTimeout(a.dragTimeout),a.track.transition(0),b.params.scrollbarHide&&a.track.css("opacity",1),b.wrapper.transition(100),a.drag.transition(100),b.emit("onScrollbarDragStart",b)},dragMove:function(e){var a=b.scrollbar;a.isTouched&&(e.preventDefault?e.preventDefault():e.returnValue=!1,a.setDragPosition(e),b.wrapper.transition(0),a.track.transition(0),a.drag.transition(0),b.emit("onScrollbarDragMove",b))},dragEnd:function(e){var a=b.scrollbar;a.isTouched&&(a.isTouched=!1,b.params.scrollbarHide&&(clearTimeout(a.dragTimeout),a.dragTimeout=setTimeout(function(){a.track.css("opacity",0),a.track.transition(400)},1e3)),b.emit("onScrollbarDragEnd",b),b.params.scrollbarSnapOnRelease&&b.slideReset())},enableDraggable:function(){var e=b.scrollbar,t=b.support.touch?e.track:document;a(e.track).on(b.touchEvents.start,e.dragStart),a(t).on(b.touchEvents.move,e.dragMove),a(t).on(b.touchEvents.end,e.dragEnd)},disableDraggable:function(){var e=b.scrollbar,t=b.support.touch?e.track:document;a(e.track).off(b.touchEvents.start,e.dragStart),a(t).off(b.touchEvents.move,e.dragMove),a(t).off(b.touchEvents.end,e.dragEnd)},set:function(){if(b.params.scrollbar){var e=b.scrollbar;e.track=a(b.params.scrollbar),b.params.uniqueNavElements&&"string"==typeof b.params.scrollbar&&e.track.length>1&&1===b.container.find(b.params.scrollbar).length&&(e.track=b.container.find(b.params.scrollbar)),e.drag=e.track.find(".swiper-scrollbar-drag"),0===e.drag.length&&(e.drag=a('<div class="swiper-scrollbar-drag"></div>'),e.track.append(e.drag)),e.drag[0].style.width="",e.drag[0].style.height="",e.trackSize=b.isHorizontal()?e.track[0].offsetWidth:e.track[0].offsetHeight,e.divider=b.size/b.virtualSize,e.moveDivider=e.divider*(e.trackSize/b.size),e.dragSize=e.trackSize*e.divider,b.isHorizontal()?e.drag[0].style.width=e.dragSize+"px":e.drag[0].style.height=e.dragSize+"px",e.divider>=1?e.track[0].style.display="none":e.track[0].style.display="",b.params.scrollbarHide&&(e.track[0].style.opacity=0)}},setTranslate:function(){if(b.params.scrollbar){var e,a=b.scrollbar,t=(b.translate||0,a.dragSize);e=(a.trackSize-a.dragSize)*b.progress,b.rtl&&b.isHorizontal()?(e=-e,e>0?(t=a.dragSize-e,e=0):-e+a.dragSize>a.trackSize&&(t=a.trackSize+e)):0>e?(t=a.dragSize+e,e=0):e+a.dragSize>a.trackSize&&(t=a.trackSize-e),b.isHorizontal()?(b.support.transforms3d?a.drag.transform("translate3d("+e+"px, 0, 0)"):a.drag.transform("translateX("+e+"px)"),a.drag[0].style.width=t+"px"):(b.support.transforms3d?a.drag.transform("translate3d(0px, "+e+"px, 0)"):a.drag.transform("translateY("+e+"px)"),a.drag[0].style.height=t+"px"),b.params.scrollbarHide&&(clearTimeout(a.timeout),a.track[0].style.opacity=1,a.timeout=setTimeout(function(){a.track[0].style.opacity=0,a.track.transition(400)},1e3))}},setTransition:function(e){b.params.scrollbar&&b.scrollbar.drag.transition(e)}},b.controller={LinearSpline:function(e,a){this.x=e,this.y=a,this.lastIndex=e.length-1;var t,r;this.x.length;this.interpolate=function(e){return e?(r=i(this.x,e),t=r-1,(e-this.x[t])*(this.y[r]-this.y[t])/(this.x[r]-this.x[t])+this.y[t]):0};var i=function(){var e,a,t;return function(r,i){for(a=-1,e=r.length;e-a>1;)r[t=e+a>>1]<=i?a=t:e=t;return e}}()},getInterpolateFunction:function(e){b.controller.spline||(b.controller.spline=b.params.loop?new b.controller.LinearSpline(b.slidesGrid,e.slidesGrid):new b.controller.LinearSpline(b.snapGrid,e.snapGrid))},setTranslate:function(e,a){function r(a){e=a.rtl&&"horizontal"===a.params.direction?-b.translate:b.translate,"slide"===b.params.controlBy&&(b.controller.getInterpolateFunction(a),s=-b.controller.spline.interpolate(-e)),s&&"container"!==b.params.controlBy||(i=(a.maxTranslate()-a.minTranslate())/(b.maxTranslate()-b.minTranslate()),s=(e-b.minTranslate())*i+a.minTranslate()),b.params.controlInverse&&(s=a.maxTranslate()-s),a.updateProgress(s),a.setWrapperTranslate(s,!1,b),a.updateActiveIndex()}var i,s,n=b.params.control;if(b.isArray(n))for(var o=0;o<n.length;o++)n[o]!==a&&n[o]instanceof t&&r(n[o]);else n instanceof t&&a!==n&&r(n)},setTransition:function(e,a){function r(a){a.setWrapperTransition(e,b),0!==e&&(a.onTransitionStart(),a.wrapper.transitionEnd(function(){s&&(a.params.loop&&"slide"===b.params.controlBy&&a.fixLoop(),a.onTransitionEnd())}))}var i,s=b.params.control;if(b.isArray(s))for(i=0;i<s.length;i++)s[i]!==a&&s[i]instanceof t&&r(s[i]);else s instanceof t&&a!==s&&r(s)}},b.hashnav={init:function(){if(b.params.hashnav){b.hashnav.initialized=!0;var e=document.location.hash.replace("#","");if(e)for(var a=0,t=0,r=b.slides.length;r>t;t++){var i=b.slides.eq(t),s=i.attr("data-hash");if(s===e&&!i.hasClass(b.params.slideDuplicateClass)){var n=i.index();b.slideTo(n,a,b.params.runCallbacksOnInit,!0)}}}},setHash:function(){b.hashnav.initialized&&b.params.hashnav&&(document.location.hash=b.slides.eq(b.activeIndex).attr("data-hash")||"")}},b.disableKeyboardControl=function(){b.params.keyboardControl=!1,a(document).off("keydown",p)},b.enableKeyboardControl=function(){b.params.keyboardControl=!0,a(document).on("keydown",p)},b.mousewheel={event:!1,lastScrollTime:(new window.Date).getTime()},b.params.mousewheelControl){try{new window.WheelEvent("wheel"),b.mousewheel.event="wheel"}catch(N){(window.WheelEvent||b.container[0]&&"wheel"in b.container[0])&&(b.mousewheel.event="wheel")}!b.mousewheel.event&&window.WheelEvent,b.mousewheel.event||void 0===document.onmousewheel||(b.mousewheel.event="mousewheel"),b.mousewheel.event||(b.mousewheel.event="DOMMouseScroll")}b.disableMousewheelControl=function(){return b.mousewheel.event?(b.container.off(b.mousewheel.event,d),!0):!1},b.enableMousewheelControl=function(){return b.mousewheel.event?(b.container.on(b.mousewheel.event,d),!0):!1},b.parallax={setTranslate:function(){b.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){u(this,b.progress)}),b.slides.each(function(){var e=a(this);e.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){var a=Math.min(Math.max(e[0].progress,-1),1);u(this,a)})})},setTransition:function(e){"undefined"==typeof e&&(e=b.params.speed),b.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(){var t=a(this),r=parseInt(t.attr("data-swiper-parallax-duration"),10)||e;0===e&&(r=0),t.transition(r)})}},b._plugins=[];for(var R in b.plugins){var W=b.plugins[R](b,b.params[R]);W&&b._plugins.push(W)}return b.callPlugins=function(e){for(var a=0;a<b._plugins.length;a++)e in b._plugins[a]&&b._plugins[a][e](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},b.emitterEventListeners={},b.emit=function(e){b.params[e]&&b.params[e](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);var a;if(b.emitterEventListeners[e])for(a=0;a<b.emitterEventListeners[e].length;a++)b.emitterEventListeners[e][a](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);b.callPlugins&&b.callPlugins(e,arguments[1],arguments[2],arguments[3],arguments[4],arguments[5])},b.on=function(e,a){return e=c(e),b.emitterEventListeners[e]||(b.emitterEventListeners[e]=[]),b.emitterEventListeners[e].push(a),b},b.off=function(e,a){var t;if(e=c(e),"undefined"==typeof a)return b.emitterEventListeners[e]=[],b;if(b.emitterEventListeners[e]&&0!==b.emitterEventListeners[e].length){for(t=0;t<b.emitterEventListeners[e].length;t++)b.emitterEventListeners[e][t]===a&&b.emitterEventListeners[e].splice(t,1);return b}},b.once=function(e,a){e=c(e);var t=function(){a(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]),b.off(e,t)};return b.on(e,t),b},b.a11y={makeFocusable:function(e){return e.attr("tabIndex","0"),e},addRole:function(e,a){return e.attr("role",a),e},addLabel:function(e,a){return e.attr("aria-label",a),e},disable:function(e){return e.attr("aria-disabled",!0),e},enable:function(e){return e.attr("aria-disabled",!1),e},onEnterKey:function(e){13===e.keyCode&&(a(e.target).is(b.params.nextButton)?(b.onClickNext(e),b.isEnd?b.a11y.notify(b.params.lastSlideMessage):b.a11y.notify(b.params.nextSlideMessage)):a(e.target).is(b.params.prevButton)&&(b.onClickPrev(e),b.isBeginning?b.a11y.notify(b.params.firstSlideMessage):b.a11y.notify(b.params.prevSlideMessage)),a(e.target).is("."+b.params.bulletClass)&&a(e.target)[0].click())},liveRegion:a('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),notify:function(e){var a=b.a11y.liveRegion;0!==a.length&&(a.html(""),a.html(e))},init:function(){b.params.nextButton&&b.nextButton&&b.nextButton.length>0&&(b.a11y.makeFocusable(b.nextButton),b.a11y.addRole(b.nextButton,"button"),b.a11y.addLabel(b.nextButton,b.params.nextSlideMessage)),b.params.prevButton&&b.prevButton&&b.prevButton.length>0&&(b.a11y.makeFocusable(b.prevButton),b.a11y.addRole(b.prevButton,"button"),b.a11y.addLabel(b.prevButton,b.params.prevSlideMessage)),a(b.container).append(b.a11y.liveRegion)},initPagination:function(){b.params.pagination&&b.params.paginationClickable&&b.bullets&&b.bullets.length&&b.bullets.each(function(){var e=a(this);b.a11y.makeFocusable(e),b.a11y.addRole(e,"button"),b.a11y.addLabel(e,b.params.paginationBulletMessage.replace(/{{index}}/,e.index()+1))})},destroy:function(){b.a11y.liveRegion&&b.a11y.liveRegion.length>0&&b.a11y.liveRegion.remove()}},b.init=function(){b.params.loop&&b.createLoop(),b.updateContainerSize(),b.updateSlidesSize(),b.updatePagination(),b.params.scrollbar&&b.scrollbar&&(b.scrollbar.set(),b.params.scrollbarDraggable&&b.scrollbar.enableDraggable()),"slide"!==b.params.effect&&b.effects[b.params.effect]&&(b.params.loop||b.updateProgress(),b.effects[b.params.effect].setTranslate()),b.params.loop?b.slideTo(b.params.initialSlide+b.loopedSlides,0,b.params.runCallbacksOnInit):(b.slideTo(b.params.initialSlide,0,b.params.runCallbacksOnInit),0===b.params.initialSlide&&(b.parallax&&b.params.parallax&&b.parallax.setTranslate(),b.lazy&&b.params.lazyLoading&&(b.lazy.load(),b.lazy.initialImageLoaded=!0))),b.attachEvents(),b.params.observer&&b.support.observer&&b.initObservers(),b.params.preloadImages&&!b.params.lazyLoading&&b.preloadImages(),b.params.autoplay&&b.startAutoplay(),b.params.keyboardControl&&b.enableKeyboardControl&&b.enableKeyboardControl(),b.params.mousewheelControl&&b.enableMousewheelControl&&b.enableMousewheelControl(),
b.params.hashnav&&b.hashnav&&b.hashnav.init(),b.params.a11y&&b.a11y&&b.a11y.init(),b.emit("onInit",b)},b.cleanupStyles=function(){b.container.removeClass(b.classNames.join(" ")).removeAttr("style"),b.wrapper.removeAttr("style"),b.slides&&b.slides.length&&b.slides.removeClass([b.params.slideVisibleClass,b.params.slideActiveClass,b.params.slideNextClass,b.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"),b.paginationContainer&&b.paginationContainer.length&&b.paginationContainer.removeClass(b.params.paginationHiddenClass),b.bullets&&b.bullets.length&&b.bullets.removeClass(b.params.bulletActiveClass),b.params.prevButton&&a(b.params.prevButton).removeClass(b.params.buttonDisabledClass),b.params.nextButton&&a(b.params.nextButton).removeClass(b.params.buttonDisabledClass),b.params.scrollbar&&b.scrollbar&&(b.scrollbar.track&&b.scrollbar.track.length&&b.scrollbar.track.removeAttr("style"),b.scrollbar.drag&&b.scrollbar.drag.length&&b.scrollbar.drag.removeAttr("style"))},b.destroy=function(e,a){b.detachEvents(),b.stopAutoplay(),b.params.scrollbar&&b.scrollbar&&b.params.scrollbarDraggable&&b.scrollbar.disableDraggable(),b.params.loop&&b.destroyLoop(),a&&b.cleanupStyles(),b.disconnectObservers(),b.params.keyboardControl&&b.disableKeyboardControl&&b.disableKeyboardControl(),b.params.mousewheelControl&&b.disableMousewheelControl&&b.disableMousewheelControl(),b.params.a11y&&b.a11y&&b.a11y.destroy(),b.emit("onDestroy"),e!==!1&&(b=null)},b.init(),b}};t.prototype={isSafari:function(){var e=navigator.userAgent.toLowerCase();return e.indexOf("safari")>=0&&e.indexOf("chrome")<0&&e.indexOf("android")<0}(),isUiWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),isArray:function(e){return"[object Array]"===Object.prototype.toString.apply(e)},browser:{ie:window.navigator.pointerEnabled||window.navigator.msPointerEnabled,ieTouch:window.navigator.msPointerEnabled&&window.navigator.msMaxTouchPoints>1||window.navigator.pointerEnabled&&window.navigator.maxTouchPoints>1},device:function(){var e=navigator.userAgent,a=e.match(/(Android);?[\s\/]+([\d.]+)?/),t=e.match(/(iPad).*OS\s([\d_]+)/),r=e.match(/(iPod)(.*OS\s([\d_]+))?/),i=!t&&e.match(/(iPhone\sOS)\s([\d_]+)/);return{ios:t||i||r,android:a}}(),support:{touch:window.Modernizr&&Modernizr.touch===!0||function(){return!!("ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch)}(),transforms3d:window.Modernizr&&Modernizr.csstransforms3d===!0||function(){var e=document.createElement("div").style;return"webkitPerspective"in e||"MozPerspective"in e||"OPerspective"in e||"MsPerspective"in e||"perspective"in e}(),flexbox:function(){for(var e=document.createElement("div").style,a="alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "),t=0;t<a.length;t++)if(a[t]in e)return!0}(),observer:function(){return"MutationObserver"in window||"WebkitMutationObserver"in window}()},plugins:{}};for(var r=(function(){var e=function(e){var a=this,t=0;for(t=0;t<e.length;t++)a[t]=e[t];return a.length=e.length,this},a=function(a,t){var r=[],i=0;if(a&&!t&&a instanceof e)return a;if(a)if("string"==typeof a){var s,n,o=a.trim();if(o.indexOf("<")>=0&&o.indexOf(">")>=0){var l="div";for(0===o.indexOf("<li")&&(l="ul"),0===o.indexOf("<tr")&&(l="tbody"),(0===o.indexOf("<td")||0===o.indexOf("<th"))&&(l="tr"),0===o.indexOf("<tbody")&&(l="table"),0===o.indexOf("<option")&&(l="select"),n=document.createElement(l),n.innerHTML=a,i=0;i<n.childNodes.length;i++)r.push(n.childNodes[i])}else for(s=t||"#"!==a[0]||a.match(/[ .<>:~]/)?(t||document).querySelectorAll(a):[document.getElementById(a.split("#")[1])],i=0;i<s.length;i++)s[i]&&r.push(s[i])}else if(a.nodeType||a===window||a===document)r.push(a);else if(a.length>0&&a[0].nodeType)for(i=0;i<a.length;i++)r.push(a[i]);return new e(r)};return e.prototype={addClass:function(e){if("undefined"==typeof e)return this;for(var a=e.split(" "),t=0;t<a.length;t++)for(var r=0;r<this.length;r++)this[r].classList.add(a[t]);return this},removeClass:function(e){for(var a=e.split(" "),t=0;t<a.length;t++)for(var r=0;r<this.length;r++)this[r].classList.remove(a[t]);return this},hasClass:function(e){return this[0]?this[0].classList.contains(e):!1},toggleClass:function(e){for(var a=e.split(" "),t=0;t<a.length;t++)for(var r=0;r<this.length;r++)this[r].classList.toggle(a[t]);return this},attr:function(e,a){if(1===arguments.length&&"string"==typeof e)return this[0]?this[0].getAttribute(e):void 0;for(var t=0;t<this.length;t++)if(2===arguments.length)this[t].setAttribute(e,a);else for(var r in e)this[t][r]=e[r],this[t].setAttribute(r,e[r]);return this},removeAttr:function(e){for(var a=0;a<this.length;a++)this[a].removeAttribute(e);return this},data:function(e,a){if("undefined"!=typeof a){for(var t=0;t<this.length;t++){var r=this[t];r.dom7ElementDataStorage||(r.dom7ElementDataStorage={}),r.dom7ElementDataStorage[e]=a}return this}if(this[0]){var i=this[0].getAttribute("data-"+e);return i?i:this[0].dom7ElementDataStorage&&e in this[0].dom7ElementDataStorage?this[0].dom7ElementDataStorage[e]:void 0}},transform:function(e){for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransform=t.MsTransform=t.msTransform=t.MozTransform=t.OTransform=t.transform=e}return this},transition:function(e){"string"!=typeof e&&(e+="ms");for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransitionDuration=t.MsTransitionDuration=t.msTransitionDuration=t.MozTransitionDuration=t.OTransitionDuration=t.transitionDuration=e}return this},on:function(e,t,r,i){function s(e){var i=e.target;if(a(i).is(t))r.call(i,e);else for(var s=a(i).parents(),n=0;n<s.length;n++)a(s[n]).is(t)&&r.call(s[n],e)}var n,o,l=e.split(" ");for(n=0;n<this.length;n++)if("function"==typeof t||t===!1)for("function"==typeof t&&(r=arguments[1],i=arguments[2]||!1),o=0;o<l.length;o++)this[n].addEventListener(l[o],r,i);else for(o=0;o<l.length;o++)this[n].dom7LiveListeners||(this[n].dom7LiveListeners=[]),this[n].dom7LiveListeners.push({listener:r,liveListener:s}),this[n].addEventListener(l[o],s,i);return this},off:function(e,a,t,r){for(var i=e.split(" "),s=0;s<i.length;s++)for(var n=0;n<this.length;n++)if("function"==typeof a||a===!1)"function"==typeof a&&(t=arguments[1],r=arguments[2]||!1),this[n].removeEventListener(i[s],t,r);else if(this[n].dom7LiveListeners)for(var o=0;o<this[n].dom7LiveListeners.length;o++)this[n].dom7LiveListeners[o].listener===t&&this[n].removeEventListener(i[s],this[n].dom7LiveListeners[o].liveListener,r);return this},once:function(e,a,t,r){function i(n){t(n),s.off(e,a,i,r)}var s=this;"function"==typeof a&&(a=!1,t=arguments[1],r=arguments[2]),s.on(e,a,i,r)},trigger:function(e,a){for(var t=0;t<this.length;t++){var r;try{r=new window.CustomEvent(e,{detail:a,bubbles:!0,cancelable:!0})}catch(i){r=document.createEvent("Event"),r.initEvent(e,!0,!0),r.detail=a}this[t].dispatchEvent(r)}return this},transitionEnd:function(e){function a(s){if(s.target===this)for(e.call(this,s),t=0;t<r.length;t++)i.off(r[t],a)}var t,r=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],i=this;if(e)for(t=0;t<r.length;t++)i.on(r[t],a);return this},width:function(){return this[0]===window?window.innerWidth:this.length>0?parseFloat(this.css("width")):null},outerWidth:function(e){return this.length>0?e?this[0].offsetWidth+parseFloat(this.css("margin-right"))+parseFloat(this.css("margin-left")):this[0].offsetWidth:null},height:function(){return this[0]===window?window.innerHeight:this.length>0?parseFloat(this.css("height")):null},outerHeight:function(e){return this.length>0?e?this[0].offsetHeight+parseFloat(this.css("margin-top"))+parseFloat(this.css("margin-bottom")):this[0].offsetHeight:null},offset:function(){if(this.length>0){var e=this[0],a=e.getBoundingClientRect(),t=document.body,r=e.clientTop||t.clientTop||0,i=e.clientLeft||t.clientLeft||0,s=window.pageYOffset||e.scrollTop,n=window.pageXOffset||e.scrollLeft;return{top:a.top+s-r,left:a.left+n-i}}return null},css:function(e,a){var t;if(1===arguments.length){if("string"!=typeof e){for(t=0;t<this.length;t++)for(var r in e)this[t].style[r]=e[r];return this}if(this[0])return window.getComputedStyle(this[0],null).getPropertyValue(e)}if(2===arguments.length&&"string"==typeof e){for(t=0;t<this.length;t++)this[t].style[e]=a;return this}return this},each:function(e){for(var a=0;a<this.length;a++)e.call(this[a],a,this[a]);return this},html:function(e){if("undefined"==typeof e)return this[0]?this[0].innerHTML:void 0;for(var a=0;a<this.length;a++)this[a].innerHTML=e;return this},text:function(e){if("undefined"==typeof e)return this[0]?this[0].textContent.trim():null;for(var a=0;a<this.length;a++)this[a].textContent=e;return this},is:function(t){if(!this[0])return!1;var r,i;if("string"==typeof t){var s=this[0];if(s===document)return t===document;if(s===window)return t===window;if(s.matches)return s.matches(t);if(s.webkitMatchesSelector)return s.webkitMatchesSelector(t);if(s.mozMatchesSelector)return s.mozMatchesSelector(t);if(s.msMatchesSelector)return s.msMatchesSelector(t);for(r=a(t),i=0;i<r.length;i++)if(r[i]===this[0])return!0;return!1}if(t===document)return this[0]===document;if(t===window)return this[0]===window;if(t.nodeType||t instanceof e){for(r=t.nodeType?[t]:t,i=0;i<r.length;i++)if(r[i]===this[0])return!0;return!1}return!1},index:function(){if(this[0]){for(var e=this[0],a=0;null!==(e=e.previousSibling);)1===e.nodeType&&a++;return a}},eq:function(a){if("undefined"==typeof a)return this;var t,r=this.length;return a>r-1?new e([]):0>a?(t=r+a,new e(0>t?[]:[this[t]])):new e([this[a]])},append:function(a){var t,r;for(t=0;t<this.length;t++)if("string"==typeof a){var i=document.createElement("div");for(i.innerHTML=a;i.firstChild;)this[t].appendChild(i.firstChild)}else if(a instanceof e)for(r=0;r<a.length;r++)this[t].appendChild(a[r]);else this[t].appendChild(a);return this},prepend:function(a){var t,r;for(t=0;t<this.length;t++)if("string"==typeof a){var i=document.createElement("div");for(i.innerHTML=a,r=i.childNodes.length-1;r>=0;r--)this[t].insertBefore(i.childNodes[r],this[t].childNodes[0])}else if(a instanceof e)for(r=0;r<a.length;r++)this[t].insertBefore(a[r],this[t].childNodes[0]);else this[t].insertBefore(a,this[t].childNodes[0]);return this},insertBefore:function(e){for(var t=a(e),r=0;r<this.length;r++)if(1===t.length)t[0].parentNode.insertBefore(this[r],t[0]);else if(t.length>1)for(var i=0;i<t.length;i++)t[i].parentNode.insertBefore(this[r].cloneNode(!0),t[i])},insertAfter:function(e){for(var t=a(e),r=0;r<this.length;r++)if(1===t.length)t[0].parentNode.insertBefore(this[r],t[0].nextSibling);else if(t.length>1)for(var i=0;i<t.length;i++)t[i].parentNode.insertBefore(this[r].cloneNode(!0),t[i].nextSibling)},next:function(t){return new e(this.length>0?t?this[0].nextElementSibling&&a(this[0].nextElementSibling).is(t)?[this[0].nextElementSibling]:[]:this[0].nextElementSibling?[this[0].nextElementSibling]:[]:[])},nextAll:function(t){var r=[],i=this[0];if(!i)return new e([]);for(;i.nextElementSibling;){var s=i.nextElementSibling;t?a(s).is(t)&&r.push(s):r.push(s),i=s}return new e(r)},prev:function(t){return new e(this.length>0?t?this[0].previousElementSibling&&a(this[0].previousElementSibling).is(t)?[this[0].previousElementSibling]:[]:this[0].previousElementSibling?[this[0].previousElementSibling]:[]:[])},prevAll:function(t){var r=[],i=this[0];if(!i)return new e([]);for(;i.previousElementSibling;){var s=i.previousElementSibling;t?a(s).is(t)&&r.push(s):r.push(s),i=s}return new e(r)},parent:function(e){for(var t=[],r=0;r<this.length;r++)e?a(this[r].parentNode).is(e)&&t.push(this[r].parentNode):t.push(this[r].parentNode);return a(a.unique(t))},parents:function(e){for(var t=[],r=0;r<this.length;r++)for(var i=this[r].parentNode;i;)e?a(i).is(e)&&t.push(i):t.push(i),i=i.parentNode;return a(a.unique(t))},find:function(a){for(var t=[],r=0;r<this.length;r++)for(var i=this[r].querySelectorAll(a),s=0;s<i.length;s++)t.push(i[s]);return new e(t)},children:function(t){for(var r=[],i=0;i<this.length;i++)for(var s=this[i].childNodes,n=0;n<s.length;n++)t?1===s[n].nodeType&&a(s[n]).is(t)&&r.push(s[n]):1===s[n].nodeType&&r.push(s[n]);return new e(a.unique(r))},remove:function(){for(var e=0;e<this.length;e++)this[e].parentNode&&this[e].parentNode.removeChild(this[e]);return this},add:function(){var e,t,r=this;for(e=0;e<arguments.length;e++){var i=a(arguments[e]);for(t=0;t<i.length;t++)r[r.length]=i[t],r.length++}return r}},a.fn=e.prototype,a.unique=function(e){for(var a=[],t=0;t<e.length;t++)-1===a.indexOf(e[t])&&a.push(e[t]);return a},a}()),i=["jQuery","Zepto","Dom7"],s=0;s<i.length;s++)window[i[s]]&&e(window[i[s]]);var n;n="undefined"==typeof r?window.Dom7||window.Zepto||window.jQuery:r,n&&("transitionEnd"in n.fn||(n.fn.transitionEnd=function(e){function a(s){if(s.target===this)for(e.call(this,s),t=0;t<r.length;t++)i.off(r[t],a)}var t,r=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],i=this;if(e)for(t=0;t<r.length;t++)i.on(r[t],a);return this}),"transform"in n.fn||(n.fn.transform=function(e){for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransform=t.MsTransform=t.msTransform=t.MozTransform=t.OTransform=t.transform=e}return this}),"transition"in n.fn||(n.fn.transition=function(e){"string"!=typeof e&&(e+="ms");for(var a=0;a<this.length;a++){var t=this[a].style;t.webkitTransitionDuration=t.MsTransitionDuration=t.msTransitionDuration=t.MozTransitionDuration=t.OTransitionDuration=t.transitionDuration=e}return this})),window.Swiper=t}(),"undefined"!=typeof module?module.exports=window.Swiper:"function"==typeof define&&define.amd&&define([],function(){"use strict";return window.Swiper});
//# sourceMappingURL=maps/swiper.min.js.map
