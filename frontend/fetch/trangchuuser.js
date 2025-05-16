import { fetchKhoaHoc } from './get.js';

let page = 1;
const perPage = 5; // số mục mỗi trang
let allData = [];  // tất cả dữ liệu khóa học
let filteredData = [];  // dữ liệu sau khi lọc

document.addEventListener('DOMContentLoaded', () => {
    init();

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / perPage);
        if (page < totalPages) {
            page++;
            loadPage(page);
        }
    });

    document.getElementById('prevPage').addEventListener('click', () => {
        if (page > 1) {
            page--;
            loadPage(page);
        }
    });

    document.getElementById('course-search-input').addEventListener('input', (e) => {
        const keyword = e.target.value.trim().toLowerCase();
        searchCourses(keyword);
    });
});

async function init() {
    const all = document.getElementById('all');
    const currentPage = document.getElementById('currentPage');
    all.innerHTML = '';

    try {
        const data = await fetchKhoaHoc();
        const res = data.filter(kh => kh.trangthai === '1');
        console.log(res);

        if (!res || res.length === 0) {
            all.innerHTML = '<p>Không có dữ liệu để hiển thị.</p>';
            return;
        }

        allData = res;

        // Lọc khóa học theo iddanhmuc nếu có trong URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryIdFromUrl = urlParams.get("iddanhmuc");

        if (categoryIdFromUrl) {
            filteredData = allData.filter(course => course.danhmuc == categoryIdFromUrl);
            console.log(filteredData);
        } else {
            filteredData = [...allData]; // Khởi tạo dữ liệu đã lọc ban đầu nếu không có iddanhmuc
             console.log(filteredData);
        }

        loadPage(page); // Hiển thị trang đầu tiên

    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        all.innerHTML = '<p>Lỗi khi tải dữ liệu.</p>';
    }
}

function loadPage(pageNumber) {
    const all = document.getElementById('all');
    const currentPage = document.getElementById('currentPage');

    const totalPages = Math.ceil(filteredData.length / perPage);
    page = pageNumber;

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    renderCourses(pageData);
    currentPage.textContent = `Trang ${page} / ${totalPages}`;
}

function renderCourses(courses) {
    const all = document.getElementById('all');
    all.innerHTML = '';

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

function searchCourses(keyword) {
    filteredData = allData.filter(course =>
        course.tenkhoahoc.toLowerCase().includes(keyword) ||
        course.mota.toLowerCase().includes(keyword)
    );

    page = 1;
    loadPage(page);
}
