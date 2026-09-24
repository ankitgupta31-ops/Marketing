<?php
if (!defined('ABSPATH')) { exit; }
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?> id="top">
<?php wp_body_open(); ?>
<header class="site-header">
    <a class="brand" href="#top" aria-label="<?php bloginfo('name'); ?> home">
        <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
        <span><?php bloginfo('name'); ?> <b>Finance</b></span>
    </a>
    <nav class="main-nav" aria-label="Main navigation">
        <?php wp_nav_menu(array('theme_location' => 'primary', 'container' => false, 'fallback_cb' => 'vridora_capital_menu_fallback', 'items_wrap' => '%3$s')); ?>
    </nav>
    <div class="header-actions">
        <button class="language-toggle" type="button" data-language-toggle aria-label="Switch to Hindi">हिंदी</button>
        <a class="text-link" href="#pay">Pay EMI</a>
        <a class="button button-dark button-small" href="#apply">Apply now <span aria-hidden="true">↗</span></a>
    </div>
    <button class="menu-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
</header>
