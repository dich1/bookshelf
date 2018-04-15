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
            getBooks(null, null);
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

function getBooks(status, page) {
    var endpointName = '本一覧取得API';
    var request = {};
    if (status !== null) {
        request['status'] = status;
    }
    if (page !== null) {
        request['page']   = page;
    }
    var getBooks = API.getBooks(request);
    var books;
    getBooks.done(function(data){
        console.log(endpointName +  '：' + getBooks.status);
        books   = data.books;
        records = data.records;
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
    console.log(books);
    
    displayBooks(books);
    setPagination(status, records);
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
                                + '<input class="datepicker" type="text" name="book_return_date" value="' + return_date + '" readonly="readonly">' 
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
        getBooks(null);
        getStatusCount();
        console.log(endpointName + '：' + updateBookPetition.status);
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

function updateBookReading(button) {
    var endpointName = '貸出中更新API';
    var id = button.parentElement.parentElement.parentElement.parentElement.id;
    var request = {
        id    : id
    };
    var updateBookReading = API.updateBookReading(request);
    updateBookReading.done(function(data){
        getBooks(null);
        getStatusCount();
        console.log(endpointName + '：' + updateBookReading.status);
        alert('本を借りました。');
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });    
}

function updateBookSafekeeping(button) {
    var endpointName = '保管中更新API';
    var id = button.parentElement.parentElement.parentElement.parentElement.id;
    var request = {
        id    : id
    };
    var updateBookSafekeeping = API.updateBookSafekeeping(request);
    updateBookSafekeeping.done(function(data){
        getBooks(null);
        getStatusCount();
        console.log(endpointName + '：' + updateBookSafekeeping.status);
        alert('本を返却しました。');
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });    
}

function deleteBook(button) {
    var endpointName = '本削除API';
    var id = button.parentElement.parentElement.parentElement.parentElement.id;
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
        getBooks(null);
        getStatusCount();
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

function updateReturnDate(dateText, event){
    var endpointName = '返却日更新API';
    var id         = event.input[0].parentElement.parentElement.id
    var returnDate = dateText;
    var request = {
        id        : id,
        returnDate: returnDate
    };
    var updateReturnDate = API.updateReturnDate(request);
    updateReturnDate.done(function(data){
        console.log(endpointName + '：' + updateReturnDate.status);
        getBooks(null);
        alert('返却日を更新しました。');
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}