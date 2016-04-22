# Getting Started

The following instructions should get you up and running with PIE in most circumstances. If you run into problems along the way, consult our [known issues](/documentation/known-issues/) page, or ask for help in the [forums](http://css3pie.com/forum).

## Step 1: Download it

[Download the PIE distribution](/download-latest) and unzip it somewhere.

## Step 2: Upload it

Upload the contents of the unzipped package to a directory on your web server. It doesn't matter where exactly, as long as you know where it is.

## Step 3: Write some CSS3

Assuming you already have a HTML document, let's say you want to give one of its elements rounded corners. Create a CSS rule for that element and give it a border-radius style like so:

```CSS
#myAwesomeElement {
    border: 1px solid #999;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
}
```

(Note the -webkit- and -moz- prefixed versions; these are necessary to make the rounded corners work in WebKit and Mozilla-based browsers.)

## Step 4: Apply PIE

In that same CSS rule, add the following style line:

`behavior: url(path/to/pie_files/PIE.htc);`

Of course you will need to adjust the path to match where you uploaded PIE.htc in step 2\. _Note: this path is relative to the HTML file being viewed, not the CSS file it is called from._

## Step 5: View it in IE

If all went well, at this point you should be able to load the page in IE and see the CSS3 rounded corners rendered just like other browsers. Now you can play around with some of the other supported CSS3 decorations like box-shadow. See the documentation on [supported CSS3 features](/documentation/supported-css3-features/) to see exactly what PIE can do. Have fun!