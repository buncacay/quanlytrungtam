document.addEventListener('DOMContentLoaded', async function(){
    const data = await fetchKhoaHoc();
    await HienThiThongTin(data);
});


async function fetchKhoaHoc() {
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/KhoahocController.php?action=chitiet');
    if (!res.ok) {
        throw new Error(await res.text());
    }
    const data = await res.json();
    return data;
}


async function HienThiThongTin(data){
    const all = document.getElementById('schedule-table');
    all.innerHTML =`
       <h3>Lịch học hiện tại</h3>
            <table>
                <thead>
                    <tr>
                        <th>Ngày học</th>
                        <th>Thời gian</th>
                        <th>Khóa học</th>
                        <th>Giảng viên</th>
                        <th>Phòng học</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>
                <tbody id="details">
                </tbody>
            </table>`;

    const details = document.getElementById('details');
    details.innerHTML = ""; 

    data.forEach(khoahoc => {
        details.innerHTML += `
            <tr>
                <td>${khoahoc.lichhoc}</td>
                <td>${khoahoc.thoigianhoc}</td>
                <td>${khoahoc.tenkhoahoc}</td>
                <td>${khoahoc.tennhanvien}</td>
                <td>${khoahoc.diadiemhoc}</td>
                <td>-</td>
            </tr>
        `;
    });
}

async function Search(data){
    
}


async function filterSchedule(){
    const search = document.getElementById('search');

}