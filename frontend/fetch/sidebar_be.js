$(document).ready(function () {
    // Kiểm tra nếu có thông tin người dùng trong localStorage
    if (localStorage.getItem("isLoggedIn") === "true") {
        // Nếu đã đăng nhập, lấy thông tin người dùng từ localStorage
        const userName = localStorage.getItem("username");
        const userRole = localStorage.getItem("role");

        // Hiển thị thông tin tài khoản
        if (userName && userRole) {
            $("#username").text(userName);  // Hiển thị tên người dùng
            $("#role").text(userRole);  // Hiển thị vai trò người dùng

            // Hiển thị phần thông tin tài khoản và nút "Đăng xuất"
            $("#user-info").show();
        }

        // Gắn sự kiện cho nút "Đăng xuất"
        $("#logout-btn").on("click", function () {
            if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
                // Xóa thông tin đăng nhập trong localStorage
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("username");
                localStorage.removeItem("role");

                // Chuyển hướng về trang đăng nhập
                window.location.href = "dangnhap.html";
            }
        });
    } else {
        // Nếu chưa đăng nhập, ẩn phần thông tin tài khoản
        $("#user-info").hide();
    }
});
