<?php
/**
 * The template for displaying Search Results pages.
 *
 * 
 * @package    Cleverclip
 * @author     cleverclip
 * @link       https://cleverclipstudios.com
*/

$context = Timber::get_context();

$context['home'] = new TimberPost(
  get_option('page_on_front')
);
	 
 Timber::render('pages/search.twig', $context);