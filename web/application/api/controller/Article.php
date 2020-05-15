<?php
namespace app\api\controller;
use think\Controller;//引入Controller类
use  think\Request;
use think\Exception;

class Article extends Controller
{
    
    public function reply()
    {
        try {
            $params = Request::instance()->param('params');
            $params_arr = json_decode($params, true);
            $aid = $params_arr['aid'];
            $desc = $params_arr['desc'];
            
            $Article_mdl = model('Article');
            $detail = $Article_mdl->artictile_reply($aid, $desc);
            
            
            echo api_success($detail);
            
        } catch (\Exception $e){
            return $e->getMessage();
            echo api_error($e->getCode(), $e->getMessage());
        }
    }
    
}
