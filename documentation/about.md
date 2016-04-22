# About PIE

CSS Level 3 brings with it some incredibly powerful styling features. Rounded corners, soft drop shadows, gradient fills, and so on. These are the kinds of elements our designer friends love to use because they make for attractive sites, but are difficult and time-consuming to implement, involving complex sprite images, extra non-semantic markup, large JavaScript libraries, and other lovely hacks.

CSS3 promises to do away with all that! But as we all know, due to Internet Explorer's lack of support for any of these features, **we must be patient and refrain from using them**, and make do with the same old tedious techniques for the foreseeable future.

**Or must we?**

PIE stands for Progressive Internet Explorer. It is an IE attached behavior which, when applied to an element, allows IE to recognize and display a number of CSS3 properties. Consider, if you will, the following CSS:

```CSS
#myElement {
    background: #EEE;
    padding: 2em;
    -moz-border-radius: 1em;
    -webkit-border-radius: 1em;
    border-radius: 1em;
}
```

This results in a box with nicely rounded corners in any of today's modern browsers, except of course for IE 6, 7, or 8, which all display a square box. However, add the following single rule to that CSS:

```CSS
#myElement {
    ...
    behavior: url(PIE.htc);
}
```

Now the exact same rounded corners appear in IE! That's all there is to it. No, really, I mean it.

PIE currently adds full or partial support to IE 6 through 8 for the following CSS3 features:

*   border-radius
*   box-shadow
*   border-image
*   multiple background images
*   linear-gradient as background image

In addition, PIE adds support for border-image and linear-gradient to IE 9, which already supports the other features natively.

Other features are under active development.

**Want to learn more?** View some live [demos](/demos), read the [documentation](/documentation/), and [download PIE](/download-latest) to try it yourself. Be sure to read the [Known Issues](/documentation/known-issues/) page for common problems and their solutions.

PIE is still a young project with big plans. But it's already good enough to save you a _lot_ of time and make your life as a Web developer much easier. Happy CSS3 coding!