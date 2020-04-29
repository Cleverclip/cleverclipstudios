<?php
/**
 * Include wpform functions
 */
include get_template_directory() . '/includes/wpforms.php';

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

  $data['isElementorEditPreview'] = (isset($_REQUEST['elementor-preview']) && !empty($_REQUEST['elementor-preview']));
  
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
  
  acf_add_options_sub_page(array(
      'parent_slug'   => 'global',
      'page_title'    => 'Templates',
      'menu_title'    => 'Templates',
      'menu_slug'     => 'templates',
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

// Filter hook to generate the correct hreflang tags
add_filter( 'pll_rel_hreflang_attributes', 'filter_pll_rel_hreflang_attributes', 10, 1 ); 

// Define the pll_rel_hreflang_attributes callback.
function filter_pll_rel_hreflang_attributes( $hreflangs ) {

	foreach ( $hreflangs as $lang => $url ) {
	    
        if ( $lang === 'en' ) {
            $hreflangs['en-CH'] = $url;
        }
        
        if ( $lang === 'de' ) {
            $hreflangs['de-CH'] = $url;
        }
        
        if ( $lang === 'fr' ) {
            $hreflangs['fr-CH'] = $url;
		}
    }

    return $hreflangs; 
};


// Filter hook to display reading time next to category

add_action('uael_single_post_after_terms', 'reading_time_cst');
add_action('uael_single_post_after_content_terms', 'reading_time_cst' );

function reading_time_cst() {
	
	echo do_shortcode('[rt_reading_time postfix="min read" postfix_singular="min read" ]') ;
	
}

/**
 * Check if AMP plugin is active and then add cleverclip AMP features
 *
 * @author Umad Javed
 */
if(in_array('accelerated-mobile-pages/accelerated-moblie-pages.php', apply_filters('active_plugins', get_option('active_plugins')))){
    
    /**
     * Add missing social media profile option
     *
     * @author Umad Javed
     */
    function cleverclip_redux_builder_amp_social($social_options) {
        
        $option = array(
            'id'       => 'enbl-vimeo',
            'type'     => 'switch',
            'title'    => esc_html__('Vimeo', 'accelerated-mobile-pages'),
            'default'  => 0,
            'required' => array(
                array('menu-social', '=' ,1)
            )
        );
        $social_options['fields'][] = $option;
        
        $option = array(
            'id'       => 'enbl-vimeo-prfl-url',
            'type'     => 'text',
            'title'    => esc_html__('Vimeo URL', 'accelerated-mobile-pages'),
            'default'  => '#',
            'required' => array(
                array('enbl-vimeo','=',1)
            )
        );
        $social_options['fields'][] = $option;
        
        return $social_options;
    }
    add_filter('redux/options/redux_builder_amp/section/amp-social', 'cleverclip_redux_builder_amp_social');
    
    /**
     * Add extra widget option for AMP
     */
    add_action('init', 'cleverclip_ampforwp_add_widget_support', 11);
    function cleverclip_ampforwp_add_widget_support() {
        if (function_exists('register_sidebar')) {
            
            register_sidebar(array(
                'name' 			=> esc_html__( 'AMP Widget Above Inside Footer', 'accelerated-mobile-pages' ),
                'id'   			=> 'ampforwp-above-inside-footer',
                'description'   => esc_html__( 'This Widget will be display on Above but inside Footer area', 'accelerated-mobile-pages' ),
                'class'=>'w-bl',
                'before_widget' => '<div class="w-bl">',
                'after_widget' => '</div>',
                'before_title'  => '<h2>',
                'after_title'   => '</h2>'
            ));
            
            register_sidebar(array(
                'name' 			=> esc_html__( 'AMP Widget Above Related Post', 'accelerated-mobile-pages' ),
                'id'   			=> 'ampforwp-above-related_post',
                'description'   => esc_html__( 'This Widget will be display on Above but inside Footer area', 'accelerated-mobile-pages' ),
                'class'=>'w-bl',
                'before_widget' => '<div class="w-bl">',
                'after_widget' => '</div>',
                'before_title'  => '<h2>',
                'after_title'   => '</h2>'
            ));
            
        }
    }
    
    add_action ('ampforwp_above_related_post', 'cleverclip_ampforwp_content_above_relate_post', 11);
    function cleverclip_ampforwp_content_above_relate_post() {
        if (function_exists('dynamic_sidebar')) {
            dynamic_sidebar('ampforwp-above-related_post');
        }
    }
    
    /**
     * Register amp widgets
     */
    function cleverclip_register_amp_widgets() {
        
        register_widget( 'cp_amp_social_profile_widget' );
        register_widget( 'cp_amp_language_widget' );
        
    }
    
    /**
     * Add AMP widget for social media profile
     */
    add_action( 'widgets_init', 'cleverclip_register_amp_widgets' );
    
    class cp_amp_social_profile_widget extends WP_Widget {
        
        function __construct() {
            
            parent::__construct(
                
                // widget ID
                'cp_amp_social_profile_widget',
                
                // widget name
                __('AMP Social Profiles', ' Cleverclip'),
                
                // widget description
                array( 'description' => __( 'Add social media profiles from AMP for WP plugin', 'cp_amp_social_profile_widget' ), )
                
                );
            
        }
        
        public function widget( $args, $instance ) {
            
            if ( function_exists( 'ampforwp_is_amp_endpoint' ) && ampforwp_is_amp_endpoint() ) {
                
                global $redux_builder_amp;
                
                $title = apply_filters( 'widget_title', $instance['title'] );
                
                $args['before_widget'] = preg_replace( '/(?<=\sclass=["\'])/', 'cp_amp_social_profile_widget ', $args['before_widget'] );
                
                echo $args['before_widget'];
                
                //if title is present
                if ( ! empty( $title ) ) {
                    echo $args['before_title'] . $title . $args['after_title'];
                }
                
                echo '<div class="cp_amp_social_profile_widget_content">';
                
                if ( true == $redux_builder_amp['menu-social'] ) { ?>
<div class="m-s-i">
  <ul>
    <?php if($redux_builder_amp['enbl-fb']){?>
    <li>
      <a title="facebook" class="s_fb" target="_blank"
        href="<?php echo esc_url($redux_builder_amp['enbl-fb-prfl-url']); ?>"></a>
    </li>
    <?php } ?>
    <?php if($redux_builder_amp['enbl-tw']){?>
    <li>
      <a title="twitter" class="s_tw" target="_blank"
        href="<?php echo esc_url($redux_builder_amp['enbl-tw-prfl-url']); ?>">
      </a>
    </li>
    <?php } ?>
    <?php if($redux_builder_amp['enbl-gol']){?>
    <li>
      <a title="google plus" class="s_gp" target="_blank"
        href="<?php echo esc_url($redux_builder_amp['enbl-gol-prfl-url']); ?>"></a>
    </li>
    <?php } ?>
    <?php if($redux_builder_amp['enbl-lk']){?>
    <li>
      <a title="linkedin" class="s_lk" target="_blank"
        href="<?php echo esc_url($redux_builder_amp['enbl-lk-prfl-url']); ?>"></a>
    </li>
    <?php } ?>
    <?php if($redux_builder_amp['enbl-pt']){?>
    <li>
      <a title="pinterest" class="s_pt" target="_blank"
        href="<?php echo esc_url($redux_builder_amp['enbl-pt-prfl-url']); ?>"></a>
    </li>
    <?php } ?>
    <?php if($redux_builder_amp['enbl-yt']){?>
    <li>
      <a title="youtube" class="s_yt" target="_blank"
        href="<?php echo esc_url($redux_builder_amp['enbl-yt-prfl-url']); ?>"></a>
    </li>
    <?php } ?>
    <?php if($redux_builder_amp['enbl-inst']){?>
    <li>
      <a title="instagram" class="s_inst" target="_blank"
        href="<?php echo esc_url($redux_builder_amp['enbl-inst-prfl-url']); ?>"></a>
    </li>
    <?php } ?>
    <?php if($redux_builder_amp['enbl-vk']){?>
    <li>
      <a title="vkontakte" class="s_vk" target="_blank"
        href="<?php echo esc_url($redux_builder_amp['enbl-vk-prfl-url']); ?>"></a>
    </li>
    <?php } ?>
    <?php if($redux_builder_amp['enbl-rd']){?>
    <li>
      <a title="reddit" class="s_rd" target="_blank"
        href="<?php echo esc_url($redux_builder_amp['enbl-rd-prfl-url']); ?>"></a>
    </li>
    <?php } ?>
    <?php if($redux_builder_amp['enbl-tbl']){?>
    <li>
      <a title="tumblr" class="s_tbl" target="_blank"
        href="<?php echo esc_url($redux_builder_amp['enbl-tbl-prfl-url']); ?>"></a>
    </li>
    <?php } ?>
    <?php if(ampforwp_get_setting('enbl-telegram')){?>
    <li>
      <a title="telegram" class="s_telegram" target="_blank" <?php ampforwp_nofollow_social_links(); ?>
        href="<?php echo esc_url(ampforwp_get_setting('enbl-telegram-prfl-url')); ?>">
        <amp-img
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM6c2VyaWY9Imh0dHA6Ly93d3cuc2VyaWYuY29tLyIgc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxLjQxNDIxOyI+PHBhdGggaWQ9InRlbGVncmFtLTEiIGQ9Ik0xOC4zODQsMjIuNzc5YzAuMzIyLDAuMjI4IDAuNzM3LDAuMjg1IDEuMTA3LDAuMTQ1YzAuMzcsLTAuMTQxIDAuNjQyLC0wLjQ1NyAwLjcyNCwtMC44NGMwLjg2OSwtNC4wODQgMi45NzcsLTE0LjQyMSAzLjc2OCwtMTguMTM2YzAuMDYsLTAuMjggLTAuMDQsLTAuNTcxIC0wLjI2LC0wLjc1OGMtMC4yMiwtMC4xODcgLTAuNTI1LC0wLjI0MSAtMC43OTcsLTAuMTRjLTQuMTkzLDEuNTUyIC0xNy4xMDYsNi4zOTcgLTIyLjM4NCw4LjM1Yy0wLjMzNSwwLjEyNCAtMC41NTMsMC40NDYgLTAuNTQyLDAuNzk5YzAuMDEyLDAuMzU0IDAuMjUsMC42NjEgMC41OTMsMC43NjRjMi4zNjcsMC43MDggNS40NzQsMS42OTMgNS40NzQsMS42OTNjMCwwIDEuNDUyLDQuMzg1IDIuMjA5LDYuNjE1YzAuMDk1LDAuMjggMC4zMTQsMC41IDAuNjAzLDAuNTc2YzAuMjg4LDAuMDc1IDAuNTk2LC0wLjAwNCAwLjgxMSwtMC4yMDdjMS4yMTYsLTEuMTQ4IDMuMDk2LC0yLjkyMyAzLjA5NiwtMi45MjNjMCwwIDMuNTcyLDIuNjE5IDUuNTk4LDQuMDYyWm0tMTEuMDEsLTguNjc3bDEuNjc5LDUuNTM4bDAuMzczLC0zLjUwN2MwLDAgNi40ODcsLTUuODUxIDEwLjE4NSwtOS4xODZjMC4xMDgsLTAuMDk4IDAuMTIzLC0wLjI2MiAwLjAzMywtMC4zNzdjLTAuMDg5LC0wLjExNSAtMC4yNTMsLTAuMTQyIC0wLjM3NiwtMC4wNjRjLTQuMjg2LDIuNzM3IC0xMS44OTQsNy41OTYgLTExLjg5NCw3LjU5NloiLz48L3N2Zz4="
          width="16" height="16"></amp-img>
      </a>
    </li>
    <?php } ?>
    <?php if($redux_builder_amp['enbl-vimeo']){?>
    <li>
      <a title="vimeo" class="s_vimeo" target="_blank"
        href="<?php echo esc_url($redux_builder_amp['enbl-vimeo-prfl-url']); ?>"></a>
    </li>
    <?php } ?>
  </ul>
</div>
<?php }
                
                echo '</div>'; 
                
                echo $args['after_widget'];
            }       
        }
        
        public function form( $instance ) {
            
            if ( isset( $instance[ 'title' ] ) ) {
                $title = $instance[ 'title' ];
            }         
        ?>

<p>

  <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label>

  <input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>"
    name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />

</p>

<?php
        
        }

        public function update( $new_instance, $old_instance ) {
        
            $instance = array();
            
            $instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
            
            return $instance;
        
        }
    }
    
    /**
     * Add AMP widget for language switcher
     */
    class cp_amp_language_widget extends WP_Widget {
        
        function __construct() {
            
            parent::__construct(
                
                // widget ID
                'cp_amp_language_widget',
                
                // widget name
                __('AMP Language Switcher', ' Cleverclip'),
                
                // widget description
                array( 'description' => __( 'Add Language switcher for AMP for WP plugin', 'cp_amp_social_profile_widget' ), )
                
                );
            
        }
        
        public function widget( $args, $instance ) {
            
            if ( function_exists( 'ampforwp_is_amp_endpoint' ) && ampforwp_is_amp_endpoint() ) {
                
                global $redux_builder_amp;
                
                
                $args['before_widget'] = preg_replace( '/(?<=\sclass=["\'])/', 'cp_amp_language_widget ', $args['before_widget'] );

                // Sets a unique id for dropdown
                $instance['dropdown'] = $args['widget_id'];
                $name = 'lang_choice_' . $instance['dropdown'];
                
                $translations = pll_the_languages(array('raw'=>1));
                
                if ( $translations ) {
                    $title = empty( $instance['title'] ) ? '' : $instance['title'];
                    /** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
                    $title = apply_filters( 'widget_title', $title, $instance, $this->id_base );
                    
                    echo $args['before_widget']; // phpcs:ignore WordPress.Security.EscapeOutput
                    if ( $title ) {
                        echo $args['before_title'] . $title . $args['after_title']; // phpcs:ignore WordPress.Security.EscapeOutput
                    }
                    
                    echo '<div class="cp_amp_language_widget_content">';
                    ?>

<div class="footer__menu__language__group">
  <svg class="footer__menu__language__group__icon" viewBox="0 0 30 30">
    <path
      d="M13.599 20.2L14.599 18.8L15.499 18.3L15.299 17.5L13.499 15.8C13.499 15.8 13.399 15.3 12.999 14.9C12.799 14.7 10.699 13.7 9.99902 13.4C9.89902 13.3 9.79902 13.3 9.59902 13.3L8.49902 13.2C8.29902 13.2 8.09902 13.1 7.99902 13L6.39902 11.8C6.29902 11.8 6.29902 11.7 6.19902 11.6L5.09902 10.3C4.79902 9.99998 4.79902 9.49998 5.09902 9.09998L5.39902 8.69998C5.59902 8.59998 5.99902 8.49998 6.39902 8.59998L7.69902 8.99998C7.89902 8.99998 7.99902 9.09998 8.19902 9.19998L9.19902 10.3L10.099 9.69998L10.599 8.19998C10.599 8.09998 10.699 7.99998 10.699 7.99998C10.999 7.59998 11.799 6.39998 12.099 5.79998C12.099 5.79998 13.299 3.69998 10.899 1.79998C10.699 1.59998 10.299 1.59998 9.99902 1.59998C5.59902 2.89998 2.09902 6.59998 1.19902 11.2C1.09902 11.7 1.49902 12.2 1.99902 12.3C2.39902 12.4 2.79902 12.4 2.89902 12.5C2.99902 12.5 2.99902 12.5 3.09902 12.6L4.69902 13.3C5.09902 13.5 5.29902 13.8 5.29902 14.2V15.2L4.29902 16.1L4.19902 18.5C4.19902 18.7 4.29902 18.9 4.39902 19.1L5.49902 20.6C5.59902 20.7 5.59902 20.8 5.69902 20.8L6.69902 21.4C6.99902 21.6 7.09902 21.9 7.09902 22.2C7.09902 22.6 7.09902 23.3 7.09902 23.7C7.09902 24.1 7.29902 24.4 7.59902 24.6C8.19902 24.9 8.79902 25.2 9.39902 25.4C9.79902 25.5 10.299 25.4 10.499 25C10.899 24.4 11.299 23.7 11.299 23.7L13.599 20.2Z"
      fill="currentColor"></path>
    <path
      d="M20.9996 8.5L22.3996 7.1C22.4996 7 22.6996 6.9 22.8996 6.8C23.0996 6.7 23.4996 6.7 23.8996 6.6C24.6996 6.6 24.9996 5.6 24.3996 5C23.3996 4 22.2996 3.1 20.9996 2.5C20.8996 3 20.3996 3.8 20.3996 3.8L18.3996 5C18.1996 5.1 17.9996 5.3 17.9996 5.6L17.6996 6.6C17.5996 6.8 17.6996 7.1 17.7996 7.3L18.1996 8.1C18.2996 8.4 18.5996 8.6 18.8996 8.6L20.0996 8.8C20.4996 8.8 20.7996 8.7 20.9996 8.5Z"
      fill="currentColor"></path>
    <path
      d="M22.2 11.6L20.2 14.7C20.1 14.8 20.1 15 20.1 15.1L20 16.4C20 16.6 20 16.8 20.1 16.9L21.7 19.8C21.9 20.1 22.2 20.3 22.5 20.3L26.1 20.6C26.5 20.6 26.9 20.4 27.1 20C27.6 18.6 28.7 15.2 28.4 13.2C28.3 12.5 28.2 11.8 28 11.1C27.9 10.7 27.4 10.4 27 10.4C25.4 10.5 23.6 11 22.8 11.2C22.5 11.2 22.3 11.4 22.2 11.6Z"
      fill="currentColor"></path>
    <path
      d="M14.4996 28.4C22.1764 28.4 28.3996 22.1767 28.3996 14.5C28.3996 6.82322 22.1764 0.599976 14.4996 0.599976C6.82285 0.599976 0.599609 6.82322 0.599609 14.5C0.599609 22.1767 6.82285 28.4 14.4996 28.4Z"
      fill="none" stroke="currentColor" stroke-width="1.3643"></path>
  </svg>
  <span class="footer__menu__language__group__text"> Country </span>
  <select class="footer__menu__language__group__select">
    <option>Switzerland</option>
  </select>
</div>
<div class="footer__menu__language__group">
  <svg class="footer__menu__language__group__icon" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.9444 10.5778C13.0067 10.5778 13.0378 10.5778 13.1 10.5467C13.2556 10.4533 13.3178 10.2667 13.2244 10.1111L9.49111 3.26667C9.49111 3.26667 9.49111 3.26667 9.46 3.23556C9.46 3.20444 9.42889 3.20444 9.42889 3.17333C9.42889 3.17333 9.39778 3.14222 9.36667 3.14222C9.36667 3.14222 9.36667 3.14222 9.33556 3.11111H9.30444C9.27333 3.11111 9.27333 3.11111 9.24222 3.08C9.21111 3.08 9.21111 3.08 9.18 3.08C9.14889 3.08 9.14889 3.08 9.11778 3.08C9.08667 3.08 9.08667 3.08 9.05556 3.11111H9.02444C9.02444 3.11111 9.02444 3.11111 8.99333 3.14222L8.96222 3.17333C8.96222 3.17333 8.93111 3.20444 8.93111 3.23556C8.93111 3.23556 8.93111 3.23556 8.9 3.26667L5.16667 10.1111C5.07333 10.2667 5.13556 10.4533 5.29111 10.5467C5.38444 10.5778 5.41556 10.5778 5.47778 10.5778C5.57111 10.5778 5.69556 10.5156 5.75778 10.4222L7.18889 7.77778H11.2333L12.6644 10.4222C12.7267 10.5156 12.8511 10.5778 12.9444 10.5778ZM7.53111 7.15556L9.21111 4.07556L10.8911 7.15556H7.53111ZM26.9444 11.5111H17.9222V1.55556C17.9222 0.684444 17.2378 0 16.3667 0H2.05556C1.18444 0 0.5 0.684444 0.5 1.55556V12.1333C0.5 13.0044 1.18444 13.6889 2.05556 13.6889H3.92222V16.1778C3.92222 16.3022 3.98444 16.4267 4.10889 16.4578C4.14 16.4578 4.20222 16.4889 4.23333 16.4889C4.29556 16.4889 4.38889 16.4578 4.45111 16.3956L7.25111 13.6889H11.0778V23.6444C11.0778 24.5156 11.7622 25.2 12.6333 25.2H21.7489L24.5489 27.9067C24.6111 27.9689 24.7044 28 24.7667 28C24.7978 28 24.86 28 24.8911 27.9689C25.0156 27.9067 25.0778 27.8133 25.0778 27.6889V25.2H26.9444C27.8156 25.2 28.5 24.5156 28.5 23.6444V13.0667C28.5 12.1956 27.8156 11.5111 26.9444 11.5111ZM11.0778 13.0667H7.12667C7.03333 13.0667 6.97111 13.0978 6.90889 13.16L4.54444 15.4311V13.3778C4.54444 13.2222 4.38889 13.0667 4.23333 13.0667H2.05556C1.52667 13.0667 1.12222 12.6311 1.12222 12.1333V1.55556C1.12222 1.02667 1.52667 0.622222 2.05556 0.622222H16.3667C16.8956 0.622222 17.3 1.02667 17.3 1.55556V11.5111H12.6333C11.7622 11.5111 11.0778 12.1956 11.0778 13.0667ZM27.8778 23.6444C27.8778 24.1422 27.4733 24.5778 26.9444 24.5778H24.7667C24.6111 24.5778 24.4556 24.7333 24.4556 24.8889V26.9422L22.0911 24.64C22.0289 24.6089 21.9667 24.5778 21.8733 24.5778H12.6333C12.1044 24.5778 11.7 24.1422 11.7 23.6444V13.0667C11.7 12.5378 12.1044 12.1333 12.6333 12.1333H26.9444C27.4733 12.1333 27.8778 12.5378 27.8778 13.0667V23.6444ZM23.5222 16.1778H20.1V14.9333C20.1 14.7778 19.9444 14.6222 19.7889 14.6222C19.6333 14.6222 19.4778 14.7778 19.4778 14.9333V16.1778H16.0556C15.9 16.1778 15.7444 16.3333 15.7444 16.4889C15.7444 16.6444 15.9 16.8 16.0556 16.8H18.14C18.2333 17.3289 18.5444 18.48 19.3844 19.6311C18.7 20.3778 17.7044 21.0933 16.2733 21.4978C16.1178 21.5289 16.0244 21.7156 16.0556 21.8711C16.0867 21.9956 16.2111 22.0889 16.3667 22.0889C16.3978 22.0889 16.4289 22.0889 16.46 22.0889C17.9844 21.6533 19.0422 20.9067 19.7889 20.0978C20.5356 20.9067 21.5933 21.6533 23.1178 22.0889C23.1489 22.0889 23.18 22.0889 23.2111 22.0889C23.3356 22.0889 23.46 21.9956 23.5222 21.8711C23.5533 21.7156 23.46 21.5289 23.3044 21.4978C21.8422 21.0933 20.8778 20.3778 20.1933 19.6311C21.0333 18.48 21.3444 17.3289 21.4378 16.8H23.5222C23.6778 16.8 23.8333 16.6444 23.8333 16.4889C23.8333 16.3333 23.6778 16.1778 23.5222 16.1778ZM19.7889 19.1333C19.1356 18.2 18.8556 17.2978 18.7933 16.8H20.8156C20.7222 17.2667 20.4422 18.2 19.7889 19.1333Z"
      fill="currentColor"></path>
  </svg>
  <span class="footer__menu__language__group__text"> Language </span>

  <?php 
                    	echo '<select class="footer__menu__language__group__select" on="change:AMP.navigateTo(url=event.value)">';
                    	foreach ($translations as $key => $lang) {
                    	    
                    	    $url = $lang['url'];
                    	    $selected = '';
                    	    
                    	    if ( function_exists('ampforwp_end_point_controller')) {
                    	        $url = ampforwp_end_point_controller( $lang['url'] );
                    	    }
                    	    
                    	    if ($lang['current_lang']) {
                    	        $selected = 'selected';
                    	    }
                    	    
                    	    echo '<option value="'.$url.'" '.$selected.'>'.$lang['name'].'</option>';
                    	}
                    	echo '</select>';
                    	?>

</div>

<?php 
                    echo '</div>'; 
                    echo $args['after_widget']; // phpcs:ignore WordPress.Security.EscapeOutput
                }

                echo $args['after_widget'];
            }       
        }
        
        public function form( $instance ) {
            
            if ( isset( $instance[ 'title' ] ) ) {
                $title = $instance[ 'title' ];
            }         
        ?>

<p>

  <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label>

  <input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>"
    name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />

</p>

<?php
        
        }

        public function update( $new_instance, $old_instance ) {
        
            $instance = array();
            
            $instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
            
            return $instance;
        
        }
    }
    
    /**
     * Get post title for cleverclip posts
     * 
     * @author Umad Javed
     */
    function cp_amp_title(){
        global $redux_builder_amp, $post;
        $ID = '';
        if( ampforwp_is_front_page() && ampforwp_get_frontpage_id() ){
            if( $redux_builder_amp['ampforwp-title-on-front-page'] ) {
                $ID = ampforwp_get_frontpage_id();
            }
        }
        elseif ( ampforwp_polylang_front_page() ) {
            $ID = pll_get_post(get_option('page_on_front'));
        }
        else
        {
            $ID = $post->ID;
        }
        
        if( $ID!=null ){
            do_action('ampforwp_above_the_title');
            $ampforwp_title = get_the_title($ID);
            $ampforwp_title =  apply_filters('ampforwp_filter_single_title', $ampforwp_title);
            if(!empty($ampforwp_title)){
             ?>
<h1 class="amp-post-title"><?php echo wp_kses_data( $ampforwp_title ); ?></h1>
<?php
    		}else{?>
<h2 class="amp-post-title"><?php echo wp_kses_data( $ampforwp_title ); ?></h2>
<?php }
            do_action('ampforwp_below_the_title');
        }
    }
    
    /**
     * Modified default function 'amp_categories_list' of send primary or all categoreis
     * @param string $separator
     * @param boolean $show_all
     * 
     * @author Umad Javed
     */
    function cp_amp_categories_list( $separator = '', $show_all = false ){
        global $loadComponent;
        
        if(isset($loadComponent['AMP-categories-tags']) && $loadComponent['AMP-categories-tags']==true){
            
            global $post, $redux_builder_amp;
            $ampforwp_categories = array();
            $success = false;
            
            $all_cats = get_the_terms( $post->ID, 'category' );
            
            if (!$show_all) {
                
                if (class_exists('WPSEO_Primary_Term')){
                    // Show Primary category by Yoast if it is enabled & set
                    $wpseo_primary_term = new WPSEO_Primary_Term( 'category', $post->ID );
                    $primary_term = get_term($wpseo_primary_term->get_primary_term());
                    
                    if (!is_wp_error($primary_term)){
                        
                        if (!empty($all_cats)) {
                                
                                foreach ($all_cats as $cat) {
                                    if ($cat->term_id == $primary_term->term_id) {
                                        $ampforwp_categories[] = $cat;
                                        $success = true;
                                        break;
                                    } 
                                }
                        }
                    }
                } 
                
                if (!$success) {
                    $ampforwp_categories[] = $all_cats[0];
                }

            } else {
                $ampforwp_categories = $all_cats;
            }
            
            if(ampforwp_get_setting('ampforwp-cats-single') == '1'){
                if ( $ampforwp_categories ) : ?>
<div class="amp-category">
  <span><?php echo esc_html(ampforwp_translation($redux_builder_amp['amp-translator-categories-text'], 'Categories' )); ?></span>
  <?php 
            				$anchorTag = $anchorClose = '';
            				foreach ($ampforwp_categories as $key=>$cat ) {
            					$term_id   = $cat->term_id;
            				    $term_name   = $cat->name;
            				    if( true == ampforwp_get_setting('ampforwp-cats-tags-links-single') ){
            							$url   = get_category_link( $cat->term_id );
            							if( true == ampforwp_get_setting('ampforwp-archive-support') && true == ampforwp_get_setting('ampforwp-archive-support-cat')){
            								$url = ampforwp_url_controller($url);
            							}
            							$anchorTag = '<a href="'.esc_url($url).'" title="'.esc_html($term_name).'">';
            							$anchorClose = "</a>";
            							echo ('<span class="amp-cat amp-cat-'.esc_attr($term_id).'">'.$anchorTag.esc_html($term_name).$anchorClose.'</span>');
            					}else{
            						echo ('<span class="amp-cat"> '.esc_html($term_name).'</span>');
            					}
            					
            					if(!empty($separator) && count($ampforwp_categories)-1 > $key){
            							echo esc_html($separator);
            						}	
            			} ?>
</div>
<?php endif; 
            }
            
        }
    }
    
    function cp_amp_rt_reading_time() {
        echo do_shortcode('[rt_reading_time postfix="min read" postfix_singular="min read" ]') ;
    }
    
    function cp_ampforwp_get_relatedpost_content($argsdata=array()){
        global $redux_builder_amp;
        $title = get_the_title();
        $related_post_permalink = ampforwp_url_controller( get_permalink() );
        if ( ampforwp_get_setting('ampforwp-single-related-posts-link') ) {
            $related_post_permalink = get_permalink();
            if ( ampforwp_get_setting('amp-mobile-redirection') ) {
                $related_post_permalink = add_query_arg('nonamp','1',$related_post_permalink);
            }
        }
        ?>
<div class="related_link">
  <?php 
    		cp_amp_categories_list();
    		cp_amp_rt_reading_time();
    		?>
  <p class="amp-related-post-title"><a href="<?php echo esc_url( $related_post_permalink ); ?>"
      title="<?php echo esc_html( $title ); ?>"><?php the_title(); ?></a></p>
  <?php

            $show_excerpt = (isset($argsdata['show_excerpt'])? $argsdata['show_excerpt'] : true);
            if($show_excerpt){
                 if(has_excerpt()){
    					$content = get_the_excerpt();
    				}else{
    					$content = get_the_content();
    				}
    		?><p><?php $excerpt_length = ampforwp_get_setting('enable-excerpt-single-related-posts');
    		if(empty($excerpt_length)){
    			$excerpt_length = 15;
    		}
    		if (true == ampforwp_get_setting('excerpt-option-rp-read-more')){
    				$content .= '...';
    		}
    		echo wp_trim_words( strip_shortcodes( $content ) , $excerpt_length ); 
    		?>
    <?php if (true == ampforwp_get_setting('excerpt-option-rp-read-more')){?>
    <a class="readmore-rp"
      href="<?php echo esc_url( $related_post_permalink ); ?>"><?php echo ampforwp_translation(ampforwp_get_setting('amp-translator-read-more'),'Read More') ?></a>
  </p>
  <?php
    		} }
    		$show_author = (isset($argsdata['show_author'])? $argsdata['show_author'] : true);
    		if($show_author){
    			$author_args = isset($argsdata['author_args'])? $argsdata['author_args'] : array();
    			ampforwp_framework_get_author_box($author_args);
    		} ?>
</div>
<?php }
    
    /**
     * Remove meta_query 'ampforwp-amp-on-off' on related post args
     *
     * @param $args
     *
     * @author Umad Javed
     */
    function cp_ampforwp_component_related_post_args($args) {
        
        if (isset($args['meta_query']) && is_array($args['meta_query'])) {
            foreach ($args['meta_query'] as $key => $value ) {
                if (isset($value['key']) && $value['key'] == 'ampforwp-amp-on-off') {
                    unset($args['meta_query'][$key]);
                }
            }
        }
        
        return $args;
    }
    add_filter('ampforwp_component_related_post_args', 'cp_ampforwp_component_related_post_args');
}

/**
 * For the category archive pages, add the current archive page into the query of Posts widget of Ultimate Elementor
 * It will check if the page is category archive and query type is 'custom' with filters turned off.
 *
 * For correct working category filter must be empty in Posts widget of Ultimate Elementor
 *
 * @author Umad Javed
 *
 */
add_filter('uael_posts_query_args', function ($query_args, $settings) {
    
    if (is_archive()
        && is_category()
        && $query_args['post_type'] == 'post'
        && $settings['query_type'] == 'custom'
        && ($settings['classic_show_filters'] == 'no' || $settings['classic_show_filters'] == '')) {
            
            $category = get_queried_object();
            
            $query_args['tax_query'][] = array(
                'taxonomy' => 'category',
                'field'    => 'term_id',
                'terms'    => array($category->term_id),
                'operator' => 'IN',
            );
        }
        
        return $query_args;
}, 10, 2);
    
/**
 * On individual category page, each post must have that category to display.
 *
 * @author Umad Javed
 */
add_filter('uael_posts_tax_filter', function ($terms) {
    
    if (is_archive()
        && is_category()
        && count($terms) == 1) {
            
            $category = get_queried_object();
            
            if ($terms[0]->term_id != $category->term_id) {
                $terms[0] = $category;
                
            }
        }
        
        return $terms;
});

/**
 * Shortcode to get the current page url for elementor field or can be use elsewhere.
 *
 * @author Umad Javed
 */
add_shortcode ('web_url', 'get_current_web_page_url');

if (! function_exists('get_current_web_page_url')) {
    function get_current_web_page_url() {
        global $wp;
        return home_url( add_query_arg( array(), $wp->request ) );
    }
}

/**
 * Add Media XMLNS
 */
function add_feed_media_ns() {
    echo 'xmlns:media="http://search.yahoo.com/mrss/"';
}
add_action('rss2_ns', 'add_feed_media_ns');

/**
 * Add feature image to RSS feed.
 *
 * @author Umad Javed
 * @param string $content
 * @return string
 */
function add_image_media_to_feed() {
    global $post;
        
    if (has_post_thumbnail($post->ID)) {
        
        $post_thumbnail = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID));
        
        if ($post_thumbnail && is_array($post_thumbnail)) {
            $thumbnail = '<media:content medium="image" url="'.$post_thumbnail[0].'" width="'.$post_thumbnail[1].'" height="'.$post_thumbnail[2].'" />';
            echo $thumbnail;
        }
    }
}
add_action('rss2_item', 'add_image_media_to_feed');

/**
 * Trickly override the main query for blog feed to show blog item on languaged blog page
 * 
 * @author Umad Javed
 */
function override_main_query_for_blog_page($query_obj){
    if ($query_obj->is_feed && $query_obj->is_home && $query_obj->is_posts_page) {
        $query_obj->is_comment_feed = false;
    }
}

add_action('parse_query', 'override_main_query_for_blog_page');