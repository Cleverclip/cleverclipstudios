<?php
/* Template Name: Clients */

$context = Timber::get_context();

$context['home'] = new TimberPost(
  get_option('page_on_front')
);

$context['post'] = new TimberPost();

$context['industries'] = array();

$industries = get_terms('industry');

foreach ($industries as $industry) {
  $case = Timber::get_posts(array(
    'meta_key' => 'stars',
    'order' => 'DESC',
    'orderby' => 'meta_value',
    'post_type' => 'case',
    'posts_per_page' => 1,
    'tax_query' => array(
      array(
        'taxonomy' => 'industry',
        'field' => 'term_id',
        'terms' => $industry->term_id,
      )
    )
  ))[0];

  array_push($context['industries'], $case);
}

shuffle($context['industries']);

$context['industries'] = array_slice($context['industries'], 0, 3);

$context['solutions'] = Timber::get_posts(array(
  'meta_key' => 'stars',
  'order' => 'DESC',
  'orderby' => 'meta_value',
  'post_type' => 'case',
  'posts_per_page' => 10
));

shuffle($context['solutions']);

$context['solutions'] = array_slice($context['solutions'], 0, 3);

Timber::render('pages/clients.twig', $context);
