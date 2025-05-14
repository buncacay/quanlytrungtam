import {fetchTaiKhoan} from './get.js';

document.getElementById('login').addEventListener('click', async function () {
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;

    const res = await fetchTaiKhoan(user);
    const account = res && res.length > 0 ? res[0] : null;

    if (!account) {
        alert("Tài khoản không tồn tại");
        return;
    }

    if (account.password === pass && account.role === "3") {
        alert("Đăng nhập thành công");
        window.location.href = "index.html?login=true";
    } else {
        alert("Đăng nhập thất bại");
    }
});
