<?php
/* Template Name: Clients */

$context = Timber::get_context();

$context['home'] = new TimberPost(
    get_option('page_on_front')
);

$context['post'] = new TimberPost();

// cases, grouped by industries

$context['industries'] = array();

$industries = get_terms('industry');

shuffle($industries);

$industries = array_slice($industries, 0, 3);

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

// case study ids already on page
$case_ids_on_page = array_map(function ($case_obj) {
    return $case_obj->ID;
}, $context["industries"]);

// cases, grouped by services (solutions)

$context['solutions'] = array();

$services = get_terms('service');

foreach ($services as $service) {
    $cases = Timber::get_posts(array(
        'meta_key' => 'stars',
        'order' => 'DESC',
        'orderby' => 'meta_value',
        'post_type' => 'case',
        'posts_per_page' => 5,
        'tax_query' => array(
            array(
                'taxonomy' => 'service',
                'field' => 'term_id',
                'terms' => $service->term_id,
            )
        )
    ));

    if (sizeof($cases) > 0) {
        $with_most_stars = [];
        foreach ($cases as $case) {
            if (!in_array($case->ID, $case_ids_on_page)) {
                if (sizeof($with_most_stars) === 0 || strlen($case->stars) === strlen($with_most_stars[0]->stars)) {
                    array_push($with_most_stars, $case);
                }
            }
        }

        if (sizeof($with_most_stars) > 0) {
            shuffle($with_most_stars);
            array_push($context['solutions'], $with_most_stars[0]);
        }
    }
}

Timber::render('pages/clients.twig', $context);
