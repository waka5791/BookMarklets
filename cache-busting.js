jQuery(document).ready(function () {
    $.ajaxSetup({
        cache: true
    });
    const _ts = new Date().getTime()
    let _l = $('<link>').attr({ 'rel': 'stylesheet', 'href': 'main.css?' + _ts });
    $('head').append(_l);
    let _s1 = $('<script>').attr({ 'type': 'text/javascript', 'src': 'jquery-my-util.js?' + _ts });
    $('head').append(_s1);
    let _s2 = $('<script>').attr({ 'type': 'text/javascript', 'src': 'loadImage.js?' + _ts });    
    $('head').append(_s2);

    $('#_CACHE_BUSTER_').remove();
});