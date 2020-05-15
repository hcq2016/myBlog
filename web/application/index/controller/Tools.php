<?php
namespace app\index\controller;
use think\Controller;//引入Controller类
use think\Db;//引入数据库

class Tools extends Controller
{
    private $template_path = TEMPLATE_URL;
    
    /*
     * Echats生成图表
     */
    public function echats()
    {
        $menu = get_menu(2);
        
        $this->assign($menu);
        return $this->fetch('echats');
    }
    
    
    /*
     * mysql 数据库结构设计文档生成器 页面
     */
    public function mysql_tables_list(){
        $menu = get_menu(2);
        
        $this->assign($menu);
        return $this->fetch('mysqlTablesList');
    }
    
    
    /*
     * 生成二维码
     */
    public function general_qrcode(){
        $menu = get_menu(2);
        
        $this->assign($menu);
        return $this->fetch('generalQrcode');
    }
    
}
