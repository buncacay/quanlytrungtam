import { fetchKhoaHocVoiId, fetchChiTietKhoaHoc } from './get.js';

document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search); // Lấy id khóa học từ URL
    const idkhoahoc = params.get('idkhoahoc');
    
    const res = await fetchKhoaHocVoiId(idkhoahoc);
    console.log("Đây là khóa học", res);
   
    const main = document.getElementById('tongquan');
    main.innerHTML = `
        <div class="course-header">
            <h1>${res[0].tenkhoahoc}</h1>
        </div>

        <div class="content">
            <div class="left">
                <div class="course-description">
                    <p>
                        <strong>${res[0].tenkhoahoc}:</strong> Bao gồm những chủ điểm
                        <span class="highlight">${res[0].mota}</span>,
                        <span class="highlight">làm chủ và dành trọn điểm</span>
                    </p>
                </div>
            </div>
    `;

    // Phần bài học
    const chitietbaihoc = document.getElementById('chitietbaihoc');
    chitietbaihoc.innerHTML = ``;

    // Đảm bảo rằng bài học được lưu vào một biến để tìm kiếm
    const lessons = res.map((bh, index) => ({
        tenbaihoc: bh.tenbaihoc,
        link: bh.link,
        index: index
    }));

    // Hàm hiển thị tất cả bài học
    function renderLessons(filteredLessons) {
        chitietbaihoc.innerHTML = ``;
        filteredLessons.forEach((bh, index) => {
            chitietbaihoc.innerHTML += `
                <div class="lesson-item" onclick="toggleLesson(${index})">
                    <span class="lesson-index">${index + 1}</span>
                    <span class="lesson-name">${bh.tenbaihoc}</span>
                    <span class="free">FREE</span>
                </div>
                <div class="lesson-link" id="lesson-${index}">
                    <a href="${bh.link}" target="_blank">Xem bài học trên YouTube</a>
                </div>
            `;
        });
    }

    // Hiển thị tất cả bài học khi trang đầu tiên load
    renderLessons(lessons);

    // Thêm tính năng tìm kiếm bài học
    const searchInput = document.getElementById('search-input'); // Ô nhập tìm kiếm
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase(); // Lấy từ khóa tìm kiếm
        const filteredLessons = lessons.filter(bh => 
            bh.tenbaihoc.toLowerCase().includes(query)
        );
        renderLessons(filteredLessons);
    });

    const gia = document.getElementById('hocphi');
    gia.innerHTML = `
        <p>Học phí: <span class="price">${res[0].giatien} VNĐ</span></p>
    `;
});

// Hàm toggleLesson cần được định nghĩa nếu bạn có ý định sử dụng
function toggleLesson(index) {
    const lessonLink = document.getElementById(`lesson-${index}`);
    if (lessonLink.style.display === 'none') {
        lessonLink.style.display = 'block';
    } else {
        lessonLink.style.display = 'none';
    }
}
