<?php
    $username="wuy";
    $password="h8bR3M9V";
    $dsn="pbNet";
    $host="vis.cs.ucdavis.edu:3306";
    $link=mysql_connect($host,$username,$password);
    mysql_select_db($dsn, $link) or die("Unable to select database");
    $query="SELECT * FROM nodes";
    mysql_query($query);
    $array = array();
    $result = mysql_query($query, $link) or die ('Errant query: '.$query);
    while($row=mysql_fetch_array($result)) $array[] = $row;
    echo json_encode($array);
?>
