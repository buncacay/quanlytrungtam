import { UpdateHocVien } from './update.js';
import { fetchTaiKhoanHocvien } from './get.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('registrationForm');
    const messageBox = document.getElementById('confirmationMessage');
    const params = new URLSearchParams(window.location.search);
    const user = params.get('user');

    let id = null; // ✅ Khai báo ngoài try để dùng được trong submit

    if (!user) {
        showMessage("Không tìm thấy thông tin người dùng.", 'error');
        return;
    }

    try {
        const res = await fetchTaiKhoanHocvien(user);

        if (res && res[0]) {
            id = res[0].idhocvien; // ✅ Gán id ở đây
            document.getElementById('fullname').value = res[0].hoten;
            document.getElementById('sdt').value = res[0].sdt;
            document.getElementById('birth').value = res[0].ngaysinh;
        } else {
            showMessage("Không tìm thấy học viên.", 'error');
            return;
        }
    } catch (err) {
        console.error(err);
        showMessage("Không thể tải thông tin học viên.", 'error');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const hoten = document.getElementById('fullname').value.trim();
        const sdt = document.getElementById('sdt').value.trim();
        const ngaysinh = document.getElementById('birth').value;

        if (!hoten || !sdt || !ngaysinh) {
            showMessage('Vui lòng nhập đầy đủ thông tin.', 'error');
            return;
        }

        const data = {
            hoten,
            sdt,
            ngaysinh,
            user,
            idhocvien: id // ✅ Không bị undefined nếu id khai báo ngoài
        };

        try {
            await UpdateHocVien(data);
            showMessage('Cập nhật thành công!', 'success');
        } catch (err) {
            console.error(err);
            showMessage('Cập nhật thất bại. Vui lòng thử lại sau.', 'error');
        }
    });

    function showMessage(msg, type) {
        messageBox.textContent = msg;
        messageBox.style.color = type === 'error' ? 'red' : 'green';
    }
});
