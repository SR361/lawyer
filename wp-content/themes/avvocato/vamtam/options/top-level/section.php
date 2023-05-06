<?php

/**
 * Top level sections without panels
 *
 * @package vamtam/avvocato
 */

global $vamtam_theme_customizer;

$thispath = VAMTAM_OPTIONS . 'top-level/';

if ( ! \VamtamElementorBridge::elementor_is_v3_or_greater() ) {
	$vamtam_theme_customizer->add_section( array(
		'title'       => esc_html__( 'Global Layout', 'avvocato' ),
		'id'          => 'global-layout',
		'description' => '',
		'fields'      => include $thispath . 'global-layout.php',
	) );
}

$vamtam_theme_customizer->add_section( array(
	'title'       => esc_html__( 'Global Styles', 'avvocato' ),
	'id'          => 'global-styles',
	'description' => '',
	'fields'      => include $thispath . 'global-styles.php',
) );
