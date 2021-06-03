jQuery(document).ready(function () {
    (function ($) {
        $.fn.visibleToggle = function (_isShow) {
            return this.css("visibility", function (i, visible) {
                if (_isShow === undefined) {
                    return visible == "visible" ? "hidden" : "visible";
                } else {
                    if (_isShow) {
                        return "visible";
                    } else {
                        return "hidden";
                    }
                }
            });
        };
    })(jQuery);




    /* ----------------------------------------
       inviewChecker.jquery.js
       Copyright (c) 2020 Toru Watanabe
       Released under the MIT license
       https://qiita.com/torugatoru/items/2b6ec4dcc36ff6b11fdf
    ---------------------------------------- */
    (function ($) {
        $.fn.inviewChecker = function () {
            let $t = $(this);

            let inviewChecker = (T) => {
                let _st = $(window).scrollTop();

                T.each(function () {
                    let $t = $(this),
                        _tt = $t.offset().top,
                        _tb = _tt + $t.height(),
                        _p = _st + $(window).height();

                    let _classSet = '_item_in_all _item_in_top _item_in_bottom _item_out_top _item_out_bottom';

                    if (_p >= _tt) {
                        // 上辺だけ入っている時
                        if (_p <= _tb) {
                            $t.removeClass(_classSet).addClass('_item_in_top');
                        }
                        // 下辺まで全て入った時
                        if (_p >= _tb) {
                            $t.removeClass(_classSet).addClass('_item_in_all');
                        }
                        // 上辺が画面の上に出た時
                        if (_tt < _st) {
                            $t.removeClass(_classSet).addClass('_item_in_bottom');
                        }
                        // 下辺が画面の上に出た時
                        if (_tb < _st) {
                            $t.removeClass(_classSet).addClass('_item_out_bottom');
                        }
                    } else {
                        // 上辺が画面の下にいる時
                        $t.removeClass(_classSet).addClass('_item_out_top');
                    }
                });
            }

            // 読込み直後
            inviewChecker($t);

            // ウィンドウスクロール時
            $(window).on('scroll', function () {
                inviewChecker($t);
            });

            // ウィンドウリサイズ時
            let timer = 0;

            $(window).on('resize', function () {
                if (timer > 0) {
                    clearTimeout(timer);
                }

                timer = setTimeout(function () {
                    inviewChecker($t);
                }, 1);
            });
        };
    })(jQuery);




});