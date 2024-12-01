const loadCandidateData = async () => {
  try {
    // JSON 파일 로드
    const response = await fetch('Candidate_Info.json');
    const jsonData = await response.json();

    const searchCandidate = sessionStorage.getItem('selectedCandidateNum');
    if (searchCandidate) {
      // 태그 표시
      displayRealmNames(jsonData, searchCandidate);

      for (const candidate of jsonData.results) {
        if (candidate.num == searchCandidate) {
          const name = `Candidate_Photo/${candidate.cnddtId}.jpg`;

          // 후보자 이미지 가져오기
          document.querySelector("#image").innerHTML = `<img src="${name}" alt="${candidate.krName}">`;

          // 각 섹션에 데이터 추가
          document.querySelector("#name").textContent = `${candidate.krName} (${candidate.partyName})`;
          break; // 첫 번째 일치하는 후보자만 찾으면 반복문 종료
        }
      }
    }
  } catch (error) {
    console.error("JSON 데이터를 로드하는 중 문제가 발생했습니다:", error);
  }
};

// 특정 후보자에 대한 모든 prmsRealmName을 모으기
const getAllPrmsRealmNames = (data, searchCandidate) => {
  const realmNames = [];
  data.results.forEach(candidate => {
    if (candidate.num == searchCandidate) {  // 숫자 비교로 수정
      candidate.promises.forEach(promise => {
        realmNames.push(promise.prmsRealmName);
      });
    }
  });
  return [...new Set(realmNames)]; // 중복 제거
};

// 특정 후보자에 대한 prmsRealmName 표시
const displayRealmNames = (jsonData, searchCandidate) => {
  const realmNames = getAllPrmsRealmNames(jsonData, searchCandidate);
  const realmNamesContainer = document.getElementById('tags');
  realmNamesContainer.innerHTML = ""; // 기존 태그 초기화

  if (realmNames.length === 0) {
    realmNamesContainer.innerHTML = "<p>태그가 없습니다.</p>";
  }

  realmNames.forEach(name => {
    const span = document.createElement('span');
    span.textContent = `#${name}`;
    span.style.cursor = 'pointer';
    span.addEventListener('click', () => {
      // 태그를 클릭하면 검색 필터링 실행
      filterCandidates(jsonData, name, searchCandidate);
    });
    realmNamesContainer.appendChild(span);
  });
};

// 검색 필터링 및 결과 표시
const filterCandidates = (jsonData, query, searchCandidate) => {
  const searchResults = document.getElementById("search-results");
  searchResults.innerHTML = ""; // 기존 결과 초기화

  if (!query) return; // 검색어가 없으면 종료

  // 특정 후보자에 대한 결과만 필터링
  const candidate = jsonData.results.find(candidate => candidate.num == searchCandidate);
  if (candidate) {
    candidate.promises.forEach(promise => {
      if (
        promise.prmsRealmName.includes(query) ||
        promise.prmsTitle.includes(query) ||
        promise.prmsCont.includes(query)
      ) {
        // 결과 요소 생성
        let result_item = document.createElement("div");
        result_item.className = "result-item";
        let searchname=document.createElement("div");
        searchname.innerHTML= `<strong>${query}</strong> 카테고리에 해당하는 공약 내용입니다.`;
        // 텍스트 내용
        let result_text = document.createElement("div");
        result_text.className = "result-text";
        // 설명
        let result_description = document.createElement("div");
        result_description.className = "result-description";
        let result_cont = document.createElement("p");
        result_cont.textContent = promise.prmsCont;
        result_description.appendChild(result_cont);
        result_text.appendChild(result_description);

        // DOM 연결
        result_item.appendChild(result_text);
        searchResults.appendChild(searchname);
        searchResults.appendChild(result_item);
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", loadCandidateData);
