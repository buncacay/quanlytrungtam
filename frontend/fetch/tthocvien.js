document.addEventListener('DOMContentLoaded', async function(){
    const params = new URLSearchParams(window.location.search);
    const id= params.get('id');
    const data  = await fetchThongTin(id);
    console.log(data);
    HienThiThongTin(data);
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
    const data = await fetchThongTin(id);
    // window.location.href=`dangkyhocvien`
}


async function fetchThongTin(id){
    const res= await fetch(`http://localhost/quanlytrungtam/backend/controller/HocvienController.php?idhocvien=${id}`);
    if (!res.ok){
        throw new Error(await res.text());
    }
    const data = await res.json();
    alert("cuc cu");
    console.log("data " + data);
    return data;
}

async function HienThiThongTin(data){
   

    const info = document.getElementById('student-info');
    info.innerHTML = `
        <h2>Thông tin học viên</h2>
        <p><strong>Họ và tên:</strong> ${data.hoten}</p>
        <p><strong>Mã học viên:</strong> ${data.idhocvien}</p>
        <p><strong>Số điện thoại:</strong> ${data.sdt}</p>
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
                    <th>Chỉnh sửa</th>
                </tr>
            </thead>
            <tbody id="detail-body">
            </tbody>
        </table>
    `;

    const tbody = document.getElementById("detail-body");

    data.forEach(dlieu => {
        tbody.innerHTML += `
            <tr>
                <td>${dlieu.idhoadon}</td>
                <td>${dlieu.tenhoadon}</td>
                <td>${dlieu.thoigianlap}</td>
                <td><button href="#">Edit</button> <button href="#">Remove</button>  <button href="#">Show more</button></td>
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
                <td><button href="#">Edit</button> <button href="#">Remove</button> <button href="#">Show more</button>  </td>
            </tr>
        `;
    });
}
