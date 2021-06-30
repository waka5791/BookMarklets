jQuery(document).ready(function () {
    const DataBaseUrl = 'img/';
    const Fake1pxPngData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';

    const GrayScaleButton = $('#grayScaleEffect');
    const ExifGetButton = $('#exifInfoGet');
    const ExifInfoContainer = $("#exifInfo");
    const ZoomBoxFrame = $('#zoomBox');

    let _isZoom = false;
    let ImageDataAry = null;
    $.ajaxSetup({ async: false });
    $.getJSON('imageData.json', function (jsonData) {
        ImageDataAry = JSON.parse(JSON.stringify(jsonData));
    });
    $.ajaxSetup({ async: true });

    const GetImagePathData = function (_singleData) {
        let _image = _singleData.image;
        let _imgTnPath = DataBaseUrl + _image.t;
        let _imgOrignalPath = DataBaseUrl + _image.o;
        let _imgPreviewPath = DataBaseUrl + _image.p;
        let _imagePathData = { "o": _imgOrignalPath, "p": _imgPreviewPath, "t": _imgTnPath };
        return _imagePathData;
    }
    const getSizeStr = function (e) {
        const _unitWord = ["Bytes", "KB", "MB", "GB", "TB"];
        if (0 === e) {
            return "n/a";
        } 
        let _prettyNum = parseInt(Math.floor(Math.log(e) / Math.log(1024)));
        return Math.round(e / Math.pow(1024, _prettyNum)) + " " + _unitWord[_prettyNum];
    }

    const CreateXzoomContainer = function (_data, _isPc) {
        let _containerObj = $('#imageList');
        let _dataLen = _data.length;
        let _galleryContainer = $('<div>', { class: 'xzoom-thmubs' });

        let _canPreview = (_dataLen > 0 && _isPc);
        if (_canPreview) {
            let _caption = _data[0].caption;
            //$('#imageCaptionA').text(_caption.a);
            //$('#imageCaptionB').text(_caption.b);

            let _image = GetImagePathData(_data[0]);
            let _imgTag = $('<img>',
                {
                    'src': _image.p,
                    'alt': _image.t,
                    'class': 'xzoom',
                    'xoriginal': _image.o,
                    'id': 'previewBoxImage'
                });
            //_imgTag.data('path', _caption.a + _caption.b);

            _imgTag.on({
                'load': function () {
                    GetImageInfo();
                },
                'error': function () {
                    this.error = null;
                    $(this).attr('src', Fake1pxPngData);
                }
            });

            $('#previewBox').append(_imgTag);
        }
        
        for (let _idx = 0; _idx < _dataLen; _idx++) {
            let _image = GetImagePathData(_data[_idx]);
            let _caption = _data[_idx].caption;
            _data[_idx].caption.fancybox = _caption.a + '<br>' + _caption.b;
            let _liTag = $('<div>', { class: 'singleImageContainer' });
            let _aTag = $('<a>', { 'href': _image.o, 'title': _caption.a });
            //_aTag.data('fancybox', 'images');
            _aTag.attr('data-fancybox', 'images');
            _aTag.data('caption', _caption.a);            
            _aTag.data('idx', _idx);
            let _imgTag = $('<img>',
                {
                    'src': _image.t,
                    'xpreview': _image.p,
                    'class': 'xzoom-gallery',
                    'loading': 'lazy'
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
                        //$('#imageCaptionA').text($(this).data('caption'));
                        let _idx = $(this).data('idx');
                        $('#imageCaptionA').text(_idx + 1 + '. ' + _caption.a);
                        $('#imageCaptionB').text(_caption.b);
                        $('#previewBoxImage').data('path', _caption.a + _caption.b);

                        GrayScaleButton.attr({ 'disabled': false }).removeClass('btn-dark').addClass('btn-outline-dark');
                        ExifGetButton.attr({ 'disabled': false }).removeClass('btn-dark').addClass('btn-outline-dark');
                        ExifInfoContainer.empty();
                        $(this).children('img').addClass('grayFrame');
                    }
                });
                _imgTag.on({
                    'error': function () {
                        this.error = null;
                        const _errMsg = '** Not Found. **';
                        $(this).attr('src', Fake1pxPngData);
                        $(this).attr('xpreview', Fake1pxPngData);
                        $(this).attr('caption', _errMsg);
                        _aTag.attr('href', Fake1pxPngData);
                        _aTag.data('caption', _errMsg);

                        _data[_idx].caption.fancybox = _errMsg;
                    }
                });
                if (_idx == 0) {
                    _aTag.trigger('click');
                }
            }
        }
        _containerObj.append(_galleryContainer);
        // $('#debugConsole').html(JSON.stringify(_newData,null,2));
    }

    const GetImageInfo = function () {
        let _imgTag = $('#previewBoxImage');
        let _imgPath = _imgTag.attr('xoriginal');
        let _pvPath = _imgTag.data('path');
        let _xhr = new XMLHttpRequest();
        _xhr.open('GET', _imgPath, true);
        _xhr.responseType = 'arraybuffer';
        _xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                let _responsArray = (new Uint8Array(this.response)).subarray(0, 4);
                let _header = '';
                let _mimetype = '';
                for (let _idx = 0; _idx < _responsArray.length; _idx++) {
                    _header += _responsArray[_idx].toString(16);
                }
                switch (_header) {
                    //Ref. https://en.wikipedia.org/wiki/List_of_file_signatures
                    case "89504e47":
                        _mimetype = "image/png";
                        break;
                    case "47494638":
                        _mimetype = "image/gif";
                        break;
                    case "ffd8ffe0":
                    case "ffd8ffe1":
                    case "ffd8ffe2":
                        _mimetype = "image/jpeg";
                        break;
                    case "52494646":
                    case "57454250":
                        _mimetype = "image/webp";
                        break;
                    default:
                        _mimetype = "unknown";
                        break;
                }
                let _basename = '[DL]';
                let _dlName = '';
                let _aTag = $('<a>');
                let _span = $('<span>');
                _aTag.attr('href', _imgPath);
                _span.text(`${_mimetype} ${getSizeStr(this.response.byteLength)}`);
                if (_imgPath.indexOf('data:') == 0) {
                    _dlName = _pvPath + '.png';
                } else {
                    _dlName = _imgPath.split('/').pop();                    
                }
                _aTag.attr('download', _dlName);
                _aTag.attr('title', _dlName);
                _aTag.text(_basename);
                const _faicon = $('<i>', { class: 'fas fa-download' });
                ExifInfoContainer.append(_span).append(_aTag.append(_faicon));
                /*
                let _imageObj = new Image();
                _imageObj.src = _imgPath;
                let _w = _imageObj.width;
                let _h = _imageObj.height;
                _imgTag.data('wxh', `${_w} x ${_h}`);
                */
            }
        };
        _xhr.send(null);
    };

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
            "slideShow",
            "fullScreen",
            "download",
            "share",
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
                let _caption = ImageDataAry[_idx].caption.fancybox;
                let _hash = `images`;
                images[_idx] = { src: _gallery[_idx], caption: _caption, hash: _hash };
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
                ZoomBoxFrame.visibleToggle(_isZoom);
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
            const _imageSrc = _originalImage;

            const _dmyNum = new Date().getTime();
            ExifInfoContainer.empty();
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
            _effected = $('#previewBoxImage').attr("src");
            $('#previewBoxImage').attr({ 'xoriginal': _effected });
        };
        GrayScaleButton.on('click', function () {
            GrayScaleButton.attr({ 'disabled': true }).toggleClass('btn-outline-dark btn-dark');
            ExifGetButton.attr({ 'disabled': true }).removeClass('btn-outline-dark').addClass('btn-dark');
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
            ExifInfoContainer.empty();
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
                        let _span = $('<span>').html(_exifInf);
                        ExifInfoContainer.append(_span);
                    } else {
                        let _mdt = EXIF.getAllTags(this);
                        ExifInfoContainer.html(`${_mdt["PixelXDimension"]} x ${_mdt["PixelYDimension"]}`);
                    }
                    $('#' + _dmyId).remove();
                });
            }, 500);
        }
        ExifGetButton.on('click', function () {
            getExif();
            $(this).attr({ 'disabled': true }).toggleClass('btn-outline-dark btn-dark');
        });
    }

    if (location.protocol.indexOf('http') != 0) {        
        document.title = document.title + ' -debug-';
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

    CreateXzoomContainer(ImageDataAry, _isEnableXZoom);
    Enhancer(_isEnableXZoom);


    if (_isEnableXZoom) {
        //$('#zoomBox').inviewChecker();// zoomBoxが画面内に収まっているかチェックする
        let timer = false;
        $(window).scroll(function () {
            ZoomBoxFrame.draggable('disable');
            if (timer !== false) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                ZoomBoxFrame.draggable('enable');
            }, 1000);
        });

        $('#previewOnOff').on('click', function () {
            $(this).toggleClass('btn-outline-dark btn-dark');
            $('#xzoomMainContainer').toggle();
            let _isVisible = $('#xzoomMainContainer').is(':visible');
            if (_isZoom) {
                ZoomBoxFrame.toggle(_isVisible);
            }
        });


        GrayScaleOption();
        ExifOption();

        ZoomBoxFrame.css({ 'z-index': 99, 'opacity': '0' });
        ZoomBoxFrame.on({
            'mouseenter': function () {
                $(this).css('opacity', '0.5');
            },
            'mouseleave': function () {
                $(this).css('opacity', '0');
            }
        });
        ZoomBoxFrame.draggable({
            cursor: "grabbing",
            containment: "body"
        });
        ZoomBoxFrame.resizable({
            minHeight: 100,
            minWidth: 100,
            maxHeight: 500,
            maxWidth: 500
        });

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
