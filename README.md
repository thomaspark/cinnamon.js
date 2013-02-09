# Cinnamon.js

Cinnamon.js takes some of the pain out of naming things. It’s a script that allows users to find links, images, and other content by their synonyms, using the browser’s built-in Find function.

![Cinnamon.js screenshot](screenshot.png)

## Usage

Add cinnamon.js just before your body’s end tag.

	<script src="cinnamon.min.js"></script>

Then wrap your element of choice (span tags are recommended) and give it a data-cinnamon attribute with a comma-separated list of synonyms as its value. If you wrap an image, its alt text will also be used.

	<span data-cinnamon="Azure,Cerulean,Cobalt">Blue</span>

## Demo

See Cinnamon.js in action [here](http://thomaspark.me/2013/02/cinnamon-js-find-in-page-text-using-synonyms/).

## Browser Support

Supports modern browsers and IE8+.

## Contact

Thomas Park

* Email: <hello@thomaspark.me>
* Web: <http://thomaspark.me>
* Twitter: <http://twitter.com/thomashpark>


## License

Copyright 2013 Thomas Park.

Released under the MIT License.