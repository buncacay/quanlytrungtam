import { fetchKhoaHocPhanTrang } from './get.js';

let page = 1; // Khởi tạo page mặc định
let totalPages = 1; // Biến lưu tổng số trang

document.addEventListener('DOMContentLoaded', function() {
    loadPage(page); // Gọi hàm load dữ liệu trang đầu tiên

    // Gắn sự kiện cho nút phân trang (nếu có)
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

async function loadPage(page) {
    const all = document.getElementById('all');
    const currentPage = document.getElementById('currentPage');
    all.innerHTML = ''; // Xóa nội dung cũ

    try {
        const res = await fetchKhoaHocPhanTrang(page, 5); // Gọi API theo trang, giả sử mỗi trang có 5 khóa học

        if (res.length === 0 && page > 1) {
            page--; // Nếu không có dữ liệu, quay lại trang trước
            return;
        }

        // Cập nhật tổng số trang từ dữ liệu API (giả sử API trả về tổng số khóa học)
        totalPages = Math.ceil(res.total / 5); // Tổng số trang

        res.data.forEach(kh => {
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

        // Cập nhật số trang hiện tại
        currentPage.textContent = `Trang ${page}`;
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        all.innerHTML = '<p>Lỗi khi tải dữ liệu.</p>';
    }
}
