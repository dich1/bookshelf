function registerBook(button) {
    var title = document.forms.register_book.book_title.value;
    var image;
    if (document.forms.register_book.book_image.files.length > 0) {
      image = document.forms.register_book.book_image.files[0];
    }
    var status = '0';
    var request = new FormData();
    request.append('title', title);
    request.append('image', image);
    request.append('status', status);

    var registerBook = API.registerBook(request);
    registerBook.done(function(data){
        console.log('本登録API：' + registerBook.status);
    }).fail(function(error) {
        console.log('本登録API：' + registerBook.status);
        console.log('本登録API：' + error);
    });
    location.href = './index.html' + '?' + (new Date()).getTime();
}

function updateBook(button) {
    var id    = 0;
    var title = '更新タイトル';
    var image = '更新画像';
    var status = '更新状態';
    var request = {
        id    : id,
        title : title,
        image : image,
        status: status
    };
    var updateBook = API.updateBook(request);
    updateBook.done(function(data){
        console.log(updateBook.status);
    }).fail(function(error) {
        console.log(updateBook.status);
        console.log(error);
    });
}