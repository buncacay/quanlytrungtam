$(document).ready(function() {
    // Kiểm tra trạng thái đăng nhập
    if (localStorage.getItem("isLoggedIn") === "true") {
        // Nếu đã đăng nhập, ẩn nút Đăng ký và Đăng nhập, hiển thị nút Đăng xuất
        $("#btn-register").hide();
        $("#btn-login").hide();
        $("#btn-logout").removeClass("hidden");
    } else {
        // Nếu chưa đăng nhập, hiển thị tất cả nút
        $("#btn-register").show();
        $("#btn-login").show();
        $("#btn-logout").addClass("hidden");
    }

    // Gắn sự kiện cho nút Đăng xuất
    $("#btn-logout").on("click", function() {
        // Xoá trạng thái đăng nhập
        localStorage.removeItem("isLoggedIn");

        // Hiển thị lại nút Đăng ký và Đăng nhập
        $("#btn-register").show();
        $("#btn-login").show();
        $("#btn-logout").addClass("hidden");

        // Optional: Thông báo hoặc chuyển hướng
        alert("Bạn đã đăng xuất!");
         window.location.href = "index.html"; // Optional: nếu muốn chuyển hướng sau khi đăng xuất
    });
});
