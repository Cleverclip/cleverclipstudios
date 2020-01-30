<?php
$context = Timber::get_context();

$context['home'] = new TimberPost(
  get_option('page_on_front')
);

$context['post'] = new TimberPost();

$context['related'] = Timber::get_posts(array(
  'meta_key' => 'stars',
  'order' => 'DESC',
  'orderby' => 'meta_value',
  'post_type' => 'case',
  'posts_per_page' => 4,
  'tax_query' => array(
    'relation' => 'AND',
    array(
      'taxonomy' => 'service',
      'field' => 'term_id',
      'terms' => get_terms('service')[0]->term_id,
    ),
    array(
      'taxonomy' => 'industry',
      'field' => 'term_id',
      'terms' => get_terms('industry')[0]->term_id,
    )
  )
));

if (sizeof($context['related']) < 4) {
  $industry = Timber::get_posts(array(
    'meta_key' => 'stars',
    'order' => 'DESC',
    'orderby' => 'meta_value',
    'post_type' => 'case',
    'posts_per_page' => 4,
    'tax_query' => array(
      array(
        'taxonomy' => 'industry',
        'field' => 'term_id',
        'terms' => get_terms('industry')[0]->term_id,
      )
    )
  ));

  foreach ($industry as $post) {
    array_push($context['related'], $post);
  }
}

Timber::render('pages/case.twig', $context);
