import { fetchKhoaHocPhanTrang } from './get.js';

let page = 1;
let totalPages = 1;
let allData = []; // Lưu trữ tất cả dữ liệu khóa học

document.addEventListener('DOMContentLoaded', function() {
    loadAllData(); // Gọi hàm tải tất cả dữ liệu

    document.getElementById('nextPage').addEventListener('click', function() {
        if (page < totalPages) {
            page++;
            loadPage(page);
        }
    });

    document.getElementById('prevPage').addEventListener('click', function() {
        if (page > 1) {
            page--;
            loadPage(page);
        }
    });
});

async function loadAllData() {
    const all = document.getElementById('all');
    const currentPage = document.getElementById('currentPage');
    all.innerHTML = '';

    try {
        let res = await fetchKhoaHocPhanTrang(page, 5);
        console.log(res);
        
        // Kiểm tra dữ liệu trả về
        if (!res || !res.data || res.data.length === 0) {
            all.innerHTML = '<p>Không có dữ liệu để hiển thị.</p>';
            return;
        }

        totalPages = res.total; // Cập nhật tổng số trang
        allData = res.data; // Lưu trữ tất cả dữ liệu khóa học

        // Lặp qua các trang còn lại nếu cần
        for (let i = 2; i <= totalPages; i++) {
            const nextRes = await fetchKhoaHocPhanTrang(i, 5);
            allData = allData.concat(nextRes.data); // Gộp dữ liệu vào allData
        }

        // Hiển thị tất cả khóa học
        allData.forEach(kh => {
            all.innerHTML += `
                <div>
                    <h2 class="combo-title">${kh.tenkhoahoc}</h2>
                    <div class="combo-list">
                        <div class="combo-card">
                            <a href="nguphap1.html?idkhoahoc=${kh.idkhoahoc}">
                                <img src="../../../backend/upload/${kh.images}" alt="Combo 1">
                                <p>${kh.giatien}</p>
                            </a>       
                        </div>
                    </div>
                </div>
            `;
        });

        currentPage.textContent = `Trang 1 / ${totalPages}`; // Chỉ hiển thị trang đầu vì đã tải hết
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        all.innerHTML = '<p>Lỗi khi tải dữ liệu.</p>';
    }
}
