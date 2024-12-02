let mapContainer = document.getElementById('map'); // 지도를 표시할 div
let mapOption = {
    center: new kakao.maps.LatLng(36.3504, 127.3845), // 지도의 중심좌표
    level: 9, // 지도의 확대 레벨
    //disableDoubleClickZoom : true
};

let map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성
let customOverlay = new kakao.maps.CustomOverlay({}); // 커스텀 오버레이
let detailMode = false; // 줌 레벨에 따른 행정구역 모드
let areas = [];
let polygons = [];
let currentHighlightedPolygon = null; // 현재 하이라이트된 폴리곤

// Candidate_Info와 당선자 정보를 저장할 변수
let candidateInfo = [];
// 지역별 좌표 정보
const locations = {
    seoul: { lat: 37.5665, lng: 126.9780 },
    busan: { lat: 35.1796, lng: 129.0756 },
    Daegu: { lat: 35.8714, lng: 128.6014 },
    incheon: { lat: 37.4563, lng: 126.7052 },
    Gwanju: { lat: 35.1595, lng: 126.8526 },
    daegeon: { lat: 36.3504, lng: 127.3845 },
    ewolsan: { lat: 35.5384, lng: 129.3114 },
    sejong: { lat: 36.4809, lng: 127.2891 }
};

// 초기 데이터를 불러오고 후보자 정보도 함께 로드
loadCandidateInfo();
init("../JSON/2020_21_elec_253.json");

// 지도 줌 변경 이벤트 등록
kakao.maps.event.addListener(map, 'zoom_changed', function () {
    let level = map.getLevel(); // 현재 지도 레벨 확인
    if (!detailMode && level <= 10) {
        detailMode = true;
        removePolygons();
        init("../JSON/2020_21_elec_253.json"); // 시군구 데이터를 로드
    } else if (detailMode && level > 10) {
        detailMode = false;
        removePolygons();
        init("../JSON/sido.json"); // 시도 데이터를 로드
    }
});

// 모든 폴리곤 삭제 함수
function removePolygons() {
    for (let i = 0; i < polygons.length; i++) {
        polygons[i].setMap(null); // 지도에서 제거
    }
    areas = [];
    polygons = [];
    currentHighlightedPolygon = null; // 현재 하이라이트 초기화
}

// Candidate_Info.json 데이터를 로드하는 함수
function loadCandidateInfo() {
    $.getJSON("../JSON/Daejeon_example.json", function (data) {
        candidateInfo = data.results; // 후보자 정보를 저장
    });
}

// GeoJSON 데이터 기반으로 폴리곤 생성 함수
function init(jsonPath) {
    $.getJSON(jsonPath, function (geojson) {
        let features = geojson.features; // "features" 키의 데이터를 가져옴

        $.each(features, function (index, feature) {
            let coordinates = feature.geometry.coordinates; // MultiPolygon 좌표
            let name = feature.properties.SGG_2; // 지역 이름
            let regionCode = feature.properties.SGG_Code; // 지역 코드

            // 다중 폴리곤 처리
            coordinates.forEach(multiPolygon => {
                multiPolygon.forEach(polygonCoords => {
                    // 폴리곤 경로 데이터 설정
                    let path = polygonCoords.map(coord => new kakao.maps.LatLng(coord[1], coord[0]));

                    areas.push({ name: name, path: path, regionCode: regionCode });
                    displayArea({ name: name, path: path, regionCode: regionCode }); // 폴리곤을 지도에 표시
                });
            });
        });
    });
}

// 폴리곤을 지도에 표시하는 함수
function displayArea(area) {
    let polygon = new kakao.maps.Polygon({
        map: map,
        path: area.path,
        strokeWeight: 2,
        strokeColor: 'gray',
        strokeOpacity: 0.8,
        fillColor: '#fff',
        fillOpacity: 0.7,
    });

    polygons.push(polygon);
    kakao.maps.event.preventMap();
    // 클릭 이벤트 처리
    kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
        kakao.maps.event.preventMap(); // 기본 확대 동작 막기
        findCandidates(area.name);
    });

    // 마우스 오버 및 다른 이벤트 추가
    kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
        console.log(mouseEvent.latLng);
        if (currentHighlightedPolygon && currentHighlightedPolygon !== polygon) {
            currentHighlightedPolygon.setOptions({ fillColor: '#fff' });
        }

        polygon.setOptions({ fillColor: 'gray' });
        currentHighlightedPolygon = polygon;

        customOverlay.setContent('<div class="area">' + area.name + '</div>');
        customOverlay.setPosition(mouseEvent.latLng);
        customOverlay.setMap(map);
    });

    // 마우스가 폴리곤 내부에서 움직일 때 오버레이 위치 업데이트
    kakao.maps.event.addListener(polygon, 'mousemove', function (mouseEvent) {
        kakao.maps.event.preventMap();
        customOverlay.setPosition(mouseEvent.latLng);
    });
    kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
        // 더블 클릭 이벤트 발생 시 지도 기본 확대 동작 방지
        kakao.maps.event.preventMap();
        console.log(area.name);
        // 더블 클릭한 지역구의 이름으로 후보자 검색 수행
        findCandidates(area.name);
    });
}


function findCandidates(regionName) {
    // 주어진 지역구에 해당하는 후보자들을 필터링
    console.log(candidateInfo);
    let candidates = candidateInfo.filter(candidate => candidate.sggName == regionName);
    console.log(candidates);
    let candidateListDiv = document.getElementById('candidate-list');

    // 기존 후보자 목록 초기화
    candidateListDiv.innerHTML = '';

    // 후보자가 존재하지 않으면 알림 표시
    if (candidates.length === 0) {
        alert("해당 지역구의 후보자가 없습니다");
        return;
    }

    // 후보자들을 div에 추가
    var count = 1;
    candidates.forEach(candidate => {
        let candidateDiv = document.createElement('div');
        candidateDiv.className = 'candidate';

        // 후보자의 정보를 포함하는 HTML 구조
        candidateDiv.innerHTML = `
            <div class="photo">
                <img src="../Candidate_photo/${candidate.cnddtId}.jpg" alt="${candidate.krName}" style="width:60px; height:80px; cursor: pointer;" />
            </div>
            <div class="info">
                <div class="name" style="cursor: pointer;">${count}.${candidate.krName}</div>
            </div>`;
        count++;

        // 후보자 photo 클릭 이벤트 추가
        candidateDiv.querySelector('.photo img').addEventListener('click', () => {
            navigateToCandidate(candidate.cnddtId);
        });

        // 후보자 name 클릭 이벤트 추가
        candidateDiv.querySelector('.name').addEventListener('click', () => {
            navigateToCandidate(candidate.cnddtId);
        });

        // 후보자 div를 후보자 목록 div에 추가
        candidateListDiv.appendChild(candidateDiv);
    });
}

// 후보자 페이지로 이동하는 함수
function navigateToCandidate(candidateId) {
    sessionStorage.setItem('selectedCandidateNum', candidateId);
    const url = `../Candidate_Main/Candidate_main.html?cnddtId=${candidateId}`;
    window.location.href = url; // URL로 이동
}

// 이벤트 핸들러 추가
Object.keys(locations).forEach((key) => {
    const li = document.getElementById(key);
    if (li) {
        li.addEventListener('click', () => {
            const { lat, lng } = locations[key];
            const moveLatLng = new kakao.maps.LatLng(lat, lng);
            map.setCenter(moveLatLng); // 지도 중심 이동
        });
    }
});
