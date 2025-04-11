document.addEventListener('DOMContentLoaded', async function () {
    console.log("cuc cuuuuuu");
    console.log('Đã chạy file tthocvien.js');
    alert('Từ file tthocvien.js!');
    // await ShowAll();
});

async function fetchThongTin() {
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/HocvienController.php');
    if (!res.ok) {
        throw new Error(await res.text());
    }
    alert("chao ca nha");
    const data = await res.json();
    console.log(data);
    return data;
}

async function ShowAll() {
    const data = await fetchThongTin(); // thêm await
    const student_all = document.getElementById('student-all');
    student_all.innerHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>Mã SV</th>
                    <th>Họ tên</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody id="student-tbody">
            </tbody>
        </table>
    `;

    const tbody = document.getElementById('student-tbody');
    data.forEach(student => {
        tbody.innerHTML += `
            <tr>
                <td>${student.msv}</td>
                <td>${student.hoten}</td>
                <td><a href="edit.php?stt=${student.stt}">Sửa</a></td>
            </tr>
        `;
    });
}
