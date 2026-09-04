<?php
/**
 * Saarthi Finance theme setup and asset loading.
 */

function saarthi_finance_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
    register_nav_menus(array('primary' => __('Primary menu', 'saarthi-finance')));
}
add_action('after_setup_theme', 'saarthi_finance_setup');

function saarthi_finance_assets() {
    wp_enqueue_style('saarthi-google-fonts', 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap', array(), null);
    wp_enqueue_style('saarthi-finance-style', get_stylesheet_uri(), array(), '1.0.0');
    wp_enqueue_script('saarthi-finance-app', get_template_directory_uri() . '/assets/app.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'saarthi_finance_assets');

function saarthi_finance_menu_fallback() {
    echo '<a href="#products">Our loans</a><a href="#how-it-works">How it works</a><a href="#support">Support</a>';
}
