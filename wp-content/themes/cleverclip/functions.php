<?php
/**
 * Cleanup.
 */
if (!is_admin()) {
  wp_deregister_script('jquery');
  wp_deregister_script('l10n');
}


function wp_head_cleanup() {
  remove_action('admin_print_scripts', 'print_emoji_detection_script');
  remove_action('admin_print_styles', 'print_emoji_styles');
  remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 );
  remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0);
  remove_action('wp_head', 'feed_links_extra', 3);
  remove_action('wp_head', 'feed_links', 2);
  remove_action('wp_head', 'index_rel_link');
  remove_action('wp_head', 'parent_post_rel_link', 10, 0);
  remove_action('wp_head', 'print_emoji_detection_script', 7);
  remove_action('wp_head', 'rel_canonical');
  remove_action('wp_head', 'rest_output_link_wp_head', 10);
  remove_action('wp_head', 'rsd_link');
  remove_action('wp_head', 'start_post_rel_link', 10, 0);
  remove_action('wp_head', 'wlwmanifest_link');
  remove_action('wp_head', 'wp_generator');
  remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
  remove_action('wp_head', 'wp_oembed_add_host_js');
  remove_action('wp_head', 'wp_resource_hints', 2);
  remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
  remove_action('wp_print_styles', 'print_emoji_styles');
}

if (!is_admin_bar_showing()) {
  add_action('after_setup_theme', 'wp_head_cleanup');
}

function disble_gutenberg_styles() {
  wp_dequeue_style('wp-block-library');
}

add_action('wp_enqueue_scripts', 'disble_gutenberg_styles', 100);



/**
 * Thumbnails.
 */
add_theme_support('post-thumbnails');

/**
 * Rendering.
 */
function render_style($name, $path) {
  if (preg_match('/^(\/\/|http)/', $path)) {
      wp_enqueue_style($name, $path);
  } else if (file_exists(get_template_directory() . $path)) {
      $hash = md5_file(get_template_directory() . $path);
      $path = get_template_directory_uri() . $path;

      wp_enqueue_style($name, $path, array(), $hash);
  } else {
      echo "<!-- Style {$name} not loaded -->";
  }
}

function render_script($name, $path) {
  if (preg_match('/^(\/\/|http)/', $path)) {
      wp_enqueue_script($name, $path);
  } else if (file_exists(get_template_directory() . $path)) {
      $hash = md5_file(get_template_directory() . $path);
      $path = get_template_directory_uri() . $path;

      wp_enqueue_script($name, $path, array(), $hash);
  } else {
      echo "<!-- Script {$name} not loaded -->";
  }
}

if (!is_admin()) {
  function add_asyncdefer_attribute($tag, $handle) {
    if (strpos($handle, 'async') !== false) {
      return str_replace( '<script ', '<script async ', $tag );
    } else if (strpos($handle, 'defer') !== false) {
      return str_replace( '<script ', '<script defer ', $tag );
    } else {
      return $tag;
    }
  }

  add_filter('script_loader_tag', 'add_asyncdefer_attribute', 10, 2);
}

/**
 * SVG.
 */
function enable_svg_support($mimes) {
  $mimes['svg'] = 'image/svg+xml';
  $mimes['json'] = 'application/json';

  return $mimes;
}

add_filter('upload_mimes', 'enable_svg_support');

/**
 * Custom Post Types.
 */
function create_cases() {
  register_post_type('case',
    array(
      'labels' => array(
        'name' => __('Cases'),
        'singular_name' => __('Case')
      ),
      'public' => true,
      'has_archive' => true,
      'rewrite' => array(
        'hierarchical' => true
      ),
      'supports' => array(
        'author',
        'editor',
        'excerpt',
        'thumbnail',
        'title'
      )
    )
  );

	register_taxonomy(
		'industry',
		'case',
		array(
			'label' => __('Industry'),
			'rewrite' => array('slug' => 'industry'),
			'hierarchical' => true,
		)
  );

  register_taxonomy(
		'service',
		'case',
		array(
			'label' => __('Service'),
			'hierarchical' => true,
		)
  );

  add_post_type_support('case', 'excerpt');
}

add_action('init', 'create_cases');

/**
 * Context.
 */
require_once 'utils/mobile-detect.php';

function add_to_context($data) {
  $detect = new Mobile_Detect;

  $data['isPhone'] = $detect->isMobile() && !$detect->isTablet();
  $data['isTablet'] = $detect->isTablet();
  $data['isDesktop'] = !$detect->isMobile() && !$detect->isTablet();

  $data['locale'] = explode('-', pll_current_language())[0];

  $data['locales'] = pll_the_languages(array(
    'echo' => 0,
    'raw' => 1
  ));

  return $data;
}

add_filter('timber_context', 'add_to_context');

/**
 * Global.
 */
if( function_exists('acf_add_options_page') ) {
  acf_add_options_page(array(
    'page_title'    => 'Global',
    'menu_title'    => 'Global',
    'menu_slug'     => 'global',
    'capability'    => 'edit_posts'
  ));

  acf_add_options_sub_page(array(
    'parent_slug'   => 'global',
    'page_title'    => '404',
    'menu_title'    => '404',
    'menu_slug'     => '404',
  ));

  acf_add_options_sub_page(array(
    'parent_slug'   => 'global',
    'page_title'    => 'Cookies',
    'menu_title'    => 'Cookies',
    'menu_slug'     => 'cookies',
  ));

  acf_add_options_sub_page(array(
    'parent_slug'   => 'global',
    'page_title'    => 'Menu',
    'menu_title'    => 'Menu',
    'menu_slug'     => 'menu',
  ));

  acf_add_options_sub_page(array(
    'parent_slug'   => 'global',
    'page_title'    => 'Footer',
    'menu_title'    => 'Footer',
    'menu_slug'     => 'footer',
  ));

  acf_add_options_sub_page(array(
    'parent_slug'   => 'global',
    'page_title'    => 'Cases',
    'menu_title'    => 'Cases',
    'menu_slug'     => 'cases',
  ));

  acf_add_options_sub_page(array(
    'parent_slug'   => 'global',
    'page_title'    => 'Questions',
    'menu_title'    => 'Questions',
    'menu_slug'     => 'questions',
  ));

  acf_add_options_sub_page(array(
    'parent_slug'   => 'global',
    'page_title'    => 'Logos',
    'menu_title'    => 'Logos',
    'menu_slug'     => 'logos',
  ));

  acf_add_options_sub_page(array(
    'parent_slug'   => 'global',
    'page_title'    => 'Forms',
    'menu_title'    => 'Forms',
    'menu_slug'     => 'forms',
  ));

  acf_add_options_sub_page(array(
    'parent_slug'   => 'global',
    'page_title'    => 'Maintenance',
    'menu_title'    => 'Maintenance',
    'menu_slug'     => 'maintenance',
  ));

  acf_add_options_sub_page(array(
    'parent_slug'   => 'global',
    'page_title'    => 'Other',
    'menu_title'    => 'Other',
    'menu_slug'     => 'other',
  ));

  add_filter('timber_context', 'acf_global');

  function acf_global($context) {
    $context['option'] = get_fields('option');

    function cmp($a, $b) {
      return strcmp($a['stars'], $b['stars']);
    }

    usort($context['option']['logos'], 'cmp');

    $context['option']['logos'] = array_reverse($context['option']['logos']);
    
    return $context;
  }
}

/**
 * Contact Form 7.
 */
add_filter('wpcf7_load_css', '__return_false');
add_filter('wpcf7_load_js', '__return_false');

//Insert ads after second paragraph of single post content.

add_filter( 'the_content', 'prefix_insert_post_ads' );
function prefix_insert_post_ads( $content ) {
 $ad_code =  do_shortcode('[elementor-template id="8097"]'); 
 if ( is_single() && ! is_admin() ) {
 return prefix_insert_after_paragraph( $ad_code, 12, $content );
 }
return $content;
}
 
// Parent Function that makes the magic happen
function prefix_insert_after_paragraph( $insertion, $paragraph_id, $content ) {
 $closing_p = '</p>';
 $paragraphs = explode( $closing_p, $content );
 foreach ($paragraphs as $index => $paragraph) {
 if ( trim( $paragraph ) ) {
 $paragraphs[$index] .= $closing_p;
 }
 if ( $paragraph_id == $index + 1 ) {
 $paragraphs[$index] .= $insertion;
 }
 }
 
 return implode( '', $paragraphs );
}

// Adding title support in theme

add_theme_support( 'title-tag' );
 add_theme_support( 'menus' );




// Filter hook to display reading time next to category

add_action('uael_single_post_after_terms', 'reading_time_cst');
add_action('uael_single_post_after_content_terms', 'reading_time_cst' );

function reading_time_cst() {
	
	echo do_shortcode('[rt_reading_time postfix="min read" postfix_singular="min read" ]') ;
	
}

// Filter hook to generate the correct hreflang tags
add_filter( 'pll_rel_hreflang_attributes', 'filter_pll_rel_hreflang_attributes', 10, 1 ); 

// Define the pll_rel_hreflang_attributes callback.
function filter_pll_rel_hreflang_attributes( $hreflangs ) {

	foreach ( $hreflangs as $lang => $url ) {
		if ( $lang === 'en' ) {
			printf( '<link rel="alternate" href="%s" hreflang="%s" /><!-- custom hreflang -->' . "\n", esc_url( $url ), esc_attr( 'en-CH' ) );
    }
    if ( $lang === 'de' ) {
			printf( '<link rel="alternate" href="%s" hreflang="%s" /><!-- custom hreflang -->' . "\n", esc_url( $url ), esc_attr( 'de-CH' ) );
    }
    if ( $lang === 'fr' ) {
			printf( '<link rel="alternate" href="%s" hreflang="%s" /><!-- custom hreflang -->' . "\n", esc_url( $url ), esc_attr( 'fr-CH' ) );
		}
	}

    return $hreflangs; 
};