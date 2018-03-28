function displayResponseError(endpointName, data, textStatus, errorThrown) {
    console.log(endpointName + 'エラーステータス：' + data.status);
    console.log(endpointName + 'ステータスメッセージ：' + textStatus);
    console.log(endpointName + 'エラーメッセージ：' + errorThrown.message);
    alert('リクエスト失敗したのでもう一回お願いします。');
}

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
            alert('本一覧取得リクエスト失敗。通信状態を確認してください');
         });
        
        retryable(3, () => { 
            getStatusCount();
        }).catch(err => {
            alert('本ステータス取得リクエスト失敗。通信状態を確認してください');
        });
    }, 1000);
});