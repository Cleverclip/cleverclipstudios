<?php
/* Template Name: Services */

$context = Timber::get_context();

$context['home'] = new TimberPost(
  get_option('page_on_front')
);

$context['post'] = new TimberPost();

$context['blog'] = Timber::get_posts(array(
  'post_type' => 'post',
  'posts_per_page' => 4
));

$context['articles'] = array();

foreach (get_field('sections_list') as $section) {
  $cases = Timber::get_posts(array(
    'meta_key' => 'stars',
    'order' => 'DESC',
    'orderby' => 'meta_value',
    'post_type' => 'case',
    'posts_per_page' => 4,
    'tax_query' => array(
      array(
        'taxonomy' => 'service',
        'field' => 'term_id',
        'terms' => $section['service'],
      )
    )
  ));

  array_push($context['articles'], $cases);
}

Timber::render('pages/services.twig', $context);
