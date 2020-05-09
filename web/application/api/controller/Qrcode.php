<?php
namespace app\api\controller;
use think\Controller;//引入Controller类
use think\Db;//引入数据库
use  think\Request;
use qrcodelib;

class Qrcode extends Controller
{
    
    public function index($name='world')
    {
        try {
            $params = Request::instance()->param('params');
            $params_arr = json_decode($params, true);
            
            $qrcode = new qrcodelib\Generate_qrcode();
            $upload_path = 'uploads/live_qrcode/'.date('Ymd').'/';
            $storage_path = ROOT_PATH.$upload_path;
            $file_name = RandomNum();
            $url = $params_arr['content'];
            $size = '6';
            $result = $qrcode->generateBarcode( $storage_path,$file_name,$url , $size);
            
            $return = UPLOAD_URL.$upload_path.$result;
            echo api_success($return);
            
        } catch ( Exception $e ) {
            echo api_error($e->getCode(), $e->getMessage());
        }
    }
    
}
