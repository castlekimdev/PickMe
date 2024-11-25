const loadCandidateData = async () => {
  try {
    // JSON 파일 로드
    const response = await fetch('example.json');
    const jsonData = await response.json();
    const searchCandidate=sessionStorage.getItem('selectedCandidateNum');
    for (const candidate of jsonData.results) {
            if (candidate.num === searchCandidate) {
              const name = `candidateimage/${candidate.krName}.jpg`;
              const num = `${candidate.num}`;
              //후보자 이미지 가져오기
              document.querySelector("#image").innerHTML=`<img src="${name}" alt="${candidate.krName}" >`;
              // 각 섹션에 데이터 추가
              document.querySelector("#name").textContent = `${candidate.krName} (${candidate.partyName})`;

              document.querySelector("#promise").innerHTML = candidate.promises
                .map(p => `<p><strong>${p.prmsOrd}.${p.prmsRealmName}:</strong> ${p.prmsTitle}</p>`)
                .join("");
              break; // 첫 번째 일치하는 후보자만 찾으면 반복문 종료
            }
        }
  } catch (error) {
    console.error("JSON 데이터를 로드하는 중 문제가 발생했습니다:", error);
  }
};

document.addEventListener("DOMContentLoaded", loadCandidateData);
