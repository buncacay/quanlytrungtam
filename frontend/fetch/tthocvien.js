document.addEventListener('DOMContentLoaded', async function(){
    const params = new URLSearchParams(window.location.search);
    const id= params.get('id');
    const data  = await fetchThongTin(id);
    console.log(data);
    HienThiThongTin(data);
});



async function fetchThongTin(id){
    const res= await fetch(`http://localhost/quanlytrungtam/backend/controller/HocvienController.php?idhocvien=${id}`);
    if (!res.ok){
        throw new Error(await res.text());
    }
    return await res.json();
}

async function HienThiThongTin(data){
   

    const info = document.getElementById('student-info');
    info.innerHTML = `
        <h2>Thông tin học viên</h2>
        <p><strong>Họ và tên:</strong> ${data[0].hoten}</p>
        <p><strong>Mã học viên:</strong> ${data[0].idhocvien}</p>
        <p><strong>Số điện thoại:</strong> ${data[0].sdt}</p>
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
               
            </tr>
        `;
    });
}
