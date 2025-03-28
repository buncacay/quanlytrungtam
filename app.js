function submit() {
    alert("cuc cu");
    const idhocvien = document.getElementById('idhocvien').value;
    const hoten = document.getElementById('hoten').value;
    const ngaysinh = document.getElementById('ngaysinh').value;
    const sdt = document.getElementById('sdt').value;
    const diachi = document.getElementById('diachi').value;
    const sdtph = document.getElementById('sdtph').value;

    const postData = {
        idhocvien: idhocvien, 
        hoten: hoten,
        ngaysinh: ngaysinh,
        sdt: sdt,
        diachi: diachi,
        sdtph: sdtph
    };

    fetch('http://localhost/quanlytrungtam/controller/hocviencontroller.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(postData) 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); 
    })
    .then(data => {
        console.log(data); // Process the data as needed
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}