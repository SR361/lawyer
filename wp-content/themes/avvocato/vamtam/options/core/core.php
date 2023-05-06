<?php

/**
 * Controls attached to core sections
 *
 * @package vamtam/avvocato
 */


return array(
	array(
		'label'     => esc_html__( 'Header Logo Type', 'avvocato' ),
		'id'        => 'header-logo-type',
		'type'      => 'switch',
		'transport' => 'postMessage',
		'section'   => 'title_tagline',
		'choices'   => array(
			'image'      => esc_html__( 'Image', 'avvocato' ),
			'site-title' => esc_html__( 'Site Title', 'avvocato' ),
		),
		'priority' => 8,
	),

	array(
		'label'     => esc_html__( 'Single Product Image Zoom', 'avvocato' ),
		'id'        => 'wc-product-gallery-zoom',
		'type'      => 'switch',
		'transport' => 'postMessage',
		'section'   => 'woocommerce_product_images',
		'choices'   => array(
			'enabled'  => esc_html__( 'Enabled', 'avvocato' ),
			'disabled' => esc_html__( 'Disabled', 'avvocato' ),
		),
		// 'active_callback' => 'vamtam_extra_features',
	),
);


