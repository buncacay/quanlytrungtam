
document.getElementById('course-image').addEventListener('change',async function(event) {
   await images();
});

document.addEventListener('DOMContentLoaded', async function () {
    await fetchGiangVien();
    const urlParams = new URLSearchParams(window.location.search);
    const idkhoahoc = urlParams.get('idkhoahoc');
    const kq = await fetchKhoaHoc(idkhoahoc);
    alert(idkhoahoc);
    console.log((kq));  

    if (idkhoahoc) {
        const submitBtn = document.getElementById('btn');
        submitBtn.textContent = 'Lưu chỉnh sửa';
        submitBtn.setAttribute('onclick', 'saveChanges(event, ' + idkhoahoc + ')');

        const ten = document.getElementById('course-name');
        const gv = document.getElementById('instructor');
        const soluongbuoi = document.getElementById('soluongbuoi');
        const thoigianhoc = document.getElementById('thoigianhoc');
        const lichhoc = document.getElementById('lichhoc');
        console.log("abc " + kq.tenkhoahoc);
        alert(kq[0]['tenkhoahoc']);

        ten.value = kq.tenkhoahoc;  // Sửa từ textContent thành value
        gv.value = kq.tennhanvien;  // Sửa từ textContent thành value
        soluongbuoi.value = kq.soluongbuoi;  // Sửa từ textContent thành value
        thoigianhoc.value = kq.thoigianhoc;  // Sửa từ textContent thành value
        lichhoc.value = kq.lichhoc;  // Sửa từ textContent thành value
    }
});


async function images(){
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const prev = document.getElementById('preview');
            prev.src = e.target.result;
            prev.style.display = 'block';
        };

        reader.readAsDataURL(file);
    }
    return prev.src;
}



async function addKhoaHoc(data) {
    try {
        const res = await fetch('http://localhost/quanlytrungtam/backend/controller/KhoaHocController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Lỗi: ' + await res.text());
        return await res.json();
    } catch (error) {
        alert("Lỗi khi thêm khóa học: " + error.message);
    }
}

async function fetchGiangVien() {
    const select = document.getElementById('instructor');
    const res = await fetch('http://localhost/quanlytrungtam/backend/controller/NhanVienController.php');
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log("giang vien " + data);
    select.innerHTML = "";
    data.forEach(nhanvien => {
        const option = document.createElement('option');
        option.value = nhanvien.idnhanvien;
        option.textContent = nhanvien.tennhanvien;
        select.appendChild(option);
    });
}
async function addBaiHoc() {
   
    const noidung = document.getElementById('noidungkhoahoc');
    const data = []; 

    const lessons = noidung.getElementsByClassName('lesson-item');
    for (let lesson of lessons) {
        const ten = lesson.querySelector('.lesson-title').textContent; // Lấy tên bài học
        const link = lesson.querySelector('.lesson-link a').href; // Lấy link bài học
        
        const kq = await addKhoaHoc(data);

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

async function fetchKhoaHoc(id) {
    const url = `http://localhost/quanlytrungtam/backend/controller/ChitietkhoahocController.php?idkhoahoc=${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log(data.data);
    return data.data;
}


async function addGiangVien(data) {
    try {
        const res = await fetch('http://localhost/quanlytrungtam/backend/controller/ChiTietNhanVienController.php', {
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

async function addChiTietKhoaHoc(){
    
    const res= await fetch('http://localhost/quanlytrungtam/backend/controller/ChitietkhoahocController.php',{
            method:'POST',
            headers:
            {
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Lỗi: ' + await res.text());
    return await res.json();
     
    
}




async function them(event) {
    // alert("hiiiiiiii");
    event.preventDefault();
    const ten = document.getElementById('course-name').value;
    const soluongbuoi = document.getElementById('soluongbuoi').value;
    const thoigianhoc = document.getElementById('thoigianhoc').value;
    const lichhoc = document.getElementById('lichhoc').value;
    const idnhanvien = document.getElementById('instructor').value;
    const mota= document.getElementById('mota').value;
    const image = await images();
    const data = {
        tenkhoahoc: ten,
        thoigianhoc: thoigianhoc,
        soluongbuoi: soluongbuoi,
        lichhoc: lichhoc,
        mota : mota,
        images : image
    };

    const kq = await addKhoaHoc(data);

    if (kq) {
        const data2 = {
            idnhanvien: idnhanvien,
            idkhoahoc: kq.idkhoahoc,
            tinhtranggiangday: "dang day",
            sogioday: 0,
            dongia: 4.3,
            thanhtien: 10
        };
        await addGiangVien(data2);
        await ShowAll(currentPage);
        alert("them thanh cong");
    } else {
        alert("Thêm khóa học thất bại!");
    }
}

async function add(){
    const noidungkhoahoc=document.getElementById('noidungkhoahoc');
    noidungkhoahoc.innerHTML += `
       <div class="lesson-item">
                            <span class="lesson-title">📘 Bài 1: Học bảng chữ cái</span>
                            <div class="lesson-actions">
                                <button onclick="edit(this.closest('.lesson-item'), event)">✏️</button>
                                <button onclick="remove(this.closest('.lesson-item'), event)">🗑️</button>
                            </div>
                            <div class="lesson-link">
                                👉 <a href="https://example.com/bai-1" target="_blank">Mở bài học</a>
                            </div>
                        </div>
    `;
}
function save(lessonElement, event) {
    event.stopPropagation();
    lessonElement.classList.remove("editing");

    const newTitle = lessonElement.querySelector('#lesson-item-title').value;
    const newLink = lessonElement.querySelector('#lesson-item-link').value;

    lessonElement.querySelector('#lesson-item-title').outerHTML = `
        <span class="lesson-title" onclick="toggleLink(this.parentElement)">📘 ${newTitle}</span>
    `;

    lessonElement.querySelector('.lesson-link').innerHTML = `
        👉 <a href="${newLink}" target="_blank">Mở bài học</a>
    `;

    lessonElement.querySelector('.lesson-actions').innerHTML = `
        <button onclick="edit(this.closest('.lesson-item'), event)">✏️</button>
        <button onclick="remove(this.closest('.lesson-item'), event)">🗑️</button>
    `;
}

function edit(lessonElement, event) {
    event.stopPropagation();
    lessonElement.classList.add("editing", "expanded"); // mở rộng khi edit

    const titleSpan = lessonElement.querySelector('.lesson-title');
    const oldTitle = titleSpan.textContent.replace("📘 ", "");

    const linkElement = lessonElement.querySelector('.lesson-link a');
    const oldLink = linkElement ? linkElement.href : '';

    titleSpan.outerHTML = `
        <input type="text" id="lesson-item-title" value="${oldTitle}" />
    `;

    lessonElement.querySelector('.lesson-link').innerHTML = `
        👉 <input type="text" id="lesson-item-link" value="${oldLink}" />
    `;

    lessonElement.querySelector('.lesson-actions').innerHTML = `
        <button onclick="save(this.closest('.lesson-item'), event)">💾</button>
        <button onclick="remove(this.closest('.lesson-item'), event)">🗑️</button>
    `;
}




function remove(button, event) {
    const lessonElement = button.closest('.lesson-item');
    lessonElement.remove();
    event.stopPropagation();
}



function toggleLink(titleElement) {
    const item = titleElement.closest('.lesson-item');

    // Nếu đang ở chế độ chỉnh sửa thì không toggle
    if (item.classList.contains('editing')) return;

    // Accordion: đóng tất cả bài khác
    document.querySelectorAll('.lesson-item').forEach(el => {
        if (el !== item) el.classList.remove('expanded');
    });

    // Toggle chính item được click
    item.classList.toggle('expanded');
}


document.querySelectorAll('.lesson-item').forEach(item => {
    item.addEventListener('click', function () {
        toggleLink(this);
    });
});
