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
    $.datepicker._gotoToday = function(id) {
        var target = $(id);
        var inst = this._getInst(target[0]);
        var date = getNowYYYYMMDD();
        this._setDate(inst,date);
        updateReturnDate(date, inst);
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
            updateReturnDate(dateText, event);
        },
        beforeShow: function(input) {
            setTimeout(function() {
                var buttonPane = $(input)
                    .datepicker('widget')
                    .find('.ui-datepicker-buttonpane');

                var btn = $('<button class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" type="button">返却</button>');
                    btn.unbind('click')
                    .bind('click', function () {
                        $.datepicker._clearDate(input);
                    });
                    btn.appendTo(buttonPane);
            }, 1 );
        },
        onChangeMonthYear: function(year, month, instance) {
            setTimeout(function() {
                var buttonPane = $(instance).datepicker('widget').find('.ui-datepicker-buttonpane');
                $('<button>', {text: '返却',
                    click: function() {
                        $.datepicker._clearDate(instance.input);
                    }
                }).appendTo( buttonPane ).addClass('ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all');
            }, 1 );
        }
    });
}

function checkValidityDatepicker(id, status) {
    if (status !== 1) {
        setInvalidDatepicker(id);
    }
}

function setInvalidDatepicker(id) {
    var datepickerImg = document.getElementById(id).children[0].children[2];
    // pointer-events:none;、cursor:not-allowed;を設定
}