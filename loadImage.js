jQuery(document).ready(function () {
    const _baseDataUrl = "https://waka5791.github.io/RoughDrawings/img/";
    $.getJSON("imageData.json", function (_data) {
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
            _imgId = _data[_idx].id;
            _imgPath = _baseDataUrl + _data[_idx].path;
            _imgGroup = _data[_idx].group;
            let _liTag = $('<span>');
            let _aTag = $("<a>",
                {
                    "href": _imgPath,
                    "caption": _imgId
                });
            let _imgTag = $("<img>",
                {
                    "src": _imgPath,
                    "alt": _imgId,
                    "class": "xzoom-gallery",
                    "xtitle": _imgId
                });

            _liTag.append(_aTag);
            _aTag.append(_imgTag);
            _galleryContainer.append(_liTag);


            _aTag.on({
                'click': function () {
                    $('#imageCaption').text($(this).attr('caption'));
                }
            });
            
        }
        _containerObj.append(_galleryContainer);

        const _xzoomOption = { position: "right", fadeIn: true, hover: false };
        const instance = $(".xzoom, .xzoom-gallery").xzoom(_xzoomOption);

        //Integration with fancybox version 3 plugin
        $(".xzoom:first").bind('click', function (event) {
            let xzoom = $(this).data('xzoom');
            xzoom.closezoom();
            let i, images = new Array();
            let gallery = xzoom.gallery().ogallery;
            let index = xzoom.gallery().index;
            for (i in gallery) {
                images[i] = { src: gallery[i] };
            }
            $.fancybox.open(images, { loop: false }, index);
            event.preventDefault();
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


    });

});
