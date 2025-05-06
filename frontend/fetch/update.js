export async function UpdateHocVien(data) {
    alert("Đang gửi dữ liệu cập nhật...");
    const res = await fetch("http://localhost/quanlytrungtam/backend/controller/HocVienController.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    alert("Cập nhật thành công!");
    return true;
}