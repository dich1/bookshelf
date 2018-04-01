$(document).on('click', '.book_image', function(){
    $('#overlay, #book_detail').fadeIn();
    // FIXME 動的に詳細情報取得
    var bookDetailElement = '<div>'
                          + '<h3>Yay, Page 1!</h3>'
                          + '</div>'
                          + '<div>'
                          + '<h3>Yay, Page 2!</h3>'
                          + '</div>'
                          + '<div>'
                          + '<h3>Yay, Page 3!</h3>'
                          + '</div>'
                          + '</div>';
    var bookDetail = document.getElementById('book_detail');
    bookDetail.textContent = null;
    console.log(bookDetail);
    bookDetail.insertAdjacentHTML('afterbegin', bookDetailElement);
    locateCenter();
    $(window).resize(locateCenter);
    $('#book_detail').booklet();
});

$('#overlay').click(function(event){
    $('#overlay, #book_detail').fadeOut();
});

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