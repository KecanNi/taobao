function ajax(opt) {
    //格式化参数
    var json = opt || {};
    var url = json.url;
    if (!url) { //没有路径就返回
        return;
    }
    var type = json.type || 'get'; //不传的话默认 get方式
    var data = json.data || {}; //表示客户端get或者post方式穿的参数 & =
    var async = json.async ? json.async : true; //默认异步
    var dataType = json.dataType || 'text'; //默认 text类型
    //创建对象
    var xml = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXOBject('Microsoft.XMLHttpRequest')
    var arr = [];
    for (var i in data) {
        arr.push(i + '=' + data[i]);
    }
    data = arr.join('&');

    url = data ? url + '?' + data : url;

    xml.onload = function (res) {
        if (res.target.status === 200) {
            if (dataType === 'json') {
                typeof json.success === 'function' && json.success(JSON.parse(res.target.response))
            } else {
                typeof json.success === 'function' && json.success(res.target.response)
            }
        } else {
            typeof json.error === 'function' && json.error(new Error('error'))
        }

    }
    switch (type.toLowerCase()) {
        case 'get':
            xml.open(type, url, async);
            xml.send();
            break;
        case 'post':
            xml.open(type, url, async)
            xml.setRequestHeader('content-type', 'Application/x-www-form-urlencoded')
            xml.send(data)

    }
}
