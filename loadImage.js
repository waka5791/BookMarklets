jQuery(document).ready(function () {
    const _baseDataUrl = 'img/';
    //const _baseDataUrl = 'https://waka5791.github.io/RoughDrawings/img/';
    //const _baseDataUrl = 'https://raw.githubusercontent.com/waka5791/RoughDrawings/main/img/';
    const _1pxPngData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';

    const _grayScaleButton = $('#grayScaleEffect');
    const _exifGetButton = $('#exifInfoGet');
    const exifInfoContainer = $("#exifInfo");

    let _data = null;
    $.ajaxSetup({ async: false });
    $.getJSON('imageData.json', function (jsonData) {
        _data = JSON.parse(JSON.stringify(jsonData));
    });
    $.ajaxSetup({ async: true });

    const CreateXzoomContainer = function (_data, _isPc) {
        let _containerObj = $('#imageList');
        let _dataLen = _data.length;
        let _galleryContainer = $('<div>', { class: 'xzoom-thmubs' });

        if (_dataLen > 0 && _isPc) {
            _imgId = _data[0].id;

            _imgPath = _baseDataUrl + _data[0].path;
            _imgGroup = _data[0].group;
            let _imgTag = $('<img>',
                {
                    'src': _imgPath,
                    'alt': _imgId,
                    'class': 'xzoom',
                    'xoriginal': _imgPath,
                    'id': 'previewBoxImage'
                });
             
        _imgTag.bind("load", function () {
            var image = new Image();
            image.src = $(this).attr('src');
            var _w = image.width;
            var _h = image.height;
            _imgTag.attr('data-wxh', `${_w} x ${_h}`);

            $('#WidthAndHeight').html(`${_w} x ${_h}`);
        });
        
            $('#previewBox').append(_imgTag);
        }

        for (let _idx = 0; _idx < _dataLen; _idx++) {
            let _imgId = _data[_idx].id;
            let _dataPath = _data[_idx].path;
            let _imgPath = _baseDataUrl + _dataPath;
            if (_dataPath.match(/^http/) != null) {
                _imgPath = _dataPath;
            }
            let _caption = _data[_idx].caption;
            if (_caption === undefined) {
                _caption = '-';
            }
            let _liTag = $('<div>', { class: 'singleImageContainer' });
            let _aTag = $('<a>',
                {
                    'href': _imgPath,
                    'data-fancybox': 'images',
                    'data-caption': _caption
                });
            let _imgTag = $('<img>',
                {
                    'src': _imgPath,
                    'class': 'xzoom-gallery',
                    'xtitle': _caption,
                    'caption': _caption
                });

            _liTag.append(_aTag);
            _aTag.append(_imgTag);
            _galleryContainer.append(_liTag);

            let _cTag = $('<div>', { class: 'innerCaption' });
            _cTag.text(_idx + 1);
            _liTag.append(_cTag);
            _aTag.on({
                'click': function () {
                    $('#previewBoxImage').attr('src', _1pxPngData);//プレビューリフレッシュ、ちらつきを抑える効果を期待
                    $('#imageCaptionA').html($(this).data('caption'));
                    _grayScaleButton.attr({ 'disabled': false }).removeClass('btn-dark').addClass('btn-outline-dark');
                    _exifGetButton.attr({ 'disabled': false }).removeClass('btn-dark').addClass('btn-outline-dark');
                    exifInfoContainer.html('');
                    $(this).children('img').addClass('grayImage');
                }
            });
            _imgTag.on({
                'click': function () {
                },
                'error': function () {
                    this.error = null;
                    const _errMsg = '** Not Found. **';
                    $(this).attr('src', _1pxPngData);
                    $(this).attr('caption', _errMsg);
                    _aTag.attr('href', _1pxPngData);
                    _aTag.attr('data-caption', _errMsg);

                    _data[_idx].caption = _errMsg;
                }
            });
        }
        _containerObj.append(_galleryContainer);
    }

    const Enhancer = function (_isPc) {
        let _kickFancyBox = function (event) {
            let xzoom = $('.xzoom:first').data('xzoom');
            xzoom.closezoom();
            let i, images = new Array();
            let gallery = xzoom.gallery().ogallery;
            let index = xzoom.gallery().index;
            for (i in gallery) {
                let _caption = _data[i].caption;
                images[i] = { src: gallery[i], caption: _caption };
            }
            $.fancybox.open(images, { loop: true }, index);
            event.preventDefault();
        }

        $('#fullScreenMode').bind('click', function (event) {
            _kickFancyBox(event);
        });

        if (!_isPc) {
            return;
        }
        const _xzoomOption = { position: '#zoomBox', lensShape: 'box', fadeIn: true, hover: false };
        const instance = $('.xzoom, .xzoom-gallery').xzoom(_xzoomOption);


        //Integration with fancybox version 3 plugin
        $('.xzoom:first').bind('click', function (event) {
            // _kickFancyBox(event);
        });


        //Custom scale delta example
        let scale = 0;
        const scaleDelta = 0.1;
        instance.eventscroll = function (element) {
            element.xon('mousewheel DOMMouseScroll', function (event) {
                let delta = -event.originalEvent.detail || event.originalEvent.wheelDelta || event.xdelta;
                if (delta > 0) delta = -scaleDelta; else delta = scaleDelta;
                scale += delta;
                if (scale < -1) scale = -1;
                if (scale > 1) scale = 1;
                event.xscale = scale;
                instance.xscroll(event)
            });
        }

        let _isZoom = false;
        instance.eventopen = function (element) {
            if (_isZoom) {
                element.bind('mouseenter', instance.openzoom);
            } else {
                instance.closezoom();
                element.unbind('mouseenter');
            }
        }
        instance.eventmove = function (element) {
            if (_isZoom) {
                element.bind('mousemove', instance.movezoom);
            } else {
                instance.closezoom();
                element.unbind('mousemove');
            }
        }
        $('#zoomOnOff').on({
            'click': function (event) {
                _isZoom = !_isZoom;
                if (_isZoom) {
                    $('.xzoom:first').trigger('mouseenter');
                    instance.closezoom();
                } else {

                    //instance.eventdefault('eventmove');
                }
                $('#zoomBox').visibleToggle(_isZoom);
                $(this).toggleClass('btn-outline-dark btn-dark');
                _isZoom ? $('#badge2').html('&#10003;') : $('#badge2').html('&#9633;');
            }
        });
        /*
        $('#zoomBoxOnOff').on({
            'click': function (event) {
                $('#zoomBox').visibleToggle();

                if ($('#zoomBox').css('visibility') == 'visible') {
                    $('#badge1').html('&#10003;');
                } else {
                    $('#badge1').html('&#9633;');
                }

            }
        });
        */

    }

    const GrayScaleOption = function () {
        let _effected = null;
        const _applyGrayScaleEffect = function () {
            let defer = $.Deferred();

            $('.xzoom').grayscale();
            setTimeout(function () {
                defer.resolve();
            }, 500);
            return defer.promise();
        };

        function _effectApplyInZoomBox() {
            _effected = $('.xzoom').attr("src");
            $('.xzoom').attr({ 'xoriginal': _effected });
        };
        _grayScaleButton.on('click', function () {
           // _grayScaleButton.attr({ 'disabled': true });
           // _grayScaleButton.visibleToggle(false);
            _grayScaleButton.attr({ 'disabled': true }).toggleClass('btn-outline-dark btn-dark');
            _exifGetButton.attr({ 'disabled': true }).removeClass('btn-outline-dark').addClass('btn-dark');
            let promise = _applyGrayScaleEffect();
            promise.done(function () {
                _effectApplyInZoomBox();
            });
        });
    }

    const ExifOption = function () {
        const getExif = function () {
            const img1 = document.getElementById("previewBoxImage");
            const _dmyNum = new Date().getTime();
            exifInfoContainer.html('');
            let _dmyId = 'dmyImgId' + _dmyNum;
            let _dmyImg = $('<img>', { src: img1.src, id: _dmyId });
            $('body').append(_dmyImg);

            EXIF.getData(document.getElementById(_dmyId), function () {
                let _exifInf = '';
                if (true) {
                    let _maker = EXIF.getTag(this, "Make");
                    let _model = EXIF.getTag(this, "Model");
                    let _orientation = '';//EXIF.getTag(this, "Orientation");
                    let _xResolution = EXIF.getTag(this, "PixelXDimension");
                    let _yResolution = EXIF.getTag(this, "PixelYDimension");
                    _exifInf = `${_maker} ${_model} ${_orientation} ${_xResolution} x ${_yResolution}`;
                    exifInfoContainer.html(_exifInf);
                } else {
                    let _mdt = EXIF.getAllTags(this);
                    exifInfoContainer.html(`${_mdt["PixelXDimension"]} x ${_mdt["PixelYDimension"]}`);
                }
                $('#' + _dmyId).remove();
            });
        }
        _exifGetButton.on('click', function () {
            getExif();
            $(this).attr({ 'disabled': true }).toggleClass('btn-outline-dark btn-dark');
        });
    }

    const ua = navigator.userAgent;
    let _isEnableXZoom = false;
    const _isIPhone = (ua.indexOf('iPhone') > -1);
    const _isAndroid = (ua.indexOf('Android') > -1);
    const _isMobile = (ua.indexOf('Mobile') > -1);
    const _isIPad = (ua.indexOf('iPad') > -1);
    if (_isIPhone || _isAndroid && _isMobile) {
        // スマートフォン
    } else if (_isIPad || _isAndroid) {
        // タブレット
    } else {
        // PC
        _isEnableXZoom = true;
    }
    if (!_isEnableXZoom) {
        const _pTag = $('<p>', { 'text': 'パソコン版はルーペ機能が使えます。' });
        $('footer').append(_pTag);
    }

    $('.xZoomContainer, #topMenu').toggle(_isEnableXZoom);

    CreateXzoomContainer(_data, _isEnableXZoom);
    Enhancer(_isEnableXZoom);


    if (_isEnableXZoom) {
        //$('#zoomBox').inviewChecker();// zoomBoxが画面内に収まっているかチェックする
        let timer = false;
        $(window).scroll(function () {
            /*
            if ($('#zoomBox').hasClass('_item_in_all')) {
            } else {
                console.info($('#previewBox').offset().top);
                $('#zoomBox').css({ top: $(window).scrollTop(), left: 50 });
            }
*/

            $("#zoomBox").draggable('disable');
            if (timer !== false) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                $("#zoomBox").draggable('enable');
            }, 1000);
        });

        $('#previewOnOff').on('click', function () {
            $(this).toggleClass('btn-outline-dark btn-dark');
            $('#xzoomMainContainer').toggle();
        });


        GrayScaleOption();
        ExifOption();

        $("#zoomBox").draggable(
            {
                cursor: "grabbing",
                containment: "body"
            }
        );
        $("#zoomBox").resizable(
            {
                minHeight: 100,
                minWidth: 100,
                maxHeight: 500,
                maxWidth: 500
            }
        );

        function ZoomContainerControler() {
            let _visible = true;
            let _windowH = $(window).height();
            let _windowW = $(window).width();
            if (_isEnableXZoom) {
                if ($('.xzoom').height() > _windowH * 0.7 || $('.xzoom').width() > _windowW * 0.8) {
                    $('#xzoomMainContainer').css({ top: -1 * _windowH / 2 });
                    $('#xzoomMainContainer').addClass('invalidWindowSize');
                } else {
                    $('#xzoomMainContainer').css({ top: '40px' });
                    $('#xzoomMainContainer').removeClass('invalidWindowSize');
                }
            }
        }

        $(window).on('resize', function () {
            ZoomContainerControler();
        });
        ZoomContainerControler();
    }
});
