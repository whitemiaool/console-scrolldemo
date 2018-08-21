let callbackCount = 0;
const noop = () => { };
const jsonp = (url, options={}, fn) => {
    const prefix = options.prefix || '__jp';
    const id = options.name || (prefix + (callbackCount++));
    const param = options.param || 'callback';
    const timeout = options.timeout || 60000;
    const enc = encodeURIComponent;
    const target = document.getElementsByTagName('script')[0] || document.head;
    const extraParams = Object.assign({}, options);
    extraParams.prefix && delete extraParams.prefix;
    extraParams.name && delete extraParams.name;
    extraParams.param && delete extraParams.param;
    extraParams.timeout && delete extraParams.timeout;
    const paramsArr = [];
    for (const key in extraParams) {
        paramsArr.push(key + '=' + extraParams[key]);
    }
    let script;
    let timer;
    const cleanup = () => {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
            window[id] = noop;
            if (timer) {
                clearTimeout(timer);
            }
        }
    };
    const cancel = () => {
        if (window[id]) {
            cleanup();
        }
    };
    window[id] = (data) => {
        console.log('d',data)
        cleanup();
        fn(null, data);
    };
    if (timeout) {
        timer = setTimeout(() => {
            cleanup();
            fn(new Error('Timeout'));
        }, timeout);
    }
    url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
    url = url.replace('?&', '?');
    url += '&' + paramsArr.join('&');
    script = document.createElement('script');
    script.src = url;
    script.onerror = () => {
        cleanup();
        fn(new Error('network error'))
    };
    target.parentNode.insertBefore(script, target);
    return cancel;
};
export default jsonp;