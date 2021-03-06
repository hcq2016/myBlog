<?php
namespace app\index\controller;
use think\Controller;//引入Controller类


class Index extends Controller
{
    private $template_path = TEMPLATE_URL;
    
    public function index($name='world')
    {

        $Article_mdl = model('Article');
        $detail = $Article_mdl->get_article_list();
        $this->assign('list', $detail);
//         echo json_encode($detail);
//         exit;
        
        $menu = get_menu(1);
        $this->assign($menu);
        return $this->fetch('article');
    }
    
    public function tools(){
        $menu = get_menu(2);
        
        $this->assign($menu);
        return $this->fetch('tools');
        exit;
    }
    
    public function about(){
//         echo '<pre>';
//         print_r($_SERVER);
//         return ;
        $menu = get_menu(4);
        
        $this->assign($menu);
        return $this->fetch('about');
    }
    
    public function leacots(){
        $menu = get_menu(3);
        
        $this->assign($menu);
        return $this->fetch('leacots');
    }
    
    public function test(){
        return 33;
    }
    
//     http://localhost/thinkphp/web/public/index.php/index/index/test2
    public function test2($name='world'){
//         $data = Db::name('customer')->find();
//         $data = json_encode($data);
        $this->assign('result',$name);
        return $this->fetch();
    }
}
