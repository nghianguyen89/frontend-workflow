<?php
/**
 * Page search results
 *
 */
	global $wp_query;
	global $query_string;
	$total_results = $wp_query->found_posts;
	get_header(); 
?>
	
	<div class="container search_results_page">
        
        <h2 class="title">検索結果</h2>
        
        <h3 class="search_results__title">
            &ldquo;<?php echo get_search_query(); ?>&rdquo;&nbsp;&nbsp;での検索結果
            &nbsp;&nbsp;：<?php echo $total_results; ?>&nbsp;件
        </h3>
        
        <table class="search_results__table">
            <?php 
            query_posts( $query_string . '&order=desc' );
            if ( have_posts() ) : 
                while ( have_posts() ) : 
                    the_post();
                    echo '<tr>';
                        echo '<td>';
                            echo '<p class="_page_title"><a href="' .get_the_permalink(). '">'. get_the_title() .'</a></p>';
                            echo '<div class="_page_content">'. limit_content( get_the_content(), 500 ) .'</div>';
                        echo '</td>';
                    echo '</tr>';
                endwhile;
            else : 
                echo '<tr><td style="text-align:center;padding: 50px 5px; font-size:18px">記事がありませんでした</td></tr>';
            endif;
            wp_reset_query(); 
            ?>
        </table>
        
        <div class="pager-list">
            <?php if ( function_exists( 'custom_pagination' ) ) {
                custom_pagination( $getlist_posts->max_num_pages, "2", $paged, false );
            } ?>
        </div>

	</div>

<?php get_footer(); ?>