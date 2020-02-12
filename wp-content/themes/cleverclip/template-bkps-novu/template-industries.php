<?php
/* Template Name: Industries */

$context = Timber::get_context();

$context['home'] = new TimberPost(
  get_option('page_on_front')
);

$context['post'] = new TimberPost();

$context['parent'] = new TimberPost(get_post_ancestors($context['post'])[0]);

$context['industries'] = get_terms('industry', array(
  'hide_empty' => false
));

Timber::render('pages/industries.twig', $context);
