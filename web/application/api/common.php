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
use think\config;

function config_item(){
   $config = Config::load('config.php');
   $api_errno = $config['api_errno'];
   return $api_errno;
}

/**
 * 接口处理函数
 * User: dong
 * Date: 2019/7/17
 * Time: 09:54
 */


if (! function_exists('api_response')) {
    function api_response($code, $message='', $data=null, $type='json', $push=false) {

        static $api_errno;
        if (is_null($api_errno)) {
            $api_errno = config_item('api_errno') ?: [];
        }

        $response = [
            'code'    => $code,
            'message' => $api_errno[$code] ?? $message
        ];

        if (! is_null($data)) {
            $response['data'] = $data;
        }

        switch (strtoupper($type)) {
            case 'XML':
                header('content-type: text/xml');
                $result = xmlEncode($response);
                break;
            case 'JSONP':
                header('content-type: application/javascript');
                $result = 'callback(' . json_encode($response, JSON_UNESCAPED_UNICODE) . ')';
                break;
            case 'JSON':
            default:
                header('content-type: application/json');
                $result = json_encode($response, JSON_UNESCAPED_UNICODE);
                break;
        }

        if ($push === true) {
            echo $result;exit(0);
        } else {
            return $result;
        }
    }
}

if (! function_exists('xmlEncode')) {
    /**
     * XML编码
     * @param mixed $data 数据
     * @param string $root 根节点名
     * @param string $item 数字索引的子节点名
     * @param string $attr 根节点属性
     * @param string $id   数字索引子节点key转换的属性名
     * @param string $encoding 数据编码
     * @return string
     */
    function xmlEncode($data, $root='root', $item='item', $attr='', $id='index', $encoding='utf-8')
    {
        if (is_array($attr)) {
            $array = [];
            foreach ($attr as $key => $value) {
                $array[] = "{$key}=\"{$value}\"";
            }
            $attr = implode(' ', $array);
        }
        $attr = trim($attr);
        $attr = empty($attr) ? '' : " {$attr}";
        $xml  = "<?xml version=\"1.0\" encoding=\"{$encoding}\"?>";
        $xml .= "<{$root}{$attr}>";
        $xml .= dataToXml($data, $item, $id);
        $xml .= "</{$root}>";
        return $xml;
    }
}

if (! function_exists('dataToXml')) {
    /**
     * 数据XML编码
     * @param mixed  $data 数据
     * @param string $item 数字索引时的节点名称
     * @param string $id   数字索引key转换为的属性名
     * @return string
     */
    function dataToXml($data, $item, $id)
    {
        $xml = $attr = '';
        foreach ($data as $key => $val) {
            if (is_numeric($key)) {
                $id && $attr = " {$id}=\"{$key}\"";
                $key         = $item;
            }
            $xml .= "<{$key}{$attr}>";
            $xml .= (is_array($val) || is_object($val)) ? dataToXml($val, $item, $id) : $val;
            $xml .= "</{$key}>";
        }
        return $xml;
    }
}



if (! function_exists('api_error')) {
    /**
     * 输出错误接口信息
     * @param $code
     * @param string  $message
     * @param mixed   $data
     * @param boolean $push
     * @return string
     */
    function api_error ($code, $message='', $data=null, $push=false) {
        return api_response($code, $message, $data, 'json', $push);
    }
}


if (! function_exists('api_success')) {
    /**
     * 输出成功接口信息
     * @param null $data
     * @param boolean $push
     * @return string
     */
    function api_success ($data=null, $push=false) {
        return api_response(0, '', $data, 'json', $push);
    }
}


if (! function_exists('api_page')) {
    /**
     * 输出分页接口信息
     * @param $page
     * @param $size
     * @param array $data
     * @param int $count
     * @param array $append_params
     * @param bool $push
     * @return string
     */
    function api_page ($page, $size, $data=[], $count=0, $append_params=[], $push=false) {
        $response = [
            'page'  => $page,
            'size'  => $size,
            'items' => $data,
            'count'  => $count
        ];
        if (!empty($append_params) && is_array($append_params)) {
            $response = array_merge($response, $append_params);
        }
        return api_response(0, '', $response, 'json', $push);
    }
}



if(!function_exists('analysis_json')){
    /**
     * @param $json
     * @return mixed
     * @throws Exception
     */
    function analysis_json($json){
        $json = json_decode($json,true);
        if($json["code"] == 0){
            return $json["data"];
        }else{
            throw new Exception($json["code"]);
        }
    }
}
if(!function_exists('RandomNum')){
    /**
     * 得到新订单号
     * @return  string
     */
    function RandomNum()
    {
        return date('Ymd') . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
    }
}
