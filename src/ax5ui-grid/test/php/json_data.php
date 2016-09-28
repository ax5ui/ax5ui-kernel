<?php
/**
 * 그리드용 Json Data 생성기
 */

require_once 'db/db.config.php';

// Json 헤더 설정
header('Content-Type: application/json');

// 가상 데이터 생성용 클래스
// $faker = Faker\Factory::create('ko_KR');

$len = isset($_GET['len']) ? $_GET['len'] : 10;
$page = isset($_GET['page']) ? $_GET['page'] : 1;

$sales = new json_data($page, $len);
$sales->read()->get_json();

$mode = isset($_GET['mode']) ? $_GET['mode'] : 'read';

class json_data {
    protected $db;
    protected $ret;
    protected $data;
    protected $page;
    protected $offset;
    protected $limit;
    protected $tbl;

    public function __construct($page = 1, $limit = 10)
    {
        $this->db = Query(array(
            'type' => 'sqlite',
            'host' => '',
            'user' => '',
            'pass' => '',
            'port' => '',
            'database' => '',

            // Only required
            // SQLite or Firebird
            'file' => 'db/sample.db',

            // Optional paramaters
            'prefix' => '',     // Database table prefix
            'alias' => 'default'        // Connection name for the Query function
        ));

        $this->ret = array(
            'status' => 'success',
            'msg' => '',
            'data' => ''
        );

        $this->page = intval($page) > 0 ? intval($page) : 1;

        $this->limit = intval($limit);
        $this->offset = ($this->page - 1) * $this->limit;
        $this->tbl = 'sales';
        $this->data = false;

        return $this;
    }

    public function read()
    {
        $total_cnt = $this->db->count_all_results($this->tbl);

        $this->data['list'] = $this->db
            ->limit($this->limit, $this->offset)
            ->order_by('id')
            ->get($this->tbl)
            ->fetchAll(PDO::FETCH_ASSOC);

        $this->data['page'] = array(
            'currentPage' => $this->page - 1,
            'pageSize' => $this->limit,
            'totalPages' => ceil($total_cnt / $this->limit),
            'totalElements' => $total_cnt
        );

        return $this;
    }

    public function get()
    {
        return $this->data;
    }

    public function get_one()
    {
        return isset($this->data[0]) ? $this->data[0] : false;
    }

    public function get_json($data = null)
    {
        $this->ret['data'] = $data ? $data : $this->data;
        echo json_encode($this->ret);
    }
}