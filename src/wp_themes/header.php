<?php
/**
 * Header file for theme.
 */
    $post_name = get_post_field( 'post_name', get_the_ID() );
    $bodyCls = is_front_page() ? 'home-page' : 'sub-page page-' . $post_name;
?><!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- S.E.O -->
<meta name="keywords" content="" />
<meta name="description" content="株式会社シーユニットスクウェア" />
<meta name="author" content="株式会社C-UNIT SQUARE" />
<meta name="copyright" content="Copyright © 2023 株式会社C-UNIT SQUARE. All Rights Reserved." />
<meta name="robots" content="ALL" />
<!-- favicon -->
<link rel="icon" type="image/png" href="<?php echo get_media_upload( 'favicon.png' );?>">
<?php wp_head(); ?>
</head>

<body <?php body_class( $bodyCls ); ?>>
<?php wp_body_open(); ?>
    
    <div id="outside">
        <!-- header -->
        <header id="header">
            <div class="container">

                <button class="menu">
                    <i class="menu-icon"><span></span></i>
                    <strong class="menu-txt">
                        <span class="is-menu">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 11.36">
                                <title>MENU</title>
                                <path d="M12.24,0H9.68L6.12,8.49,2.51,0H0V11.13H1.84V3l3.43,8.16H6.91l3.47-8.19v8.19h1.86ZM23,9.37h-5V6.42h4.52V4.71H18.05V1.76h5V0H16.17V11.13H23ZM35.9,0H34V7.9L29,0h-2.4V11.13h1.88V2.7l5.5,8.43h2ZM48,7.25V0H46.12V7.14A2.52,2.52,0,0,1,45.52,9a2.56,2.56,0,0,1-3.35,0,2.51,2.51,0,0,1-.61-1.8V0H39.7V7.25a3.91,3.91,0,0,0,1.16,3,4.67,4.67,0,0,0,6,0,3.92,3.92,0,0,0,1.17-3Z"></path>
                            </svg>
                        </span>
                        <span class="is-close">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54.73 11.6">
                                <title>CLOSE</title>
                                <path d="M8.94,10.53a4.92,4.92,0,0,0,1.72-2.62L8.93,7.35A3.54,3.54,0,0,1,7.77,9.09a3.25,3.25,0,0,1-2.15.7A3.62,3.62,0,0,1,3,8.74,3.93,3.93,0,0,1,1.93,5.81,4,4,0,0,1,3,2.83,3.61,3.61,0,0,1,5.6,1.77a3.26,3.26,0,0,1,2.15.68A3.18,3.18,0,0,1,8.84,4.21l1.77-.6A4.73,4.73,0,0,0,8.91,1,5.21,5.21,0,0,0,5.6,0,5.49,5.49,0,0,0,1.66,1.6,5.57,5.57,0,0,0,0,5.81,5.57,5.57,0,0,0,1.64,10a5.5,5.5,0,0,0,4,1.59A5.09,5.09,0,0,0,8.94,10.53Zm11.87-.95h-5.1V.24H13.83V11.36h7Zm7.52-7.81A3.7,3.7,0,0,1,31,2.83a3.91,3.91,0,0,1,1.11,3,3.9,3.9,0,0,1-1.11,3,3.78,3.78,0,0,1-5.25,0,3.93,3.93,0,0,1-1.1-3,4,4,0,0,1,1.1-3A3.67,3.67,0,0,1,28.33,1.77Zm-2.76,9.15a6,6,0,0,0,5.53,0,5.3,5.3,0,0,0,2.08-2A5.85,5.85,0,0,0,34,5.79a5.81,5.81,0,0,0-.82-3.1,5.51,5.51,0,0,0-2.08-2,6,6,0,0,0-5.53,0,5.44,5.44,0,0,0-2.08,2,5.9,5.9,0,0,0-.81,3.1,5.93,5.93,0,0,0,.81,3.11A5.23,5.23,0,0,0,25.57,10.92ZM43.34.86A4.37,4.37,0,0,0,38,1a3.14,3.14,0,0,0-1.11,2.41,2.88,2.88,0,0,0,.76,2,3.82,3.82,0,0,0,2.07,1.08l1.57.33a2.06,2.06,0,0,1,1.09.56,1.27,1.27,0,0,1,.4.95,1.35,1.35,0,0,1-.53,1.1,2.29,2.29,0,0,1-1.5.43,2.45,2.45,0,0,1-1.79-.64,2.48,2.48,0,0,1-.75-1.58l-1.76.5a3.71,3.71,0,0,0,1.24,2.39,4.28,4.28,0,0,0,3.06,1,4,4,0,0,0,2.88-1,3.12,3.12,0,0,0,1.06-2.37,3,3,0,0,0-.78-2.06A4,4,0,0,0,41.63,5L40,4.69c-.87-.19-1.31-.66-1.31-1.43a1.45,1.45,0,0,1,.55-1.13,2,2,0,0,1,1.37-.47,2.08,2.08,0,0,1,1.54.54,2.17,2.17,0,0,1,.64,1.17l1.7-.53A3.66,3.66,0,0,0,43.34.86ZM54.73,9.61h-5V6.66h4.52V4.94H49.74V2h5V.24H47.86V11.36h6.87Z"></path>
                            </svg>
                        </span>
                    </strong>
                </button>

                <h1 class="head_logo">
                    <a href="<?= get_home_url(); ?>">
                        <img class="_img" src="<?php echo get_media_upload( 'logo.png' );?>" alt="C-UNIT SQUARE">
                        <span class="_txt">株式会社C-UNIT SQUARE｜シーユニットスクウェア</span>
                    </a>
                </h1>

                <nav class="head_navi">
                    <ul>
                        <li>
                            <a href="<?= get_home_url(); ?>/philosophy/">
                                <span class="jp">私たちの思い</span>
                                <span class="en">philosophy</span>
                            </a>
                        </li>
                        <li>
                            <a href="<?= get_home_url(); ?>/company/">
                                <span class="jp">企業情報</span>
                                <span class="en">company</span>
                            </a>
                        </li>
                        <li>
                            <a href="<?= get_home_url(); ?>/solutions/">
                                <span class="jp">事業案内</span>
                                <span class="en">solutions</span>
                            </a>
                        </li>
                        <li>
                            <a href="<?= get_home_url(); ?>/project/">
                                <span class="jp">プロジェクト</span>
                                <span class="en">project</span>
                            </a>
                        </li>
                        <li>
                            <a href="<?= get_home_url(); ?>/recruit/">
                                <span class="jp">採用情報</span>
                                <span class="en">recruitment</span>
                            </a>
                        </li>
                        <li>
                            <a href="<?= get_home_url(); ?>/access/">
                                <span class="jp">アクセス</span>
                                <span class="en">access</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <div class="head_inquiry"> 
                    <p class="_trigger">
                        <span class="jp">ご相談</span>
                        <span class="en">inquiry</span>
                    </p>

                    <div class="_content"> 
                        <div class="_content_inner">
                            <p class="_big">
                                実現可能かどうか知りたい<br>
                                どれぐらいかかるか知りたい<br>
                                デザインサンプルが欲しい<br>
                                提案が欲しい<br>
                                すぐ頼めるかどうか知りたい<br>
                                実績があれば知りたい
                            </p>

                            <p class="_small">...などお気軽にお問い合わせください！</p>

                            <p class="_link">
                                <a class="btn" href="<?= get_home_url(); ?>/#inquiry">お問い合わせフォームはこちら</a>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </header>

        <!-- content -->
        <main id="wrapper">

