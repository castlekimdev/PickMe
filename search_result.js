const data = [
    { id: 1, title: "김후보", description: "과학기술 5대 강국 실현과 미래인재 양성", tags: ["교육", "지역성장"], img: "./Candidate_Photo/profile.png" },
    { id: 2, title: "이후보", description: "공정한 교육과 미래인재 육성, 모두가 누리는 문화복지", tags: ["교육", "복지"], img: "./Candidate_Photo/profile1.png" },
    { id: 3, title: "박후보", description: "기본학력 보장 및 행복한 지역학습일 도입", tags: ["교육", "지역성장"], img: "./Candidate_Photo/profile2.png" },
    { id: 4, title: "최후보", description: "지속가능한 환경 정책 추진", tags: ["환경", "경제"], img: "./Candidate_Photo/profile.png" },
    { id: 5, title: "정후보", description: "모두를 위한 일자리 창출과 소득 증대", tags: ["일자리", "경제"], img: "./Candidate_Photo/profile1.png" },
    { id: 6, title: "강후보", description: "복지 사각지대 해소 및 생활 안정", tags: ["복지", "환경"], img: "./Candidate_Photo/profile2.png" },
    { id: 7, title: "고후보", description: "혁신적인 공교육 지원", tags: ["교육", "복지"], img: "./Candidate_Photo/profile.png" },
    { id: 8, title: "류후보", description: "지역 성장과 경제 활성화", tags: ["지역성장", "경제"], img: "./Candidate_Photo/profile1.png" },
    { id: 9, title: "하후보", description: "탄소중립과 미래 환경 비전 제시", tags: ["환경"], img: "./Candidate_Photo/profile2.png" },
    { id: 10, title: "전후보", description: "청년 일자리 혁신 정책", tags: ["일자리"], img: "./Candidate_Photo/profile.png" },
];
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const tags = document.querySelectorAll(".tags span");

// Render Results
function renderResults(results) {
    searchResults.innerHTML = results.map(item => `
        <div class="result-item">
            <div class="result-text">
                <div class="result-title">${item.id}. ${item.title}</div>
                <div class="result-description">${item.description}</div>
                <div class="result-tags">${item.tags.map(tag => `<span>#${tag}</span>`).join("")}</div>
            </div>
            <div class="result-thumbnail">
                <img src="${item.img}" alt="${item.title}">
            </div>
        </div>
    `).join("");
}

// Filter by Search
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = data.filter(item =>
        item.title.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
    renderResults(filtered);

    // Reset active tags
    tags.forEach(tag => tag.classList.remove("active"));
});

// Filter by Tag with Toggle
tags.forEach(tag => {
    tag.addEventListener("click", () => {
        const isActive = tag.classList.contains("active");
        tags.forEach(tag => tag.classList.remove("active")); // Remove active from all tags

        if (!isActive) {
            tag.classList.add("active"); // Add active only if it was not already active
            const tagName = tag.getAttribute("data-tag");
            const filtered = data.filter(item => item.tags.includes(tagName));
            renderResults(filtered);
        } else {
            // Reset results if tag is toggled off
            renderResults(data);
        }
    });
});

// Initial Render
renderResults(data);
