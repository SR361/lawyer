<!-- Elementor `page-title` location -->
<?php if ( ! function_exists( 'elementor_theme_do_location' ) || ! elementor_theme_do_location( 'page-title-location' ) ) : ?>
	<header class="page-header" data-progressive-animation="page-title">
	<?php $is_cart_or_checkout = vamtam_has_woocommerce() && ( is_checkout() || is_cart() ); ?>
		<?php if ( $is_cart_or_checkout ) : ?>
			<h3><?php echo wp_kses_post( $title ) ?></h3>
		<?php else : ?>
			<h1><?php echo wp_kses_post( $title ) ?></h1>
		<?php endif; ?>

		<?php if ( ! empty( $description ) ) : ?>
			<div class="page-header-line"></div>

			<div class="desc">
				<?php echo wp_kses_post( $description ) ?>
			</div>
		<?php endif ?>
	</header>
	<?php if ( is_single() ): ?>
		<?php get_template_part( 'templates/post/meta/categories' ); ?>
	<?php endif ?>
<?php endif; ?>
