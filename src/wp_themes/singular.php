<?php
/**
 * The template for displaying single posts and pages.
 *
 */
get_header(); ?>


	<?php    
        
        if( is_page() ) {

            $main_visual = !empty( get_field( 'main_visual' ) ) ? get_field( 'main_visual' ) : '';
            if ( !is_front_page() && !empty( get_the_content() ) ) {
                $main_visual_banner = $main_visual['banner'];
                $main_visual_title = $main_visual['title'];
                echo '<div class="main_visual" data-imgpc="' . $main_visual_banner['pc'] . '" data-imgsmp="' . $main_visual_banner['smp'] . '">';
                    echo '<h2 class="main_visual_title">';
                        echo '<span class="jp">' . $main_visual_title['ja'] . '</span>';
                        echo '<span class="en">' . $main_visual_title['en'] . '</span>';
                    echo '</h2>';
                echo '</div>';
            }
        
            if( !empty( get_the_content() ) ) {

                /* main content */
                if ( have_posts() ) {

                    while ( have_posts() ) {
                        the_post();
                        get_template_part( 'template-parts/content', get_post_type() );
                    }
                }
                
            } else {

                echo '<div class="main_visual" data-imgpc="' . get_theme_file_uri() . '/assets/images/mainvisual-website-under-construction.jpg" data-imgsmp="' . get_theme_file_uri() . '/assets/images/mainvisual-website-under-constructionsmp.jpg">';
                    echo '<h2 class="main_visual_title">';
                        echo '<span class="jp">準備中</span>';
                        echo '<span class="en">ready</span>';
                    echo '</h2>';
                echo '</div>';
            
                get_template_part( 'ready' );

            }
            
        } else if( is_single() ) {
        
            if ( have_posts() ) {
                while ( have_posts() ) {
                    the_post();
                    get_template_part( 'template-list/' . get_post_type() . '/detail', 'index' );
                }
            }
            
        }
        
	?>


<?php get_footer(); ?>
