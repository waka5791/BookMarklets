javascript: (function () {
    jQuery(document).ready(function () {
        const CheckIDName = 'DateInTitleAdded';
        let _updateTitle = function () {
            const _chkElem = document.getElementById(CheckIDName);
            let _titleContent = document.title;
            if (_chkElem === null) {
                let _div = $('<div>').attr('id', CheckIDName).hide();
                _div.text(_titleContent);
                $('body').append(_div);
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
    });
})();



