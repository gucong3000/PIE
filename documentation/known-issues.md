# Known Issues

This document describes the most common general issues encountered when using PIE. For information regarding bugs and limitations in the implementations of specific features, see the detailed documentation of the [supported CSS3 features](/documentation/supported-css3-features/), and also our [issue tracking system](http://github.com/lojjic/PIE/issues) where bug reports and feature requests are tracked.

*   [Disappearing backgrounds/borders/shadows (z-index issues)](#z-index)
*   [Relative paths](#relative-paths)
*   [Shorthand only](#shorthand)
*   [Problems with hasLayout](#hasLayout)
*   [Deviations from CSS3 spec](#spec-bugs)
*   [Serving the correct Content-Type](#content-type)
*   [Same domain limitation](#x-domain)
*   [Problems on certain elements](#elements)
*   [Browser zooming](#zoom)

## Disappearing backgrounds/borders/shadows (z-index issues)

First, a little background on how PIE renders CSS3 decorations: a single `<css3-container/>` element is created which holds all the VML objects. This container element is inserted as a previous sibling to the target element, and absolutely positioned at the same coordinates. If the target element is position:absolute or position:relative, then the css3-container element is given the same z-index as the target element, and since it is a previous sibling in the DOM tree it gets displayed behind, with no possibility of any other element sneaking in between.

However, this does not work so well when the target element is position:static, because static elements do not participate in z-index stacking. The only way to make our position:absolute css3 element go behind it is to give it `z-index:-1`. Unfortunately, this has a bad side-effect: not only will the css3 element go behind the target element, it will also go _behind the background of any ancestor element(s) which are themselves position:static._ This leads to situations in which PIE creates the VML rendering correctly but it disappears behind a parent element's background.

The only way I know of to work around this is to either:

1.  make the target element position:relative, or
2.  make the ancestor element position:relative and give it a z-index.

Both of these workarounds can have potential unwanted side-effects in terms of child element positioning and z-index stacking. PIE could easily force one or the other itself, but:

1.  One or the other may be more appropriate depending on the particular situation, so the CSS author needs to be able to control which one gets chosen.
2.  Forcing position:relative outside of the CSS would put IE out of sync with other browsers, leading to confusing inconsistencies.

PIE therefore does neither, and it is up to the author to implement either workaround where necessary. In most cases simply adding position:relative to the target element is fine.

## Relative paths

There are two main issues related to relative paths in CSS:

### The behavior URL

IE interprets the URL for the `behavior` property relative to the source HTML document, rather than relative to the CSS file like every other CSS property. This makes invoking the PIE behavior inconvenient, because the URL has to either be:

1.  Absolute from the domain root — this makes the CSS not easily moveable between directories — or,
2.  Relative to the HTML document — this makes the CSS not easily reusable between different HTML files.

### URLs in PIE-interpreted CSS properties

PIE does not parse the CSS stylesheets (to do so would be unacceptably slow); it lets IE handle the parsing, selector querying, cascading, etc. and then simply asks it for the resulting property values. This means that when PIE gets a property value, it has no knowledge of the context from which that value originated.

As a result, for properties which contain URL values (such as border-image or -pie-background), PIE cannot resolve those URLs relative to the CSS file in which they appear. It resolves them instead relative to the JavaScript execution context, which is the location of the source HTML document.

## Shorthand only

For all CSS properties which PIE parses, only the shorthand versions of those properties will be recognized. For example, while `border-radius` is supported, the individual longhand `border-top-left-radius` etc. properties are not.

The reason for this is the same reason URLs are not resolved relative to the CSS file (see above): PIE does not have visibility into where each style property comes from. If there is both a shorthand and a longhand property present, PIE cannot determine the order in which the CSS author specified those properties, nor can it determine the specificity of the selector for each property. It cannot therefore make an informed decision about which property should take precedence.

To avoid making dumb guesses, we have opted to only support shorthand properties. Shorthand was chosen over longhand to keep file size small and avoid tedious repetition.

## Problems with hasLayout

In order to automatically detect element position and dimension changes, PIE has to force "[hasLayout](http://www.satzansatz.de/cssd/onhavinglayout.html)" on the target element (in IE6 and IE7). It does so by applying the style `zoom:1;` to the element.

For the most part, doing this has no adverse effect on the rendering of the element. In fact, a lot of times it improves the rendering (hasLayout is often used as a hack to work around IE CSS bugs). However, in some cases this has [unwanted consequences](http://www.satzansatz.de/cssd/onhavinglayout.html#rev) such as disappearing top margins.

## Deviations from CSS3 spec

For the properties it supports, PIE attempts to match the syntax parsing and rendering as specified by the current CSS3 spec document drafts. Any deviations should be considered defects. If you find a bug, please open a ticket in our [issue tracking system](http://github.com/lojjic/PIE/issues). You can find information about many of the known issues in the detailed documentation of [supported CSS3 properties and values](/documentation/supported-css3-features).

Do keep in mind, however, that the CSS3 specs are still a moving target. Some properties, such as border-radius, have been around long enough, and have sufficient cross-browser implementation, such that it is unlikely further changes to the spec will occur. Other things, such as gradients, are relatively new to the specs and are more likely to change in future drafts.

Fortunately, this threat of future change is not as much of a problem when using PIE as it is when writing for other browsers. The reason is that the CSS author, by deploying PIE, essentially has control over the user agent. You know that when you deploy a certain version of PIE, all IE users will experience the same parsing and rendering behavior. You don't have to worry that some users will be using an old version which has more bugs, or that users will have a newer version in the future which has different behavior you can't plan for. You can safely depend on the behavior of the exact PIE version you deploy, indefinitely into the future.

But what happens when the spec changes and PIE hasn't yet been updated to support the new syntax or behavior? Or what about when there's a bug in PIE that makes it impossible to use the same CSS property for both PIE and other browsers? To handle both these cases, any of the supported CSS3 properties can be prefixed with `-pie-` and that will be used in preference to the standard property. So for instance you could specify a `box-shadow` value which would be used by other browsers, and then a `-pie-box-shadow` value which will be used only by PIE. This is recommended only as a final resort; it's always best to use the standard property if at all possible.

## Serving the correct Content-Type

IE requires that HTC behaviors are served up with a content-type header of "text/x-component", otherwise it will simply ignore the behavior. Many web servers are preconfigured to serve the correct content-type, but others are not.

If you have problems with the PIE behavior not being applied, check your server configuration and if possible update it to use the correct content-type. For Apache, you can do this in a .htaccess file:

`AddType text/x-component .htc`

If for some reason you are unable to modify the server configuration (e.g. if you are on a shared host which does not allow custom .htaccess files), then you may also use a wrapper script. For instance, PIE includes in its distribution files a PHP script called PIE.php; this script simply serves up the PIE.htc file using the correct content-type header. To use it, simply make sure both PIE.php and PIE.htc are in the same directory, and then in your CSS point the behavior to the PHP file instead:

`behavior: url(PIE.php);`

Note that this issue is particularly a problem in IE 9, which seems more strict about the content-type than some other IE versions.

## Same-domain limitation

IE requires that the PIE.htc behavior file must be in the same domain as the HTML page which uses it. If you try to load the behavior from a different domain, you will get an "Access Denied" error.

Note that the domain must be _exactly_ the same; that means that http://www.foo.com is a different domain than http://foo.com.

If this limitation is a dealbreaker for you, you may be able to use the alternate [PIE.js](/documentation/pie-js/) approach to get around it.

## Problems on certain element types

PIE does not currently work when applied to the `<body>` or `<html>` elements. Try using a wrapper div around the body contents and applying your CSS3 styles and PIE.htc to it instead.

Avoid using PIE on `<fieldset>` elements, as it does not properly handle rendering of the `<legend>`.

Also, element types that cannot accept children (e.g. `<input>` and `<img>`) will fail or throw errors if you apply styles that use relative length units such as em or ex. Stick to using px units for these elements.

## Browser Zooming

When the user uses the browser zoom function (available in IE7 and up), PIE does not currently scale any background images it manages to match. This can cause things to look broken at zoom levels other than 100%, if your background images are dependent on sizing (e.g. sprite images). This will be fixed in an upcoming release; see [issue 79](https://github.com/lojjic/PIE/issues/79).