<?php
/* Template Name: Service */

$context = Timber::get_context();

$context['home'] = new TimberPost(
  get_option('page_on_front')
);

$context['post'] = new TimberPost();

$context['cases'] = Timber::get_posts(array(
  'meta_key' => 'stars',
  'order' => 'DESC',
  'orderby' => 'meta_value',
  'post_type' => 'case',
  'posts_per_page' => -1,
  'tax_query' => array(
    array(
      'taxonomy' => 'service',
      'field' => 'term_id',
      'terms' => get_field('type'),
    )
  )
));

$context['posts'] = Timber::get_posts(array(
  'post_type' => 'post',
  'posts_per_page' => 10,
  'lang' => pll_current_language()
));

Timber::render('pages/service.twig', $context);
