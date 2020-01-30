<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
* @package    Cleverclip
 * @author     cleverclip
 * @link       https://cleverclipstudios.com
*/

$context = Timber::get_context();

$context['home'] = new TimberPost(
  get_option('page_on_front')
);

     
 Timber::render('pages/author.twig', $context);
