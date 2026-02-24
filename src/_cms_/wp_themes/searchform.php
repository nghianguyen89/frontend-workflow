<?php
/**
 * The searchform.php template.
 *
 * Used any time that get_search_form() is called.
 *
 */

/*
 * Generate a unique ID for each form and a string containing an aria-label
 * if one was passed to get_search_form() in the args array.
 */
$twentytwenty_unique_id = twentytwenty_unique_id( 'search-form-' ); ?>

<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<input type="search" id="<?php echo esc_attr( $twentytwenty_unique_id ); ?>" placeholder="サイト内をキーワードで検索" value="" name="s" />
    <button class="_submit" type="submit"><img src="<?php echo get_media_upload( 'icon-search.png'); ?>" alt="search"></button>
</form>