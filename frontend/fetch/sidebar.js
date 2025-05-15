$(document).ready(function () {
    // Kiểm tra nếu có thông tin người dùng trong localStorage
    if (localStorage.getItem("isLoggedIn") === "true") {
        // Nếu đã đăng nhập, lấy thông tin người dùng từ localStorage
        const userName = localStorage.getItem("username");
        const userRole = localStorage.getItem("role");

        // Hiển thị thông tin tài khoản
        if (userName && userRole) {
            // Hiển thị tên người dùng
            $("#username").text(userName);
            // Hiển thị vai trò người dùng (ví dụ, "Admin" hoặc "User")
            $("#role").text(userRole);
            $("#user-info").show(); // Hiển thị phần thông tin tài khoản

            // Hiển thị tab "Thông tin tài khoản"
            $("#account-info-tab").show();
        }
    } else {
        // Nếu chưa đăng nhập, ẩn tab "Thông tin tài khoản" và thông tin tài khoản
        $("#account-info-tab").hide();
        $("#user-info").hide();
    }
});
