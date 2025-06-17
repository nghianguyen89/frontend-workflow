<?php
/**
 * The default template for displaying content
 *
 * Used for both singular and index.
 */

?>

<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">

	<?php
		if ( is_search() || ! is_singular() )
			the_excerpt();

		elseif ( is_single() )
			get_template_part( 'template-parts/content-single' );

		else
			the_content();
	?>

</article><!-- .post -->
