import { fetchKhoaHoc } from './get.js';

document.addEventListener('DOMContentLoaded', async function () {
    alert("asdfasd");
    try {
        const res = await fetchKhoaHoc(); // Gọi API để lấy dữ liệu khóa học
        console.log(res.data); // Kiểm tra dữ liệu từ API

        const khoahoc = document.getElementById('khoahoc'); // Lấy phần tử sidebar chứa khóa học
        khoahoc.innerHTML = ''; // Xóa nội dung cũ trong sidebar nếu có

        // Kiểm tra nếu không có khóa học nào
       
        alert("asfasd");

        // Duyệt qua các khóa học và thêm chúng vào sidebar
        res.data.forEach(kh => {
            khoahoc.innerHTML += `
                <li><a href="nguphap1.html?idkhoahoc=${kh.idkhoahoc}">
                    <i class="fas fa-book"></i> ${kh.tenkhoahoc}
                </a></li>`;
        });
    } catch (error) {
        console.error('Lỗi khi tải khóa học:', error);
    }
});
