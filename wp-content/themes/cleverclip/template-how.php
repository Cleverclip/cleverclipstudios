<?php
/* Template Name: How */

$context = Timber::get_context();

$context['home'] = new TimberPost(
  get_option('page_on_front')
);

$context['post'] = new TimberPost();

Timber::render('pages/how.twig', $context);
