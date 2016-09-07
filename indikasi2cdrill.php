<?php
header('Access-Control-Allow-Origin: *');
set_time_limit(0);
$username = "root";
$password = "";
$host = "localhost";
$database = "ta";
$query = $_POST["query"];
$mysqli = new mysqli($host, $username, $password, $database);
$myArray = array();
if ($result = $mysqli->query($query)) {
    while($row = $result->fetch_array(MYSQLI_ASSOC)) {
        foreach($row as $key => $value){
            $row[$key] = utf8_encode($value);
        }
        array_push($myArray,$row);
    }
    //var_dump($myArray);
    //echo "<hr/>";
    echo json_encode($myArray, JSON_NUMERIC_CHECK);
    //echo "<hr/>";
}
$result->close();
$mysqli->close();
?>