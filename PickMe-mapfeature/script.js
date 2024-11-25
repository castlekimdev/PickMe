function fetchData() {
    var xhr = new XMLHttpRequest();
    var url = 'http://apis.data.go.kr/9760000/ElecPrmsInfoInqireService/getCnddtElecPrmsInfoInqire';
    var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + 'rV40VSAeN%2F7MexA9QUW85VADF9kqQy4HdOt1oWL66%2FhSwDERT62bLEKxV5Wy%2Ff9%2FXlDQa73alpQccwHQrlq2pg%3D%3D';
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
    queryParams += '&' + encodeURIComponent('sgId') + '=' + encodeURIComponent('20220309');
    queryParams += '&' + encodeURIComponent('sgTypecode') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('cnddtId') + '=' + encodeURIComponent('100138362');

    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                console.log('API Response:', this.responseText);
                document.getElementById('result').textContent = this.responseText;
            } else {
                console.error('Error fetching data:', this.status);
                document.getElementById('result').textContent = '데이터를 가져오는 데 실패했습니다. 상태 코드: ' + this.status;
            }
        }
    };
    xhr.send();
}
