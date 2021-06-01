jQuery(document).ready(function () {
    const _baseDataUrl = "https://github.com/waka5791/BookMarklets/blob/main/img/";
    const _data = [
        {        
            "id": 1,        
            "path": "A.jpg",
            "group": "y"
        },
        {
            "id": 2,
            "path": "B.jpg",
            "group": "y"
        }
    ];
    let ulObj = $("#imageList");
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
                "alt": _imgId
            });
        _aTag.append(_imgTag);
        ulObj.append(_aTag);
    }
});
