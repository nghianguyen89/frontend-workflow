<?php
/**
 * The template content
 * Post type : post
 * Page : トップページ 
 * URL : /
 * Shortcode : [GET_LIST posts_per_page="3" template="template-list/post/topics-top.php" pagination="false" posts_per_page="3"]
 **/
?>

<table>
    <?php
        while( $getlist_posts->have_posts() ) {
            $getlist_posts->the_post();

            echo '<tr>';
                echo '<th><span class="_date">' . get_the_date( 'Y.m.d' ) . '</span><span class="_status" style="' . get_the_category()[0]->description . '">' . get_the_category()[0]->name . '</span></th>';
                echo '<td><a href="' . get_the_permalink() . '">' . get_the_title() . '</a></td>';
            echo '</tr>';
        }
        wp_reset_postdata();
    ?>
</table>