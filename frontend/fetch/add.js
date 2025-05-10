export async function addKhoaHoc(data) {
   
    try {
        const res = await fetch('http://localhost/quanlytrungtam/backend/controller/KhoahocController.php', {
            method: 'POST',
           
            body:data
        });
        if (!res.ok) {
            const err = await res.text();
            alert(err);
            throw new Error('Lỗi: ' + err);
        }
        return await res.json();
    } catch (error) {
        alert("Lỗi khi thêm khóa học: " + error.message);
        console.log(error.message);
    }
}



export async function addBaiHoc() {
   
    const noidung = document.getElementById('noidungkhoahoc');
    const data = []; 

    const lessons = noidung.getElementsByClassName('lesson-item');
    for (let lesson of lessons) {
        const ten = lesson.querySelector('.lesson-title').textContent; // Lấy tên bài học
        const link = lesson.querySelector('.lesson-link a').href; // Lấy link bài học
        
        // const kq = await addKhoaHoc(data);

        data.push({
            idkhoahoc: kq.idkhoahoc,
            idbaihoc: data.length,
            tenbaihoc: ten,
            link: link
        });
    }

    // In ra dữ liệu hoặc thực hiện các thao tác khác
    console.log(data);
}


// export async function addGiangVien(data) {
//     try {
//         const res = await fetch('http://localhost/quanlytrungtam/backend/controller/ChiTietNhanVienController.php', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(data)
//         });
//         if (!res.ok) throw new Error('Lỗi: ' + await res.text());
//         return await res.json();
//     } catch (error) {
//         alert("Lỗi khi thêm chi tiết giảng viên: " + error.message);
//     }
// }


export async function addThongTinGiangVien(data) {
    try {
        const res = await fetch('http://localhost/quanlytrungtam/backend/controller/NhanVienController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Lỗi: ' + await res.text());
        return await res.json();
    } catch (error) {
        alert("Lỗi khi thêm chi tiết giảng viên: " + error.message);
    }
}


export async function addChiTietKhoaHoc(data){
  console.log(data);
    try {
        const res= await fetch('http://localhost/quanlytrungtam/backend/controller/ChitietkhoahocController.php',{
                    method:'POST',
                    headers:
                    {
                        'Content-Type' : 'application/json'
                    },
                    body:JSON.stringify(data)
            });
            if (!res.ok) {
                alert("xem lai");
                throw new Error('Lỗi: ' + await res.text());
            }
            return await res.json();
            }
   catch (error) {
        alert("Lỗi khi thêm chi tiết giảng viên: " + error.message);
    }
}
     
    


export async function addStudent(data) {
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
        
        
        return result;
    } catch (err) {
        console.error('Lỗi:', err);
    }
}

export async function addChiTietHocVien(data) {
    try {
        const res = await fetch('http://localhost/quanlytrungtam/backend/controller/ChitiethocvienController.php', {
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
        
        
        return result;
    } catch (err) {
        console.error('Lỗi:', err);
    }
}

export async function addChiTietNhanVien(data) {
    try {
        const res = await fetch('http://localhost/quanlytrungtam/backend/controller/ChitietnhanvienController.php', {
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
        
        
        return result;
    } catch (err) {
        console.error('Lỗi:', err);
    }
}


export async function addHoaDon(data){
    const res= await fetch('http://localhost/quanlytrungtam/backend/controller/HoaDonController.php',{
        method:'POST',
        headers:
        {
            'Content-Type' : 'application/json'
        },
        body:JSON.stringify(data)
});
if (!res.ok) {
    alert("xem lai");
    throw new Error('Lỗi: ' + await res.text());
}
return await res.json();
}


