<?php
/**
 * The template for displaying the 404 template in the Twenty Twenty theme.
 *
 * @package WordPress
 * @subpackage Twenty_Twenty
 * @since Twenty Twenty 1.0
 */

get_header();
?>


	<section class="container error404-content inview" style="text-align:center;margin-bottom:100px;line-height:500%;">

		<h2 class="title"><?php _e( 'Page Not Found', 'twentytwenty' ); ?></h2>

		<div class="intro-text"><p><?php _e( 'The page you were looking for could not be found. It might have been removed, renamed, or did not exist in the first place.', 'twentytwenty' ); ?></p></div>

        <div class="search_form">
            <?php
            get_search_form(
                array(
                    'aria_label' => __( '404 not found', 'twentytwenty' ),
                )
            );
            ?>
        </div>

	</section>

<?php
get_footer();
