const DEFAULT_DETAIL_PAGES = 4;

$(document).on('click', '.book_image', function(){
    var bookId = event.path[2].id;
    getBookDetail(bookId);
});

$('#overlay').click(function(event){
    $('#overlay, #book_detail').fadeOut();
});

function getBookDetail(id) {
    var endpointName = '本詳細取得API';
    var request = {
        id   : id,
    };
    var getBookDetail = API.getBookDetail(request);
    var memo;
    getBookDetail.done(function(data){
        console.log(endpointName + '：' + getBookDetail.status);
        memo = data.memo;
    }).fail(function(data, textStatus, errorThrown) {
        if (data.status !== 404) {
            displayResponseError(endpointName, data, textStatus, errorThrown);
        }
        memo = null;
    });

    displayBookDetail(id, memo);
}

function displayBookDetail(bookId, memo) {
    $('#overlay, #book_detail').fadeIn();
    var bookDetailElement = createBookDetailElement(bookId, memo);
    var bookDetail = document.getElementById('book_detail');
    bookDetail.textContent = null;
    console.log(bookDetail);
    bookDetail.insertAdjacentHTML('afterbegin', bookDetailElement);
    setBooklet();
}

function updateBookDetail(button) {
    var endpointName = '本詳細更新API';
    var id   = button.parentElement.className;

    var text = [];
    var memoElements = document.getElementsByClassName(id);
    for (var i = 0; i < memoElements.length; i++) {
        text[i] = memoElements[i].childNodes[0].value;
    }

    var memo = createBookDetailElement(id, text);
    console.log('本詳細エレメント' + memo);

    var request = {
        id   : id,
        memo : memo
    };
    var updateBookDetail = API.updateBookDetail(request);
    updateBookDetail.done(function(data){
        console.log(endpointName + '：' + updateBookDetail.status);
    }).fail(function(data, textStatus, errorThrown) {
        displayResponseError(endpointName, data, textStatus, errorThrown);
    });
}

function createBookDetailElement(bookId, text) {
    // TODO 動的にページを増やせるようにする
    var bookDetailElement;
    if (text === null || Array.isArray(text)) {
        var pages = (text === null) ? DEFAULT_DETAIL_PAGES : text.length;
        for (var i = 0; i < pages; i++) { 
            var detailPage    = '<div class="' + bookId + '" >';
            if (text === null) {
                detailPage += '<textarea rows="17" cols="40" onblur="updateBookDetail(this);"></textarea>'; 
            } else {
                detailPage += '<textarea rows="17" cols="40" onblur="updateBookDetail(this);">' + text[i] + '</textarea>';
            }
            detailPage += '</div>';
            bookDetailElement += detailPage;
        }
    } else {
        bookDetailElement = text;
    }

    return bookDetailElement;
}

function setBooklet() {
    $('#book_detail').booklet({
        name  : "BookDetail",
        width : 720,
        height: 480
    });
    locateCenter();
}

function locateCenter() {
    let w = $(window).width();
    let h = $(window).height();
    
    let cw = $('#book_detail').outerWidth();
    let ch = $('#book_detail').outerHeight();
   
    $('#book_detail').css({
        'left': ((w - cw) / 2) + 'px',
        'top': ((h - ch) / 2) + 'px'
    });
}