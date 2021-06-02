jQuery(document).ready(function () {
    const _baseDataUrl = "https://github.com/waka5791/BookMarklets/blob/main/img/";
    const _infoPopupClass = "infoPopup";
    $.getJSON("imageData.json", function (_data)
    {
        let _containerObj = $("#imageList");
        let _dataLen = _data.length;

        for (let _idx = 0; _idx < _dataLen; _idx++) {
            _imgId = _data[_idx].id;
            _imgPath = _baseDataUrl + _data[_idx].path + "?raw=true";
            _imgGroup = _data[_idx].group;
            let _aTag = $("<a>",
                {
                    "href": _imgPath,
                    "data-lightbox": _imgGroup,
                    "data-title": _imgId
                });
            let _imgTag = $("<img>",
                {
                    "src": _imgPath,
                    "alt": _imgId,
                    "class": _infoPopupClass
                });
            _aTag.append(_imgTag);
            _containerObj.append(_aTag);
        }
    });

    $(`.${_infoPopupClass}`).tooltip({
        show: false,
        hide: false
    });
});
