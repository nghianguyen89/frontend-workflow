<?php
/**
 * The default template for displaying content
 * Used for posts
 **/
    $pagelist_id = 145;
    $pagelist_url = isset($_GET['cate_id']) ? get_permalink( $pagelist_id ) . '?cate_id=' . $_GET['cate_id'] : get_permalink( $pagelist_id );
    $categories = get_the_category();
?>


<div class="container wow animate__fadeIn" data-wow-delay="0.5s">
    <div class="topic topic_detail">

        <p class="topic_detail__info">
            <span class="_date"><?php echo get_the_date( 'Y/m/d' ); ?></span>
            <span class="_cate" style="<?php echo $categories[0]->description; ?>"><?php echo $categories[0]->name; ?></span>
        </p>

        <h2 class="topic_detail__title"><?php echo get_the_title(); ?></h2>
        
        <?php
            if( !empty( get_the_post_thumbnail_url( get_the_ID() ) ) )
                echo '<div class="topic_detail__image"><img loading="lazy" src="' . get_the_post_thumbnail_url( get_the_ID() ) .'" alt=""></div>'; 
        ?>

        <div class="topic_detail__content">
            <?php echo get_the_content(); ?>
        </div>

        <div class="topic_detail__link">
            <a class="btn btn01" href="<?= $pagelist_url; ?>">
                <span class="_txt">お知らせ一覧へ戻る</span>
            </a>
        </div>

    </div>
</div>