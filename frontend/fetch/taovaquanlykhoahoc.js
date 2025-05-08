import {fetchGiangVien} from './get.js';
import {addKhoaHoc} from './add.js';

document.getElementById('course-image').addEventListener('change', function(event) {
    HienThiAnh(event);
});

async function HienThiAnh(event) {
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
}



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
        const mota = document.getElementById('motakhoahoc');
        
        console.log("abc " + kq.tenkhoahoc);
        // alert(kq[0]['tenkhoahoc']);

        ten.value = kq[0]['tenkhoahoc'];  // Sửa từ textContent thành value
        gv.value = kq[0]['idnhanvien'];  // Sửa từ textContent thành value
        soluongbuoi.value = kq[0]['soluongbuoi'];  // Sửa từ textContent thành value
        thoigianhoc.value = kq[0]['thoigianhoc'];  // Sửa từ textContent thành value
        lichhoc.value = kq[0]['lichhoc'];  // Sửa từ textContent thành value
        mota.value=kq[0]['mota'];

        const noidung = document.getElementById('noidungkhoahoc');
        noidung.innerHTML="";
        kq.forEach(baihoc =>{
            noidung.innerHTML += `
            <div class="lesson-item">
              <span class="lesson-title">${baihoc.tenbaihoc}</span>
              <div class="lesson-actions">
                <button onclick="edit(this.closest('.lesson-item'), event)">✏️</button>
                <button onclick="remove(this.closest('.lesson-item'), event)">🗑️</button>
              </div>
              <div class="lesson-link">
                👉 <a href="${baihoc.link}" target="_blank">${baihoc.link}</a>
              </div>
            </div>
          `;
          
        })

    }
});






async function them(event) {
    // alert("hiiiiiiii");
    event.preventDefault();
    const ten = document.getElementById('course-name').value;
    const soluongbuoi = document.getElementById('soluongbuoi').value;
    const thoigianhoc = document.getElementById('thoigianhoc').value;
    const lichhoc = document.getElementById('lichhoc').value;
    const idnhanvien = document.getElementById('instructor').value;
    const mota= document.getElementById('motakhoahoc').value;
    alert(mota);
   
    const data = {
        tenkhoahoc: ten,
        thoigianhoc: thoigianhoc,
        soluongbuoi: soluongbuoi,
        lichhoc: lichhoc,
        diadiemhoc: "not found",
        mota : mota,
        trangthai : 1,
       
    };
    const fileInput = document.getElementById('course-image');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('data', JSON.stringify(data));
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    
  

    const kq = await addKhoaHoc(formData);
    console.log(kq);
    if (kq) {
        const data2 = {
            idnhanvien: idnhanvien,
            idkhoahoc: kq.idkhoahoc,
            tinhtranggiangday: "dang day",
            sogioday: 0,
            dongia: 4.3,
            thanhtien: 10
        };

        const lessons = document.querySelectorAll('#noidungkhoahoc .lesson-item');
        const data3 = [];
        let d=0;
        lessons.forEach(lesson =>{
            const tilte = lesson.querySelector('.lesson-title')?.textContent.trim();
            const link=lesson.querySelector('.lesson-link a')?.href;
    
            data3.push({
                idkhoahoc : kq.idkhoahoc,
                idbaihoc: d,
                tenbaihoc:title,
                link: link
            });
            d++;
        });
        await addGiangVien(data2);
        await addChiTietKhoaHoc(data3);
        alert("them thanh cong");
    } else {
        alert("Thêm khóa học thất bại!");
    }
    event.preventDefault()
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

window.edit = edit;
window.remove = remove;
window.save = save;
window.add = add;
window.them = them;
