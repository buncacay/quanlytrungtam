import { fetchChiTiethocvien, fetchTaiKhoanHocvien } from './get.js';

document.addEventListener('DOMContentLoaded', async function() {
    const khoahoc = document.getElementById('khoahoc');
    const user = localStorage.getItem('username'); // Lấy username từ localStorage

    if (user) {
        try {
            // Lấy danh sách các khóa học của người dùng
            const userCourses = await fetchTaiKhoanHocvien(user);

            if (userCourses && userCourses.length > 0) {
                const idhocvien = userCourses[0].idhocvien;

                // Lấy chi tiết học viên
                const data = await fetchChiTiethocvien(idhocvien);

                // Kiểm tra nếu có khóa học
                if (data && data.length > 0) {
                    data.forEach(kh => {
                        khoahoc.innerHTML += `
                            <li>${kh.tenkhoahoc} - <a href="nguphap1.html?idkhoahoc=${kh.idkhoahoc}">Xem chi tiết</a></li>
                        `;
                    });
                } else {
                    khoahoc.innerHTML = '<li>Không có khóa học nào để hiển thị.</li>';
                }
            } else {
                khoahoc.innerHTML = '<li>Không có khóa học nào cho người dùng này.</li>';
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin khóa học:', error);
            khoahoc.innerHTML = '<li>Đã xảy ra lỗi khi tải dữ liệu khóa học.</li>';
        }
    } else {
        alert('Vui lòng đăng nhập để xem các khóa học của bạn.');
        // Có thể redirect hoặc thực hiện hành động khác nếu không có user
    }
});
