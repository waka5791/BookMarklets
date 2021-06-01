   
jQuery(document).ready(function () {
    const _data = [{
        "id": 1,
        "path": "https://github.com/waka5791/BookMarklets/blob/main/img/A.jpg?raw=true"
    }];
    let ulObj = $("#demo");
    let _dataLen = _data.length;

    for (let _idx = 0; _idx < _dataLen; _idx++) {
        _imgId = _data[_idx].id;
        _imgPath = _data[_idx].path;
        let _aTag = $("<a>",
            {
                "href": _imgPath,
                "data-lightbox": "anonymous",
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
