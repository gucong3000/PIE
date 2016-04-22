# Q & A

## What is PIE?

PIE is a utility for Internet Explorer (currently versions 6-8) which gives it the ability to parse and render a number of the most useful CSS3 properties.

## How does it work?

PIE is implemented as an attached behavior; in your CSS, you simply specify:

`behavior: url(PIE.htc);`

Once the behavior is attached, it looks for any of the supported CSS3 properties which might be attached to the target element, parses those properties, and renders them on the page.

## What CSS3 properties are currently supported?

PIE currently adds full or partial support in IE 6-8 for:

*   border-radius
*   box-shadow
*   border-image
*   multiple background images
*   linear-gradient background images

In addition, PIE adds support for border-image and linear-gradient to IE 9, which already supports the other features natively.

You can find detailed information about the levels of support in the [Supported CSS3 Properties and Values](/documentation/supported-css3-features/) documentation.

## How large is it?

In PIE 1.0, the .htc behavior file is 40K. With gzip compression, it is 16K. (You do gzip your content, right?)

It's pretty easy to save at least as much as that by using CSS3 instead of all the extra images, markup, and CSS you'd have to use otherwise, so this is usually a net win in terms of total page weight. Also, it's important to note that the behavior file is only downloaded by IE, so in other browsers which support these CSS3 features natively, that's pure win.

Starting with PIE 2.0, the .htc behavior file is a very small loader (2K) which then loads a secondary JS file containing the rendering logic for the user's IE version. See our blog post on [PIE 2's loading mechanism](http://css3pie.com/2013/01/25/pie-2-0s-new-loading-mechanism/) to see the improvement in download sizes.

## What are the goals of the project?

Even though today's advanced browsers are starting to implement decent levels of CSS3 support, it will still be years before Web authors can start using these CSS3 features in widespread deployment. The main reason is, of course, that Internet Explorer does not yet implement any of these features, has a majority market share, and has a notoriously slow upgrade cycle among its users. IE9 promises to start implementing some CSS3, but like it or not it will still likely be years before IE8 and below shrink to a negligible percentage of users.

PIE aims to drastically shorten that timeframe, by implementing a simple shim to make CSS3 "just work" in IE. Our goals are:

1.  ### Be simple to use

    Applying PIE is extremely simple; in many cases the only thing you have to do is add the behavior property to your CSS.

2.  ### Be a CSS-only solution

    Many of the current solutions for implementing CSS3 features like border-radius are implemented as JavaScript libraries and require the author to write JavaScript to invoke them. That is less than ideal because it requires the CSS author to also know how to write JS, and it makes development slower and less maintainable because your styling code is scattered between CSS and JS files. PIE works entirely within the stylesheet, so you only write CSS and it's all in a single place.

3.  ### Be seamless to the CSS author

    There have been several articles and resources in recent months which show ways that you can make IE "mimic" certain CSS3 features, for example using IE filters to fake box-shadow, or jQuery plugins to implement rounded corners. The problem with these solutions is that they require a lot of IE-specific code on top of your real CSS3, increasing your development time and the size of your CSS files. PIE on the other hand uses your CSS3 directly whenever possible; you simply write real CSS3, and PIE handles it seamlessly.

    PIE handles attaching, detaching, and updating automatically without any intervention from the author. This means that, unlike some other solutions, PIE does not require you to explicitly initialize elements when they are added to or removed from the document via script, and does not require any sort of "update" method to be called when an element's position, size, or styles are modified on the fly.

    Another aspect of PIE's seamlessness is that it should be fully compatible with any JavaScript library the site author might choose to use. You can create elements and assign CSS3 styles to them in jQuery or YUI or MooTools or any other library and PIE will automatically apply itself. Also, PIE's objects are completely self-contained except for a single global `PIE` object, so there's no chance that it will override objects or functions from any other JS code.

4.  ### Be as compliant with the CSS3 specs as possible

    PIE aims to be a true CSS3 implementation for those features it supports, complying with the current spec drafts as closely as possible. The goal is to allow authors to write a single set of CSS3 code and have it "just work" between browsers.

5.  ### Be as performant as possible

    If it makes the browser feel sluggish (more so than IE normally does, that is) then it's useless. PIE was architected with performance in mind from the very beginning:

    *   Rendering elements are only updated when they need to be.
    *   CSS property values are only parsed when they have changed.
    *   Internal objects are created lazily, and cached when appropriate.
    *   The behavior script is written with file size in mind, and the most advanced JS compression tools available are used to minimize the file size, so the initial download is as fast as possible.

## What sites have used PIE?

See our [Demos and Example Sites](/demos) page for a list of some live public sites using PIE.

## What are the licensing terms?

PIE is licensed under a [dual license of Apache License Version 2.0 and General Public License (GPL) Version 2](http://github.com/lojjic/PIE/blob/master/LICENSE).

While you are welcome to use PIE free of charge, we do ask that you consider making a donation as you are able. Development of PIE happens almost exclusively during "free time" on evenings and weekends, so your donations are important to help keep this going. Think of the hours of costly, frustrating cross-browser hacking that PIE is saving you; if you can donate a small proportion of that it will be greatly appreciated!