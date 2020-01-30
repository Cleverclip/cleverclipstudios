<?php
$context = Timber::get_context();

$context['home'] = new TimberPost(
  get_option('page_on_front')
);

Timber::render('pages/404.twig', $context);
