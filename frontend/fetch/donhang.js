import { fetchDonHang } from './get.js';  // API lấy danh sách đơn hàng
import { UpdateDonHang } from './update.js'; // API cập nhật đơn hàng
import { addChiTietHocVien } from './add.js'; // API thêm chi tiết học viên

const showDonHang = async () => {
    try {
        const donhangList = await fetchDonHang();

        if (!donhangList || donhangList.length === 0) {
            document.getElementById('hocvien-body').innerHTML = '<tr><td colspan="5">Không có dữ liệu</td></tr>';
            return;
        }

        const tableBody = document.getElementById('hocvien-body');
        tableBody.innerHTML = '';

        donhangList.forEach(donhang => {
            const dh = donhang[0]; // Dễ gọi hơn

            const row = document.createElement('tr');

            // Mã đơn hàng
            const tdId = document.createElement('td');
            tdId.textContent = dh.iddonhang;
            row.appendChild(tdId);

            // ID học viên
            const tdTaiKhoan = document.createElement('td');
            tdTaiKhoan.textContent = dh.idhocvien;
            row.appendChild(tdTaiKhoan);

            // ID khóa học
            const tdKhoaHoc = document.createElement('td');
            tdKhoaHoc.textContent = dh.idkhoahoc;
            row.appendChild(tdKhoaHoc);

            // Trạng thái đơn
            const tdTrangThai = document.createElement('td');
            const select = document.createElement('select');

            const option1 = new Option('Chờ phê duyệt', 'Chờ phê duyệt');
            const option2 = new Option('Đã xác nhận', 'Đã xác nhận');

            if (dh.trangthaidon === 'Chờ phê duyệt') {
                option1.selected = true;
            } else if (dh.trangthaidon === 'Đã xác nhận') {
                option2.selected = true;
            }

            select.appendChild(option1);
            select.appendChild(option2);
            tdTrangThai.appendChild(select);
            row.appendChild(tdTrangThai);

            // Nút cập nhật
            const tdUpdate = document.createElement('td');
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Cập nhật';

            updateButton.addEventListener('click', async () => {
                await capnhat(dh.idkhoahoc, dh.idhocvien, dh.iddonhang, select);
            });

            tdUpdate.appendChild(updateButton);
            row.appendChild(tdUpdate);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Lỗi khi hiển thị đơn hàng:', error);
    }
};

showDonHang();

// Hàm cập nhật trạng thái đơn hàng và chi tiết học viên
async function capnhat(idkhoahoc, idhocvien, iddonhang, selectElement) {
    const trangthaidon = selectElement.value;

    const data = {
        iddonhang: iddonhang,
        idkhoahoc: idkhoahoc,
        idhocvien: idhocvien,
        trangthaidon: trangthaidon,
        thoigiandat: getFormattedDateTime()
    };

    console.log("Cập nhật đơn hàng:", data);

    const res = await UpdateDonHang(data);
    console.log("Kết quả cập nhật:", res);

    if (res?.success || res === true) {
        alert("Cập nhật trạng thái đơn hàng thành công.");

        if (trangthaidon === "Đã xác nhận") {
            const data2 = {
                idkhoahoc: idkhoahoc,
                idhocvien: idhocvien,
                tinhtranghocpho: "Đang học",
                ketquahoctap: "Chưa có"
            };

            const result = await addChiTietHocVien(data2);
            console.log("Kết quả thêm chi tiết học viên:", result);
            alert("Đã thêm học viên vào chi tiết học.");
        }
    } else {
        alert("Cập nhật thất bại.");
    }
}

// Hàm lấy thời gian hiện tại theo định dạng 'YYYY-MM-DD HH:mm:ss'
function getFormattedDateTime() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
