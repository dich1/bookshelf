$(document).on('click', '.book_image', function(){
    $('#overlay, #book_detail').fadeIn();
    // FIXME 動的に詳細情報取得
    var bookDetailElement = '<div>'
                          + '<form action="cgi-bin/formmail.cgi" method="post">'
                          + '<textarea class="memo" name="" rows="31" cols="50"></textarea>'
                          + '</form>'
                          + '</div>'
                          + '<div>'
                          + '<form action="cgi-bin/formmail.cgi" method="post">'
                          + '<textarea name="" rows="31" cols="50"></textarea>'
                          + '</div>'
                          + '<div>'
                          + '<form action="cgi-bin/formmail.cgi" method="post">'
                          + '<textarea name="" rows="31" cols="50"></textarea>'
                          + '</div>'
                          + '<div>'
                          + '<form action="cgi-bin/formmail.cgi" method="post">'
                          + '<textarea name="" rows="31" cols="50"></textarea>'
                          + '</div>'
                          + '<div>'
                          + '<form action="cgi-bin/formmail.cgi" method="post">'
                          + '<textarea name="" rows="31" cols="50"></textarea>'
                          + '</div>'
                          + '</div>';
    var bookDetail = document.getElementById('book_detail');
    bookDetail.textContent = null;
    console.log(bookDetail);
    bookDetail.insertAdjacentHTML('afterbegin', bookDetailElement);
    locateCenter();
    $(window).resize(locateCenter);
    setBooklet();
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

function setBooklet() {
    $('#book_detail').booklet({
        name: "BookDetail",
        width: 720,
        height: 480
    });
}