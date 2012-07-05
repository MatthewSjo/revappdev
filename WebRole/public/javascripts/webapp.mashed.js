/* Zepto v1.0rc1 - polyfill zepto event detect fx ajax form touch - zeptojs.com/license */
; (function (undefined) {
    if (String.prototype.trim === undefined) // fix for iOS 3.2
        String.prototype.trim = function () { return this.replace(/^\s+/, '').replace(/\s+$/, '') }

    // For iOS 3.x
    // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
    if (Array.prototype.reduce === undefined)
        Array.prototype.reduce = function (fun) {
            if (this === void 0 || this === null) throw new TypeError()
            var t = Object(this), len = t.length >>> 0, k = 0, accumulator
            if (typeof fun != 'function') throw new TypeError()
            if (len == 0 && arguments.length == 1) throw new TypeError()

            if (arguments.length >= 2)
                accumulator = arguments[1]
            else
                do {
                    if (k in t) {
                        accumulator = t[k++]
                        break
                    }
                    if (++k >= len) throw new TypeError()
                } while (true)

                while (k < len) {
                    if (k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t)
                    k++
                }
                return accumulator
            }

})()
var Zepto = (function () {
    var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice,
    document = window.document,
    elementDisplay = {}, classCache = {},
    getComputedStyle = document.defaultView.getComputedStyle,
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1, 'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,

    // Used by `$.zepto.init` to wrap elements, text/comment nodes, document,
    // and document fragment node types.
    elementTypes = [1, 3, 8, 9, 11],

    adjacencyOperators = ['after', 'prepend', 'before', 'append'],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
        'tr': document.createElement('tbody'),
        'tbody': table, 'thead': table, 'tfoot': table,
        'td': tableRow, 'th': tableRow,
        '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    classSelectorRE = /^\.([\w-]+)$/,
    idSelectorRE = /^#([\w-]+)$/,
    tagSelectorRE = /^[\w-]+$/,
    toString = ({}).toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div')

    zepto.matches = function (element, selector) {
        if (!element || element.nodeType !== 1) return false
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
        if (matchesSelector) return matchesSelector.call(element, selector)
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent
        if (temp) (parent = tempParent).appendChild(element)
        match = ~zepto.qsa(parent, selector).indexOf(element)
        temp && tempParent.removeChild(element)
        return match
    }

    function isFunction(value) { return toString.call(value) == "[object Function]" }
    function isObject(value) { return value instanceof Object }
    function isPlainObject(value) {
        var key, ctor
        if (toString.call(value) !== "[object Object]") return false
        ctor = (isFunction(value.constructor) && value.constructor.prototype)
        if (!ctor || !hasOwnProperty.call(ctor, 'isPrototypeOf')) return false
        for (key in value);
        return key === undefined || hasOwnProperty.call(value, key)
    }
    function isArray(value) { return value instanceof Array }
    function likeArray(obj) { return typeof obj.length == 'number' }

    function compact(array) { return array.filter(function (item) { return item !== undefined && item !== null }) }
    function flatten(array) { return array.length > 0 ? [].concat.apply([], array) : array }
    camelize = function (str) { return str.replace(/-+(.)?/g, function (match, chr) { return chr ? chr.toUpperCase() : '' }) }
    function dasherize(str) {
        return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
    }
    uniq = function (array) { return array.filter(function (item, idx) { return array.indexOf(item) == idx }) }

    function classRE(name) {
        return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
    }

    function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
    }

    function defaultDisplay(nodeName) {
        var element, display
        if (!elementDisplay[nodeName]) {
            element = document.createElement(nodeName)
            document.body.appendChild(element)
            display = getComputedStyle(element, '').getPropertyValue("display")
            element.parentNode.removeChild(element)
            display == "none" && (display = "block")
            elementDisplay[nodeName] = display
        }
        return elementDisplay[nodeName]
    }

    // `$.zepto.fragment` takes a html string and an optional tag name
    // to generate DOM nodes nodes from the given html string.
    // The generated DOM nodes are returned as an array.
    // This function can be overriden in plugins for example to make
    // it compatible with browsers that don't support the DOM fully.
    zepto.fragment = function (html, name) {
        if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
        if (!(name in containers)) name = '*'
        var container = containers[name]
        container.innerHTML = '' + html
        return $.each(slice.call(container.childNodes), function () {
            container.removeChild(this)
        })
    }

    // `$.zepto.Z` swaps out the prototype of the given `dom` array
    // of nodes with `$.fn` and thus supplying all the Zepto functions
    // to the array. Note that `__proto__` is not supported on Internet
    // Explorer. This method can be overriden in plugins.
    zepto.Z = function (dom, selector) {
        dom = dom || []
        dom.__proto__ = arguments.callee.prototype
        dom.selector = selector || ''
        return dom
    }

    // `$.zepto.isZ` should return `true` if the given object is a Zepto
    // collection. This method can be overriden in plugins.
    zepto.isZ = function (object) {
        return object instanceof zepto.Z
    }

    // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
    // takes a CSS selector and an optional context (and handles various
    // special cases).
    // This method can be overriden in plugins.
    zepto.init = function (selector, context) {
        // If nothing given, return an empty Zepto collection
        if (!selector) return zepto.Z()
        // If a function is given, call it when the DOM is ready
        else if (isFunction(selector)) return $(document).ready(selector)
        // If a Zepto collection is given, juts return it
        else if (zepto.isZ(selector)) return selector
        else {
            var dom
            // normalize array if an array of nodes is given
            if (isArray(selector)) dom = compact(selector)
            // if a JavaScript object is given, return a copy of it
            // this is a somewhat peculiar option, but supported by
            // jQuery so we'll do it, too
            else if (isPlainObject(selector))
                dom = [$.extend({}, selector)], selector = null
            // wrap stuff like `document` or `window`
            else if (elementTypes.indexOf(selector.nodeType) >= 0 || selector === window)
                dom = [selector], selector = null
            // If it's a html fragment, create nodes from it
            else if (fragmentRE.test(selector))
                dom = zepto.fragment(selector.trim(), RegExp.$1), selector = null
            // If there's a context, create a collection on that context first, and select
            // nodes from there
            else if (context !== undefined) return $(context).find(selector)
            // And last but no least, if it's a CSS selector, use it to select nodes.
            else dom = zepto.qsa(document, selector)
            // create a new Zepto collection from the nodes found
            return zepto.Z(dom, selector)
        }
    }

    // `$` will be the base `Zepto` object. When calling this
    // function just call `$.zepto.init, whichs makes the implementation
    // details of selecting nodes and creating Zepto collections
    // patchable in plugins.
    $ = function (selector, context) {
        return zepto.init(selector, context)
    }

    // Copy all but undefined properties from one or more
    // objects to the `target` object.
    $.extend = function (target) {
        slice.call(arguments, 1).forEach(function (source) {
            for (key in source)
                if (source[key] !== undefined)
                    target[key] = source[key]
            })
            return target
        }

        // `$.zepto.qsa` is Zepto's CSS selector implementation which
        // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
        // This method can be overriden in plugins.
        zepto.qsa = function (element, selector) {
            var found
            return (element === document && idSelectorRE.test(selector)) ?
      ((found = element.getElementById(RegExp.$1)) ? [found] : emptyArray) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? emptyArray :
      slice.call(
        classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
        tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
        element.querySelectorAll(selector)
      )
        }

        function filtered(nodes, selector) {
            return selector === undefined ? $(nodes) : $(nodes).filter(selector)
        }

        function funcArg(context, arg, idx, payload) {
            return isFunction(arg) ? arg.call(context, idx, payload) : arg
        }

        $.isFunction = isFunction
        $.isObject = isObject
        $.isArray = isArray
        $.isPlainObject = isPlainObject

        $.inArray = function (elem, array, i) {
            return emptyArray.indexOf.call(array, elem, i)
        }

        $.trim = function (str) { return str.trim() }

        // plugin compatibility
        $.uuid = 0

        $.map = function (elements, callback) {
            var value, values = [], i, key
            if (likeArray(elements))
                for (i = 0; i < elements.length; i++) {
                    value = callback(elements[i], i)
                    if (value != null) values.push(value)
                }
            else
                for (key in elements) {
                    value = callback(elements[key], key)
                    if (value != null) values.push(value)
                }
            return flatten(values)
        }

        $.each = function (elements, callback) {
            var i, key
            if (likeArray(elements)) {
                for (i = 0; i < elements.length; i++)
                    if (callback.call(elements[i], i, elements[i]) === false) return elements
                } else {
                    for (key in elements)
                        if (callback.call(elements[key], key, elements[key]) === false) return elements
                    }

                    return elements
                }

                // Define methods that will be available on all
                // Zepto collections
                $.fn = {
                    // Because a collection acts like an array
                    // copy over these useful array functions.
                    forEach: emptyArray.forEach,
                    reduce: emptyArray.reduce,
                    push: emptyArray.push,
                    indexOf: emptyArray.indexOf,
                    concat: emptyArray.concat,

                    // `map` and `slice` in the jQuery API work differently
                    // from their array counterparts
                    map: function (fn) {
                        return $.map(this, function (el, i) { return fn.call(el, i, el) })
                    },
                    slice: function () {
                        return $(slice.apply(this, arguments))
                    },

                    ready: function (callback) {
                        if (readyRE.test(document.readyState)) callback($)
                        else document.addEventListener('DOMContentLoaded', function () { callback($) }, false)
                        return this
                    },
                    get: function (idx) {
                        return idx === undefined ? slice.call(this) : this[idx]
                    },
                    toArray: function () { return this.get() },
                    size: function () {
                        return this.length
                    },
                    remove: function () {
                        return this.each(function () {
                            if (this.parentNode != null)
                                this.parentNode.removeChild(this)
                        })
                    },
                    each: function (callback) {
                        this.forEach(function (el, idx) { callback.call(el, idx, el) })
                        return this
                    },
                    filter: function (selector) {
                        return $([].filter.call(this, function (element) {
                            return zepto.matches(element, selector)
                        }))
                    },
                    add: function (selector, context) {
                        return $(uniq(this.concat($(selector, context))))
                    },
                    is: function (selector) {
                        return this.length > 0 && zepto.matches(this[0], selector)
                    },
                    not: function (selector) {
                        var nodes = []
                        if (isFunction(selector) && selector.call !== undefined)
                            this.each(function (idx) {
                                if (!selector.call(this, idx)) nodes.push(this)
                            })
                        else {
                            var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
                            this.forEach(function (el) {
                                if (excludes.indexOf(el) < 0) nodes.push(el)
                            })
                        }
                        return $(nodes)
                    },
                    eq: function (idx) {
                        return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)
                    },
                    first: function () {
                        var el = this[0]
                        return el && !isObject(el) ? el : $(el)
                    },
                    last: function () {
                        var el = this[this.length - 1]
                        return el && !isObject(el) ? el : $(el)
                    },
                    find: function (selector) {
                        var result
                        if (this.length == 1) result = zepto.qsa(this[0], selector)
                        else result = this.map(function () { return zepto.qsa(this, selector) })
                        return $(result)
                    },
                    closest: function (selector, context) {
                        var node = this[0]
                        while (node && !zepto.matches(node, selector))
                            node = node !== context && node !== document && node.parentNode
                        return $(node)
                    },
                    parents: function (selector) {
                        var ancestors = [], nodes = this
                        while (nodes.length > 0)
                            nodes = $.map(nodes, function (node) {
                                if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
                                    ancestors.push(node)
                                    return node
                                }
                            })
                        return filtered(ancestors, selector)
                    },
                    parent: function (selector) {
                        return filtered(uniq(this.pluck('parentNode')), selector)
                    },
                    children: function (selector) {
                        return filtered(this.map(function () { return slice.call(this.children) }), selector)
                    },
                    siblings: function (selector) {
                        return filtered(this.map(function (i, el) {
                            return slice.call(el.parentNode.children).filter(function (child) { return child !== el })
                        }), selector)
                    },
                    empty: function () {
                        return this.each(function () { this.innerHTML = '' })
                    },
                    // `pluck` is borrowed from Prototype.js
                    pluck: function (property) {
                        return this.map(function () { return this[property] })
                    },
                    show: function () {
                        return this.each(function () {
                            this.style.display == "none" && (this.style.display = null)
                            if (getComputedStyle(this, '').getPropertyValue("display") == "none")
                                this.style.display = defaultDisplay(this.nodeName)
                        })
                    },
                    replaceWith: function (newContent) {
                        return this.before(newContent).remove()
                    },
                    wrap: function (newContent) {
                        return this.each(function () {
                            $(this).wrapAll($(newContent)[0].cloneNode(false))
                        })
                    },
                    wrapAll: function (newContent) {
                        if (this[0]) {
                            $(this[0]).before(newContent = $(newContent))
                            newContent.append(this)
                        }
                        return this
                    },
                    unwrap: function () {
                        this.parent().each(function () {
                            $(this).replaceWith($(this).children())
                        })
                        return this
                    },
                    clone: function () {
                        return $(this.map(function () { return this.cloneNode(true) }))
                    },
                    hide: function () {
                        return this.css("display", "none")
                    },
                    toggle: function (setting) {
                        return (setting === undefined ? this.css("display") == "none" : setting) ? this.show() : this.hide()
                    },
                    prev: function () { return $(this.pluck('previousElementSibling')) },
                    next: function () { return $(this.pluck('nextElementSibling')) },
                    html: function (html) {
                        return html === undefined ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function (idx) {
            var originHtml = this.innerHTML
            $(this).empty().append(funcArg(this, html, idx, originHtml))
        })
                    },
                    text: function (text) {
                        return text === undefined ?
        (this.length > 0 ? this[0].textContent : null) :
        this.each(function () { this.textContent = text })
                    },
                    attr: function (name, value) {
                        var result
                        return (typeof name == 'string' && value === undefined) ?
        (this.length == 0 || this[0].nodeType !== 1 ? undefined :
          (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function (idx) {
            if (this.nodeType !== 1) return
            if (isObject(name)) for (key in name) this.setAttribute(key, name[key])
            else this.setAttribute(name, funcArg(this, value, idx, this.getAttribute(name)))
        })
                    },
                    removeAttr: function (name) {
                        return this.each(function () { if (this.nodeType === 1) this.removeAttribute(name) })
                    },
                    prop: function (name, value) {
                        return (value === undefined) ?
        (this[0] ? this[0][name] : undefined) :
        this.each(function (idx) {
            this[name] = funcArg(this, value, idx, this[name])
        })
                    },
                    data: function (name, value) {
                        var data = this.attr('data-' + dasherize(name), value)
                        return data !== null ? data : undefined
                    },
                    val: function (value) {
                        return (value === undefined) ?
        (this.length > 0 ? this[0].value : undefined) :
        this.each(function (idx) {
            this.value = funcArg(this, value, idx, this.value)
        })
                    },
                    offset: function () {
                        if (this.length == 0) return null
                        var obj = this[0].getBoundingClientRect()
                        return {
                            left: obj.left + window.pageXOffset,
                            top: obj.top + window.pageYOffset,
                            width: obj.width,
                            height: obj.height
                        }
                    },
                    css: function (property, value) {
                        if (value === undefined && typeof property == 'string')
                            return (
          this.length == 0
            ? undefined
            : this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property))

                        var css = ''
                        for (key in property)
                            if (typeof property[key] == 'string' && property[key] == '')
                                this.each(function () { this.style.removeProperty(dasherize(key)) })
                            else
                                css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'

                            if (typeof property == 'string')
                                if (value == '')
                                    this.each(function () { this.style.removeProperty(dasherize(property)) })
                                else
                                    css = dasherize(property) + ":" + maybeAddPx(property, value)

                            return this.each(function () { this.style.cssText += ';' + css })
                        },
                        index: function (element) {
                            return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
                        },
                        hasClass: function (name) {
                            if (this.length < 1) return false
                            else return classRE(name).test(this[0].className)
                        },
                        addClass: function (name) {
                            return this.each(function (idx) {
                                classList = []
                                var cls = this.className, newName = funcArg(this, name, idx, cls)
                                newName.split(/\s+/g).forEach(function (klass) {
                                    if (!$(this).hasClass(klass)) classList.push(klass)
                                }, this)
                                classList.length && (this.className += (cls ? " " : "") + classList.join(" "))
                            })
                        },
                        removeClass: function (name) {
                            return this.each(function (idx) {
                                if (name === undefined)
                                    return this.className = ''
                                classList = this.className
                                funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
                                    classList = classList.replace(classRE(klass), " ")
                                })
                                this.className = classList.trim()
                            })
                        },
                        toggleClass: function (name, when) {
                            return this.each(function (idx) {
                                var newName = funcArg(this, name, idx, this.className)
        ; (when === undefined ? !$(this).hasClass(newName) : when) ?
          $(this).addClass(newName) : $(this).removeClass(newName)
                            })
                        }
                    }

                    // Generate the `width` and `height` functions
  ; ['width', 'height'].forEach(function (dimension) {
      $.fn[dimension] = function (value) {
          var offset, Dimension = dimension.replace(/./, function (m) { return m[0].toUpperCase() })
          if (value === undefined) return this[0] == window ? window['inner' + Dimension] :
        this[0] == document ? document.documentElement['offset' + Dimension] :
        (offset = this.offset()) && offset[dimension]
          else return this.each(function (idx) {
              var el = $(this)
              el.css(dimension, funcArg(this, value, idx, el[dimension]()))
          })
      }
  })

                    function insert(operator, target, node) {
                        var parent = (operator % 2) ? target : target.parentNode
                        parent ? parent.insertBefore(node,
      !operator ? target.nextSibling :      // after
      operator == 1 ? parent.firstChild :   // prepend
      operator == 2 ? target :              // before
      null) :                               // append
      $(node).remove()
                    }

                    function traverseNode(node, fun) {
                        fun(node)
                        for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
                    }

                    // Generate the `after`, `prepend`, `before`, `append`,
                    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
                    adjacencyOperators.forEach(function (key, operator) {
                        $.fn[key] = function () {
                            // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
                            var nodes = $.map(arguments, function (n) { return isObject(n) ? n : zepto.fragment(n) })
                            if (nodes.length < 1) return this
                            var size = this.length, copyByClone = size > 1, inReverse = operator < 2

                            return this.each(function (index, target) {
                                for (var i = 0; i < nodes.length; i++) {
                                    var node = nodes[inReverse ? nodes.length - i - 1 : i]
                                    traverseNode(node, function (node) {
                                        if (node.nodeName != null && node.nodeName.toUpperCase() === 'SCRIPT' && (!node.type || node.type === 'text/javascript'))
                                            window['eval'].call(window, node.innerHTML)
                                    })
                                    if (copyByClone && index < size - 1) node = node.cloneNode(true)
                                    insert(operator, target, node)
                                }
                            })
                        }

                        $.fn[(operator % 2) ? key + 'To' : 'insert' + (operator ? 'Before' : 'After')] = function (html) {
                            $(html)[key](this)
                            return this
                        }
                    })

                    zepto.Z.prototype = $.fn

                    // Export internal API functions in the `$.zepto` namespace
                    zepto.camelize = camelize
                    zepto.uniq = uniq
                    $.zepto = zepto

                    return $
                })()

                // If `$` is not yet defined, point it to `Zepto`
                window.Zepto = Zepto
                '$' in window || (window.$ = Zepto)
; (function ($) {
    var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents = {}

    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

    function zid(element) {
        return element._zid || (element._zid = _zid++)
    }
    function findHandlers(element, event, fn, selector) {
        event = parse(event)
        if (event.ns) var matcher = matcherFor(event.ns)
        return (handlers[zid(element)] || []).filter(function (handler) {
            return handler
        && (!event.e || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
        })
    }
    function parse(event) {
        var parts = ('' + event).split('.')
        return { e: parts[0], ns: parts.slice(1).sort().join(' ') }
    }
    function matcherFor(ns) {
        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
    }

    function eachEvent(events, fn, iterator) {
        if ($.isObject(events)) $.each(events, iterator)
        else events.split(/\s/).forEach(function (type) { iterator(type, fn) })
    }

    function add(element, events, fn, selector, getDelegate, capture) {
        capture = !!capture
        var id = zid(element), set = (handlers[id] || (handlers[id] = []))
        eachEvent(events, fn, function (event, fn) {
            var delegate = getDelegate && getDelegate(fn, event),
        callback = delegate || fn
            var proxyfn = function (event) {
                var result = callback.apply(element, [event].concat(event.data))
                if (result === false) event.preventDefault()
                return result
            }
            var handler = $.extend(parse(event), { fn: fn, proxy: proxyfn, sel: selector, del: delegate, i: set.length })
            set.push(handler)
            element.addEventListener(handler.e, proxyfn, capture)
        })
    }
    function remove(element, events, fn, selector) {
        var id = zid(element)
        eachEvent(events || '', fn, function (event, fn) {
            findHandlers(element, event, fn, selector).forEach(function (handler) {
                delete handlers[id][handler.i]
                element.removeEventListener(handler.e, handler.proxy, false)
            })
        })
    }

    $.event = { add: add, remove: remove }

    $.proxy = function (fn, context) {
        if ($.isFunction(fn)) {
            var proxyFn = function () { return fn.apply(context, arguments) }
            proxyFn._zid = zid(fn)
            return proxyFn
        } else if (typeof context == 'string') {
            return $.proxy(fn[context], fn)
        } else {
            throw new TypeError("expected function")
        }
    }

    $.fn.bind = function (event, callback) {
        return this.each(function () {
            add(this, event, callback)
        })
    }
    $.fn.unbind = function (event, callback) {
        return this.each(function () {
            remove(this, event, callback)
        })
    }
    $.fn.one = function (event, callback) {
        return this.each(function (i, element) {
            add(this, event, callback, null, function (fn, type) {
                return function () {
                    var result = fn.apply(element, arguments)
                    remove(element, type, fn)
                    return result
                }
            })
        })
    }

    var returnTrue = function () { return true },
      returnFalse = function () { return false },
      eventMethods = {
          preventDefault: 'isDefaultPrevented',
          stopImmediatePropagation: 'isImmediatePropagationStopped',
          stopPropagation: 'isPropagationStopped'
      }
    function createProxy(event) {
        var proxy = $.extend({ originalEvent: event }, event)
        $.each(eventMethods, function (name, predicate) {
            proxy[name] = function () {
                this[predicate] = returnTrue
                return event[name].apply(event, arguments)
            }
            proxy[predicate] = returnFalse
        })
        return proxy
    }

    // emulates the 'defaultPrevented' property for browsers that have none
    function fix(event) {
        if (!('defaultPrevented' in event)) {
            event.defaultPrevented = false
            var prevent = event.preventDefault
            event.preventDefault = function () {
                this.defaultPrevented = true
                prevent.call(this)
            }
        }
    }

    $.fn.delegate = function (selector, event, callback) {
        var capture = false
        if (event == 'blur' || event == 'focus') {
            if ($.iswebkit)
                event = event == 'blur' ? 'focusout' : event == 'focus' ? 'focusin' : event
            else
                capture = true
        }

        return this.each(function (i, element) {
            add(element, event, callback, selector, function (fn) {
                return function (e) {
                    var evt, match = $(e.target).closest(selector, element).get(0)
                    if (match) {
                        evt = $.extend(createProxy(e), { currentTarget: match, liveFired: element })
                        return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
                    }
                }
            }, capture)
        })
    }
    $.fn.undelegate = function (selector, event, callback) {
        return this.each(function () {
            remove(this, event, callback, selector)
        })
    }

    $.fn.live = function (event, callback) {
        $(document.body).delegate(this.selector, event, callback)
        return this
    }
    $.fn.die = function (event, callback) {
        $(document.body).undelegate(this.selector, event, callback)
        return this
    }

    $.fn.on = function (event, selector, callback) {
        return selector == undefined || $.isFunction(selector) ?
      this.bind(event, selector) : this.delegate(selector, event, callback)
    }
    $.fn.off = function (event, selector, callback) {
        return selector == undefined || $.isFunction(selector) ?
      this.unbind(event, selector) : this.undelegate(selector, event, callback)
    }

    $.fn.trigger = function (event, data) {
        if (typeof event == 'string') event = $.Event(event)
        fix(event)
        event.data = data
        return this.each(function () {
            // items in the collection might not be DOM elements
            // (todo: possibly support events on plain old objects)
            if ('dispatchEvent' in this) this.dispatchEvent(event)
        })
    }

    // triggers event handlers on current element just as if an event occurred,
    // doesn't trigger an actual event, doesn't bubble
    $.fn.triggerHandler = function (event, data) {
        var e, result
        this.each(function (i, element) {
            e = createProxy(typeof event == 'string' ? $.Event(event) : event)
            e.data = data
            e.target = element
            $.each(findHandlers(element, event.type || event), function (i, handler) {
                result = handler.proxy(e)
                if (e.isImmediatePropagationStopped()) return false
            })
        })
        return result
    }

    // shortcut methods for `.bind(event, fn)` for each event type
  ; ('focusin focusout load resize scroll unload click dblclick ' +
  'mousedown mouseup mousemove mouseover mouseout ' +
  'change select keydown keypress keyup error').split(' ').forEach(function (event) {
      $.fn[event] = function (callback) { return this.bind(event, callback) }
  })

  ; ['focus', 'blur'].forEach(function (name) {
      $.fn[name] = function (callback) {
          if (callback) this.bind(name, callback)
          else if (this.length) try { this.get(0)[name]() } catch (e) { }
          return this
      }
  })

    $.Event = function (type, props) {
        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
        return event
    }

})(Zepto)
; (function ($) {
    function detect(ua) {
        var os = this.os = {}, browser = this.browser = {},
      webkit = ua.match(/WebKit\/([\d.]+)/),
      android = ua.match(/(Android)\s+([\d.]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/)

        // todo clean this up with a better OS/browser
        // separation. we need to discern between multiple
        // browsers on android, and decide if kindle fire in
        // silk mode is android or not

        if (browser.webkit = !!webkit) browser.version = webkit[1]

        if (android) os.android = true, os.version = android[2]
        if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
        if (webos) os.webos = true, os.version = webos[2]
        if (touchpad) os.touchpad = true
        if (blackberry) os.blackberry = true, os.version = blackberry[2]
        if (kindle) os.kindle = true, os.version = kindle[1]
        if (silk) browser.silk = true, browser.version = silk[1]
        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    }

    detect.call($, navigator.userAgent)
    // make available to unit tests
    $.__detect = detect

})(Zepto)
; (function ($, undefined) {
    var prefix = '', eventPrefix, endEventName, endAnimationName,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
    document = window.document, testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    clearProperties = {}

    function downcase(str) { return str.toLowerCase() }
    function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) }

    $.each(vendors, function (vendor, event) {
        if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
            prefix = '-' + downcase(vendor) + '-'
            eventPrefix = event
            return false
        }
    })

    clearProperties[prefix + 'transition-property'] =
  clearProperties[prefix + 'transition-duration'] =
  clearProperties[prefix + 'transition-timing-function'] =
  clearProperties[prefix + 'animation-name'] =
  clearProperties[prefix + 'animation-duration'] = ''

    $.fx = {
        off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
        cssPrefix: prefix,
        transitionEnd: normalizeEvent('TransitionEnd'),
        animationEnd: normalizeEvent('AnimationEnd')
    }

    $.fn.animate = function (properties, duration, ease, callback) {
        if ($.isObject(duration))
            ease = duration.easing, callback = duration.complete, duration = duration.duration
        if (duration) duration = duration / 1000
        return this.anim(properties, duration, ease, callback)
    }

    $.fn.anim = function (properties, duration, ease, callback) {
        var transforms, cssProperties = {}, key, that = this, wrappedCallback, endEvent = $.fx.transitionEnd
        if (duration === undefined) duration = 0.4
        if ($.fx.off) duration = 0

        if (typeof properties == 'string') {
            // keyframe animation
            cssProperties[prefix + 'animation-name'] = properties
            cssProperties[prefix + 'animation-duration'] = duration + 's'
            endEvent = $.fx.animationEnd
        } else {
            // CSS transitions
            for (key in properties)
                if (supportedTransforms.test(key)) {
                    transforms || (transforms = [])
                    transforms.push(key + '(' + properties[key] + ')')
                }
                else cssProperties[key] = properties[key]

                if (transforms) cssProperties[prefix + 'transform'] = transforms.join(' ')
                if (!$.fx.off && typeof properties === 'object') {
                    cssProperties[prefix + 'transition-property'] = Object.keys(properties).join(', ')
                    cssProperties[prefix + 'transition-duration'] = duration + 's'
                    cssProperties[prefix + 'transition-timing-function'] = (ease || 'linear')
                }
            }

            wrappedCallback = function (event) {
                if (typeof event !== 'undefined') {
                    if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
                    $(event.target).unbind(endEvent, arguments.callee)
                }
                $(this).css(clearProperties)
                callback && callback.call(this)
            }
            if (duration > 0) this.bind(endEvent, wrappedCallback)

            setTimeout(function () {
                that.css(cssProperties)
                if (duration <= 0) setTimeout(function () {
                    that.each(function () { wrappedCallback.call(this) })
                }, 0)
            }, 0)

            return this
        }

        testEl = null
    })(Zepto)
; (function ($) {
    var jsonpID = 0,
      isObject = $.isObject,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/

    // trigger a custom event and return false if it was cancelled
    function triggerAndReturn(context, eventName, data) {
        var event = $.Event(eventName)
        $(context).trigger(event, data)
        return !event.defaultPrevented
    }

    // trigger an Ajax "global" event
    function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) return triggerAndReturn(context || document, eventName, data)
    }

    // Number of active Ajax requests
    $.active = 0

    function ajaxStart(settings) {
        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
    }
    function ajaxStop(settings) {
        if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
    }

    // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
    function ajaxBeforeSend(xhr, settings) {
        var context = settings.context
        if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
            return false

        triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
    }
    function ajaxSuccess(data, xhr, settings) {
        var context = settings.context, status = 'success'
        settings.success.call(context, data, status, xhr)
        triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
        ajaxComplete(status, xhr, settings)
    }
    // type: "timeout", "error", "abort", "parsererror"
    function ajaxError(error, type, xhr, settings) {
        var context = settings.context
        settings.error.call(context, xhr, type, error)
        triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
        ajaxComplete(type, xhr, settings)
    }
    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
    function ajaxComplete(status, xhr, settings) {
        var context = settings.context
        settings.complete.call(context, xhr, status)
        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
        ajaxStop(settings)
    }

    // Empty function, used as default callback
    function empty() { }

    $.ajaxJSONP = function (options) {
        var callbackName = 'jsonp' + (++jsonpID),
      script = document.createElement('script'),
      abort = function () {
          $(script).remove()
          if (callbackName in window) window[callbackName] = empty
          ajaxComplete('abort', xhr, options)
      },
      xhr = { abort: abort }, abortTimeout

        if (options.error) script.onerror = function () {
            xhr.abort()
            options.error()
        }

        window[callbackName] = function (data) {
            clearTimeout(abortTimeout)
            $(script).remove()
            delete window[callbackName]
            ajaxSuccess(data, xhr, options)
        }

        serializeData(options)
        script.src = options.url.replace(/=\?/, '=' + callbackName)
        $('head').append(script)

        if (options.timeout > 0) abortTimeout = setTimeout(function () {
            xhr.abort()
            ajaxComplete('timeout', xhr, options)
        }, options.timeout)

        return xhr
    }

    $.ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport
        xhr: function () {
            return new window.XMLHttpRequest()
        },
        // MIME types mapping
        accepts: {
            script: 'text/javascript, application/javascript',
            json: jsonType,
            xml: 'application/xml, text/xml',
            html: htmlType,
            text: 'text/plain'
        },
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0
    }

    function mimeToDataType(mime) {
        return mime && (mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml') || 'text'
    }

    function appendQuery(url, query) {
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
    }

    // serialize payload and append it to the URL for GET requests
    function serializeData(options) {
        if (isObject(options.data)) options.data = $.param(options.data)
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
            options.url = appendQuery(options.url, options.data)
    }

    $.ajax = function (options) {
        var settings = $.extend({}, options || {})
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

        ajaxStart(settings)

        if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host

        var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
        if (dataType == 'jsonp' || hasPlaceholder) {
            if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
            return $.ajaxJSONP(settings)
        }

        if (!settings.url) settings.url = window.location.toString()
        serializeData(settings)

        var mime = settings.accepts[dataType],
        baseHeaders = {},
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = $.ajaxSettings.xhr(), abortTimeout

        if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
        if (mime) {
            baseHeaders['Accept'] = mime
            if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
            xhr.overrideMimeType && xhr.overrideMimeType(mime)
        }
        if (settings.contentType || (settings.data && settings.type.toUpperCase() != 'GET'))
            baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
        settings.headers = $.extend(baseHeaders, settings.headers || {})

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                clearTimeout(abortTimeout)
                var result, error = false
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                    dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
                    result = xhr.responseText

                    try {
                        if (dataType == 'script') (1, eval)(result)
                        else if (dataType == 'xml') result = xhr.responseXML
                        else if (dataType == 'json') result = blankRE.test(result) ? null : JSON.parse(result)
                    } catch (e) { error = e }

                    if (error) ajaxError(error, 'parsererror', xhr, settings)
                    else ajaxSuccess(result, xhr, settings)
                } else {
                    ajaxError(null, 'error', xhr, settings)
                }
            }
        }

        var async = 'async' in settings ? settings.async : true
        xhr.open(settings.type, settings.url, async)

        for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

        if (ajaxBeforeSend(xhr, settings) === false) {
            xhr.abort()
            return false
        }

        if (settings.timeout > 0) abortTimeout = setTimeout(function () {
            xhr.onreadystatechange = empty
            xhr.abort()
            ajaxError(null, 'timeout', xhr, settings)
        }, settings.timeout)

        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null)
        return xhr
    }

    $.get = function (url, success) { return $.ajax({ url: url, success: success }) }

    $.post = function (url, data, success, dataType) {
        if ($.isFunction(data)) dataType = dataType || success, success = data, data = null
        return $.ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType })
    }

    $.getJSON = function (url, success) {
        return $.ajax({ url: url, success: success, dataType: 'json' })
    }

    $.fn.load = function (url, success) {
        if (!this.length) return this
        var self = this, parts = url.split(/\s/), selector
        if (parts.length > 1) url = parts[0], selector = parts[1]
        $.get(url, function (response) {
            self.html(selector ?
        $(document.createElement('div')).html(response.replace(rscript, "")).find(selector).html()
        : response)
            success && success.call(self)
        })
        return this
    }

    var escape = encodeURIComponent

    function serialize(params, obj, traditional, scope) {
        var array = $.isArray(obj)
        $.each(obj, function (key, value) {
            if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
            // handle data in serializeArray() format
            if (!scope && array) params.add(value.name, value.value)
            // recurse into nested objects
            else if (traditional ? $.isArray(value) : isObject(value))
                serialize(params, value, traditional, key)
            else params.add(key, value)
        })
    }

    $.param = function (obj, traditional) {
        var params = []
        params.add = function (k, v) { this.push(escape(k) + '=' + escape(v)) }
        serialize(params, obj, traditional)
        return params.join('&').replace('%20', '+')
    }
})(Zepto)
; (function ($) {
    $.fn.serializeArray = function () {
        var result = [], el
        $(Array.prototype.slice.call(this.get(0).elements)).each(function () {
            el = $(this)
            var type = el.attr('type')
            if (this.nodeName.toLowerCase() != 'fieldset' &&
        !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
        ((type != 'radio' && type != 'checkbox') || this.checked))
                result.push({
                    name: el.attr('name'),
                    value: el.val()
                })
        })
        return result
    }

    $.fn.serialize = function () {
        var result = []
        this.serializeArray().forEach(function (elm) {
            result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
        })
        return result.join('&')
    }

    $.fn.submit = function (callback) {
        if (callback) this.bind('submit', callback)
        else if (this.length) {
            var event = $.Event('submit')
            this.eq(0).trigger(event)
            if (!event.defaultPrevented) this.get(0).submit()
        }
        return this
    }

})(Zepto)
; (function ($) {
    var touch = {}, touchTimeout

    function parentIfText(node) {
        return 'tagName' in node ? node : node.parentNode
    }

    function swipeDirection(x1, x2, y1, y2) {
        var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
        return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }

    var longTapDelay = 750, longTapTimeout

    function longTap() {
        longTapTimeout = null
        if (touch.last) {
            touch.el.trigger('longTap')
            touch = {}
        }
    }

    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout)
        longTapTimeout = null
    }

    $(document).ready(function () {
        var now, delta

        $(document.body).bind('touchstart', function (e) {
            now = Date.now()
            delta = now - (touch.last || now)
            touch.el = $(parentIfText(e.touches[0].target))
            touchTimeout && clearTimeout(touchTimeout)
            touch.x1 = e.touches[0].pageX
            touch.y1 = e.touches[0].pageY
            if (delta > 0 && delta <= 250) touch.isDoubleTap = true
            touch.last = now
            longTapTimeout = setTimeout(longTap, longTapDelay)
        }).bind('touchmove', function (e) {
            cancelLongTap()
            touch.x2 = e.touches[0].pageX
            touch.y2 = e.touches[0].pageY
        }).bind('touchend', function (e) {
            cancelLongTap()

            // double tap (tapped twice within 250ms)
            if (touch.isDoubleTap) {
                touch.el.trigger('doubleTap')
                touch = {}

                // swipe
            } else if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
                 (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
                touch.el.trigger('swipe') &&
          touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
                touch = {}

                // normal tap
            } else if ('last' in touch) {
                touch.el.trigger('tap')

                touchTimeout = setTimeout(function () {
                    touchTimeout = null
                    touch.el.trigger('singleTap')
                    touch = {}
                }, 250)
            }
        }).bind('touchcancel', function () {
            if (touchTimeout) clearTimeout(touchTimeout)
            if (longTapTimeout) clearTimeout(longTapTimeout)
            longTapTimeout = touchTimeout = null
            touch = {}
        })
    })

  ; ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function (m) {
      $.fn[m] = function (callback) { return this.bind(m, callback) }
  })
})(Zepto)
;
/*

            _/    _/_/    _/_/_/_/_/                              _/
               _/    _/      _/      _/_/    _/    _/    _/_/_/  _/_/_/
          _/  _/  _/_/      _/    _/    _/  _/    _/  _/        _/    _/
         _/  _/    _/      _/    _/    _/  _/    _/  _/        _/    _/
        _/    _/_/  _/    _/      _/_/      _/_/_/    _/_/_/  _/    _/
       _/
    _/

    Created by David Kaneda <http://www.davidkaneda.com>
    Maintained by Thomas Yip <http://beedesk.com/>
    Sponsored by Sencha Labs <http://www.sencha.com/>
    Special thanks to Jonathan Stark <http://www.jonathanstark.com/>

    Documentation and issue tracking on GitHub <http://github.com/senchalabs/jQTouch/>

    (c) 2009-2011 Sencha Labs
    jQTouch may be freely distributed under the MIT license.

*/
(function() {

    jQTouchCore = function(options) {
        // Initialize internal jQT variables
        var $ = options.framework,
            $body,
            $head=$('head'),
            history=[],
            newPageCount=0,
            jQTSettings={},
            $currentPage='',
            orientation='portrait',
            touchSelectors=[],
            publicObj={},
            tapBuffer=150,
            extensions=jQTouchCore.prototype.extensions,
            animations=[],
            hairExtensions='',
            defaults = {
                addGlossToIcon: true,
                backSelector: '.back, .cancel, .goback',
                cacheGetRequests: true,
                debug: true,
                defaultAnimation: 'slideleft',
                fixedViewport: true,
                formSelector: 'form',
                fullScreen: true,
                fullScreenClass: 'fullscreen',
                icon: null,
                icon4: null, // available in iOS 4.2 and later.
                preloadImages: false,
                startupScreen: null,
                statusBar: 'default', // other options: black-translucent, black
                submitSelector: '.submit',
                touchSelector: 'a, .touch',
                trackScrollPositions: true,
                useAnimations: true,
                useFastTouch: true,
                useTouchScroll: true,
                animations: [ // highest to lowest priority
                    {name:'cubeleft', selector:'.cubeleft, .cube', is3d: true},
                    {name:'cuberight', selector:'.cuberight', is3d: true},
                    {name:'dissolve', selector:'.dissolve'},
                    {name:'fade', selector:'.fade'},
                    {name:'flipleft', selector:'.flipleft, .flip', is3d: true},
                    {name:'flipright', selector:'.flipright', is3d: true},
                    {name:'pop', selector:'.pop', is3d: true},
                    {name:'swapleft', selector:'.swap', is3d: true},
                    {name:'slidedown', selector:'.slidedown'},
                    {name:'slideright', selector:'.slideright'},
                    {name:'slideup', selector:'.slideup'},
                    {name:'slideleft', selector:'.slideleft, .slide, #jqt > * > ul li a'}
                ]
            }; // end defaults

        function warn(message) {
            if (window.console !== undefined && jQTSettings.debug === true) {
                console.warn(message);
            }
        }
        function addAnimation(animation) {
            if (typeof(animation.selector) === 'string' && typeof(animation.name) === 'string') {
                animations.push(animation);
            }
        }
        function addPageToHistory(page, animation) {
            history.unshift({
                page: page,
                animation: animation,
                hash: '#' + page.attr('id'),
                id: page.attr('id')
            });
        }

        // Unfortunately, we can not assume the "tap" event
        // is being used for links, forms, etc.
        function clickHandler(e) {

            // Figure out whether to prevent default
            var $el = $(e.target);

            // Find the nearest tappable ancestor
            if (!$el.is(touchSelectors.join(', '))) {
                $el = $(e.target).closest(touchSelectors.join(', '));
            }

            // Prevent default if we found an internal link (relative or absolute)
            if ($el && $el.attr('href') && !$el.isExternalLink()) {
                e.preventDefault();
            } else {
            }

            // Trigger a tap event if touchstart is not on the job
            if ($.support.touch) {
            } else {
                $(e.target).trigger('tap', e);
            }

        }
        function doNavigation(fromPage, toPage, animation, goingBack) {

            goingBack = goingBack ? goingBack : false;

            // Error check for target page
            if (toPage === undefined || toPage.length === 0) {
                $.fn.unselect();
                return false;
            }

            // Error check for fromPage===toPage
            if (toPage.hasClass('current')) {
                $.fn.unselect();
                return false;
            }

            // Collapse the keyboard
            $(':focus').trigger('blur');

            fromPage.trigger('pageAnimationStart', { direction: 'out', back: goingBack });
            toPage.trigger('pageAnimationStart', { direction: 'in', back: goingBack });

            if ($.support.animationEvents && animation && jQTSettings.useAnimations) {
                // Fail over to 2d animation if need be
                if (!$.support.transform3d && animation.is3d) {
                    animation.name = jQTSettings.defaultAnimation;
                }

                // Reverse animation if need be
                var finalAnimationName = animation.name,
                    is3d = animation.is3d ? 'animating3d' : '';

                if (goingBack) {
                    finalAnimationName = finalAnimationName.replace(/left|right|up|down|in|out/, reverseAnimation );
                }

                // Bind internal "cleanup" callback
                fromPage.bind('webkitAnimationEnd', navigationEndHandler);

                // Trigger animations
                $body.addClass('animating ' + is3d);

                var lastScroll = window.pageYOffset;

                // Position the incoming page so toolbar is at top of viewport regardless of scroll position on from page
                if (jQTSettings.trackScrollPositions === true) {
                    toPage.css('top', window.pageYOffset - (toPage.data('lastScroll') || 0));
                }
                
                toPage.addClass(finalAnimationName + ' in current');
                fromPage.addClass(finalAnimationName + ' out');

                if (jQTSettings.trackScrollPositions === true) {
                    fromPage.data('lastScroll', lastScroll);
                    $('.scroll', fromPage).each(function(){
                        $(this).data('lastScroll', this.scrollTop);
                    });
                }

            } else {
                toPage.addClass('current in');
                navigationEndHandler();
            }

            // Private navigationEnd callback
            function navigationEndHandler(event) {
                var bufferTime = tapBuffer;

                if ($.support.animationEvents && animation && jQTSettings.useAnimations) {
                    fromPage.unbind('webkitAnimationEnd', navigationEndHandler);
                    fromPage.removeClass('current ' + finalAnimationName + ' out');
                    toPage.removeClass(finalAnimationName);
                    $body.removeClass('animating animating3d');
                    if (jQTSettings.trackScrollPositions === true) {
                        toPage.css('top', -toPage.data('lastScroll'));

                        // Have to make sure the scroll/style resets
                        // are outside the flow of this function.
                        setTimeout(function(){
                            toPage.css('top', 0);
                            window.scroll(0, toPage.data('lastScroll'));
                            $('.scroll', toPage).each(function(){
                                this.scrollTop = - $(this).data('lastScroll');
                            });
                        }, 0);
                    }
                } else {
                    fromPage.removeClass(finalAnimationName + ' out current');
                    tapBuffer += 201;
                }

                // In class is intentionally delayed, as it is our ghost click hack
                setTimeout(function(){
                    toPage.removeClass('in');
                }, tapBuffer);

                // Housekeeping
                $currentPage = toPage;
                if (goingBack) {
                    history.shift();
                } else {
                    addPageToHistory($currentPage, animation);
                }

                fromPage.unselect();

                setHash($currentPage.attr('id'));

                // Trigger custom events
                toPage.trigger('pageAnimationEnd', { direction:'in', animation: animation});
                fromPage.trigger('pageAnimationEnd', { direction:'out', animation: animation});
            }

            return true;
        }
        function reverseAnimation(animation) {
            var opposites={
                'up' : 'down',
                'down' : 'up',
                'left' : 'right',
                'right' : 'left',
                'in' : 'out',
                'out' : 'in'
            };

            return opposites[animation] || animation;
        }
        function getOrientation() {
            return orientation;
        }
        function goBack() {

            // Error checking
            if (history.length < 1 ) {
            }

            if (history.length === 1 ) {
                window.history.go(-1);
            }

            var from = history[0],
                to = history[1];

            if (doNavigation(from.page, to.page, from.animation, true)) {
                return publicObj;
            } else {
                return false;
            }

        }
        function goTo(toPage, animation) {

            var fromPage = history[0].page;

            if (typeof animation === 'string') {
                for (var i=0, max=animations.length; i < max; i++) {
                    if (animations[i].name === animation) {
                        animation = animations[i];
                        break;
                    }
                }
            }

            if (typeof toPage === 'string') {
                var nextPage = $(toPage);

                if (nextPage.length < 1) {
                    showPageByHref(toPage, {
                        animation: animation
                    });
                    return;
                } else {
                    toPage = nextPage;
                }
            }
            if (doNavigation(fromPage, toPage, animation)) {
                return publicObj;
            } else {
                return false;
            }
        }
        function hashChangeHandler(e) {
            if (location.hash === history[0].hash) {
                return true;
            } else if (location.hash === '') {
                goBack();
                return true;
            } else {
                if( (history[1] && location.hash === history[1].hash) ) {
                    goBack();
                    return true;
                } else {
                    // Lastly, just try going to the ID...
                    goTo($(location.hash), jQTSettings.defaultAnimation);
                }
            }
        }
        function init(options) {
            jQTSettings = $.extend({}, defaults, options);

            // Preload images
            if (jQTSettings.preloadImages) {
                for (var i = jQTSettings.preloadImages.length - 1; i >= 0; i--) {
                    (new Image()).src = jQTSettings.preloadImages[i];
                }
            }

            // Set appropriate icon (retina display available in iOS 4.2 and later.)
            var precomposed = (jQTSettings.addGlossToIcon) ? '' : '-precomposed';
            if (jQTSettings.icon) {
                hairExtensions += '<link rel="apple-touch-icon' + precomposed + '" href="' + jQTSettings.icon + '" />';
            }
            if (jQTSettings.icon4) {
                hairExtensions += '<link rel="apple-touch-icon' + precomposed + '" sizes="114x114" href="' + jQTSettings.icon4 + '" />';
            }
            // Set startup screen
            if (jQTSettings.startupScreen) {
                hairExtensions += '<link rel="apple-touch-startup-image" href="' + jQTSettings.startupScreen + '" />';
            }

            // Set viewport
            if (jQTSettings.fixedViewport) {
                hairExtensions += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>';
            }

            // Set full-screen
            if (jQTSettings.fullScreen) {
                hairExtensions += '<meta name="apple-mobile-web-app-capable" content="yes" />';
                if (jQTSettings.statusBar) {
                    hairExtensions += '<meta name="apple-mobile-web-app-status-bar-style" content="' + jQTSettings.statusBar + '" />';
                }
            }

            // Attach hair extensions
            if (hairExtensions) {
                $head.prepend(hairExtensions);
            }
        }

        function getAnimation(el) {
            var animation;

            for (var i=0, max=animations.length; i < max; i++) {
                if (el.is(animations[i].selector)) {
                    animation = animations[i];
                    break;
                }
            }

            if (!animation) {
                animation = jQTSettings.defaultAnimation;
            }
            return animation;
        }

        function insertPages(nodes, animation) {

            var targetPage = null;

            // Call dom.createElement element directly instead of relying on $(nodes),
            // to work around: https://github.com/madrobby/zepto/issues/312
            var div = document.createElement('div');
            div.innerHTML = nodes;

            $(div).children().each(function(index, node) {
                var $node = $(this);
                if (!$node.attr('id')) {
                    $node.attr('id', 'page-' + (++newPageCount));
                }

                // Remove any existing instance
                $('#' + $node.attr('id')).remove();

                $body.append($node);
                $body.trigger('pageInserted', {page: $node});

                if ($node.hasClass('current') || !targetPage) {
                    targetPage = $node;
                }
            });
            if (targetPage !== null) {
                goTo(targetPage, animation);
                return targetPage;
            } else {
                return false;
            }
        }

        function orientationChangeHandler() {
            $body.css('minHeight', 1000);
            scrollTo(0,0);
            var bodyHeight = window.innerHeight;
            $body.css('minHeight', bodyHeight);

            orientation = Math.abs(window.orientation) == 90 ? 'landscape' : 'portrait';
            $body.removeClass('portrait landscape').addClass(orientation).trigger('turn', {orientation: orientation});
        }
        function setHash(hash) {
            // Sanitize
            location.hash = '#' + hash.replace(/^#/, '');
        }
        function showPageByHref(href, options) {

            var defaults = {
                data: null,
                method: 'GET',
                animation: null,
                callback: null,
                $referrer: null
            };

            var settings = $.extend({}, defaults, options);

            if (href != '#') {
                $.ajax({
                    url: href,
                    data: settings.data,
                    type: settings.method,
                    success: function (data) {
                        var firstPage = insertPages(data, settings.animation);
                        if (firstPage) {
                            if (settings.method == 'GET' && jQTSettings.cacheGetRequests === true && settings.$referrer) {
                                settings.$referrer.attr('href', '#' + firstPage.attr('id'));
                            }
                            if (settings.callback) {
                                settings.callback(true);
                            }
                        }
                    },
                    error: function (data) {
                        if (settings.$referrer) {
                            settings.$referrer.unselect();
                        }
                        if (settings.callback) {
                            settings.callback(false);
                        }
                    }
                });
            } else if (settings.$referrer) {
                settings.$referrer.unselect();
            }
        }
        function submitHandler(e, callback) {

            $(':focus').trigger('blur');

            e.preventDefault();

            var $form = (typeof(e)==='string') ? $(e).eq(0) : (e.target ? $(e.target) : $(e));

            if ($form.length && $form.is(jQTSettings.formSelector) && $form.attr('action')) {
                showPageByHref($form.attr('action'), {
                    data: $form.serialize(),
                    method: $form.attr('method') || "POST",
                    animation: getAnimation($form),
                    callback: callback
                });
                return false;
            }
            return true;
        }
        function submitParentForm($el) {

            var $form = $el.closest('form');
            if ($form.length === 0) {
            } else {
                $form.trigger('submit');
                return false;
            }
            return true;
        }
        function supportForTransform3d() {

            var head, body, style, div, result;

            head = document.getElementsByTagName('head')[0];
            body = document.body;

            style = document.createElement('style');
            style.textContent = '@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-webkit-transform-3d){#jqt-3dtest{height:3px}}';

            div = document.createElement('div');
            div.id = 'jqt-3dtest';

            // Add to the page
            head.appendChild(style);
            body.appendChild(div);

            // Check the result
            result = div.offsetHeight === 3;

            // Clean up
            style.parentNode.removeChild(style);
            div.parentNode.removeChild(div);

            // Pass back result
            return result;
        }
        function touchStartHandler(e){

            var $el = $(e.target),
                selectors = touchSelectors.join(', ');

            // Find the nearest tappable ancestor
            if (!$el.is(selectors)) {
                $el = $el.closest(selectors);
            }

            // Make sure we have a tappable element
            if ($el.length && $el.attr('href')) {
                $el.addClass('active');
            }

            // Remove our active class if we move
            $el.on($.support.touch ? 'touchmove' : 'mousemove', function(){
                $el.removeClass('active');
            });

            $el.on('touchend', function(){
                $el.unbind('touchmove mousemove');
            });

        }
        function tapHandler(e){

            // Grab the target element
            var $el = $(e.target);

            // Find the nearest tappable ancestor
            if (!$el.is(touchSelectors.join(', '))) {
                $el = $el.closest(touchSelectors.join(', '));
            }

            // Make sure we have a tappable element
            if (!$el.length || !$el.attr('href')) {
                return false;
            }

            // Init some vars
            var target = $el.attr('target'),
                hash = $el.prop('hash'),
                href = $el.attr('href'),
                animation = null;

            if ($el.isExternalLink()) {
                $el.unselect();
                return true;

            } else if ($el.is(jQTSettings.backSelector)) {
                // User clicked or tapped a back button
                goBack(hash);

            } else if ($el.is(jQTSettings.submitSelector)) {
                // User clicked or tapped a submit element
                submitParentForm($el);

            } else if (target === '_webapp') {
                // User clicked or tapped an internal link, fullscreen mode
                window.location = href;
                return false;

            } else if (href === '#') {
                // Allow tap on item with no href
                $el.unselect();
                return true;
            } else {
                animation = getAnimation($el);

                if (hash && hash !== '#') {
                    // Internal href
                    $el.addClass('active');
                    goTo($(hash).data('referrer', $el), animation, $el.hasClass('reverse'));
                    return false;
                } else {
                    // External href
                    $el.addClass('loading active');
                    showPageByHref($el.attr('href'), {
                        animation: animation,
                        callback: function() {
                            $el.removeClass('loading');
                            setTimeout($.fn.unselect, 250, $el);
                        },
                        $referrer: $el
                    });
                    return false;
                }
            }
        }

        // Get the party started
        init(options);

        // Document ready stuff
        $(document).ready(function RUMBLE() {

            // Store some properties in a support object
            if (!$.support) $.support = {};
            $.support.animationEvents = (typeof window.WebKitAnimationEvent != 'undefined');
            $.support.touch = (typeof window.TouchEvent != 'undefined') && (window.navigator.userAgent.indexOf('Mobile') > -1) && jQTSettings.useFastTouch;
            $.support.transform3d = supportForTransform3d();

            $.support.ios5 = /OS (5(_\d+)*) like Mac OS X/i.test(window.navigator.userAgent);

            if (!$.support.touch) {
            }
            if (!$.support.transform3d) {
            }

            // Define public jQuery functions
            $.fn.isExternalLink = function() {
                var $el = $(this);
                return ($el.attr('target') == '_blank' || $el.attr('rel') == 'external' || $el.is('a[href^="http://maps.google.com"], a[href^="mailto:"], a[href^="tel:"], a[href^="javascript:"], a[href*="youtube.com/v"], a[href*="youtube.com/watch"]'));
            };
            $.fn.makeActive = function() {
                return $(this).addClass('active');
            };
            $.fn.unselect = function(obj) {
                if (obj) {
                    obj.removeClass('active');
                } else {
                    $('.active').removeClass('active');
                }
            };

            // Add extensions
            for (var i=0, max=extensions.length; i < max; i++) {
                var fn = extensions[i];
                if ($.isFunction(fn)) {
                    $.extend(publicObj, fn(publicObj));
                }
            }

            // Add animations
            for (var j=0, max_anims=defaults.animations.length; j < max_anims; j++) {
                var animation = defaults.animations[j];
                if(jQTSettings[animation.name + 'Selector'] !== undefined){
                    animation.selector = jQTSettings[animation.name + 'Selector'];
                }
                addAnimation(animation);
            }

            // Create an array of stuff that needs touch event handling
            touchSelectors.push(jQTSettings.touchSelector);
            touchSelectors.push(jQTSettings.backSelector);
            touchSelectors.push(jQTSettings.submitSelector);
            $(touchSelectors.join(', ')).css('-webkit-touch-callout', 'none');

            // Make sure we have a jqt element
            $body = $('#jqt');
            var anatomy_lessons = [];

            if ($body.length === 0) {
                $body = $(document.body).attr('id', 'jqt');
            }

            // Add some specific css if need be
            if ($.support.transform3d) {
                anatomy_lessons.push('supports3d');
            }
            if ($.support.ios5 && jQTSettings.useTouchScroll) {
                anatomy_lessons.push('touchscroll');
            }

            if (jQTSettings.fullScreenClass && window.navigator.standalone === true) {
                anatomy_lessons.push(jQTSettings.fullScreenClass, jQTSettings.statusBar);
            }

            // Bind events
            
            $body
                .addClass(anatomy_lessons.join(' '))
                .bind('click', clickHandler)
                .bind('orientationchange', orientationChangeHandler)
                .bind('submit', submitHandler)
                .bind('tap', tapHandler)
                .bind( $.support.touch ? 'touchstart' : 'mousedown', touchStartHandler)
                .trigger('orientationchange');
            
            $(window).bind('hashchange', hashChangeHandler);

            var startHash = location.hash;

            // Determine what the initial view should be
            if ($('#jqt > .current').length === 0) {
                $currentPage = $('#jqt > *:first-child').addClass('current');
            } else {
                $currentPage = $('#jqt > .current');
            }
            
            setHash($currentPage.attr('id'));
            addPageToHistory($currentPage);

            if ($(startHash).length === 1) {
                goTo(startHash);
            }
        });

        // Expose public methods and properties
        publicObj = {
            addAnimation: addAnimation,
            animations: animations,
            getOrientation: getOrientation,
            goBack: goBack,
            insertPages: insertPages,
            goTo: goTo,
            history: history,
            settings: jQTSettings,
            submitForm: submitHandler
        };
        return publicObj;
    };
    
    jQTouchCore.prototype.extensions = [];

    // If Zepto exists, jQTouch will use Zepto. Otherwise, a bridge should initialize
    // jQTouch. See jqtouch-jquery.js.
    if (!!window.Zepto) {
        (function($) {
            $.jQTouch = function(options) {
                options.framework = $;
                return jQTouchCore(options);
            };

            $.fn.prop = $.fn.attr;
            
            // Extensions directly manipulate the jQTouch object, before it's initialized.
            $.jQTouch.addExtension = function(extension) {
                jQTouchCore.prototype.extensions.push(extension);
            };
        })(Zepto);
    }
})(); // Double closure, ALL THE WAY ACROSS THE SKY

/*

            _/    _/_/    _/_/_/_/_/                              _/
               _/    _/      _/      _/_/    _/    _/    _/_/_/  _/_/_/
          _/  _/  _/_/      _/    _/    _/  _/    _/  _/        _/    _/
         _/  _/    _/      _/    _/    _/  _/    _/  _/        _/    _/
        _/    _/_/  _/    _/      _/_/      _/_/_/    _/_/_/  _/    _/
       _/
    _/

    Documentation and issue tracking on Google Code <http://code.google.com/p/jqtouch/>

    (c) 2011 by jQTouch project members.
    See LICENSE.txt for license.

*/

(function($) {
    if ($.jQTouch) {

        var scriptpath = $("script").last().attr("src").split('?')[0].split('/').slice(0, -1).join('/')+'/';

        $.jQTouch.addExtension(function ThemeSwitcher(jQT) {

            var current,
                link,
                titles = {},
                defaults = {
                    themeStyleSelector: 'link[rel="stylesheet"][title]',
                    themeIncluded: [
                        {title: 'Awesome', href: scriptpath + '../themes/css/mobile-dark.css'},
                        {title: 'Apple', href: scriptpath + '../themes/css/apple.css'},
                        {title: 'Boring', href: scriptpath + '../themes/css/jqtouch.css'}
                    ]
                },
                options = $.extend({}, defaults, jQT.settings);

            function setStyleState(item, title) {
                var $item = $(item);

                if ($item.attr('title') === title) {
                    item.disabled = false; // workaround for Firefox on Zepto
                    $item.removeAttr('disabled');
                } else {
                  item.disabled = true; // workaround for Firefox on Zepto
                  $item.attr('disabled', true);
                }
            };

            function initializeStyleState(item, title) {
              // and, workaround for WebKit by initializing the 'disabled' attribute
              if (!current) {
                  current = title;
              }
              setStyleState(item, current);
            }

            // public
            function switchStyle(title) {
                current = title;
                $(options.themeStyleSelector).each(function(i, item) {
                    setStyleState(item, title);
                });
            };

            // collect title names, from <head>
            $(options.themeStyleSelector).each(function(i, item) {
                var $item = $(item);
                var title = $item.attr('title');

                titles[title] = true;

                initializeStyleState(item, title);
            });

            // add included theme
            for (var i=0; i < options.themeIncluded.length; i++) {
                var hash = options.themeIncluded[i];
                if (!(hash.title in titles)) {
                    link = $('<link title="' + hash.title + '" href="' + hash.href + '" rel="stylesheet">');
                    $('head').append($(link));

                    titles[hash.title] = true;

                    initializeStyleState(link, hash.title);
                }
            }

            if (options.themeSelectionSelector) {
                // create UI items
                for (var title in titles) {
                    var $item = $('<li><a href="#" data-title="' + title + '">' + title + '</a></li>');
                    $(options.themeSelectionSelector).append($item);
                }

                // bind to UI items
                $(options.themeSelectionSelector).delegate('* > a', 'tap', function() {
                    var $a = $(this).closest('a');
                    switchStyle($a.attr('data-title'));

                    // poor-man simulation of radio button behaviour
                    setTimeout(function() {
                        $a.addClass('active');
                    }, 0);
                });

                // poor-man simulation of radio button behaviour
                $(options.themeSelectionSelector).closest('#jqt > *').bind('pageAnimationEnd', function(e, data){
                    if (data.direction === 'in') {
                        $(options.themeSelectionSelector).find('a[data-title="' + current + '"]').addClass('active');
                    }
                });
            }

            return {switchStyle: switchStyle};

        });
    }
})($);

/*!
 * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(){
var m = Math,
	mround = function (r) { return r >> 0; },
	vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
		(/firefox/i).test(navigator.userAgent) ? 'Moz' :
		(/trident/i).test(navigator.userAgent) ? 'ms' :
		'opera' in window ? 'O' : '',

    // Browser capabilities
    isAndroid = (/android/gi).test(navigator.appVersion),
    isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
    isPlaybook = (/playbook/gi).test(navigator.appVersion),
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

    has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor + 'Transform' in document.documentElement.style,
    hasTransitionEnd = isIDevice || isPlaybook,

	nextFrame = (function() {
	    return window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function(callback) { return setTimeout(callback, 1); }
	})(),
	cancelFrame = (function () {
	    return window.cancelRequestAnimationFrame
			|| window.webkitCancelAnimationFrame
			|| window.webkitCancelRequestAnimationFrame
			|| window.mozCancelRequestAnimationFrame
			|| window.oCancelRequestAnimationFrame
			|| window.msCancelRequestAnimationFrame
			|| clearTimeout
	})(),

	// Events
	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	WHEEL_EV = vendor == 'Moz' ? 'DOMMouseScroll' : 'mousewheel',

	// Helpers
	trnOpen = 'translate' + (has3d ? '3d(' : '('),
	trnClose = has3d ? ',0)' : ')',

	// Constructor
	iScroll = function (el, options) {
		var that = this,
			doc = document,
			i;

		that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
		that.wrapper.style.overflow = 'hidden';
		that.scroller = that.wrapper.children[0];

		// Default options
		that.options = {
			hScroll: true,
			vScroll: true,
			x: 0,
			y: 0,
			bounce: true,
			bounceLock: false,
			momentum: true,
			lockDirection: true,
			useTransform: true,
			useTransition: false,
			topOffset: 0,
			checkDOMChanges: false,		// Experimental

			// Scrollbar
			hScrollbar: true,
			vScrollbar: true,
			fixedScrollbar: isAndroid,
			hideScrollbar: isIDevice,
			fadeScrollbar: isIDevice && has3d,
			scrollbarClass: '',

			// Zoom
			zoom: false,
			zoomMin: 1,
			zoomMax: 4,
			doubleTapZoom: 2,
			wheelAction: 'scroll',

			// Snap
			snap: false,
			snapThreshold: 1,

			// Events
			onRefresh: null,
			onBeforeScrollStart: function (e) { e.preventDefault(); },
			onScrollStart: null,
			onBeforeScrollMove: null,
			onScrollMove: null,
			onBeforeScrollEnd: null,
			onScrollEnd: null,
			onTouchEnd: null,
			onDestroy: null,
			onZoomStart: null,
			onZoom: null,
			onZoomEnd: null
		};

		// User defined options
		for (i in options) that.options[i] = options[i];
		
		// Set starting position
		that.x = that.options.x;
		that.y = that.options.y;

		// Normalize options
		that.options.useTransform = hasTransform ? that.options.useTransform : false;
		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
		that.options.zoom = that.options.useTransform && that.options.zoom;
		that.options.useTransition = hasTransitionEnd && that.options.useTransition;

		// Helpers FIX ANDROID BUG!
		// translate3d and scale doesn't work together! 
		// Ignoring 3d ONLY WHEN YOU SET that.options.zoom
		if ( that.options.zoom && isAndroid ){
			trnOpen = 'translate(';
			trnClose = ')';
		}
		
		// Set some default styles
		that.scroller.style[vendor + 'TransitionProperty'] = that.options.useTransform ? '-' + vendor.toLowerCase() + '-transform' : 'top left';
		that.scroller.style[vendor + 'TransitionDuration'] = '0';
		that.scroller.style[vendor + 'TransformOrigin'] = '0 0';
		if (that.options.useTransition) that.scroller.style[vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';
		
		if (that.options.useTransform) that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose;
		else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

		if (that.options.useTransition) that.options.fixedScrollbar = true;

		that.refresh();

		that._bind(RESIZE_EV, window);
		that._bind(START_EV);
		if (!hasTouch) {
			that._bind('mouseout', that.wrapper);
			if (that.options.wheelAction != 'none')
				that._bind(WHEEL_EV);
		}

		if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
			that._checkDOMChanges();
		}, 500);
	};

// Prototype
iScroll.prototype = {
	enabled: true,
	x: 0,
	y: 0,
	steps: [],
	scale: 1,
	currPageX: 0, currPageY: 0,
	pagesX: [], pagesY: [],
	aniTime: null,
	wheelZoomCount: 0,
	
	handleEvent: function (e) {
		var that = this;
		switch(e.type) {
			case START_EV:
				if (!hasTouch && e.button !== 0) return;
				that._start(e);
				break;
			case MOVE_EV: that._move(e); break;
			case END_EV:
			case CANCEL_EV: that._end(e); break;
			case RESIZE_EV: that._resize(); break;
			case WHEEL_EV: that._wheel(e); break;
			case 'mouseout': that._mouseout(e); break;
			case 'webkitTransitionEnd': that._transitionEnd(e); break;
		}
	},
	
	_checkDOMChanges: function () {
		if (this.moved || this.zoomed || this.animating ||
			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

		this.refresh();
	},
	
	_scrollbar: function (dir) {
		var that = this,
			doc = document,
			bar;

		if (!that[dir + 'Scrollbar']) {
			if (that[dir + 'ScrollbarWrapper']) {
				if (hasTransform) that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = '';
				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
				that[dir + 'ScrollbarWrapper'] = null;
				that[dir + 'ScrollbarIndicator'] = null;
			}

			return;
		}

		if (!that[dir + 'ScrollbarWrapper']) {
			// Create the scrollbar wrapper
			bar = doc.createElement('div');

			if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
			else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

			bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:opacity;-' + vendor + '-transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

			that.wrapper.appendChild(bar);
			that[dir + 'ScrollbarWrapper'] = bar;

			// Create the scrollbar indicator
			bar = doc.createElement('div');
			if (!that.options.scrollbarClass) {
				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-' + vendor + '-background-clip:padding-box;-' + vendor + '-box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';-' + vendor + '-border-radius:3px;border-radius:3px';
			}
			bar.style.cssText += ';pointer-events:none;-' + vendor + '-transition-property:-' + vendor + '-transform;-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-' + vendor + '-transition-duration:0;-' + vendor + '-transform:' + trnOpen + '0,0' + trnClose;
			if (that.options.useTransition) bar.style.cssText += ';-' + vendor + '-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

			that[dir + 'ScrollbarWrapper'].appendChild(bar);
			that[dir + 'ScrollbarIndicator'] = bar;
		}

		if (dir == 'h') {
			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
			that.hScrollbarIndicatorSize = m.max(mround(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
		} else {
			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
			that.vScrollbarIndicatorSize = m.max(mround(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
		}

		// Reset position
		that._scrollbarPos(dir, true);
	},
	
	_resize: function () {
		var that = this;
		setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
	},
	
	_pos: function (x, y) {
		x = this.hScroll ? x : 0;
		y = this.vScroll ? y : 0;

		if (this.options.useTransform) {
			this.scroller.style[vendor + 'Transform'] = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(' + this.scale + ')';
		} else {
			x = mround(x);
			y = mround(y);
			this.scroller.style.left = x + 'px';
			this.scroller.style.top = y + 'px';
		}

		this.x = x;
		this.y = y;

		this._scrollbarPos('h');
		this._scrollbarPos('v');
	},

	_scrollbarPos: function (dir, hidden) {
		var that = this,
			pos = dir == 'h' ? that.x : that.y,
			size;

		if (!that[dir + 'Scrollbar']) return;

		pos = that[dir + 'ScrollbarProp'] * pos;

		if (pos < 0) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] + mround(pos * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
			}
			pos = 0;
		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] - mround((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
				pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
			} else {
				pos = that[dir + 'ScrollbarMaxScroll'];
			}
		}

		that[dir + 'ScrollbarWrapper'].style[vendor + 'TransitionDelay'] = '0';
		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
		that[dir + 'ScrollbarIndicator'].style[vendor + 'Transform'] = trnOpen + (dir == 'h' ? pos + 'px,0' : '0,' + pos + 'px') + trnClose;
	},
	
	_start: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			matrix, x, y,
			c1, c2;

		if (!that.enabled) return;

		if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

		if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

		that.moved = false;
		that.animating = false;
		that.zoomed = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;

		// Gesture start
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
			that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

			that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
			that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

			if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
		}

		if (that.options.momentum) {
			if (that.options.useTransform) {
				// Very lame general purpose alternative to CSSMatrix
				matrix = getComputedStyle(that.scroller, null)[vendor + 'Transform'].replace(/[^0-9-.,]/g, '').split(',');
				x = matrix[4] * 1;
				y = matrix[5] * 1;
			} else {
				x = getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '') * 1;
				y = getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '') * 1;
			}
			
			if (x != that.x || y != that.y) {
				if (that.options.useTransition) that._unbind('webkitTransitionEnd');
				else cancelFrame(that.aniTime);
				that.steps = [];
				that._pos(x, y);
			}
		}

		that.absStartX = that.x;	// Needed by snap threshold
		that.absStartY = that.y;

		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;

		that.startTime = e.timeStamp || Date.now().getTime(); // NOTE: Remove .getTime() if not using date.js.

		if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

		that._bind(MOVE_EV);
		that._bind(END_EV);
		that._bind(CANCEL_EV);
	},
	
	_move: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY,
			c1, c2, scale,
			timestamp = e.timeStamp || Date.now().getTime(); // NOTE: Remove .getTime() if not using date.js.

		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

		// Zoom
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
			that.touchesDist = m.sqrt(c1*c1+c2*c2);

			that.zoomed = true;

			scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

			if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
			else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

			that.lastScale = scale / this.scale;

			newX = this.originX - this.originX * that.lastScale + this.x,
			newY = this.originY - this.originY * that.lastScale + this.y;

			this.scroller.style[vendor + 'Transform'] = trnOpen + newX + 'px,' + newY + 'px' + trnClose + ' scale(' + scale + ')';

			if (that.options.onZoom) that.options.onZoom.call(that, e);
			return;
		}

		that.pointX = point.pageX;
		that.pointY = point.pageY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > that.minScrollY || newY < that.maxScrollY) { 
			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
		}

		that.distX += deltaX;
		that.distY += deltaY;
		that.absDistX = m.abs(that.distX);
		that.absDistY = m.abs(that.distY);

		if (that.absDistX < 6 && that.absDistY < 6) {
			return;
		}

		// Lock direction
		if (that.options.lockDirection) {
			if (that.absDistX > that.absDistY + 5) {
				newY = that.y;
				deltaY = 0;
			} else if (that.absDistY > that.absDistX + 5) {
				newX = that.x;
				deltaX = 0;
			}
		}

		that.moved = true;
		that._pos(newX, newY);
		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (timestamp - that.startTime > 300) {
			that.startTime = timestamp;
			that.startX = that.x;
			that.startY = that.y;
		}
		
		if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
	},
	
	_end: function (e) {
		if (hasTouch && e.touches.length != 0) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, ev,
			momentumX = { dist:0, time:0 },
			momentumY = { dist:0, time:0 },
			duration = (e.timeStamp || Date.now().getTime()) - that.startTime, // NOTE: Remove .getTime() if not using date.js.
			newPosX = that.x,
			newPosY = that.y,
			distX, distY,
			newDuration,
			snap,
			scale;

		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);

		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

		if (that.zoomed) {
			scale = that.scale * that.lastScale;
			scale = Math.max(that.options.zoomMin, scale);
			scale = Math.min(that.options.zoomMax, scale);
			that.lastScale = scale / that.scale;
			that.scale = scale;

			that.x = that.originX - that.originX * that.lastScale + that.x;
			that.y = that.originY - that.originY * that.lastScale + that.y;
			
			that.scroller.style[vendor + 'TransitionDuration'] = '200ms';
			that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + that.scale + ')';
			
			that.zoomed = false;
			that.refresh();

			if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
			return;
		}

		if (!that.moved) {
			if (hasTouch) {
				if (that.doubleTapTimer && that.options.zoom) {
					// Double tapped
					clearTimeout(that.doubleTapTimer);
					that.doubleTapTimer = null;
					if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
					that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
					if (that.options.onZoomEnd) {
						setTimeout(function() {
							that.options.onZoomEnd.call(that, e);
						}, 200); // 200 is default zoom duration
					}
				} else {
					that.doubleTapTimer = setTimeout(function () {
						that.doubleTapTimer = null;

						// Find the last touched element
						target = point.target;
						while (target.nodeType != 1) target = target.parentNode;

						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
							ev = document.createEvent('MouseEvents');
							ev.initMouseEvent('click', true, true, e.view, 1,
								point.screenX, point.screenY, point.clientX, point.clientY,
								e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
								0, null);
							ev._fake = true;
							target.dispatchEvent(ev);
						}
					}, that.options.zoom ? 250 : 0);
				}
			}

			that._resetPos(200);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		if (duration < 300 && that.options.momentum) {
			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

			newPosX = that.x + momentumX.dist;
			newPosY = that.y + momentumY.dist;

 			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
 			if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
		}

		if (momentumX.dist || momentumY.dist) {
			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

			// Do we need to snap?
			if (that.options.snap) {
				distX = newPosX - that.absStartX;
				distY = newPosY - that.absStartY;
				if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
				else {
					snap = that._snap(newPosX, newPosY);
					newPosX = snap.x;
					newPosY = snap.y;
					newDuration = m.max(snap.time, newDuration);
				}
			}

			that.scrollTo(mround(newPosX), mround(newPosY), newDuration);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		// Do we need to snap?
		if (that.options.snap) {
			distX = newPosX - that.absStartX;
			distY = newPosY - that.absStartY;
			if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
			else {
				snap = that._snap(that.x, that.y);
				if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
			}

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		that._resetPos(200);
		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
	},
	
	_resetPos: function (time) {
		var that = this,
			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		if (resetX == that.x && resetY == that.y) {
			if (that.moved) {
				that.moved = false;
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
			}

			if (that.hScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.hScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';
				that.hScrollbarWrapper.style.opacity = '0';
			}
			if (that.vScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.vScrollbarWrapper.style[vendor + 'TransitionDelay'] = '300ms';
				that.vScrollbarWrapper.style.opacity = '0';
			}

			return;
		}

		that.scrollTo(resetX, resetY, time || 0);
	},

	_wheel: function (e) {
		var that = this,
			wheelDeltaX, wheelDeltaY,
			deltaX, deltaY,
			deltaScale;

		if ('wheelDeltaX' in e) {
			wheelDeltaX = e.wheelDeltaX / 12;
			wheelDeltaY = e.wheelDeltaY / 12;
		} else if('wheelDelta' in e) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
		} else if ('detail' in e) {
			wheelDeltaX = wheelDeltaY = -e.detail * 3;
		} else {
			return;
		}
		
		if (that.options.wheelAction == 'zoom') {
			deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
			if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
			if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
			
			if (deltaScale != that.scale) {
				if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
				that.wheelZoomCount++;
				
				that.zoom(e.pageX, e.pageY, deltaScale, 400);
				
				setTimeout(function() {
					that.wheelZoomCount--;
					if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
				}, 400);
			}
			
			return;
		}
		
		deltaX = that.x + wheelDeltaX;
		deltaY = that.y + wheelDeltaY;

		if (deltaX > 0) deltaX = 0;
		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

		if (deltaY > that.minScrollY) deltaY = that.minScrollY;
		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;

		that.scrollTo(deltaX, deltaY, 0);
	},
	
	_mouseout: function (e) {
		var t = e.relatedTarget;

		if (!t) {
			this._end(e);
			return;
		}

		while (t = t.parentNode) if (t == this.wrapper) return;
		
		this._end(e);
	},

	_transitionEnd: function (e) {
		var that = this;

		if (e.target != that.scroller) return;

		that._unbind('webkitTransitionEnd');
		
		that._startAni();
	},


	/**
	 *
	 * Utilities
	 *
	 */
	_startAni: function () {
		var that = this,
			startX = that.x, startY = that.y,
			startTime = Date.now().getTime(), // NOTE: Remove .getTime() if not using date.js.
			step, easeOut,
			animate;

		if (that.animating) return;
		
		if (!that.steps.length) {
			that._resetPos(400);
			return;
		}
		
		step = that.steps.shift();
		
		if (step.x == startX && step.y == startY) step.time = 0;

		that.animating = true;
		that.moved = true;
		
		if (that.options.useTransition) {
			that._transitionTime(step.time);
			that._pos(step.x, step.y);
			that.animating = false;
			if (step.time) that._bind('webkitTransitionEnd');
			else that._resetPos(0);
			return;
		}

		animate = function () {
		    var now = Date.now().getTime(), // NOTE: Remove .getTime() if not using date.js.
				newX, newY;

			if (now >= startTime + step.time) {
				that._pos(step.x, step.y);
				that.animating = false;
				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
				that._startAni();
				return;
			}

			now = (now - startTime) / step.time - 1;
			easeOut = m.sqrt(1 - now * now);
			newX = (step.x - startX) * easeOut + startX;
			newY = (step.y - startY) * easeOut + startY;
			that._pos(newX, newY);
			if (that.animating) that.aniTime = nextFrame(animate);
		};

		animate();
	},

	_transitionTime: function (time) {
		time += 'ms';
		this.scroller.style[vendor + 'TransitionDuration'] = time;
		if (this.hScrollbar) this.hScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;
		if (this.vScrollbar) this.vScrollbarIndicator.style[vendor + 'TransitionDuration'] = time;
	},

	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var deceleration = 0.0006,
			speed = m.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

		// Proportinally reduce speed if we are outside of the boundaries 
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistUpper = maxDistUpper + outsideDist;
			speed = speed * maxDistUpper / newDist;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistLower = maxDistLower + outsideDist;
			speed = speed * maxDistLower / newDist;
			newDist = maxDistLower;
		}

		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;

		return { dist: newDist, time: mround(newTime) };
	},

	_offset: function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;
			
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		
		if (el != this.wrapper) {
			left *= this.scale;
			top *= this.scale;
		}

		return { left: left, top: top };
	},

	_snap: function (x, y) {
		var that = this,
			i, l,
			page, time,
			sizeX, sizeY;

		// Check page X
		page = that.pagesX.length - 1;
		for (i=0, l=that.pagesX.length; i<l; i++) {
			if (x >= that.pagesX[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
		x = that.pagesX[page];
		sizeX = m.abs(x - that.pagesX[that.currPageX]);
		sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
		that.currPageX = page;

		// Check page Y
		page = that.pagesY.length-1;
		for (i=0; i<page; i++) {
			if (y >= that.pagesY[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
		y = that.pagesY[page];
		sizeY = m.abs(y - that.pagesY[that.currPageY]);
		sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
		that.currPageY = page;

		// Snap with constant speed (proportional duration)
		time = mround(m.max(sizeX, sizeY)) || 200;

		return { x: x, y: y, time: time };
	},

	_bind: function (type, el, bubble) {
		(el || this.scroller).addEventListener(type, this, !!bubble);
	},

	_unbind: function (type, el, bubble) {
		(el || this.scroller).removeEventListener(type, this, !!bubble);
	},


	/**
	 *
	 * Public methods
	 *
	 */
	destroy: function () {
		var that = this;

		that.scroller.style[vendor + 'Transform'] = '';

		// Remove the scrollbars
		that.hScrollbar = false;
		that.vScrollbar = false;
		that._scrollbar('h');
		that._scrollbar('v');

		// Remove the event listeners
		that._unbind(RESIZE_EV, window);
		that._unbind(START_EV);
		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);
		
		if (!that.options.hasTouch) {
			that._unbind('mouseout', that.wrapper);
			that._unbind(WHEEL_EV);
		}
		
		if (that.options.useTransition) that._unbind('webkitTransitionEnd');
		
		if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
		
		if (that.options.onDestroy) that.options.onDestroy.call(that);
	},

	refresh: function () {
		var that = this,
			offset,
			i, l,
			els,
			pos = 0,
			page = 0;

		if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
		that.wrapperW = that.wrapper.clientWidth || 1;
		that.wrapperH = that.wrapper.clientHeight || 1;

		that.minScrollY = -that.options.topOffset || 0;
		that.scrollerW = mround(that.scroller.offsetWidth * that.scale);
		that.scrollerH = mround((that.scroller.offsetHeight + that.minScrollY) * that.scale);
		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
		that.dirX = 0;
		that.dirY = 0;

		if (that.options.onRefresh) that.options.onRefresh.call(that);

		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

		that.hScrollbar = that.hScroll && that.options.hScrollbar;
		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

		offset = that._offset(that.wrapper);
		that.wrapperOffsetLeft = -offset.left;
		that.wrapperOffsetTop = -offset.top;

		// Prepare snap
		if (typeof that.options.snap == 'string') {
			that.pagesX = [];
			that.pagesY = [];
			els = that.scroller.querySelectorAll(that.options.snap);
			for (i=0, l=els.length; i<l; i++) {
				pos = that._offset(els[i]);
				pos.left += that.wrapperOffsetLeft;
				pos.top += that.wrapperOffsetTop;
				that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
				that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
			}
		} else if (that.options.snap) {
			that.pagesX = [];
			while (pos >= that.maxScrollX) {
				that.pagesX[page] = pos;
				pos = pos - that.wrapperW;
				page++;
			}
			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

			pos = 0;
			page = 0;
			that.pagesY = [];
			while (pos >= that.maxScrollY) {
				that.pagesY[page] = pos;
				pos = pos - that.wrapperH;
				page++;
			}
			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
		}

		// Prepare the scrollbars
		that._scrollbar('h');
		that._scrollbar('v');

		if (!that.zoomed) {
			that.scroller.style[vendor + 'TransitionDuration'] = '0';
			that._resetPos(200);
		}
	},

	scrollTo: function (x, y, time, relative) {
		var that = this,
			step = x,
			i, l;

		that.stop();

		if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
		
		for (i=0, l=step.length; i<l; i++) {
			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
		}

		that._startAni();
	},

	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.scroller.querySelector(el);
		if (!el) return;

		pos = that._offset(el);
		pos.left += that.wrapperOffsetLeft;
		pos.top += that.wrapperOffsetTop;

		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
		pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

		that.scrollTo(pos.left, pos.top, time);
	},

	scrollToPage: function (pageX, pageY, time) {
		var that = this, x, y;
		
		time = time === undefined ? 400 : time;

		if (that.options.onScrollStart) that.options.onScrollStart.call(that);

		if (that.options.snap) {
			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

			that.currPageX = pageX;
			that.currPageY = pageY;
			x = that.pagesX[pageX];
			y = that.pagesY[pageY];
		} else {
			x = -that.wrapperW * pageX;
			y = -that.wrapperH * pageY;
			if (x < that.maxScrollX) x = that.maxScrollX;
			if (y < that.maxScrollY) y = that.maxScrollY;
		}

		that.scrollTo(x, y, time);
	},

	disable: function () {
		this.stop();
		this._resetPos(0);
		this.enabled = false;

		// If disabled after touchstart we make sure that there are no left over events
		this._unbind(MOVE_EV);
		this._unbind(END_EV);
		this._unbind(CANCEL_EV);
	},
	
	enable: function () {
		this.enabled = true;
	},
	
	stop: function () {
		if (this.options.useTransition) this._unbind('webkitTransitionEnd');
		else cancelFrame(this.aniTime);
		this.steps = [];
		this.moved = false;
		this.animating = false;
	},
	
	zoom: function (x, y, scale, time) {
		var that = this,
			relScale = scale / that.scale;

		if (!that.options.useTransform) return;

		that.zoomed = true;
		time = time === undefined ? 200 : time;
		x = x - that.wrapperOffsetLeft - that.x;
		y = y - that.wrapperOffsetTop - that.y;
		that.x = x - x * relScale + that.x;
		that.y = y - y * relScale + that.y;

		that.scale = scale;
		that.refresh();

		that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
		that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		that.scroller.style[vendor + 'TransitionDuration'] = time + 'ms';
		that.scroller.style[vendor + 'Transform'] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose + ' scale(' + scale + ')';
		that.zoomed = false;
	},
	
	isReady: function () {
		return !this.moved && !this.zoomed && !this.animating;
	}
};

if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;

})();

; (function ($) {
    if ($.os.ios) {
        var gesture = {}, gestureTimeout

        function parentIfText(node) {
            return 'tagName' in node ? node : node.parentNode
        }

        $(document).bind('gesturestart', function (e) {
            var now = Date.now().getTime(), delta = now - (gesture.last || now) // NOTE: Remove .getTime() if not using date.js.
            gesture.target = parentIfText(e.target)
            gestureTimeout && clearTimeout(gestureTimeout)
            gesture.e1 = e.scale
            gesture.last = now
        }).bind('gesturechange', function (e) {
            gesture.e2 = e.scale
        }).bind('gestureend', function (e) {
            if (gesture.e2 > 0) {
                Math.abs(gesture.e1 - gesture.e2) != 0 && $(gesture.target).trigger('pinch') &&
          $(gesture.target).trigger('pinch' + (gesture.e1 - gesture.e2 > 0 ? 'In' : 'Out'))
                gesture.e1 = gesture.e2 = gesture.last = 0
            } else if ('last' in gesture) {
                gesture = {}
            }
        })

    ; ['pinch', 'pinchIn', 'pinchOut'].forEach(function (m) {
        $.fn[m] = function (callback) { return this.bind(m, callback) }
    })
    }
})(Zepto)
;(function($){
  var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches

  function visible(elem){
    elem = $(elem)
    return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
  }

  // Implements a subset from:
  // http://api.jquery.com/category/selectors/jquery-selector-extensions/
  //
  // Each filter function receives the current index, all nodes in the
  // considered set, and a value if there were parentheses. The value
  // of `this` is the node currently being considered. The function returns the
  // resulting node(s), null, or undefined.
  //
  // Complex selectors are not supported:
  //   li:has(label:contains("foo")) + li:has(label:contains("bar"))
  //   "> h2"
  //   ul.inner:first > li
  var filters = zepto.cssFilters = {
    visible:  function(){ if (visible(this)) return this },
    hidden:   function(){ if (!visible(this)) return this },
    selected: function(){ if (this.selected) return this },
    checked:  function(){ if (this.checked) return this },
    parent:   function(){ return this.parentNode },
    first:    function(idx){ if (idx === 0) return this },
    last:     function(idx, nodes){ if (idx === nodes.length - 1) return this },
    eq:       function(idx, _, value){ if (idx === value) return this },
    contains: function(idx, _, text){ if ($(this).text().indexOf(text) > -1) return this },
    has:      function(idx, _, sel){ if (zepto.qsa(this, sel).length) return this }
  }

  var re = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*')

  function process(sel, fn) {
    var filter, arg, match = sel.match(re)
    if (match && match[2] in filters) {
      var filter = filters[match[2]], arg = match[3]
      sel = match[1]
      if (arg) {
        var num = Number(arg)
        if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '')
        else arg = num
      }
    }
    return fn(sel, filter, arg)
  }

  zepto.qsa = function(node, selector) {
    return process(selector, function(sel, filter, arg){
      try {
        if (!sel && filter) sel = '*'
        var nodes = oldQsa(node, sel)
      } catch(e) {
        console.error('error performing selector: %o', selector)
        throw e
      }
      return !filter ? nodes :
        zepto.uniq($.map(nodes, function(n, i){ return filter.call(n, i, nodes, arg) }))
    })
  }

  zepto.matches = function(node, selector){
    return process(selector, function(sel, filter, arg){
      return (!sel || oldMatches(node, sel)) &&
        (!filter || filter.call(node, null, arg) === node)
    })
  }
})(Zepto)

/**
 * 
 * Find more about the Spinning Wheel function at
 * http://cubiq.org/spinning-wheel-on-webkit-for-iphone-ipod-touch/11
 *
 * Copyright (c) 2009 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Version 1.4 - Last updated: 2009.07.09
 * 
 */

var SpinningWheel = {
	cellHeight: 44,
	friction: 0.003,
	slotData: [],


	/**
	 *
	 * Event handler
	 *
	 */

	handleEvent: function (e) {
		if (e.type == 'touchstart') {
			this.lockScreen(e);
			if (e.currentTarget.id == 'sw-cancel' || e.currentTarget.id == 'sw-done') {
				this.tapDown(e);
			} else if (e.currentTarget.id == 'sw-frame') {
				this.scrollStart(e);
			}
		} else if (e.type == 'touchmove') {
			this.lockScreen(e);
			
			if (e.currentTarget.id == 'sw-cancel' || e.currentTarget.id == 'sw-done') {
				this.tapCancel(e);
			} else if (e.currentTarget.id == 'sw-frame') {
				this.scrollMove(e);
			}
		} else if (e.type == 'touchend') {
			if (e.currentTarget.id == 'sw-cancel' || e.currentTarget.id == 'sw-done') {
				this.tapUp(e);
			} else if (e.currentTarget.id == 'sw-frame') {
				this.scrollEnd(e);
			}
		} else if (e.type == 'webkitTransitionEnd') {
			if (e.target.id == 'sw-wrapper') {
				this.destroy();
			} else {
				this.backWithinBoundaries(e);
			}
		} else if (e.type == 'orientationchange') {
			this.onOrientationChange(e);
		} else if (e.type == 'scroll') {
			this.onScroll(e);
		}
	},


	/**
	 *
	 * Global events
	 *
	 */

	onOrientationChange: function (e) {
		window.scrollTo(0, 0);
		this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';
		this.calculateSlotsWidth();
	},
	
	onScroll: function (e) {
		this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';
	},

	lockScreen: function (e) {
		e.preventDefault();
		e.stopPropagation();
	},


	/**
	 *
	 * Initialization
	 *
	 */

	reset: function () {
		this.slotEl = [];

		this.activeSlot = null;
		
		this.swWrapper = undefined;
		this.swSlotWrapper = undefined;
		this.swSlots = undefined;
		this.swFrame = undefined;
	},

	calculateSlotsWidth: function () {
		var div = this.swSlots.getElementsByTagName('div');
		for (var i = 0; i < div.length; i += 1) {
			this.slotEl[i].slotWidth = div[i].offsetWidth;
		}
	},

	create: function () {
		var i, l, out, ul, div;

		this.reset();	// Initialize object variables

		// Create the Spinning Wheel main wrapper
		div = document.createElement('div');
		div.id = 'sw-wrapper';
		div.style.top = window.innerHeight + window.pageYOffset + 'px';		// Place the SW down the actual viewing screen
		div.style.webkitTransitionProperty = '-webkit-transform';
		div.innerHTML = '<div id="sw-header"><div id="sw-cancel">Cancel</' + 'div><div id="sw-done">Done</' + 'div></' + 'div><div id="sw-slots-wrapper"><div id="sw-slots"></' + 'div></' + 'div><div id="sw-frame"></' + 'div>';

		document.body.appendChild(div);

		this.swWrapper = div;													// The SW wrapper
		this.swSlotWrapper = document.getElementById('sw-slots-wrapper');		// Slots visible area
		this.swSlots = document.getElementById('sw-slots');						// Pseudo table element (inner wrapper)
		this.swFrame = document.getElementById('sw-frame');						// The scrolling controller

		// Create HTML slot elements
		for (l = 0; l < this.slotData.length; l += 1) {
			// Create the slot
			ul = document.createElement('ul');
			out = '';
			for (i in this.slotData[l].values) {
				out += '<li>' + this.slotData[l].values[i] + '<' + '/li>';
			}
			ul.innerHTML = out;

			div = document.createElement('div');		// Create slot container
			div.className = this.slotData[l].style;		// Add styles to the container
			div.appendChild(ul);
	
			// Append the slot to the wrapper
			this.swSlots.appendChild(div);
			
			ul.slotPosition = l;			// Save the slot position inside the wrapper
			ul.slotYPosition = 0;
			ul.slotWidth = 0;
			ul.slotMaxScroll = this.swSlotWrapper.clientHeight - ul.clientHeight - 86;
			ul.style.webkitTransitionTimingFunction = 'cubic-bezier(0, 0, 0.2, 1)';		// Add default transition
			
			this.slotEl.push(ul);			// Save the slot for later use
			
			// Place the slot to its default position (if other than 0)
			if (this.slotData[l].defaultValue) {
				this.scrollToValue(l, this.slotData[l].defaultValue);	
			}
		}
		
		this.calculateSlotsWidth();
		
		// Global events
		document.addEventListener('touchstart', this, false);			// Prevent page scrolling
		document.addEventListener('touchmove', this, false);			// Prevent page scrolling
		window.addEventListener('orientationchange', this, true);		// Optimize SW on orientation change
		window.addEventListener('scroll', this, true);				// Reposition SW on page scroll

		// Cancel/Done buttons events
		document.getElementById('sw-cancel').addEventListener('touchstart', this, false);
		document.getElementById('sw-done').addEventListener('touchstart', this, false);

		// Add scrolling to the slots
		this.swFrame.addEventListener('touchstart', this, false);
	},

	open: function () {
		this.create();

		this.swWrapper.style.webkitTransitionTimingFunction = 'ease-out';
		this.swWrapper.style.webkitTransitionDuration = '400ms';
		this.swWrapper.style.webkitTransform = 'translate3d(0, -260px, 0)';
	},
	
	
	/**
	 *
	 * Unload
	 *
	 */

	destroy: function () {
		this.swWrapper.removeEventListener('webkitTransitionEnd', this, false);

		this.swFrame.removeEventListener('touchstart', this, false);

		document.getElementById('sw-cancel').removeEventListener('touchstart', this, false);
		document.getElementById('sw-done').removeEventListener('touchstart', this, false);

		document.removeEventListener('touchstart', this, false);
		document.removeEventListener('touchmove', this, false);
		window.removeEventListener('orientationchange', this, true);
		window.removeEventListener('scroll', this, true);
		
		this.slotData = [];
		this.cancelAction = function () {
			return false;
		};
		
		this.cancelDone = function () {
			return true;
		};
		
		this.reset();
		
		document.body.removeChild(document.getElementById('sw-wrapper'));
	},
	
	close: function () {
        if(this && this.swWrapper) {
		    this.swWrapper.style.webkitTransitionTimingFunction = 'ease-in';
		    this.swWrapper.style.webkitTransitionDuration = '400ms';
		    this.swWrapper.style.webkitTransform = 'translate3d(0, 0, 0)';
		
		    this.swWrapper.addEventListener('webkitTransitionEnd', this, false);
        }
	},


	/**
	 *
	 * Generic methods
	 *
	 */

	addSlot: function (values, style, defaultValue) {
		if (!style) {
			style = '';
		}
		
		style = style.split(' ');

		for (var i = 0; i < style.length; i += 1) {
			style[i] = 'sw-' + style[i];
		}
		
		style = style.join(' ');

		var obj = { 'values': values, 'style': style, 'defaultValue': defaultValue };
		this.slotData.push(obj);
	},

	getSelectedValues: function () {
		var index, count,
		    i, l,
			keys = [], values = [];

		for (i in this.slotEl) {
			// Remove any residual animation
			this.slotEl[i].removeEventListener('webkitTransitionEnd', this, false);
			this.slotEl[i].style.webkitTransitionDuration = '0';

			if (this.slotEl[i].slotYPosition > 0) {
				this.setPosition(i, 0);
			} else if (this.slotEl[i].slotYPosition < this.slotEl[i].slotMaxScroll) {
				this.setPosition(i, this.slotEl[i].slotMaxScroll);
			}

			index = -Math.round(this.slotEl[i].slotYPosition / this.cellHeight);

			count = 0;
			for (l in this.slotData[i].values) {
				if (count == index) {
					keys.push(l);
					values.push(this.slotData[i].values[l]);
					break;
				}
				
				count += 1;
			}
		}

		return { 'keys': keys, 'values': values };
	},


	/**
	 *
	 * Rolling slots
	 *
	 */

	setPosition: function (slot, pos) {
		this.slotEl[slot].slotYPosition = pos;
		this.slotEl[slot].style.webkitTransform = 'translate3d(0, ' + pos + 'px, 0)';
	},
	
	scrollStart: function (e) {
		// Find the clicked slot
		var xPos = e.targetTouches[0].clientX - this.swSlots.offsetLeft;	// Clicked position minus left offset (should be 11px)

		// Find tapped slot
		var slot = 0;
		for (var i = 0; i < this.slotEl.length; i += 1) {
			slot += this.slotEl[i].slotWidth;
			
			if (xPos < slot) {
				this.activeSlot = i;
				break;
			}
		}

		// If slot is readonly do nothing
		if (this.slotData[this.activeSlot].style.match('readonly')) {
			this.swFrame.removeEventListener('touchmove', this, false);
			this.swFrame.removeEventListener('touchend', this, false);
			return false;
		}

		this.slotEl[this.activeSlot].removeEventListener('webkitTransitionEnd', this, false);	// Remove transition event (if any)
		this.slotEl[this.activeSlot].style.webkitTransitionDuration = '0';		// Remove any residual transition
		
		// Stop and hold slot position
		var theTransform = window.getComputedStyle(this.slotEl[this.activeSlot]).webkitTransform;
		theTransform = new WebKitCSSMatrix(theTransform).m42;
		if (theTransform != this.slotEl[this.activeSlot].slotYPosition) {
			this.setPosition(this.activeSlot, theTransform);
		}
		
		this.startY = e.targetTouches[0].clientY;
		this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
		this.scrollStartTime = e.timeStamp;

		this.swFrame.addEventListener('touchmove', this, false);
		this.swFrame.addEventListener('touchend', this, false);
		
		return true;
	},

	scrollMove: function (e) {
		var topDelta = e.targetTouches[0].clientY - this.startY;

		if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
			topDelta /= 2;
		}
		
		this.setPosition(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition + topDelta);
		this.startY = e.targetTouches[0].clientY;

		// Prevent slingshot effect
		if (e.timeStamp - this.scrollStartTime > 80) {
			this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
			this.scrollStartTime = e.timeStamp;
		}
	},
	
	scrollEnd: function (e) {
		this.swFrame.removeEventListener('touchmove', this, false);
		this.swFrame.removeEventListener('touchend', this, false);

		// If we are outside of the boundaries, let's go back to the sheepfold
		if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
			this.scrollTo(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition > 0 ? 0 : this.slotEl[this.activeSlot].slotMaxScroll);
			return false;
		}

		// Lame formula to calculate a fake deceleration
		var scrollDistance = this.slotEl[this.activeSlot].slotYPosition - this.scrollStartY;

		// The drag session was too short
		if (scrollDistance < this.cellHeight / 1.5 && scrollDistance > -this.cellHeight / 1.5) {
			if (this.slotEl[this.activeSlot].slotYPosition % this.cellHeight) {
				this.scrollTo(this.activeSlot, Math.round(this.slotEl[this.activeSlot].slotYPosition / this.cellHeight) * this.cellHeight, '100ms');
			}

			return false;
		}

		var scrollDuration = e.timeStamp - this.scrollStartTime;

		var newDuration = (2 * scrollDistance / scrollDuration) / this.friction;
		var newScrollDistance = (this.friction / 2) * (newDuration * newDuration);
		
		if (newDuration < 0) {
			newDuration = -newDuration;
			newScrollDistance = -newScrollDistance;
		}

		var newPosition = this.slotEl[this.activeSlot].slotYPosition + newScrollDistance;

		if (newPosition > 0) {
			// Prevent the slot to be dragged outside the visible area (top margin)
			newPosition /= 2;
			newDuration /= 3;

			if (newPosition > this.swSlotWrapper.clientHeight / 4) {
				newPosition = this.swSlotWrapper.clientHeight / 4;
			}
		} else if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
			// Prevent the slot to be dragged outside the visible area (bottom margin)
			newPosition = (newPosition - this.slotEl[this.activeSlot].slotMaxScroll) / 2 + this.slotEl[this.activeSlot].slotMaxScroll;
			newDuration /= 3;
			
			if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4) {
				newPosition = this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4;
			}
		} else {
			newPosition = Math.round(newPosition / this.cellHeight) * this.cellHeight;
		}

		this.scrollTo(this.activeSlot, Math.round(newPosition), Math.round(newDuration) + 'ms');
 
		return true;
	},

	scrollTo: function (slotNum, dest, runtime) {
		this.slotEl[slotNum].style.webkitTransitionDuration = runtime ? runtime : '100ms';
		this.setPosition(slotNum, dest ? dest : 0);

		// If we are outside of the boundaries go back to the sheepfold
		if (this.slotEl[slotNum].slotYPosition > 0 || this.slotEl[slotNum].slotYPosition < this.slotEl[slotNum].slotMaxScroll) {
			this.slotEl[slotNum].addEventListener('webkitTransitionEnd', this, false);
		}
	},
	
	scrollToValue: function (slot, value) {
		var yPos, count, i;

		this.slotEl[slot].removeEventListener('webkitTransitionEnd', this, false);
		this.slotEl[slot].style.webkitTransitionDuration = '0';
		
		count = 0;
		for (i in this.slotData[slot].values) {
			if (i == value) {
				yPos = count * this.cellHeight;
				this.setPosition(slot, yPos);
				break;
			}
			
			count -= 1;
		}
	},
	
	backWithinBoundaries: function (e) {
		e.target.removeEventListener('webkitTransitionEnd', this, false);

		this.scrollTo(e.target.slotPosition, e.target.slotYPosition > 0 ? 0 : e.target.slotMaxScroll, '150ms');
		return false;
	},


	/**
	 *
	 * Buttons
	 *
	 */

	tapDown: function (e) {
		e.currentTarget.addEventListener('touchmove', this, false);
		e.currentTarget.addEventListener('touchend', this, false);
		e.currentTarget.className = 'sw-pressed';
	},

	tapCancel: function (e) {
		e.currentTarget.removeEventListener('touchmove', this, false);
		e.currentTarget.removeEventListener('touchend', this, false);
		e.currentTarget.className = '';
	},
	
	tapUp: function (e) {
		this.tapCancel(e);

		if (e.currentTarget.id == 'sw-cancel') {
			this.cancelAction();
		} else {
			this.doneAction();
		}
		
		this.close();
	},

	setCancelAction: function (action) {
		this.cancelAction = action;
	},

	setDoneAction: function (action) {
		this.doneAction = action;
	},
	
	cancelAction: function () {
		return false;
	},

	cancelDone: function () {
		return true;
	}
};
/*
 * jLinq - 3.0.1
 * Hugo Bonacci - hugoware.com
 * http://creativecommons.org/licenses/by/3.0/
 */

var jLinq;
var jlinq;
var jl;
(function() {

    //jLinq functionality
    var framework = {
    
        //command types for extensions
        command:{
        
            //queues a comparison to filter records
            query:0,
            
            //executes all queued commands and filters the records
            select:1,
            
            //performs an immediate action to the query
            action:2
        },
        
        //common expressions
        exp:{
            //gets each part of a dot notation path
            get_path:/\./g,
            
            //escapes string so it can be used in a regular expression
            escape_regex:/[\-\[\]\{\}\(\)\*\+\?\.\,\\\^\$\|\#\s]/g
        },
        
        //common javascript types
        type:{
            nothing:-1,
            undefined:0,
            string:1,
            number:2,
            array:3,
            regex:4,
            bool:5,
            method:6,
            datetime:7,
            object:99
        },
        
        //contains jLinq commands and functions
        library:{
        
            //the current commands in jLinq
            commands:{},
            
            //the type comparisons for jLinq
            types:{},
        
            //includes a comparison to identify types
            addType:function(type, compare) {
                framework.library.types[type] = compare;
            },
        
            //adds a command to the jLinq library
            extend:function(commands) {
            
                //convert to an array if not already
                if (!framework.util.isType(framework.type.array, commands)) {
                    commands = [commands];
                }
                
                //append each method
                framework.util.each(commands, function(command) {
                    framework.library.commands[command.name] = command;
                });
            
            },
            
            //starts a new jLinq query
            query:function(collection, params) {
            
                //make sure something is there
                if (!framework.util.isType(framework.type.array, collection)) {
                    throw "jLinq can only query arrays of objects.";
                }
                
                //clone the array to prevent changing objects - by default
                //this is off
                collection = params.clone || (params.clone == null && jLinq.alwaysClone)
                    ? framework.util.clone(collection) 
                    : collection;
            
                //holds the state of the current query
                var self = {
                
                    //the public instance of the query
                    instance:{
                    
                        //should this query ignore case
                        ignoreCase:jLinq.ignoreCase,
                        
                        //should the next command be evaluated as not
                        not:false,
                        
                        //the action that was last invoked
                        lastCommand:null,
                        
                        //the name of the last field queried
                        lastField:null,
                    
                        //the current records available
                        records:collection,
                    
                        //records that have been filtered out
                        removed:[],
                        
                        //tells a query to start a new function
                        or:function() { self.startNewCommandSet(); },
                        
                        //the query creator object
                        query:{}
                        
                    },
                    
                    //determines if the arguments provided meet the
                    //requirements to be a repeated command
                    canRepeatCommand:function(args) {
                        return self.instance.lastCommand != null &&
                            args.length == (self.instance.lastCommand.method.length + 1) &&
                            framework.util.isType(framework.type.string, args[0])
                    },

                    //commands waiting to execute
                    commands:[[]],
                    
                    //executes the current query and updated the records
                    execute:function() {
                        var results = [];
                        
                        //get the current state of the query
                        var state = self.instance;
                        
                        //start checking each record
                        framework.util.each(self.instance.records, function(record) {
                            
                            //update the state
                            state.record = record;

                            //perform the evaluation
                            if (self.evaluate(state)) { 
                                results.push(record); 
                            }
                            else {
                                self.instance.removed.push(record);
                            }
                        });
                        
                        //update the matching records
                        self.instance.records = results;
                    },
                    
                    //tries to find a value from the path name
                    findValue:framework.util.findValue,
                    
                    //evaluates each queued command for matched
                    evaluate:function(state) {
                        
                        //check each of the command sets
                        for (var command = 0, l = self.commands.length; command < l; command++) {
                        
                            //each set represents an 'or' set - if any
                            //match then return this worked
                            var set = self.commands[command];
                            if (self.evaluateSet(set, state)) { return true; }
                            
                        };
                        
                        //since nothing evaluated, return it failed
                        return false;
                        
                    },
                    
                    //evaluates a single set of commands
                    evaluateSet:function(set, state) {
                    
                        //check each command in this set
                        for (var item in set) {
                            if (!set.hasOwnProperty(item)) continue;
                            //get the details to use
                            var command = set[item];
                            state.value = self.findValue(state.record, command.path);
                            state.compare = function(types) { return framework.util.compare(state.value, types, state); };
                            state.when = function(types) { return framework.util.when(state.value, types, state); };
                                
                            //evaluate the command
                            try {
                                var result = command.method.apply(state, command.args);
                                if (command.not) { result = !result; }
                                if (!result) { return false; }
                            }
                            //errors and exceptions just result in a failed
                            //to evaluate as true
                            catch (e) {
                                return false;
                            }
                            
                        }
                        
                        //if nothing failed then return it worked
                        return true;
                        
                    },
                    
                    //repeats the previous command with new
                    //arguments
                    repeat:function(arguments) {
                    
                        //check if there is anything to repeat
                        if (!self.instance.lastCommand || arguments == null) { return; }
                        
                        //get the array of arguments to work with
                        arguments = framework.util.toArray(arguments);
                            
                        //check if there is a field name has changed, and
                        //if so, update the arguments to match
                        if (self.canRepeatCommand(arguments)) {
                            self.instance.lastField = arguments[0];
                            arguments = framework.util.select(arguments, null, 1, null);
                        }
                        
                        //invoke the command now
                        self.queue(self.instance.lastCommand, arguments);
                    },
                    
                    //saves a command to evaluate later
                    queue:function(command, args) {
                        self.instance.lastCommand = command;
                        
                        //the base detail for the command
                        var detail = {
                            name:command.name,
                            method:command.method,
                            field:self.instance.lastField,
                            count:command.method.length,
                            args:args,
                            not:self.not
                        };
                        
                        //check to see if there is an extra argument which should
                        //be the field name argument
                        if (detail.args.length > command.method.length) {
                        
                            //if so, grab the name and update the arguments
                            detail.field = detail.args[0];
                            detail.args = framework.util.remaining(detail.args, 1);
                            self.instance.lastField = detail.field;
                        }
                        
                        //get the full path for the field name
                        detail.path = detail.field;
                        
                        //queue the command to the current set
                        self.commands[self.commands.length-1].push(detail);

                        //then reset the not state
                        self.not = false;
                    
                    },
                    
                    //creates a new set of methods that should be evaluated
                    startNewCommandSet:function() {
                        self.commands.push([]);
                    },
                    
                    //marks a command to evaluate as NOT
                    setNot:function() {
                        self.not = !self.not;
                    }
                    
                };
                
                //append each of the functions
                framework.util.each(framework.library.commands, function(command) {
                
                    //Query methods queue up and are not evaluated until
                    //a selection or action command is called
                    if (command.type == framework.command.query) {
                        
                        //the default action to perform
                        var action = function() {
                            self.queue(command, arguments);
                            return self.instance.query;
                        };
                        
                        //create the default action
                        self.instance.query[command.name] = action;
                        
                        //orCommand
                        var name = framework.util.operatorName(command.name);
                        self.instance.query["or"+name] = function() {
                            self.startNewCommandSet();
                            return action.apply(null, arguments);
                        };
                        
                        //orNotCommand
                        self.instance.query["orNot"+name] = function() {
                            self.startNewCommandSet();
                            self.setNot();
                            return action.apply(null, arguments);
                        };
                        
                        //andCommand
                        self.instance.query["and"+name] = function() {
                            return action.apply(null, arguments);
                        };
                        
                        //andNotCommand
                        self.instance.query["andNot"+name] = function() {
                            self.setNot();
                            return action.apply(null, arguments);
                        };
                        
                        //notCommand
                        self.instance.query["not"+name] = function() {
                            self.setNot();
                            return action.apply(null, arguments);
                        };
                        
                    }
                    
                    //Selections commands flush the queue of commands
                    //before they are executed. A selection command
                    //must return something (even if it is the current query)
                    else if (command.type == framework.command.select) {
                        self.instance.query[command.name] = function() {
                        
                            //apply the current changes
                            self.execute();
                            
                            //get the current state of the query
                            var state = self.instance;
                            state.compare = function(value, types) { return framework.util.compare(value, types, state); };
                            state.when = function(value, types) { return framework.util.when(value, types, state); };
                            
                            //perform the work
                            return command.method.apply(state, arguments);
                        };
                    }
                    
                    //actions evaluate immediately then return control to
                    //the query 
                    else if (command.type == framework.command.action) {
                        self.instance.query[command.name] = function() {
                        
                            //get the current state of the query
                            var state = self.instance;
                            state.compare = function(value, types) { return framework.util.compare(value, types, state); };
                            state.when = function(value, types) { return framework.util.when(value, types, state); };
                        
                            //perform the work
                            command.method.apply(state, arguments);
                            return self.instance.query;
                        };
                    }
                
                });
                
                //causes the next command to be an 'or'
                self.instance.query.or = function() {
                    self.startNewCommandSet();
                    self.repeat(arguments);
                    return self.instance.query;
                };
                
                //causes the next command to be an 'and' (which is default)
                self.instance.query.and = function() { 
                    self.repeat(arguments); 
                    return self.instance.query;
                };
                
                //causes the next command to be a 'not'
                self.instance.query.not = function() { 
                    self.setNot();
                    self.repeat(arguments); 
                    return self.instance.query;
                };
                
                //causes the next command to be a 'not'
                self.instance.query.andNot = function() { 
                    self.setNot();
                    self.repeat(arguments); 
                    return self.instance.query;
                };
                
                //causes the next command to be a 'not' and 'or'
                self.instance.query.orNot = function() { 
                    self.startNewCommandSet();
                    self.setNot();
                    self.repeat(arguments); 
                    return self.instance.query;
                };
                
                //return the query information
                return self.instance.query;
            
            }
            
        },
        
        //variety of helper methods
        util:{
        
            //removes trailing and leading spaces from a value
            trim:function(value) {
                
                //get the string value
                value = value == null ? "" : value;
                value = value.toString();
                
                //trim the spaces
                return value.replace(/^\s*|\s*$/g, "");
            
            },
        
            //clones each item in an array
            cloneArray:function(array) {
                var result = [];
                framework.util.each(array, function(item) {
                    result.push(framework.util.clone(item));
                });
                return result;
            },
        
            //creates a copy of an object
            clone:function(obj) {
            
                //for arrays, copy each item
                if (framework.util.isType(framework.type.array, obj)) { 
                    return framework.util.cloneArray(obj);
                }
                //for object check each value
                else if (framework.util.isType(framework.type.object, obj)) {
                    var clone = {};
                    for(var item in obj) {
                        if (obj.hasOwnProperty(item)) clone[item] = framework.util.clone(obj[item]);
                    }
                    return clone;
                }
                //all other types just return the value
                else {
                    return obj;
                }
            },
        
            //creates an invocation handler for a field
            //name instead of grabbing values
            invoke:function(obj, args) {
                //copy the array to avoid breaking any other calls
                args = args.concat();
                
                //start by getting the path
                var path = args[0];
                
                //find the method and extract the arguments
                var method = framework.util.findValue(obj, path);
                args = framework.util.select(args, null, 1, null);
                
                //if we are invoking a method that hangs off
                //another object then we need to find the value
                path = path.replace(/\..*$/, "");
                var parent = framework.util.findValue(obj, path);
                obj = parent === method ? obj : parent;
                
                //return the result of the call
                try {
                    var result = method.apply(obj, args);
                    return result;
                }
                catch (e) {
                    return null;
                }
                
            },
        
            //gets a path from a field name
            getPath:function(path) {
                return framework.util.toString(path).split(framework.exp.get_path);
            },
        
            //searches an object to find a value
            findValue:function(obj, path) {
            
                //start by checking if this is actualy an attempt to 
                //invoke a value on this property
                if (framework.util.isType(framework.type.array, path)) {
                    return framework.util.invoke(obj, path);
                    
                }
                //if this referring to a field
                else if (framework.util.isType(framework.type.string, path)) {

                    //get each part of the path
                    path = framework.util.getPath(path);

                    //search for the record
                    var index = 0;
                    while(obj != null && index < path.length) {
                        obj = obj[path[index++]];
                    }
                    
                    //return the final found object
                    return obj;
                    
                }
                //nothing that can be read, just return the value
                else {
                    return obj;
                }
                
            },
        
            //returns the value at the provided index
            elementAt:function(collection, index) {
                return collection && collection.length > 0 && index < collection.length && index >= 0 
                    ? collection[index]
                    : null;
            },
        
            //makes a string save for regular expression searching
            regexEscape:function(val) {
                return (val ? val : "").toString().replace(framework.exp.escape_regex, "\\$&");
            },
            
            //matches expressions to a value
            regexMatch:function(expression, source, ignoreCase) {
            
                //get the string value if needed
                if (framework.util.isType(framework.type.regex, expression)) {
                    expression = expression.source;
                }
            
                //create the actual expression and match
                expression = new RegExp(framework.util.toString(expression), ignoreCase ? "gi" : "g");
                return framework.util.toString(source).match(expression) != null;
            },
        
            //converts a command to an operator name
            operatorName:function(name) {
                return name.replace(/^\w/, function(match) { return match.toUpperCase(); });
            },
        
            //changes a value based on the type
            compare:function(value, types, state) {
                var result = framework.util.when(value, types, state);
                return result == true ? result : false;
            },
            
            //performs the correct action depending on the type
            when:function(value, types, state) {

                //get the kind of object this is
                var kind = framework.util.getType(value);
                
                //check each of the types
                for (var item in types) {
                    if (!types.hasOwnProperty(item)) continue;
                    var type = framework.type[item];
                    if (type == kind) { 
                        return types[item].apply(state, [value]); 
                    }
                }
                
                //if there is a fallback comparison
                if (types.other) { return types.other.apply(state, [value]); }
                
                //no matches were found
                return null;
            },
        
            //performs an action on each item in a collection
            each:function(collection, action) {
                var index = 0;
                for(var item in collection){
                    if (collection.hasOwnProperty(item)) action(collection[item], index++);
                }
            },
            
            //performs an action to each item in a collection and then returns the items
            grab:function(collection, action) {
                var list = [];
                framework.util.each(collection, function(item) {
                    list.push(action(item));
                });
                return list;
            },
            
            //performs an action on each item in a collection
            until:function(collection, action) {
                for(var item = 0, l = collection.length; item < l; item++) {
                    var result = action(collection[item], item + 1);
                    if (result === true) { return true; }
                }
                return false;
            },
        
            //checks if the types match
            isType:function(type, value) {
                return framework.util.getType(value) == type;
            },
            
            //finds the type for an object
            getType:function(obj) {
            
                //check if this even has a value
                if (obj == null) { return framework.type.nothing; }
                
                //check each type except object
                for (var item in framework.library.types) {
                    if (framework.library.types[item](obj)) { return item; }
                }
                
                //no matching type was found
                return framework.type.object;
            },
            
            //grabs remaining elements from and array
            remaining:function(array, at) {
                var results = [];
                for(; at < array.length; at++) results.push(array[at]);
                return results;
            },
            
            //append items onto a target object
            apply:function(target, source) {
                for(var item in source) {
                    if (source.hasOwnProperty(item)) target[item] = source[item];
                }
                return target;
            },
            
            //performs sorting on a collection of records
            reorder:function(collection, fields, ignoreCase) {

                //reverses the fields so that they are organized
                //in the correct order
                return framework.util._performSort(collection, fields, ignoreCase);
            },
            
            //handles actual work of reordering (call reorder)
            _performSort:function(collection, fields, ignoreCase) {
            
                //get the next field to use
                var field = fields.splice(0, 1);
                if (field.length == 0) { return collection; }
                field = field[0];
                
                //get the name of the field and descending or not
                var invoked = framework.util.isType(framework.type.array, field);
                var name = (invoked ? field[0] : field);
                var desc = name.match(/^\-/);
                name = desc ? name.substr(1) : name;
                
                //updat the name if needed
                if (desc) { 
                    if (invoked) { field[0] = name; } else { field = name; }
                }
                
                //IE sorting bug resolved (Thanks @rizil)
                //http://webcache.googleusercontent.com/search?q=cache:www.zachleat.com/web/2010/02/24/array-sort/+zach+array+sort
                
                //create the sorting method for this field
                var sort = function(val1, val2) {
                
                    //find the values to compare
                    var a = framework.util.findValue(val1, field);
                    var b = framework.util.findValue(val2, field);
                    
                    //default to something when null
                    if (a == null && b == null) { a = 0; b = 0; }
                    else if (a == null && b != null) { a = 0; b = 1; }
                    else if (a != null && b == null) { a = 1; b = 0; }
                    
                    //check for string values
                    else if (ignoreCase && 
                        framework.util.isType(framework.type.string, a) && 
                        framework.util.isType(framework.type.string, b)) {
                        a = a.toLowerCase();
                        b = b.toLowerCase();
                    }
                    //if there is a length attribute use it instead
                    else if (a.length && b.length) {
                        a = a.length;
                        b = b.length;
                    }
                    
                    //perform the sorting
                    var result = (a < b) ? -1 : (a > b) ? 1 : 0;
                    return desc ? -result : result;
                
                };
                
                //then perform the sorting
                collection.sort(sort);
                
                //check for sub groups if required
                if (fields.length > 0) {
                
                    //create the container for the results
                    var sorted = [];
                    var groups = framework.util.group(collection, field, ignoreCase);
                    framework.util.each(groups, function(group) {
                        var listing = fields.slice();
                        var records = framework.util._performSort(group, listing, ignoreCase);
                        sorted = sorted.concat(records);
                    });
                    
                    //update the main collection
                    collection = sorted;
                }
                
                //the final results
                return collection;
            },
            
            //returns groups of unique field values
            group:function(records, field, ignoreCase) {
            
                //create a container to track group names
                var groups = {};
                for(var item = 0, l = records.length; item < l; item++) {
                    //get the values
                    var record = records[item];
                    var alias = framework.util.toString(framework.util.findValue(record, field));
                    alias = ignoreCase ? alias.toUpperCase() : alias;

                    //check for existing values
                    if (!groups[alias]) { 
                        groups[alias] = [record]; 
                    }
                    else {
                        groups[alias].push(record);
                    }
                    
                }
                
                //return the matches
                return groups;
            
            },
            
            //compares two values for equality
            equals:function(val1, val2, ignoreCase) {
                return framework.util.when(val1, {
                    string:function() {
                        return framework.util.regexMatch(
                            "^"+framework.util.regexEscape(val2)+"$", 
                            val1, 
                            ignoreCase); 
                    },
                    other:function() { return (val1 == null && val2 == null) || (val1 === val2); }
                });
            },
            
            //converts an object to an array of elements
            toArray:function(obj) {
                var items = [];
                if (obj.length) {
                    for (var i = 0; i < obj.length; i++) { items.push(obj[i]); }
                }
                else {
                    for (var item in obj) {
                        if (obj.hasOwnProperty(item)) items.push(obj[item]);
                    }
                }
                return items;
            },
            
            //converts a value into a string
            toString:function(val) {
                return val == null ? "" : val.toString();
            },
            
            //grabs a range of records from a collection
            skipTake:function(collection, action, skip, take) {
            
                //set the defaults
                skip = skip == null ? 0 : skip;
                take = take == null ? collection.length : take;
                
                //check if this will return any records
                if (skip >= collection.length || 
                    take == 0) {
                    return []; 
                }
            
                //return the results
                return framework.util.select(collection, action, skip, skip + take);
            },
            
            //grabs a range and format for records
            select:function(collection, action, start, end) {

                //grab the records if there is a range
                start = start == null ? 0 : start;
                end = end == null ? collection.length : end;
                
                //slice the records
                var results = collection.slice(start, end);
                
                //check if this is a mapping method
                if (jLinq.util.isType(jLinq.type.object, action)) {
                    var map = action;
                    action = function(rec) {
                        
                        //map existing values or defaults
                        // TODO: tests do not cover this method!
                        var create = {};
                        for (var item in map) {
                            if (!map.hasOwnProperty(item)) continue;
                            create[item] = rec[item]
                                ? rec[item]
                                : map[item];
                        }
                        
                        //return the created record
                        return create;
                    
                    };
                };
                
                //if there is a selection method, use it
                if (jLinq.util.isType(jLinq.type.method, action)) {
                    for (var i = 0; i < results.length; i++) {
                        var record = results[i];
                        results[i] = action.apply(record, [record]);
                    }
                }
                
                //return the final set of records
                return results;
            }
            
        }
    
    };
    
    //default types
    framework.library.addType(framework.type.nothing, function(value) { return value == null; });
    framework.library.addType(framework.type.array, function(value) { return value instanceof Array; });
    framework.library.addType(framework.type.string, function(value) { return value.substr && value.toLowerCase; });
    framework.library.addType(framework.type.number, function(value) { return value.toFixed && value.toExponential; });
    framework.library.addType(framework.type.regex, function(value) { return value instanceof RegExp; });
    framework.library.addType(framework.type.bool, function(value) { return value == true || value == false; });
    framework.library.addType(framework.type.method, function(value) { return value instanceof Function; });
    framework.library.addType(framework.type.datetime, function(value) { return value instanceof Date; });
    
    //add the default methods
    framework.library.extend([
    
        //sets a query to ignore case
        { name:"ignoreCase", type:framework.command.action, 
            method:function() {
                this.ignoreCase = true;
            }},
            
        //reverses the current set of records
        { name:"reverse", type:framework.command.action, 
            method:function() {
                this.records.reverse();
            }},
            
        //sets a query to evaluate case
        { name:"useCase", type:framework.command.action, 
            method:function() {
                this.ignoreCase = false;
            }},
            
        //performs an action for each record
        { name:"each", type:framework.command.action,
            method:function(action) {
                jLinq.util.each(this.records, function(record) { action(record); });
            }},
            
        //attaches a value or result of a method to each record
        { name:"attach", type:framework.command.action,
            method:function(field, action) {
                this.when(action, {
                    method:function() { jLinq.util.each(this.records, function(record) { record[field] = action(record); }); },
                    other:function() { jLinq.util.each(this.records, function(record) { record[field] = action; }); }
                });
            }},
            
        //joins two sets of records by the key information provided
        { name:"join", type:framework.command.action,
            method:function(source, alias, pk, fk) {
                jLinq.util.each(this.records, function(record) {
                    record[alias] = jLinq.from(source).equals(fk, record[pk]).select();
                });
            }},
            
        //joins a second array but uses only the first matched record. Allows for a default for a fallback value
        { name:"assign", type:framework.command.action,
            method:function(source, alias, pk, fk, fallback) {
                jLinq.util.each(this.records, function(record) {
                    record[alias] = jLinq.from(source).equals(fk, record[pk]).first(fallback);
                });
            }},
            
        //joins two sets of records by the key information provided
        { name:"sort", type:framework.command.action,
            method:function() {
                var args = jLinq.util.toArray(arguments);
                this.records = jLinq.util.reorder(this.records, args, this.ignoreCase);
            }},
    
        //are the two values the same
        { name:"equals", type:framework.command.query, 
            method:function(value) {
                return jLinq.util.equals(this.value, value, this.ignoreCase);
            }},
            
        //does this start with a value
        { name:"starts", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { return jLinq.util.equals(this.value[0], value, this.ignoreCase); },
                    other:function() { return jLinq.util.regexMatch(("^"+jLinq.util.regexEscape(value)), this.value, this.ignoreCase); }
                });
            }},
            
        //does this start with a value
        { name:"ends", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { return jLinq.util.equals(this.value[this.value.length - 1], value, this.ignoreCase); },
                    other:function() { return jLinq.util.regexMatch((jLinq.util.regexEscape(value)+"$"), this.value, this.ignoreCase); }
                });
            }},
            
        //does this start with a value
        { name:"contains", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { 
                        var ignoreCase = this.ignoreCase;
                        return jLinq.util.until(this.value, function(item) { return jLinq.util.equals(item, value, ignoreCase); }); 
                    },
                    other:function() { return jLinq.util.regexMatch(jLinq.util.regexEscape(value), this.value, this.ignoreCase); }
                });
            }},
            
        //does this start with a value
        { name:"match", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { 
                        var ignoreCase = this.ignoreCase;
                        return jLinq.util.until(this.value, function(item) { return jLinq.util.regexMatch(value, item, ignoreCase); }); 
                    },
                    other:function() { return jLinq.util.regexMatch(value, this.value, this.ignoreCase); }
                });
            }},
            
        //checks if the value matches the type provided
        { name:"type", type:framework.command.query, 
            method:function(type) {
                return jLinq.util.isType(type, this.value);
            }},
            
        //is the value greater than the argument
        { name:"greater", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { return this.value.length > value; },
                    string:function() { return this.value.length > value; },
                    other:function() { return this.value > value; }
                });
            }},
            
        //is the value greater than or equal to the argument
        { name:"greaterEquals", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { return this.value.length >= value; },
                    string:function() { return this.value.length >= value; },
                    other:function() { return this.value >= value; }
                });
            }},
            
        //is the value less than the argument
        { name:"less", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { return this.value.length < value; },
                    string:function() { return this.value.length < value; },
                    other:function() { return this.value < value; }
                });
            }},
            
        //is the value less than or equal to the argument
        { name:"lessEquals", type:framework.command.query, 
            method:function(value) {
                return this.compare({
                    array:function() { return this.value.length <= value; },
                    string:function() { return this.value.length <= value; },
                    other:function() { return this.value <= value; }
                });
            }},
            
        //is the value between the values provided
        { name:"between", type:framework.command.query, 
            method:function(low, high) {
                return this.compare({
                    array:function() { return this.value.length > low && this.value.length < high; },
                    string:function() { return this.value.length > low && this.value.length < high; },
                    other:function() { return this.value > low && this.value < high; }
                });
            }},
            
        //is the value between or equal to the values provided
        { name:"betweenEquals", type:framework.command.query, 
            method:function(low, high) {
                return this.compare({
                    array:function() { return this.value.length >= low && this.value.length <= high; },
                    string:function() { return this.value.length >= low && this.value.length <= high; },
                    other:function() { return this.value >= low && this.value <= high; }
                });
            }},
            
        //returns if a value is null or contains nothing
        { name:"empty", type:framework.command.query, 
            method:function() {
                return this.compare({
                    array:function() { return this.value.length == 0; },
                    string:function() { return jLinq.util.trim(this.value).length == 0; },
                    other:function() { return this.value == null; }
                });
            }},
            
        //returns if a value is true or exists
        { name:"is", type:framework.command.query, 
            method:function() {
                return this.compare({
                    bool:function() { return this.value === true; },
                    other:function() { return this.value != null; }
                });
            }},
        
        //gets the smallest value from the collection
        { name:"min", type:framework.command.select,
            method:function(field) {
                var matches = jLinq.util.reorder(this.records, [field], this.ignoreCase);
                return jLinq.util.elementAt(matches, 0);
            }},
            
        //gets the largest value from the collection
        { name:"max", type:framework.command.select,
            method:function(field) {
                var matches = jLinq.util.reorder(this.records, [field], this.ignoreCase);
                return jLinq.util.elementAt(matches, matches.length - 1);
            }},
            
        //returns the sum of the values of the field
        { name:"sum", type:framework.command.select,
            method:function(field) {
                var sum; 
                jLinq.util.each(this.records, function(record) {
                    var value = jLinq.util.findValue(record, field);
                    sum = sum == null ? value : (sum + value);
                });
                return sum;
            }},
            
        //returns the sum of the values of the field
        { name:"average", type:framework.command.select,
            method:function(field) {
                var sum; 
                jLinq.util.each(this.records, function(record) {
                    var value = jLinq.util.findValue(record, field);
                    sum = sum == null ? value : (sum + value);
                });
                return sum / this.records.length;
            }},
                
        //skips the requested number of records
        { name:"skip", type:framework.command.select,
            method:function(skip, selection) {
                this.records = this.when(selection, {
                    method:function() { return jLinq.util.skipTake(this.records, selection, skip, null); },
                    object:function() { return jLinq.util.skipTake(this.records, selection, skip, null); },
                    other:function() { return jLinq.util.skipTake(this.records, null, skip, null); }
                });
                return this.query;
            }},
            
        //takes the requested number of records
        { name:"take", type:framework.command.select,
            method:function(take, selection) {
                return this.when(selection, {
                    method:function() { return jLinq.util.skipTake(this.records, selection, null, take); },
                    object:function() { return jLinq.util.skipTake(this.records, selection, null, take); },
                    other:function() { return jLinq.util.skipTake(this.records, null, null, take); }
                });
            }},
            
        //skips and takes records
        { name:"skipTake", type:framework.command.select,
            method:function(skip, take, selection) {
                return this.when(selection, {
                    method:function() { return jLinq.util.skipTake(this.records, selection, skip, take); },
                    object:function() { return jLinq.util.skipTake(this.records, selection, skip, take); },
                    other:function() { return jLinq.util.skipTake(this.records, null, skip, take); }
                });
            }},
            
        //selects the remaining records
        { name:"select", type:framework.command.select,
            method:function(selection) {
                return this.when(selection, {
                    method:function() { return jLinq.util.select(this.records, selection); },
                    object:function() { return jLinq.util.select(this.records, selection); },
                    other:function() { return this.records; }
                });
            }},
            
        //selects all of the distinct values for a field
        { name:"distinct", type:framework.command.select,
            method:function(field) {
                var groups = jLinq.util.group(this.records, field, this.ignoreCase);
                return jLinq.util.grab(groups, function(record) {
                    return jLinq.util.findValue(record[0], field);
                });
            }},
            
        //groups the values of a field by unique values
        { name:"group", type:framework.command.select,
            method:function(field) {
                return jLinq.util.group(this.records, field, this.ignoreCase);
            }},
            
        //selects records into a new format
        { name:"define", type:framework.command.select,
            method:function(selection) {
                var results = this.when(selection, {
                    method:function() { return jLinq.util.select(this.records, selection); },
                    object:function() { return jLinq.util.select(this.records, selection); },
                    other:function() { return this.records; }
                });
                return jLinq.from(results);
            }},
            
        //returns if a collection contains any records
        { name:"any", type:framework.command.select,
            method:function() {
                return this.records.length > 0;
            }},
            
        //returns if no records matched this query
        { name:"none", type:framework.command.select,
            method:function() {
                return this.records.length == 0;
            }},
            
        //returns if all records matched the query
        { name:"all", type:framework.command.select,
            method:function() {
                return this.removed.length == 0;
            }},
                
        //returns the first record found or the fallback value if nothing was found
        { name:"first", type:framework.command.select,
            method:function(fallback) {
                var record = jLinq.util.elementAt(this.records, 0);
                return record == null ? fallback : record;
            }},
            
        //returns the last record found or the fallback value if nothing was found
        { name:"last", type:framework.command.select,
            method:function(fallback) {
                var record = jLinq.util.elementAt(this.records, this.records.length - 1);
                return record == null ? fallback : record;
            }},
            
        //returns the record at the provided index or the fallback value if nothing was found
        { name:"at", type:framework.command.select,
            method:function(index, fallback) {
                var record = jLinq.util.elementAt(this.records, index);
                return record == null ? fallback : record;
            }},
                    
        //returns the remaining count of records
        { name:"count", type:framework.command.select,
            method:function() {
                return this.records.length;
            }},
            
        //selects the remaining records
        { name:"removed", type:framework.command.select,
            method:function(selection) {
                return this.when(selection, {
                    method:function() { return jLinq.util.select(this.removed, selection); },
                    object:function() { return jLinq.util.select(this.removed, selection); },
                    other:function() { return this.removed; }
                });
            }},
            
        //performs a manual comparison of records
        { name:"where", type:framework.command.select, 
            method:function(compare) {
                
                //filter the selection
                var state = this;
                var matches = [];
                jLinq.util.each(this.records, function(record) {
                    if (compare.apply(state, [record]) === true) { matches.push(record); }
                });
                
                //create a new query with matching arguments
                var query = jLinq.from(matches);
                if (!this.ignoreCase) { query.useCase(); }
                return query;
            }}
            
        ]);
    
    //set the public object
    jLinq = {
    
        //determines if new queries should always be
        //cloned to prevent accidental changes to objects
        alwaysClone:false,
        
        //sets the default for jLinq query case checking
        ignoreCase:true,
    
        //command types (select, query, action)
        command:framework.command,
        
        //types of object and values
        type:framework.type,
        
        //allows command to be added to the library
        extend:function() { framework.library.extend.apply(null, arguments); },
        
        //core function to start and entirely new query
        query:function(collection, params) { 
            return library.framework.query(collection, params); 
        },
        
        //starts a new query with the array provided
        from:function(collection) { 
            return framework.library.query(collection, { clone:false });
        },
        
        //returns a list of commands in the library
        getCommands:function() {
            return framework.util.grab(framework.library.commands, function(command) {
                return {
                    name:command.name,
                    typeId:command.type,
                    type:command.type == framework.command.select ? "select"
                        : command.type == framework.command.query ? "query"
                        : command.type == framework.command.action ? "action"
                        : "unknown"
                };
            });
        },
        
        //helper functions for jLinq
        util:{
        
            //removes leading and trailing spaces
            trim:framework.util.trim,
        
            //loops and finds a value in an object from a path
            findValue:framework.util.findValue,
        
            //gets an element at the specified index (if any)
            elementAt:framework.util.elementAt,
        
            //returns a regex safe version of a string
            regexEscape:framework.util.regexEscape,
            
            //compares an expression to another string
            regexMatch:framework.util.regexMatch,
        
            //compares equality of two objects
            equals:framework.util.equals,
            
            //gets groups for a collection
            group:framework.util.group,
            
            //updates the order of a collection
            reorder:framework.util.reorder,
            
            //performs a function when a value matches a type
            when:framework.util.when,
            
            //converts an object to an array of values
            toArray:framework.util.toArray,
            
            //loops for each record in a set
            each:framework.util.each,
            
            //grabs a collection of items
            grab:framework.util.grab,
            
            //loops records until one returns true or the end is reached
            until:framework.util.until,
            
            //returns if an object is the provided type
            isType:framework.util.isType,
            
            //determines the matching type for a value
            getType:framework.util.getType,
            
            //applies each source property to the target
            apply:framework.util.apply,
            
            //uses the action to select items from a collection
            select:framework.util.select,
            
            //grabs records for a specific range
            skipTake:framework.util.skipTake
            
        }
    };
    
    //set the other aliases
    jlinq = jLinq;
    jl = jLinq;
})();

/*! jquery.swipeButton.js - v1.2.0 - 2012-05-31
* http://andymatthews.net/code/swipebutton/
* Copyright (c) 2012 andy matthews; Licensed MIT, GPL */

(function($){

	$.fn.swipeDelete = function(o){

		o = $.extend( {}, $.fn.swipeDelete.defaults, o );

        return $('[data-swipe]', this).each(function(i, el){
			var $e = $(el);
			var $parent = $(el).parent('ul');

			$e.on(o.direction, function ( e ) {

				// reference the current item
				var $li = $(this).parent(),
				    cnt = $('.ui-btn', $li).length,
                    hasClassArrow = $li.hasClass('arrow'),
                    btnClass = (o.btnClass === 'redButton') 
                        ? o.btnClass
                        : 'redButton';

                if (hasClassArrow) {
                    $li.removeClass('arrow');
                }

				// remove all currently displayed buttons
				$('div.ui-btn > .' + btnClass).animate({ width: '0px' }, 100, 'ease-in', function(e) {
					$(this).parent().remove();
                    $li.addClass('arrow');
                    $('a', $li).data('link', $li.data('link'));
				});

				// if there's an existing button we simply delete it, then stop
				if (!cnt) {
					// create button
					var $swipeBtn = $('<a>' + o.btnLabel + '</a>').attr({'class': btnClass + ' aSwipeBtn'})
                                    .on('click', o.click); // 'click tap'
                                    
					// slide insert button into list item
					$swipeBtn.prependTo($li).wrap('<div class="ui-btn"></div>');
					$li.find('.ui-btn > .' + btnClass).animate({ width: '45px' }, 100);

                    $li.data('link', $('a[data-link]', $li).data('link'));
                    $('a[data-link]', $li).data('link', '');

					// override row click
					$($li).on('tap', function(e){
						e.stopPropagation();
						e.preventDefault();
                        return false;
					});

				}
			});
		});
	};

	$.fn.swipeDelete.defaults = {
		direction: 'swipeRight',
		btnLabel: 'Delete',
        btnClass: 'redButton',
		click: function(e){
			e.preventDefault();
			$(this).parents('li').slideUp();
		}
	};

}($));
/**
 * Version: 1.0 Alpha-1 
 * Build Date: 13-Nov-2007
 * Copyright (c) 2006-2007, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * Website: http://www.datejs.com/ or http://www.coolite.com/datejs/
 */
Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|after|from)/i,subtract:/^(\-|before|ago)/i,yesterday:/^yesterday/i,today:/^t(oday)?/i,tomorrow:/^tomorrow/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^min(ute)?s?/i,hour:/^h(ou)?rs?/i,week:/^w(ee)?k/i,month:/^m(o(nth)?s?)?/i,day:/^d(ays?)?/i,year:/^y((ea)?rs?)?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a|p)/i},abbreviatedTimeZoneStandard:{GMT:"-000",EST:"-0400",CST:"-0500",MST:"-0600",PST:"-0700"},abbreviatedTimeZoneDST:{GMT:"-000",EDT:"-0500",CDT:"-0600",MDT:"-0700",PDT:"-0800"}};
Date.getMonthNumberFromName=function(name){var n=Date.CultureInfo.monthNames,m=Date.CultureInfo.abbreviatedMonthNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.getDayNumberFromName=function(name){var n=Date.CultureInfo.dayNames,m=Date.CultureInfo.abbreviatedDayNames,o=Date.CultureInfo.shortestDayNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.isLeapYear=function(year){return(((year%4===0)&&(year%100!==0))||(year%400===0));};Date.getDaysInMonth=function(year,month){return[31,(Date.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month];};Date.getTimezoneOffset=function(s,dst){return(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];};Date.getTimezoneAbbreviation=function(offset,dst){var n=(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,p;for(p in n){if(n[p]===offset){return p;}}
return null;};Date.prototype.clone=function(){return new Date(this.getTime());};Date.prototype.compareTo=function(date){if(isNaN(this)){throw new Error(this);}
if(date instanceof Date&&!isNaN(date)){return(this>date)?1:(this<date)?-1:0;}else{throw new TypeError(date);}};Date.prototype.equals=function(date){return(this.compareTo(date)===0);};Date.prototype.between=function(start,end){var t=this.getTime();return t>=start.getTime()&&t<=end.getTime();};Date.prototype.addMilliseconds=function(value){this.setMilliseconds(this.getMilliseconds()+value);return this;};Date.prototype.addSeconds=function(value){return this.addMilliseconds(value*1000);};Date.prototype.addMinutes=function(value){return this.addMilliseconds(value*60000);};Date.prototype.addHours=function(value){return this.addMilliseconds(value*3600000);};Date.prototype.addDays=function(value){return this.addMilliseconds(value*86400000);};Date.prototype.addWeeks=function(value){return this.addMilliseconds(value*604800000);};Date.prototype.addMonths=function(value){var n=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+value);this.setDate(Math.min(n,this.getDaysInMonth()));return this;};Date.prototype.addYears=function(value){return this.addMonths(value*12);};Date.prototype.add=function(config){if(typeof config=="number"){this._orient=config;return this;}
var x=config;if(x.millisecond||x.milliseconds){this.addMilliseconds(x.millisecond||x.milliseconds);}
if(x.second||x.seconds){this.addSeconds(x.second||x.seconds);}
if(x.minute||x.minutes){this.addMinutes(x.minute||x.minutes);}
if(x.hour||x.hours){this.addHours(x.hour||x.hours);}
if(x.month||x.months){this.addMonths(x.month||x.months);}
if(x.year||x.years){this.addYears(x.year||x.years);}
if(x.day||x.days){this.addDays(x.day||x.days);}
return this;};Date._validate=function(value,min,max,name){if(typeof value!="number"){throw new TypeError(value+" is not a Number.");}else if(value<min||value>max){throw new RangeError(value+" is not a valid value for "+name+".");}
return true;};Date.validateMillisecond=function(n){return Date._validate(n,0,999,"milliseconds");};Date.validateSecond=function(n){return Date._validate(n,0,59,"seconds");};Date.validateMinute=function(n){return Date._validate(n,0,59,"minutes");};Date.validateHour=function(n){return Date._validate(n,0,23,"hours");};Date.validateDay=function(n,year,month){return Date._validate(n,1,Date.getDaysInMonth(year,month),"days");};Date.validateMonth=function(n){return Date._validate(n,0,11,"months");};Date.validateYear=function(n){return Date._validate(n,1,9999,"seconds");};Date.prototype.set=function(config){var x=config;if(!x.millisecond&&x.millisecond!==0){x.millisecond=-1;}
if(!x.second&&x.second!==0){x.second=-1;}
if(!x.minute&&x.minute!==0){x.minute=-1;}
if(!x.hour&&x.hour!==0){x.hour=-1;}
if(!x.day&&x.day!==0){x.day=-1;}
if(!x.month&&x.month!==0){x.month=-1;}
if(!x.year&&x.year!==0){x.year=-1;}
if(x.millisecond!=-1&&Date.validateMillisecond(x.millisecond)){this.addMilliseconds(x.millisecond-this.getMilliseconds());}
if(x.second!=-1&&Date.validateSecond(x.second)){this.addSeconds(x.second-this.getSeconds());}
if(x.minute!=-1&&Date.validateMinute(x.minute)){this.addMinutes(x.minute-this.getMinutes());}
if(x.hour!=-1&&Date.validateHour(x.hour)){this.addHours(x.hour-this.getHours());}
if(x.month!==-1&&Date.validateMonth(x.month)){this.addMonths(x.month-this.getMonth());}
if(x.year!=-1&&Date.validateYear(x.year)){this.addYears(x.year-this.getFullYear());}
if(x.day!=-1&&Date.validateDay(x.day,this.getFullYear(),this.getMonth())){this.addDays(x.day-this.getDate());}
if(x.timezone){this.setTimezone(x.timezone);}
if(x.timezoneOffset){this.setTimezoneOffset(x.timezoneOffset);}
return this;};Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this;};Date.prototype.isLeapYear=function(){var y=this.getFullYear();return(((y%4===0)&&(y%100!==0))||(y%400===0));};Date.prototype.isWeekday=function(){return!(this.is().sat()||this.is().sun());};Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth());};Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1});};Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()});};Date.prototype.moveToDayOfWeek=function(day,orient){var diff=(day-this.getDay()+7*(orient||+1))%7;return this.addDays((diff===0)?diff+=7*(orient||+1):diff);};Date.prototype.moveToMonth=function(month,orient){var diff=(month-this.getMonth()+12*(orient||+1))%12;return this.addMonths((diff===0)?diff+=12*(orient||+1):diff);};Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/86400000);};Date.prototype.getWeekOfYear=function(firstDayOfWeek){var y=this.getFullYear(),m=this.getMonth(),d=this.getDate();var dow=firstDayOfWeek||Date.CultureInfo.firstDayOfWeek;var offset=7+1-new Date(y,0,1).getDay();if(offset==8){offset=1;}
var daynum=((Date.UTC(y,m,d,0,0,0)-Date.UTC(y,0,1,0,0,0))/86400000)+1;var w=Math.floor((daynum-offset+7)/7);if(w===dow){y--;var prevOffset=7+1-new Date(y,0,1).getDay();if(prevOffset==2||prevOffset==8){w=53;}else{w=52;}}
return w;};Date.prototype.isDST=function(){console.log('isDST');return this.toString().match(/(E|C|M|P)(S|D)T/)[2]=="D";};Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST());};Date.prototype.setTimezoneOffset=function(s){var here=this.getTimezoneOffset(),there=Number(s)*-6/10;this.addMinutes(there-here);return this;};Date.prototype.setTimezone=function(s){return this.setTimezoneOffset(Date.getTimezoneOffset(s));};Date.prototype.getUTCOffset=function(){var n=this.getTimezoneOffset()*-10/6,r;if(n<0){r=(n-10000).toString();return r[0]+r.substr(2);}else{r=(n+10000).toString();return"+"+r.substr(1);}};Date.prototype.getDayName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()];};Date.prototype.getMonthName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()];};Date.prototype._toString=Date.prototype.toString;Date.prototype.toString=function(format){var self=this;var p=function p(s){return(s.toString().length==1)?"0"+s:s;};return format?format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(format){switch(format){case"hh":return p(self.getHours()<13?self.getHours():(self.getHours()-12));case"h":return self.getHours()<13?self.getHours():(self.getHours()-12);case"HH":return p(self.getHours());case"H":return self.getHours();case"mm":return p(self.getMinutes());case"m":return self.getMinutes();case"ss":return p(self.getSeconds());case"s":return self.getSeconds();case"yyyy":return self.getFullYear();case"yy":return self.getFullYear().toString().substring(2,4);case"dddd":return self.getDayName();case"ddd":return self.getDayName(true);case"dd":return p(self.getDate());case"d":return self.getDate().toString();case"MMMM":return self.getMonthName();case"MMM":return self.getMonthName(true);case"MM":return p((self.getMonth()+1));case"M":return self.getMonth()+1;case"t":return self.getHours()<12?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);case"tt":return self.getHours()<12?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;case"zzz":case"zz":case"z":return"";}}):this._toString();};
Date.now=function(){return new Date();};Date.today=function(){return Date.now().clearTime();};Date.prototype._orient=+1;Date.prototype.next=function(){this._orient=+1;return this;};Date.prototype.last=Date.prototype.prev=Date.prototype.previous=function(){this._orient=-1;return this;};Date.prototype._is=false;Date.prototype.is=function(){this._is=true;return this;};Number.prototype._dateElement="day";Number.prototype.fromNow=function(){var c={};c[this._dateElement]=this;return Date.now().add(c);};Number.prototype.ago=function(){var c={};c[this._dateElement]=this*-1;return Date.now().add(c);};(function(){var $D=Date.prototype,$N=Number.prototype;var dx=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),mx=("january february march april may june july august september october november december").split(/\s/),px=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),de;var df=function(n){return function(){if(this._is){this._is=false;return this.getDay()==n;}
return this.moveToDayOfWeek(n,this._orient);};};for(var i=0;i<dx.length;i++){$D[dx[i]]=$D[dx[i].substring(0,3)]=df(i);}
var mf=function(n){return function(){if(this._is){this._is=false;return this.getMonth()===n;}
return this.moveToMonth(n,this._orient);};};for(var j=0;j<mx.length;j++){$D[mx[j]]=$D[mx[j].substring(0,3)]=mf(j);}
var ef=function(j){return function(){if(j.substring(j.length-1)!="s"){j+="s";}
return this["add"+j](this._orient);};};var nf=function(n){return function(){this._dateElement=n;return this;};};for(var k=0;k<px.length;k++){de=px[k].toLowerCase();$D[de]=$D[de+"s"]=ef(px[k]);$N[de]=$N[de+"s"]=nf(de);}}());Date.prototype.toJSONString=function(){return this.toString("yyyy-MM-ddThh:mm:ssZ");};Date.prototype.toShortDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern);};Date.prototype.toLongDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.longDatePattern);};Date.prototype.toShortTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern);};Date.prototype.toLongTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.longTimePattern);};Date.prototype.getOrdinal=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};
(function(){Date.Parsing={Exception:function(s){this.message="Parse error at '"+s.substring(0,10)+" ...'";}};var $P=Date.Parsing;var _=$P.Operators={rtoken:function(r){return function(s){var mx=s.match(r);if(mx){return([mx[0],s.substring(mx[0].length)]);}else{throw new $P.Exception(s);}};},token:function(s){return function(s){return _.rtoken(new RegExp("^\s*"+s+"\s*"))(s);};},stoken:function(s){return _.rtoken(new RegExp("^"+s));},until:function(p){return function(s){var qx=[],rx=null;while(s.length){try{rx=p.call(this,s);}catch(e){qx.push(rx[0]);s=rx[1];continue;}
break;}
return[qx,s];};},many:function(p){return function(s){var rx=[],r=null;while(s.length){try{r=p.call(this,s);}catch(e){return[rx,s];}
rx.push(r[0]);s=r[1];}
return[rx,s];};},optional:function(p){return function(s){var r=null;try{r=p.call(this,s);}catch(e){return[null,s];}
return[r[0],r[1]];};},not:function(p){return function(s){try{p.call(this,s);}catch(e){return[null,s];}
throw new $P.Exception(s);};},ignore:function(p){return p?function(s){var r=null;r=p.call(this,s);return[null,r[1]];}:null;},product:function(){var px=arguments[0],qx=Array.prototype.slice.call(arguments,1),rx=[];for(var i=0;i<px.length;i++){rx.push(_.each(px[i],qx));}
return rx;},cache:function(rule){var cache={},r=null;return function(s){try{r=cache[s]=(cache[s]||rule.call(this,s));}catch(e){r=cache[s]=e;}
if(r instanceof $P.Exception){throw r;}else{return r;}};},any:function(){var px=arguments;return function(s){var r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){r=null;}
if(r){return r;}}
throw new $P.Exception(s);};},each:function(){var px=arguments;return function(s){var rx=[],r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){throw new $P.Exception(s);}
rx.push(r[0]);s=r[1];}
return[rx,s];};},all:function(){var px=arguments,_=_;return _.each(_.optional(px));},sequence:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;if(px.length==1){return px[0];}
return function(s){var r=null,q=null;var rx=[];for(var i=0;i<px.length;i++){try{r=px[i].call(this,s);}catch(e){break;}
rx.push(r[0]);try{q=d.call(this,r[1]);}catch(ex){q=null;break;}
s=q[1];}
if(!r){throw new $P.Exception(s);}
if(q){throw new $P.Exception(q[1]);}
if(c){try{r=c.call(this,r[1]);}catch(ey){throw new $P.Exception(r[1]);}}
return[rx,(r?r[1]:s)];};},between:function(d1,p,d2){d2=d2||d1;var _fn=_.each(_.ignore(d1),p,_.ignore(d2));return function(s){var rx=_fn.call(this,s);return[[rx[0][0],r[0][2]],rx[1]];};},list:function(p,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return(p instanceof Array?_.each(_.product(p.slice(0,-1),_.ignore(d)),p.slice(-1),_.ignore(c)):_.each(_.many(_.each(p,_.ignore(d))),px,_.ignore(c)));},set:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return function(s){var r=null,p=null,q=null,rx=null,best=[[],s],last=false;for(var i=0;i<px.length;i++){q=null;p=null;r=null;last=(px.length==1);try{r=px[i].call(this,s);}catch(e){continue;}
rx=[[r[0]],r[1]];if(r[1].length>0&&!last){try{q=d.call(this,r[1]);}catch(ex){last=true;}}else{last=true;}
if(!last&&q[1].length===0){last=true;}
if(!last){var qx=[];for(var j=0;j<px.length;j++){if(i!=j){qx.push(px[j]);}}
p=_.set(qx,d).call(this,q[1]);if(p[0].length>0){rx[0]=rx[0].concat(p[0]);rx[1]=p[1];}}
if(rx[1].length<best[1].length){best=rx;}
if(best[1].length===0){break;}}
if(best[0].length===0){return best;}
if(c){try{q=c.call(this,best[1]);}catch(ey){throw new $P.Exception(best[1]);}
best[1]=q[1];}
return best;};},forward:function(gr,fname){return function(s){return gr[fname].call(this,s);};},replace:function(rule,repl){return function(s){var r=rule.call(this,s);return[repl,r[1]];};},process:function(rule,fn){return function(s){var r=rule.call(this,s);return[fn.call(this,r[0]),r[1]];};},min:function(min,rule){return function(s){var rx=rule.call(this,s);if(rx[0].length<min){throw new $P.Exception(s);}
return rx;};}};var _generator=function(op){return function(){var args=null,rx=[];if(arguments.length>1){args=Array.prototype.slice.call(arguments);}else if(arguments[0]instanceof Array){args=arguments[0];}
if(args){for(var i=0,px=args.shift();i<px.length;i++){args.unshift(px[i]);rx.push(op.apply(null,args));args.shift();return rx;}}else{return op.apply(null,arguments);}};};var gx="optional not ignore cache".split(/\s/);for(var i=0;i<gx.length;i++){_[gx[i]]=_generator(_[gx[i]]);}
var _vector=function(op){return function(){if(arguments[0]instanceof Array){return op.apply(null,arguments[0]);}else{return op.apply(null,arguments);}};};var vx="each any all".split(/\s/);for(var j=0;j<vx.length;j++){_[vx[j]]=_vector(_[vx[j]]);}}());(function(){var flattenAndCompact=function(ax){var rx=[];for(var i=0;i<ax.length;i++){if(ax[i]instanceof Array){rx=rx.concat(flattenAndCompact(ax[i]));}else{if(ax[i]){rx.push(ax[i]);}}}
return rx;};Date.Grammar={};Date.Translator={hour:function(s){return function(){this.hour=Number(s);};},minute:function(s){return function(){this.minute=Number(s);};},second:function(s){return function(){this.second=Number(s);};},meridian:function(s){return function(){this.meridian=s.slice(0,1).toLowerCase();};},timezone:function(s){return function(){var n=s.replace(/[^\d\+\-]/g,"");if(n.length){this.timezoneOffset=Number(n);}else{this.timezone=s.toLowerCase();}};},day:function(x){var s=x[0];return function(){this.day=Number(s.match(/\d+/)[0]);};},month:function(s){return function(){this.month=((s.length==3)?Date.getMonthNumberFromName(s):(Number(s)-1));};},year:function(s){return function(){var n=Number(s);this.year=((s.length>2)?n:(n+(((n+2000)<Date.CultureInfo.twoDigitYearMax)?2000:1900)));};},rday:function(s){return function(){switch(s){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break;}};},finishExact:function(x){x=(x instanceof Array)?x:[x];var now=new Date();this.year=now.getFullYear();this.month=now.getMonth();this.day=1;this.hour=0;this.minute=0;this.second=0;for(var i=0;i<x.length;i++){if(x[i]){x[i].call(this);}}
this.hour=(this.meridian=="p"&&this.hour<13)?this.hour+12:this.hour;if(this.day>Date.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.");}
var r=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){r.set({timezone:this.timezone});}else if(this.timezoneOffset){r.set({timezoneOffset:this.timezoneOffset});}
return r;},finish:function(x){x=(x instanceof Array)?flattenAndCompact(x):[x];if(x.length===0){return null;}
for(var i=0;i<x.length;i++){if(typeof x[i]=="function"){x[i].call(this);}}
if(this.now){return new Date();}
var today=Date.today();var method=null;var expression=!!(this.days!=null||this.orient||this.operator);if(expression){var gap,mod,orient;orient=((this.orient=="past"||this.operator=="subtract")?-1:1);if(this.weekday){this.unit="day";gap=(Date.getDayNumberFromName(this.weekday)-today.getDay());mod=7;this.days=gap?((gap+(orient*mod))%mod):(orient*mod);}
if(this.month){this.unit="month";gap=(this.month-today.getMonth());mod=12;this.months=gap?((gap+(orient*mod))%mod):(orient*mod);this.month=null;}
if(!this.unit){this.unit="day";}
if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1;}
if(this.unit=="week"){this.unit="day";this.value=this.value*7;}
this[this.unit+"s"]=this.value*orient;}
return today.add(this);}else{if(this.meridian&&this.hour){this.hour=(this.hour<13&&this.meridian=="p")?this.hour+12:this.hour;}
if(this.weekday&&!this.day){this.day=(today.addDays((Date.getDayNumberFromName(this.weekday)-today.getDay()))).getDate();}
if(this.month&&!this.day){this.day=1;}
return today.set(this);}}};var _=Date.Parsing.Operators,g=Date.Grammar,t=Date.Translator,_fn;g.datePartDelimiter=_.rtoken(/^([\s\-\.\,\/\x27]+)/);g.timePartDelimiter=_.stoken(":");g.whiteSpace=_.rtoken(/^\s*/);g.generalDelimiter=_.rtoken(/^(([\s\,]|at|on)+)/);var _C={};g.ctoken=function(keys){var fn=_C[keys];if(!fn){var c=Date.CultureInfo.regexPatterns;var kx=keys.split(/\s+/),px=[];for(var i=0;i<kx.length;i++){px.push(_.replace(_.rtoken(c[kx[i]]),kx[i]));}
fn=_C[keys]=_.any.apply(null,px);}
return fn;};g.ctoken2=function(key){return _.rtoken(Date.CultureInfo.regexPatterns[key]);};g.h=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),t.hour));g.hh=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/),t.hour));g.H=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),t.hour));g.HH=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/),t.hour));g.m=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.minute));g.mm=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.minute));g.s=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.second));g.ss=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.second));g.hms=_.cache(_.sequence([g.H,g.mm,g.ss],g.timePartDelimiter));g.t=_.cache(_.process(g.ctoken2("shortMeridian"),t.meridian));g.tt=_.cache(_.process(g.ctoken2("longMeridian"),t.meridian));g.z=_.cache(_.process(_.rtoken(/^(\+|\-)?\s*\d\d\d\d?/),t.timezone));g.zz=_.cache(_.process(_.rtoken(/^(\+|\-)\s*\d\d\d\d/),t.timezone));g.zzz=_.cache(_.process(g.ctoken2("timezone"),t.timezone));g.timeSuffix=_.each(_.ignore(g.whiteSpace),_.set([g.tt,g.zzz]));g.time=_.each(_.optional(_.ignore(_.stoken("T"))),g.hms,g.timeSuffix);g.d=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.dd=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.ddd=g.dddd=_.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"),function(s){return function(){this.weekday=s;};}));g.M=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/),t.month));g.MM=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/),t.month));g.MMM=g.MMMM=_.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),t.month));g.y=_.cache(_.process(_.rtoken(/^(\d\d?)/),t.year));g.yy=_.cache(_.process(_.rtoken(/^(\d\d)/),t.year));g.yyy=_.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/),t.year));g.yyyy=_.cache(_.process(_.rtoken(/^(\d\d\d\d)/),t.year));_fn=function(){return _.each(_.any.apply(null,arguments),_.not(g.ctoken2("timeContext")));};g.day=_fn(g.d,g.dd);g.month=_fn(g.M,g.MMM);g.year=_fn(g.yyyy,g.yy);g.orientation=_.process(g.ctoken("past future"),function(s){return function(){this.orient=s;};});g.operator=_.process(g.ctoken("add subtract"),function(s){return function(){this.operator=s;};});g.rday=_.process(g.ctoken("yesterday tomorrow today now"),t.rday);g.unit=_.process(g.ctoken("minute hour day week month year"),function(s){return function(){this.unit=s;};});g.value=_.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/),function(s){return function(){this.value=s.replace(/\D/g,"");};});g.expression=_.set([g.rday,g.operator,g.value,g.unit,g.orientation,g.ddd,g.MMM]);_fn=function(){return _.set(arguments,g.datePartDelimiter);};g.mdy=_fn(g.ddd,g.month,g.day,g.year);g.ymd=_fn(g.ddd,g.year,g.month,g.day);g.dmy=_fn(g.ddd,g.day,g.month,g.year);g.date=function(s){return((g[Date.CultureInfo.dateElementOrder]||g.mdy).call(this,s));};g.format=_.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(fmt){if(g[fmt]){return g[fmt];}else{throw Date.Parsing.Exception(fmt);}}),_.process(_.rtoken(/^[^dMyhHmstz]+/),function(s){return _.ignore(_.stoken(s));}))),function(rules){return _.process(_.each.apply(null,rules),t.finishExact);});var _F={};var _get=function(f){return _F[f]=(_F[f]||g.format(f)[0]);};g.formats=function(fx){if(fx instanceof Array){var rx=[];for(var i=0;i<fx.length;i++){rx.push(_get(fx[i]));}
return _.any.apply(null,rx);}else{return _get(fx);}};g._formats=g.formats(["yyyy-MM-ddTHH:mm:ss","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","d"]);g._start=_.process(_.set([g.date,g.time,g.expression],g.generalDelimiter,g.whiteSpace),t.finish);g.start=function(s){try{var r=g._formats.call({},s);if(r[1].length===0){return r;}}catch(e){}
return g._start.call({},s);};}());Date._parse=Date.parse;Date.parse=function(s){var r=null;if(!s){return null;}
try{r=Date.Grammar.start.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};Date.getParseFunction=function(fx){var fn=Date.Grammar.formats(fx);return function(s){var r=null;try{r=fn.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};};Date.parseExact=function(s,fx){return Date.getParseFunction(fx)(s);};

/*!
 * Add to Homescreen v1.0.8 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(){
var nav = navigator,
	isIDevice = (/iphone|ipod|ipad/gi).test(nav.platform),
	isIPad = (/ipad/gi).test(nav.platform),
	isRetina = 'devicePixelRatio' in window && window.devicePixelRatio > 1,
	isSafari = nav.appVersion.match(/Safari/gi),
	hasHomescreen = 'standalone' in nav && isIDevice,
	isStandalone = hasHomescreen && nav.standalone,
	OSVersion = nav.appVersion.match(/OS \d+_\d+/g),
	platform = nav.platform.split(' ')[0],
	language = nav.language.replace('-', '_'),
	startY = 0,
	startX = 0,
	expired = 'localStorage' in window && typeof localStorage.getItem === 'function' ? localStorage.getItem('_addToHome') : null,
	theInterval, closeTimeout, el, i, l,
	options = {
		animationIn: 'drop',		// drop || bubble || fade
		animationOut: 'fade',		// drop || bubble || fade
		startDelay: 2000,			// 2 seconds from page load before the balloon appears
		lifespan: 20000,			// 20 seconds before it is automatically destroyed
		bottomOffset: 14,			// Distance of the balloon from bottom
		expire: 0,					// Minutes to wait before showing the popup again (0 = always displayed)
		message: '',				// Customize your message or force a language ('' = automatic)
		disableLoading: false,		// Disable loading of balloon
		touchIcon: false,			// Display the touch icon
		arrow: true,				// Display the balloon arrow
		iterations:100				// Internal/debug use
	},
	/* Message in various languages, en_us is the default if a language does not exist */
	intl = {
		ca_es: 'Per instal·lar aquesta aplicació al vostre %device premeu %icon i llavors <strong>Afegir a pantalla d\'inici</strong>.',
		da_dk: 'Tilføj denne side til din %device: tryk på %icon og derefter <strong>Tilføj til hjemmeskærm</strong>.',
		de_de: 'Installieren Sie diese App auf Ihrem %device: %icon antippen und dann <strong>Zum Home-Bildschirm</strong>.',
		el_gr: 'Εγκαταστήσετε αυτήν την Εφαρμογή στήν συσκευή σας %device: %icon μετά πατάτε <strong>Προσθήκη σε Αφετηρία</strong>.',
		en_us: 'Install this web app on your %device: tap %icon and then <strong>Add to Home Screen</strong>.',
		es_es: 'Para instalar esta app en su %device, pulse %icon y seleccione <strong>Añadir a pantalla de inicio</strong>.',
		fi_fi: 'Asenna tämä web-sovellus laitteeseesi %device: paina %icon ja sen jälkeen valitse <strong>Lisää Koti-valikkoon</strong>.',
		fr_fr: 'Ajoutez cette application sur votre %device en cliquant sur %icon, puis <strong>Ajouter à l\'écran d\'accueil</strong>.',
		he_il: '<span dir="rtl">התקן אפליקציה זו על ה-%device שלך: הקש %icon ואז <strong>הוסף למסך הבית</strong>.</span>',
		hu_hu: 'Telepítse ezt a web-alkalmazást az Ön %device-jára: nyomjon a %icon-ra majd a <strong>Főképernyőhöz adás</strong> gombra.',
		it_it: 'Installa questa applicazione sul tuo %device: premi su %icon e poi <strong>Aggiungi a Home</strong>.',
		ja_jp: 'このウェブアプリをあなたの%deviceにインストールするには%iconをタップして<strong>ホーム画面に追加</strong>を選んでください。',
		ko_kr: '%device에 웹앱을 설치하려면 %icon을 터치 후 "홈화면에 추가"를 선택하세요',
		nb_no: 'Installer denne appen på din %device: trykk på %icon og deretter <strong>Legg til på Hjem-skjerm</strong>',
		nl_nl: 'Installeer deze webapp op uw %device: tik %icon en dan <strong>Zet in beginscherm</strong>.',
		pt_br: 'Instale este web app em seu %device: aperte %icon e selecione <strong>Adicionar à Tela Inicio</strong>.',
		pt_pt: 'Para instalar esta aplicação no seu %device, prima o %icon e depois o <strong>Adicionar ao ecrã principal</strong>.',
		ru_ru: 'Установите это веб-приложение на ваш %device: нажмите %icon, затем <strong>Добавить в «Домой»</strong>.',
		sv_se: 'Lägg till denna webbapplikation på din %device: tryck på %icon och därefter <strong>Lägg till på hemskärmen</strong>.',
		th_th: 'ติดตั้งเว็บแอพฯ นี้บน %device ของคุณ: แตะ %icon และ <strong>เพิ่มที่หน้าจอโฮม</strong>',
		tr_tr: '%device için bu uygulamayı kurduktan sonra %icon simgesine dokunarak <strong>Ev Ekranına Ekle</strong>yin.',
		zh_cn: '您可以将此应用程式安装到您的 %device 上。请按 %icon 然后点选<strong>添加至主屏幕</strong>。',
		zh_tw: '您可以將此應用程式安裝到您的 %device 上。請按 %icon 然後點選<strong>加入主畫面螢幕</strong>。'
	};

OSVersion = OSVersion ? OSVersion[0].replace(/[^\d_]/g,'').replace('_','.')*1 : 0;
expired = expired == 'null' ? 0 : expired*1;

// Merge options
if (window.addToHomeConfig) {
	for (i in window.addToHomeConfig) {
		options[i] = window.addToHomeConfig[i];
	}
}

// Is it expired?
if (!options.expire || expired < new Date().getTime()) {
	expired = 0;
}

/* Bootstrap */
if (hasHomescreen && !expired && !isStandalone && isSafari && !options.disableLoading) {
	document.addEventListener('DOMContentLoaded', ready, false);
	window.addEventListener('load', loaded, false);
}


/* on DOM ready */
function ready () {
	document.removeEventListener('DOMContentLoaded', ready, false);

	var div = document.createElement('div'),
		close,
		link = options.touchIcon ? document.querySelectorAll('head link[rel=apple-touch-icon],head link[rel=apple-touch-icon-precomposed]') : [],
		sizes, touchIcon = '';

	div.id = 'addToHomeScreen';
	div.style.cssText += 'position:absolute;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);';
	div.style.left = '-9999px';		// Hide from view at startup

	// Localize message
	if (options.message in intl) {		// You may force a language despite the user's locale
		language = options.message;
		options.message = '';
	}
	if (options.message == '') {		// We look for a suitable language (defaulted to en_us)
		options.message = language in intl ? intl[language] : intl['en_us'];
	}

	// Search for the apple-touch-icon
	if (link.length) {
		for (i=0, l=link.length; i<l; i++) {
			sizes = link[i].getAttribute('sizes');

			if (sizes) {
				if (isRetina && sizes == '114x114') { 
					touchIcon = link[i].href;
					break;
				}
			} else {
				touchIcon = link[i].href;
			}
		}

		touchIcon = '<span style="background-image:url(' + touchIcon + ')" class="touchIcon"></span>';
	}

	div.className = (isIPad ? 'ipad' : 'iphone') + (touchIcon ? ' wide' : '');
	div.innerHTML = touchIcon + options.message.replace('%device', platform).replace('%icon', OSVersion >= 4.2 ? '<span class="share"></span>' : '<span class="plus">+</span>') + (options.arrow ? '<span class="arrow"></span>' : '') + '<span class="close">\u00D7</span>';

	document.body.appendChild(div);
	el = div;

	// Add the close action
	close = el.querySelector('.close');
	if (close) close.addEventListener('click', addToHomeClose, false);

	// Add expire date to the popup
	if (options.expire) localStorage.setItem('_addToHome', new Date().getTime() + options.expire*60*1000);
}


/* on window load */
function loaded () {
	window.removeEventListener('load', loaded, false);

	setTimeout(function () {
		var duration;
		
		startY = isIPad ? window.scrollY : window.innerHeight + window.scrollY;
		startX = isIPad ? window.scrollX : Math.round((window.innerWidth - el.offsetWidth)/2) + window.scrollX;

		el.style.top = isIPad ? startY + options.bottomOffset + 'px' : startY - el.offsetHeight - options.bottomOffset + 'px';
		el.style.left = isIPad ? startX + (OSVersion >=5 ? 160 : 208) - Math.round(el.offsetWidth/2) + 'px' : startX + 'px';

		switch (options.animationIn) {
			case 'drop':
				if (isIPad) {
					duration = '0.6s';
					el.style.webkitTransform = 'translate3d(0,' + -(window.scrollY + options.bottomOffset + el.offsetHeight) + 'px,0)';
				} else {
					duration = '0.9s';
					el.style.webkitTransform = 'translate3d(0,' + -(startY + options.bottomOffset) + 'px,0)';
				}
				break;
			case 'bubble':
				if (isIPad) {
					duration = '0.6s';
					el.style.opacity = '0';
					el.style.webkitTransform = 'translate3d(0,' + (startY + 50) + 'px,0)';
				} else {
					duration = '0.6s';
					el.style.webkitTransform = 'translate3d(0,' + (el.offsetHeight + options.bottomOffset + 50) + 'px,0)';
				}
				break;
			default:
				duration = '1s';
				el.style.opacity = '0';
		}

		setTimeout(function () {
			el.style.webkitTransitionDuration = duration;
			el.style.opacity = '1';
			el.style.webkitTransform = 'translate3d(0,0,0)';
			el.addEventListener('webkitTransitionEnd', transitionEnd, false);
		}, 0);

		closeTimeout = setTimeout(addToHomeClose, options.lifespan);
	}, options.startDelay);
}

function transitionEnd () {
	el.removeEventListener('webkitTransitionEnd', transitionEnd, false);
	el.style.webkitTransitionProperty = '-webkit-transform';
	el.style.webkitTransitionDuration = '0.2s';

	if (closeTimeout) {		// Standard loop
		clearInterval(theInterval);
		theInterval = setInterval(setPosition, options.iterations);
	} else {				// We are closing
		el.parentNode.removeChild(el);
	}
}

function setPosition () {
	var matrix = new WebKitCSSMatrix(window.getComputedStyle(el, null).webkitTransform),
		posY = isIPad ? window.scrollY - startY : window.scrollY + window.innerHeight - startY,
		posX = isIPad ? window.scrollX - startX : window.scrollX + Math.round((window.innerWidth - el.offsetWidth)/2) - startX;

	if (posY == matrix.m42 && posX == matrix.m41) return;

	clearInterval(theInterval);
	el.removeEventListener('webkitTransitionEnd', transitionEnd, false);

	setTimeout(function () {
		el.addEventListener('webkitTransitionEnd', transitionEnd, false);
		el.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
	}, 0);
}

function addToHomeClose () {
	clearInterval(theInterval);
	clearTimeout(closeTimeout);
	closeTimeout = null;
	el.removeEventListener('webkitTransitionEnd', transitionEnd, false);
	
	var posY = isIPad ? window.scrollY - startY : window.scrollY + window.innerHeight - startY,
		posX = isIPad ? window.scrollX - startX : window.scrollX + Math.round((window.innerWidth - el.offsetWidth)/2) - startX,
		opacity = '1',
		duration = '0',
		close = el.querySelector('.close');

	if (close) close.removeEventListener('click', addToHomeClose, false);

	el.style.webkitTransitionProperty = '-webkit-transform,opacity';

	switch (options.animationOut) {
		case 'drop':
			if (isIPad) {
				duration = '0.4s';
				opacity = '0';
				posY = posY + 50;
			} else {
				duration = '0.6s';
				posY = posY + el.offsetHeight + options.bottomOffset + 50;
			}
			break;
		case 'bubble':
			if (isIPad) {
				duration = '0.8s';
				posY = posY - el.offsetHeight - options.bottomOffset - 50;
			} else {
				duration = '0.4s';
				opacity = '0';
				posY = posY - 50;
			}
			break;
		default:
			duration = '0.8s';
			opacity = '0';
	}

	el.addEventListener('webkitTransitionEnd', transitionEnd, false);
	el.style.opacity = opacity;
	el.style.webkitTransitionDuration = duration;
	el.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
}

/* Public functions */
window.addToHomeClose = addToHomeClose;
})();
/*
 * iTabbar
 * Copyright (c) Gino Cote & Pascal Carmoni
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
var count = $("#tabbar li").length;
var pourcent = 100 / count;
$("#tabbar li").css("width", pourcent + "%");
//alert(pourcent);

var clickEventType=((document.ontouchstart!==null)?'click':'touchstart');

//$("#tabbar a").bind(clickEventType, function() {
//	$("#tabbar a").addClass("current").not(this).removeClass("current");
//    $("#tabbar div").addClass("current").not(this).removeClass("current");
//});
// ------------------------------------------
// WEB APP LOADER
// ------------------------------------------

var WebAppLoader = {};

(function () {
    var modules         = [],
        module          = {},
        extensions      = {}, // List of extensions.
        sharingOptions  = { sharingDenied: 0, sharingAllowed: 1 },

    // Loader settings:
        disableLog      = true,
        suppressErrors  = false,
        sharingSetting  = sharingOptions.sharingAllowed;

    // TODO: Make loader settings available to all extensions.

    // Set the default module object. This will be used as base when modules,
    // plugins and shared modules will be created later.
    module = {
    
    // Properties:
        name                : '',
        source              : null,
        bin                 : null,
        added               : false,
        loaded              : false,
        unloaded            : false,
        isPlugin            : false,
        isShared            : false,
        hasEvents           : false,
        plugins             : [],
        sharedModules       : [],
        
    // Private methods:
        getPlugin           : function(pluginName) {
            var isPluginAvailable = this.plugins.some(function(m){
                return m === pluginName;
            });
            
            // If the plugin is in the list of the available plugins return it.
            return (isPluginAvailable)
                ? this.loader.getPlugin(pluginName)
                : null;
        },
        getSharedModule     : function(sharedModuleName) {
            var isSharedModuleAvailable = this.sharedModules.some(function(m){
                return m === sharedModuleName;
            });
            
            // If the shared module is in the list of the available modules return it.
            return (isSharedModuleAvailable)
                ? this.loader.getSharedModule(sharedModuleName)
                : null;
        },
        getEventManager     : function (){
            // if the module manages events return the event manager.
            return (this.hasEvents) 
                ? this.loader.getEventManager()
                : null;
        },
        getConsole          : function () {
            return this.loader.getConsole();
        },

    // Shared objects:
        loader: {}
    };

    // ------------------------------------------
    // HELPER FUNCTIONS
    // ------------------------------------------

    // Private function that throws an error only if suppressErrors is false. 
    function throwException(message, functionName) {
        var messageHeader = (functionName)
            ? ' - ' + functionName + ' exception! '
            : '';

        if (!suppressErrors) {
            throw (messageHeader + message);
        }
    }

    // Private function
    function getValueAs(value, type) {
        function getValue(exp, type, defaultValue) {
            return (typeof exp === type) ? exp : defaultValue;
        }

        function getValueAsArray(exp, defaultValue) {
            return (Array.isArray(exp)) ? exp : defaultValue;
        }

        switch (type) {
            case 'boolean':
                return getValue(value, 'boolean', false);
            case 'b':
                return getValue(value, 'boolean', false);
            case 'string':
                return getValue(value, 'string', '');
            case 's':
                return getValue(value, 'string', '');
            case 'number':
                return getValue(value, 'number', 0);
            case 'n':
                return getValue(value, 'number', 0);
            case 'object':
                return getValue(value, 'object', {});
            case 'o':
                return getValue(value, 'object', {});
            case 'array':
                return getValueAsArray(value, []);
            case 'a':
                return getValueAsArray(value, []);
            default:
                return value;
        }
    }
    
    // ------------------------------------------
    // BUILT-IN - EVENT MANAGER
    // ------------------------------------------

    // Public
    var eventManager = (function () {
        var eventObj = {},
            events = {};

        // Simple Event Manager.
        function on(event, callback) {
            events[event] = callback;
        }

        function raiseEvent(event) {
            var args = Array.prototype.slice.call(arguments, 1);

            if (events[event]) {
                events[event].apply(null, args);
            }
        }

        function init(obj) {
            obj['on'] = on;
            obj['raiseEvent'] = raiseEvent;
        }

        eventObj.on = on;
        eventObj.raiseEvent = raiseEvent;
        eventObj.init = init;

        return eventObj;
    })();

    // ------------------------------------------
    // BUILT-IN - CONSOLE
    // ------------------------------------------

    // Public
    var consoleManager = (function () {
        var consoleManager = {},
            log = (disableLog)
                ? function () { }
                : function () { console.log.apply(console, arguments); };

        consoleManager.log = log;

        return consoleManager;
    })();

    // ------------------------------------------
    // LOADER
    // ------------------------------------------

    // Private function that checks if the specified module exists.
    function moduleExists(moduleName) {
        modules.some(function(m) { return m.name === moduleName; });
    }

    // Attempt to retrieve a module.
    //
    // 'moduleName'     - The module name.
    // 'moduleType'     - A string that defining the module type. 
    //                    Can be one of: 'plugin' (search in the list of modules
    //                    tagged as plugins), 'shared' (search in the list of
    //                    modules tagged as shared) or empty (search in all 
    //                    available modules).
    // [PRIVATE]
    function getModule(moduleName, moduleType) {
        var module = {};
    
        module = modules.filter(function(m) {
            switch(moduleType) {
                case 'plugin':
                    return m.name === moduleName && m.isPlugin;
                case 'shared':
                    return m.name === moduleName && m.isShared;
                case 'extension':
                    return m.name === moduleName && m.isExtension;
                default:
                    return m.name === moduleName;
            }   
        })[0] || null;
            
        return module;
    }
    
    // Public
    function addModule(config, source) {
        var name                    = getValueAs(config.name, 'string'),
            hasEvents               = getValueAs(config.hasEvents, 'boolean'),
            isShared                = getValueAs(config.isShared, 'boolean'),
            isPlugin                = getValueAs(config.isPlugin, 'boolean'),
            pluginsToLoad           = getValueAs(config.plugins, 'array'),
            sharedModulesToLoad     = getValueAs(config.sharedModules, 'array'),
            errorMessage            = '',
            isSharingDenied         = '';

        // If the module doesn't exist...
        if (!moduleExists(name)) {

            // ... check if sharing is allowed or denied for this module and then...
            isSharingDenied = (
                isShared 
                && sharedModulesToLoad.length > 0)
                && (sharingSetting === sharingOptions.sharingDenied
            );

            if (isSharingDenied) {
                errorMessage += '"' + name + '" is a shared module and cannot load any other shared modules. ';
                errorMessage += 'Set "isShared" to false or remove "sharedModules" to solve the problem.';
                throwException(errorMessage, 'addModule');
            }
            
            // ... create a new module and add it to the list of modules.
            var moduleToAdd = Object.create(module);

            moduleToAdd.source          = source;
            moduleToAdd.isPlugin        = isPlugin;
            moduleToAdd.name            = name;
            moduleToAdd.isShared        = isShared;
            moduleToAdd.hasEvents       = hasEvents;
            moduleToAdd.plugins         = pluginsToLoad;
            moduleToAdd.sharedModules   = sharedModulesToLoad;
            moduleToAdd.added           = true;
            
            if (moduleToAdd.isPlugin) {
                moduleToAdd.getConsole = getConsole;
                moduleToAdd.getEventManager = getEventManager;
            } else {
                extendAddModule(config, moduleToAdd);
            }
            

            modules.push(moduleToAdd);    
        }
    }

    // Public
    function loadModule(moduleName, moduleType) {
        var moduleToLoad;

        // Get the module.
        moduleToLoad = getModule(moduleName, moduleType);
        
        // Return immediately if nothing is found.
        if (!moduleToLoad) {
            return moduleToLoad; // moduleToLoad should be null at this point.
        }

        // If the module exists but its source is still not executed, loaded it.
        if(!moduleToLoad.loaded) {
            if (moduleToLoad.isExtension){
                moduleToLoad.bin = moduleToLoad.source(module);
                extensions[moduleName] = moduleToLoad.bin; //source.call(this, module)
            } else {
                moduleToLoad.bin = moduleToLoad.source();
            }

            moduleToLoad.loaded = true;
            moduleToLoad.unloaded = false;

            // If the module supports events attach the 'on' method to it.
            if (moduleToLoad.hasEvents) {
                moduleToLoad.bin.on = eventManager.on;
            }
        }
        
        extendLoadModule(moduleToLoad);

        // If something goes wrong return null.
        return (moduleToLoad.loaded)
            ? moduleToLoad.bin
            : null;
    }

    // Public
    function unloadModule(moduleName) {
        var moduleToUnload,
            success = false;

        // Get the module.
        moduleToUnload = getModule(moduleName);
        
        if (moduleToUnload) {
            moduleToUnload.bin = null;
            moduleToUnload.loaded = false;
            moduleToUnload.unloaded = true;
            success = true;
        }

        return success;
    }

    // Public
    function reloadModule(moduleName) {
        if (unloadModule(moduleName)) {
            return loadModule(moduleName);
        }
    }

    // Public
    function getInfo(outputAsHtml) {
        var modulesFound            = [],
            pluginsFound            = [],
            sharedModulesFound      = [],
            unloadedModulesFound    = [],
            message                 = '',
            breakLine               = '\n';

        if (getValueAs(outputAsHtml, 'boolean')) {
            breakLine = '</br>';
        }
        
        modulesFound = modules.filter(function(m){ return (m.isPlugin == false && m.isShared == false); });
        pluginsFound = modules.filter(function(m){ return (m.isPlugin == true); });
        sharedModulesFound = modules.filter(function(m){ return (m.isShared == true); });

        function addToMessage(text) {
            message += (getValueAs(text, 'string')) + breakLine;
        }

        function getModulesInfo(moduleList, caption) {
            var module  = null,
                status  = '',
                len     = 0;

            len = moduleList.length;

            addToMessage(caption + '(' + len + ')');
            addToMessage(/* break line */);

            for (var i = 0; i < len; i += 1) {
                module = moduleList[i];
                
                if (module.loaded) { status = 'loaded'; }
                if (module.unloaded) { status = 'unloaded'; }
                if (module.added && (!module.loaded && !module.unloaded)) { status = 'added'; }

                addToMessage ('- ' + status.toUpperCase() + ':\t' + module.name + ': ');
            }
            
            addToMessage(/* break line */);
        }

        addToMessage('TOTAL NUMBER MODULES: ' + modules.length);
        addToMessage(/* break line */);

        getModulesInfo(modulesFound, 'STANDARD MODULES');
        getModulesInfo(pluginsFound, 'PLUGINS');
        getModulesInfo(sharedModulesFound, 'SHARED MODULES');

        return message;
    }

    // Public
    function loadSharedModule(moduleName) {
        return loadModule(moduleName, 'shared');
    }

    // Public
    function getEventManager() {
        return eventManager;
    }

    // Public
    function getConsole() {
        return consoleManager;
    }

    // Public
    function extend(name, source) {
        WebAppLoader[name] = source();
    }

    function init(){
        alert('INIT!');
    }

    // ------------------------------------------
    // EXTENSIONS
    // ------------------------------------------
    
    // Public
    function addExtension(config, source) {
        var name                    = getValueAs(config.name, 'string'),
            hasEvents               = getValueAs(config.hasEvents, 'boolean'),
            pluginsToLoad           = getValueAs(config.plugins, 'array'),
            sharedModulesToLoad     = getValueAs(config.sharedModules, 'array');

        // If the module doesn't exist...
        if (!moduleExists(name)) {

            // ... create a new module and add it to the list of modules.
            var moduleToAdd = Object.create(module);

            moduleToAdd.source          = source;
            moduleToAdd.name            = name;
            moduleToAdd.isExtension     = true;           
            moduleToAdd.plugins         = pluginsToLoad;
            moduleToAdd.sharedModules   = sharedModulesToLoad;
            moduleToAdd.added           = true;
            moduleToAdd.hasEvents       = hasEvents;

            modules.push(moduleToAdd);   
            loadModule(name, 'extension');
        }
    }

    // Private
    function extendAddModule(config, moduleToAdd) {
        var moduleToExtend = moduleToAdd;

        for(var ext in extensions) {
            if (extensions[ext].extendAddModule) {
                extensions[ext].extendAddModule(config, moduleToAdd);
            }
        } 
    }

    // Private
    function extendLoadModule(moduleToLoad) {
        var moduleToExtend = moduleToLoad;

        for(var ext in extensions) {
            if (extensions[ext].extendLoadModule) {
                extensions[ext].extendLoadModule(moduleToLoad);
            }
        } 
    }
    
    // ------------------------------------------
    // MODULE OBJECT
    // ------------------------------------------

    module.loader = (function(){
        var loader = {};
        
        function getPlugin(pluginName) {
            return loadModule(pluginName, 'plugin');
        }

        function getSharedModule(sharedModuleName) {
            return loadModule(sharedModuleName, 'shared');
        }
        
        function getEventManager() {
            return eventManager;
        }

        function getConsole() {
            return consoleManager; // Don't call getConsole() from here.
        }

        loader.getPlugin = getPlugin;
        loader.getSharedModule = getSharedModule;
        loader.getEventManager = getEventManager;
        loader.getConsole = getConsole;

        return loader;
                
    })();
    
    //Add public methods to the loader.
    WebAppLoader.addModule = addModule;
    WebAppLoader.loadModule = loadModule;
    WebAppLoader.unloadModule = unloadModule;
    WebAppLoader.getSharedModule = loadSharedModule;
    WebAppLoader.getEventManager = getEventManager;
    WebAppLoader.getConsole = getConsole;
    WebAppLoader.getInfo = getInfo;
    WebAppLoader.reloadModule = reloadModule;
    WebAppLoader.addExtension = addExtension;
    WebAppLoader.init = init;

})();
// ------------------------------------------
// BASE64
// ------------------------------------------

WebAppLoader.addModule({ name: 'base64', isPlugin: true}, function () {
    var base64 = {},
        keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // private method for UTF-8 encoding
    function utf8_encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }

    // private method for UTF-8 decoding
    function utf8_decode(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

    // public method for encoding
    function encode(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                      keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }

        return output;
    }

    // public method for decoding
    function decode(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = utf8_decode(output);

        return output;

    }

    base64.encode = encode;
    base64.decode = decode;

    return base64;
});
// ------------------------------------------
// DEVICE
// ---------------------    ---------------------

WebAppLoader.addModule({ name: 'device', plugins: ['helper'], hasEvents: true, isPlugin: true }, function () {
    var device          = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        helper          = this.getPlugin('helper'),
        nav             = navigator;

    function isIDevice() {
        return (/iphone|ipod|ipad/gi).test(nav.platform);
    }
     
    function isIPad() {
        return (/ipad/gi).test(nav.platform);
    }
          
    function isRetina() {
        return 'devicePixelRatio' in window && window.devicePixelRatio > 1;
    }
         
    function isSafari() {
        return nav.appVersion.match(/Safari/gi);
    }
      
    function hasHomescreen() {
        return 'standalone' in nav && isIDevice;
    }
    
    function isStandalone() {
        return device.hasHomescreen && nav.standalone;
    }
    
    function OSVersion() {
        return nav.appVersion.match(/OS \d+_\d+/g);
    }
    
    function platform() {
        return nav.platform.split(' ')[0];
    }
    
    function language() {
        return nav.language.replace('-', '_');
    }
    
    function maxWidth() {
        var width = 0;

        if (isIDevice) {
            if (isIPad) {
                width = 1024;
            } else {
                /* 480 on old iPhones */
                width = 960;
            }
        }

        return width;
    }

    function minWidth() {
        return maxWidth() - 20;
    }

    function maxHeight() {
        
        var height = 0;

        if (isIDevice) {
            if (isIPad) {
                height = 768;
            } else {
                /* 320 on old iPhones */
                height = 640;
            }
        }

        return height;
    }

    function minHeight() {
        return maxHeight() - 20;
    }

    function orientation() {
        var o = Math.abs(window.orientation - 90);
    
        o = (o == 180) ? 0: o;
        
        if (o == 90) {
            return 'portrait';
        } else {
            return 'landscape';
        }
    }

    device.isIDevice     = isIDevice;
    device.isIPad        = isIPad;
    device.isRetina      = isRetina;
    device.isSafari      = isSafari;
    device.hasHomescreen = hasHomescreen;
    device.isStandalone  = isStandalone;
    device.OSVersion     = OSVersion;
    device.platform      = platform;
    device.language      = language;
    device.maxWidth      = maxWidth;
    device.minWidth      = minHeight;
    device.maxHeight     = maxHeight;
    device.minHeight     = minHeight;
    device.orientation   = orientation;

    return device;
});
// ------------------------------------------
// HELPER
// ------------------------------------------

WebAppLoader.addModule({ name: 'helper', isPlugin: true }, function () {
    var helper = {};

    // ------------------------------------------
    // STRING FUNCTIONS
    // ------------------------------------------

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function startsWith(str, prefix) {
        return str.indexOf(prefix) === 0;
    }

    function endsWith(str, suffix) {
        return str.match(suffix + "$") == suffix;
    }

    // ------------------------------------------
    // DATA TYPE FUNCTIONS
    // ------------------------------------------

    function getValueAs(value, type) {
        function getValue(exp, type, defaultValue) {
            return (typeof exp === type) ? exp : defaultValue;
        }

        function getValueAsArray(exp, defaultValue) {
            return (Array.isArray(exp)) ? exp : defaultValue;
        }

        switch (type) {
            case 'boolean':
                return getValue(value, 'boolean', false);
            case 'b':
                return getValue(value, 'boolean', false);
            case 'string':
                return getValue(value, 'string', '');
            case 's':
                return getValue(value, 'string', '');
            case 'number':
                return getValue(value, 'number', 0);
            case 'n':
                return getValue(value, 'number', 0);
            case 'object':
                return getValue(value, 'object', {});
            case 'o':
                return getValue(value, 'object', {});
            case 'array':
                return getValueAsArray(value, []);
            case 'a':
                return getValueAsArray(value, []);
            default:
                return value;
        }
    }

    // Public
    function getType(value) {
        var TYPES = {
            'undefined'        : 'undefined',
            'number'           : 'number',
            'boolean'          : 'boolean',
            'string'           : 'string',
            '[object Function]': 'function',
            '[object RegExp]'  : 'regexp',
            '[object Array]'   : 'array',
            '[object Date]'    : 'date',
            '[object Error]'   : 'error'
        },
        TOSTRING = Object.prototype.toString;

        function type(o) {
            return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
        } 
        
        return type(value);      
    }

    // Public
    function hasValue(value) {
        return (value != undefined && value != null);
    }

    // ------------------------------------------
    // GENERIC FUNCTIONS
    // ------------------------------------------

    function createUUID() {
        return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }


    function removeObjectFromArray(arrayItems, propertyToCheck, value) {
        var removedObject = null;

         for(var i = arrayItems.length-1; i >= 0; i--){  
            if(arrayItems[i] && arrayItems[i][propertyToCheck] === value){                     
                removedObject = arrayItems.splice(i,1);
                break;
            }
        }
       
        return removedObject;
    }

    function getObjectFromArray(arrayItems, propertyToCheck, value) {
        var object = null;

         for(var i = arrayItems.length-1; i >= 0; i--){  
            if(arrayItems[i] && arrayItems[i][propertyToCheck] === value){                     
                object = arrayItems[i];
                break;
            }
        }
       
        return object;
    }

    function getURLParameter(name) {
        var param = decodeURIComponent(
            (location.search.match(RegExp("[?|&]"+name+'=(.+?)(&|$)'))||[,null])[1]
        );  
        return (param === 'null')
            ? null
            : param;
    }

    function htmlDecode(input){
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes[0].nodeValue;
    }

    helper.capitaliseFirstLetter = capitaliseFirstLetter;
    helper.getValueAs = getValueAs;
    helper.startsWith = startsWith;
    helper.endsWith = endsWith;
    helper.getType = getType;
    helper.hasValue = hasValue;
    helper.createUUID = createUUID;
    helper.removeObjectFromArray = removeObjectFromArray;
    helper.getURLParameter = getURLParameter;
    helper.getObjectFromArray = getObjectFromArray;
    helper.htmlDecode = htmlDecode;

    return helper;
});
// ------------------------------------------
// LOCAL STORAGE MANAGER
// ---------------------    ---------------------

WebAppLoader.addModule({ name: 'storage', plugins: ['helper'], hasEvents: true, isPlugin: true }, function () {
    var storage             = {},
        output              = this.getConsole(),
        eventManager        = this.getEventManager(),
        helper              = this.getPlugin('helper'),
        revolutionNamespace = 'Revolution';
        usedSpace           = 0;

    // Public
    function getUsedSpace() {
        return JSON.stringify(localStorage).length;
    }

    // Private
    function getNamespacedName(itemName, namespace) {
        var namespacedName = null;

        if (itemName && (typeof itemName === 'string')) {
            namespacedName = (namespace || revolutionNamespace) + helper.capitaliseFirstLetter(itemName);
        }

        return namespacedName;
    }

    // Private
    function setItem(key, value) {
        localStorage.setItem(key, value);
        output.log('Storage - setItem:', key, value);
    }

    // Private
    function getItem(key) {
        return localStorage.getItem(key);
    }

    // Public
    function load(itemName, namespace) {
        var name        = getNamespacedName(itemName, namespace),
            storedItem  = getItem(name),
            value       = null;
        
        // Check if the value exists and try to retrieve it.
        if (storedItem) {
            // Check if the value is a stringified JSON object.
            if (helper.startsWith(storedItem, '{"')) {
                try {
                    value = JSON.parse(storedItem);
                } catch (e) {
                    output.log('Storage - failed to parse stored item:', key, value);
                }
            } else {
                value = storedItem;
            }
        }
        
        return value;    
    }

    // Public
    function save(itemName, itemValue, namespace) {
        var name = getNamespacedName(itemName, namespace),
            value = '';

        if (name && helper.hasValue(itemValue)) {
            value = (typeof itemValue === 'object')
                ? JSON.stringify(itemValue)
                : itemValue;
            
            setItem(name, value);
                        
        } else {
            output.log('Storage - cannot save item.', itemName, itemValue);
        }
    }

    // Public
    function remove(itemName, namespace) {
        var name = getNamespacedName(itemName, namespace);

        if (name) {
            localStorage.removeItem(name);
            output.log('Storage - removed item.', name);
        }
    }

    // Public
    function count() {
        output.log('count()', localStorage.length);
    }

    // Public
    function clearAll() {
        localStorage.clear();  
        output.log('clearAll()');
    }

    storage.load = load;
    storage.save = save;
    storage.remove = remove;
    storage.count = count;
    storage.clearAll = clearAll;
    storage.getUsedSpace = getUsedSpace;

    return storage;
});
// ------------------------------------------
// DATA OBJECT
// ------------------------------------------

WebAppLoader.addExtension({ name: 'dataObject', plugins: ['helper', 'storage'], hasEvents: true }, function (module) {
    var extension       = {},
        loader          = module.loader, // The loader object shared by all modules.
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        storage         = this.getPlugin('storage'),
        helper          = this.getPlugin('helper');
        dataObjects     = {};

    var dataObject = (function() {
        var dataObject  = {};

        // Public
        function define(properties) {
            this.data = {};
            this.defaults = {};
            for (var property in properties) {
                this.data[property] = properties[property];
                // Store default properties also so we can restore them in a second moment.
                this.defaults[property] = properties[property];
            }   
        }

        // Public
        function get(property) {
            return this.data[property];
        }

        // Public
        function set(property, value) {
             this.data[property] = value;
        }
        
        // Public
        function saveData(username) {
            // The privateId property is set when the getDataObject method is
            // invoked the first time.
            storage.save (this.privateId, this.data, username);
        }

        // Public
        function loadData(username) {
            return this.data = storage.load(this.privateId, username) 
                || this.defaults // If no data try to get defaults
                || null;         // or null
        }

        // Public
        function getData() {
            return this.data || {};
        }

        // Public
        function setData(value) {
            return this.data = value;
        }

        dataObject.define = define;
        dataObject.get = get;
        dataObject.set = set;
        dataObject.getData = getData;
        dataObject.setData = setData;
        dataObject.saveData = saveData;
        dataObject.loadData = loadData;

        return dataObject;
    })();

    // Invoked when a new module is added.
    function extendAddModule(config, moduleToAdd) {
        // Code example:
        //      var hasEvents = helper.getValueAs(config.hasEvents, 'boolean');
        //      moduleToAdd.hasEvents = hasEvents;
        var dataObjects = helper.getValueAs(config.dataObjects, 'array');
        
        moduleToAdd.dataObjects = dataObjects;
    }
    
    // Invoked when a module is loaded.
    function extendLoadModule(moduleToLoad) {
        if (moduleToLoad.dataObjects && moduleToLoad.dataObjects.length > 0) {
            moduleToLoad.bin.getData = function (dataObjectName) {
                return dataObjects[dataObjectName].getData();
            };
            
            moduleToLoad.bin.saveData = function (dataObjectName, username) {
                return dataObjects[dataObjectName].saveData(username);
            };
            
            moduleToLoad.bin.loadData = function (dataObjectName, username) {
                return dataObjects[dataObjectName].loadData(username);
            };

            moduleToLoad.bin.getDataObject = function (dataObjectName) {
                return this[dataObjectName];
            };
        }
    }

    // Module methods:
    module.getDataObject = function (objectlName) {
        var isDataObjectAvailable = this.dataObjects.some(function(m){
            return m === objectlName;
        });
        
        var newDataObject = null;
           
        // If the shared module is in the list of the available modules return it.
        if (isDataObjectAvailable) {
            if (!dataObjects[objectlName]) {
                newDataObject = Object.create(dataObject);
                newDataObject.privateId = objectlName;
                dataObjects[objectlName] = newDataObject;
            } else {
                throw ('Data object "' + objectlName + '" already exists.');
            }
        }

        return newDataObject;
    };

    extension.extendAddModule = extendAddModule;
    extension.extendLoadModule = extendLoadModule;

    return extension;
});
// ------------------------------------------
// PORTFOLIOS LIST
// ------------------------------------------

WebAppLoader.addModule({ name: 'portfoliosList', plugins: [],
    sharedModules: ['settings', 'pageElements', 'ajaxManager'], hasEvents: true }, function () {
    var portfoliosList  = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        settings        = this.getSharedModule('settings'),
        el              = this.getSharedModule('pageElements'),
        ajaxManager     = this.getSharedModule('ajaxManager');
    
    $(document).on('click', el.portfolioAnalysisLink, onPortfolioAnalysisClick);

    function onPortfolioAnalysisClick(e) {
        var uri = $(this).attr("data-link");

        ajaxManager.post(settings.siteUrls.analysis, { uri: uri }, function (data) {
            eventManager.raiseEvent('onDataReceived', data);
        });
        
        return false;
    }
    
    return portfoliosList;
});
// ------------------------------------------
// ISCROLL
// ------------------------------------------

WebAppLoader.addModule({ name: 'scroll' }, function () {
    var scroll = {},
        myScroll; // Please don't initialize myScroll.

    /* Use this for high compatibility (iDevice + Android)*/
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

    function rebuildScroll(id, optionConfig) {
        var wrapper = 'div#' + id + ' #wrapper',
            options = optionConfig || {}; // { hScrollbar: false, vScrollbar: true }

        options.useTransform = false;
        options.onBeforeScrollStart = function (e) {
            var target = e.target;
            while (target.nodeType != 1) target = target.parentNode;

            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                e.preventDefault();
            }
        };

        // Remove comments from these options if you want to activate the snap.
        // options.snap = 'hr';
        // options.momentum = true;
        // options.hScroll = true;
         options.vScroll = true;
         // options.zoom = true;
        
//        options.snap = true;
//        options.momentum = false;
//        options.hScrollbar = false;
//        options.vScrollbar = false;
        
        if (myScroll) {
            myScroll.destroy();
            myScroll = null;
        }

        if ($(wrapper).get(0)) {
            setTimeout(function () {
                myScroll = new iScroll($(wrapper).get(0), options);
            }, 25); // Usually timers should be set to a minimum of 25 milliseconds to work properly.
        }
    }

    function goUp() {
        try {
            myScroll.scrollTo(0, 0, 200);
        } catch (e) {

        }
    }

    scroll.rebuild = rebuildScroll;
    scroll.goUp = goUp;

    return scroll;
});
// ------------------------------------------
// SPINNING WHEEL SLOT
// ------------------------------------------

WebAppLoader.addModule({ name: 'spinningWheel', plugins: ['helper'], hasEvents: true }, function () {
    var spinningWheel   = {},
        slots           = [],
        slotIndices     = {},
        eventManager    = this.getEventManager(),
        helper          = this.getPlugin('helper');

    function getSlot(index) {
        if (typeof index == 'string') {
            index = slotIndices[index];
        }

        return slots[index];
    }

    function create(config) {
        $.each(config.items, function (i, val) {
            var id = helper.capitaliseFirstLetter(val.id);

            slotIndices[val.id] = i;
            slots[i] = {
                id: val.id,
                repository: val.repository,
                lastItemSelected: '', // TODO: Get a value from the config.
                onDoneHandler: 'on' + id + 'Done',
                onCancelHandler: 'on' + id + 'Cancel',
                onSlotCancel: function () {
                    SpinningWheel.close();
                    eventManager.raiseEvent(slots[i].onCancelHandler);
                },
                onSlotDone: function () {
                    var key, value, results;

                    results = SpinningWheel.getSelectedValues();
                    key = results.keys[0] || '';
                    value = results.values[0] || '';

                    slots[i].lastItemSelected = key;
                    SpinningWheel.close();
                    eventManager.raiseEvent(slots[i].onDoneHandler, key, value);
                },
                show: function (defaultItem) {
                    function initSlot(slotItems) {
                        SpinningWheel.addSlot(slotItems, '', defaultItem || slots[i].lastItemSelected);
                        SpinningWheel.setCancelAction(slots[i].onSlotCancel);
                        SpinningWheel.setDoneAction(slots[i].onSlotDone);
                        SpinningWheel.open();
                    }

                    this.repository.getData(initSlot);
                }
            };
        });
    }

    spinningWheel.create = create;
    spinningWheel.getSlot = getSlot;

    return spinningWheel;
});
// ------------------------------------------
// SWIPE BUTTON
// ------------------------------------------

WebAppLoader.addModule({ name: 'swipeButton', plugins: ['helper'],
    sharedModules: ['settings', 'pageElements', 'ajaxManager'], hasEvents: true }, function () {
    var swipeButton     = {},
        output          = this.getConsole(),
        helper          = this.getPlugin('helper'),
        eventManager    = this.getEventManager(),
        el              = this.getSharedModule('pageElements');
    
      function addTo(containerId, label, callback, autoRemove, buttonClass) {
        $(containerId + ' li').swipeDelete({
            btnLabel: label,
            btnClass: buttonClass,
            click: function(e){
                e.preventDefault();
                if (autoRemove) {
                    $(this).parents('li').remove();
                }
                output.log('swipe');
                callback($(this));
            }
        });
    }

    swipeButton.addTo = addTo;

    return swipeButton;
});
// ------------------------------------------
// TABBAR
// ------------------------------------------

WebAppLoader.addModule({ name: 'tabbar', plugins: ['helper'], hasEvents: true }, function () {
    var tabbar          = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        helper          = this.getPlugin('helper'),
        tabbarId        = '',
        buttons         = [],
        buttonIndices   = {},
        visible         = true;

    function hide() {
        // $(tabbarId).hide();
        output.log('tabbar.hide()');
        $(tabbarId).css({ opacity: 0 });
        visible = false;
    }

    function show() {
        $(tabbarId).css({ opacity: 1 });
        visible = true;
        output.log('tabbar.show()');
    }

    function getButton(index) {
        if (typeof index == 'string') {
            index = buttonIndices[index];
        }

        return buttons[index];
    }

    function create(config) {
        var buttonPrefix = config.buttonPrefix || 'tabbar_btn',
                badgePrefix = 'tabbar_badge',
                that = this;

        tabbarId = config.tabbarId || 'nav#tabbar';
        visible = (typeof config.visible == 'boolean')
                ? config.visible
                : true;

        $.each(config.items, function (i, val) {
            var id = helper.capitaliseFirstLetter(val.id),
                    itemsCount = config.items.length || 1,
                    buttonWidth = 100 / itemsCount;

            buttonIndices[val.id] = i;
            buttons[i] = {
                id: val.id,
                linkId: buttonPrefix + id,
                badgeId: badgePrefix + id,
                title: val.title,
                btnClass: val.btnClass,
                highlight: val.highlight || false,
                eventHandler: 'on' + id + 'Tap',
                isHighlighted: false,
                isDisabled: false,
                setHighlight: function (highlighted) {
                    var tabbarItem = $('#' + this.linkId);

                    if(this.highlight) {
                        this.isHighlighted = !highlighted;
                        if (this.isHighlighted) {
                            $("#tabbar a").removeClass("current");
                            $("#tabbar div").removeClass("current");
                            this.isHighlighted = false;    
                        } else {
                            $("#tabbar a").addClass("current").not(tabbarItem).removeClass("current");
                            $("#tabbar div").addClass("current").not(tabbarItem).removeClass("current");
                            this.isHighlighted = true;
                        }
                    }
                },
                toggleHighlighted: function () {
                    if (this.highlight) {
                        this.setHighlight(!this.isHighlighted);
                    }
                },
                setDisabled: function (disabled) {
                    var opacity = (disabled) ? 0.20 : 1,
                            badgeBackColor = (disabled) ? '#333' : '#f00';

                    this.isDisabled = disabled;
                    $('#' + this.linkId).css({ opacity: opacity });
                    $('#' + this.badgeId).css({ backgroundColor: badgeBackColor });

                },
                setBadgeText: function (text) {
                    var badge = $('#' + this.badgeId),
                            displayBadge = true;

                    if (text) {
                        badge.html(text);
                        badge.show();
                    } else {
                        badge.hide();
                    }
                }
            };

            $(tabbarId + ' ul').append(
                    $('<li>').css('width', buttonWidth + '%').append(
                        $('<a>').attr('id', buttons[i].linkId).append(
                            $('<small>').attr({
                                id: buttons[i].badgeId,
                                'class': 'badge right',
                                style: 'display: none;'
                            })).append(
                            $('<strong>').append(buttons[i].title)).append(
                            $('<div>').attr('class', buttons[i].btnClass)
                        )));
        });

        $(tabbarId + ' ul li a').each(function (i) {
            $(this).on('click', function () {
                if (visible) {
                    if (!buttons[i].isDisabled) {
                        output.log(buttons[i].title + ' was tapped');
                        buttons[i].toggleHighlighted();

                        eventManager.raiseEvent(buttons[i].eventHandler, buttons[i]);
                    } else {
                        output.log(buttons[i].title + ' is disabled');
                    }
                }
            });
        });

        if (!visible) {
            $(tabbarId).css({ opacity: 0 });
        } else {
            $(tabbarId).css({ opacity: 1 });
        }
    }

    tabbar.create = create;
    tabbar.hide = hide;
    tabbar.show = show;
    tabbar.buttons = buttons;
    tabbar.getButton = getButton;

    return tabbar;
});


// ------------------------------------------
// TOOLBAR
// ------------------------------------------

WebAppLoader.addModule({ name: 'toolbar', plugins: ['helper'], sharedModules: ['pageElements'], hasEvents: true }, function () {
    var toolbar          = {},
        output           = this.getConsole(),
        eventManager     = this.getEventManager(),
        settings         = this.getSharedModule('settings'),
        el               = this.getSharedModule('pageElements'),
        helper           = this.getPlugin('helper'),
        toolbarId        = '',
        buttons          = [],
        buttonIndices    = {},
        visible          = true,
        buttonWidth      = 30,
        buttonPadding    = 5,
        buttonsCount     = 0;

    $(el.toolbar).click(function () {
        eventManager.raiseEvent('onTap');
        output.log('toolbar tapped!');
    });
    
    // Enlarge and center the title to prevet ellispsis.
    $('#jqt .toolbar > h1').width(300).css('margin', '1px 0 0 -150px');

    function getButton(index) {
        if (typeof index == 'string') {
            index = buttonIndices[index];
        }

        return buttons[index];
    }

    function create(config) {
        var buttonPrefix = config.buttonPrefix || 'toolbar_btn',
                that = this;

        toolbarId = config.toolbarId || '.toolbar';
        visible = helper.getValueAs(config.visible, 'boolean');

        $.each(config.items, function (i, val) {
            var id = helper.capitaliseFirstLetter(val.id),
                    itemsCount = config.items.length || 1;

            buttonIndices[val.id] = i;
            buttons[i] = {
                id: val.id,
                buttonId: buttonPrefix + id,
                title: val.title,
                btnClass: val.btnClass,
                eventHandler: 'on' + id + 'Tap',
                isDisabled: false,
                isSelected: false,
                select: function () {
                    var button     = $('#' + buttons[i].buttonId),
                        classOn    = buttons[i].btnClass + '_on',
                        classOff   = buttons[i].btnClass + '_off';
                    
                    button.removeClass(classOff);
                    button.addClass(classOn);
                    this.isSelected = true;
                },
                deselect: function () {
                    var button     = $('#' + buttons[i].buttonId),
                        classOn    = buttons[i].btnClass + '_on',
                        classOff   = buttons[i].btnClass + '_off';
                    
                    button.removeClass(classOn);
                    button.addClass(classOff);
                    this.isSelected = false;
                }
            };

            $(toolbarId).append(
                $('<div>')
                    .addClass('toolbar_button ' + buttons[i].btnClass + '_off')
                    .attr({ 
                        id: buttons[i].buttonId,
                        style: 'right: ' + (buttonsCount * buttonWidth + buttonPadding) + 'px;'
                    })
                    .on('click', function(event){
                        var isSelected = buttons[i].isSelected,
                            classOn    = buttons[i].btnClass + '_on',
                            classOff   = buttons[i].btnClass + '_off';
                        
                        output.log('toolbar button tapped!');
                        
                        if (isSelected) {
                            isSelected = false;
                            $(this).removeClass(classOn);
                            $(this).addClass(classOff);
                        } else {
                            isSelected = true;
                            $(this).removeClass(classOff);
                            $(this).addClass(classOn);
                        }
                        
                        buttons[i].isSelected = isSelected;
                        eventManager.raiseEvent(buttons[i].eventHandler, isSelected);
                        event.stopPropagation();
                    })
            );

            buttonsCount += 1;
        });
    }

    toolbar.create = create;
    toolbar.getButton = getButton;

    return toolbar;
});
// ------------------------------------------
// AJAX MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'ajaxManager', plugins: ['helper'], hasEvents: true, isShared: true }, function () {

    var ajaxManager  = {},
        output       = this.getConsole(),
        eventManager = this.getEventManager(),
        helper       = this.getPlugin('helper'),
        token        = '';

    // Public
    function getToken() {
        return token;
    }

    // Public
    function setToken(tokenValue) {
        token = tokenValue || null;
    }

    // Public
    function post(urlValue, dataValue, callbackValue, typeValue) {
        var url      = '',
            data     = {},
            type     = typeValue,
            callback = callbackValue || null;

        url = urlValue;

        if (typeof dataValue !== 'function') {
            data = dataValue || {};
            if (token && !data.token) {
                data.token = token;
            }
        } else {
            callback = dataValue;
            type = callbackValue;
        }

        $.post(url, data, callback, type);

    }

    function get() {

    }

    ajaxManager.post = post;
    ajaxManager.getToken = getToken;
    ajaxManager.setToken = setToken;
    ajaxManager.get = get;

    return ajaxManager;
});
// ------------------------------------------
// CHARTS MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartComponents', plugins: ['helper'], sharedModules: ['chartManager', 'localizationManager'],
    dataObjects: ['charts'], hasEvents: true, isShared: true
}, function () {

    var chartComponents  = {},
        output           = this.getConsole(),
        eventManager     = this.getEventManager(),
        helper           = this.getPlugin('helper'),
        chartManager     = this.getSharedModule('chartManager'),
        lang             = this.getSharedModule('localizationManager').getLanguage() || {},
        createdCharts    = {},
        chartsDataObject = this.getDataObject('charts'),
        chartsData       = null;

    chartsDataObject.define({
        // ------------------------------------------
        // BAR CHARTS
        // ------------------------------------------

        'performance_bar': {
            chartId: 'performance_bar',
            title: lang.chart.performanceBarTitle,
            chartType: 'BarChart',
            include: 'childSegments',
            measures: ['rp'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Return' }
            }
        },
        'risk_bar': {
            chartId: 'risk_bar',
            title: lang.chart.riskBarTitle,
            chartType: 'BarChart',
            include: 'childSegments',
            measures: ['wp', 'contributionvar'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Return' }
            }
        },
        'allocation_bar': {
            chartId: 'allocation_bar',
            title: lang.chart.allocationbarTitle,
            chartType: 'BarChart',
            include: 'childSegments',
            measures: ['wover'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Excess Weight %' }
            }
        },
        'contribution_bar': {
            chartId: 'contribution_bar',
            title: lang.chart.contributionBarTitle,
            chartType: 'BarChart',
            include: 'securities',
            measures: ['ctp'],
            includeMeasuresFor: ['securities'],
            options: {
                hAxis: { title: 'Contribution' }
            }
        },
        'attribution_bar': {
            chartId: 'attribution_bar',
            title: lang.chart.attributionBarTitle,
            chartType: 'BarChart',
            include: 'childSegments',
            measures: ['wendover', 'etotal'],
            includeMeasuresFor: ['childSegments']
        },
        'fixedIncomeContribution_bar': {
            chartId: 'fixedIncomeContribution_bar',
            title: lang.chart.fixedIncomeContributionBarTitle,
            chartType: 'BarChart',
            include: 'none',
            measures: ['ctpyc', 'ctpspread', 'ctpcur'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#FF6600', '#CC0000', '#FFCC00']
            }
        },
        'carryContribution_bar': {
            chartId: 'carryContribution_bar',
            title: lang.chart.carryContributionBarTitle,
            chartType: 'BarChart',
            include: 'none',
            measures: ['ctpsystcarry', 'ctpspeccarry'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#336600', '#990000']
            }
        },
        'yieldCurveContribution_bar': {
            chartId: 'yieldCurveContribution_bar',
            title: lang.chart.yieldCurveContributionBarTitle,
            chartType: 'BarChart',
            include: 'none',
            measures: ['ctpshift', 'ctptwist', 'ctpbutterfly', 'ctprolldown'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#CD66CD', '#339900', '#FF9900', '#660000']
            }
        },
        'riskNumbers_bar': {
            chartId: 'riskNumbers_bar',
            title: lang.chart.riskNumbersBarTitle,
            chartType: 'BarChart',
            include: 'none',
            measures: ['ytmpend', 'mdpend'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#336699', '#530066']
            }
        },

        // ------------------------------------------
        // BUBBLE CHARTS
        // ------------------------------------------

        'performance_bubble': {
            chartId: 'performance_bubble',
            title: lang.chart.performanceBubbleTitle,
            chartType: 'BubbleChart',
            include: 'childSegments',
            measures: ['stddevann', 'returnannifgtyr', 'wpabsolute'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Annualized Volatility' },
                vAxis: { title: 'Annualized Return' }
            }
        },
        'risk_bubble': {
            chartId: 'risk_bubble',
            title: lang.chart.riskBubbleTitle,
            chartType: 'BubbleChart',
            include: 'childSegments',
            measures: ['valueatriskpercent', 'rp', 'wpabsolute'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: '% Value at Risk' },
                vAxis: { title: 'Return' }
            }
        },

        // ------------------------------------------
        // COLUMN CHARTS
        // ------------------------------------------

        'contribution_column': {
            chartId: 'contribution_column',
            title: lang.chart.contributionColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['ctp', 'ctb'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Return %' }
            }
        },
        'interestRatesExposure_column': {
            chartId: 'interestRatesExposure_column',
            title: lang.chart.interestRatesExposureColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['interestratesdown100percent', 'interestratesdown50percent', 'interestratesup50percent', 'interestratesup100percent'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Exposure %' },
                colors: ['#CC0000', '#CD66CD', '#FFCC00', '#3399CC']
            }
        },
        'creditSpreadsExposure_column': {
            chartId: 'creditSpreadsExposure_column',
            title: lang.chart.creditSpreadsExposureColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['creditspreadsdown100percent', 'creditspreadsdown50percent', 'creditspreadsup50percent', 'creditspreadsup100percent'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Exposure %' },
                colors: ['#CC0000', '#CD66CD', '#FFCC00', '#3399CC']
            }
        },
        'dv01Exposure_column': {
            chartId: 'dv01Exposure_column',
            title: lang.chart.dv01ExposureColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['interestratesdv01percent', 'creditspreadsdv01percent', 'inflationratesdv01percent'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Exposure %' },
                colors: ['#3399CC', '#336699', '#003366']
            }
        },
        'attribution_column': {
            chartId: 'attribution_column',
            title: lang.chart.attributionColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['etotal', 'ealloc', 'eselecinter'],
            includeMeasuresFor: ['childSegments'],
            options: {
                colors: ['#003366', '#FF6600', '#990066']
            }
        },

        // ------------------------------------------
        // PIE CHARTS
        // ------------------------------------------

        'allocation_pie': {
            chartId: 'allocation_pie',
            title: lang.chart.allocationPieTitle,
            chartType: 'PieChart',
            include: 'childSegments',
            measures: ['wpabsoluteend'],
            includeMeasuresFor: ['childSegments']
        },
        'contribution_pie': {
            chartId: 'contribution_pie',
            title: lang.chart.contributionPieTitle,
            chartType: 'PieChart',
            include: 'childSegments',
            isHeatMap: true,
            isGradientReversed: false,
            measures: ['wpabsoluteend', 'ctp'],
            includeMeasuresFor: ['childSegments']
        },
        'risk_pie': {
            chartId: 'risk_pie',
            title: lang.chart.riskPietitle,
            chartType: 'PieChart',
            include: 'childSegments',
            isHeatMap: true,
            isGradientReversed: true,
            measures: ['wpabsoluteend', 'contributionvar'],
            includeMeasuresFor: ['childSegments']
        },

        // ------------------------------------------
        // GRIDS
        // ------------------------------------------

        'performance_grid': {
            chartId: 'performance_grid',
            title: lang.chart.performanceGridTitle,
            chartType: 'Table',
            include: 'none',
            measures: [
                'rp', 'returnann', 'stddevann', 'relr',
                'periodaverage', 'oneperiodhigh', 'oneperiodlow',
                'maxloss', 'percentpositiveperiods', 'correlation',
                'alpha', 'beta', 'rsquared', 'sharperatio',
                'treynorratio', 'inforatioxs'
            ],
            includeMeasuresFor: ['segment']
        },
        'attribution_grid': {
            chartId: 'attribution_grid',
            title: lang.chart.attributionGridTitle,
            chartType: 'Table',
            include: 'childSegments',
            measures: [
                'ctp', 'ctb', 'ealloclocal', 'eselecinterlocal', 'etotalc', 'etotalmca'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'fixedIncome_grid': {
            chartId: 'fixedIncome_grid',
            title: lang.chart.fixedIncomeGridTitle,
            chartType: 'Table',
            include: 'childSegments',
            measures: [
                'ttmpend', 'ytmpend', 'mdpend', 'durwpend', 'spreadpend'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'fixedIncomeContribution_grid': {
            chartId: 'fixedIncomeContribution_grid',
            title: lang.chart.fixedIncomeContributionGridTitle,
            chartType: 'Table',
            include: 'childSegments',
            measures: [
                'ctp', 'ctpyc', 'ctpcarry', 'ctpspread', 'ctpcur', 'ctpother', 'ctpresidual'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'fixedIncomeExposure_grid': {
            chartId: 'fixedIncomeExposure_grid',
            title: lang.chart.fixedIncomeExposureGridTitle,
            chartType: 'Table',
            include: 'childSegments',
            measures: [
                'wpend', 'interestratesdv01percent', 'creditspreadsdv01percent', 'inflationratesdv01percent'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'performanceTopTen_grid': {
            chartId: 'performanceTopTen_grid',
            title: lang.chart.performanceTopTenGridTitle,
            chartType: 'Table',
            include: 'securities',
            measures: ['wpend', 'rp', 'ctp'],
            oData: { orderby: 'wpend-Earliest desc', top: 10 },
            includeMeasuresFor: ['securities']
        },
        'contributionTopTen_grid': {
            chartId: 'contributionTopTen_grid',
            title: lang.chart.contributionTopTenGridTitle,
            chartType: 'Table',
            include: 'securities',
            measures: ['wpend', 'rp', 'ctp'],
            oData: { orderby: 'ctp-Earliest desc', top: 10 },
            includeMeasuresFor: ['securities']
        },
        'riskTopTen_grid': {
            chartId: 'riskTopTen_grid',
            title: lang.chart.riskTopTenGridTitle,
            chartType: 'Table',
            include: 'securities',
            measures: ['wpend', 'expectedshortfallpercent', 'valueatriskpercent', 'expectedvolatilitypercent'],
            oData: { orderby: 'valueatriskpercent-Earliest desc', top: 10 },
            includeMeasuresFor: ['securities']
        },

        // ------------------------------------------
        // TREE MAP CHARTS
        // ------------------------------------------

        'performance_treemap': {
            chartId: 'performance_treemap',
            title: lang.chart.performanceTreemapTitle,
            chartType: 'TreeMap',
            include: 'securities',
            measures: ['wpabsoluteend', 'rp'],
            includeMeasuresFor: ['segment', 'securities']
        },
        'risk_treemap': {
            chartId: 'risk_treemap',
            title: lang.chart.riskTreemapTitle,
            chartType: 'TreeMap',
            include: 'childSegments',
            measures: ['wpabsoluteend', 'contributionvar'],
            includeMeasuresFor: ['segment', 'childSegments']
        },

        // ------------------------------------------
        // LINE CHARTS
        // ------------------------------------------

        'performance_line': {
            chartId: 'performance_line',
            title: lang.chart.performanceLineTitle,
            chartType: 'LineChart',
            measures: ['rp', 'rb'],
            seriesType: 'cumulativeIndexed'
        },

        // ------------------------------------------
        // CHART GROUPS
        // ------------------------------------------

        'fi_contribution_group': {
            chartId: 'fi_contribution_group',
            title: lang.chart.fixedIncomeContributionsGroupTitle,
            chartType: 'Group',
            charts: [{
                chartId: 'fixedIncomeContribution_bar',
                width: '50%',
                height: '100%'
            }, {
                chartId: 'carryContribution_bar',
                width: '50%',
                height: '100%'

            }, {
                chartId: 'yieldCurveContribution_bar',
                width: '50%',
                height: '100%'
            }, {
                chartId: 'riskNumbers_bar',
                width: '50%',
                height: '100%'
            }]
        },
        'fi_exposures_group': {
            chartId: 'fi_exposures_group',
            title: lang.chart.fixedIncomeExposuresGroupTitle,
            chartType: 'Group',
            charts: [{
                chartId: 'interestRatesExposure_column',
                width: '50%',
                height: '100%'
            }, {
                chartId: 'creditSpreadsExposure_column',
                width: '50%',
                height: '100%'
            }, {
                chartId: 'dv01Exposure_column',
                width: '50%',
                height: '100%'
            }]
        },
        'fi_gridRiskNumber_group': {
            chartId: 'fi_gridRiskNumber_group',
            title: lang.chart.fixedIncomeRiskNumbersGroupTitle,
            chartType: 'Group',
            charts: [{
                chartId: 'fixedIncome_grid',
                width: '100%',
                height: '100%'
            }, {
                chartId: 'fixedIncomeContribution_grid',
                width: '100%',
                height: '100%'
            }]
        }
    });

    chartsData = chartsDataObject.getData();

    // Public
    function load(chartsToLoad) {
        var chartToLoad, chartId, newRequest = true;

        for (var i = 0; i < chartsToLoad.length; i++) {
            chartId = chartsToLoad[i].chartId;

            // If the chart has been created...
            if (createdCharts[chartId]) {
                // Use it else...
                chartToLoad = createdCharts[chartId];
            } else {
                // Create a new chart and return it.
                chartToLoad = chartManager.create(chartsData[chartId]);
                createdCharts[chartId] = chartToLoad;
            }

            chartManager.load(chartToLoad, newRequest);

            // Change the status of newRequest only if a valid chart has been loaded.
            if (chartToLoad) {
                newRequest = false;
            }
        }
    }

    function setTimePeriod(charts, timePeriod) {
        $.each(charts, function (index, chart) {
            var config;

            // Assign our time period to different objects depending if the chart 
            // has already been created or not; the chart config if it's not yet 
            // created, or add it to the actual chart object if it is.
            config = createdCharts[chart.chartId] || chartsData[chart.chartId];
            config.timePeriods = timePeriod.code;
            config.startDate = timePeriod.startDate;
            config.endDate = timePeriod.endDate;
        });
    }

    function render(charts, renderTo) {
        var chartsToLoad = [],
            htmlToAppend = '';

        function openAnalysisSection(chartId, chartTitle) {
            htmlToAppend = '';
            htmlToAppend +=
                '<div class="analysisSummarySection">' +
                '    <div class="analysisComponentContainer">' +
                '       <div class="analysisComponentHeader">' +
                '           <h2>' + chartTitle + '</h2>' +
                '           <div class="analysisComponentFullScreenButton" data-chartId="' + chartId + '"></div>' +
                '       </div>';
        }
        
        function addChartToAnalysisSection(chartToAdd, containerClass) {
            htmlToAppend +=
                '        <div id="' + chartToAdd.chartId + '" class="' + containerClass + '"></div>';
        }

        function addChartToGroup(chartToAdd) {
            htmlToAppend +=
                '        <div id="' + chartToAdd.chartId +
                '" class="halfSizeChart" style="width: ' + chartToAdd.width + ';' +
                'height: ' + chartToAdd.height + ';"></div>';
        }

        function closeAnalysisSection() {
            htmlToAppend +=
                '        <div style="clear: both;"></div>' +
                '    </div>' +
                '</div>';
        }

        function appendHtmlToAnalysisSection() {
            $(renderTo).append($(htmlToAppend));
        }

        function addChartToChartsToRender(chartToAdd) {
            var chartsToRender = [],
                isGroup        = false,
                containerClass;

            // Exit if the chart to add doesn't exist.
            if (!chartToAdd) {
                output.log('addChartToChartsToRender: Skipped empty chart');
                return;
            }

            // Extract the charts to render if the current chart is a group.
            if (chartToAdd.chartType === 'Group') {
                chartsToRender = chartToAdd.charts;
                isGroup = true;
            } else {
                chartsToRender.push(chartToAdd);
            }

            if (isGroup) {
                openAnalysisSection(chartToAdd.chartId, chartToAdd.title);
            }

            // Define a wrapper DIV class for the chart container depending on
            // the chart type. If the chart is a table, it sets its own height,
            // so an explicit class defining height is not required.
            containerClass = (chartToAdd.chartType === 'Table') ? '' : 'chartContainer';

            // Create the chart containers according to the chart types.
            for (var i = 0; i < chartsToRender.length; i++) {
                chart = chartsData[chartsToRender[i].chartId] || null;

                // Add current chart to the list of charts to load.
                chartsToLoad.push(chart);

                if (chart) {
                    if (isGroup) {
                        addChartToGroup(chartsToRender[i]);
                    } else {
                        openAnalysisSection(chart.chartId, chart.title);
                        addChartToAnalysisSection(chartsToRender[i], containerClass);
                        closeAnalysisSection();
                        appendHtmlToAnalysisSection();
                    }
                }
            }

            if (isGroup) {
                closeAnalysisSection();
                appendHtmlToAnalysisSection();
            }
        }

        for (var i = 0; i < charts.length; i++) {
            addChartToChartsToRender(chartsData[charts[i].chartId] || null);
        }

        load(chartsToLoad);
    }

    // TODO: Investigate...
    chartManager.on('onAnalysisLoaded', function () {
        eventManager.raiseEvent('onAllChartsLoaded');
    });

    chartManager.on('onAnalysisLoading', function (chartCount, chartTotal) {
        eventManager.raiseEvent('onChartsLoading', chartCount, chartTotal);
    });

    chartComponents.load = load;
    chartComponents.render = render;
    chartComponents.setTimePeriod = setTimePeriod;

    return chartComponents;
});
// ------------------------------------------
// SETTINGS
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartDefaults', isShared: true }, function () {
    var chartDefaults  = {},
        commonSettings = {},
        barChart       = {},
        bubbleChart    = {},
        columnChart    = {},
        gaugeChart     = {},
        gridChart      = {},
        lineChart      = {},
        pieChart       = {},
        treeMapChart   = {},
        output         = this.getConsole();

    // COMMON CHART SETTINGS
    commonSettings = {
        forceIFrame: false,
        labelFontName: 'HelveticaNeue-Light',
        labelFontSize: 12,
        titleFontName: 'HelveticaNeue-Bold',
        titleFontSize: 25
    };

    // BUBBLE CHART
    bubbleChart = {
        chartArea: { left: 80, top: 35, width: '70%', height: '80%' },
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
        hAxis: {
            titleTextStyle: {
                fontName: commonSettings.titleFontName,
                fontSize: commonSettings.titleFontSize
            }
        },
        sizeAxis: {
            maxSize: 100,
            maxValue: 100,
            minSize: 1,
            minValue: 1
        },
        vAxis: {
            titleTextStyle: {
                fontName: commonSettings.titleFontName,
                fontSize: commonSettings.titleFontSize
            }
        }
    };

    // BAR CHART
    barChart = {
        chartArea: { left: '20%', width: '60%', height: '80%' },
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
        vAxis: {
            titleTextStyle: {
                fontName: commonSettings.titleFontName,
                fontSize: commonSettings.titleFontSize
            }
        }
    };

    // COLUMN CHART
    columnChart = {
        chartArea: { left: '10%', width: '70%', height: '75%' },
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
        vAxis: {
            titleTextStyle: {
                fontName: commonSettings.titleFontName,
                fontSize: commonSettings.titleFontSize
            }
        }
    };

    // GAUGE CHART
    gaugeChart = {
        forceIFrame: commonSettings.forceIFrame,
        height: 250,
        greenFrom: 0,
        greenTo: 4,
        yellowFrom: 4,
        yellowTo: 6,
        redFrom: 6,
        redTo: 20,
        max: 20,
        minorTicks: 5
    };

    // GRID CHART
    gridChart = {
        allowHtml: true,
        alternatingRowStyle: true,
        forceIFrame: commonSettings.forceIFrame,
        cssClassNames: {
            headerRow: 'headerRow',
            tableRow: 'tableRow',
            oddTableRow: 'oddTableRow',
            selectedTableRow: 'selectedTableRow',
            hoverTableRow: 'hoverTableRow'
        }
    };

    // LINE CHART
    lineChart = {
        chartArea: { left: 80, top: 35, width: '75%', height: '80%' },
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame
    };

    // PIE CHART
    pieChart = {
        chartArea: { left: 80, width: '75%', height: '80%' },
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
        is3D: true
    };

    // TREE MAP (HEATMAP) CHART
    treeMapChart = {
        fontFamily: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
        headerHeight: 25,
        minColor: '#cc0000',
        midColor: '#ffffff',
        maxColor: '#6699cc',
        maxDepth: 3
    };

    function changeSetting(key, value) {
        commonSettings[key] = value;
        output.log('change setting');
    }

    // Assign the specific chart defaults to the container object.
    chartDefaults.BarChart = barChart;
    chartDefaults.BubbleChart = bubbleChart;
    chartDefaults.ColumnChart = columnChart;
    chartDefaults.Gauge = gaugeChart;
    chartDefaults.LineChart = lineChart;
    chartDefaults.PieChart = pieChart;
    chartDefaults.Table = gridChart;
    chartDefaults.TreeMap = treeMapChart;

    chartDefaults.set = changeSetting; // Alias

    return chartDefaults;
});
// ------------------------------------------
// CHART MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartManager',
    sharedModules: ['settings', 'chartDefaults', 'colorManager', 'localizationManager', 'ajaxManager'],
    isShared: true, hasEvents: true
}, function () {
    var chartBase     = {},
        charts        = [],
        eventManager  = this.getEventManager(),
        chartDefaults = this.getSharedModule('chartDefaults'),
        siteUrls      = this.getSharedModule('settings').siteUrls,
        colorManager  = this.getSharedModule('colorManager'),
        lang          = this.getSharedModule('localizationManager').getLanguage() || {},
        ajaxManager   = this.getSharedModule('ajaxManager'),
        output        = this.getConsole(),
        chartCount    = 0,
        chartTotal    = 0,
        isLoading     = false;

    function resetCounter() {
        chartCount = 0;
        chartTotal = 0;
        isLoading = false;
    }

    function startCounter() {
        resetCounter();
        isLoading = true;
    }

    function stopCounter() {
        resetCounter();
    }

    // Function to be called when the chart has finished attempting to load.
    // NOTE: 'Finished' does not necessarily infer success - a chart may have 
    // unsuccessfully attempted to load and in doing so will pass an error
    // object as an argument to this function.
    function onChartReady(errorObj) {
        var container;

        // Regardless of any error state, we still want the attempted load count to be
        // updated and the 'onAnalysisLoading' and 'onAnalysisLoaded' events raised.
        if (isLoading) {
            chartCount += 1;
            eventManager.raiseEvent('onAnalysisLoading', chartCount, chartTotal);

            // If all of the charts created have been loaded...
            if (chartCount === chartTotal) {
                // ...fire the onAnalysisLoaded event.
                stopCounter();
                eventManager.raiseEvent('onAnalysisLoaded');
            }
        }

        // If we've got an error...
        if (errorObj && errorObj.id) {
            // ...retrieve the container of the chart causing the problem.
            container = google.visualization.errors.getContainer(errorObj.id);
            // Display a generic error message rather than a potentially confusing Google one.
            $('#' + container.id).html(lang.errors.chartFailedText);
        }
    }

    // Function to create a new chart.
    // 'config' - An object containing configuration properties for the chart to be created.
    function create(config) {

        if (!config) {
            output.log('Config is not specified.');
            return;
        }

        var id = config.chartId || null,
            type = config.chartType || null,
            options = config.options || {},
            defaults = {},
            chart = null;

        // Return nothing if a chart ID or chart type has not been specified.
        if (!id || !type) {
            output.log('Chart ID or type is not specified.');
            return;
        }

        // Retrieve the defaults for the given chart type, if available.
        defaults = (chartDefaults && chartDefaults[type])
            ? chartDefaults[type]
            : {};

        // Apply defaults then any overrides to a new object.
        options = $.extend({}, defaults, options);

        // Add a transparent background to all charts.
        options.backgroundColor = { fill: 'transparent' };

        // Create a new visualization wrapper instance, using the type, options and ID.
        chart = new google.visualization.ChartWrapper({
            chartType: type,
            options: options,
            containerId: id
        });

        // ASA: Test
        var presentationChart = chart.clone();
        presentationChart.setContainerId('testChart');

        // Although it's not part of the Google API, store 
        // the parameters for this chart in the object.
        chart.endDate = config.endDate;
        chart.include = config.include;
        chart.includeMeasuresFor = config.includeMeasuresFor;
        chart.isGradientReversed = config.isGradientReversed;
        chart.isHeatMap = config.isHeatMap;
        chart.measures = config.measures;
        chart.oData = config.oData;
        chart.seriesType = config.seriesType;
        chart.startDate = config.startDate;
        chart.timePeriods = config.timePeriods;

        // Register the chart with the ready and error event listeners.
        google.visualization.events.addListener(chart, 'ready', onChartReady);
        google.visualization.events.addListener(chart, 'error', onChartReady);

        // Return the chart.
        return chart;
    }

    // Function to load the given chart with data.
    // 'chart'  - The instance of the Google Visualization API chart object to load.
    function load(chart, newRequest) {
        var type, params, url, formatter;

        // Don't attempt to load the chart if it doesn't exist yet.
        if (!chart) {
            return;
        }

        // Restart the counter every new request.
        if (newRequest) {
            startCounter();
        }

        // Increase the running chart total.
        chartTotal++;

        // Get the current chart type.
        type = chart.getChartType();

        // Create a new number formatter.
        formatter = new google.visualization.NumberFormat({
            decimalSymbol: lang.shared.decimalSymbol,
            fractionDigits: 3,
            groupingSymbol: lang.shared.groupingSymbol,
            negativeColor: '#cc0000',
            negativeParens: false
        });

        // Define our basic parameters.
        params = {
            type: type
        };

        // Only include parameters in the object if they exist.
        if (chart.endDate) { params.endDate = chart.endDate; }
        if (chart.include) { params.include = chart.include; }
        if (chart.includeMeasuresFor) { params.includeMeasuresFor = chart.includeMeasuresFor; }
        if (chart.measures) { params.measures = chart.measures; }
        if (chart.oData) { params.oData = chart.oData; }
        if (chart.startDate) { params.startDate = chart.startDate; }
        if (chart.seriesType) { params.seriesType = chart.seriesType; }
        if (chart.timePeriods) { params.timePeriods = chart.timePeriods; }

        // Define the correct URL to use to retrieve data based on the chart type.
        url = (type === 'LineChart') ? siteUrls.timeSeries : siteUrls.segmentsTreeNode;

        // Callback function to be invoked when data is returned from the server.
        function onDataLoaded(data) {
            var dataTable, i, min, max, values = [], sliceOptions = [];

            output.log(data);

            // Create a new visualization DataTable instance based on the data.
            dataTable = new google.visualization.DataTable(data);

            // Loop round the columns, applying the formatter to 'number' columns.
            for (i = 0; i < dataTable.getNumberOfColumns(); i++) {
                if (dataTable.getColumnType(i) === 'number') {
                    formatter.format(dataTable, i);
                }
            }

            // If our chart is a pie chart and we're displaying it as a heatmap...
            if (type === 'PieChart' && chart.isHeatMap) {

                // ...collate the heatmap measure from the datatable.
                for (i = 0; i < dataTable.getNumberOfRows(); i++) {
                    values.push(dataTable.getValue(i, 2));
                }

                // Get the highest and lowest values from the heatmap measure values.
                min = Math.min.apply(Math, values);
                max = Math.max.apply(Math, values);

                // Generate absolute minmax values.
                if (Math.abs(min) > Math.abs(max)) {
                    max = Math.abs(min);
                    min = -(Math.abs(min));
                } else {
                    max = Math.abs(max);
                    min = -(Math.abs(max));
                }

                // Loop round the values, and use the colorManager to generate 
                // a colour in the gradient range for that measure value.
                for (i = 0; i < values.length; i++) {
                    sliceOptions.push({
                        color: colorManager.getColorInRange(values[i], min, max, chart.isGradientReversed)
                    });
                }

                chart.setOption('slices', sliceOptions);
            }

            // Set the data table for the chart.
            chart.setDataTable(dataTable);

            // Draw the chart.
            chart.draw();

            // Set up the chart to be redrawn on change of orientation.
            $(document).on('orientationchange', function (event) {
                // chart.draw();
            });
        }

        // Attempt to load the data.
        // NOTE: The dataType is set to 'text' rather than 'json' to stop Zepto
        // attempting to parse dates which the Google Visualization API expects 
        // to parse itself, causing an error.
        ajaxManager.post(url, params, onDataLoaded, 'text');
    }

    chartBase.create = create;
    chartBase.load = load;

    return chartBase;
});
// ------------------------------------------
// SETTINGS
// ------------------------------------------

WebAppLoader.addModule({ name: 'colorManager', isShared: true }, function () {
    var colorManager = {},
        output = this.getConsole();

    // Removes the hex in front of a hex value if there is one.
    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
    }

    // Returns a hex value for the given number.
    function toHex(n) {
        var hexValues = '0123456789ABCDEF';

        // Test that we've got a number.
        n = parseInt(n, 10);

        // If not, return a default value.
        if (isNaN(n)) {
            return "00";
        }

        // Ensure our value is within range (0 - 255).
        n = Math.max(0, Math.min(n, 255));

        // Return the appropriate characters from the hex values string.
        return hexValues.charAt((n - n % 16) / 16) + hexValues.charAt(n % 16);
    }

    // Returns a hex value for the given RGB value.
    function rgbToHex(r, g, b) {
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    // Gets the red RGB value for the passed hex value.
    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16);
    }

    // Gets the green RGB value for the passed hex value.
    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16);
    }

    // Gets the blue RGB value for the passed hex value.
    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16);
    }

    // Transforms the integer provided into a byte value.
    function getByteValue(value) {
        return parseInt(value, 10) & 255;
    }

    // Helper method to interpolate between two min and max values given a specific value.
    function interpolate(min, max, value) {
        return getByteValue(getByteValue(min) * (1 - value) + getByteValue(max) * value);
    }

    function getColorInRange(value, min, max, reverseGradient) {
        var colors = [],
            red = '#cc0000',
            yellow = '#ffff00',
            green = '#339900',
            key, color, previousKey, previousColor, storedColor,
            i, p;

        // Range check. If the value is out of range, return the most extreme colour. This shouldn't occur, but for
        // hard-coded absolute ranges where the actual values may not always fit, it's better to return a colour.
        if (value < min) {
            return red;
        }

        if (value > max) {
            return green;
        }

        if (reverseGradient) {
            // If the value is positive, the colour will be between red and yellow.
            if (value > 0) {
                colors.push([0, yellow]);
                colors.push([max, red]);                
            } else {
                colors.push([min, green]);
                colors.push([0, yellow]);                
            }
        } else {
            // If the value is positive, the colour will be between yellow and green.
            if (value > 0) {
                colors.push([max, green]);
                colors.push([0, yellow]);
            } else {
                colors.push([0, yellow]);
                colors.push([min, red]);
            }
        }

        // Store our middle colour.
        storedColor = [0, yellow];

        for (i = 0; i < colors.length; i++) {
            
            key = colors[i][0];
            
            if (key >= value) {

                color = colors[i][1];
                previousKey = storedColor[0];
                previousColor = storedColor[1];
                p = ((value - previousKey) / (key - previousKey));

                // Generate a new hex colour by interpolating between the 
                // R, G and B values of the current and previous colours.
                return rgbToHex(
                    interpolate(hexToR(previousColor), hexToR(color), p), 
                    interpolate(hexToG(previousColor), hexToG(color), p), 
                    interpolate(hexToB(previousColor), hexToB(color), p)
                );
            }

            storedColor = colors[i];
        }

        // If the dictionary was empty, the value was 
        // exactly zero, so return the middle value.
        return yellow;
    }

    colorManager.getColorInRange = getColorInRange;

    return colorManager;
});
// ------------------------------------------
// LOADING MASK MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'loadingMaskManager', sharedModules: ['pageElements'], plugins: ['helper'], hasEvents: true, isShared: true }, function () {
    var loadingMaskManager  = {},
        output              = this.getConsole(),
        eventManager        = this.getEventManager(),
        el                  = this.getSharedModule('pageElements'),
        helper              = this.getPlugin('helper'),
        loadingText         = null,
        masks               = {};


    // Define the loading mask text.
    loadingText = $(el.loadingText);

    // Define all the available masks.
    masks.ajax = {
        name        : 'ajax',
        enabled     : true,
        el          : el.loadingMask
    };

    masks.analysis = {
        name        : 'analysis',
        enabled     : true,
        el          : el.chartLoadingMask
    };

    masks.turn = {
        name        : 'turn',
        enabled     : true,
        el          : el.turnLoadingMask
    };
    
    masks['default'] = masks.ajax;

    $(el.loadingMask).click(function(){
        hide('ajax');
    });

    $(el.chartLoadingMask).click(function(){
        hide('analysis');
    });

    function show(type /* TODO: fade */) {
        var mask = masks[type || 'default'] || null;

        if (mask && mask.enabled) {
            $(mask.el).hide();
            $(mask.el).show();
        }
    }

    function hide(type /* TODO: fade */) {
        var mask = masks[type || 'default'] || null;

        if (mask) {
            $(mask.el).css("display", "none");
        }
    }
    
    function updateAnalysisText(text) {
        loadingText.html(text);
    }

    // TODO: Add code to prevent showing of any masks and or to enable/disable them.
    loadingMaskManager.show = show;
    loadingMaskManager.hide = hide;
    loadingMaskManager.updateAnalysisText = updateAnalysisText;

    return loadingMaskManager;
});
// ------------------------------------------
// LOCALIZATION MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'localizationManager', isShared: true }, function (config) {
    var manager     = {},
        output      = this.getConsole(),
        language    = require('language');

    manager.sayHello = function () {
        output.log(language.hello);
    };

    // Public
    function get(text) {
        var localizedString = language[text] || '';

        return localizedString;
    }

    // Public
    function getLanguage() {
        return language;
    }

    manager.get = get;
    manager.getLanguage = getLanguage;

    return manager;
});
// ------------------------------------------
// LOCAL STORAGE MANAGER
// ---------------------    ---------------------

WebAppLoader.addModule({ name: 'localStorageManager', sharedModules: [], plugins: ['helper'], hasEvents: true, isShared: true }, function () {
    var localStorageManager  = {},
        output               = this.getConsole(),
        eventManager         = this.getEventManager(),
        helper               = this.getPlugin('helper'),
        revolutionNamespace  = 'Revolution';

    // Private
    function getNamespacedName(itemName, namespace) {
        var namespacedName = null;

        if (itemName && (typeof itemName === 'string')) {
            namespacedName = (namespace || revolutionNamespace) + helper.capitaliseFirstLetter(itemName);
        }

        return namespacedName;
    }

    // Private
    function setItem(key, value) {
        localStorage.setItem(key, value);
        output.log('Local Storage Manager - setItem:', key, value);
    }

    // Private
    function getItem(key) {
        return localStorage.getItem(key);
    }

    // Public
    function load(itemName, namespace) {
        var name        = getNamespacedName(itemName, namespace),
            storedItem  = getItem(name),
            value       = null;
        
        // Check if the value exists and try to retrieve it.
        if (storedItem) {
            // Check if the value is a stringified JSON object.
            if (helper.startsWith(storedItem, '{"')) {
                try {
                    value = JSON.parse(storedItem);
                } catch (e) {
                    output.log('Local Storage Manager - failed to parse stored item:', key, value);
                }
            } else {
                value = storedItem;
            }
        }
        
        return value;    
    }

    // Public
    function save(itemName, itemValue, namespace) {
        var name = getNamespacedName(itemName, namespace),
            value = ''; //stringifiedValue = '';

        if (name && helper.hasValue(itemValue)) {
            value = (typeof itemValue === 'object')
                ? JSON.stringify(itemValue)
                : itemValue;
            
            setItem(name, value);
                        
        } else {
            output.log('Local Storage Manager - cannot save item.', itemName, itemValue);
        }
    }

    // Public
    function remove(itemName, namespace) {
        var name = getNamespacedName(itemName, namespace);

        if (name) {
            localStorage.removeItem(name);
            output.log('Local Storage Manager - removed item.', name);
        }
    }

    // Public
    function count() {
        output.log('count()', localStorage.length);
    }

    // Public
    function clearAll() {
        localStorage.clear();  
        output.log('clearAll()');
    }

    function clearUserSettings(username) {
        for (var key in localStorage) {
            if(helper.startsWith(key, username)) {
                localStorage.removeItem(key);
            }
        }
    }

    localStorageManager.load = load;
    localStorageManager.save = save;
    localStorageManager.remove = remove;
    localStorageManager.count = count;
    localStorageManager.clearAll = clearAll;
    localStorageManager.clearUserSettings = clearUserSettings;

    return localStorageManager;
});
// ------------------------------------------
// PAGE ELEMENTS
// ------------------------------------------

WebAppLoader.addModule({ name: 'pageElements', isShared: true }, function () {
    var pageElements = {};

    pageElements = {
        // App pages.
        blankPage                           : '#blank_page',
        dashboardPage                       : '#dashboard',
        homePage                            : '#home',
        portfoliosPage                      : '#portfolios',
        portfolioAnalysisPage               : '#portfolioAnalysis',
        analysisPage                        : '#analysis',
        eulaPage                            : '#eula',
        settingsPage                        : '#settings',
        loginPage                           : '#login',
        startupPage                         : '#startup',
        chartSettingsPage                   : '#chartSettings',
        themesPage                          : '#themes',
        languageSettingsPages               : '#languageSettings',
        errorPage                           : '#error',
        fullScreenPage                      : '#fullScreenPage',
	

        // Elements.
        portfolioAnalysisLink               : '.defaultAnalysisLink',
        toolbar                             : '.toolbar',
        loginButton                         : '#loginButton',
        loginErrorText                      : '#loginErrorText',
        loadingMask                         : '#myloading',
        chartLoadingMask                    : '#myLoadingCharts',
        turnLoadingMask                     : '#turnLoadingMask',
        userNameTextbox                     : '#userNameTextbox',
        passwordTextbox                     : '#passwordTextbox',
        tabbar                              : 'nav#tabbar',
        listAnalysisSettingsDefaultPages    : '#listAnalysisSettingsDefaultPages',
        listAnalysisSettingsUserPages       : '#listAnalysisSettingsUserPages',
        chartsSelectbox                     : '#chartsSelectbox',
        analysisPageNameTextbox             : '#analysisPageNameTextbox',
        saveChartSettings                   : '#saveChartSettings',
        addNewAnalysisPage                  : '#addNewAnalysisPage',
        analysisTitle                       : '#analysisTitle',
        loadingText                         : '#loadingText',
        listLanguagesPages                  : '#listLanguagesPages',
        timePeriodStartDateText             : '#timePeriodStartDateText',
        timePeriodEndDateText               : '#timePeriodEndDateText',
        errorMessageText                    : '#errorMessageText',
        stayLoggedCheckbox                  : '#stayLoggedCheckbox',
        userEmailLabel                      : '#userEmailLabel',
        summaryTitleName                    : '#summaryTitleName',
        summaryTitleBenchmarkName           : '#summaryTitleBenchmarkName',
        resetCurrentSettingsButton          : '#resetCurrentSettingsButton',
        resetAllSettingsButton              : '#resetAllSettingsButton',
        reloadAppButton                     : '#reloadAppButton',
        analysisComponentFullScreenButton   : '.analysisComponentFullScreenButton',
        fullScreenContainer                 : '#fullScreenContainer',
        minimizeButton                      : '#minimizeButton',
        fullScreenMask                      : '#fullScreenMask',
	    turnIcon                            : '#turnIcon'
    };

    return pageElements;
});
// ------------------------------------------
// SETTINGS
// ------------------------------------------

WebAppLoader.addModule({ name: 'settings', dataObjects: ['appSettings', 'userSettings'], isShared: true }, function () {
    var settings            = {},
        appSettings         = {},
        siteUrls            = {},
        languages           = [],
        output              = this.getConsole(),
        userSettingsDataObj = this.getDataObject('userSettings'),
        appSettingsDataObj  = this.getDataObject('appSettings');

    userSettingsDataObj.define({
        automaticLogin      : false,
        username            : '',
        password            : '',
        language            : 'en-US',
        lastUsedLanguage    : 'none'
    });

    appSettingsDataObj.define({
        lastLoggedOnUser    : ''
    });
    
    // APP SETTINGS.
    appSettings = {
        loadPortfoliosSlotDataOnce: true,
        automaticLanguageDetection: true
    };

    // URLs.
    siteUrls = {
        portfolios          : '/portfolios',
        authenticate        : '/authenticate',
        index               : '/index',
        portfolioAnalysis   : '/portfolioAnalysis',
        analysis            : '/analysis',
        segmentsTreeNode    : '/segmentsTreeNode',
        timeSeries          : '/timeSeries',
        eula                : '/eula'
    };

    // LANGUAGES
    languages = [{
        id      : 'en-US',
        value   : 'en-US',
        name    : 'English'
    }, {
        id      : 'it-IT',
        value   : 'it-IT',
        name    : 'Italiano'
    }];

    function changeSetting(key, value) {
        appSettings[key] = value;
        output.log('change setting');
    }

    function get(key) {
        return appSettings[key];
    }

    function getVersion() {
        return '1.0';
    }

    settings.changeSetting = changeSetting;
    settings.set = changeSetting; // Alias
    settings.get = get;
    settings.getVersion = getVersion;
    settings.appSettings = appSettings;
    settings.siteUrls = siteUrls;
    settings.languages = languages;

    return settings;
});
// ------------------------------------------
// ANALYSIS MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'analysisManager', plugins: ['helper'], 
    sharedModules: [], dataObjects: ['analysisPages'], hasEvents: true }, function () {

    var analysisManager         = {},
        output                  = this.getConsole(),
        eventManager            = this.getEventManager(),
        helper                  = this.getPlugin('helper'),
        analysisPagesDataObj    = this.getDataObject('analysisPages'),
        charts                  = [],
        analysisPages           = {};

    analysisPagesDataObj.define({
        items: [{
            name        : 'Performance',
            id          : 'performance',
            order       : 1,
            userDefined : false,
            charts      : [{
                    chartId : 'performance_line',
                    order   : 1
                }, {
                    chartId : 'performance_grid',
                    order   : 2
                },{
                    chartId : 'performance_bubble',
                    order   : 3
                },{
                    chartId: 'performance_bar',
                    order   : 4
                },{
                    chartId: 'performance_treemap',
                    order   : 5
                },{
                    chartId: 'performanceTopTen_grid',
                    order   : 6
                }] 
        },{
            name        : 'Risk',
            id          : 'risk',
            order       : 2,
            userDefined : false,
            charts      : [{
                    chartId: 'risk_treemap',
                    order   : 1
                },{
                    chartId: 'risk_bar',
                    order   : 2
                },{
                    chartId: 'risk_bubble',
                    order   : 3
                },{
                    chartId: 'risk_pie',
                    order   : 4
                },{
                    chartId: 'riskTopTen_grid',
                    order   : 5
                }]             
        },{
            name        : 'Asset Allocation',
            id          : 'assetAllocation',
            order       : 3,
            userDefined : false,
            charts      : [{
                    chartId: 'allocation_pie',
                    order   : 1
                },{
                    chartId: 'allocation_bar',
                    order   : 2
                }]             
        },{
            name        : 'Contribution',
            id          : 'contribution',
            order       : 4,
            userDefined : false,
            charts      : [{
                    chartId: 'contribution_pie',
                    order   : 1
                },{
                    chartId: 'contribution_column',
                    order   : 2
                },{
                    chartId: 'contribution_bar',
                    order   : 3
                },{
                    chartId: 'contributionTopTen_grid',
                    order   : 4
                }]            
        },{
            name        : 'Attribution',
            id          : 'attribution',
            order       : 5,
            userDefined : false,
            charts      : [{
                    chartId: 'attribution_column',
                    order   : 1
                },{
                    chartId: 'attribution_bar',
                    order   : 2
                },{
                    chartId: 'attribution_grid',
                    order   : 3
                }]              
        },{
            name        : 'Fixed Income',
            id          : 'fixedIncome',
            order       : 6,
            userDefined : false,
            charts      : [{
                    title: 'Bar Charts of Fixed Income Contributions:',
                    chartId: '',
                    order   : 1
                },{
                    chartId: 'fixedIncomeContribution_bar',
                    order   : 2
                },{
                    chartId: 'carryContribution_bar',
                    order   : 3
                },{
                    chartId: 'yieldCurveContribution_bar',
                    order   : 4
                },{
                    chartId: 'riskNumbers_bar',
                    order   : 5
                },{
                    title: 'Column Charts of Fixed Income Exposures:',
                    chartId: '',
                    order   : 6
                },{
                    chartId: 'interestRatesExposure_column',
                    order   : 7
                },{
                    chartId: 'creditSpreadsExposure_column',
                    order   : 8
                },{
                    chartId: 'dv01Exposure_column',
                    order   : 9
                },{
                    title: 'Grid of Risk Numbers:',
                    chartId: '',
                    order   : 10
                },{
                    chartId: 'fixedIncome_grid',
                    order   : 11
                },{
                    chartId: 'fixedIncomeContribution_grid',
                    order   : 12
                },{
                    title: 'Grid of FI Exposure',
                    chartId: '',
                    order   : 13
                },{
                    chartId: 'fixedIncomeExposure_grid',
                    order   : 14
                }]   
        } ,{
            name        : 'User Defined Test Page',
            id          : 'test1',
            order       : 100,
            userDefined : true,
            charts      : [{
                    chartId: 'fi_contribution_group',
                    order   : 1
                }]             
        }]
    });

    // Public
    function restoreDefaults() {
        analysisPages = analysisPagesDataObj.getData();
    }

    function analysisUpdated() {
        eventManager.raiseEvent('onUpdated', analysisPagesDataObj.getData());
    }

    function init(lastUsernameUsed) {
        var userAnalysisPages;
        
        if (lastUsernameUsed) {
            analysisPagesDataObj.loadData(lastUsernameUsed);
        } 

        analysisUpdated();
    }
        
    analysisManager.init = init;
    analysisManager.update = init; // Alias

    return analysisManager;
});
// ------------------------------------------
// AUTHENTICATION
// ------------------------------------------

WebAppLoader.addModule({ name: 'auth', plugins: ['base64'], sharedModules: ['ajaxManager'], hasEvents: true }, function () {
    var auth            = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        base64          = this.getPlugin('base64'),
        ajaxManager     = this.getSharedModule('ajaxManager'),
        hash            = '';

    function doLogin(username, password, url) {
        var token, tokenHash;
        
        hash = '';
        tokenHash = base64.encode(username + ':' + password);
        token = 'Basic ' + tokenHash;

        // Post the created token and the user's email to the authenticate action.
        ajaxManager.post(url, { email: username, token: token }, function (response) {
            // If our response indicates that the user has been authenticated...
            if (response.authenticated) {
                hash = tokenHash;
                eventManager.raiseEvent('onLoginSuccess', token); //response.portfolioTotal
            } else {
                eventManager.raiseEvent('onLoginFailed', response.message);
            }
        }, 'json');
    }

    function getHash() {
        return hash;
    }

    auth.doLogin = doLogin;
    auth.getHash = getHash;

    return auth;
});

// ------------------------------------------
// FAVOURITES MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'favouritesManager', plugins: ['helper'], 
    sharedModules: [], dataObjects: ['favourites'], hasEvents: true }, function () {

    var favouritesManager    = {},
        output               = this.getConsole(),
        eventManager         = this.getEventManager(),
        helper               = this.getPlugin('helper'),
        favouritesDataObj    = this.getDataObject('favourites'),
        favourites           = {};

    favouritesDataObj.define({
        items: []
    });

    function createIdFromAnalysisDataObject(analysisDataObject) {
        var favouriteId = null,
            dataObj     = analysisDataObject;

        if (dataObj.portfolioId &&  dataObj.analysisId && dataObj.timePeriodId) {
            favouriteId = dataObj.portfolioId +  dataObj.analysisId + dataObj.timePeriodId;
        }

        return favouriteId;
    }
    
    function getFavourteFromAnalysisDataObject(analysisDataObject) {
        var favouriteObj = {};

        favouriteObj.title        = analysisDataObject.portfolioName + ' - ' +
                                    analysisDataObject.analysisName + ' - ' +
                                    analysisDataObject.timePeriodName;
        favouriteObj.favouriteId  = analysisDataObject.portfolioId +
                                    analysisDataObject.analysisId +
                                    analysisDataObject.timePeriodId;
        favouriteObj.portfolioId  = analysisDataObject.portfolioId;
        favouriteObj.analysisId   = analysisDataObject.analysisId;
        favouriteObj.timePeriodId = analysisDataObject.timePeriodId;

        return favouriteObj;
    }

    function getAnalysisDataObjectFromFavourte(favouriteId) {
        var favourites         = favouritesDataObj.getData(),
            analysisDataObject = null,
            favourite          = {};

        for (var i = 0; i < favourites.items.length; i++) {
            favourite = favourites.items[i];
            if (favourite.favouriteId === favouriteId) {
                // Create a new analysisDataObject and populate it with
                // values from favourite.
                analysisDataObject = {}; 
                analysisDataObject.portfolioId = favourite.portfolioId;
                analysisDataObject.analysisId = favourite.analysisId;
                analysisDataObject.timePeriodId= favourite.timePeriodId;
                return analysisDataObject;   
            }
        }

        return analysisDataObject;
    }

    function favouriteExists(favouriteId) {
        var favourites = favouritesDataObj.getData();
    }

    function favouritesUpdated() {
        eventManager.raiseEvent('onFavouritesUpdated', favouritesDataObj.getData());
    }

    function init(lastUsernameUsed) {
        var favourites;
        
        if (lastUsernameUsed) {
            favouritesDataObj.loadData(lastUsernameUsed);
        } 

        favouritesUpdated();
    }
        
    favouritesManager.init = init;
    favouritesManager.update = init; // Alias
    favouritesManager.createIdFromAnalysisDataObject = createIdFromAnalysisDataObject;
    favouritesManager.getFavourteFromAnalysisDataObject = getFavourteFromAnalysisDataObject;
    favouritesManager.favouriteExists = favouriteExists;
    favouritesManager.getAnalysisDataObjectFromFavourte = getAnalysisDataObjectFromFavourte;

    return favouritesManager;
});
// ------------------------------------------
// NAV
// ------------------------------------------

WebAppLoader.addModule({ name: 'nav', hasEvents: true }, function () {
    var nav             = {},
        eventManager    = this.getEventManager();

    // Navigate to an external page.
    function navigateTo(url) {
        window.location = url;
    }

    // Future uses.
    function goToPage(idPage, animation) {
        jQT.goTo($(idPage), animation || 'fade');
    }

    function reloadApp(params) {
        var paramsToAdd = params || '';

        window.location = './' + paramsToAdd;
        return false;
    }

    nav.goToPage = goToPage;
    nav.reloadApp = reloadApp;

    return nav;
});

// ------------------------------------------
// EVENT PAGE MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'pageEventsManager', plugins: ['helper'], sharedModules: ['pageElements', 'loadingMaskManager'], hasEvents: true }, function () {
    var pageEventsManager   = {},
        eventManager        = this.getEventManager(),
        output              = this.getConsole(),
        helper              = this.getPlugin('helper'),
        el                  = this.getSharedModule('pageElements'),
        mask                = this.getSharedModule('loadingMaskManager');

    $('div[data-pageEvents]').each(function () {
        var eventHandler = '';

        switch ($(this).attr("data-pageEvents")) {
            case 'start':
                $(this).on('pageAnimationStart', function (e, info) {
                    if (info.direction === 'in') {
                        eventManager.raiseEvent('on' + helper.capitaliseFirstLetter(this.id) + 'Start');
                    }
                });
                break;

            case 'end':
                $(this).on('pageAnimationEnd', function (e, info) {
                    if (info.direction === 'in') {
                        eventManager.raiseEvent('on' + helper.capitaliseFirstLetter(this.id) + 'End');
                    }
                });
                break;

            case 'both':
                $(this).on('pageAnimationStart', function (e, info) {
                    if (info.direction === 'in') {
                        eventManager.raiseEvent('on' + helper.capitaliseFirstLetter(this.id) + 'Start');
                    }
                });

                $(this).on('pageAnimationEnd', function (e, info) {
                    if (info.direction === 'in') {
                        eventManager.raiseEvent('on' + helper.capitaliseFirstLetter(this.id) + 'End');
                    }
                });
                break;

            case 'none':
                break;

            default:
        }
    });

    // ------------------------------------------
    // GLOBAL AJAX EVENTS
    // ------------------------------------------

    // Global Ajax Call
    $(document).on('ajaxStart', onAjaxStart);
    $(document).on('ajaxComplete', onAjaxComplete);

    function onAjaxStart(event, request, settings) {
        mask.show('ajax');
        output.log('ajaxStart', event, request, settings);
    }

    function onAjaxComplete(event, request, settings) {
        mask.hide('ajax');
        // Return false to cancel this request.
        var obj = {};
        try {
            obj = JSON.parse(request.response);
        } catch (e) {

        }

        output.log('ajaxComplete', event, request, settings, obj);
    }

    return pageEventsManager;
});
// ------------------------------------------
// PORTFOLIO MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'portfolioManager', plugins: [], sharedModules: ['settings', 'ajaxManager', 'localizationManager'],
    dataObjects: ['portfolio'], hasEvents: true
}, function () {
    var portfolioManager    = {},
        output              = this.getConsole(),
        eventManager        = this.getEventManager(),
        settings            = this.getSharedModule('settings'),
        portfolioDataObj    = this.getDataObject('portfolio'),
        lang                = this.getSharedModule('localizationManager').getLanguage() || {},
        ajaxManager         = this.getSharedModule('ajaxManager'),
        lastPortfolioIdUsed = '',
        lastPortfolioUsed   = {};

    portfolioDataObj.define({
        code: '',
        name: '',
        type: '',
        analysisLink: '',
        currency: '',
        version: '',
        timeStamp: '',
        timePeriods: []
    });

    function loadPortfolioAnalysis(portfolioCode, callback) {

        function onGetAnalysisCompleted() {
            callback(lastPortfolioUsed);
        }

        function onLoadPortfolioCompleted(defaultAnalysisLink) {
            getAnalysis(defaultAnalysisLink, onGetAnalysisCompleted);
        }

        loadPortfolio(portfolioCode, onLoadPortfolioCompleted);
    }

    function loadPortfolio(portfolioCode, callback) {
        var defaultPortfolioCode,
            portfolio = {
                code: '',
                type: '',
                analysisLink: '',
                currency: '',
                version: '',
                timeStamp: '',
                timePeriods: []
            };

        // Load default portfolio.
        function getPortfolioCode() {
            // TODO: Add code here to select the right portfolio code from:
            // - First portfolio
            // - Default portfolio
            // - Last saved portfolio
            // - Etc. etc.
            if (portfolioCode) {
                return portfolioCode;
            } else {
                // Return the first available portfolio.
                return '';
            }
        }

        lastPortfolioIdUsed = portfolio.code = getPortfolioCode();
        loadPortfolioData(onLoadPortfolioDataCompleted);

        function loadPortfolioData(callback) {
            var oData = {},
                defaultAnalysisLink = null;

            // Filter on the portfolio code if provided, otherwise just
            // retrieve the first portfolio in the default list.
            if (portfolio.code) {
                oData.filter = "Code eq '" + portfolio.code + "'";
            } else {
                oData.start = 0;
                oData.top = 1;
            }

            ajaxManager.post(settings.siteUrls.portfolios, { oData: oData, datatype: 'json' }, function (data) {
                
                // If no portfolio data was returned for our query...
                if (!data || !data.items || data.items.length < 1) {
                    // ...raise a failure event and return.
                    eventManager.raiseEvent('onFailed', lang.errors.portfolioNotFoundText);
                    return;
                }

                // Persist the portfolio code and the link to its default analysis.
                portfolio.code = data.items[0].code;
                defaultAnalysisLink = data.items[0].links.defaultAnalysis.href;
                
                // Call the callback.
                callback({ defaultAnalysisLink: defaultAnalysisLink });

            }, 'json');
        }

        function onLoadPortfolioDataCompleted(data) {
            if (data.defaultAnalysisLink) {
                portfolio.analysisLink = data.defaultAnalysisLink;
                loadPortfolioAnalysis(data.defaultAnalysisLink, onLoadPortfolioAnalysisCompleted);
            }
        }

        function loadPortfolioAnalysis(defaultAnalysisLink, callback) {
            ajaxManager.post(settings.siteUrls.portfolioAnalysis, { uri: defaultAnalysisLink, datatype: 'json' }, function (data) {

                // If no analysis data was returned for the given portfolio...
                if (!data || !data.analysis) {
                    // ...raise a failure event and return.
                    eventManager.raiseEvent('onFailed', lang.errors.analysisFailedText);
                    return;
                }

                // Persist the basic portfolio information.
                portfolio.name = data.name || '';
                portfolio.type = data.type || '';
                portfolio.currency = data.analysis.currency || '';
                portfolio.version = data.analysis.version || '';

                // If we have results, persist their basic details also.
                if (data.analysis.results) {
                    portfolio.timeStamp = data.analysis.results.timeStamp || '';
                    portfolio.timePeriods = data.analysis.results.timePeriods || [];
                }

                // Call the callback.
                callback();

            }, 'json');
        }

        function onLoadPortfolioAnalysisCompleted() {
            
            // Persist the currently selected portfolio.
            portfolioDataObj.setData(portfolio);
            lastPortfolioUsed = portfolio;

            // Raise notification events.
            eventManager.raiseEvent('onPortfolioLoaded', portfolio);
            eventManager.raiseEvent('onTimePeriodsLoaded', portfolio.timePeriods);

            // Call the callback, passing the analysis link.
            callback(portfolio.analysisLink);
        }
    }

    // Public
    function getAnalysis(uri, callback) {
        ajaxManager.post(settings.siteUrls.analysis, { uri: uri, datatype: 'json' }, function (data) {

            // If no analysis HTML template data was returned for the given portfolio...
            if (!data) {
                // ...raise a failure event and return.
                eventManager.raiseEvent('onFailed', lang.errors.analysisFailedText);
                return;
            }

            // Raise notification events.
            eventManager.raiseEvent('onAnalysisLoaded', data);

            // Call the callback.
            callback();
        }, 'json');
    }

    portfolioManager.loadPortfolio = loadPortfolio;
    portfolioManager.getAnalysis = getAnalysis;
    portfolioManager.loadPortfolioAnalysis = loadPortfolioAnalysis;

    return portfolioManager;
});
// ------------------------------------------
// FULL SCREEN MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'presentationManager', plugins: ['helper', 'device'], sharedModules: ['pageElements'], hasEvents: true }, function () {
    var presentationManager  = {},
        eventManager        = this.getEventManager(),
        output              = this.getConsole(),
        helper              = this.getPlugin('helper'),
        device              = this.getPlugin('device'),
        el                  = this.getSharedModule('pageElements'),
        fullScreen          = false;

    $(el.minimizeButton).on('click', function (e, info) {
        exitPresentationMode();
        e.preventDefault();
    });
    
    function enterPresentationMode(chartId) {
        fullScreen = true;
        turnView();

        $(el.fullScreenPage).show();
        $(el.fullScreenPage).animate({ opacity: 1 }, { duration: 750, easing: 'ease-out', complete: function () {
        }});

//        $('#testChart').append( $('#' + chartId) );
//        $('#' + chartId).css('-webkit-transform', 'scale(1)');
    }

    function exitPresentationMode() {
        fullScreen = false;
        $(el.fullScreenPage).animate({ opacity: 0 }, { duration: 750, easing: 'ease-out', complete: function () {
            $(el.fullScreenPage).css({ 'display': 'none' });
        }});
    }

    function isFullScreen() {
        return fullScreen;
    }

    // Private
    function turnView() {
        // ASA TODO: Use device.orientation()...
        var o         = Math.abs(window.orientation - 90),
            left      = '0',
            width     = '0',
            height    = '0',
            forceTurn = false;
        
        o = (o == 180) ? 0: o;
        
        if (o == 90) {
            width     = '1004px';
            height    = '768px';
            left      = '768px';
            forceTurn = true;
        } else {
            width     = '1024px';
            height    = '748px';
            left      = '0';
            forceTurn = false;
        }

        if (forceTurn) {
            $(el.turnIcon).animate({ opacity: 1 }, { duration: 250, easing: 'ease-out', complete: function () {
                $(el.fullScreenMask).css({ 'display': 'block' });
            }});
        } else {
            $(el.turnIcon).animate({ opacity: 0 }, { duration: 250, easing: 'ease-out', complete: function () {
                $(el.fullScreenMask).css({ 'display': 'none' });
            }});
        }

        $(el.fullScreenContainer).css({ 
            width: width,
            height: height,
            '-webkit-transform-origin': 'left top',
            '-webkit-transform': 'rotate('+ o +'deg)',
            left: left
        });
    }

    $('body').bind('turn', function(event, info){
        if (isFullScreen()) {
            turnView();
        }
    });

    presentationManager.enterPresentationMode = enterPresentationMode;
    presentationManager.exitPresentationMode = exitPresentationMode;
    presentationManager.isFullScreen = isFullScreen;

    return presentationManager;
});
// ------------------------------------------
// REPOSITORIES
// ------------------------------------------

WebAppLoader.addModule({ name: 'repositories', sharedModules: ['settings', 'localizationManager', 'ajaxManager'],
    hasEvents: true }, function () {
    var repositories    = {},
        eventManager    = this.getEventManager(),
        output          = this.getConsole(),
        settings        = this.getSharedModule('settings'),
        ajaxManager     = this.getSharedModule('ajaxManager'),
        lang            = this.getSharedModule('localizationManager').getLanguage() || {};

    // Portfolio Slot Repository
    repositories.portfoliosSlot = (function () {
        var repository = {},
            portfoliosSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getPortfoliosSlotItems() {
            return portfoliosSlotItems;
        }

        function setPortfoliosSlotItems(items) {
            portfoliosSlotItems = items;
            eventManager.raiseEvent('onItemsChanged', items);
        }

        function loadData(callback) {
            var slotItems = {};
            ajaxManager.post(settings.siteUrls.portfolios, { datatype: 'json' }, function (data) {
                if (data) {
                    $.each(data.items, function (i, val) {
                        slotItems[val.code] = val.name;
                    });
                } else {
                    slotItems.err = lang.spinningWheel.noPortfolioSlotAvailable;
                }

                setPortfoliosSlotItems(slotItems);
                callback(slotItems);
            }, 'json');
        }

        function getData(callback) {
            // TODO: Check if portfoliosListChanged is true...
            if (settings.appSettings.loadPortfoliosSlotDataOnce) {
                if (!getPortfoliosSlotItems()) {
                    loadData(function (slotItems) {
                        callback(slotItems);
                    });
                } else {
                    callback(getPortfoliosSlotItems());
                }
            } else {
                loadData(function (slotItems) {
                    callback(slotItems);
                });
            }
        }

        repository.getData = getData;
        repository.on = on;

        return repository;
    })();

    // Analysis Slot Repository.
    repositories.analysisSlot = (function () {
        var repository = {},
            analysisSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getAnalysisSlotItems() {
            return analysisSlotItems;
            return (analysisSlotItems)
                ? analysisSlotItems
                : { err: lang.spinningWheel.noAnalysisSlotAvailable };
        }

        function setAnalysisSlotItems(items) {
            analysisSlotItems = items;
            eventManager.raiseEvent('onItemsChanged', items);
        }

        function setData(analysisPages) {
            var slotItems = {};

            $.each(analysisPages, function (i, val) {
                slotItems[val.code] = val.name;
            });

            setAnalysisSlotItems(slotItems);
        }

        function getData(callback) {
            var items = getAnalysisSlotItems();
            callback(items);
        }

        repository.getData = getData;
        repository.setData = setData;
        repository.on = on;

        return repository;
    })();

    // Time Period Slot Repository.
    repositories.timePeriodsSlot = (function () {
        var repository = {},
            timePeriodsSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getTimePeriodsSlotItems() {
            return (timePeriodsSlotItems)
                ? timePeriodsSlotItems
                : { err: lang.spinningWheel.noTimePeriodSlotAvailable };
        }

        function setTimePeriodsSlotItems(items) {
            timePeriodsSlotItems = items;
            eventManager.raiseEvent('onItemsChanged', items);
        }

        function setData(timePeriods) {
            var slotItems = null;

            if (timePeriods && timePeriods.length > 0) {
                slotItems = {};
                
                $.each(timePeriods, function (i, val) {
                    slotItems[val.code] = val.name;
                });
            }

            setTimePeriodsSlotItems(slotItems);
        }

        function getData(callback) {
            var items = getTimePeriodsSlotItems(); //appRepository.timePeriodsSlotItems; //getTimePeriodsSlotItems()
            callback(items);
        }

        repository.getData = getData;
        repository.setData = setData;
        repository.on = on;

        return repository;
    })();

    // Favourites Slot Repository.
    repositories.favouritesSlot = (function () {
        var repository = {},
            favouritesSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getFavouritesSlotItems() {
            return (favouritesSlotItems)
                ? favouritesSlotItems
                : { err: lang.spinningWheel.noFavouritesSlotAvailable };
        }

        function setFavouritesSlotItems(items) {
            favouritesSlotItems = items;
            eventManager.raiseEvent('onItemsChanged', items);
        }

        function setData(favourites) {
            var slotItems = null;

            if (favourites && favourites.length > 0) {
                slotItems = {};
                
                $.each(favourites, function (i, val) {
                    slotItems[val.code] = val.name;
                });
            }

            setFavouritesSlotItems(slotItems);
        }

        function getData(callback) {
            var items = getFavouritesSlotItems();
            callback(items);
        }

        repository.getData = getData;
        repository.setData = setData;
        repository.on = on;

        return repository;
    })();

    return repositories;
});
// ------------------------------------------
// THEMES MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'themesManager', plugins: ['helper'], sharedModules: ['pageElements'], 
    dataObjects: ['theme'], hasEvents: true }, function () {
    var themesManager   = {},
        eventManager    = this.getEventManager(),
        output          = this.getConsole(),
        helper          = this.getPlugin('helper'),
        el              = this.getSharedModule('pageElements'),
        themeDataObj    = this.getDataObject('theme'),
        defaultStyle    = 'Awesome';

    themeDataObj.define({
        name: defaultStyle
    });

    $(el.themesPage + ' ul li a').on('click', onThemeChange);

    // Private
    function onThemeChange(event) {
        var theme = $(this).attr("data-title") || null;
        eventManager.raiseEvent('onThemeChanged', theme);
    }

    // Public
    function switchStyle(theme) {
        var style = null;
        if (typeof theme === 'object' && theme.name) {
            style = theme.name;
        } else {
            style = theme;
        }
        jQT.switchStyle(style || defaultStyle);
    }

    themesManager.switchStyle = switchStyle;

    return themesManager;
});
// ------------------------------------------
// ANALYSIS SETTINGS PAGE
// ------------------------------------------

WebAppLoader.addModule({ name: 'analysisSettingsPage', plugins: ['helper'], 
    sharedModules: ['settings', 'pageElements', 'localizationManager'], hasEvents: true }, function () {
    var analysisSettingsPage = {},
        output               = this.getConsole(),
        eventManager         = this.getEventManager(),
        helper               = this.getPlugin('helper'),
        settings             = this.getSharedModule('settings'),
        lang                 = this.getSharedModule('localizationManager').getLanguage() || {},
        el                   = this.getSharedModule('pageElements');

    function onAnalysisPageClick() {
        var pageId = $(this).data("link");

        if (pageId) {
            eventManager.raiseEvent('onClick', pageId);
        }

        return false;
    }

    function onNewAnalysisPageClick() {
        var pageId = helper.createUUID();
        
        eventManager.raiseEvent('onClick', pageId);

        return false;
    }

    function create(analysisPages) {
        var analysisPage, isUserDefined, pageName, pageId, appendTo;

        // Clear the page.
        $(el.listAnalysisSettingsUserPages).html('');
        $(el.listAnalysisSettingsDefaultPages).html('');

        for (var i = 0; i < analysisPages.length; i++) {
            analysisPage    = analysisPages[i];
            pageName        = analysisPage.name;
            pageId          = analysisPage.id;
            isUserDefined   = analysisPage.userDefined;
            appendTo        = (isUserDefined)
                ? el.listAnalysisSettingsUserPages
                : el.listAnalysisSettingsDefaultPages; 
            
            if (isUserDefined) {
                $(appendTo).append(
                    $('<li>').attr('class', 'arrow').append(
                        $('<a>').attr({ 'href': '#', 'data-link': pageId, 'data-swipe': true })
                        .html(pageName)
                        .on('click', onAnalysisPageClick)
                    )
                );
            } else {
                $(appendTo).append( 
                    $('<li>').attr('class', '').append(
                        $('<a>').attr({ 'href': '#', 'data-link' : pageId })
                        .html(pageName)
                    )
                );  
            }
        }
        
        $(appendTo).append(
            $('<li>').attr('class', 'arrow').append(
                $('<a>').attr({ 'href': '#', 'data-link' : pageId })
                .html(lang.chartTexts.addNewPage)
                .on('click', onNewAnalysisPageClick)
            )
        );
    
        eventManager.raiseEvent('onPageLoaded');
    }

    analysisSettingsPage.create = create;

    return analysisSettingsPage;
});
// ------------------------------------------
// CHART SETTINGS PAGE
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartSettingsPage',
    plugins: ['helper'], sharedModules: ['settings', 'pageElements', 'localizationManager'],
    hasEvents: true
}, function () {
    var chartSettingsPage = {},
        output            = this.getConsole(),
        eventManager      = this.getEventManager(),
        helper            = this.getPlugin('helper'),
        lang              = this.getSharedModule('localizationManager').getLanguage() || {},
        settings          = this.getSharedModule('settings'),
        el                = this.getSharedModule('pageElements'),
        analysisId        = '';

    function create(charts) {
        var chartType;

        for (var i = 0; i < charts.length; i++) {
            chartType = '(' + lang.chartTypes[charts[i].chartType] + ') ';

            $(el.chartsSelectbox).append(
                $('<option>').attr('value', charts[i].chartId)
                    .html(chartType + charts[i].chartTitle)
                );
        }
    }

    function update(analysisPage) {
        // NOTA BENE: The current version of Zepto doesn't support
        // multiple selection based on array.

        // Reset the select box.
        $(el.chartsSelectbox).children('option:selected').removeAttr('selected');
        $(el.chartsSelectbox).attr('selectedIndex', '-1');

        for (var i = 0; i < analysisPage.charts.length; i++) {
            $(el.chartsSelectbox + ' [value="' + analysisPage.charts[i].chartId + '"]').attr('selected', 'selected');
        }

        $(el.analysisPageNameTextbox).val(analysisPage.name);
        analysisId = analysisPage.id;
    }

    function getSettings() {
        var settings = {
            name: '',
            id: '',
            order: new Date().getTime(),
            userDefined: true,
            charts: []
        },
            chartOrder = 1;

        settings.name = $(el.analysisPageNameTextbox).val();
        settings.id = analysisId;

        $(el.chartsSelectbox).children('option:selected').each(function (chart) {
            settings.charts.push({
                chartId: $(this).val(),
                order: chartOrder
            });

            chartOrder += 1;
        });

        return settings;
    }

    $(el.saveChartSettings).on('click', function () {
        eventManager.raiseEvent('onSettingsChanged', getSettings());
    });

    chartSettingsPage.create = create;
    chartSettingsPage.update = update;
    chartSettingsPage.getSettings = getSettings;

    return chartSettingsPage;
});
// ------------------------------------------
// LANGUAGE SETTINGS PAGE
// ------------------------------------------

WebAppLoader.addModule({ name: 'languageSettingsPage', plugins: ['helper'], sharedModules: ['settings', 'pageElements'], hasEvents: true }, function () {
    var languageSettingsPage    = {},
        output                  = this.getConsole(),
        eventManager            = this.getEventManager(),
        helper                  = this.getPlugin('helper'),
        languages               = this.getSharedModule('settings').languages,
        el                      = this.getSharedModule('pageElements'),
        isCreated               = false;

    function onLanguageClick() {
        var language = JSON.parse($(this).data("link"));

        if (language) {
            eventManager.raiseEvent('onLanguageSelected', language);
        }

        return false;
    }

    function create() {
        for (var i = 0; i < languages.length; i++) {
            $(el.listLanguagesPages).append(
                $('<li>').append(
                    $('<a>').attr({ 'href': '#', 'data-link': JSON.stringify(languages[i]) })
                    .html(languages[i].name)
                    .on('click', onLanguageClick)
                )
            );
        }
    }

    languageSettingsPage.create = create;

    return languageSettingsPage;
});
// ------------------------------------------
// MAIN MOBILE WEB APP
// ------------------------------------------

// Initialize jQTouch.
var jQT = new $.jQTouch({
    addGlossToIcon          : true,
    themeSelectionSelector  : '#jqt #themes ul',
    useFastTouch            : true,
    statusBar               : 'default',
    hoverDelay              : 10,
    pressDelay              : 2,
    preloadImages           : [
        'images/sw-slot-border.png',
        'images/sw-alpha.png',
        'images/sw-button-cancel.png',
        'images/sw-button-done.png',
        'images/sw-header.png'
    ]
});

// Main functions:
Zepto(function ($) {

    var theApp       = {},
        loader       = WebAppLoader, // Alias
        output       = loader.getConsole(),
        eventManager = loader.getEventManager(),
        helper       = loader.loadModule('helper'),
        device       = loader.loadModule('device'),
        siteUrls     = loader.getSharedModule('settings').siteUrls,
        el           = loader.getSharedModule('pageElements'),
        lang         = loader.getSharedModule('localizationManager').getLanguage() || {};

    // Test log method.
    output.log('Hello from Dan & Asa!');

    theApp.lastUsernameUsed = '';
    theApp.lastPasswordUsed = '';
    theApp.lastFavouriteSelected = '';

    // Default settings.
    theApp.lastAnalysisObjectUsed = {
        portfolioId: '',
        portfolioName: '',
        analysisId: 'performance',
        analysisName: 'Performance',
        timePeriodId: 'Earliest',
        timePeriodName: 'Earliest',
        chartId: 'performance_bar',
        timeStamp: ''
    };

    theApp.defaultLanguage = "en-US";
    
    /* ----------------------- ON/OFF ----------------------- /
       'Switch comments off changing /* in //* and viceversa'
    // ------------------------------------------------------ */

    // ------------------------------------------
    // COMPONENTS CREATION
    // ------------------------------------------

    // Repositories
    theApp.repositories = loader.loadModule('repositories');

    // IScroll
    theApp.scroll = loader.loadModule('scroll');

    // Navigation
    theApp.nav = loader.loadModule('nav');

    // Loading Mask Manager
    theApp.mask = loader.loadModule('loadingMaskManager');

    // Loading Settings
    theApp.settings = loader.loadModule('settings');
    theApp.automaticLanguageDetection = theApp.settings.appSettings.automaticLanguageDetection;

    // Swipe View
    theApp.swipeView = loader.loadModule('swipeView');

    // Analysis Settings Page
    theApp.analysisSettingsPage = loader.loadModule('analysisSettingsPage');

    // Chart Settings Page
    theApp.chartSettingsPage = loader.loadModule('chartSettingsPage');

    // Chart Components
    theApp.chartComponents = loader.loadModule('chartComponents');

    // Ajax Manager
    theApp.ajaxManager = loader.loadModule('ajaxManager');

    // Swipe Button Control
    theApp.swipeButton = loader.loadModule('swipeButton');
    
    // Local Storage Manager
    theApp.localStorage = loader.loadModule('localStorageManager');

    // Full Screen Manager
    theApp.presentationManager = loader.loadModule('presentationManager');
    
    // ------------------------------------------
    // LAST ANALYSIS DATA OBJECT
    // ------------------------------------------

    theApp.getLastAnalysisObjectUsed = function () {
        return theApp.lastAnalysisObjectUsed;
    };

    theApp.setLastAnalysisObjectUsed = function (obj) {
        for (var property in obj) {
            if (theApp.lastAnalysisObjectUsed.hasOwnProperty(property)) {
                theApp.lastAnalysisObjectUsed[property] = obj[property];
            }
        }
    };

    theApp.getLanguage = function () {
        return helper.getURLParameter('lang') || theApp.defaultLanguage;
    };

    theApp.tryToChangeLanguage = function (language) {
        var currentLanguage = theApp.getLanguage();

        if (language && currentLanguage && (language.toLowerCase() !== currentLanguage.toLowerCase())) {
            theApp.nav.reloadApp('?lang=' + language);
            return true;
        }

        return false;
    };

    // ------------------------------------------
    // THE MAIN ENTRY POINT (Before Login)
    // ------------------------------------------

    theApp.startHere = function () {
        var appSettingsData = theApp.settings.loadData('appSettings'),
            userSettingsData = {},
            lastLoggedOnUser = '',
            language = device.language() || '',
            username = '',
            password = '';

        // Try to get the last logged on user.
        lastLoggedOnUser = (appSettingsData && appSettingsData.lastLoggedOnUser)
            ? appSettingsData.lastLoggedOnUser.toLowerCase()
            : null;

        if (lastLoggedOnUser) {
            theApp.settings.loadData('userSettings', lastLoggedOnUser);
            userSettingsData = theApp.settings.getData('userSettings');

            // Try to get username and password.
            username = userSettingsData.username || '';
            password = userSettingsData.password || '';
            language = userSettingsData.language || '';

            if (theApp.automaticLanguageDetection) {
                if (username !== '' && theApp.tryToChangeLanguage(language)) {
                    return;
                }
            } else {
                if (username !== '') {
                    theApp.tryToChangeLanguage(language);
                }
            }
            
            // With the language defined, set the CultureInfo property of the 
            // JavaScript Date object, so date.js can hook in for localization.
            Date.CultureInfo = lang.cultureInfo;

            if (userSettingsData.automaticLogin) {
                // If username and password fields are available...
                if (username && password) {
                    // .. try to login or...
                    theApp.doLogin(username, password);
                } else {
                    // ... go to the login page using the last logged on user.
                    theApp.goToLoginPage(username || lastLoggedOnUser);
                }
            } else {
                theApp.goToLoginPage(username || lastLoggedOnUser);
            }
        } else {
            if (theApp.automaticLanguageDetection) {
                if (!theApp.tryToChangeLanguage(language)) {
                    theApp.goToLoginPage();
                }
            } else {
                theApp.goToLoginPage();
            }

        }
    };

    theApp.doLogin = function (username, password) {
        theApp.lastUsernameUsed = username.toLowerCase();
        theApp.lastPasswordUsed = password;
        theApp.auth.doLogin(username, password, siteUrls.authenticate);
    };

    theApp.goToLoginPage = function (username) {
        theApp.tabbar.hide();

        // Set the field's value.
        $(el.userNameTextbox).val(username || '');

        // Show the login page.
        setTimeout(function () {
            theApp.nav.goToPage($(el.loginPage), 'dissolve');
        }, 1000);
    };

    // ------------------------------------------
    // INIT APP (After Login)
    // ------------------------------------------

    theApp.init = function () {
        var lastLoggedOnUser = '',
            automaticLogin = false,
            analysisDataObject = {};

        theApp.nav.goToPage($(el.startupPage), 'dissolve');
        theApp.tabbar.show();

        var appSettingsData = theApp.settings.loadData('appSettings'),
            userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        lastLoggedOnUser = (appSettingsData && appSettingsData.lastLoggedOnUser)
            ? appSettingsData.lastLoggedOnUser.toLowerCase()
            : null;

        appSettingsData.lastLoggedOnUser = theApp.lastUsernameUsed;
        theApp.settings.saveData('appSettings');

        userSettingsData.username = theApp.lastUsernameUsed;
        userSettingsData.password = theApp.lastPasswordUsed;

        if (userSettingsData.lastUsedLanguage === 'none') {
            userSettingsData.language = theApp.getLanguage();
            userSettingsData.lastUsedLanguage = userSettingsData.language;
        }

        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);

        automaticLogin = helper.getValueAs(userSettingsData.automaticLogin, 'boolean');

        // Init the themeManager using the last theme used (or the default one).        
        var lastThemeUsed = theApp.themesManager.loadData('theme', theApp.lastUsernameUsed);
        theApp.themesManager.switchStyle(lastThemeUsed);

        // Try to retrieve the last analysisDataObject used.
        var lastAnalysisObjectUsed = userSettingsData.lastAnalysisObjectUsed || null;

        // Update all.
        theApp.updateSettingsPage({ email: theApp.lastUsernameUsed, automaticLogin: automaticLogin });
        theApp.analysisManager.update(theApp.lastUsernameUsed);
        theApp.favouritesManager.update(theApp.lastUsernameUsed);
        theApp.updateAnalysisPage(lastAnalysisObjectUsed);
    };

    theApp.updateAnalysisPage = function (analysisDataObjectValue) {
        var analysisDataObject = analysisDataObjectValue || theApp.getLastAnalysisObjectUsed();

        // Deselect Settings button.
        theApp.tabbar.getButton('settings').setHighlight(false);

        theApp.nav.goToPage($(el.analysisPage), 'dissolve');
        theApp.mask.show('analysis');

        function renderAnalysisPage(portfolio) {
            var chartsToRender = [],
                analysisPagesData = {},
                analysisPage = {},
                portfolioId = portfolio.code,
                portfolioName = portfolio.name,
                analysisPageCharts = null,
                analysisPageTitle = '',
                i;

            analysisPagesData = theApp.analysisManager.getData('analysisPages');

            analysisPage = jLinq.from(analysisPagesData.items)
                .equals('id', analysisDataObject.analysisId)
                .select();

            // If no analysis page has been found load the first one.            
            if (analysisPage[0] && analysisPage[0].charts) {
                analysisPageCharts = analysisPage[0].charts;
                analysisPageTitle = analysisPage[0].name;
            } else {
                analysisPageCharts = analysisPagesData.items[0].charts;
                analysisPageTitle = analysisPagesData.items[0].name;
            }

            chartsToRender = jLinq.from(analysisPageCharts)
                .sort('order')
                .select();

            // Update the page title.
            $(el.analysisTitle).html(analysisPageTitle);

            // Loop around the provided time periods for the portfolio,
            // and get hold of the start and end date for that particular
            // period, breaking the loop when found.
            $.each(portfolio.timePeriods, function (index, period) {
                var startDate, endDate;

                if (period.code === analysisDataObject.timePeriodId) {

                    // Add the currently requested time period to each of the chart config objects.
                    theApp.chartComponents.setTimePeriod(chartsToRender, period);

                    startDate = Date.parse(period.startDate);
                    endDate = Date.parse(period.endDate);

                    $(el.timePeriodStartDateText).html(startDate.toString('MMM d, yyyy'));
                    $(el.timePeriodEndDateText).html(endDate.toString('MMM d, yyyy'));
                    return false;
                }
            });

            theApp.setLastAnalysisObjectUsed(analysisDataObject);
            theApp.setLastAnalysisObjectUsed({
                portfolioId: portfolioId,
                portfolioName: portfolioName
            });

            // Deselect Settings button when charts have been rendered.
            theApp.tabbar.getButton('settings').setHighlight(false);

            theApp.saveLastAnalysisObjectUsed();
            theApp.synchronizeFavouriteButton();

            theApp.chartComponents.render(chartsToRender, '#analysis_partial');
            theApp.changeOrientation();
            $(el.analysisComponentFullScreenButton).on('click', function (e, info) {
                var chartId = $(this).attr('data-chartId');
                theApp.presentationManager.enterPresentationMode(chartId);
            });
        }

        function onLoadPortfolioAnalysisCompleted(portfolio) {
            renderAnalysisPage(portfolio);
        }

        theApp.portfolioManager.loadPortfolioAnalysis(
            analysisDataObject.portfolioId,
            onLoadPortfolioAnalysisCompleted
        );
    };

    theApp.saveLastAnalysisObjectUsed = function () {
        var userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        userSettingsData.lastAnalysisObjectUsed = theApp.getLastAnalysisObjectUsed();
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);
    };

    theApp.chartComponents.on('onAllChartsLoaded', function () {
        theApp.scroll.rebuild('analysis');
        theApp.mask.updateAnalysisText(' ');
        theApp.mask.hide('analysis');
    });

    theApp.chartComponents.on('onChartsLoading', function (chartCount, chartTotal) {
        theApp.mask.updateAnalysisText('Loading ' + chartCount + ' of ' + chartTotal);
    });


    // ------------------------------------------
    // SETTINGS PAGES
    // ------------------------------------------

    theApp.showAnalysisSettingsPage = function () {
        var analysisPagesData = {}, analysisPages;

        analysisPagesData = theApp.analysisManager.getData('analysisPages');

        analysisPages = jLinq.from(analysisPagesData.items)
            .sort('order', 'userDefined')
            .select(function (record) {
                return {
                    name: record.name,
                    id: record.id,
                    userDefined: record.userDefined
                };
            });

        theApp.analysisSettingsPage.create(analysisPages);
    };

    theApp.analysisSettingsPage.on('onClick', function (analysisId) {
        theApp.nav.goToPage(el.chartSettingsPage, 'slideup');
        theApp.showChartSettingsPage(analysisId);
    });

    theApp.analysisSettingsPage.on('onPageLoaded', function () {
        // swipeButton params: containerId, label, callback, autoRemove, buttonClass
        theApp.swipeButton.addTo('#listAnalysisSettingsUserPages', 'Delete', theApp.onUserPageDeleted, true);
    });

    theApp.onUserPageDeleted = function ($button) {
        var userPageId = $button.parent().parent().data('link') || null,
            analysisPagesData;

        analysisPagesData = theApp.analysisManager.getData('analysisPages');
        if (helper.removeObjectFromArray(analysisPagesData.items, 'id', userPageId)) {
            theApp.analysisManager.saveData('analysisPages', theApp.lastUsernameUsed);
            theApp.updateAnalysisSlot(analysisPagesData);
        }
    };

    theApp.showChartSettingsPage = function (analysisId) {
        var analysisPagesData = {},
            chartComponentsData = {},
            analysisPage = {},
            charts = theApp.showChartSettingsPage.charts;

        if (!analysisId) {
            return; // TODO: Add a message error.
        }

        analysisPagesData = theApp.analysisManager.getData('analysisPages');
        chartComponentsData = theApp.chartComponents.getData('charts');

        analysisPage = jLinq.from(analysisPagesData.items)
            .equals('id', analysisId)
            .select(function (record) {
                return {
                    name: record.name,
                    id: record.id,
                    charts: record.charts
                };
            })[0] || null;

        if (!analysisPage) {
            analysisPage = {
                name: '',
                id: analysisId,
                charts: []
            };
        }

        // TODO: Add comments...
        if (charts.length === 0) {
            for (var chart in chartComponentsData) {
                charts.push({
                    chartId: chartComponentsData[chart].chartId,
                    chartType: chartComponentsData[chart].chartType,
                    chartTitle: chartComponentsData[chart].title // chartTitle
                });
            }

            theApp.chartSettingsPage.create(charts);
        }

        theApp.chartSettingsPage.update(analysisPage);
    };

    theApp.chartSettingsPage.on('onSettingsChanged', function (updatedAnalysisPage) {
        var analysisPage, analysisPagesData;

        updatedAnalysisPage.name = updatedAnalysisPage.name || 'Untitled'; // TODO: Localize string 'Untitled'

        analysisPagesData = theApp.analysisManager.getData('analysisPages');
        analysisPage = jLinq.from(analysisPagesData.items)
            .equals('id', updatedAnalysisPage.id)
            .select()[0] || null;

        if (analysisPage) {
            $.extend(analysisPage, updatedAnalysisPage);
        } else {
            analysisPagesData.items.push(updatedAnalysisPage);
        }

        theApp.analysisManager.saveData('analysisPages', theApp.lastUsernameUsed);
        theApp.updateAnalysisSlot(analysisPagesData);

        // Show the new analysis page.
        theApp.setLastAnalysisObjectUsed({
            analysisId: updatedAnalysisPage.id,
            analysisName: updatedAnalysisPage.name
        });
        theApp.updateAnalysisPage();

    });

    // Memoization pattern.
    theApp.showChartSettingsPage.charts = [];

    theApp.updateSettingsPage = function (settings) {
        var email = settings.email || null,
            automaticLogin = settings.automaticLogin || false;

        // If an email has been specified update the field.
        if (email) {
            $(el.userEmailLabel).html(theApp.lastUsernameUsed);
        }

        // Update the automatic login checkbox.
        if (automaticLogin) {
            $(el.stayLoggedCheckbox).attr('checked', true);
        } else {
            $(el.stayLoggedCheckbox).removeAttr('checked');
        }
    };

    // ------------------------------------------
    // LANGUAGE SETTINGS PAGE
    // ------------------------------------------

    theApp.languageSettingsPage = loader.loadModule('languageSettingsPage');
    theApp.languageSettingsPage.create();

    theApp.languageSettingsPage.on('onLanguageSelected', function (language) {
        var userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        userSettingsData.language = language.value;
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);
        output.log('onLanguageSelected', language);
        theApp.nav.reloadApp('?lang=' + language.value);
    });

    // ------------------------------------------
    // PORTFOLIO MANAGER
    // ------------------------------------------

    theApp.portfolioManager = loader.loadModule('portfolioManager');

    theApp.portfolioManager.on('onPortfolioLoaded', function (portfolio) {
        // When a new portfolio is loaded update timeperiods and analysis slots.
        theApp.repositories.timePeriodsSlot.setData(portfolio.timePeriods);
        output.log('Loaded portfolio:', portfolio);
    });

    theApp.portfolioManager.on('onAnalysisLoaded', function (data) {
        theApp.scroll.rebuild('analysis');
        theApp.updateAnalysisInfo(data);
        theApp.mask.hide('analysis');
        theApp.tabbar.show();
    });

    theApp.portfolioManager.on('onFailed', function (message) {
        theApp.scroll.rebuild('error');
        $(el.errorMessageText).html(message);
        theApp.nav.goToPage($(el.errorPage));
        theApp.mask.hide('analysis');
    });

    theApp.updateAnalysisInfo = function (data) {
        var i, benchmarks, benchmarkPlaceholder;

        if (data) {
            // Define the CSS word-break rules depending on 
            // the whitespace available in the portfolio name.
            if (data.name.indexOf(' ') === -1) {
                $(el.summaryTitleName).attr('style', 'word-break: break-all;');
            } else {
                $(el.summaryTitleName).attr('style', 'word-break: normal;');
            }

            // Update the portfolio name.
            $(el.summaryTitleName).html(data.name);

            // Clear out any existing benchmarks.
            benchmarkPlaceholder = $(el.summaryTitleBenchmarkName);
            benchmarkPlaceholder.html('');

            // Loop around any benchmarks we have, 
            // adding their names to the placeholder.
            benchmarks = data.analysis.benchmarks || [];

            for (i = 0; i < benchmarks.length; i++) {
                if (i > 0) {
                    benchmarkPlaceholder.append(', ');
                }
                benchmarkPlaceholder.append(benchmarks[i].name);
            }

            // Clear the analysis partial of existing elements.
            $(el.analysisPage + '_partial').html('');
        }
    };

    // ------------------------------------------
    // TOOLBAR
    // ------------------------------------------

    var toolbarConfig = {
        toolbarId: '#analysis .toolbar',  // el.tabbar,
        buttonPrefix: 'toolbar_btn',
        visible: true,
        items: [
            { id: 'favourite', title: lang.tabbar.favourites, btnClass: 'favourite' }
        ]
    };

    theApp.toolbar = loader.loadModule('toolbar');
    theApp.toolbar.create(toolbarConfig);

    theApp.toolbar.on('onTap', function () {
        theApp.scroll.goUp();
    });

    theApp.toolbar.on('onFavouriteTap', function (isSelected) {
        if (isSelected) {
            theApp.addToFavourites();
        } else {
            theApp.removeFromFavourites();
        }
    });

    // ------------------------------------------
    // TABBAR
    // ------------------------------------------

    var tabbarConfig = {
        tabbarId: el.tabbar,
        buttonPrefix: 'tabbar_btn',
        visible: false,
        items: [
            { id: 'favourites', title: lang.tabbar.favourites, btnClass: 'favourites' },
            { id: 'portfolios', title: lang.tabbar.portfolios, btnClass: 'portfolios' },
            { id: 'analysis', title: lang.tabbar.analysis, btnClass: 'analysis' },
            { id: 'timePeriods', title: lang.tabbar.timePeriods, btnClass: 'timeperiods' },
            { id: 'settings', title: lang.tabbar.settings, btnClass: 'settings', highlight: true }
        ]
    };

    theApp.tabbar = loader.loadModule('tabbar');
    theApp.tabbar.create(tabbarConfig);

    theApp.tabbar.on('onFavouritesTap', function () {
        theApp.spinningWheel.getSlot('favourites').show(theApp.lastFavouriteSelected);
    });

    theApp.tabbar.on('onPortfoliosTap', function () {
        theApp.spinningWheel.getSlot('portfolios').show(theApp.getLastAnalysisObjectUsed().portfolioId); //'ADVISOR');
    });

    theApp.tabbar.on('onAnalysisTap', function () {
        theApp.spinningWheel.getSlot('analysis').show(theApp.getLastAnalysisObjectUsed().analysisId);
    });

    theApp.tabbar.on('onTimePeriodsTap', function () {
        theApp.spinningWheel.getSlot('timePeriods').show(theApp.getLastAnalysisObjectUsed().timePeriodId);
    });

    theApp.tabbar.on('onSettingsTap', function (button) {
        if (button.isHighlighted) {
            theApp.nav.goToPage($(el.settingsPage));
        } else {
            theApp.nav.goToPage($(el.analysisPage));
        }
    });

    // ------------------------------------------
    // SPINNING WHEEL
    // ------------------------------------------

    var slotConfig = {
        items: [
            { id: 'favourites', repository: theApp.repositories.favouritesSlot },
            { id: 'portfolios', repository: theApp.repositories.portfoliosSlot },
            { id: 'analysis', repository: theApp.repositories.analysisSlot },
            { id: 'timePeriods', repository: theApp.repositories.timePeriodsSlot }
        ]
    };

    theApp.spinningWheel = loader.loadModule('spinningWheel');
    theApp.spinningWheel.create(slotConfig);

    theApp.spinningWheel.on('onPortfoliosDone', function (key, value) {
        theApp.setLastAnalysisObjectUsed({ portfolioId: key, portfolioName: value });
        theApp.updateAnalysisPage();
    });

    theApp.spinningWheel.on('onAnalysisDone', function (key, value) {
        theApp.setLastAnalysisObjectUsed({ analysisId: key, analysisName: value });
        theApp.updateAnalysisPage();
    });

    theApp.spinningWheel.on('onTimePeriodsDone', function (key, value) {
        theApp.setLastAnalysisObjectUsed({ timePeriodId: key, timePeriodName: value });
        theApp.updateAnalysisPage();
    });

    theApp.spinningWheel.on('onFavouritesDone', function (key, value) {
        var analysisDataObject = theApp.favouritesManager.getAnalysisDataObjectFromFavourte(key);

        if (analysisDataObject) {
            theApp.setLastAnalysisObjectUsed(analysisDataObject);
            theApp.updateAnalysisPage();
        }
    });

    // ------------------------------------------
    // AUTHENTICATION
    // ------------------------------------------

    theApp.auth = loader.loadModule('auth');

    // Login
    $(el.loginButton).on('click', function () {
        var username, password;

        // Obtain the username and password from the form.
        username = $(el.userNameTextbox).val();
        password = $(el.passwordTextbox).val();

        theApp.doLogin(username, password);
    });

    theApp.auth.on('onLoginSuccess', function (token) {
        // If the user login successfully store the token.
        theApp.ajaxManager.setToken(token);
        theApp.init();
    });

    theApp.auth.on('onLoginFailed', function (message) {
        $(el.loginErrorText).html(message);
        output.log('onLoginFailed response: ', message);
    });

    // ------------------------------------------
    // PAGE EVENTS
    // ------------------------------------------

    theApp.pageEventsManager = loader.loadModule('pageEventsManager');

    theApp.pageEventsManager.on('onStartupStart', function () {
        output.log('onStartupEnd');
    });

    theApp.pageEventsManager.on('onLoginStart', function () {
        theApp.tabbar.hide();
        output.log('onLoginStart');
    });

    theApp.pageEventsManager.on('onHomeStart', function () {
        output.log('onHomeStart');
    });

    theApp.pageEventsManager.on('onHomeEnd', function () {
        theApp.tabbar.show();
        theApp.scroll.rebuild('home');
        output.log('onHomeEnd');
    });

    theApp.pageEventsManager.on('onEulaEnd', function () {
        $.get(siteUrls.eula, function (data) {
            theApp.scroll.rebuild('eula');
            $(el.eulaPage + '_partial').append('<div class="genericContainer">' + helper.htmlDecode(data) + '</div>');
        });
        output.log('onEulaEnd');
    });

    theApp.pageEventsManager.on('onAnalysisEnd', function () {
        theApp.scroll.rebuild('analysis');

        // Deselect Settings button.
        theApp.tabbar.getButton('settings').setHighlight(false);

        output.log('onAnalysisEnd');
    });

    theApp.pageEventsManager.on('onSettingsStart', function () {
        theApp.scroll.rebuild('settings');
        output.log('onSettingsStart');
    });

    theApp.pageEventsManager.on('onSettingsEnd', function () {
        // theApp.scroll.rebuild('settings');
        output.log('onSettingsEnd');
    });

    theApp.pageEventsManager.on('onAnalysisSettingsEnd', function () {
        theApp.scroll.rebuild('analysisSettings');
        output.log('onAnalysisSettingsEnd');
    });

    theApp.pageEventsManager.on('onAnalysisPagesSettingsStart', function () {
        theApp.scroll.rebuild('analysisPagesSettings');
        theApp.showAnalysisSettingsPage();
        output.log('onAnalysisPagesSettingsStart');
    });

    theApp.pageEventsManager.on('onChartSettingsEnd', function () {
        // theApp.scroll.rebuild('chartSettings');
        // TODO: focus() doesn't work on iOS...
        setTimeout(function () {
            $(el.analysisPageNameTextbox).focus();
        }, 200);

        output.log('onChartSettingsStart');
    });

    theApp.pageEventsManager.on('onAboutEnd', function () {
        theApp.scroll.rebuild('about');
        output.log('onAboutEnd');
    });

    theApp.pageEventsManager.on('onTestEnd', function () {
        theApp.scroll.rebuild('test');
        output.log('onTestEnd');
    });

    theApp.pageEventsManager.on('onResetEnd', function () {
        theApp.scroll.rebuild('reset');
        output.log('onResetEnd');
    });

    // ------------------------------------------
    // SETTINGS PAGE EVENTS
    // ------------------------------------------

    $(el.reloadAppButton).on('click', function () {
        theApp.nav.reloadApp();
    });

    $(el.resetAllSettingsButton).on('click', function () {
        theApp.localStorage.clearAll();
        theApp.nav.reloadApp();
    });

    $(el.resetCurrentSettingsButton).on('click', function () {
        theApp.localStorage.clearUserSettings(theApp.lastUsernameUsed);
        theApp.nav.goToPage($(el.settingsPage));
    });

    $(el.stayLoggedCheckbox).on('click', function () {
        var stayLogged = $(el.stayLoggedCheckbox + ':checked').val()
            ? true
            : false,
        userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        userSettingsData.automaticLogin = stayLogged;
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);

        output.log(stayLogged);
    });

    // ------------------------------------------
    // ANALYSIS MANAGER
    // ------------------------------------------

    theApp.analysisManager = loader.loadModule('analysisManager');

    // NOTA BENE: the analysis manager is updated the first time when the home
    // page is loaded.
    theApp.analysisManager.on('onUpdated', function (analysisPages) {
        theApp.updateAnalysisSlot(analysisPages);
    });

    theApp.updateAnalysisSlot = function (analysisPages) {
        var analysisSlotItems = jLinq.from(analysisPages.items)
            .sort('order')
            .select(function (record) {
                return {
                    name: record.name,
                    code: record.id
                };
            });

        theApp.repositories.analysisSlot.setData(analysisSlotItems);
    };

    // ------------------------------------------
    // FAVOURITES MANAGER
    // ------------------------------------------

    theApp.favouritesManager = loader.loadModule('favouritesManager');

    theApp.favouritesManager.on('onFavouritesUpdated', function (favourites) {
        theApp.updateFavouritesSlot(favourites);
    });

    theApp.updateFavouritesSlot = function (favourites) {
        var favouritesSlotItems = jLinq.from(favourites.items)
            .sort('order')
            .select(function (record) {
                return {
                    name: record.title,
                    code: record.favouriteId
                };
            });

        theApp.repositories.favouritesSlot.setData(favouritesSlotItems);
    };

    theApp.analysisDataObjectToFavourite = function (analysisDataObject) {
        var favourite = null;

        favourite = theApp.favouritesManager.getFavourteFromAnalysisDataObject(analysisDataObject);
        return favourite || null;
    };

    // - favouriteId [optional]
    theApp.favouriteExists = function (favouriteId) {
        var favouriteToCheck = theApp.getFavouriteById(favouriteId);

        return (favouriteToCheck && true);
    };

    theApp.getFavouriteById = function (favouriteId) {
        var favourite = null,
            favouriteToCheck = null,
            favouritesData = theApp.favouritesManager.getData('favourites');

        if (!favouriteId) {
            favourite = theApp.analysisDataObjectToFavourite(theApp.lastAnalysisObjectUsed);
            favouriteId = favourite.favouriteId;
        }

        favouriteToCheck = jLinq.from(favouritesData.items)
            .equals('favouriteId', favouriteId)
            .select()[0] || null;

        return (favouriteToCheck);
    };

    theApp.addToFavourites = function () {
        var favouriteToAdd = {},
            favouritesData = null;

        favouriteToAdd = theApp.analysisDataObjectToFavourite(theApp.lastAnalysisObjectUsed);
        if (favouriteToAdd) {
            if (!theApp.favouriteExists(favouriteToAdd.favouriteId)) {
                favouritesData = theApp.favouritesManager.getData('favourites');
                favouritesData.items.push(favouriteToAdd);
                theApp.favouritesManager.saveData('favourites', theApp.lastUsernameUsed);
                theApp.favouritesManager.update(theApp.lastUsernameUsed);
                theApp.setLastFavouriteSelected(favouriteToAdd.favouriteId);
            }
        }
    };

    theApp.removeFromFavourites = function () {
        var favouriteToRemove = {},
            favouritesData = null;

        favouriteToRemove = theApp.analysisDataObjectToFavourite(theApp.lastAnalysisObjectUsed);
        if (favouriteToRemove) {
            if (theApp.favouriteExists(favouriteToRemove.favouriteId)) {
                favouritesData = theApp.favouritesManager.getData('favourites');
                if (helper.removeObjectFromArray(favouritesData.items, 'favouriteId', favouriteToRemove.favouriteId)) {
                    theApp.favouritesManager.saveData('favourites', theApp.lastUsernameUsed);
                    theApp.favouritesManager.update(theApp.lastUsernameUsed);
                }
            }
        }
    };

    // - favouriteId [optional]
    theApp.synchronizeFavouriteButton = function (favouriteId) {
        var favourite = theApp.getFavouriteById(favouriteId),
            favouriteButton = theApp.toolbar.getButton('favourite');

        if (favourite && favouriteButton) {
            theApp.setLastFavouriteSelected(favourite.favouriteId);
            favouriteButton.select();
        } else {
            favouriteButton.deselect();
        }
    };

    theApp.setLastFavouriteSelected = function (favouriteId) {
        theApp.lastFavouriteSelected = favouriteId;
    };

    // ------------------------------------------
    // THEMES MANAGER
    // ------------------------------------------

    theApp.themesManager = loader.loadModule('themesManager');

    theApp.themesManager.on('onThemeChanged', function (themeName) {
        var themeData = theApp.themesManager.getData('theme') || null;

        if (themeData) {
            themeData.name = themeName;
            theApp.themesManager.saveData('theme', theApp.lastUsernameUsed);
        }

        output.log('onThemeChanged', themeName);
    });

    // ------------------------------------------
    // PORTFOLIOS LIST
    // ------------------------------------------
    //
    // NOTA BENE:
    // PortfoliosList has been removed from the app but the code is still here
    // for testing purpose.

    theApp.portfoliosList = loader.loadModule('portfoliosList');

    theApp.portfoliosList.on('onDataReceived', function (data) {
        $(el.analysisPage + '_partial').html(data);
    });

    // ------------------------------------------
    // TEARDOWN
    // ------------------------------------------

    // Unload modules from the loader after they have been loaded by the app.
    loader.unloadModule('ajaxManager');
    loader.unloadModule('analysisManager');
    loader.unloadModule('analysisSettingsPage');
    loader.unloadModule('auth');
    loader.unloadModule('chartComponents');
    loader.unloadModule('chartSettingsPage');
    loader.unloadModule('device');
    loader.unloadModule('favouritesManager');
    loader.unloadModule('helper');
    loader.unloadModule('languageSettingsPage');
    loader.unloadModule('loadingMaskManager');
    loader.unloadModule('localStorageManager');
    loader.unloadModule('nav');
    loader.unloadModule('pageEventsManager');
    loader.unloadModule('portfoliosList');
    loader.unloadModule('portfolioManager');
    loader.unloadModule('repositories');
    loader.unloadModule('scroll');
    loader.unloadModule('tabbar');
    loader.unloadModule('settings');
    loader.unloadModule('spinningWheel');
    loader.unloadModule('swipeButton');
    loader.unloadModule('swipeView');
    loader.unloadModule('themesManager');
    loader.unloadModule('toolbar');
    loader.unloadModule('presentationManager');

    theApp.startHere();

    theApp.changeOrientation = function () {
        var animationSpeed  = 250,
            rebuildingDelay = 500;

        if (theApp.presentationManager.isFullScreen()) {
            return;
        }
        theApp.mask.show('turn');
        // ASA TODO: Change left, top, width and height from chartDefaults instead of scaling all charts about .93...
        if (device.orientation() === 'landscape') {
            // $('.chartContainer').css('-webkit-transform', 'scale(.75)');
            $('.chartContainer').css({'-webkit-transform': 'scale(.93)', '-webkit-transform-origin': 'left top'});
            $('.analysisComponentContainer').animate({ height: '500px' }, { duration: animationSpeed, easing: 'ease-out', complete: function () {}});

        } else {
            $('.chartContainer').css({'-webkit-transform': 'scale(.69)', '-webkit-transform-origin': 'left top'});
            $('.analysisComponentContainer').animate({ height: '375px' }, { duration: animationSpeed, easing: 'ease-out', complete: function () {}});
        }

        // Rebuild the iScroll using a delay is necessary to ensure that the page height
        // is calculate correctly.
        setTimeout(function () {
            theApp.scroll.rebuild('analysis');
            theApp.mask.hide('turn');
        }, animationSpeed + rebuildingDelay);
    };

    $('body').bind('turn', function(event, info){
        theApp.changeOrientation();

    });
});


