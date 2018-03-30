function retryable(retryCount, func) {
    let promise = Promise.reject().catch(() => func());
    for (let i = 0; i < retryCount; i++) {
      promise = promise.catch(err => func());
    }

    return promise;
}

window.addEventListener('load', function() {
    setTimeout(function(){
        retryable(3, () => { 
            getBooks();
        }).catch(err => {
            alert('本一覧取得API失敗。通信状態を確認してください');
         });
        
        retryable(3, () => { 
            getStatusCount();
        }).catch(err => {
            alert('本ステータス取得API失敗。通信状態を確認してください');
        });
    }, 1000);
});

function getStatusCount() {
    getBooksCountPetition();
    getBooksCountReading();
    getBooksCountSafekeeping();
}

function getBooks() {
    var endpointName = '本一覧取得API';
    var getBooks = API.getBooks();
    var books;
    getBooks.done(function(data){
        console.log(endpointName +  '：' + getBooks.status);
        books = data.books;
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
    console.log(books);
    
    displayBooks(books);
}

function displayBooks(books) {
    var bookListElement = '';
    var imageBasePath = '//s3-ap-northeast-1.amazonaws.com/bookshelf-image/uploads/';
    if (books.length > 0) {
        books.forEach(function (book) {
            var id          = book.id;
            var title       = book.title;
            var image       = imageBasePath + book.image;
            var status      = book.status;
            var return_date = (book.return_date) ? book.return_date     : '返却日未定';
            var petition    = (status === 0)     ? 'petition active'    : 'petition';
            var reading     = (status === 1)     ? 'reading active'     : 'reading';
            var safekeeping = (status === 2)     ? 'safekeeping active' : 'safekeeping';

            var bookItemElement = '<div id="' + id + '" class="book_item">'
                                + '<form class="form_datepicker" name="update_return_date" action="">'
                                + '<small class="return_date_title">返却予定日</small>'
                                + '<input class="datepicker" type="text" name="book_return_date" onblur="updateReturnDate(this)" value="' + return_date + '" readonly="readonly">' 
                                + '</form>' 
                                + '<div class="book_image"><img src="' + image + '" alt=""></div>'
                                + '<div class="book_detail"><div class="book_title">' + title + '</div>'
                                + '<form name="update_status" action="">' 
                                + '<div class="book_status ' + petition + '"><input type="button" name="book_petition" value="申請中" onclick="updateBookPetition(this);"></div>'
                                + '<div class="book_status ' + reading + '"><input type="button" name="book_reading" value="貸出中" onclick="updateBookReading(this);"></div>'
                                + '<div class="book_status ' + safekeeping + '"><input type="button" name="book_safekeeping" value="保管中" onclick="updateBookSafekeeping(this);"></div>'
                                + '</form>'
                                + '<form name="delete_book" action="">'
                                + '<div class="book_delete">'
                                + '<input type="button" name="submit_book_delete" value="削除する" onclick="deleteBook(this);"><img src="./images/icon_trash.png" alt="icon trash"></div>'
                                + '</form>'
                                + '</div></div>';

            bookListElement += bookItemElement;
        });
    } else {
        bookListElement = '<h1 id="no_books" >本ありません</h1>'
    }
    
    var bookList = document.getElementById('book_list');
    bookList.textContent = null;
    console.log(bookList);
    bookList.insertAdjacentHTML('afterbegin', bookListElement);
    setDatepicker();
}

function getBooksCountPetition() {
    var endpointName = '申請中数取得API';
    var getBooksCountPetition = API.getBooksCountPetition();
    var count;
    getBooksCountPetition.done(function(data){
        console.log(endpointName + '：' + getBooksCountPetition.status);
        count = data.count;
        document.getElementById('books_petition').textContent = count;
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

function getBooksCountReading() {
    var endpointName = '貸出中取得API'
    var getBooksCountReading = API.getBooksCountReading();
    var count;
    getBooksCountReading.done(function(data){
        console.log(endpointName + '：' + getBooksCountReading.status);
        count = data.count;
        document.getElementById('books_reading').textContent = count;
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

function getBooksCountSafekeeping() {
    var endpointName = '保管中数取得API';
    var getBooksCountSafekeeping = API.getBooksCountSafekeeping();
    var count;
    getBooksCountSafekeeping.done(function(data){
        console.log(endpointName + '：' + getBooksCountSafekeeping.status);
        count = data.count;
        document.getElementById('books_safekeeping').textContent = count;
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

function updateBookPetition(button) {
    var endpointName = '申請中更新API'
    var id    = button.parentElement.parentElement.parentElement.parentElement.id;
    var request = {
        id    : id
    };
    var updateBookPetition = API.updateBookPetition(request);
    updateBookPetition.done(function(data){
        getBooks();
        getStatusCount();
        console.log(endpointName + '：' + updateBookPetition.status);
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

function updateBookReading(button) {
    var endpointName = '貸出中更新API';
    var id    = button.parentElement.parentElement.parentElement.parentElement.id;
    var request = {
        id    : id
    };
    var updateBookReading = API.updateBookReading(request);
    updateBookReading.done(function(data){
        getBooks();
        getStatusCount();
        console.log(endpointName + '：' + updateBookReading.status);
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });    
}

function updateBookSafekeeping(button) {
    var endpointName = '保管中更新API';
    var id    = button.parentElement.parentElement.parentElement.parentElement.id;
    var request = {
        id    : id
    };
    var updateBookSafekeeping = API.updateBookSafekeeping(request);
    updateBookSafekeeping.done(function(data){
        getBooks();
        getStatusCount();
        console.log(endpointName + '：' + updateBookSafekeeping.status);
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });    
}

function deleteBook(button) {
    var endpointName = '本削除API';
    var id    = button.parentElement.parentElement.parentElement.parentElement.id;
    var request = {
        id    : id
    };
    if (!confirm('削除してもよろしいですか ?')) {
        return;
    };
    var deleteBook = API.deleteBook(request);
    deleteBook.done(function(data){
        console.log(endpointName + '：' + deleteBook.status);
        // bookItem = document.getElementById(id);
        // bookItem.parentNode.removeChild(bookItem);
        getBooks();
        getStatusCount();
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

function setDatepicker() {
    $.datepicker.setDefaults($.datepicker.regional["ja"]);
    $(".datepicker").datepicker({
        dateFormat     : 'yy-mm-dd',
        minDate        : '0',
        maxDate        : '+1m',
        buttonImage    : './images/date.jpg',
        showOn         : 'button',
        buttonImageOnly: true,
        showButtonPanel: true,
        beforeShow: function(input) {
            setTimeout(function() {
                var buttonPane = $(input)
                    .datepicker("widget")
                    .find(".ui-datepicker-buttonpane");

                var btn = $('<button class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" type="button">返却</button>');
                    btn.unbind("click")
                    .bind("click", function () {
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

function updateReturnDate(button){
    var endpointName = '返却日更新API';
    var id         = button.parentElement.parentElement.id;
    var returnDate = document.forms.update_return_date.book_return_date.value;
    var request = {
        id        : id,
        returnDate: returnDate
    };
    var updateReturnDate = API.updateReturnDate(request);
    setTimeout(function() {
        updateReturnDate.done(function(data){
            console.log(endpointName + '：' + updateReturnDate.status);
            getBooks();
            // alert('返却日を更新しました。');
        }).fail(function(data, textStatus, errorThrown) {
            displayResponseError(endpointName, data, textStatus, errorThrown);
        });
    }, 500 );
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