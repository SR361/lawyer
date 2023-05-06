<?php
return array(
	'name' => esc_html__( 'Help', 'avvocato' ),
	'auto' => true,
	'config' => array(

		array(
			'name' => esc_html__( 'Help', 'avvocato' ),
			'type' => 'title',
			'desc' => '',
		),

		array(
			'name' => esc_html__( 'Help', 'avvocato' ),
			'type' => 'start',
			'nosave' => true,
		),
//----
		array(
			'type' => 'docs',
		),

			array(
				'type' => 'end',
			),
	),
);
