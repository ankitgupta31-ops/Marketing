<?php
/**
 * Vridora Capital theme setup and asset loading.
 */

function vridora_capital_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
    register_nav_menus(array('primary' => __('Primary menu', 'vridora-capital')));
}
add_action('after_setup_theme', 'vridora_capital_setup');

function vridora_capital_assets() {
    wp_enqueue_style('vridora-google-fonts', 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap', array(), null);
    wp_enqueue_style('vridora-capital-style', get_stylesheet_uri(), array(), '1.0.0');
    wp_enqueue_script('vridora-capital-app', get_template_directory_uri() . '/assets/app.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'vridora_capital_assets');

function vridora_capital_menu_fallback() {
    echo '<a href="#products">Our loans</a><a href="#how-it-works">How it works</a><a href="#support">Support</a>';
}
