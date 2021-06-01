javascript: (function () {
    const CheckIDName = 'DateInTitleAdded';
    let _updateTitle = function () {
        const _chkElem = document.getElementById(CheckIDName);
        let _titleContent = document.title;
        if (_chkElem === null) {
            let _div = document.createElement('link');
            _div.setAttribute('id', CheckIDName);
            _div.textContent = _titleContent;
            document.body.appendChild(_div);
        } else {
            _titleContent = _chkElem.textContent;
        }
        let _now = new Date();
        let _hour = _now.getHours();
        let _min = _now.getMinutes();
        let _sec = _now.getSeconds();
        let _timeStr = `${_hour}時${_min}分${_sec}秒`;
        document.title = _timeStr + '【' + _titleContent + '】';
    };
    _updateTitle();
})();
