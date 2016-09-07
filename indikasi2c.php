<?php
header('Access-Control-Allow-Origin: *');
set_time_limit(0);
$username = "root";
$password = "";
$host = "localhost";
$database = "ta";
$mysqli = new mysqli($host, $username, $password, $database);
$myArray = array();
if ($result = $mysqli->query("SELECT lelang.id, lelang.nama, lelang.tahun, lelang.lpse, lelang.agency, lelang.satker, lelang.kategori, lelang.jenisusaha, lelang.pagu, lelang.hps, lelang.penawaranmenang, lelang.pemenang, lelang.kasus, indikasi2c.menangperhps FROM lelang join indikasi2c on lelang.id = indikasi2c.idlelang")) {
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