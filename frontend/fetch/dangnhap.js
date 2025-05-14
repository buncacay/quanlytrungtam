import {fetchTaiKhoan} from './get.js';

document.getElementById('login').addEventListener('click', async function(){
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;

    const res = await fetchTaiKhoan(user);
    if (res.password === pass && res.role===3) {
        alert("Dang nhap thanh cong");
        
            window.location.href = "index.html";
        
    }
    else {
        alert("Dang nhap that bai");

    }
});