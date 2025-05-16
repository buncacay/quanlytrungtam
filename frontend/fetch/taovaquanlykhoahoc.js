import {fetchGiangVien, fetchKhoaHoc, fetchChiTietKhoaHoc,fetchDanhMuc,  fetchKhoaHocVoiId} from './get.js';
import {addKhoaHoc, addChiTietKhoaHoc, addChiTietNhanVien} from './add.js';
import {UpdateKhoaHoc, UpdateChiTietKhoaHoc} from './update.js';

document.getElementById('course-image').addEventListener('change', function(event) {
   
        HienThiAnh(event, null);

   
    
});

async function loadDanhMucToSelect(selectedId = null) {
  const data = await fetchDanhMuc(); // Lấy dữ liệu danh mục
  const select = document.getElementById("danhmuc");

  select.innerHTML = '';


    data.forEach(dm => {
    const option = document.createElement("option");
    option.value = dm.iddanhmuc.toString(); // đảm bảo value là chuỗi
    option.textContent = dm.tendanhmuc;
    select.appendChild(option);

    console.log(`ID: ${dm.iddanhmuc}, Tên danh mục: ${dm.tendanhmuc}`);
    });

// Kiểm tra thử
// alert(selectedId)
const option = document.querySelector(`#danhmuc option[value="${selectedId}"]`);
if (!option) {
  console.log(`❌ Không tìm thấy option tương ứng với ID: ${selectedId}`);
} else {
  console.log(`✅ Đã tìm thấy option: ${option.textContent}`);
}

}


let resizedImageBlob = null; // Lưu blob ảnh đã resize để upload

// Hàm resize ảnh
function cropAndResizeImage(file, size = 300, callback) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // Tính vùng crop (cắt giữa ảnh)
            let sx = 0, sy = 0, sSize = 0;
            if (img.width > img.height) {
                sSize = img.height;
                sx = (img.width - img.height) / 2;
            } else {
                sSize = img.width;
                sy = (img.height - img.width) / 2;
            }

            // Vẽ vào canvas vùng đã cắt
            ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, size, size);

            // Tạo blob và URL preview
            canvas.toBlob(function (blob) {
                const previewUrl = URL.createObjectURL(blob);
                callback(blob, previewUrl);
            }, file.type || 'image/jpeg', 0.9);
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}



async function HienThiAnh(event, images = null) {
    const prev = document.getElementById('preview');

    if (images) {
        prev.src = `http://localhost/quanlytrungtam/backend/upload/${images}`;
        prev.style.display = 'block';
        return;
    }

    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        cropAndResizeImage(file, 400, function (blob, previewUrl) {
            resizedImageBlob = blob;
            prev.src = previewUrl;
            prev.style.display = 'block';
        });
    }
}




async function themmoikhoahoc(event) {
    event.preventDefault(); // chỉ cần gọi 1 lần

    try {
        const ten = document.getElementById('course-name').value;
        const soluongbuoi = document.getElementById('soluongbuoi').value;
        const thoigianhoc = document.getElementById('thoigianhoc').value;
        const lichhoc = document.getElementById('lichhoc').value;
        const mota = document.getElementById('motakhoahoc').value;
        const giatien = document.getElementById('giatien').value;
        const giamgia = document.getElementById('giamgia').value;
        const start = document.getElementById('start').value;
        const end = document.getElementById('end').value;
        const danhmuc = document.getElementById('danhmuc').value;
        const data = {
            tenkhoahoc: ten,
            thoigianhoc,
            soluongbuoi,
            lichhoc,
            diadiemhoc: "not found",
            mota,
            trangthai: 1,
            giatien,
            giamgia,
            ngaybatdau: start,
            ngayketthuc: end,
            danhmuc : danhmuc
        };
        // console.log(danhm)
        console.log(data);

        const formData = new FormData();
        let fileToUpload = null;

        // Nếu có ảnh đã crop
        if (typeof resizedImageBlob !== 'undefined' && resizedImageBlob) {
            formData.append('file', resizedImageBlob, 'avatar.jpg');
            fileToUpload = resizedImageBlob;
        } else {
            const originalFile = document.getElementById('course-image')?.files[0];
            if (originalFile) {
                formData.append('file', originalFile);
                fileToUpload = originalFile;
            }
        }

        if (fileToUpload) {
            formData.append('image', fileToUpload);
        }

        formData.append('data', JSON.stringify(data));
        for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
}


        // Gọi API thêm khóa học
        const kq = await addKhoaHoc(formData);
        const res = JSON.parse(kq);
        console.log("Kết quả thêm khóa học:", kq);

        if (!res || !res.idkhoahoc) {
            throw new Error("Không lấy được ID khóa học từ kết quả.");
        }

        const id = res.idkhoahoc;
        alert("Đã thêm khóa học, ID: " + id);

        // Xử lý chi tiết bài học
        const lessons = document.querySelectorAll('#noidungkhoahoc .lesson-item');
        const data3 = [];
        let d = 0;

        lessons.forEach(lesson => {
            const title = lesson.querySelector('.lesson-title')?.textContent.trim();
            const link = lesson.querySelector('.lesson-link a')?.href;

            console.log(title + " adfasd " + link);

            if (title && link) {
                data3.push({
                    idkhoahoc: id,
                    idbaihoc: d,
                    tenbaihoc: title,
                    link: link
                });
                d++;
            }
        });

        if (data3.length === 0) {
            alert("Không có bài học nào được nhập.");
            return;
        }

        const ct = await addChiTietKhoaHoc(data3);
        if (ct) {
            alert("Thêm chi tiết khóa học thành công!");
        } else {
            alert("Thêm chi tiết khóa học thất bại.");
        }

    } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi: " + error.message);
    }
}


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
       loadDanhMucToSelect();
     const pa = new URLSearchParams(window.location.search);
     const images = pa.get('images');
    if (images) {
        // alert(images);
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
           
            <a href="danhsachhocvien.html?idkhoahoc=${idkhoahoc}">📋 Danh sách học viên</a>
        </div>

        <!-- Danh sách giảng viên -->
        <div class="instructor-list-section" style="margin-top: 30px;">
          
            <a href="phanconggiangday.html?idkhoahoc=${idkhoahoc}">👨‍🏫 Danh sách giảng viên</a>
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
         const danhmuc= document.getElementById('danhmuc');
        
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
        danhmuc.value = kq[0]['danhmuc'].toString();
        // alert(danhmuc.value);
        // loadDanhMucToSelect(danhmuc.value.toString());



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

let trangthai=1;
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
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
     const danhmuc = document.getElementById('danhmuc').value;

    const today = new Date().toISOString().split('T')[0]; // Lấy ngày hôm nay ở định dạng 'YYYY-MM-DD'
// alert(today);

if (end <= today) {
    // Gọi API cập nhật trạng thái
    trangthai = 2
}
else {
    trangthai = 1
}
    const data = {
        idkhoahoc: idkhoahoc,
        tenkhoahoc: ten,
        soluongbuoi: soluongbuoi,
        thoigianhoc: thoigianhoc,
        lichhoc: lichhoc,
        mota: mota,
        giatien: giatien,
        giamgia: giamgia,
        ngaybatdau : start,
        ngayketthuc : end,
        trangthai : trangthai,
        danhmuc : danhmuc
        // idnhanvien: idnhanvien
    };
    console.log(data);
    try {
        
        if (await UpdateKhoaHoc(data)) {
            console.log(data);
            // alert("Cập nhật khóa học thành công!");

            // Xử lý chi tiết bài học
            const lessons = document.querySelectorAll('#noidungkhoahoc .lesson-item');
            const data3 = [];
            let d=0;
            lessons.forEach(lesson =>{
                const title = lesson.querySelector('.lesson-title')?.textContent.trim();
                const link=lesson.querySelector('.lesson-link a')?.href;
                // alert(d);
                data3.push({
                    idkhoahoc : idkhoahoc,
                    idbaihoc: d,
                    tenbaihoc:title,
                    link: link
                });
                d++;
            });
            // alert("cho anh");
            console.log("data 3" , data3);
            if (await UpdateChiTietKhoaHoc(data3)){
                    // alert("cap nhat chi tiet thanh cong");
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