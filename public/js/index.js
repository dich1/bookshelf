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
            alert('本一覧取得リクエスト失敗');
         });
        
        retryable(3, () => { 
            getStatusCount();
        }).catch(err => {
            alert('本ステータス取得リクエスト失敗');
        });
    }, 500);
});

function getStatusCount() {
    getBooksCountUnread();
    getBooksCountReading();
    getBooksCountFinished();
}

function getBooks() {
    var getBooks = API.getBooks();
    var books;
    getBooks.done(function(data){
        console.log('本一覧取得API：' + getBooks.status);
        books = data.books;
    }).fail(function(error) {
        console.log('本一覧取得API：' + getBooks.status);
        console.log('本一覧取得API：' + error);
    });
    console.log(books);
    
    displayBooks(books);
}

function displayBooks(books) {
    var bookListElement = '';
    var imageBasePath = 'https://s3-ap-northeast-1.amazonaws.com/bookshelf-image/uploads/';
    if (books.length > 0) {
        books.forEach(function (book) {
            var id     = book.id;
            var title  = book.title;
            var image  = imageBasePath + book.image;
            var status = book.status;
            var unread   = (status === '0') ? 'unread active'   : 'unread';
            var reading  = (status === '1') ? 'reading active'  : 'reading';
            var finished = (status === '2') ? 'finished active' : 'finished';

            var bookItemElement = '<div id="' + id + '" class="book_item"><div class="book_image"><img src="' + image + '" alt=""></div>'
                                + '<div class="book_detail"><div class="book_title">' + title + '</div>'
                                + '<form name="update_status" action="">' 
                                + '<div class="book_status ' + unread + '"><input type="button" name="book_unread" value="未読" onclick="updateBookUnread(this);"></div>'
                                + '<div class="book_status ' + reading + '"><input type="button" name="book_reading" value="読書中" onclick="updateBookReading(this);"></div>'
                                + '<div class="book_status ' + finished + '"><input type="button" name="book_finished" value="既読" onclick="updateBookFinished(this);"></div>'
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
}

function getBooksCountUnread() {
    var getBooksCountUnread = API.getBooksCountUnread();
    var count;
    getBooksCountUnread.done(function(data){
        console.log('未読数取得API：' + getBooksCountUnread.status);
        count = data.count;
        document.getElementById('books_unread').textContent = count;
    }).fail(function(error) {
        console.log('未読数取得API：' + getBooksCountUnread.status);
        console.log(error);
    });
}

function getBooksCountReading() {
    var getBooksCountReading = API.getBooksCountReading();
    var count;
    getBooksCountReading.done(function(data){
        console.log('読書中取得API：' + getBooksCountReading.status);
        count = data.count;
        document.getElementById('books_reading').textContent = count;
    }).fail(function(error) {
        console.log('読書中取得API：' + getBooksCountReading.status);
        console.log('読書中取得API：' + error);
    });
}

function getBooksCountFinished() {
    var getBooksCountFinished = API.getBooksCountFinished();
    var count;
    getBooksCountFinished.done(function(data){
        console.log('既読数取得API：' + getBooksCountFinished.status);
        count = data.count;
        document.getElementById('books_finished').textContent = count;
    }).fail(function(error) {
        console.log('既読数取得API：' + getBooksCountFinished.status);
        console.log('既読数取得API：' + error);
    });
}

function updateBookUnread(button) {
    var id    = button.parentElement.parentElement.parentElement.parentElement.id;
    var status = '0';
    var request = {
        id    : id,
        status: status
    };
    var updateBookUnread = API.updateBookUnread(request);
    updateBookUnread.done(function(data){
        getBooks();
        getStatusCount();
        console.log('未読更新API：' + updateBookUnread.status);
    }).fail(function(error) {
        console.log('未読更新API：' + updateBookUnread.status);
        console.log('未読更新API：' + error);
        alert('リクエスト失敗したのでもう一回お願いします。');
    });
}

function updateBookReading(button) {
    var id    = button.parentElement.parentElement.parentElement.parentElement.id;
    var status = '1';
    var request = {
        id    : id,
        status: status
    };
    var updateBookReading = API.updateBookReading(request);
    updateBookReading.done(function(data){
        getBooks();
        getStatusCount();
        console.log('読書中更新API：' + updateBookReading.status);
    }).fail(function(error) {
        console.log('読書中更新API：' + updateBookReading.status);
        console.log(error);
        alert('リクエスト失敗したのでもう一回お願いします。');
    });    
}

function updateBookFinished(button) {
    var id    = button.parentElement.parentElement.parentElement.parentElement.id;
    var status = '2';
    var request = {
        id    : id,
        status: status
    };
    var updateBookFinished = API.updateBookFinished(request);
    updateBookFinished.done(function(data){
        getBooks();
        getStatusCount();
        console.log('既読更新API：' + updateBookFinished.status);
    }).fail(function(error) {
        console.log('既読更新API：' + updateBookFinished.status);
        console.log('既読更新API：' + error);
        alert('リクエスト失敗したのでもう一回お願いします。');
    });    
}

function deleteBook(button) {
    var id    = button.parentElement.parentElement.parentElement.parentElement.id;
    var request = {
        id    : id
    };
    var deleteBook = API.deleteBook(request);
    deleteBook.done(function(data){
        console.log('本削除API：' + deleteBook.status);
        // bookItem = document.getElementById(id);
        // bookItem.parentNode.removeChild(bookItem);
        getBooks();
        getStatusCount();
    }).fail(function(error) {
        console.log('本削除API：' + deleteBook.status);
        console.log('本削除API：' + error);
    });
}
