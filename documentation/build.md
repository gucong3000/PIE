# Building PIE From Source

This document describes how you can build PIE from the most recent source code. This is useful if you want to get a feature or bug fix which hasn't yet made it into a release package. It's also necessary if you want to make changes to the code yourself to try and fix a bug or implement a new feature. If you do so, please consider contributing your changes back to the main project so we can all benefit!

## Prerequisites

Building PIE is straightforward. You need to have the following tools installed:

1.  [Git](http://git-scm.com/), if you are going to be checking out the source from the Git repository
2.  [Java](http://java.com) runtime, version 6 or higher
3.  [Ant](http://ant.apache.org), for performing the build

Once these prerequisites are installed, perform the following steps:

## Get the source code

You have two options for getting the source:

1.  Check out the source using Git:
    ```
    git clone git://github.com/lojjic/PIE.git
    cd PIE
    ```
    If you want the 2.x beta branch (master) then you're done; if you want the 1.x stable branch then run:`git checkout 1.x`or:
2.  Download an archive of the source:  
    [http://github.com/lojjic/PIE/archives/master](http://github.com/lojjic/PIE/archives/master) (2.x beta branch)  
    [http://github.com/lojjic/PIE/archives/1.x](http://github.com/lojjic/PIE/archives/1.x) (1.x stable branch)

## Perform the build

From the root directory of your local copy of the source code, invoke the following command in the terminal:

`ant`

This will perform the build, creating a new directory named "build/". This directory will contain the following files:

*   PIE.htc
*   PIE_IE678.js
*   PIE_IE9.js
*   PIE_uncompressed.htc
*   PIE_IE678_uncompressed.js
*   PIE_IE9_uncompressed.js

To use these files, copy them together into a directory on your server, and reference PIE.htc (or PIE_uncompressed.htc for debugging) in a behavior property in your CSS. Or, if you want to use the PIE JS version then you can include the PIE_IEx.js files using script tags (see the [PIE JS](/documentation/pie-js/) documentation for details.)