document.addEventListener('DOMContentLoaded', async function(){
    const params = new URLSearchParams(window.location.search);
    const id= params.get('id');
    const data  = await fetchThongTin(id);
    console.log(data);
    HienThiThongTin(data);
    await HienThiListKhoaHoc();
});

async function remove() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (confirm("Bạn có chắc chắn muốn xóa học viên này không?")) {
        try {
            const res = await fetch(`http://localhost/quanlytrungtam/backend/controller/HocVienController.php?idhocvien=${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const errMsg = await res.text();
                console.error("Lỗi xóa:", errMsg);
                alert("Xóa thất bại: " + errMsg);
                return;
            }
            console.log(await res.json());
            alert("Xóa thành công");
            window.location.href = "danhsachhocvien.html";
        } catch (error) {
            console.error("Lỗi fetch:", error);
            alert("Đã xảy ra lỗi khi xóa học viên.");
        }
    }
}


async function edit(){
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    window.location.href=`dangkyhocvien.html?id=${id}`;
}


async function fetchThongTin(id){
    const res= await fetch(`http://localhost/quanlytrungtam/backend/controller/HocvienController.php?idhocvien=${id}`);
    if (!res.ok){
        throw new Error(await res.text());
    }
    const data = await res.json();
    console.log("data " + data);
    return data;
}

async function fetchKhoaHoc(pages = 1, limit = 10) {
    const url = `http://localhost/quanlytrungtam/backend/controller/KhoaHocController.php?pages=${pages}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data);
    return data;
}


async function HienThiListKhoaHoc() {
    const selection = document.getElementById('dky');
    const data = await fetchKhoaHoc(); 
    const danhSach = data.data; // mảng chứa các khóa học
    console.log(danhSach[0].tenkhoahoc); // Kiểm tra dữ liệu

    danhSach.forEach(khoahoc => {
        const otp = document.createElement('option'); 
        // alert("asdfasdf" + khoahoc.idkhoahoc);
        otp.value = khoahoc.idkhoahoc;
        otp.textContent = khoahoc.tenkhoahoc;
        selection.appendChild(otp); 
    });
}


async function HienThiThongTin(data){
   
    console.log("uia " +data);
    const info = document.getElementById('student-info');
    info.innerHTML = `
        <h2>Thông tin học viên</h2>
        <p><strong>Họ và tên:</strong> ${data[0]['hoten']}</p>
        <p><strong>Mã học viên:</strong> ${data[0]['idhocvien']}</p>
        <p><strong>Số điện thoại:</strong> ${data[0]['sdt']}</p>
    `;
    
   

    const detail = document.getElementById('student-hdon');
    detail.innerHTML = `
        <h3>Chi tiết hóa đơn</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Mã hóa đơn</th>
                    <th>Tên hóa đơn</th>
                    <th>Thời gian lập</th>
                    <th>Thành tiền</th>
                    <th>Chỉnh sửa</th>
                </tr>
            </thead>
            <tbody id="detail-body">
            </tbody>
        </table>
    `;

    const tbody = document.getElementById("detail-body");

    data.forEach(dlieu => {
        // alert(dlieu['idhoadon']);
        tbody.innerHTML += `
            <tr>
                <td>${dlieu['idhoadon']}</td>
                <td>${dlieu['tenhoadon']}</td>
                <td>${dlieu['thoigianlap']}</td>
                <td>${dlieu['thanhtien']}</td>
                <td>
                    <button href="#">Edit</button> 
                    <button href="#">Remove</button>  
                    <button href="#">Show more</button>
                </td>
            </tr>
        `;
    });

    const khoahoc = document.getElementById('student-khoc');
    khoahoc.innerHTML = `
        <h3>Chi tiết khóa học</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Mã khóa học</th>
                    <th>Tên khóa học</th>
                    <th>Chỉnh sửa</th>
                  
                </tr>
            </thead>
            <tbody id="tbody_khoahoc">
            </tbody>
        </table>
    `;

    const tbody_khoahoc = document.getElementById("tbody_khoahoc");

    data.forEach(dlieu => {
        tbody_khoahoc.innerHTML += `
            <tr>
                <td>${dlieu.idkhoahoc}</td>
                <td>${dlieu.tenkhoahoc}</td>
                <td>
                    <button onclick="editkhoahoc(${dlieu.idkhoahoc})">Edit</button> 
                    <button onclick="removekhoahoc(${dlieu.idkhoahoc})">Remove</button> 
                    
                </td>
            </tr>
        `;
    });
}


function editkhoahoc(id){
   
    window.location.href=`taovaquanlykhoahoc.html?idkhoahoc=${id}`;
}


