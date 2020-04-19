<?php

$filesData='';
$files = array();

foreach (glob("./Produzione/*.csv") as $file) {
	//echo "\n".$file;
  $filesData .= file_get_contents($file, true);
}

function compare_func($a, $b)
{
    // CONVERT $a AND $b to DATE AND TIME using strtotime() function
	
    $t1 = strtotime(str_replace('/', '-',substr($a,0,16)));
    $t2 = strtotime(str_replace('/', '-',substr($b,0,16)));

    return ($t1 - $t2);
}

$lines= explode("\n",$filesData); 
//print_r($lines);

usort($lines, "compare_func");

//remove duplicates
$lines = array_unique($lines);

//remove the first line should be : "Time,Produzione (W)"
array_shift($lines);

//remove empty lines
$lines = array_diff( $lines, array('') );

print_r($lines);
$text= implode("\n",$lines);
file_put_contents('./Produzione/master.txt', $text);
?>