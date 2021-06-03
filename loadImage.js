jQuery(document).ready(function () {
    const _baseDataUrl = "https://waka5791.github.io/RoughDrawings/img/";
    //const _baseDataUrl = "https://raw.githubusercontent.com/waka5791/RoughDrawings/main/img/";

    let _data = null;
    $.ajaxSetup({ async: false });
    $.getJSON("imageData.json", function (jsonData) {
        _data = JSON.parse(JSON.stringify(jsonData));
    });
    $.ajaxSetup({ async: true });

    const CreateXzoomContainer = function (_data) {
        let _containerObj = $("#imageList");
        let _dataLen = _data.length;
        let _galleryContainer = $('<div>', { class: "xzoom-thmubs" });

        if (_dataLen > 0) {
            _imgId = _data[0].id;

            _imgPath = _baseDataUrl + _data[0].path;
            _imgGroup = _data[0].group;
            let _imgTag = $("<img>",
                {
                    "src": _imgPath,
                    "alt": _imgId,
                    "class": "xzoom",
                    "xoriginal": _imgPath
                });
            $("#previewBox").append(_imgTag);
        }

        for (let _idx = 0; _idx < _dataLen; _idx++) {
            let _imgId = _data[_idx].id;
            let _dataPath = _data[_idx].path;
            let _imgPath = _baseDataUrl + _dataPath;
            if(_dataPath.match(/^http/) != null){
                _imgPath = _dataPath;
            }
            let _caption = _data[_idx].caption;
            if (_caption === undefined) {
                _caption = "-";
            }
            let _liTag = $('<div>', { class: "singleImageContainer" });
            let _aTag = $("<a>",
                {
                    "href": _imgPath,
                    "data-fancybox": "images",
                    "data-caption": _caption
                });
            let _imgTag = $("<img>",
                {
                    "src": _imgPath,

                    "class": "xzoom-gallery",
                    "xtitle": _caption,
                    "caption": _caption
                });

            _liTag.append(_aTag);
            _aTag.append(_imgTag);
            _galleryContainer.append(_liTag);

            let _cTag = $('<div>', { class: "innerCaption" });
            _cTag.text(_idx + 1);
            _liTag.append(_cTag);

            _imgTag.on({
                'click': function () {
                    $('#imageCaption').html($(this).attr('caption'));
                    $(this).addClass('grayImage');
                }
            });

        }
        _containerObj.append(_galleryContainer);
    }

    const Enhancer = function () {
        const _xzoomOption = { position: "#zoomBox", lensShape: "box", fadeIn: true, hover: false };
        const instance = $(".xzoom, .xzoom-gallery").xzoom(_xzoomOption);
        let _kickFancyBox = function (event) {
            let xzoom = $(".xzoom:first").data('xzoom');
            xzoom.closezoom();
            let i, images = new Array();
            let gallery = xzoom.gallery().ogallery;
            let index = xzoom.gallery().index;
            for (i in gallery) {
                let _caption = _data[i].caption;
                images[i] = { src: gallery[i], caption: _caption };
            }
            $.fancybox.open(images, { loop: false }, index);
            event.preventDefault();
        }

        //Integration with fancybox version 3 plugin
        $(".xzoom:first").bind('click', function (event) {
            // _kickFancyBox(event);
        });

        $("#fullScreenMode").bind('click', function (event) {
            _kickFancyBox(event);
        });

        //Custom scale delta example
        let scale = 0;
        const scaleDelta = 0.5;
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


        let _isZoom = true;
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
                    $(".xzoom:first").trigger('mouseenter');
                    instance.closezoom();
                } else {

                    //instance.eventdefault('eventmove');
                }
                _isZoom ? $('#badge2').html("&#10003;") : $('#badge2').html("&#9633;");
            }
        });


        $('#zoomBoxOnOff').on({
            'click': function (event) {
                $('#zoomBox').visibleToggle();

                if ($('#zoomBox').css("visibility") == "visible") {
                    $('#badge1').html("&#10003;");
                } else {
                    $('#badge1').html("&#9633;");
                }

            }
        });

    }

    CreateXzoomContainer(_data);
    Enhancer();
    $('#zoomBox').inviewChecker();
    $(window).scroll(function(){
        if($('#zoomBox').hasClass('_item_in_all')){
            //$('#debugConsole').text('inner ');
        }else{
            //$('#debugConsole').text('outer ');
            $('#zoomBox').css({top:$('#previewBox').offset().top});
        }
    });
});
