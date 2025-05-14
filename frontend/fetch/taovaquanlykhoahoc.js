import { fetchGiangVien, fetchKhoaHoc, fetchChiTietKhoaHoc, fetchKhoaHocVoiId } from './get.js';
import { addKhoaHoc, addChiTietKhoaHoc, addChiTietNhanVien } from './add.js';
import { UpdateKhoaHoc, UpdateChiTietKhoaHoc } from './update.js';

document.getElementById('course-image').addEventListener('change', function (event) {
    HienThiAnh(event, null);
});

async function HienThiAnh(event, images) {
    const prev = document.getElementById('preview');

    if (images) {
        prev.src = `http://localhost/quanlytrungtam/backend/upload/${images}`;
        prev.style.display = 'block';
    } else {
        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                prev.src = e.target.result;
                prev.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }
}

async function themmoikhoahoc(event) {
    event.preventDefault();

    const ten = document.getElementById('course-name').value;
    const soluongbuoi = document.getElementById('soluongbuoi').value;
    const thoigianhoc = document.getElementById('thoigianhoc').value;
    const lichhoc = document.getElementById('lichhoc').value;
    const mota = document.getElementById('motakhoahoc').value;
    const giatien = document.getElementById('giatien').value;
    const giamgia = document.getElementById('giamgia').value;
    const ngayketthuc = document.getElementById('ngayketthuc').value;

    const today = new Date();
    const endDate = new Date(ngayketthuc);

    if (endDate <= today) {
        alert("Khóa học đã kết thúc rồi! Trang thái sẽ được cập nhật thành 2.");

        const data = {
            tenkhoahoc: ten,
            thoigianhoc: thoigianhoc,
            soluongbuoi: soluongbuoi,
            lichhoc: lichhoc,
            diadiemhoc: "not found",
            mota: mota,
            trangthai: 2,
            giatien: giatien,
            giamgia: giamgia
        };

        const fileInput = document.getElementById('course-image');
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('data', JSON.stringify(data));

        const kq = await addKhoaHoc(formData);
        const khoaHoc = JSON.parse(kq);

        const id = khoaHoc.idkhoahoc;
        alert(id);

        if (kq) {
            const lessons = document.querySelectorAll('#noidungkhoahoc .lesson-item');
            const data3 = [];
            let d = 0;
            lessons.forEach(lesson => {
                const title = lesson.querySelector('.lesson-title')?.textContent.trim();
                const link = lesson.querySelector('.lesson-link a')?.href;

                data3.push({
                    idkhoahoc: id,
                    idbaihoc: d,
                    tenbaihoc: title,
                    link: link
                });
                d++;
            });

            if (await addChiTietKhoaHoc(data3)) {
                alert("Thêm chi tiết khóa học thành công!");
            } else {
                alert("Thêm chi tiết khóa học thất bại!");
            }
        }
    } else {
        const data = {
            tenkhoahoc: ten,
            thoigianhoc: thoigianhoc,
            soluongbuoi: soluongbuoi,
            lichhoc: lichhoc,
            diadiemhoc: "not found",
            mota: mota,
            trangthai: 1,
            giatien: giatien,
            giamgia: giamgia
        };

        const fileInput = document.getElementById('course-image');
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('data', JSON.stringify(data));

        const kq = await addKhoaHoc(formData);
        const khoaHoc = JSON.parse(kq);

        const id = khoaHoc.idkhoahoc;
        alert(id);

        if (kq) {
            const lessons = document.querySelectorAll('#noidungkhoahoc .lesson-item');
            const data3 = [];
            let d = 0;
            lessons.forEach(lesson => {
                const title = lesson.querySelector('.lesson-title')?.textContent.trim();
                const link = lesson.querySelector('.lesson-link a')?.href;

                data3.push({
                    idkhoahoc: id,
                    idbaihoc: d,
                    tenbaihoc: title,
                    link: link
                });
                d++;
            });

            if (await addChiTietKhoaHoc(data3)) {
                alert("Thêm chi tiết khóa học thành công!");
            } else {
                alert("Thêm chi tiết khóa học thất bại!");
            }
        }
    }
}

document.getElementById('themkhoahoc').onclick = async (event) => {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const idkhoahoc = urlParams.get('idkhoahoc');

    if (idkhoahoc) {
        // Có id => Cập nhật
        await saveChanges(event, idkhoahoc);
    } else {
        // Không có id => Thêm mới
        await themmoikhoahoc(event);
    }
};

document.addEventListener('DOMContentLoaded', async function (event) {
    const pa = new URLSearchParams(window.location.search);
    const images = pa.get('images');
    if (images) {
        HienThiAnh(event, images);
    }

    const data = await fetchGiangVien();
    const urlParams = new URLSearchParams(window.location.search);
    const idkhoahoc = urlParams.get('idkhoahoc');
    const kq = await fetchKhoaHocVoiId(idkhoahoc);

    if (idkhoahoc) {
        const chitietdanhsach = document.getElementById('chitiet');
        chitietdanhsach.innerHTML = `
            <div class="student-list-section">
                <h3>📋 Danh sách học viên</h3>
                <a href="danhsachhocvien.html?idkhoahoc=${idkhoahoc}">Xem chi tiết</a>
            </div>
            <div class="instructor-list-section" style="margin-top: 30px;">
                <h3>👨‍🏫 Danh sách giảng viên</h3>
                <a href="phanconggiangday.html?idkhoahoc=${idkhoahoc}">Xem chi tiết</a>
            </div>`;

        document.getElementById('themkhoahoc').textContent = "Lưu chỉnh sửa";

        const ten = document.getElementById('course-name');
        const soluongbuoi = document.getElementById('soluongbuoi');
        const thoigianhoc = document.getElementById('thoigianhoc');
        const lichhoc = document.getElementById('lichhoc');
        const mota = document.getElementById('motakhoahoc');
        const giatien = document.getElementById('giatien');
        const giamgia = document.getElementById('giamgia');

        ten.value = kq[0]['tenkhoahoc'];
        soluongbuoi.value = kq[0]['soluongbuoi'];
        thoigianhoc.value = kq[0]['thoigianhoc'];
        lichhoc.value = kq[0]['lichhoc'];
        mota.value = kq[0]['mota'];
        giatien.value = kq[0]['giatien'];
        giamgia.value = kq[0]['giamgia'];

        const chitiet = await fetchKhoaHocVoiId(idkhoahoc);
        const noidung = document.getElementById('noidungkhoahoc');
        noidung.innerHTML = "";
        chitiet.forEach(baihoc => {
            noidung.innerHTML += `
                <div class="lesson-item">
                    <span class="lesson-title">${baihoc.tenbaihoc}</span>
                    <div class="lesson-actions">
                        <button onclick="edit(this.closest('.lesson-item'), event)">✏️</button>
                        <button onclick="remove(this.closest('.lesson-item'), event)">🗑️</button>
                    </div>
                    <div class="lesson-link">
                        👉 <a href="${baihoc.link}" target="_blank">${baihoc.link}</a>
                    </div>
                </div>`;
        });
    }
});

async function saveChanges(event, idkhoahoc) {
    event.preventDefault();

    const ten = document.getElementById('course-name').value;
    const soluongbuoi = document.getElementById('soluongbuoi').value;
    const thoigianhoc = document.getElementById('thoigianhoc').value;
    const lichhoc = document.getElementById('lichhoc').value;
    const mota = document.getElementById('motakhoahoc').value;
    const giatien = document.getElementById('giatien').value;
    const giamgia = document.getElementById('giamgia').value;
    const ngayketthuc = document.getElementById('ngayketthuc').value;

    const today = new Date();
    const endDate = new Date(ngayketthuc);

    if (endDate <= today) {
        alert("Khóa học đã kết thúc rồi! Trang thái sẽ được cập nhật thành 2.");
        
        const data = {
            idkhoahoc: idkhoahoc,
            tenkhoahoc: ten,
            soluongbuoi: soluongbuoi,
            thoigianhoc: thoigianhoc,
            lichhoc: lichhoc,
            mota: mota,
            giatien: giatien,
            giamgia: giamgia,
            trangthai: 2
        };

        try {
            if (await UpdateKhoaHoc(data)) {
                const lessons = document.querySelectorAll('#noidungkhoahoc .lesson-item');
                const data3 = [];
                let d = 0;
                lessons.forEach(lesson => {
                    const title = lesson.querySelector('.lesson-title')?.textContent.trim();
                    const link = lesson.querySelector('.lesson-link a')?.href;
                    data3.push({
                        idkhoahoc: idkhoahoc,
                        idbaihoc: d,
                        tenbaihoc: title,
                        link: link
                    });
                    d++;
                });

                if (await UpdateChiTietKhoaHoc(data3)) {
                    alert("Cập nhật chi tiết thành công!");
                    window.location.href = "danhsachkhoahoc.html";
                } else {
                    alert("Cập nhật chi tiết thất bại.");
                }
            } else {
                alert("Cập nhật khóa học thất bại.");
            }
        } catch (error) {
            alert("Lỗi khi cập nhật khóa học: " + error.message);
        }
        return;
    }

    const data = {
        idkhoahoc: idkhoahoc,
        tenkhoahoc: ten,
        soluongbuoi: soluongbuoi,
        thoigianhoc: thoigianhoc,
        lichhoc: lichhoc,
        mota: mota,
        giatien: giatien,
        giamgia: giamgia,
        trangthai: 1
    };

    try {
        if (await UpdateKhoaHoc(data)) {
            const lessons = document.querySelectorAll('#noidungkhoahoc .lesson-item');
            const data3 = [];
            let d = 0;
            lessons.forEach(lesson => {
                const title = lesson.querySelector('.lesson-title')?.textContent.trim();
                const link = lesson.querySelector('.lesson-link a')?.href;
                data3.push({
                    idkhoahoc: idkhoahoc,
                    idbaihoc: d,
                    tenbaihoc: title,
                    link: link
                });
                d++;
            });

            if (await UpdateChiTietKhoaHoc(data3)) {
                alert("Cập nhật chi tiết thành công!");
                window.location.href = "danhsachkhoahoc.html";
            } else {
                alert("Cập nhật chi tiết thất bại.");
            }
        } else {
            alert("Cập nhật khóa học thất bại.");
        }
    } catch (error) {
        alert("Lỗi khi cập nhật khóa học: " + error.message);
    }
}
