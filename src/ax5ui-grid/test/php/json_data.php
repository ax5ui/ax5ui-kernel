<?php
/**
 * 그리드용 Json Data 생성기
 */

require_once 'vendor/autoload.php';

// Json 헤더 설정
header('Content-Type: application/json');

// 가상 데이터 생성용 클래스
$faker = Faker\Factory::create('ko_KR');

$len = isset($_GET['len']) ? $_GET['len'] : 10;
$data = array();

for($i = 0; $i < $len; $i++) {
    $data[$i] = array(
        'companyJson' => array("대표자명" => $faker->name),
        'a' => 'A',
        'b' => 'B0',
        'price' => $faker->numberBetween(10000, 10000000),
        'amount' => $faker->numberBetween(7, 20),
        'cost' => 0,
        'saleDt' => $faker->date('Y-m-d'),
        'customer' => $faker->name,
        'saleType' => $faker->creditCardType[0]
    );

    $data[$i]['cost'] = $data[$i]['price'] * $data[$i]['amount'];
}

echo json_encode($data);