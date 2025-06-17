<?php
/**
 * The template for displaying the footer
 */
?>

        </main>

        <!-- footer -->
        <footer id="footer">
            <div class="container">

                <div class="footer_logo"> 
                    <p class="_img">
                        <a href="<?= get_home_url(); ?>">
                            <img src="<?php echo get_media_upload( 'footer-logo.png' );?>" alt="C-UNIT SQUARE">
                        </a>
                    </p>
                    <ul class="_link"> 
                        <li><a href="<?= get_home_url(); ?>/privacy/">プライバシーポリシー</a></li>
                        <li><a href="<?= get_home_url(); ?>/#inquiry">お問い合わせ</a></li>
                    </ul>
                </div>

                <div class="footer_info">
                    <p class="_company">株式会社C-UNIT SQUARE <br class="smp">（シーユニットスクウェア）</p>
                    <dl class="_address"> 
                        <dt>本社・開発オフィス</dt>
                        <dd>〒455-0842 愛知県名古屋市港区稲永４-３-５ レイキャビック稲永1F<br>TEL：052-389-1964 FAX：052-389-1963</dd>
                        <dt>ベトナム開発オフィス： </dt>
                        <dd>G-Floor, 55 Lê Văn Huân Street, Ward 13, Tân Bình District, HCMC</dd>
                        <dt>東京サテライトオフィス： </dt>
                        <dd>〒105-0004 東京都港区新橋2−１６−１　ニュー新橋ビル9F</dd>
                    </dl>
                </div>

                <div class="footer_certified"> 
                    <div class="_img">
                        <img src="<?php echo get_media_upload( 'footer-certified.png' );?>" alt="CERTIFIED ISO 9001:2015 27000:2013 COMPANY">
                    </div>
                    <div class="_txt">
                        <p>【適用規格および認証登録番号】</p>
                        <p class="_b">ISO 9001:2015/JIS Q 9001:2015</p>
                        <p>認証登録番号 QA220097</p>
                        <p class="_b">ISO/IEC 27001:2013/JIS Q 27001:2014</p>
                        <p>認証登録番号 IA220096</p>
                    </div>
                </div>

            </div>
        </footer>

    </div><!--#outside-->

<?php wp_footer(); ?>
</body>
</html>
