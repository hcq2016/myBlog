<?php
namespace app\api\model;

use think\Model;
use think\Db;//引入数据库

class Article extends Model
{
    private $db;

    //自定义初始化
    protected function initialize()
    {
        //需要调用`Model`的`initialize`方法
        parent::initialize();
        
    }
    
    
    public function artictile_reply($article_id, $desc){
        $result = Db::connect('db_mongo')
        ->table('article_reply')
        ->insert(array(
            'user_name' => '游客',
            'article_id' => $article_id,
            'desc' => $desc,
            'create_date' => date('Y-m-d H:i:s')
            
        ));
        return $result;
    }
    
}
