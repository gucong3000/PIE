# PIE.js - PIE JavaScript edition

In addition to the traditional PIE.htc behavior, the distribution now also includes a pure JavaScript version of the tool, PIE.js. While the .htc behavior is still the recommended approach for most users, the JS version has some advantages that may be a better fit for some users.

## Advantages of the JS version

Since it is a normal .js file, PIE.js does not suffer from some of the more annoying limitations of the PIE.htc behavior:

*   You can load PIE.js from a different domain than the HTML page.
*   You don't have to worry about your server not using the correct Content-type header for the file.
*   Referencing the PIE.js file via a relative path is simpler since you only have to do it once in each HTML page.
*   It is more easily integrated within JavaScript libraries.

## Disadvantages of the JS version

Unfortunately there are some significant drawbacks to using PIE.js, which is why the .htc behavior is still the recommended approach for most users:

*   Invoking it requires writing some JavaScript, which means your styling is scattered between CSS and JS code.
*   The .js file blocks the parsing of the page while it is loading, whereas the .htc file loads asynchronously.
*   You have to wait until the page's DOM has completely loaded before applying PIE.js to elements, whereas the .htc behavior applies itself while the page is still loading. This means the "flash of unstyled content" problem is much greater with PIE.js.
*   PIE.js cannot automatically attach and detach itself from elements which are dynamically added to/removed from the page's DOM, so you have to write code to handle that yourself.

## Using PIE.js

If you've decided the above advantages outweigh the disadvantages for you, here's how you go about using PIE.js.

1.  Include the PIE.js script in your page, surrounded by a conditional comment to prevent it from being downloaded in other browsers:
    ```HTML
    <!--[if IE]>
    <script type="text/javascript" src="path/to/PIE.js"></script>
    <![endif]-->
    ```
    Note: The code above is for PIE.js 1.0; if you are using a PIE 2.0 beta build, then you will need to include the appropriate JS file for the current IE version:
    ```HTML
    <!--[if lt IE 9]>
      <script type="text/javascript" src="path/to/PIE_IE678.js"></script>
    <![endif]-->
    <!--[if IE 9]>
      <script type="text/javascript" src="path/to/PIE_IE9.js"></script>
    <![endif]-->
    ```

2.  Invoke the `PIE.attach(el)` function for each element that needs CSS3 styling. Make sure you do this after the page's DOM has been fully loaded. For example, using jQuery:
    ```JavaScript
    $(function() {
        if (window.PIE) {
            $('.rounded').each(function() {
                PIE.attach(this);
            });
        }
    });
    ```

If you are going to add new elements to the page via JavaScript after the fact, you will have to make sure your JS code calls `PIE.attach(el)` for each new element that needs CSS3 styling. Calling attach for a particular element more than once is safe (PIE will ignore the call if the element has already been attached), so you don't need to worry about filtering out elements.

Also, if you remove elements from the page that had PIE attached, you will need to call `PIE.detach(el)` to clean up their CSS3 rendering.