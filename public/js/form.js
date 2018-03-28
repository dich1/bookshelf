function registerBook(button) {
    var endpointName = '本登録API'
    var title = document.forms.register_book.book_title.value;
    var message;
    if (title.length === 0) {
        alert('タイトルを入力してください');
        return;
    }
    var image;
    if (document.forms.register_book.book_image.files.length === 0) {
        alert('画像を添付してください');
        return;
    }
    image = document.forms.register_book.book_image.files[0];
    var status = 0;
    var request = new FormData();
    request.append('title', title);
    request.append('image', image);
    request.append('status', status);

    var registerBook = API.registerBook(request);
    registerBook.done(function(data){
        console.log(endpointName + '：' + registerBook.status);
        alert('本を登録しました。');
        location.href = './index.html' + '?' + (new Date()).getTime();
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
    // FIXME 暫定対応のため、後で削除
    location.href = './index.html' + '?' + (new Date()).getTime();

}

// FIXME 本更新APIテスト用(本詳細画面作成時に使用)
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
    }).fail(function(data, textStatus, errorThrown) {
        console.log(updateBook.status);
        console.log(data, textStatus, errorThrown);
    });
}
