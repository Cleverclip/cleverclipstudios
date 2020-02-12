<?php
/* Template Name: Blog */

$context = Timber::get_context();

$context['home'] = new TimberPost(
  get_option('page_on_front')
);

$context['posts'] = Timber::get_posts(array(
  'post_type' => 'post',
  'posts_per_page' => -1,
  'lang' => pll_current_language()
));

$context['post'] = new TimberPost();

Timber::render('pages/newblogdesign.twig', $context); 