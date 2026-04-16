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

    <?php 
        echo '<div class="main_visual" data-imgpc="' . get_theme_file_uri() . '/assets/images/mainvisual-website-under-construction.jpg" data-imgsmp="' . get_theme_file_uri() . '/assets/images/mainvisual-website-under-constructionsmp.jpg">';
            echo '<h2>';
                echo '<span class="_jp">ページが見つかりません</span>';
                echo '<span class="_en">Page Not Found</span>';
            echo '</h2>';
        echo '</div>';
    ?>

	<section class="container error404-content inview">

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
