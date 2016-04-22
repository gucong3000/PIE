<?php

// This file is part of the Carrington JAM Theme for WordPress
// http://carringtontheme.com
//
// Copyright (c) 2008-2010 Crowd Favorite, Ltd. All rights reserved.
// http://crowdfavorite.com
//
// Released under the GPL license
// http://www.opensource.org/licenses/gpl-license.php
//
// **********************************************************************
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
// **********************************************************************

if (__FILE__ == $_SERVER['SCRIPT_FILENAME']) { die(); }
if (CFCT_DEBUG) { cfct_banner(__FILE__); }

?>
<!DOCTYPE html>

<html <?php language_attributes() ?>>
<head profile="http://gmpg.org/xfn/11">
	<meta http-equiv="content-type" content="<?php bloginfo('html_type') ?>; charset=<?php bloginfo('charset') ?>" />

	<title><?php wp_title( '-', true, 'right' ); echo wp_specialchars( get_bloginfo('name'), 1 ); ?></title>

    <!--[if lt IE 9]>
    <script>
        document.execCommand("BackgroundImageCache", false, true);
    </script>
    <![endif]-->
    <link rel="shortcut icon" href="<?php bloginfo( 'template_url') ?>/img/favicon.ico" />
	<?php wp_get_archives('type=monthly&format=link'); ?>
	
	<link rel="stylesheet" type="text/css" href="<?php bloginfo('template_url') ?>/css/common.css" />

    <!--[if lt IE 9]>
        <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

	<?php
	// Javascript for threaded comments
	// if ( is_singular() ) { wp_enqueue_script( 'comment-reply' ); } ?>
	
	<?php wp_head(); ?>


    <script type="text/javascript" 
src="http://ajax.useso.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>

    <?php
    global $post;
    if ($post) {
    $page_css_files = get_post_meta($post->ID, 'page_css_file', false);
    foreach( $page_css_files as $file ) {
        ?>
        <link rel='stylesheet' type='text/css' href='<?php echo $file; ?>' />
        <?php
    }

    $page_css = get_post_meta($post->ID, 'page_css', true);
    if( $page_css ) {
        echo "<style type='text/css'>$page_css</style>";
    }
    }
    ?>
</head>

<body <?php body_class(); ?>>
<div id="page">

    <header id="pageHeader">
        <a href="<?php bloginfo('url') ?>/" title="Home" rel="home">
            <img src="<?php bloginfo( 'template_url' ) ?>/img/logo.png" alt="CSS3 PIE" class="logo" />
        </a>

        <p class="tagline">Progressive Internet Explorer</p>

        <!--[if IE 8]><nav id="mainNav" class="ie8"><![endif]-->
        <![if !(IE 8)]><nav id="mainNav"><![endif]>
            <?php wp_nav_menu( array('menu' => 'Main Menu', 'container' => null )); ?>

            <p><a class="outbound" href="/download"><strong>Download</strong></a></p>

            <ul class="social">
                <li class="rss"><a href="http://css3pie.com/feed" title="RSS feed for the PIE blog">RSS feed for the PIE blog</a></li>
                <li class="twitter"><a href="http://twitter.com/css3pie" title="Follow @css3pie on Twitter">Follow @css3pie on Twitter</a></li>
            </ul>

        </nav>
        
    </header>

    <div id="pageContent">
