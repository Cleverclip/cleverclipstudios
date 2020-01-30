<?php
/* Template Name: Industry */

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
  'posts_per_page' => 6,
  'tax_query' => array(
    array(
      'taxonomy' => 'industry',
      'field' => 'term_id',
      'terms' => get_field('industry'),
    )
  )
));

Timber::render('pages/industry.twig', $context);
