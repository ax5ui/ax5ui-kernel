<?php require 'vendor/autoload.php';

// 기본 설정
$bower_url = '../../bower_components';
$ax5_url = '../../../dist';

$router = new AltoRouter();
$router->setBasePath('/ax5ui-grid/test/php/index.php');

// 라우팅 설정
$router->map('GET', '/', function() use ($bower_url, $ax5_url) {
    require __DIR__ . '/views/grid.php';
});

// 매핑 함수 실행
$match = $router->match();

if( $match && is_callable( $match['target'] ) ) {
    call_user_func_array( $match['target'], $match['params'] );
} else {
    // no route was matched
    header( $_SERVER["SERVER_PROTOCOL"] . ' 404 Not Found');
}
