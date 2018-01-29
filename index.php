<?php
for ($po=1; $po < 9; $po++) {
  $content = file_get_contents( "https://apps.timwhitlock.info/static/images/emoji/emoji-apple/1f60".$po.".png" );
  file_put_contents("1/0".$po.".png", $content);
}


?>
