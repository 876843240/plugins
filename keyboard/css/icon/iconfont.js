;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-chenggong" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M65.04697 523.144828l94.045933-78.004585 215.882815 164.455539c0 0 246.376317-281.521768 547.976376-471.077985l35.999912 44.574195c0 0-343.111498 303.806307-520.30413 702.386118L65.04697 523.144828z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-cha" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M99.318006 20.230764 18.076704 88.145549c144.82034 107.410312 279.840476 230.879368 398.181745 354.660532-181.619454 182.240601-323.855946 361.460402-398.802892 433.502182l154.767899 128.969327c54.888098-112.852254 174.461427-284.660248 334.417489-464.250486C666.783249 721.724559 786.609335 894.087185 841.922105 1007.861438c0 0 150.816914-159.577438 164.280554-134.886083C947.984722 807.785633 806.553573 618.258069 615.85023 424.105161 725.05849 312.36217 847.604524 201.792912 978.476177 104.620779l-35.612079-66.242703C794.390555 111.904673 653.387148 220.996277 526.516622 337.113901 398.481573 216.547964 253.591649 101.101629 99.318006 20.230764L99.318006 20.230764z"  ></path>' +
    '' +
    '<path d="M99.318006 20.230764"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)