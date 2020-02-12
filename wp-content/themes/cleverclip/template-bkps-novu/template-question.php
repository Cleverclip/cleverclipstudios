<?php
/* Template Name: Question */

$context = Timber::get_context();

$context['home'] = new TimberPost(
  get_option('page_on_front')
);

$context['post'] = new TimberPost();

$parent = get_post_ancestors($context['post'])[0];

$context['cases'] = Timber::get_posts(array(
  'meta_key' => 'stars',
  'order' => 'DESC',
  'orderby' => 'meta_value',
  'post_type' => 'case',
  'posts_per_page' => 6,
  'tax_query' => array(
    array(
      'taxonomy' => 'service',
      'field' => 'term_id',
      'terms' => get_field('type', $parent),
    )
  )
));

$context['parent'] = new TimberPost($parent);

Timber::render('pages/question.twig', $context);
