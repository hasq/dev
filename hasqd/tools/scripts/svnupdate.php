<?php
echo "<html><body><pre>";

$cwd = getcwd();
echo "Current dir: $cwd <br>";
$c = "$cwd" . "/";
chdir($c);
echo "SVN dir: " . getcwd() . "<br>";

$k = exec("ls $c",$r);
print_r($r);
unset($r);
echo "===========<br>";
$k = exec("svn st",$r);
print_r($r);
unset($r);
echo "===========<br>";
$k = exec("svn up 2> svnerror.log",$r);
print_r($r);
echo "== Error {<br>";
echo file_get_contents("svnerror.log");
echo "}<br>";

echo "</pre></body></html>";
?>
