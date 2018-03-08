var protocol = location.protocol;
var host     = location.hostname ;
var port     = (location.port === '4567') ? ':4567/': '/';

var imageBasePath = protocol + '//' + host + port + 'uploads/';

window.addEventListener('load', function() {
    getBooks();
    getStatusCount();
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
        console.log(getBooks.status);
        books = data.books;
    }).fail(function(error) {
        console.log(getBooks.status);
        console.log(error);
    });
    console.log(books);
    var bookListElement = '';
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

    var bookList = document.getElementById('book_list');
    bookList.textContent = null;
    console.log(bookList);
    bookList.insertAdjacentHTML('afterbegin', bookListElement);

}

function getBooksCountUnread() {
    var getBooksCountUnread = API.getBooksCountUnread();
    var count;
    getBooksCountUnread.done(function(data){
        console.log(getBooksCountUnread.status);
        count = data.count;
        document.getElementById('books_unread').textContent = count;
    }).fail(function(error) {
        console.log(getBooksCountUnread.status);
        console.log(error);
    });
}

function getBooksCountReading() {
    var getBooksCountReading = API.getBooksCountReading();
    var count;
    getBooksCountReading.done(function(data){
        console.log(getBooksCountReading.status);
        count = data.count;
        document.getElementById('books_reading').textContent = count;
    }).fail(function(error) {
        console.log(getBooksCountReading.status);
        console.log(error);
    });
}

function getBooksCountFinished() {
    var getBooksCountFinished = API.getBooksCountFinished();
    var count;
    getBooksCountFinished.done(function(data){
        console.log(getBooksCountFinished.status);
        count = data.count;
        document.getElementById('books_finished').textContent = count;
    }).fail(function(error) {
        console.log(getBooksCountFinished.status);
        console.log(error);
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
        console.log(updateBookUnread.status);
    }).fail(function(error) {
        console.log(updateBookUnread.status);
        console.log(error);
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
        console.log(updateBookReading.status);
    }).fail(function(error) {
        console.log(updateBookReading.status);
        console.log(error);
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
        console.log(updateBookFinished.status);
    }).fail(function(error) {
        console.log(updateBookFinished.status);
        console.log(error);
    });    
}

function deleteBook(button) {
    var id    = button.parentElement.parentElement.parentElement.parentElement.id;
    var request = {
        id    : id
    };
    var deleteBook = API.deleteBook(request);
    deleteBook.done(function(data){
        console.log(deleteBook.status);
        bookItem = document.getElementById(id);
        bookItem.parentNode.removeChild(bookItem);
    }).fail(function(error) {
        console.log(deleteBook.status);
        console.log(error);
    });
}