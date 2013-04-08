// Cinnamon.js
// Version: 1.0.6
// Author: Thomas Park
// License: MIT

(function () {

    // Add styles
    // get path to cinnamon's folder to find the font file
    var scripts = document.getElementsByTagName("script"),
        filepath = scripts[scripts.length-1].src.replace(/[^/]*$/g, "");

    var overflow = 'hidden',
        //fontsize = '999px', // This now totally screws up the script'intention in Chrome 26
        fontformat = 'font/opentype',
        fontsize = 'inherit',
        browser;

    if ((navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1)) {
        //overflow = 'visible';  // In combination with the 999px image width, this causes a severe bug in Rekonq (Webkit)
        overflow = 'hidden';
        browser = 'safari';
    } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
        fontformat = 'opentype',
        browser = 'firefox';
    }

    // Create .cinnamon's styles that may / have to be implemented before
    // the calculations
    var css = '';
    css += '@font-face {' + '\n';
    css += '    font-family: AdobeBlank;' + '\n';
    css += '    src: url(\'' + filepath + 'AdobeBlank.otf\') format(\'' + fontformat + '\');' + '\n';
    css += '    font-weight: normal;' + '\n';
    css += '    font-style: normal;' + '\n';
    css += '}' + '\n\n';
    css += '[data-cinnamon] {' + '\n';
    css += '    position: relative;' + '\n';
    css += '    z-index: 1;' + '\n';
    css += '    display: inline-block;' + '\n';
    css += '}' + '\n\n';
    css += '.cinnamon {' + '\n';
    css += '    display: inline-block;' + '\n';
    css += '    position: absolute; top: 0; left: 0;' + '\n';
    css += '    z-index: -1;' + '\n';
    css += '    overflow: ' + overflow + ';' + '\n';
    css += '    font-family: AdobeBlank;' + '\n';
    css += '    font-size: ' + fontsize + ';' + '\n';
    css += '    color: transparent;' + '\n';
    css += '}' + '\n\n';
    css += '@media all and (device-width: 768px) and (device-height: 1024px)' + '\n';
    css += '{' + '\n';
    css += '    .cinnamon' + '\n';
    css += '    {' + '\n';
    css += '        z-index: 1;' + '\n';
    css += '        opacity: 0.25;' + '\n';
    css += '    }' + '\n';
    css += '}' + '\n\n';

    createStylesheet(css);


    // Some CSS would screw the calculations,
    // so those have to wait until the end of the script
    var cssSynonym= '';
    cssSynonym += '.cinnamon {' + '\n';
    cssSynonym += '    width: 100%; height: 100%' + '\n';
    cssSynonym += '}' + '\n\n';

    // Add elements
    var cinnamons = document.querySelectorAll('[data-cinnamon]');

    for (var i = 0; i < cinnamons.length; i++) {

        var cinnamon = cinnamons[i],
            synonyms = cinnamon.getAttribute('data-cinnamon').split(','),
            image = cinnamon.getElementsByTagName('img')[0];

        // actual width of the original word(s)
        var widthCinnamon = cinnamon.offsetWidth;

        if (image && image.getAttribute('alt')) {
            synonyms.push(image.getAttribute('alt'));
        }

        for (var j = 0; j < synonyms.length; j++) {
            var e = document.createElement('span');
            e.className = 'cinnamon';
            e.setAttribute('aria-hidden', 'true');

            if (image) {
              e.style.fontSize = image.clientHeight + 'px';
              if (image.clientHeight == 0)
                {
                  widthCinnamon= 999;
                  e.style.fontSize = '999px';
                }
            }

            if (typeof (e.textContent) !== "undefined") {
                e.textContent = synonyms[j] + ' ';
            } else {
                e.innerText = synonyms[j] + ' ';
            }

            cinnamon.insertBefore(e, cinnamon.firstChild);

            // actual width of the synonym
            var widthSynonym = e.offsetWidth;

            // Calculate how many pixel we have to add via 'letter-spacing'
            // in order to make the synonym-word as long as the original word.
            // Good for us that 'letter-spacing' allows negative values.
            //
            // Note: the count of letter-spaces is *not*
            // the space between the letters (letters -1)
            // but is rendered as space *after* each letter,
            // including the last one.
            // (With the exception of older IEs, of course; needs testing.)
            var intNeededPixels = widthCinnamon - widthSynonym;
            var intRemainderPixel= intNeededPixels % synonyms[j].length;
            //var intPixPerSpace= (intNeededPixels - intRemainderPixel) / synonyms[j].length; // see [1] at the end of the script
            var intPixPerSpace= intNeededPixels / synonyms[j].length;

            // Create the synonym's random id and append its individual styles
            // to the 'cssSynonym' var
            var strID= getRandomID(8, 'cinn_');
            e.setAttribute('id', strID);
            cssSynonym += '#' + strID + '.cinnamon {' + '\n';
            cssSynonym += '    letter-spacing: ' + Math.ceil(intPixPerSpace) + 'px;' + '\n';
            cssSynonym += '}' + '\n\n';


            console.log(
              '-----------------------------------------------------------------\n'
              + 'Calculation of letter-spacing for synonyms of \n\n  ' + cinnamon.textContent + '\n\n'
              + 'Element-width:\t\t' + widthCinnamon + '\n'
              + 'Synonym-width:\t' + widthSynonym + '\n'
              + 'Difference:\t\t' + intNeededPixels + '\n'
              + 'Synonym letters:\t' + synonyms[j].length + '\n'
              + 'letter-spacing:\t\t' + intNeededPixels + ' / ' + synonyms[j].length
              + ' = ' + intPixPerSpace + ' | remainder ' + intRemainderPixel + '\n'
              + '-----------------------------------------------------------------\n'
          );

        }
    }

    // Last but not least,
    // create the stylesheet with all the styles we accumulated in 'cssSynonym'.
    createStylesheet(cssSynonym);
})();

/**
 * Appends the script's stylesheet to the html document
 *
 * @since v1.1.0
 *
 * @param {string} css
 * @returns {void}
 */
function createStylesheet(css)
{
  // create hook in html document to place the styles
  var head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

  // create the stylesheet from 'css'
  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  // append it to html document
  head.appendChild(style);
}

/**
 * Creates a random string with an optional prefix
 *
 * @since v1.1.0
 *
 * @param {Numeric} lenString | How many letters should the id have?
 * @param {String} prefix | Prefix to the returned string
 * @returns {String}
 */
function getRandomID(lenString, prefix)
{
	// init local vars
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var strRandom = '';

    // Create the ID and return it
	for (var i=0; i < lenString; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		strRandom += chars.substring(rnum,rnum+1);
	}
	return prefix + strRandom;
}

/*
 * [1]  The plan was to implement the remainder pixel into '#synonym-id:first-letter
 *      which sadly only works for block elements.
 *      Here we're screwed because its parent element is already 'inline-block',
 *      meaning that ::first-letter doesen't work on its children.
 *      We could wrap the first letter into a new span, but meh, that's too ugly
 *      and Math.ceil() for the normal letter-spacing does a well enough job.
 */