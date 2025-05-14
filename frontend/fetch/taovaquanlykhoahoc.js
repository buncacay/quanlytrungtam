import {fetchGiangVien, fetchKhoaHoc, fetchChiTietKhoaHoc, fetchKhoaHocVoiId} from './get.js';
import {addKhoaHoc, addChiTietKhoaHoc, addChiTietNhanVien} from './add.js';
import {UpdateKhoaHoc, UpdateChiTietKhoaHoc} from './update.js';

document.getElementById('course-image').addEventListener('change', function(event) {
   
        HienThiAnh(event, null);
   
    
});

async function HienThiAnh(event, images) { 
    const prev = document.getElementById('preview');

    if (images) {
        // prev.src = `./upload/${images}`;
        prev.src = `http://localhost/quanlytrungtam/backend/upload/${images}`;
        prev.style.display = 'block';
    } else {
        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                prev.src = e.target.result;
                prev.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }
}


async function themmoikhoahoc (event) {
    try {
 event.preventDefault();
   alert("them moi");
   alert("clicked");
    event.preventDefault();
    const ten = document.getElementById('course-name').value;
    const soluongbuoi = document.getElementById('soluongbuoi').value;
    const thoigianhoc = document.getElementById('thoigianhoc').value;
    const lichhoc = document.getElementById('lichhoc').value;
   
    const mota= document.getElementById('motakhoahoc').value;
    const giatien= document.getElementById('giatien').value;
    const giamgia= document.getElementById('giamgia').value;
    const start= document.getElementById('start').value;
    const end= document.getElementById('end').value;


    // alert(mota);
   
    const data = {
        tenkhoahoc: ten,
        thoigianhoc: thoigianhoc,
        soluongbuoi: soluongbuoi,
        lichhoc: lichhoc,
        diadiemhoc: "not found",
        mota : mota,
        trangthai : 1,
        giatien: giatien,
        giamgia: giamgia,
        ngaybatdau : start,
        ngayketthuc: end
       
    };
    const fileInput = document.getElementById('course-image');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('data', JSON.stringify(data));
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    
  
    event.preventDefault();
    const kq = await addKhoaHoc(formData);
    console.log("hellodfads" , kq);
    const khoaHoc = JSON.parse(kq); // jsonData là chuỗi JSON phía trên

    const id = khoaHoc.idkhoahoc;
    alert(id); // sẽ in ra: 172

    }
    catch (error){
        console.log("loi ", error);
    }
 
    if (kq) {
      
        try {

        const lessons = document.querySelectorAll('#noidungkhoahoc .lesson-item');
        const data3 = [];
        let d=0;
        lessons.forEach(lesson =>{
            const title = lesson.querySelector('.lesson-title')?.textContent.trim();
            const link=lesson.querySelector('.lesson-link a')?.href;
            

            data3.push({
                idkhoahoc : id,
                idbaihoc: d,
                tenbaihoc:title,
                link: link
            });
            d++;
        });
        alert("cho anh");
        console.log("data 3" , data3);
        if (await addChiTietKhoaHoc(data3)){
                alert("them chi tiet thanh cong thanh cong");
        }
        
        else {
            alert("them chi tiet that bai");
        }
        }
        
       catch (error) {
        console.log(error);
        alert("Lỗi khi thêm chi tiết giảng viên: " + error);
    }
    } else {
        alert("Thêm khóa học thất bại!");
    }
};

document.getElementById('themkhoahoc').onclick = async (event) => {
    event.preventDefault(); // Ngăn reload nếu là form
   
     const urlParams = new URLSearchParams(window.location.search);
     const idkhoahoc = urlParams.get('idkhoahoc');

    if (idkhoahoc) {
        // Có id => Cập nhật
       
        await saveChanges(event, idkhoahoc);
    } else {
        // Không có id => Thêm mới
        await themmoikhoahoc(event);
    }
};



document.addEventListener('DOMContentLoaded', async function (event) {
       
     const pa = new URLSearchParams(window.location.search);
     const images = pa.get('images');
    if (images) {
        alert(images);
        HienThiAnh(event, images);  // Chỉ xử lý ảnh từ server (folder upload)
    }
   
    
    
  
    const urlParams = new URLSearchParams(window.location.search);
    const idkhoahoc = urlParams.get('idkhoahoc');
    // alert(idkhoahoc);
    const kq = await fetchKhoaHocVoiId(idkhoahoc);

   
   if (idkhoahoc) {
    const chitietdanhsach = document.getElementById('chitiet');
    chitietdanhsach.innerHTML = `
        <!-- Danh sách học viên -->
        <div class="student-list-section">
            <h3>📋 Danh sách học viên</h3>
            <!-- Gán giá trị idkhoahoc vào URL -->
            <a href="danhsachhocvien.html?idkhoahoc=${idkhoahoc}">Xem chi tiết</a>
        </div>

        <!-- Danh sách giảng viên -->
        <div class="instructor-list-section" style="margin-top: 30px;">
            <h3>👨‍🏫 Danh sách giảng viên</h3>
            <!-- Gán giá trị idkhoahoc vào URL -->
            <a href="phanconggiangday.html?idkhoahoc=${idkhoahoc}">Xem chi tiết</a>
        </div>`;


            
           

            
        document.getElementById('themkhoahoc').textContent="Lưu chỉnh sửa";
        console.log(("adfasdfads " , kq));
       


        const ten = document.getElementById('course-name');
        const gv = document.getElementById('instructor');
        const soluongbuoi = document.getElementById('soluongbuoi');
        const thoigianhoc = document.getElementById('thoigianhoc');
        const lichhoc = document.getElementById('lichhoc');
        const mota = document.getElementById('motakhoahoc');
        const giatien= document.getElementById('giatien');
        const giamgia= document.getElementById('giamgia');
         const start= document.getElementById('start');
        const end= document.getElementById('end');
        
        // alert(kq[0]['tenkhoahoc']);
        ten.value = kq[0]['tenkhoahoc'];  // Sửa từ textContent thành value
        // gv.value = kq[0]['idnhanvien'];  // Sửa từ textContent thành value
        soluongbuoi.value = kq[0]['soluongbuoi'];  // Sửa từ textContent thành value
        thoigianhoc.value = kq[0]['thoigianhoc'];  // Sửa từ textContent thành value
        lichhoc.value = kq[0]['lichhoc'];  // Sửa từ textContent thành value
        mota.value=kq[0]['mota'];
        giatien.value=kq[0]['giatien'];
        giamgia.value=kq[0]['giamgia'];
        start.value=kq[0]['ngaybatdau'];
        console.log(start.value);
        end.value=kq[0]['ngayketthuc'];


        const chitiet = await fetchKhoaHocVoiId(idkhoahoc);
        console.log(chitiet);
        const noidung = document.getElementById('noidungkhoahoc');
        noidung.innerHTML="";
        chitiet.forEach(baihoc =>{
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

async function saveChanges(event, idkhoahoc) {
    event.preventDefault();

    const ten = document.getElementById('course-name').value;
    const soluongbuoi = document.getElementById('soluongbuoi').value;
    const thoigianhoc = document.getElementById('thoigianhoc').value;
    const lichhoc = document.getElementById('lichhoc').value;
    // const idnhanvien = document.getElementById('instructor').value;
    const mota = document.getElementById('motakhoahoc').value;
    const giatien = document.getElementById('giatien').value;
    const giamgia = document.getElementById('giamgia').value;

    const data = {
        idkhoahoc: idkhoahoc,
        tenkhoahoc: ten,
        soluongbuoi: soluongbuoi,
        thoigianhoc: thoigianhoc,
        lichhoc: lichhoc,
        mota: mota,
        giatien: giatien,
        giamgia: giamgia,
        // idnhanvien: idnhanvien
    };

    try {
        
        if (await UpdateKhoaHoc(data)) {
            console.log(data);
            alert("Cập nhật khóa học thành công!");

            // Xử lý chi tiết bài học
            const lessons = document.querySelectorAll('#noidungkhoahoc .lesson-item');
            const data3 = [];
            let d=0;
            lessons.forEach(lesson =>{
                const title = lesson.querySelector('.lesson-title')?.textContent.trim();
                const link=lesson.querySelector('.lesson-link a')?.href;
                alert(d);
                data3.push({
                    idkhoahoc : idkhoahoc,
                    idbaihoc: d,
                    tenbaihoc:title,
                    link: link
                });
                d++;
            });
            alert("cho anh");
            console.log("data 3" , data3);
            if (await UpdateChiTietKhoaHoc(data3)){
                    alert("cap nhat chi tiet thanh cong");
                    window.location.href="danhsachkhoahoc.html"
            }
            
            else {
                alert("cap nhat chi tiet that bai");
            }
        
        

        } else {
            alert("Cập nhật thất bại: " + result.message);
        }

    } catch (error) {
        alert("Lỗi khi cập nhật khóa học: " + error.message);
    }
}