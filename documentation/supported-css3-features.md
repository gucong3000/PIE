# Supported CSS3 Features

The following sections describe in detail the exact levels of support PIE has for certain CSS3 properties and value types.

*   [border-radius](#border-radius)
*   [box-shadow](#box-shadow)
*   [border-image](#border-image)
*   [CSS3 Backgrounds (-pie-background)](#pie-background)
*   [Gradients](#gradients)
*   [RGBA Color Values](#rgba)
*   [PIE Custom Properties](#custom)
    *   [-pie-load-path](#pie-load-path)
    *   [-pie-watch-ancestors](#pie-watch-ancestors)
    *   [PNG alpha transparency and -pie-png-fix](#pie-png-fix)
    *   [Lazy Initialization (-pie-lazy-init)](#pie-lazy-init)
    *   [Layout polling (-pie-poll)](#pie-poll)
    *   [:hover tracking (-pie-track-hover)](#pie-track-hover)
    *   [:active tracking (-pie-track-active)](#pie-track-active)

## border-radius

PIE fully supports the [border-radius property syntax](http://www.w3.org/TR/css3-background/#the-border-radius) as defined in the CSS3 Backgrounds and Borders module specification for IE 6-8\. IE 9 and up support border-radius natively so PIE does nothing.

```
border-radius: [ <length> | <percentage> ]{1,4} [ / [ <length> | <percentage> ]{1,4} ]?
```

Only the shorthand version is supported; the longhand border-top-left-radius etc. properties are not. The shorthand syntax does support different radii per corner, though:

```CSS
border-radius: 5px 10px 15px 20px; //(top-left, top-right, bottom-right, bottom-left)
```

The rounded corners are applied to the element's background area (including solid background colors, background images, and background gradients), the element's border, and the box-shadow if specified.

Both the standard border-radius property name as well as a custom prefixed -pie-border-radius property name are recognized; if both are present then the prefixed value will take precedence. It is recommended to only use the standard unprefixed property when possible.

## box-shadow

PIE supports the [box-shadow property syntax](http://www.w3.org/TR/css3-background/#the-box-shadow) as defined in the CSS3 Backgrounds & Borders module, for IE 6-8\. IE 9 and up support box-shadow natively so PIE does nothing.

```
box-shadow: none | <shadow> [,<shadow>]*
    where <shadow> = inset? && [ <offset-x> <offset-y> <blur-radius>? <spread-radius>? && <color>? ]
```

Both the standard box-shadow property name as well as a custom prefixed -pie-box-shadow property name are recognized; if both are present the prefixed value will take precedence. It is recommended to use the non-prefixed property when possible.

When used in conjunction with border-radius, the shape of the shadow matches the shape of the rounded border box.

The shadow shape rendered by PIE is, unlike other browsers, [opaque in the area behind the element's background](https://github.com/lojjic/PIE/issues/12). This means that if your element has a transparent or semi-transparent background, the opaque shadow will show through. To avoid this you must either give the element a non-transparent background, or remove the box-shadow.

PIE does not currently support the 'inset' keyword, but support is planned in a future version (see [issue #3](http://github.com/lojjic/PIE/issues#issue/3).

If you specify an rgba color in conjunction with a blur radius, the color will be rendered at full opacity in PIE 1.0\. This is fixed as of PIE 2.0 beta.

Notes on other browsers:

See the compatibility chart at the bottom of [https://developer.mozilla.org/En/CSS/-moz-box-shadow](https://developer.mozilla.org/En/CSS/-moz-box-shadow)

## border-image

PIE adds support for the border-image property to IE 6-9\. This property allows you to specify an image which gets divided into nine squares which are then drawn as the corners, sides, and center of the target element.

There are currently a few limitations of PIE's implementation, including:

1.  It only supports the 'stretch' scheme in IE 6-8\. (The other schemes ('repeat' and 'round') are fully supported in IE 9.)
2.  It doesn't support the [outset parameter](http://dev.w3.org/csswg/css3-background/#border-image-outset) described in the Backgrounds & Borders module spec, though other browsers don't seem to support that yet either.
3.  It requires the 'fill' keyword to be present for the center area to be filled in. This is correct behavior according to the spec but other browsers don't require it and some even fail if 'fill' is present, so it's a bit tricky making it work consistently across browsers.
4.  In PIE 1.0, there are on rare occasion rounding errors which cause 1px gaps between slices of the image. I've seen these gaps occur in other browsers too, though. This seems to be fixed as of PIE 2.0 beta.

## CSS3 Backgrounds (-pie-background)

PIE supports CSS3 multiple background images, linear gradients as background images, and some of the new CSS3 background aspects such as background origin and clip. Unfortunately, to get access to these post-CSS2 values, we have to put them in a property other than the standard 'background' property, because IE will attempt to parse the value internally and not allow us access to the original value string. Therefore we use a custom -pie-background property for holding these values.

(Note that IE9 and up support multiple background images natively, so PIE only takes over in IE 6-8\. It also takes over in IE 9 when there is a gradient present in the -pie-background -- see the section on [gradients](#gradients) below.)

Only the single -pie-background shorthand value is recognized; longhand values (e.g. background-origin) are ignored.

For backward-compatibility with browsers which do not support CSS3 backgrounds, be sure to include appropriate fallbacks. For example:

```
#myElement {
    background: url(bg-image.png) no-repeat #CCC; /*non-CSS3 browsers will use this*/
    background: url(bg-image.png) no-repeat, -webkit-gradient(linear, 0 0, 0 100%, from(#CCC) to(#EEE)); /*old webkit*/
    background: url(bg-image.png) no-repeat, -webkit-linear-gradient(#CCC, #EEE); /*new webkit*/
    background: url(bg-image.png) no-repeat, -moz-linear-gradient(#CCC, #EEE); /*gecko*/
    background: url(bg-image.png) no-repeat, -ms-linear-gradient(#CCC, #EEE); /*IE10 preview*/
    background: url(bg-image.png) no-repeat, -o-linear-gradient(#CCC, #EEE); /*opera 11.10+*/
    background: url(bg-image.png) no-repeat, linear-gradient(#CCC, #EEE); /*future CSS3 browsers*/
    -pie-background: url(bg-image.png) no-repeat, linear-gradient(#CCC, #EEE); /*PIE*/
}
```

While the PIE parser will allow them, the following aspects of the background shorthand will currently be ignored when rendering in IE 6-8:

*   background-attachment (will always use 'scroll' even if 'fixed' or 'local' are specified)
*   background-size (will always use the image's intrinsic size) — this is supported as of PIE 2.0 beta
*   background-repeat values of 'space' or 'round' (the other repeat values are supported)
*   background-origin (will always use 'padding-box') — this is supported as of PIE 2.0 beta
*   background-clip (will always use 'border-box') — this is supported as of PIE 2.0 beta
*   background-position values with more than 2 parts

Support for these items will be added in future versions as possible.

Note that PNG background images specified using `-pie-background` will be rendered with correct alpha channel transparency in IE6\. See the section below regarding [PNG alpha transparency](#pie-png-fix) for more information.

Notes on other browsers:

See [https://developer.mozilla.org/en/CSS/Multiple_backgrounds](https://developer.mozilla.org/en/CSS/Multiple_backgrounds)

## Gradients

PIE currently supports `linear-gradient` image values when used in the -pie-background property, for IE 6-9\. Uses of linear-gradient in any contexts other than the -pie-background are not supported.

The supported syntax matches that of the CSS3 Image Values module — PIE 1.0 uses the old [2011 working draft syntax](http://www.w3.org/TR/2011/WD-css3-images-20110712/#linear-gradients), whereas PIE 2.0 beta uses the [final syntax](http://www.w3.org/TR/css3-images/#linear-gradients). If you upgrade from PIE 1.0 to 2.0 beta, then you must make sure you update your CSS to the final syntax — e.g. use "to right" instead of "left", and adjust any angles to be clockwise from vertical.

```
linear-gradient([<bg-position> || <angle>,]? <color-stop>, <color-stop>[, <color-stop>]*);
```

PIE's linear-gradient support in IE 6-8 has a few limitations (all of these work properly in IE 9):

*   In PIE 1.0, all color stops are rendered fully opaque in IE 6-8, even if specifying an rgba color value. As of PIE 2.0 beta, rgba alpha is rendered properly in IE 6-8, but only if the gradient has two color stops. (See [issue #7](http://github.com/lojjic/PIE/issues#issue/7))
*   Gradients containing color-stops which lie outside the bounding area of the element are not currently supported, due to limitations in VML's gradient rendering.
*   The background-size/origin/repeat/position parameters are not supported for gradients in IE 6-8, so you cannot do things like [gradient pattern effects](http://leaverou.me/2010/12/checkered-stripes-other-background-patterns-with-css3-gradients/).

Radial gradients are not supported at this time; this feature is planned for a future release (see [issue #2](http://github.com/lojjic/PIE/issues#issue/2)) but it may turn out to be impossible to implement in IE 6-8 due to VML's strange radial gradient behavior.

Notes on other browsers:

Some other browsers require a vendor prefix on the linear-gradient name, e.g. -moz-linear-gradient for Firefox or -webkit-linear-gradient for WebKit browsers.

Adding in PIE's required -pie-background property, you will need a set of styles similar to the following to get consistent linear gradient backgrounds across browsers:

```CSS
#myElement {
    background: #CCC; /*fallback for non-CSS3 browsers*/
    background: -webkit-gradient(linear, 0 0, 0 100%, from(#CCC) to(#EEE)); /*old webkit*/
    background: -webkit-linear-gradient(top, #CCC, #EEE); /*newer webkit*/
    background: -moz-linear-gradient(top, #CCC, #EEE); /*old gecko*/
    background: -o-linear-gradient(top, #CCC, #EEE); /*opera 11.10+*/
    background: linear-gradient(to bottom, #CCC, #EEE); /*firefox 16+, chrome 26+, IE10+, opera 12.10+, future browsers*/
    -pie-background: linear-gradient(to bottom, #CCC, #EEE); /*ie 6-9 via PIE*/
    behavior: url(PIE.htc);
}
```

For more detailed information on the current state of linear-gradient across browsers, see this [article by John Allsopp](http://www.webdirections.org/blog/css3-linear-gradients/) and the [MDN linear-gradient docs](https://developer.mozilla.org/en-US/docs/CSS/linear-gradient).

## RGBA Color Values

PIE parses RGBA color values wherever they are allowed. However it is only able to successfully render their opacity value in a few contexts. In all other contexts they will be rendered with the correct RGB color, but fully opaque. Here are the supported contexts in which the opacity will be rendered correctly:

*   The solid background-color as specified in the -pie-background property.
*   The color value of box-shadow. In PIE 1.0 this works only if the shadow has no blur, but it works with blur as well in the PIE 2.0 beta.
*   Color stops in linear-gradient. In PIE 1.0 this works for IE 9 only (rgba colors will be rendered fully opaque in IE 6-8.) In the PIE 2.0 beta it works for IE 6-8 as well, but only if the gradient has only two color stops.

## PIE custom properties

### -pie-load-path (applies to PIE 2.0 beta only)

As of PIE 2.0 beta, the PIE.htc behavior file is a very lightweight loader that loads in a secondary JS file containing the logic needed by the current IE version. By default, it loads that secondary JS file from the same server path as the PIE.htc behavior file itself.

If you wish to override the location from which the JS files will be loaded, you can add the custom -pie-load-path property into your CSS for the `<html>` element:

```
html {
    -pie-load-path: "http://any.server/path/to/pie-js-files/";
}
```

This can be any path, on any server, and is not subject to the same-domain restriction of the HTC file. This can be useful, for example, if you want to host the JS files on a <abbr title="Content Delivery Network">CDN</abbr> to take advantage of geolocated caching for performance.

### -pie-watch-ancestors

PIE automatically listens for any attribute or style property changes on the element to which the behavior is applied. This means that if you have scripting which modifies any of the recognized CSS3 properties on the fly, those changes will automatically be picked up and the rendering will be updated to match. For example:

```JavaScript
/* JS: */
myElement.onclick = function() {
    this.style.borderRadius = '20px';
};
```

```CSS
/* CSS: */
#myElement {
    behavior: url(PIE.htc);
    border-radius: 10px;
}
```

Assuming myElement has the PIE.htc behavior attached to it, the above code will work as expected without any extra effort from the author of the script or CSS. This seamlessness is a big part of why PIE is so easy to use.

But common best-practices in scripting dictate that instead of setting styles directly with element.style.foo, scripts should only add/remove elements' class names, letting the actual styles corresponding to those class names be maintained in the CSS. So reworking the above example:

```JavaScript
/* JS: */
myElement.onclick = function() {
    this.className += ' poked';
}
```

```CSS
/* CSS: */
#myElement {
    behavior: url(PIE.htc);
    border-radius: 10px;
}
#myElement.poked {
    border-radius: 20px;
}
```

Again, since the className is being changed on the element to which the behavior is applied, PIE will automatically be notified of the change and update the border-radius rendering to match the new value.

However, what if the className is changed not on the element itself but on one of its ancestors?

```JavaScript
/* JS: */
myElement.onclick = function() {
    this.parentNode.className += ' poked';
}
```

```CSS
/* CSS: */
#myElement {
    behavior: url(PIE.htc);
    border-radius: 10px;
}
.poked #myElement {
    border-radius: 20px;
}
```

This is a very common pattern which allows a lot of flexibility. However, in this case, PIE will not be automatically notified of the className change. To be notified, it will also have to add a listener to the ancestor element. We could brute-force this by automatically adding propertychange listeners to all the ancestors of every PIE-targeted element, but that would be bad for performance and memory usage. So instead, we have introduced a custom CSS property which allows authors to tell PIE that certain ancestors should be watched:

```JavaScript
/* JS: */
myElement.onclick = function() {
    this.parentNode.className += ' poked';
}
```

```CSS
/* CSS: */
#myElement {
    behavior: url(PIE.htc);
    border-radius: 10px;
    -pie-watch-ancestors: 1;
}
.poked #myElement {
    border-radius: 20px;
}
```

This tells PIE that it should watch for changes on ancestors one level up from the element. It will attach the propertychange listener to the element's parent and therefore be notified when the parent's className gets changed, and update the rendering correctly.

### PNG alpha transparency and -pie-png-fix

A nice side-effect of PIE's use of VML for rendering is that it causes PNG images with alpha channel transparency to be correctly displayed in IE6 when they are rendered by PIE's engine. This includes:

*   Background images specified using the [-pie-background](#pie-background) property
*   Background images specified using the standard `background-image` style, when used in conjunction with other CSS3 properties that trigger re-rendering of the background (border-radius, border-image)
*   `<img>` elements that have border-radius applied

Sometimes you might want the benefit of the fixed PNG transparency, on elements that do not meet the criteria above. In that case, you can add the custom property `-pie-png-fix: true;` to force re-rendering of the background-image or `<img>`. (The PIE.htc behavior must also be attached to the element.)

### Lazy Initialization (-pie-lazy-init)

While PIE has been optimized for speed, there is still a small cost in rendering performance for each element it is applied to. When you have dozens or hundreds of elements on your page with CSS3 styles applied, this can add up to a noticeable rendering delay.

When you have that many elements on one page, chances are that only a small number of them are visible in the browser viewport initially, as viewing the rest would require scrolling. PIE allows an optional optimization for this case: if you apply the custom `-pie-lazy-init:true;` property to elements PIE will delay the initialization of their CSS3 rendering until they are scrolled into the viewport. This keeps the initial page load snappy without severely limiting the number of elements you can render.

### Layout Polling (-pie-poll)

In general PIE is quite good at detecting changes to the size and position of the elements to which it is attached and automatically adjusting its rendering to match. It does this by listening to the IE-specific `onmove` and `onresize` events for each target element. In the majority of cases this works seamlessly; in rare cases, however, IE does not fire these events when it should, and PIE gets out of sync.

To help users get around these cases, PIE has a second method for tracking size and position changes: polling. When polling is enabled for an element, PIE will manually query that element's layout several times a second, and if the layout has changed then it will adjust the rendering.

Polling is enabled by default for all elements in IE 8 and 9 (as those version is particularly bad about not firing the events) and disabled in IE 6 and 7\. Users can override these defaults to force polling on or off for individual elements by setting a custom CSS property: just specify `-pie-poll:true;` to force polling on for an element, or `-pie-poll:false;` to disable it.

### Hover tracking (-pie-track-hover)

By default, PIE automatically listens for mouseover/out events and applies any matching `:hover` styles if supported by the browser. In addition, it adds a special `pie_hover` class to the element which you can use to apply hover styles in versions of IE that don't support it.

If you want to disable this, you can do so by setting the custom CSS style `-pie-track-hover:false;` for the element. This might be useful if you notice sluggishness on your page when hovering and you don't need hover styles.

### Active tracking (-pie-track-active)

By default, PIE automatically listens for mousedown/up events and applies any matching `:active` styles if supported by the browser. In addition, it adds a special `pie_active` class to the element which you can use to apply active styles in versions of IE that don't support it.

If you want to disable this, you can do so by setting the custom CSS style `-pie-track-active:false;` for the element. This is useful in some situations where the addition of the pie_active class has unwanted side effects, for instance breaking the behavior of [scrollbars in IE7](https://github.com/lojjic/PIE/issues/190).