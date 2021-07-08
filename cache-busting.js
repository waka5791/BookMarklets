jQuery(document).ready(function () {

    const _ua = navigator.userAgent.toLowerCase();
    const _isIE = (_ua.indexOf('trident') != -1 || _ua.indexOf('msie') != -1);
    if (_isIE) {
        const _parent = document.getElementById('mainContainer');
        while (_parent.firstChild) {
            _parent.removeChild(_parent.firstChild);
        }
        const _pJa = document.createElement("center");
        _pJa.innerText = 'Internet Explorerには対応していません。他の最新ブラウザをご利用ください。';
        _parent.appendChild(_pJa);
        _parent.appendChild(document.createElement("hr"));
        const _pEn = document.createElement("center");
        _pEn.innerText = 'Unsupported.Please use a modern browser other than this Internet Explorer.';
        _parent.appendChild(_pEn);

        _parent.style.display = "block";
        return;
    }
    $.ajaxSetup({ cache: true });

    const _ts = new Date().getTime();
    let _l = $('<link>').attr({ 'rel': 'stylesheet', 'href': 'main.css?' + _ts });
    $('head').append(_l);
    let _s1 = $('<script>').attr({ 'type': 'text/javascript', 'src': 'jquery-my-util.js?' + _ts });
    $('head').append(_s1);
    let _s2 = $('<script>').attr({ 'type': 'text/javascript', 'src': 'loadImage.js?' + _ts });    
    $('head').append(_s2);

    $('#_CACHE_BUSTER_').remove();
});
