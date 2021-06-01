        jQuery(document).ready(function () {
        const data = [
            {
                "id": 1,
                "path": "https://github.com/waka5791/BookMarklets/blob/main/img/A.jpg?raw=true"
            }
        ];
        let ulObj = $("#demo");
        let     len = data.length;

        for (var i = 0; i < len; i++) {
            ulObj.append($("<li>").attr({
                "id": data[i].id
            }).text(data[i].path));
        }
        });
