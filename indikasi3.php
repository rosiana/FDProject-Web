<?php
header('Access-Control-Allow-Origin: *');
set_time_limit(0);
$username = "root";
$password = "";
$host = "localhost";
$database = "ta";
$mysqli = new mysqli($host, $username, $password, $database);
$arrMap = array();
$arrLPSE = array();
$idx = 0;
$idxLPSE = 0;
$idxAgency = 0;
$arrNodes = array();
$arrLinks = array(); 
if ($result = $mysqli->query("select distinct peserta, jumlahmenang from indikasi3tes2 where jumlahlelangsama >= 3")) {
    $rows = array();     
        while($row = $result->fetch_array(MYSQLI_ASSOC)) {
                $rows[] = $row;
        }
        foreach($rows as $row) { 
            $stringNode = ["id" => $row['peserta'], "name" => $row['peserta'], "jumlahmenang" => $row['jumlahmenang'], "group" => "1"];
            array_push($arrNodes, $stringNode);
        } 
}

if ($result = $mysqli->query("select distinct peserta, linkto, jumlahlelangsama, daftarlelangsama, kasus from indikasi3tes2 where linkto is not null and jumlahlelangsama >= 3")) {
    $rows = array();     
        while($row = $result->fetch_array(MYSQLI_ASSOC)) {
                $rows[] = $row;
        }
        foreach($rows as $row) { 
            if ($row['kasus'] == 0) {
                $stringLink = ["source" => $row['peserta'], "target" => $row['linkto'], "jumlahlelangsama" => $row['jumlahlelangsama'], "daftarlelangsama" => $row['daftarlelangsama'], "value" => "1"];
            }
            else {
                $stringLink = ["source" => $row['peserta'], "target" => $row['linkto'], "jumlahlelangsama" => $row['jumlahlelangsama'], "daftarlelangsama" => $row['daftarlelangsama'], "value" => "2"];
            }
            array_push($arrLinks, $stringLink);
        } 
}

$arr = ["nodes" => $arrNodes, "links" => $arrLinks];
echo json_encode($arr, JSON_NUMERIC_CHECK);

$result->close();
$mysqli->close();
?>