import { fetchKhoaHocPhanTrang } from './get.js';

let page = 1;
let totalPages = 1;
let allData = [];  // Dữ liệu tất cả khóa học
let filteredData = [];  // Dữ liệu sau khi lọc (tìm kiếm)

document.addEventListener('DOMContentLoaded', function() {
    loadAllData();  // Tải tất cả dữ liệu khóa học khi trang web tải

    // Gắn sự kiện cho nút nextPage
    document.getElementById('nextPage').addEventListener('click', function() {
        if (page < totalPages) {
            page++;
            loadPage(page);
        }
    });

    // Gắn sự kiện cho nút prevPage
    document.getElementById('prevPage').addEventListener('click', function() {
        if (page > 1) {
            page--;
            loadPage(page);
        }
    });

    // Gắn sự kiện cho ô tìm kiếm
    document.getElementById('course-search-input').addEventListener('input', function() {
        const keyword = this.value.trim().toLowerCase();
        searchCourses(keyword);
    });
});

async function loadAllData() {
    const all = document.getElementById('all');
    const currentPage = document.getElementById('currentPage');
    all.innerHTML = '';  // Xóa dữ liệu cũ trước khi hiển thị

    try {
        let res = await fetchKhoaHocPhanTrang(page, 5);  // Tải dữ liệu khóa học từ server
        console.log(res);
        
        // Kiểm tra dữ liệu trả về
        if (!res || !res.data || res.data.length === 0) {
            all.innerHTML = '<p>Không có dữ liệu để hiển thị.</p>';
            return;
        }

        totalPages = res.total;  // Cập nhật tổng số trang
        allData = res.data;  // Lưu trữ tất cả dữ liệu khóa học
        filteredData = allData;  // Đặt filteredData là tất cả dữ liệu ban đầu

        // Hiển thị tất cả khóa học
        renderCourses(filteredData);

        currentPage.textContent = `Trang ${page} / ${totalPages}`;
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        all.innerHTML = '<p>Lỗi khi tải dữ liệu.</p>';
    }
}

// Hàm để hiển thị các khóa học
function renderCourses(courses) {
    const all = document.getElementById('all');
    all.innerHTML = '';  // Xóa các khóa học cũ trước khi hiển thị

    if (courses.length === 0) {
        all.innerHTML = '<p>Không có khóa học phù hợp.</p>';
        return;
    }

    courses.forEach(kh => {
        all.innerHTML += `
            <a href="nguphap1.html?idkhoahoc=${kh.idkhoahoc}" class="course-card">
                <div class="course-image">
                    <img src="../../../backend/upload/${kh.images}" alt="Khóa học">
                </div>
                <div class="course-content">
                    <h3 class="course-title">${kh.tenkhoahoc}</h3>
                    <p class="course-desc">${kh.mota}</p>
                    <div class="course-info">
                        <span class="course-price">${kh.giatien}</span>
                    </div>
                </div>
            </a>
        `;
    });
}

// Hàm để tải lại trang với các khóa học đã lọc
function loadPage(pageNumber) {
    page = pageNumber;
    const currentPage = document.getElementById('currentPage');
    currentPage.textContent = `Trang ${page} / ${totalPages}`;

    const startIndex = (page - 1) * 5;
    const endIndex = page * 5;

    const paginatedCourses = filteredData.slice(startIndex, endIndex);  // Lọc dữ liệu theo trang
    renderCourses(paginatedCourses);
}

// Hàm tìm kiếm khóa học
function searchCourses(keyword) {
    filteredData = allData.filter(course =>
        course.tenkhoahoc.toLowerCase().includes(keyword) ||  // Tìm kiếm theo tên khóa học
        course.mota.toLowerCase().includes(keyword)  // Tìm kiếm theo mô tả khóa học
    );

    // Sau khi tìm kiếm, ta sẽ tải lại trang đầu tiên và hiển thị kết quả tìm kiếm
    page = 1;
    loadPage(page);
}
