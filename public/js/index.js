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
    }, 1000);
});

function getStatusCount() {
    getBooksCountPetition();
    getBooksCountReading();
    getBooksCountSafekeeping();
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
            var petition    = (status === 0) ? 'petition active'    : 'petition';
            var reading     = (status === 1) ? 'reading active'     : 'reading';
            var safekeeping = (status === 2) ? 'safekeeping active' : 'safekeeping';

            var bookItemElement = '<div id="' + id + '" class="book_item"><div class="book_image"><img src="' + image + '" alt=""></div>'
                                + '<div class="book_detail"><div class="book_title">' + title + '</div>'
                                + '<form name="update_status" action="">' 
                                + '<div class="book_status ' + petition + '"><input type="button" name="book_petition" value="申請中" onclick="updateBookPetition(this);"></div>'
                                + '<div class="book_status ' + reading + '"><input type="button" name="book_reading" value="読書中" onclick="updateBookReading(this);"></div>'
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
}

function getBooksCountPetition() {
    var getBooksCountPetition = API.getBooksCountPetition();
    var count;
    getBooksCountPetition.done(function(data){
        console.log('申請中数取得API：' + getBooksCountPetition.status);
        count = data.count;
        document.getElementById('books_petition').textContent = count;
    }).fail(function(error) {
        console.log('申請中数取得API：' + getBooksCountPetition.status);
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

function getBooksCountSafekeeping() {
    var getBooksCountSafekeeping = API.getBooksCountSafekeeping();
    var count;
    getBooksCountSafekeeping.done(function(data){
        console.log('保管中数取得API：' + getBooksCountSafekeeping.status);
        count = data.count;
        document.getElementById('books_safekeeping').textContent = count;
    }).fail(function(error) {
        console.log('保管中数取得API：' + getBooksCountSafekeeping.status);
        console.log('保管中数取得API：' + error);
    });
}

function updateBookPetition(button) {
    var id    = button.parentElement.parentElement.parentElement.parentElement.id;
    var request = {
        id    : id
    };
    var updateBookPetition = API.updateBookPetition(request);
    updateBookPetition.done(function(data){
        getBooks();
        getStatusCount();
        console.log('申請中更新API：' + updateBookPetition.status);
    }).fail(function(error) {
        console.log('申請中更新API：' + updateBookPetition.status);
        console.log('申請中更新API：' + error);
        alert('リクエスト失敗したのでもう一回お願いします。');
    });
}

function updateBookReading(button) {
    var id    = button.parentElement.parentElement.parentElement.parentElement.id;
    var request = {
        id    : id
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

function updateBookSafekeeping(button) {
    var id    = button.parentElement.parentElement.parentElement.parentElement.id;
    var request = {
        id    : id
    };
    var updateBookSafekeeping = API.updateBookSafekeeping(request);
    updateBookSafekeeping.done(function(data){
        getBooks();
        getStatusCount();
        console.log('保管中更新API：' + updateBookSafekeeping.status);
    }).fail(function(error) {
        console.log('保管中更新API：' + updateBookSafekeeping.status);
        console.log('保管中更新API：' + error);
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
