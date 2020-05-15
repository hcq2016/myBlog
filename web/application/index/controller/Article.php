<?php
namespace app\index\controller;
use think\Controller;//引入Controller类


class Article extends Controller
{
    private $template_path = TEMPLATE_URL;
    

    public function detail($aid='')
    {
        if (empty($aid)){
            return 'fail';
        }
        
        $Article_mdl = model('Article');
        $detail = $Article_mdl->get_article_detail($aid);
        $detail['reply_list'] = $Article_mdl->get_article_reply($aid);
        $detail['path'] = 'article:items:'.$detail['id'];
        
        $menu = get_menu(1);
        $this->assign($menu);
        $this->assign($detail);
        return $this->fetch('details');
    }
    
    
}
