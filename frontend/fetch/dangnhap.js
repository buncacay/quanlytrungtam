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

if (account.password === pass) {
    alert("Đăng nhập thành công");

    if (account.role === "3") {
        window.location.href = "index.html?login=true";
    } else {
        window.location.href = "../user/index.html?login=true";
    }
} else {
    alert("Đăng nhập thất bại");
}

});
