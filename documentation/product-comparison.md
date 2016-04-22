# Comparing PIE to Other CSS3 Products

PIE is not the first product by far to provide some level of CSS3 support in IE. It can be difficult to tell what the differences are between all the products out there, so I'm going to attempt to cover several of the major ones here, and clarify their similarities and differences with PIE.

An aside: some of these comparisons are based on fairly cursory evaluations of the projects. As a result there may be some inaccuracies. I welcome any corrections, as I want to give each product a fair description.

*   [IE7.js](#ie7-js)
*   [Selectivizr](#selectivizr)
*   [eCSStender](#eCSStender)
*   [DD_roundies](#DD_roundies)
*   [border-radius.htc (curved-corner)](#curved-corner)
*   [ie-css3.htc](#ie-css3-htc)
*   [cssSandpaper](#cssSandpaper)

## Dean Edwards's [IE7.js](http://code.google.com/p/ie7-js/) (and IE8.js, IE9.js)

This is the granddaddy of all IE shims, and probably the first major attempt at implementing CSS3 features in IE. I'm a big fan of Dean Edwards's work ([Base.js](http://dean.edwards.name/weblog/2006/03/base/) is still the most elegant classical inheritance abstraction for JavaScript I've come across) and this is certainly one of his more impressive chunks of code.

It is implemented as a series of drop-in .js scripts, the main focus of which is working around IE layout bugs and implementing advanced selectors. This includes, naturally, several CSS3 selectors. It doesn't currently attempt to implement rendering of any of the CSS3 box decoration properties.

Conversely, PIE doesn't attempt to implement any CSS3 selectors. This means that the two products target completely different aspects of CSS3 with no overlap.

The big downside with IE7.js as I understand it is performance. Because it has to parse all the document's stylesheets, rewrite many aspects of them, and add a bunch of extra elements and classNames to the DOM tree, page loads can feel sluggish. This is the main reason PIE makes no attempt to implement selectors, or anything else such as shorthand/longhand specificity resolution which would require parsing stylesheets. Performance is a primary goal, so I made the tough choice early on to sacrifice some completeness for speed.

A possibility I find intriguing is combining the two libraries so that IE7.js gives you all the advanced selectors, and PIE gives you the advanced box decoration rendering. While I haven't tried this yet, I don't know of any reason it couldn't work splendidly.

## Keith Clark's [Selectivizr](http://selectivizr.com/)

This project, like IE7.js, implements CSS3 selectors only. It should also be possible to combine this with PIE to get both selectors and box decorations in IE.

One of the more interesting things about this product is that it outsources all its parsing and matching of CSS selectors to a number of other JavaScript libraries. As a result, Selectivizr itself is extremely small. This makes a whole lot of sense if your site, like many or most sites, already include a JavaScript library like jQuery for other functionality; by reusing that code your total file download size can be much smaller.

## Aaron Gustafson's [eCSStender](http://ecsstender.org/)

Of the products listed here, this is probably the most modular and well-documented from an API point of view. It consists of a "core" which parses the page's stylesheets and invokes one or more modular "extensions" based on conditions such as selector pattern or property name. There are a few extensions available which add some level of support for various features, including @font-face, CSS3 selectors, and CSS3 Backgrounds and Borders.

That last one sounds like it might overlap with PIE somewhat, but alas not really, at least not yet. It appears that the main focus of eCSStender is not implementing advanced features where they are missing, but more just abstracting away some of the differences in how browsers already implement things. The Backgrounds and Borders extension, for example, allows you to just write `border-radius` in your CSS and it automatically adds the corresponding vendor-prefixed versions. This is definitely handy, but if the browser doesn't already natively support some variant of rounded corners (as IE obviously does not), then it does nothing for you. Similarly, it handles `box-shadow` and will add an IE shadow filter to try to mimic the shadow in IE, but the filter differs so much from standard box-shadow in rendering that this isn't really useful if precision matters to you.

That said, eCSStender's modular nature should make it very easy to write an extension which would add references to PIE.htc where needed to implement the advanced renderings. This is a very interesting prospect.

## Drew Diller's [DD_roundies](http://www.dillerdesign.com/experiment/DD_roundies/)

It's difficult to express how much Drew's work on DD_roundies has influenced and inspired my work on PIE. The whole idea of positioning VML behind elements to mimic box decorations, proof that it could be done reliably and automatically adjust to position and size changes, and even some of the logic for building the rounded box paths, came from seeing DD_roundies in action and studying its source code. There are a lot of similarities between these two products... including, unfortunately, many of the "gotchas".

DD_roundies is implemented as a JavaScript library which you can call to add rounded corners to elements. It isn't just limited to IE, but can also apply the appropriate [-webkit-][-moz-]border-radius CSS properties if so desired. It does handle different radius lengths for each corner, though not different x/y axis radius values.

The main differences between DD_roundies and PIE are:

*   PIE is far more complete feature-wise. It basically handles everything DD_roundies does, but additionally supports non-solid border styles, differing x/y axis radius values, and details of the CSS3 border-radius spec such as how overlapping radii are adjusted. And then it adds in other CSS3 decoration features like box-shadow, multiple backgrounds, border-image, and gradients.
*   They are invoked very differently. DD_roundies is a .js file which requires you to write JavaScript to invoke it. Your radius values and selectors must be passed in that JS function call, which means they are separated from your CSS so you have two places to maintain styling code. PIE on the other hand is a .htc behavior, which is applied directly in your CSS file. It also picks up its target styles from your standard CSS rules, so you don't ever have to write any JavaScript. Both approaches have their strengths and weaknesses, but in my opinion PIE's approach gives a nicer coding experience to CSS authors.

## Remiz Rahnas's [border-radius.htc](http://code.google.com/p/curved-corner/) aka "curved-corner"

Like PIE, this project uses a .htc behavior which picks up the target border-radius value directly from the CSS. It also uses a similar approach of positioning VML directly behind the target element.

Unfortunately it is extremely simplistic. It only supports a single border radius value for all corners, doesn't handle rendering background images which are positioned or have repeat values other than 'repeat', and only supports solid border styles. In addition, it doesn't automatically adjust to match position or size changes of target elements, making it difficult to use in dynamically scripted environments.

That said, its simplicity comes with a big advantage: a minuscule file size. If you only require the basic features it provides, then this is probably an excellent choice.

## Nick Fetchak's [ie-css3.htc](http://www.fetchak.com/ie-css3/)

This project seems nearly identical to border-radius.htc mentioned above (in face Nick gives credit to Remiz on the site), but adds in some support for box-shadow, including blur, matching the rounded box shape. To my knowledge it is the first product to do so (though I had already implemented it in PIE before I found this project online).

The box-shadow seems to work well, but due to the algorithm of IE's blur filter, the rendering for a given blur radius ends up looking quite a bit different between IE and other browsers. I ran into this same issue building PIE, but have made some adjustments to make the rendering much more similar to the standard blur algorithm.

It also has some support for text-shadow, which PIE does not (yet) do at all. This is on the roadmap, but it is a very tricky problem to get text-shadow rendering correctly and adjust to on-the-fly DOM changes, perhaps even impossible.

## Zoltan Hawryluk's [cssSandpaper](http://www.useragentman.com/blog/2010/03/09/cross-browser-css-transforms-even-in-ie/)

If you want to use CSS3 2D transforms (rotate, scale, etc.) in IE 6-8 then cssSandpaper is an excellent choice. It handles translating transform commands to their corresponding IE filter commands, as well as handling other necessary adjustments such as position offsets and working around text antialiasing issues.

It also has an extension which adds amazingly accurate support for text-shadow.

PIE currently lacks support for both 2D transforms and text-shadow; they are planned for a future release but for now I do recommend cssSandpaper.

Unfortunately due to the special way PIE renders the features it supports, you cannot use cssSandpaper's 2D transform support in conjunction with PIE, or it will transform the element's foreground but leave its background in place. Once PIE adds its own 2D transform support this will work as expected.