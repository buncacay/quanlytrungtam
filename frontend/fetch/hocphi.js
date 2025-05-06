import { fetchKhoaHoc } from './get.js';

document.addEventListener('DOMContentLoaded', async function() {
    const all = document.getElementById('course'); // <select id="course"> phải tồn tại trong HTML
    const data = await fetchKhoaHoc();
    data.forEach(khoahoc => {
        const opt = document.createElement('option');
        opt.value = khoahoc.id; // dùng value thay vì id
        opt.textContent = khoahoc.tenkhoahoc;
        all.appendChild(opt);
    });
});



