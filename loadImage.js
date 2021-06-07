jQuery(document).ready(function () {
    const _baseDataUrl = 'img/';
    //const _baseDataUrl = 'https://waka5791.github.io/RoughDrawings/img/';
    //const _baseDataUrl = 'https://raw.githubusercontent.com/waka5791/RoughDrawings/main/img/';
    const _1pxPngData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';

    const _grayScaleButton = $('#grayScaleEffect');
    const _exifGetButton = $('#exifInfoGet');
    const exifInfoContainer = $("#exifInfo");

    let _isZoom = false;
    let _data = null;
    $.ajaxSetup({ async: false });
    $.getJSON('imageData.json', function (jsonData) {
        _data = JSON.parse(JSON.stringify(jsonData));
    });
    $.ajaxSetup({ async: true });

    const GetImagePathData = function (_singleData) {
        let _image = _singleData.image;
        let _imgTnPath = _baseDataUrl + _image.t;
        let _imgOrignalPath = _baseDataUrl + _image.o;
        let _imgPreviewPath = _baseDataUrl + _image.p;
        let _imagePathData = { "o": _imgOrignalPath, "p": _imgPreviewPath, "t": _imgTnPath };
        return _imagePathData;
    }

    const CreateXzoomContainer = function (_data, _isPc) {
        let _containerObj = $('#imageList');
        let _dataLen = _data.length;
        let _galleryContainer = $('<div>', { class: 'xzoom-thmubs' });

        if (_dataLen > 0 && _isPc) {
            let _image = GetImagePathData(_data[0]);
            let _imgTag = $('<img>',
                {
                    'src': _image.p,
                    'alt': _image.t,
                    'class': 'xzoom',
                    'xoriginal': _image.o,
                    'id': 'previewBoxImage'
                });

            _imgTag.bind("load", function () {
                let image = new Image();
                image.src = $(this).attr('src');
                let _w = image.width;
                let _h = image.height;
                $(this).attr('data-wxh', `${_w} x ${_h}`);
                //   $('#previewBox').css({ width: _w*0.5, height: _h*0.5 });
                $('#WidthAndHeight').html(`${_w} x ${_h}`);
            });

            _imgTag.on({
                'error': function () {
                    this.error = null;
                    $(this).attr('src', _1pxPngData);
                }
            });

            $('#previewBox').append(_imgTag);
        }
        let _newData = [];
        for (let _idx = 0; _idx < _dataLen; _idx++) {
            let _image = GetImagePathData(_data[_idx]);
            let _caption = _data[_idx].caption.a;
            if (_caption === undefined) {
                _caption = '-';
            }
            let _liTag = $('<div>', { class: 'singleImageContainer' });
            let _aTag = $('<a>',
                {
                    'href': _image.o,
                    'data-fancybox': 'images',
                    'data-caption': _caption
                });
            let _imgTag = $('<img>',
                {
                    'src': _image.t,
                    'xpreview': _image.p,
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
            if (_isPc) {
                _aTag.on({
                    'click': function () {
                        //  $('#previewBoxImage').attr('src', _1pxPngData);//プレビューリフレッシュ、ちらつきを抑える効果を期待
                        $('#imageCaptionA').html($(this).data('caption'));
                        _grayScaleButton.attr({ 'disabled': false }).removeClass('btn-dark').addClass('btn-outline-dark');
                        _exifGetButton.attr({ 'disabled': false }).removeClass('btn-dark').addClass('btn-outline-dark');
                        exifInfoContainer.html('');
                        $(this).children('img').addClass('grayImage');
                    }
                });
                _imgTag.on({
                    'error': function () {
                        this.error = null;
                        const _errMsg = '** Not Found. **';
                        $(this).attr('src', _1pxPngData);
                        $(this).attr('xpreview', _1pxPngData);
                        $(this).attr('caption', _errMsg);
                        _aTag.attr('href', _1pxPngData);
                        _aTag.attr('data-caption', _errMsg);

                        _data[_idx].caption.a = _errMsg;
                    }
                });
            }
            // let _x = { "caption": { "a": _caption, "b": "", "c": "" }, "image": _image };
            // _newData[_idx] = _x;
        }
        _containerObj.append(_galleryContainer);
        // $('#debugConsole').html(JSON.stringify(_newData,null,2));
    }

    const Enhancer = function (_isPc) {
        //fancybox 3 options
        //https://me2.jp/blog/javascript/jquery_fancybox3_option.html
        $.fancybox.defaults.loop = true;
        $.fancybox.defaults.protect = true;
        $.fancybox.defaults.afterClose = function (instance, current) {
            location.hash = '';
        }
        //(!instance.currentHash && !(item.type === "inline" || item.type === "html") ? item.origSrc || item.src : false) || window.location
        $.fancybox.defaults.buttons = [
            "zoom",
            "share",
            "slideShow",
            "fullScreen",
            "download",
            "thumbs",
            "close"
        ];
        if (!_isPc) {
            return;
        }
        //xzoom optinon : adaptive: false(default true) にすると、xpreview使用時のマウスエンターでプレビュー表示サイズ計算が失敗するバグが回避できる
        const _xzoomOption = { position: '#zoomBox', lensShape: 'box', fadeIn: true, hover: false, adaptive: false };
        let instance = $('.xzoom, .xzoom-gallery').xzoom(_xzoomOption);
        let _kickFancyBox = function (event) {
            let xzoom = $('.xzoom:first').data('xzoom');
            xzoom.closezoom();
            let _idx, images = new Array();
            let _gallery = xzoom.gallery().ogallery;
            let _xzoomCurIdx = xzoom.gallery().index;

            for (_idx in _gallery) {
                let _caption = _data[_idx].caption.a;
                images[_idx] = { src: _gallery[_idx], caption: _caption };
            }

            $.fancybox.open(images, {}, _xzoomCurIdx);
            event.preventDefault();
        }

        $('#fullScreenMode').bind('click', function (event) {
            _kickFancyBox(event);
        });

        //Integration with fancybox version 3 plugin
        $('.xzoom:first').bind('click', function (event) {
            if (_isZoom) {
                return;
            }
            _kickFancyBox(event);
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
                    //$('.xzoom:first').trigger('mouseenter');
                    instance.closezoom();
                } else {
                    //instance.eventdefault('eventmove');
                }
                $('#zoomBox').visibleToggle(_isZoom);
                $(this).toggleClass('btn-outline-dark btn-dark');
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
            const _originalImage = $('#previewBoxImage').attr('xoriginal');
            const _imageSrc = _originalImage

            const _dmyNum = new Date().getTime();
            exifInfoContainer.html('');
            let _dmyId = 'dmyImgId' + _dmyNum;
            let _dmyImg = $('<img>', { src: _imageSrc, id: _dmyId });
            //  $('body').append(_dmyImg);
            _dmyImg.grayscale();
            setTimeout(function () {
                $('#previewBoxImage').attr('src', _dmyImg.attr('src'));
                defer.resolve();
            }, 500);
            return defer.promise();
        };
        function _effectApplyInZoomBox() {
            _effected = $('.xzoom').attr("src");
            $('.xzoom').attr({ 'xoriginal': _effected });
        };
        _grayScaleButton.on('click', function () {
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
            const _originalImage = $('#previewBoxImage').attr('xoriginal');
            const _imageSrc = _originalImage;

            const _dmyNum = new Date().getTime();
            exifInfoContainer.html('');
            let _dmyId = 'dmyImgId' + _dmyNum;
            let _dmyImg = $('<img>', { src: _imageSrc, id: _dmyId });
            $('body').append(_dmyImg);
            setTimeout(function () {
                EXIF.getData(document.getElementById(_dmyId), function () {
                    let _exifInf = '';
                    if (true) {
                        let _maker = EXIF.getTag(this, "Make");
                        let _model = EXIF.getTag(this, "Model");
                        let _xResolution = EXIF.getTag(this, "PixelXDimension");
                        let _yResolution = EXIF.getTag(this, "PixelYDimension");
                        _exifInf = `${_maker} ${_model} ${_xResolution} x ${_yResolution}`;
                        exifInfoContainer.html(_exifInf);
                    } else {
                        let _mdt = EXIF.getAllTags(this);
                        exifInfoContainer.html(`${_mdt["PixelXDimension"]} x ${_mdt["PixelYDimension"]}`);
                    }
                    $('#' + _dmyId).remove();
                });
            }, 500);
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
