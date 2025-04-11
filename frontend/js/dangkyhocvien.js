document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn form reload trang

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const course = document.getElementById('course').value;

    // Kiểm tra nếu các trường không rỗng
    if (fullname && email && phone && password && course) {
        document.getElementById('confirmationMessage').textContent = `Đăng ký thành công! Vui lòng kiểm tra email/SMS để xác thực tài khoản.`;
    } else {
        document.getElementById('confirmationMessage').textContent = `Vui lòng điền đầy đủ thông tin.`;
    }
});
