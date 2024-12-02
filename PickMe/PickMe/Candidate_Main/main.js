const loadCandidateData = async () => {
  try {
    // JSON 파일 로드
    const response = await fetch('../JSON/Daejeon_example.json');
    const jsonData = await response.json();
    const response2 = await fetch('../JSON/CandidatePromisesFulfillment.json');
    const jsonData2 = await response2.json();
    const chart = document.getElementById("myChart").getContext('2d');
    let searchCandidate = sessionStorage.getItem('selectedCandidateNum');
    if(!searchCandidate){
      searchCandidate="1000000001";
    }
    for (const candidate of jsonData.results) {
        if (candidate.cnddtId == searchCandidate) {
          const name = `../Candidate_Photo/${candidate.cnddtId}.jpg`;

          // 후보자 이미지 가져오기
          document.querySelector("#image").innerHTML = `<img src="${name}" alt="${candidate.krName}">`;

          // 각 섹션에 데이터 추가
          document.querySelector("#name").textContent = `${candidate.krName} (${candidate.partyName})`;

          // 이미지 클릭시 상세 페이지로 이동
          document.querySelector("#image").addEventListener('click', () => {
            sessionStorage.setItem('selectedCandidateNum', `${candidate.cnddtId}`);
            window.location.href = '../Candidate_Info/candidate.html'; // 상세 페이지로 이동
          });

          // 이름 클릭시 상세 페이지로 이동
          document.querySelector("#name").addEventListener('click', () => {
            sessionStorage.setItem('selectedCandidateNum', `${candidate.cnddtId}`);
            window.location.href = '../Candidate_Info/candidate.html'; // 상세 페이지로 이동
          });

          // 후보자의 공약 표시
          document.querySelector("#promise").innerHTML = candidate.promises
            .map(p => `<p><strong>${p.prmsOrd}.${p.prmsRealmName}:</strong> ${p.prmsTitle}</p>`)
            .join("");

          // 공약 이행률 관련 데이터 추가
          for (const promise of jsonData2) {
            if (promise.krName === candidate.krName) {
              if (promise._comment) {
                let p = document.createElement("p");
                p.id = "comment";
                p.textContent = `${promise._comment}`;
                document.querySelector("#promise").appendChild(p); // Add comment to the promise section
              } else {
                const data = {
                  labels: ['완료', '보류 및 이행중', '미이행'],
                  datasets: [{
                    data: [promise.Fulfillment, promise.inProgress, promise.NonFulfillment],
                    backgroundColor: ["blue", "green", "red"]
                  }]
                };

                // Create the pie chart
                new Chart(chart, {
                  type: 'pie',
                  data: data,
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                      display: true,
                      text: '이행률'
                    }
                  }
                });
              }
            }
          }
          break; // 첫 번째 일치하는 후보자만 찾으면 반복문 종료
        }
    }
  } catch (error) {
    console.error("JSON 데이터를 로드하는 중 문제가 발생했습니다:", error);
  }
};

document.addEventListener("DOMContentLoaded", loadCandidateData);
