document.addEventListener('DOMContentLoaded', async function(){

});


async function fetchThongTin(id){
    const res= await fetch(`http://localhost/quanlytrungtam/backend/controller/HocvienController.php?idhocvien=${id}`);
    if (!res.ok){
        throw new Error(await res.text());
    }
    return await res.json();
}

async function HienThiThongTin(){
    
}