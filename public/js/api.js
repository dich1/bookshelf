var API = (function() {
    var protocol = location.protocol;
    var host     = location.hostname ;
    var port     = location.port;
    var apiPath = (port === '4567') ? ':4567/api/'   : '/api/';
    var baseUrl;
    if (protocol == 'file:') {
        baseUrl = '//localhost:4567/api/';
    } else {
        baseUrl  = protocol + '//' + host + apiPath;
    }


    function getBooks(request) {
        return $.ajax({
            type    : 'GET',
            url     : baseUrl + 'books/',
            dataType: 'json',
            data    : request,
            async   : false,
            timeout : 10000
        });
    }

    function getBooksCountPetition() {
        return $.ajax({
            type    : 'GET',
            url     : baseUrl + 'books/count/petition/',
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

    function getBooksCountSafekeeping() {
        return $.ajax({
            type    : 'GET',
            url     : baseUrl + 'books/count/safekeeping/',
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
            async      : false,
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

    function updateBookPetition(request) {
        return $.ajax({
            type    : 'PUT',
            url     : baseUrl + 'book/petition/',
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

    function updateBookSafekeeping(request) {
        return $.ajax({
            type    : 'PUT',
            url     : baseUrl + 'book/safekeeping/',
            dataType: 'json',
            data    : request,
            async   : true,
            timeout : 10000
        });
    }

    function updateReturnDate(request) {
            return $.ajax({
            type    : 'PUT',
            url     : baseUrl + '/book/return-date/',
            dataType: 'json',
            data    : request,
            async   : false,
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
        getBooks                : getBooks,
        getBooksCountPetition   : getBooksCountPetition,
        getBooksCountReading    : getBooksCountReading,
        getBooksCountSafekeeping: getBooksCountSafekeeping,
        registerBook            : registerBook,
        updateBook              : updateBook,
        updateBookPetition      : updateBookPetition,
        updateBookReading       : updateBookReading,
        updateBookSafekeeping   : updateBookSafekeeping,
        updateReturnDate        : updateReturnDate,
        deleteBook              : deleteBook
    };
})();