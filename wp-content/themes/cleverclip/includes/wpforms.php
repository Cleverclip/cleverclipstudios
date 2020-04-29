<?php
/**
 * Make sure the wpforms is active
 */
if (in_array('wpforms/wpforms.php', apply_filters('active_plugins', get_option('active_plugins')))) {
    
    /**
     * Register the Smart Tag so it will be available to select in the form builder.
     *
     * @link   https://wpforms.com/developers/how-to-create-a-custom-smart-tag/
     *
     * @param  array $tags
     * @return array
     */
    function ccs_register_smarttags( $tags ) {
        
        // Key is the tag, item is the tag name.
        $tags['current_language'] = 'Current Language';
        $tags['country'] = 'Country';
        $tags['ccs_referer'] = 'ccs_referer';
        $tags['utm_source'] = 'utm_source';
        $tags['utm_medium'] = 'utm_medium';
        $tags['utm_campaign'] = 'utm_campaign';
        $tags['utm_content'] = 'utm_content';
        $tags['utm_term'] = 'utm_term';

        return $tags;
    }
    add_filter( 'wpforms_smart_tags', 'ccs_register_smarttags' );
    
    /**
     * Process the Smart Tag.
     *
     * @link   https://wpforms.com/developers/how-to-create-a-custom-smart-tag/
     *
     * @param  string $content
     * @param  string $tag
     * @return string
     */
    function ccs_process_smarttags( $content, $tag ) {
        
        // process current language tag
        if ( 'current_language' === $tag ) {
            
            $language = '';
            
            if ( function_exists('pll_current_language')) {
                $language = pll_current_language('name');
                
                $language = $language == 'Deutsch' ? 'German' : $language;
            }

            $content = str_replace( '{current_language}', $language, $content );
        }
        
        // process country tag
        if ( 'country' === $tag ) {

            $country = do_shortcode('[geoip_detect2 property="country.name" default="Not Detected" lang="en"]');
            
            $content = str_replace( '{country}', $country, $content );
        }

        // process country tag
        if ( 'ccs_referer' === $tag ) {
            
            $referer = '';
            
            if (! empty($_SERVER['HTTP_REFERER'])) {
                
                if (strpos($_SERVER['HTTP_REFERER'], 'cleverclipstudios.com') == false) {
                    $referer = $_SERVER['HTTP_REFERER'];
                }
            }
            
            if (empty($referer) && ! empty( $_COOKIE['referrer'] )) {
                $referer = $_COOKIE['referrer'];
            }
            
            $content = str_replace( '{ccs_referer}', $referer, $content );
        }
        
        // process utm tags
        $utm_tags = array(
            'utm_source',
            'utm_medium',
            'utm_campaign',
            'utm_content',
            'utm_term'
        );
        
        if (in_array($tag, $utm_tags)) {
            
            $value = '';
            
            if (! empty( $_GET[ $tag ] )) {
                $value = wp_unslash( sanitize_text_field( $_GET[ $tag ] ));
            } else if (! empty( $_COOKIE[ $tag] )) {
                $value = $_COOKIE[ $tag ];
            }
            
            $content = str_replace( '{'.$tag.'}', $value, $content );
        }

        return $content;
    }
    add_filter( 'wpforms_smart_tag_process', 'ccs_process_smarttags', 10, 2 );

}