<?php
namespace app\index\model;

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
    
    public function get_article_detail($id){
        $result = Db::connect('db_mongo')
        ->table('article_info')
        ->where('id', $id)
        ->find();
        return $result;
    }
    
    public function get_article_list(){
        $result = Db::connect('db_mongo')
        ->table('article_info')
        ->select();
        return $result; 
    }
    
    public function get_article_reply($article_id){
        $result = Db::connect('db_mongo')
        ->table('article_reply')
        ->where('article_id', $article_id)
        ->order('create_date', 'desc')
        ->select();
        return $result;
    }
    
}
