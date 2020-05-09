/**
 * 编辑页 js
 */
(function (window) {

    /**
     *
     * 通用配置
     * @type {{module: string}}
     */
    var configs = {
        module: 'edu',  // 模块名
    };

    var site_url = window.location.href.split('_' + configs.module)[0] + '_' + configs.module;

    /**
     * 獲取網站根地址
     * @param uri
     * @returns {string}Cookies
     */
    var get_site_url = function (uri) {
        var res = site;
        if (Object.prototype.toString.call(uri) == '[object String]') {
            res += uri;
        }
        return res;
    };

    /**
     * 获取 csrf
     * @returns {[null,null]}
     */
    var getCsrf = function () {
        var cookie_name = 'csrf_cookie_name';
        var val = Cookies.get(cookie_name);
        var csrf = [
            'csrf_token',
            (val === undefined ? '' : val),
        ];

        return csrf;
    }

    /**
     * 提交
     * @param servicename 服务名
     * @param method 方法名
     * @param data 表单 JSON
     * @param callback  回调方法
     */
    var formsubmit = function ( data, functionname, callback) {
        layui.define(['layer', 'form'], function (exports) {
            var layer = layui.layer
                , form = layui.form;

            var token = Cookies.get('token');
            if (token == undefined) {
                token = '';
            }
            data.append("token", token);

            var csrf = getCsrf();
            data.append(csrf[0], csrf[1]);

            // 禁止按钮
            var formsubmit_load = layer.load();
            var operationbutton = $(".operation-button");
            operationbutton.attr('disabled', true);
            $.ajax({
                url: api_path+'/index.php/'+functionname,
                type: 'post',
                data: data,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data["code"] == "9998") {
                        location.href = site + "login";
                        return;
                    } else if (data['code'] != 0) {
                        if (data['msg'] == null) {
                            // layer.msg(Language.api_msg_trans(1));
                        } else {
                            layer.msg(data['message'], {
                                icon: 2,
                                time: 2000 //2秒关闭（如果不配置，默认是3秒）
                            });
                            // layer.msg(data['msg']);
                        }
                        return;
                    }

                    if (callback) {
                        if (typeof(window[callback]) == 'function') {
                            window[callback](data);
                        } else {
                            window.location.reload();
                        }

                    }
                },
                complete: function () {
                    layer.close(formsubmit_load);
                    // 解除按钮
                    operationbutton.attr('disabled', false);
                },
                error: function (err) {
                    layer.close(formsubmit_load);
//                    layer.msg(err,{time: 2000});
                    console.log(err);
                    return;
                }
            })
        });

    };

    /**
     * 兼容ie9提交方案
     * @param servicename 服务名
     * @param method 方法名
     * @param data 表单 string (非FormData对象的数据)
     * @param callback  回调方法
     * */
    var submit = function (data, callback) {
        layui.define(['layer', 'form'], function () {
            var layer = layui.layer;

            var csrf = getCsrf();

            var loading = layer.load();
            // 禁止按钮
            operationbutton = $(".operation-button");
            operationbutton.attr('disabled', true);

            if (typeof FormData == 'undefined') {
                var formdata = {
                    params: data
                };
                /*兼容ie9不支持FormData*/
                formdata[csrf[0]] = csrf[1];
                $.post(api_path, formdata, function (result) {
                    layer.close(loading);
                    // 解除按钮
                    operationbutton.attr('disabled', false);
                    if (result["code"] == "1007") {
                        layer.msg("没有权限", {
                            icon: 2,
                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                        });
                        return;
                    } else if (result["code"] == "1005") {
                        location.href = site + "login";
                        return;
                    } else if (result['code'] != 0) {
                        if (result['msg'] == null) {
                            layer.msg(Language.api_msg_trans(1), {
                                icon: 2,
                                time: 2000 //2秒关闭（如果不配置，默认是3秒）
                            });

                            // layer.msg(Language.api_msg_trans(1));
                        } else {
                            layer.msg(Language.api_msg_trans(result['code'], result['msg']), {
                                icon: 2,
                                time: 2000 //2秒关闭（如果不配置，默认是3秒）
                            });
                            // layer.msg(Language.api_msg_trans(result['code'], result['msg']));
                        }
                        return;
                    }
                    if (callback) {
                        window[callback](result);
                    }
                });
            } else {
                var formdata = new FormData();
                formdata.append("params", data);
                /*原来方法*/
                formdata.append("servicename", servicename);
                formdata.append("method", method);
                formdata.append("token", token);
                formdata.append(csrf[0], csrf[1]);
                $.ajax({
                    url: api_path,
                    type: 'post',
                    data: formdata,
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data["code"] == "1007") {
                            layer.msg("没有权限", {
                                icon: 2,
                                time: 2000 //2秒关闭（如果不配置，默认是3秒）
                            });
                            // layer.msg("没有权限", {time: 2000});
                            return;
                        } else if (data["code"] == "1005") {
                            location.href = site + "login";
                            return;
                        } else if (data['code'] != 0) {
                            if (data['msg'] == null) {
                                layer.msg(Language.api_msg_trans(1), {
                                    icon: 2,
                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                });

                                // layer.msg(Language.api_msg_trans(1));
                            } else {
                                layer.msg(Language.api_msg_trans(data['code'], data['msg']), {
                                    icon: 2,
                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                });
                                // layer.msg(Language.api_msg_trans(data['code'], data['msg']));
                            }
                            return;
                        }
                        if (callback) {
                            window[callback](data);
                        }
                    },
                    complete: function (data) {
                        layer.close(loading);
                        // 解除按钮
                        operationbutton.attr('disabled', false);
                        console.log('3', data);
                        // alert(data);
                    },
                    error: function (err) {
                        layer.close(loading);
                        //layer.msg(err,{time: 2000});
                        console.log(err);
                        return;
                        // alert(err);
                    }
                });
            }
        });
    };

    /**
     * editing
     * #id 表单id
     * 编辑 区分创建还是修改
     */
    var editing = function () {
        paramsObj = Formsubmit.getHash();
        if (paramsObj["id"]) {
            $("#id").val(paramsObj["id"]);
        }
    }

    window.layui_page = 1;                  //定义分页的页数全局变量
    window.layui_perpage = 20;              //定义分页的条数全局变量
    window.isbullet_box = 0;              //用于弹窗是否重新渲染分页
    /**
     * note: 针对部分弹窗需要重新渲染分页而不需要重新渲染当前页面，可以设置全局变量isbullet_box ==1
     * layui 分页列表
     * @param servicename
     * @param method
     * @param callback
     */
    var listing = function (servicename, method, callback) {
        layui.define(['layer', 'form'], function (exports) {
            var layer = layui.layer;
            if (typeof(callback) == 'undefined') {
                callback = "listcallback";
            }
            var token = Cookies.get('token');
            if (token == undefined) {
                token = '';
            }

            var csrf = getCsrf();

            //----------------------------------------------
            hashObj = Formsubmit.getHash();
            Object.keys(hashObj).forEach(function (key) {
                if (key == 'layui_page') {
                    layui_page = hashObj[key]
                }
            });
            params = JSON.stringify(hashObj);
            //----------------------------------------------
            if (typeof FormData == 'undefined') {
                var data = {
                    params: params,
                    pageinfo: '{"page":"' + _page + '","perpage":"' + _perpage + '"}'
                };
                data.servicename = servicename;
                data.method = method;
                data.token = token;
                data.csrf[0] = csrf[1];

                // 禁止按钮
                operationbutton = $(".operation-button");
                operationbutton.attr('disabled', true);

                $.post(api_path, data, function (result) {
                    // 解除按钮
                    operationbutton.attr('disabled', false);

                    if (result["code"] == "1007") {
                        layer.msg("没有权限", {
                            icon: 2,
                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                        });

                        // layer.msg("没有权限", {time: 2000});
                        return;
                    } else if (result["code"] == "1005") {
                        location.href = site + "login";
                        return;
                    } else if (result['code'] != 0) {
                        if (result['msg'] == null) {
                            layer.msg(Language.api_msg_trans(1), {
                                icon: 2,
                                time: 2000 //2秒关闭（如果不配置，默认是3秒）
                            });

                            // layer.msg(Language.api_msg_trans(1));
                        } else {
                            layer.msg(Language.api_msg_trans(result['code'], result['msg']), {
                                icon: 2,
                                time: 2000 //2秒关闭（如果不配置，默认是3秒）
                            });

                            // layer.msg(Language.api_msg_trans(result['code'], result['msg']));
                        }
                        return;
                    }
                    if (callback) {
                        window.layui_get_data = result;                 //定义一个公共的变量
                        window[callback](result);
                    }
                    //有查询，分页
                    if (result.code == 0 && result.data) {
                        if (layui_get_data && layui_get_data.data['pageinfo']) {
                            if (params != "{}" || isbullet_box == 1) {
                                layui.use('laypage', function () {
                                    var laypage = layui.laypage;
                                    //分页为1不再渲染分页
                                    if (layui_page == 1) {
                                        //执行一个laypage实例
                                        laypage.render({
                                            elem: 'pageinfo',
                                            prev: Language.api_msg_trans('prev', 'prev'),
                                            next: Language.api_msg_trans('next', 'next'),
                                            first: Language.api_msg_trans('first', 'first'),
                                            last: Language.api_msg_trans('last', 'last'),
                                            count_en: Language.api_msg_trans('count_en', 'count_en'),
                                            article_en: Language.api_msg_trans('article_en', 'article_en'),
                                            branches_en: Language.api_msg_trans('branches_en', 'branches_en'),
                                            to_en: Language.api_msg_trans('to_en', 'to_en'),
                                            di_en: Language.api_msg_trans('di_en', 'di_en'),
                                            page_en: Language.api_msg_trans('page_en', 'page_en'),
                                            determine_en: Language.api_msg_trans('determine_en', 'determine_en'),
                                            count: layui_get_data.data["pageinfo"]["count"],
                                            limit: layui_get_data.data["pageinfo"]["perpage"],
                                            curr: layui_get_data.data["pageinfo"]["page"],
                                            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                                            jump: function (obj, first) {
                                                if (!first) {
                                                    layui_page = obj.curr;
                                                    layui_perpage = obj.limit;
                                                    list();
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                var layui_listing_load = layer.load();
                var data = new FormData();
                data.append("params", params);
                data.append("pageinfo", '{"page":"' + layui_page + '","perpage":"' + layui_perpage + '"}');
                data.append("servicename", servicename);
                data.append("method", method);
                data.append("token", token);
                data.append(csrf[0], csrf[1]);
                // 禁止按钮
                operationbutton = $(".operation-button");
                operationbutton.attr('disabled', true);
                $.ajax({
                    url: api_path,
                    type: 'post',
                    data: data,
                    async: false,
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        // 解除按钮
                        operationbutton.attr('disabled', false);
                        if (data["code"] == "1007") {
                            layer.msg("没有权限", {
                                icon: 2,
                                time: 2000 //2秒关闭（如果不配置，默认是3秒）
                            });
                            // layer.msg("没有权限", {time: 2000});
                            return;
                        } else if (data["code"] == "1005") {
                            location.href = site + "login";
                            return;
                        } else if (data['code'] != 0) {
                            if (data['msg'] == null) {
                                layer.msg(Language.api_msg_trans(1), {
                                    icon: 2,
                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                });

                                // layer.msg(Language.api_msg_trans(1));
                            } else {
                                layer.msg(Language.api_msg_trans(data['code'], data['msg']), {
                                    icon: 2,
                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                });
                                // layer.msg(Language.api_msg_trans(data['code'], data['msg']));
                            }
                            return;
                        }
                        if (callback) {
                            window.layui_get_data = data;                 //定义一个公共的变量
                            window[callback](data);
                        }
                        //有查询，分页
                        if (data.code == 0 && data.data) {
                            if (layui_get_data && layui_get_data.data['pageinfo']) {
                                layui.use('laypage', function () {
                                    var laypage = layui.laypage;
                                    //分页为1不再渲染分页
                                    if (layui_page == 1) {
                                        // 执行一个laypage实例
                                        laypage.render({
                                            elem: 'pageinfo',
                                            prev: Language.api_msg_trans('prev', 'prev'),
                                            next: Language.api_msg_trans('next', 'next'),
                                            first: Language.api_msg_trans('first', 'first'),
                                            last: Language.api_msg_trans('last', 'last'),
                                            count_en: Language.api_msg_trans('count_en', 'count_en'),
                                            article_en: Language.api_msg_trans('article_en', 'article_en'),
                                            branches_en: Language.api_msg_trans('branches_en', 'branches_en'),
                                            to_en: Language.api_msg_trans('to_en', 'to_en'),
                                            di_en: Language.api_msg_trans('di_en', 'di_en'),
                                            page_en: Language.api_msg_trans('page_en', 'page_en'),
                                            determine_en: Language.api_msg_trans('determine_en', 'determine_en'),
                                            count: layui_get_data.data["pageinfo"]["count"],
                                            limit: layui_get_data.data["pageinfo"]["perpage"],
                                            curr: location.hash.replace('layui_page=', ''),
                                            hash: 'layui_page',
                                            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                                            jump: function (obj, first) {
                                                if (!first) {
                                                    layui_page = obj.curr;
                                                    layui_perpage = obj.limit;
                                                    hashObj = Formsubmit.getHash();
                                                    hashObj['layui_page'] = layui_page
                                                    hashObj_params = Formsubmit.createHash(hashObj);
                                                    url = window.location.href;
                                                    url = url.split("#")[0];
                                                    location.href = url + "#" + hashObj_params;
                                                    list();
                                                }
                                            }
                                        });
                                    }

                                });
                            }
                        }
                    },
                    complete: function (com) {
                        layer.close(layui_listing_load);
                    },
                    error: function (err) {
                        layer.msg(err.message, {time: 2000, icon: 2});
                        return;
                    }
                })

            }
        });
    }

    /**
     * layui 自带的分页
     */
    var pageinfo = function (data) {
        count = layui_get_data.data["pageinfo"]["count"];
        perpage = layui_get_data.data["pageinfo"]["perpage"];
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'pageinfo',
                prev: Language.api_msg_trans('prev', 'prev'),
                next: Language.api_msg_trans('next', 'next'),
                first: Language.api_msg_trans('first', 'first'),
                last: Language.api_msg_trans('last', 'last'),
                count_en: Language.api_msg_trans('count_en', 'count_en'),
                article_en: Language.api_msg_trans('article_en', 'article_en'),
                branches_en: Language.api_msg_trans('branches_en', 'branches_en'),
                to_en: Language.api_msg_trans('to_en', 'to_en'),
                di_en: Language.api_msg_trans('di_en', 'di_en'),
                page_en: Language.api_msg_trans('page_en', 'page_en'),
                determine_en: Language.api_msg_trans('determine_en', 'determine_en'),
                count: count,
                limit: perpage,
                curr: layui_page,
                hash: 'layui_page',
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (obj, first) {
                    if (!first) {
                        layui_page = obj.curr;
                        layui_perpage = obj.limit;
                        hashObj = Formsubmit.getHash();
                        hashObj['layui_page'] = layui_page
                        hashObj_params = Formsubmit.createHash(hashObj);
                        url = window.location.href;
                        url = url.split("#")[0];
                        location.href = url + "#" + hashObj_params;
                        list();
                    }
                }
            });
        });
    }

    /**
     * 分页跳转
     * page页数
     * 有分页回调函数必须list()
     */
    var pagejump = function (page_number) {
        hashObj = getHash();
        hashStr = Formsubmit.createHash(hashObj);
        hashStr = hashStr.replace(/page=[0-9]*$/, "page=" + page_number);
        url = window.location.href;
        url = url.split("#")[0];
        url = url + "#" + hashStr;
        location.href = url;
        list();
    }

    /**
     * 自定义确定分页跳转
     * page页数
     * 有分页回调函数必须list()
     */
    var customize_pagejump = function () {
        try {
            page_number = $("#page_number").val();
            rep = /^\+?[1-9][0-9]*$/;
            if (page_number < 1 || !(rep.test(page_number))) {
                throw "请填写正确的页数";
            }
            Formsubmit.pagejump(page_number);
        } catch (err) {
            layer.msg(err, {time: 2000});
        }

    }

    /**
     * 搜索
     * 搜索回调函数必须list()
     */
    var search = function () {
        hashObj = getQueryVal();
        if (hashObj === false) {
            return false;
        }
        Object.keys(hashObj).forEach(function (key) {
            if (!hashObj[key]) {
                delete hashObj[key]
            }
        });
        hashstring_Obj = JSON.stringify(hashObj);
        url = window.location.href;
        url = url.split("#")[0];
        if (hashstring_Obj != "{}") {
            hashstring = Formsubmit.createHash(hashObj);
            location.href = url + "#" + hashstring;
        } else {
            location.href = url + "#";
        }

        layui_page = 1;
        list();
    }

    /**
     * 以对象形式返回查询参数，表单 id 规定为 listForm
     * @returns {{}}
     */
    var getQueryVal = function () {
        var formData = $('#listForm').serializeArray();
        var formObj = {};
        var is_special_characters = 0;      //用于判断是否有特殊字符
        $.each(formData, function (k, v) {
            // if (new RegExp("[`!@#$^&*()=|{}':;',\\[\\].<>?！@#￥……&*（）——|{}【】‘；：”“'。，、？]").test(v['value'])) {
            //     is_special_characters = 1;
            //     $("input[name="+v['name']+"]").val('');
            //     return false;
            // } else {
            //     formObj[v['name']] = v['value'];
            // }

            formObj[v['name']] = v['value'];
        })

        if (is_special_characters == 1) {
            layer.msg(Language.api_msg_trans('special_characters'), {
                icon: 2,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                return false;
            });
            return false;
        } else {
            // formObj['page'] = 1;             //暂时屏蔽掉分页的传参
            return formObj;
        }
    }

    /**
     * 品牌，分校，员工，操作日志，过敏源 要做中文繁体搜索
     */
    var search_lang = function () {
        hashObj = getQueryVal_lang();
        hashstring = Formsubmit.createHash(hashObj);
        url = window.location.href;
        url = url.split("#")[0];
        location.href = url + "#" + hashstring;
        layui_page = 1;
        list();
    }
    var getQueryVal_lang = function () {
        var formData = $('#listForm').serializeArray();
        var formObj = {};
        $.each(formData, function (k, v) {
            formObj[v['name']] = Language.trans_tw_to_cn(v['value']);//把繁体转为简体
        })
        // formObj['page'] = 1;             //暂时屏蔽掉分页的传参
        return formObj;
    }

    /**
     * 创建 hash 字符串
     * @param hashObj
     * @returns {Array}
     */
    var createHash = function (hashObj) {
        var res = [];
        if (Object.prototype.toString.call(hashObj) == '[object Object]') {
            $.each(hashObj, function (k, v) {
                res.push(k + '=' + v);
            })
        }
        res = res.join('&');
        return res;
    }

    /**
     * 获取 hash 并以对象形式返回参数
     * @returns {{}}
     */
    var getHash = function () {
        var hash = location.hash.replace(/^#/, '');
        var hashObj = {};
        if (hash != '' && hash.indexOf('=') != -1) {
            hash = hash.split('&');
            hash.forEach(function (item) {
                item = item.split('=');
                hashObj[item[0]] = decodeURI(item[1]);

                // item = item.split('=');
                // if (!new RegExp("[`~!@#%$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]").test(item[1])) {
                //     // item[1] = Formsubmit.encodeSearchKey(item[1]);
                //     hashObj[item[0]] = decodeURI(item[1]);
                // } else {
                //     item[1] = Formsubmit.encodeSearchKey(item[1]);
                //     hashObj[item[0]] = item[1];
                // }
            })
        }

        // 如果 hash 为空或者没有 cur_page 项，cur_page 默认为 1
        if (Object.keys(hashObj).length == 0 || !hashObj.hasOwnProperty('page')) {
            // hashObj['page'] = 1;
        }
        return hashObj;
    };

    /**
     * 根据提交的信息获取信息详情
     * @param param 查询条件{id:1}
     * @param servicename 服务名
     * @param method 方法
     */
    var get_detail = function (param, servicename, method, callback) {
        var data = new FormData();
        var params = JSON.stringify(param);
        data.append("params", params);
        Formsubmit.formsubmit(servicename, method, data, callback);
    }

    /**
     * 删除列表项
     * @param servicename 服务名
     * @param method 方法
     * @param id
     */
    var del = function (servicename, method, id, callback) {
        // 转成json 字符串
        if (typeof(id) != "object") {
            id = '["' + id + '"]';
        } else {
            id = JSON.stringify(id);
        }

        params = '{"id":' + id + '}';
        layer.confirm(Language.api_msg_trans('layer_del_content'), function (index) {
            //关闭弹窗
            layer.close(index);
            // 随便写点
            var data = new FormData();
            data.append("params", params);
            Formsubmit.formsubmit(servicename, method, data, callback);
        })


    }

    /**
     * 去除 null
     * @param val
     * @returns {string}
     */
    var removeNull = function (val) {
        return val === null || undefined ? '' : val;
    }

    /**
     * 对数组进行处理
     * @param val
     * @param name
     * @returns {string}
     */
    var arrayTostring = function (val, name,join) {
        if(join==undefined){
            join='<br/>';
        }
        var str = '';
        if (typeof val === 'object' && !isNaN(val.length)) {
            for (var i = 0; i < val.length; i++) {
                if(i==val.length-1){
                    if (name != '') {
                        str += val[i][name];
                    } else {
                        str += val[i];
                    }
                }else{
                    if (name != '') {
                        str += val[i][name] + join;
                    } else {
                        str += val[i] + join;
                    }
                }

            }
        }
        return str;
    }

    /**
     * 动态获取下拉框，不支持下拉框分页
     * @param servicename 服务名
     * @param method 函数
     * @param data 查询条件
     * @param select_id  设置下拉框ID
     * @param select_value  显示下拉框对应的值
     * @param select_name_cn  显示中文名称
     * @param select_name_en  显示英文名称
     * @param select_name_tw  显示繁体名称
     */
    var getselectdata = function (servicename, method, data, select_id, select_value, select_name_cn, select_name_tw, select_name_en, callback) {
        layui.use(['form', 'layer'], function () {
            var layer = layui.layer;
            form = layui.form;
        });
        var language = Cookies.get('language');
        data.append("pageinfo", JSON.stringify({"page": "1", "perpage": "10000000"}));
        data.append("servicename", servicename);
        data.append("method", method);
        token = Cookies.get('token');
        if (token == undefined) {
            token = '';
        }
        data.append("token", token);

        var csrf = getCsrf();
        data.append(csrf[0], csrf[1]);
        $.ajax({
            url: api_path,
            type: 'post',
            data: data,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.code == 0 && data.data.list) {
                    window.getselectdata_itemlist_data = data.data.list;        //应用于账单付款项目，勿删除;
                    for (var i = 0; i < data.data.list.length; i++) {
                        var option = document.createElement("option");
                        option.setAttribute("value", data.data.list[i][select_value]);
                        if (language && language == 'en-us') {
                            if (select_name_en && data.data.list[i][select_name_en]) {
                                option.innerText = data.data.list[i][select_name_en];
                            } else if (select_name_tw && data.data.list[i][select_name_tw]) {
                                option.innerText = data.data.list[i][select_name_tw];
                            } else {
                                option.innerText = data.data.list[i][select_name_cn];
                            }
                        } else if (language && language == 'zh-tw') {
                            if (select_name_tw && data.data.list[i][select_name_tw]) {
                                option.innerText = data.data.list[i][select_name_tw];
                            } else {
                                option.innerText = data.data.list[i][select_name_cn];
                            }
                        } else {
                            if (!select_name_cn || !data.data.list[i][select_name_cn]) {
                                option.innerText = data.data.list[i][select_name_tw];
                            } else {
                                option.innerText = data.data.list[i][select_name_cn];
                            }
                        }
                        document.getElementById(select_id).appendChild(option);
                        form.render("select");
                    }

                    if (callback) {
                        if (typeof(window[callback]) == 'function') {
                            window[callback](data.data.list);
                        }

                    }
                }
            },
            error: function (err) {
                layer.msg(err, {time: 2000, icon: 2});
            }
        })
    }

    /**
     * 上传文件
     * @param file_data  js文件数据file[0]
     * @param callback
     */
    var upload_file = function (file_data, callback) {
        var data = new FormData();
        //
        var filename=file_data.name;
        var index1=filename.lastIndexOf(".");
        var index2=filename.length;
        var type=filename.substring(index1+1,index2).toLowerCase();
        if(type=='pdf'){
            //判断图片大小是否超过2M
            var file_size = file_data.size / 1024;
            if (file_size > 5100) {
                layer.msg(Language.api_msg_trans('UploadFileSizeGreaterThan5MB','UploadFileSizeGreaterThan5MB'));
                return false;
            }
        }else{
            //判断图片大小是否超过2M
            var file_size = file_data.size / 1024;
            if (file_size > 2048) {
                layer.msg(Language.api_msg_trans('UploadFileSizeGreaterThan2MB','UploadFileSizeGreaterThan2MB'));

                return false;
            }
        }
        var upload_file_load;
        var csrf = getCsrf();
        data.append(csrf[0], csrf[1]);
        data.append('field', file_data);
        var operationbutton = $(".operation-button");
        operationbutton.attr('disabled', true);
        $.ajax({
            url: api_upload_path,
            data: data,
            dataType: "json",
            type: "post",
            beforeSend: function (e) {
                upload_file_load = layer.load();
            },
            processData: false,
            contentType: false,
            headers: {
                // Accept: "application/json; charset=utf-8",
                'veosem-Custom-Key':'veosem2019'
            },
            success: function (data) {
                window[callback](data);
            },
            complete: function () {
                // 解除按钮
                operationbutton.attr('disabled', false);
                // layer.close(layer.load(2));
                layer.close(upload_file_load);
            },
            error: function (err) {
                layer.msg(err, {
                    icon: 2,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });

                // layer.msg(err, {time: 2000});
                // console.log(err);
                return;
            }
        })
    }


    //将100000转为100,000.00形式
    var dealNumber = function (money) {
        if (money && money != null) {
            money = String(money);
            var left = money.split('.')[0], right = money.split('.')[1];
            right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
            var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
            return (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
        } else if (money === 0) {   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
            return '0.00';
        } else {
            return "";
        }
    };

    //将100000转为100,000形式
    var NumdealNumber = function (money) {
        if (money && money != null) {
            money = String(money);
            var left = money.split('.')[0], right = money.split('.')[1];
            right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
            var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
            return (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('');
        } else if (money === 0) {   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
            return '0';
        } else {
            return "";
        }
    };

    //将100,000.00转为100000形式
    var undoNubmer = function (money) {
        if (money && money != null) {
            money = String(money);
            var group = money.split('.');
            var left = group[0].split(',').join('');
            return Number(left + "." + group[1]);
        } else {
            return "";
        }
    };

    //将100,000.00转为100000形式
    var NumundoNubmer = function (money) {
        if (money && money != null) {
            money = String(money);
            var group = money.split('.');
            var left = group[0].split(',').join('');
            return Number(left);
        } else {
            return "";
        }
    };

    //将URL参数回填到listForm
    var refillForm = function () {
        var hasObj = getHash();
        for (var p in hasObj) {//遍历json对象的每个key/value对,p为key
            $("#listForm [name='" + p + "']").val(hasObj[p]);
        }
        // pageinfo();
        form.render();
        return true;
    };

    /**
     * 字符串加密
     * @param code
     * @returns {*}
     */
    function compileStr(code) {
        var c = String.fromCharCode(code.charCodeAt(0) + code.length);
        for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
        }
        return escape(c);
    }

    /**
     * 字符串解密
     * @param code
     * @returns {string}
     */
    function uncompileStr(code) {
        code = unescape(code);
        var c = String.fromCharCode(code.charCodeAt(0) - code.length);
        for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
        }
        return c;
    }


    function encodeSearchKey(key) {
        var encodeArr = [{
            code: '%',
            encode: '%25'
        }, {
            code: '?',
            encode: '%3F'
        }, {
            code: '#',
            encode: '%23'
        }];
        return key.replace(/[%?#&=]/g, function ($, index, str) {
            for (var k in encodeArr) {
                if (encodeArr[k].code === $) {
                    return encodeArr[k].encode;
                }
            }
        });
    }

    function getCookie(name){
        var cookieStr=document.cookie;
        if (cookieStr.length) {
            if (cookieStr.indexOf(name) !== -1) {
                var start_index = cookieStr.indexOf(name) + name.length + 1;
                var end_index = cookieStr.indexOf(';', start_index);
                if(end_index===-1){//若是最后一对cookie则不以；分号结尾
                    end_index=cookieStr.length;
                }
                return cookieStr.substring(start_index, end_index);
            }
        }
        return '';
    }

    //检测数组中是否存在某个字符串
    function in_array(search,array){
        for(var i in array){
            if(array[i]==search){
                return true;
            }
        }
        return false;
    }


    window.Formsubmit = {
        get_site_url: get_site_url,  // 根地址
        getQueryVal: getQueryVal,
        formsubmit: formsubmit, //请求
        submit: submit, // 兼容ie9的请求
        listing: listing, // 列表
        pageinfo: pageinfo, //分页样式
        pagejump: pagejump, // 分页跳转
        getHash: getHash,// 获取Hash
        search: search,// 搜索
        get_detail: get_detail,//获取编辑页信息
        editing: editing,//编辑区分创建还是修改
        createHash: createHash, // 创建 hash 字符串
        del: del, //删除
        removeNull: removeNull, //去除null
        arrayTostring: arrayTostring,//对数组进行处理
        getselectdata: getselectdata,    //下拉框动态获取数据
        upload_file: upload_file,//上传图片
        customize_pagejump: customize_pagejump,//自定义确定分页跳转
        dealNumber: dealNumber,
        undoNubmer: undoNubmer,
        NumdealNumber: NumdealNumber,
        refillForm: refillForm,
        search_lang: search_lang,//繁体搜素转为简体
        getCsrf: getCsrf,
        compileStr: compileStr,
        uncompileStr: uncompileStr,
        encodeSearchKey: encodeSearchKey,
        NumundoNubmer: NumundoNubmer,
        getCookie:getCookie,
        in_array:in_array,//检测数组中是否存在某个字符串
    };


})(window);



