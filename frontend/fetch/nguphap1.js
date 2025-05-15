import { fetchKhoaHocVoiId, fetchChiTiethocvien, fetchTaiKhoanHocvien} from './get.js';

let idhocvien = "";
let idkhoahoc = "";
let user ="";
document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search); // Lấy id khóa học từ URL
    idkhoahoc = params.get('idkhoahoc');
    alert(idkhoahoc);
   
    const res = await fetchKhoaHocVoiId(idkhoahoc);

    console.log("Đây là khóa học", res);
    

    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    user = localStorage.getItem('username'); // Giả sử bạn lưu userId trong localStorage khi đăng nhập
 alert(user);
    // Nếu người dùng đã đăng nhập, kiểm tra xem họ có mua khóa học này không
    let purchased = false;
    if (user) {
        const userCourses = await fetchTaiKhoanHocvien(user); // Lấy danh sách khóa học của người dùng
        idhocvien = userCourses[0].idhocvien;
        console.log(userCourses[0].idhocvien);
        const data = await fetchChiTiethocvien(userCourses[0].idhocvien);
        console.log(data);
        if (data){
 // Kiểm tra nếu khóa học này có trong danh sách các khóa học đã mua
        purchased = data.some(course => course.idkhoahoc === idkhoahoc);
        }
       
    }
    // if (idkhoahoc && user) {
        
    // }

    const main = document.getElementById('tongquan');
    main.innerHTML = `
        <div class="course-header">
            <h1>${res[0].tenkhoahoc}</h1>
        </div>

        <div class="content">
            <div class="left">
                <div class="course-description">
                    <p>
                        <strong>${res[0].tenkhoahoc}:</strong> Bao gồm những chủ điểm
                        <span class="highlight">${res[0].mota}</span>,
                        <span class="highlight">làm chủ và dành trọn điểm</span>
                    </p>
                </div>
            </div>
    `;

    // Phần bài học
    const chitietbaihoc = document.getElementById('chitietbaihoc');
    chitietbaihoc.innerHTML = ``;

    // Đảm bảo rằng bài học được lưu vào một biến để tìm kiếm
    const lessons = res.map((bh, index) => ({
        tenbaihoc: bh.tenbaihoc,
        link: bh.link,
        index: index
    }));

    // Hàm hiển thị tất cả bài học
  function renderLessons(filteredLessons) {
    chitietbaihoc.innerHTML = ``;
    filteredLessons.forEach((bh, index) => {
        // Kiểm tra nếu bài học là bài đầu tiên
        let priceLabel = (index === 0) ? "FREE" : "Mất phí";  // Bài đầu tiên FREE, các bài sau là Mất phí

        chitietbaihoc.innerHTML += `
            <div class="lesson-item" onclick="toggleLesson(${index})">
                <span class="lesson-index">${index + 1}</span>
                <span class="lesson-name">${bh.tenbaihoc}</span>
                <span class="price">${priceLabel}</span> <!-- Hiển thị trạng thái phí -->
            </div>
            <div class="lesson-link" id="lesson-${index}">
                <a href="${bh.link}" target="_blank">Xem bài học trên YouTube</a>
            </div>
        `;
    });
}


    // Nếu đã mua khóa học, hiển thị tất cả bài học, nếu chưa thì chỉ hiển thị 1 bài
    if (purchased) {
        alert("da mua roi");
        // Hiển thị tất cả bài học nếu đã mua khóa học
        renderLessons(lessons);
    } else {
        alert("chua mua khoa nay");
        // Chỉ hiển thị bài học đầu tiên nếu chưa mua khóa học
        renderLessons([lessons[0]]);
    }

    // Thêm tính năng tìm kiếm bài học
    const searchInput = document.getElementById('search-input'); // Ô nhập tìm kiếm
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase(); // Lấy từ khóa tìm kiếm
        const filteredLessons = lessons.filter(bh => 
            bh.tenbaihoc.toLowerCase().includes(query)
        );
        renderLessons(filteredLessons);
    });

    const gia = document.getElementById('hocphi');
    gia.innerHTML = `
        <p>Học phí: <span class="price">${res[0].giatien} VNĐ</span></p>
        <p>Thời hạn khóa học: ${res[0].ngayketthuc}</p>
    `;
});

// Hàm toggleLesson cần được định nghĩa nếu bạn có ý định sử dụng
function toggleLesson(index) {
    const lessonLink = document.getElementById(`lesson-${index}`);
    if (lessonLink.style.display === 'none') {
        lessonLink.style.display = 'block';
    } else {
        lessonLink.style.display = 'none';
    }
}

document.getElementById("buy-now-link").addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn hành vi mặc định (chuyển link)

    const check = localStorage.getItem('isLoggedIn');
   

    if (check === 'true' && idkhoahoc && user) {
        // Redirect đúng
        window.location.href = `chitietmuahang.html?idkhoahoc=${idkhoahoc}&idhocvien=${user}`;
    } else {
        alert("Bạn cần đăng nhập để thực hiện chức năng này");
        window.location.href = '../admin/dangnhap.html';
    }
});





