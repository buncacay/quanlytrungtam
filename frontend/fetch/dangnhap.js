import {fetchTaiKhoan} from './get.js';


document.getElementById('login').addEventListener('click', async function (event) {
    event.preventDefault();
    const user = document.getElementById('user').value.trim();
    alert("chao cac be");
    const pass = document.getElementById('pass').value;

    console.log('User:', user);  // Log user nhập vào
    console.log('Password:', pass);  // Log password nhập vào

    try {
        const res = await fetchTaiKhoan(user);
        console.log('Response:', res);  // Log response từ fetchTaiKhoan

        const account = res && res.length > 0 ? res[0] : null;
        console.log('Account:', account);  // Log account sau khi tìm kiếm

        if (!account) {
            alert("Tài khoản không tồn tại");
            return;
        }

        if (account.password === pass) {
            alert("Đăng nhập thành công");

            // Lưu trạng thái đăng nhập vào localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", user);
            localStorage.setItem("role", account.role);

            console.log('Login successful, redirecting...');

            // Sau khi lưu, chuyển trang
            if (account.role === "3") {
                window.location.href = "../admin/index.html";
            } else {
                window.location.href = "../user/index.html";
            }
        } else {
            alert("Đăng nhập thất bại");
        }
    } catch (error) {
        console.error('Error during login:', error);  // Bắt lỗi bất kỳ trong fetch
        alert("Đã có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại!");
    }
});
