<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件
define('BASE_URL', ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://") . $_SERVER['HTTP_HOST'] . rtrim(str_replace('\\', '/', '/'.dirname(str_replace($_SERVER['DOCUMENT_ROOT'], '', $_SERVER['SCRIPT_FILENAME']))), '/'));
define('TEMPLATE_URL', BASE_URL . '/static/');
define('UPLOAD_URL', dirname(BASE_URL).'/');

function get_menu($active){
//     echo '<pre>';
//     echo print_r($_SERVER);
//     echo '<br>';
//     echo dirname(str_replace($_SERVER['DOCUMENT_ROOT'], '', $_SERVER['SCRIPT_FILENAME']));exit;
    $menu  = array(
        array(
            'action' => 'article',
            'name' => '文章',
            'url' => BASE_URL.'/index.php/index/index/index',
            'active' => $active==1?'active':''
        ),
        array(
            'action' => 'tools',
            'name' => '工具',
            'url' => BASE_URL.'/index.php/index/index/tools',
            'active' => $active==2?'active':''
        ),
        array(
            'action' => 'leacots',
            'name' => '留言',
            'url' => BASE_URL.'/index.php/index/index/leacots',
            'active' => $active==3?'active':''
        ),
        array(
            'action' => 'about',
            'name' => '关于',
            'url' => BASE_URL.'/index.php/index/index/about',
            'active' => $active==4?'active':''
        ),
    );
    $result = array(
        'menu' => $menu,
        'template_path' => TEMPLATE_URL,
        'base_url' => BASE_URL
    );
    return $result;
}