javascript: (function () {
    const CheckIDName = 'DateInTitleAdded';
    let _updateTitle = function () {
        const _chkElem = document.getElementById(CheckIDName);
        let _titleContent = document.title;
        if (_chkElem === null) {
            let element = document.createElement('div');
            element.id = CheckIDName;
            element.style.display = 'none';
            element.textContent = _titleContent;
            document.body.appendChild(element);
        } else {
            _titleContent = _chkElem.textContent;
        }
        let _now = new Date();
        let _hour = _now.getHours();
        let _min = _now.getMinutes();
        let _sec = _now.getSeconds();
        document.title = _hour + "時" + _min + "分" + _sec + "秒" + '【' + _titleContent + '】';
    };
    _updateTitle();
})();
