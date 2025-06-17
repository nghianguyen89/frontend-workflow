<?php
/**
 * The template content
 * Post type : post
 * Page : お知らせ 
 * URL : /topics/
 * Shortcode : [GET_LIST posts_per_page="1" template="template-list/post/topics-list.php" pagination="true" pager_container="topics_pager"]
 **/

    $page_object = get_queried_object();
    $categories = get_terms( array(
        'taxonomy' => 'category',
        'hide_empty' => true,
    ) );
    $current_category = !empty( $_GET['cate_id'] ) ? $_GET['cate_id'] :'';
    $active_cate = empty($current_category) ? 'active' : '';
    $params_cate = empty($current_category) ? '' : '?cate_id=' . $_GET['cate_id'];
?>

<div class="topic_category">
    <ul>
        <li><a class="<?php echo $active_cate ?>" href="<?= get_home_url(); ?>/topics/">すべて</a></li>
        <?php
            foreach( $categories as $category ) {
                $active_cate = $current_category == $category->term_id ? 'active' : '';
                echo '<li><a class="' . $category->term_id . ' ' . $active_cate . '" href="' . get_home_url() . '/topics/?cate_id=' . $category->term_id . '&category_name=' . $category->name . '">' . $category->name . '</a></li>';
            }
        ?>
    </ul>
</div>

<ul class="topic_content">
    <?php
        while( $getlist_posts->have_posts() ) {
            $getlist_posts->the_post();            
            $categories = get_the_category();

            echo '<li>';
                echo '<a href="' . get_the_permalink() . $params_cate . '">';
                    echo '<span class="_date">' . get_the_date( 'Y.m.d' ) . '</span>';
                    echo '<span class="_cate" style="' . $categories[0]->description . '">' . $categories[0]->name . '</span>';
                    echo '<span class="_text">' . get_the_title() . '</span>';
                echo '</a>';
            echo '</li>';
        }
        wp_reset_postdata();
    ?>
</ul>
