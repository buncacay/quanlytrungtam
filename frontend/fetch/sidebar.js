$(document).ready(function () {
  // Tạo hàm async để dùng await
  async function init() {
    // ================== PHẦN 1: Xử lý đăng nhập ===================
    if (localStorage.getItem("isLoggedIn") === "true") {
      const userName = localStorage.getItem("username");
      const userRole = localStorage.getItem("role");

      if (userName && userRole) {
        $("#username").text(userName);
        $("#role").text(userRole);
        $("#user-info").show();
        $("#account-info-tab").show();
      }
    } else {
      $("#account-info-tab").hide();
      $("#user-info").hide();
    }

    // ================== PHẦN 2: Fetch danh mục và khóa học ===================
    async function fetchDanhMuc() {
      const res = await fetch(`http://localhost/quanlytrungtam/backend/controller/danhmuccontroller.php`);
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    }

    async function fetchKhoaHoc() {
      const url = `http://localhost/quanlytrungtam/backend/controller/KhoahocController.php`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.data; // dữ liệu thực tế nằm trong .data
    }

    let dataDanhMuc = [];
    let dataKhoaHoc = [];

    try {
      dataDanhMuc = await fetchDanhMuc();
      dataKhoaHoc = await fetchKhoaHoc();
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
      return;
    }

    // Hiển thị danh mục lên sidebar
    function loadDanhMucToSidebar(dataDanhMuc) {
      const categoryList = $("#khoahoc");
      categoryList.empty();

      dataDanhMuc.forEach(dm => {
        const li = $(`<li><a href="#" class="category-item" data-id="${dm.iddanhmuc}">${dm.tendanhmuc}</a></li>`);
        categoryList.append(li);
      });
    }

    // Hiển thị khóa học theo danh mục
    function hienThiKhoaHocTheoDanhMuc(danhMucId) {
      console.log(danhMucId);
      const dsKhoaHoc = dataKhoaHoc.filter(kh => parseInt(kh.danhmuc) === parseInt(danhMucId));
      const courseList = $("#course-list");
      courseList.empty();
      courseList.append("<h3>Khóa học</h3>");

      if (dsKhoaHoc.length === 0) {
        courseList.append("<p>Không có khóa học nào.</p>");
        return;
      }

      dsKhoaHoc.forEach(kh => {
        const div = $(`<div class="course-item">${kh.tenkhoahoc}</div>`);
        courseList.append(div);
      });
    }

    // Gán sự kiện click
    $(document).on("click", ".category-item", function (e) {
      e.preventDefault();

      // Lấy ID danh mục đã chọn
      const selectedId = parseInt($(this).data("id"));
      if (isNaN(selectedId)) {
        console.log("Invalid category ID");
        return;
      }

      // Mỗi lần click, trang sẽ tải lại với tham số iddanhmuc trong URL
      const newUrl = window.location.pathname + "?iddanhmuc=" + selectedId;
      window.location.href = newUrl; // Tải lại trang với URL mới
    });

    // Gọi hàm khi trang load
    loadDanhMucToSidebar(dataDanhMuc);

    // Kiểm tra xem có tham số iddanhmuc trong URL không khi trang load
    const urlParams = new URLSearchParams(window.location.search);
    const categoryIdFromUrl = urlParams.get("iddanhmuc");

    if (categoryIdFromUrl) {
      // Nếu có, hiển thị khóa học theo danh mục từ URL
      hienThiKhoaHocTheoDanhMuc(categoryIdFromUrl);
    } else if (dataDanhMuc.length > 0) {
      // Nếu không có, hiển thị khóa học theo danh mục đầu tiên
      hienThiKhoaHocTheoDanhMuc(dataDanhMuc[0].iddanhmuc);
    }
  }

  // Chạy init
  init();
});
