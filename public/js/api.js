var API = (function() {
    var protocol = location.protocol;
    var host     = location.hostname ;
    var port     = location.port;
    var apiPath = (port === '4567') ? ':4567/api/'   : '/api/';

    var baseUrl  = protocol + '//' + host + apiPath;


    function getBooks() {
        return $.ajax({
            type    : 'GET',
            url     : baseUrl + 'books/',
            dataType: 'json',
            async   : false,
            timeout : 10000
        });
    }

    function getBooksCountUnread() {
        return $.ajax({
            type    : 'GET',
            url     : baseUrl + 'books/count/unread/',
            dataType: 'json',
            async   : true,
            timeout : 10000
        });
    }

    function getBooksCountReading() {
        return $.ajax({
            type    : 'GET',
            url     : baseUrl + 'books/count/reading/',
            dataType: 'json',
            async   : true,
            timeout : 10000
        });
    }

    function getBooksCountFinished() {
        return $.ajax({
            type    : 'GET',
            url     : baseUrl + 'books/count/finished/',
            dataType: 'json',
            async   : true,
            timeout : 10000
        });
    }

    function registerBook(request) {
        return $.ajax({
            type       : 'POST',
            url        : baseUrl + 'book/',
            dataType   : 'json',
            data       : request,
            async      : true,
            timeout    : 10000,
            processData: false,
            contentType: false
        });
    }

    function updateBook(request) {
        return $.ajax({
            type    : 'PUT',
            url     : baseUrl + 'book/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    function updateBookUnread(request) {
        return $.ajax({
            type    : 'PUT',
            url     : baseUrl + 'book/unread/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    function updateBookReading(request) {
        return $.ajax({
            type    : 'PUT',
            url     : baseUrl + 'book/reading/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    function updateBookFinished(request) {
        return $.ajax({
            type    : 'PUT',
            url     : baseUrl + 'book/finished/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    function deleteBook(request) {
        return $.ajax({
            type    : 'DELETE',
            url     : baseUrl + 'book/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    return {
        getBooks             : getBooks,
        getBooksCountUnread  : getBooksCountUnread,
        getBooksCountReading : getBooksCountReading,
        getBooksCountFinished: getBooksCountFinished,
        registerBook         : registerBook,
        updateBook           : updateBook,
        updateBookUnread     : updateBookUnread,
        updateBookReading    : updateBookReading,
        updateBookFinished   : updateBookFinished,
        deleteBook           : deleteBook
    };
})();