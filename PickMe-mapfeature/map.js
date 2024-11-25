let mapContainer = document.getElementById('map'); // 지도를 표시할 div
let mapOption = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
    level: 12 // 지도의 확대 레벨
};

let map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성
let customOverlay = new kakao.maps.CustomOverlay({}); // 커스텀 오버레이
let detailMode = false; // 줌 레벨에 따른 행정구역 모드
let areas = [];
let polygons = [];
let currentHighlightedPolygon = null; // 현재 하이라이트된 폴리곤

// 초기 "sido.json" 데이터 로드
init("sido.json");

// 지도 줌 변경 이벤트 등록
kakao.maps.event.addListener(map, 'zoom_changed', function () {
    let level = map.getLevel(); // 현재 지도 레벨 확인
    if (!detailMode && level <= 10) {
        detailMode = true;
        removePolygons();
        init("2020_21_elec_253.json"); // 시군구 데이터를 로드
    } else if (detailMode && level > 10) {
        detailMode = false;
        removePolygons();
        init("sido.json"); // 시도 데이터를 로드
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

// GeoJSON 데이터 기반으로 폴리곤 생성 함수
// GeoJSON 데이터 기반으로 폴리곤 생성 함수
function init(jsonPath) {
$.getJSON(jsonPath, function (geojson) {
let features = geojson.features; // "features" 키의 데이터를 가져옴

$.each(features, function (index, feature) {
    let coordinates = feature.geometry.coordinates; // MultiPolygon 좌표
    let name = feature.properties.SGG_3 || feature.properties.SGG_2; // 지역 이름
    let regionCode = feature.properties.SGG_Code; // 지역 코드

    // 다중 폴리곤 처리
    coordinates.forEach(multiPolygon => {
        multiPolygon.forEach(polygonCoords => {
            // 폴리곤 경로 데이터 설정
            let path = polygonCoords.map((coord) => new kakao.maps.LatLng(coord[1], coord[0]));

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
strokeColor: '#004c80',
strokeOpacity: 0.8,
fillColor: '#fff',
fillOpacity: 0.7
});

polygons.push(polygon); // 폴리곤을 배열에 추가

// 폴리곤 마우스 오버 이벤트
kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
// 현재 하이라이트된 폴리곤이 있다면 색상 복원
if (currentHighlightedPolygon && currentHighlightedPolygon !== polygon) {
    currentHighlightedPolygon.setOptions({ fillColor: '#fff' }); // 원래 색으로 복원
}

polygon.setOptions({ fillColor: '#09f' }); // 새 폴리곤 하이라이트
currentHighlightedPolygon = polygon; // 현재 하이라이트된 폴리곤 업데이트

customOverlay.setContent('<div class="area">' + area.name + '</div>'); // 지역 이름 표시
customOverlay.setPosition(mouseEvent.latLng); // 커스텀 오버레이 위치 설정
customOverlay.setMap(map); // 지도에 표시
});



// 마우스가 폴리곤 내부에서 움직일 때 오버레이 위치 업데이트
kakao.maps.event.addListener(polygon, 'mousemove', function (mouseEvent) {
customOverlay.setPosition(mouseEvent.latLng); // 커스텀 오버레이 위치 업데이트
});

// 폴리곤 클릭 이벤트
kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
if (!detailMode) {
    map.setLevel(10); // 줌 레벨 변경
    map.panTo(mouseEvent.latLng); // 클릭한 위치로 이동
} else {
    loadcandidate(area.name); // 지역구 후보자 나열
}
});
}
async function loadcandidate(sidoname){
  try {
    // JSON 파일 로드
    const response = await fetch('example.json');
    const jsonData = await response.json();
    const stringList=sidoname.split(" ");
    let verifyingname=false;

    const matchingCandidates = jsonData.results.filter(candidate => {
        return candidate.sidoName.includes(stringList[0]) && candidate.wiwName.includes(stringList[1]);
    });
    const candidateListElement = document.getElementById('candidatelist');
    matchingCandidates.forEach(candidate => {
      const name = `candidateimage/${candidate.krName}.jpg`;
      const candidateName = `${candidate.krName}`;
      const candidateElement = document.createElement('div');
      candidateElement.id="candidate";
      candidateElement.innerHTML = `
                      <img id="candidateimg" src="${name}" alt="${candidate.krName}" />
                      <p>${candidate.krName}</p>`;
      // 클릭 이벤트 처리
      candidateElement.addEventListener('click', () => {
        sessionStorage.setItem('selectedCandidateName', candidateName);
        window.location.href = 'main.html'; // 상세 페이지로 이동
                                 });
      candidateListElement.appendChild(candidateElement);
});
  } catch (error) {
    console.error("JSON 데이터를 로드하는 중 문제가 발생했습니다:", error);
  }
}
