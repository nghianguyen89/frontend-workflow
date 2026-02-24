<?php
/**
 * The default template for displaying content
 * Used for posts
 */

    $pagelist_id    = 207;
	$pagelist_url   = get_permalink( $pagelist_id );
    $prev_post      = get_previous_post();
    $next_post      = get_next_post();
    $categories     = get_the_category();
?>

<section class="container topics_detail">

    <div class="topicsdtl_metabox wow animate__fadeIn" data-wow-delay="0.5s">
        <p class="_date"><?= get_the_date( 'Y.m.d' ); ?></p>
        <p class="_cate" style="<?= $categories[0]->description; ?>"><?= $categories[0]->name; ?></p>
        <h3 class="title"><?= get_the_title(); ?></h3>
    </div>

    <div class="topicsdtl_content wow animate__fadeIn" data-wow-delay="1s">
        <?php echo get_the_content(); ?>
    </div>

    <ul class="topicsdtl_navi single_navi wow animate__fadeIn" data-wow-delay="0.5s">
        <?php
            if( !empty( $prev_post ) )
                echo '<li class="prev"><a href="' . get_permalink( $prev_post->ID ) . '">前のお知らせへ</a></li>';
            else echo'<li class="prev _disable"><a>前のお知らせへ</a></li>';
            
            echo '<li class="top"><a href="' . $pagelist_url . '">お知らせ一覧に戻る</a></li>';
            
            if( !empty( $next_post ) )
                echo '<li class="next"><a href="' . get_permalink( $next_post->ID ) . '">次のお知らせへ</a></li>';
            else echo'<li class="next _disable"><a>次のお知らせへ</a></li>';
        ?>
    </ul>

</section>


