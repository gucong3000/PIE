"use strict";
var header = "PIE: CSS3 rendering for IE\nVersion 2.0beta2-SNAPSHOT\nhttp://css3pie.com\nDual-licensed for use under the Apache License Version 2.0 or the General Public License (GPL) Version 2.",
	gulp = require("gulp"),
	concat = require("gulp-concat"),
	wrapper = require("gulp-wrapper"),
	uglify = require("gulp-uglify"),
	build_dir = "./build/",
	src_dir = "./sources/",
	uglifyOpt = {
		//保留IE的jscript条件注释
		preserveComments: function(o, info) {
			return /@(cc_on|if|else|end|_jscript(_\w+)?)\s/i.test(info.value);
		},
		properties: true
	};

function concatJs(files, name) {
	var jsWrapper = wrapper({
		header: "/*\n" + header + "\n*/\n(function( win, doc ) {\n    var PIE = win[ 'PIE' ] || ( win[ 'PIE' ] = {} );\n",
		footer: "})( window, document );"
	});

	gulp.src(files.map(function(item, index) {
		return src_dir + item;
	}))
		.pipe(concat(name + "_uncompressed.js"))
		.pipe(jsWrapper)
		.pipe(gulp.dest(build_dir))
		.pipe(uglify(uglifyOpt))
		.pipe(concat(name + ".js"))
		.pipe(gulp.dest(build_dir));
}

function concatHtc(min) {
	uglifyOpt.predef = ["element"];
	var file = gulp.src(src_dir + "htc_script.js")
		.pipe(concat("PIE" + (min ? "" : "_uncompressed") + ".htc"));
	if (min) {
		file.pipe(uglify(uglifyOpt));
	}
	file.pipe(wrapper({
		header: "<!--\n" + header + "\n-->\n<PUBLIC:COMPONENT lightWeight=\"true\">\n<!-- saved from url=(0014)about:internet -->\n<PUBLIC:ATTACH EVENT=\"oncontentready\" FOR=\"element\" ONEVENT=\"init()\" />\n<PUBLIC:ATTACH EVENT=\"ondocumentready\" FOR=\"element\" ONEVENT=\"init()\" />\n<PUBLIC:ATTACH EVENT=\"ondetach\" FOR=\"element\" ONEVENT=\"cleanup()\" />\n<script type=\"text/javascript\">\n",
		footer: "\n</script>\n\n//# IE will sometimes hang for a long time on unload of pages with .htc behaviors\n//# attached to many elements, if the script block is a certain size. We can work\n//# around this by including an empty vbscript block at the end. For more details:\n//# http://www.pcreview.co.uk/forums/htc-components-512-bytes-javascript-slow-unload-t727396.html\n//# http://code.google.com/p/svgweb/source/browse/trunk/src/svg.htc\n<script type=\"text/vbscript\"></script>\n</PUBLIC:COMPONENT>"
	}));
	return file.pipe(gulp.dest(build_dir));
}

gulp.task("PIE_IE678", function() {
	concatJs(["PIE_open.js", "Util.js", "GradientUtil.js", "Observable.js", "Heartbeat.js", "OnUnload.js", "OnResize.js", "OnScroll.js", "OnPrint.js", "OnMouseup.js", "Length.js", "BgPosition.js", "BgSize.js", "Angle.js", "Color.js", "Tokenizer.js", "BoundsInfo.js", "StyleInfoBase.js", "BackgroundStyleInfo.js", "BorderStyleInfo.js", "BorderRadiusStyleInfo.js", "BorderImageStyleInfo.js", "BoxShadowStyleInfo.js", "PaddingStyleInfo.js", "VisibilityStyleInfo.js", "VmlShape.js", "RendererBase.js", "RendererBase_IE678.js", "RootRenderer.js", "BackgroundRenderer.js", "BorderRenderer.js", "BorderImageRenderer.js", "BoxShadowOutsetRenderer.js", "ImgRenderer.js", "Element.js", "PIE_API.js"], "PIE_IE678");
});

gulp.task("PIE_IE9", function() {
	concatJs(["PIE_open.js", "Util.js", "GradientUtil.js", "Observable.js", "Heartbeat.js", "OnUnload.js", "OnResize.js", "OnScroll.js", "OnMouseup.js", "Length.js", "BgPosition.js", "BgSize.js", "Angle.js", "Color.js", "Tokenizer.js", "BoundsInfo.js", "StyleInfoBase.js", "BackgroundStyleInfo.js", "BorderStyleInfo.js", "BorderImageStyleInfo.js", "PaddingStyleInfo.js", "RendererBase.js", "IE9RootRenderer.js", "IE9BackgroundRenderer.js", "IE9BorderImageRenderer.js", "Element.js", "PIE_API.js"], "PIE_IE9");
});

gulp.task("htc_sources", function() {
	concatHtc();
});
gulp.task("htc", function() {
	concatHtc(true);
});

gulp.task("default", ["PIE_IE678", "PIE_IE9", "htc", "htc_sources"]);