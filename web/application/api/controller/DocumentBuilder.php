<?php
namespace app\api\controller;
use think\Controller;//引入Controller类
use think\Db;//引入数据库
use  think\Request;
use think\config;
use think\Exception;

class DocumentBuilder extends Controller
{
    
    public function tableList()
    {
        try {
            $params_arr = Request::instance()->param();

            $this->set_config($params_arr);
            
            
            $sql = 'show table status';
            $db = Db::connect('db_config_document');
            $table = @$db->query($sql);
            $html = '
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
                </head>';
            $html .= '<table border="1" cellpadding="3" cellspacing="0" style="table-layout: fixed;word-break: break-all; word-wrap: break-word;font-size:12px;width:100%">
                        <tr style="background:#ccc">
                            <th width="50%" valign="center">名称</td>
                            <th width="50%" valign="center">描述</td>
                        </tr>';
            foreach ($table as $re) {
                $html .= '<tr>
                            <td valign="center">' . $re['Name'] . '</td>
                            <td valign="center">' . $re['Comment'] . '</td>
                        </tr>';
            
            }
            $html .= '</table>';
            echo $html;
            ob_start(); //打开缓冲区
            @header("Cache-Control: public");
            @Header("Content-type: application/octet-stream");
            @Header("Accept-Ranges: bytes");
            if (strpos($_SERVER["HTTP_USER_AGENT"], 'MSIE')) {
                header('Content-Disposition: attachment; filename=' . $params_arr['database'] . '_list.doc');
            } else if (strpos($_SERVER["HTTP_USER_AGENT"], 'Firefox')) {
                Header('Content-Disposition: attachment; filename=' . $params_arr['database'] . '_list.doc');
            } else {
                @header('Content-Disposition: attachment; filename=' . $params_arr['database'] . '_list.doc');
            }
            @header("Pragma:no-cache");
            @header("Expires:0");
            ob_end_flush();//输出全部内容到浏览器
            
            
            
        } catch ( \PDOException $e ) {
            echo $e->getMessage();
        }
    }
    
    public function tableColumns()
    {
        try {
            $params_arr = Request::instance()->param();
            

            $this->set_config($params_arr);
            
            
            $sql = 'show table status';
            $db = Db::connect('db_config_document');
            $table = $db->query($sql);

            $html = '
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
                </head>';
            foreach ($table as $re) {
                if ($re['Engine'] != 'InnoDB') {
                    continue;
                }
                $str = 'SHOW FULL COLUMNS FROM ' . $re['Name'];
                $columns = $db->query($str);
                $html .= '<h3>表 ' . $re['Name'] . '</h3>
                        <table border="1" cellpadding="3" cellspacing="0" style="table-layout: fixed;word-break: break-all; word-wrap: break-word;font-size:12px;width:100%">
                        <tr style="background:#ccc">
                            <th width="13%" valign="center">Field</td>
                            <th width="15%" valign="center">Type</td>
                            <th width="6%" valign="center">Null</td>
                            <th width="7%" valign="center">Key</td>
                            <th width="10%" valign="center">Default</td>
                            <th width="14%" valign="center">Extra</td>
                            <th width="35%" valign="center">Comment</td>
                        </tr>';
                foreach ($columns as $col) {
                    $return_data[] = array(
                        'table_name' => $re['Name'],
                        'Field' => $col['Field'],
                        'Comment' => $col['Comment']
                    );
            
                    if ($col['Null'] == 'YES' && empty($col['Default'])) {
                        $col['Default'] = 'NULL';
                    }
                    $html .= '<tr>
                            <td>' . $col['Field'] . '</td>
                            <td>' . $col['Type'] . '</td>
                            <td>' . $col['Null'] . '</td>
                            <td>' . $col['Key'] . '</td>
                            <td>' . $col['Default'] . '</td>
                            <td>' . $col['Extra'] . '</td>
                            <td>' . $col['Comment'] . '</td>
                        </tr>';
                }
                $html .= '</table>';
            
            }
            
            $html .= '</table>';
            echo $html;
            ob_start(); //打开缓冲区
            @header("Cache-Control: public");
            @Header("Content-type: application/octet-stream");
            @Header("Accept-Ranges: bytes");
            if (strpos($_SERVER["HTTP_USER_AGENT"], 'MSIE')) {
                header('Content-Disposition: attachment; filename=' . $params_arr['database'] . '_detail.doc');
            } else if (strpos($_SERVER["HTTP_USER_AGENT"], 'Firefox')) {
                Header('Content-Disposition: attachment; filename=' . $params_arr['database'] . '_detail.doc');
            } else {
                @header('Content-Disposition: attachment; filename=' . $params_arr['database'] . '_detail.doc');
            }
            @header("Pragma:no-cache");
            @header("Expires:0");
            ob_end_flush();//输出全部内容到浏览器
            
            
            
        } catch ( \PDOException $e ) {
            echo $e->getMessage();
        }
    }
    
    private function set_config($params_arr){

        Config::set('db_config_document', [
            // 数据库类型
            'type'            => 'mysql',
            // 服务器地址
            'hostname'        => $params_arr['hostname'],
            // 数据库名
            'database'        => $params_arr['database'],
            // 用户名
            'username'        => $params_arr['username'],
            // 密码
            'password'        => $params_arr['password'],
            // 端口
            'hostport'        => $params_arr['port'],
            // 连接dsn
            'dsn'             => '',
            // 数据库连接参数
            'params'          => [],
            // 数据库编码默认采用utf8
            'charset'         => 'utf8mb4',
            // 数据库表前缀
            'prefix'          => '9thleaf_',
            // 数据库调试模式
            'debug'           => true,
            // 数据库部署方式:0 集中式(单一服务器),1 分布式(主从服务器)
            'deploy'          => 0,
            // 数据库读写是否分离 主从式有效
            'rw_separate'     => false,
            // 读写分离后 主服务器数量
            'master_num'      => 1,
            // 指定从服务器序号
            'slave_no'        => '',
            // 自动读取主库数据
            'read_master'     => false,
            // 是否严格检查字段是否存在
            'fields_strict'   => true,
            // 数据集返回类型
            'resultset_type'  => 'array',
            // 自动写入时间戳字段
            'auto_timestamp'  => false,
            // 时间字段取出后的默认时间格式
            'datetime_format' => 'Y-m-d H:i:s',
            // 是否需要进行SQL性能分析
            'sql_explain'     => false,
        ]);
    }
    
}
