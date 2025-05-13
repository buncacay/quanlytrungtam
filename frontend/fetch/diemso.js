import { addDiem } from './add.js';
import { UpdateDiem } from './update.js';
import { RemoveDiem } from './delete.js';
import { fetchDiem, fetchAllHocVien, fetchKhoaHoc } from './get.js';

let currentPage = 1;
let totalPages = 1;
let allScores = [];

document.addEventListener('DOMContentLoaded', async () => {
    loadDropdownData();

    document.getElementById('studentId').addEventListener('change', () => tryFetchScores(1));
    document.getElementById('courseId').addEventListener('change', () => tryFetchScores(1));
    document.getElementById('addScoreBtn').addEventListener('click', addScore);

    await tryFetchScores();
});

async function loadDropdownData() {
    try {
        const hocVienRes = await fetchAllHocVien();
        const khoaHocRes = await fetchKhoaHoc();

        const studentSelect = document.getElementById('studentId');
        const courseSelect = document.getElementById('courseId');

        hocVienRes.data.forEach(hv => {
            const option = document.createElement('option');
            option.value = hv.idhocvien;
            option.textContent = hv.hoten || `Học viên ${hv.idhocvien}`;
            studentSelect.appendChild(option);
        });

        khoaHocRes.forEach(kh => {
            const option = document.createElement('option');
            option.value = kh.idkhoahoc;
            option.textContent = kh.tenkhoahoc || `Khóa học ${kh.idkhoahoc}`;
            courseSelect.appendChild(option);
        });

    } catch (err) {
        console.error('Lỗi khi load dropdown:', err);
    }
}

async function tryFetchScores(page = 1) {
    const params = new URLSearchParams(window.location.search);
    const idkhoahoc = params.get("idkhoahoc") || document.getElementById('courseId').value;

    if (!idkhoahoc) return;

    try {
        const res = await fetchDiem(idkhoahoc);
        allScores = res;

        totalPages = Math.ceil(allScores.length / 10);
        currentPage = page;

        const paginated = paginateData(allScores, page, 10);
        renderScores(paginated);
        renderPagination(totalPages, page);
    } catch (err) {
        console.error('Lỗi khi lấy điểm:', err);
    }
}

function paginateData(data, page, limit) {
    const start = (page - 1) * limit;
    const end = start + limit;
    return data.slice(start, end);
}

function renderScores(data) {
    const tbody = document.getElementById('scoreTableBody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${item.hoten}</td>
            <td>${item.kythi}</td>
            <td>${item.diemso}</td>
            <td>${item.ghichu ?? ''}</td>
            <td>
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </td>
        `;

        tr.querySelector('.edit-btn').addEventListener('click', () => editScore(item));
        tr.querySelector('.delete-btn').addEventListener('click', () => deleteScore(item.id));

        tbody.appendChild(tr);
    });
}

async function addScore() {
    
    const payload = {
        idhocvien: document.getElementById('studentId').value,
        idkhoahoc: document.getElementById('courseId').value,
        kythi: document.getElementById('kythi').value,
        diemso: parseFloat(document.getElementById('score').value),
        ghichu: document.getElementById('note').value.trim() || null
    };

    if (!payload.idhocvien || !payload.idkhoahoc || !payload.kythi || isNaN(payload.diemso)) {
        alert('Vui lòng nhập đầy đủ và đúng thông tin!');
        return;
    }

    if (edit){
        
        const updated = {
            id: iddiemso,
            idhocvien: document.getElementById('studentId').value,
            idkhoahoc: document.getElementById('courseId').value,
            kythi: document.getElementById('kythi').value,
            diemso: parseFloat(document.getElementById('score').value),
            ghichu:  document.getElementById('note').value || null
        };
        console.log(updated);

        const res = await UpdateDiem(updated);
        if (res){
            tryFetchScores(currentPage);
        }
        else {
            alert("Lỗi cập nhật nhe");
        }
        
    }
    else {
            await addDiem(payload);
            clearForm();
            await tryFetchScores(currentPage);
    }
    edit = false;

   
}
let edit = false;
let iddiemso;

let editingScore = null;

function editScore(score) {
    edit = true;
    editingScore = score;
    iddiemso = score.id;

    // Gán dữ liệu lên form
    document.getElementById('studentId').value = score.idhocvien;
    document.getElementById('courseId').value = score.idkhoahoc;
    document.getElementById('kythi').value = score.kythi;
    document.getElementById('score').value = score.diemso;
    document.getElementById('note').value = score.ghichu || '';

    // Đổi nút thành "Lưu chỉnh sửa"
    document.getElementById('addScoreBtn').textContent = "💾 Lưu chỉnh sửa";
}

async function deleteScore(id) {
    if (!confirm('Bạn có chắc muốn xóa điểm này?')) return;
    await RemoveDiem(id);
    await tryFetchScores(currentPage);
}

function renderPagination(totalPages, current) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.style.margin = '0 4px';
        btn.style.padding = '5px 10px';

        if (i === current) {
            btn.style.backgroundColor = '#3498db';
            btn.style.color = '#fff';
            btn.disabled = true;
        }

        btn.addEventListener('click', () => {
            currentPage = i;
            const paginated = paginateData(allScores, currentPage, 10);
            renderScores(paginated);
            renderPagination(totalPages, currentPage);
        });

        pagination.appendChild(btn);
    }
}

function clearForm() {
    document.getElementById('kythi').value = '';
    document.getElementById('score').value = '';
    document.getElementById('note').value = '';
}
