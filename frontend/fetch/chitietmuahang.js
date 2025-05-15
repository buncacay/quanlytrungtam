import {addDonHang} from './add.js';

function getFormattedDateTime() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());

    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
document.getElementById('xacnhan').addEventListener('click', async function (){
    const params = new URLSearchParams(window.location.search); // Lấy id khóa học từ URL
    const idkhoahoc = params.get('idkhoahoc');
    const idhocvien = params.get('idhocvien');
    const data ={
        idkhoahoc : idkhoahoc, 
        idhocvien :idhocvien,
        trangthaidon: "Chờ xác nhận",
        thoigiandat: getFormattedDateTime()    }
    console.log(data);
    const res = await addDonHang(data);
    if (res){
        alert("Hãy liên hệ qua fanpage để gửi hóa đơn và chờ xác nhận");
    }
    else {
        alert("Đã xảy ra lỗi");
    }
    
});