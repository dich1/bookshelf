function getNowYYYYMMDD(){
    var dt = new Date();
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth() + 1)).slice(- 2);
    var d = ('00' + dt.getDate()).slice(-2);
    var result = y + '-' + m + '-' + d;

    return result;
}

function setDatepicker() {
    $.datepicker.setDefaults($.datepicker.regional["ja"]);
    $.datepicker._gotoToday = function(datepickerId) {
        var target = $(datepickerId);
        var inst = this._getInst(target[0]);
        var dateText = getNowYYYYMMDD();
        this._setDate(inst, dateText);
        var id = inst.input[0].parentElement.parentElement.parentElement.id;
        updateReturnDate(id, dateText);
        updateBookReading(id);
        postMessageSlack(id, 1, dateText);
        this._hideDatepicker();
    }
    $(".datepicker").datepicker({
        dateFormat     : 'yy-mm-dd',
        minDate        : '0',
        buttonImage    : './images/date.jpg',
        showOn         : 'button',
        buttonImageOnly: true,
        showButtonPanel: true,
        onSelect: function(dateText, event){
            var id = event.input[0].parentElement.parentElement.parentElement.id
            updateReturnDate(id, dateText);
            if (dateText !== '') {
                updateBookReading(id);
                postMessageSlack(id, 1, dateText);
            }
        },
        beforeShow: function(input) {
            setTimeout(function() {
                var buttonPane = $(input)
                    .datepicker('widget')
                    .find('.ui-datepicker-buttonpane');

                var btn = $('<button class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" type="button">返却</button>');
                    btn.unbind('click')
                    .bind('click', function () {
                        var id = input.parentElement.parentElement.parentElement.id;
                        var dateText = getNowYYYYMMDD();
                        $.datepicker._clearDate(input);
                        updateBookSafekeeping(id);
                        postMessageSlack(id, 2, dateText);
                    });
                    btn.appendTo(buttonPane);
            }, 1 );
        },
        onChangeMonthYear: function(year, month, instance) {
            setTimeout(function() {
                var buttonPane = $(instance).datepicker('widget').find('.ui-datepicker-buttonpane');
                $('<button>', {text: '返却',
                    click: function() {
                        var id = instance.input.parentElement.parentElement.parentElement.id;
                        var dateText = getNowYYYYMMDD();
                        $.datepicker._clearDate(instance.input);
                        updateBookSafekeeping(id);
                        postMessageSlack(id, 2, dateText);
                    }
                }).appendTo(buttonPane).addClass('ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all');
            }, 1 );
        }
    });
}

function openDatepicker(id) {
    document.getElementById(id).children[0].children[1].children[1].click();
}