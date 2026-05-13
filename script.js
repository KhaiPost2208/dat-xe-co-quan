const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx0OAP1wlWy44sIWvB9_VdkW6xFrf7-UGLrkiPz5qMVFX1S3dME5OGU2JK2uhOuQplG/exec";

async function loadXe() {
    const select = document.getElementById("tenXe");
    select.innerHTML = '<option value="">Đang tải...</option>';

    try {
        console.log("Đang gọi:", SCRIPT_URL + "?action=layDanhSachXe");
        
        const response = await fetch(SCRIPT_URL + "?action=layDanhSachXe");
        console.log("Status:", response.status);

        const text = await response.text();
        console.log("Dữ liệu trả về:", text);

        const data = JSON.parse(text);
        console.log("Số dòng dữ liệu:", data.length);

        select.innerHTML = '<option value="">-- Chọn xe --</option>';

        for (let i = 1; i < data.length; i++) {
            const xe = data[i];
            if (xe && xe[1]) {   // xe[1] là cột TenXe
                const option = document.createElement("option");
                option.value = xe[1];
                option.textContent = `${xe[1]} - ${xe[2] || ''} (${xe[5] || xe[4]} chỗ)`;
                select.appendChild(option);
            }
        }
    } catch (error) {
        console.error("Lỗi chi tiết:", error);
        select.innerHTML = '<option value="">❌ Lỗi kết nối - Xem Console (F12)</option>';
    }
}

// Phần submit giữ nguyên
document.getElementById("datXeForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.textContent = "Đang gửi...";
    submitBtn.disabled = true;

    const formData = {
        nguoiDat: document.getElementById("nguoiDat").value,
        soDienThoai: document.getElementById("soDienThoai").value,
        tenXe: document.getElementById("tenXe").value,
        ngayDi: document.getElementById("ngayDi").value,
        gioDi: document.getElementById("gioDi").value,
        ngayVe: document.getElementById("ngayVe").value || "",
        gioVe: document.getElementById("gioVe").value || "",
        diemDi: document.getElementById("diemDi").value,
        diemDen: document.getElementById("diemDen").value,
        lyDo: document.getElementById("lyDo").value,
        soNguoi: document.getElementById("soNguoi").value
    };

    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();
        if (result.success) {
            alert(`✅ Thành công! Mã đơn: ${result.maDon}`);
            document.getElementById("datXeForm").reset();
        } else {
            alert("❌ Gửi thất bại");
        }
    } catch (error) {
        alert("❌ Lỗi gửi đơn");
    }

    submitBtn.textContent = "🚀 Gửi đơn đặt xe";
    submitBtn.disabled = false;
});

window.onload = loadXe;