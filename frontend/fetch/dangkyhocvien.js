document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const phone = document.getElementById('sdt').value;
    const date = document.getElementById('birth').value;
    const course = document.getElementById('course').value;

    const data = {
        hoten: fullname,
        sdt: phone,
        ngaysinh: date
       
    };

    console.log("day la data ", JSON.stringify(data)); // Kiểm tra trước khi gửi
    
    const kq = await addStudent(data);
    console.log("day la kq ", kq);
    const id = kq.idhocvien;
    console.log("id " + id);
    const data2 = {
        idhocvien: id,
        idkhoahoc : course,
        ketquahoctap : "chua co",
        tinhtranghocphi : "chua co"
    }
    addKhoaHoc(data2);

});

document.addEventListener('DOMContentLoaded', function() {
    fetchKhoaHoc();
});

async function addStudent(data) {
    try {
        const res = await fetch('http://localhost/quanlytrungtam/backend/controller/HocvienController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Lỗi từ server:', errorText);
            throw new Error(errorText);
        }

        const result = await res.json();
        
        document.getElementById('confirmationMessage').textContent =
            'Đăng ký thành công! Vui lòng kiểm tra email/SMS để xác thực tài khoản.';
        return result;
    } catch (err) {
        console.error('Lỗi:', err);
    }
}

async function fetchKhoaHoc() {
    const select = document.getElementById('course');
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/KhoahocController.php');

    if (!res.ok) {
        throw new Error(await res.text());
    }

    const data = await res.json();
    data.forEach(khoahoc => {
        const otp = document.createElement('option');
        otp.value = khoahoc.idkhoahoc;
        otp.textContent = khoahoc.tenkhoahoc;
        select.appendChild(otp);
    });
}


async function addKhoaHoc(data){
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/ChitiethocvienController.php',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(data)
    })
    if (!res.ok){
        throw new Error('loi ' + await res.text());
    }
    const result = await res.json();
    console.log("uadasd " + result);
}