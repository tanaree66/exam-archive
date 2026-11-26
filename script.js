// ==========================================
// 1. ฐานข้อมูลข้อสอบและชีทสรุป (แก้ไข/เพิ่มข้อมูลตรงนี้)
// ==========================================
const resources = [
    {
        id: 1,
        title: "ข้อสอบกลางภาค แคลคูลัส 1 (ปีการศึกษา 2567)",
        subject: "MATH101 - แคลคูลัส 1",
        type: "exam", // 'exam' = ข้อสอบเก่า, 'summary' = ชีทสรุป
        description: "รวมแนวข้อสอบเรื่องลิมิต ความต่อเนื่อง และอนุพันธ์ พร้อมเฉลยวิธีทำละเอียด",
        previewText: "หัวข้อที่ออกสอบ:\n1. การหาค่าลิมิตในรูปแบบยังไม่กำหนด (0/0)\n2. กฎลูกโซ่ (Chain Rule) และการหาอนุพันธ์โดยปริยาย\n3. การประยุกต์อนุพันธ์หาค่าสูงสุด-ต่ำสุดสัมพัทธ์\n\n*คำแนะนำ: ควรฝึกทำโจทย์เรื่องอัตราสัมพัทธ์เพิ่มเติม",
        fileUrl: "files/math-midterm-67.pdf" // ใส่ลิงก์ไฟล์ในโฟลเดอร์ files/ หรือลิงก์ Google Drive ก็ได้
    },
    {
        id: 2,
        title: "สรุปสูตรสถิติเบื้องต้นและการทดสอบสมมติฐาน",
        subject: "STAT201 - สถิติวิเคราะห์",
        type: "summary",
        description: "ชีทสรุป 5 หน้าจบ ครอบคลุมการแจกแจงปกติ Z-test, T-test และตารางเปิดค่า",
        previewText: "สรุปหลักการเลือกใช้สถิติทดสอบ:\n- ทราบค่าความแปรปรวนประชากร (σ²) หรือ n ≥ 30 ใช้ Z-test\n- ไม่ทราบค่า σ² และ n < 30 ใช้ T-test (df = n - 1)\n- การเปรียบเทียบค่าเฉลี่ยมากกว่า 2 กลุ่ม ใช้ ANOVA (F-test)",
        fileUrl: "files/stat-summary.pdf"
    },
    {
        id: 3,
        title: "แนวข้อสอบปลายภาค หลักการเขียนโปรแกรมเบื้องต้น",
        subject: "CS102 - การเขียนโปรแกรม",
        type: "exam",
        description: "โจทย์ฝึกเขียน Loop, Array, Function และการวิเคราะห์ผลลัพธ์ของโค้ด",
        previewText: "แนวข้อสอบส่วนเขียนโค้ด:\n- เขียนฟังก์ชันตรวจสอบจำนวนเฉพาะ\n- การวนลูปซ้อน (Nested Loop) เพื่อแสดงผลรูปแบบพีระมิด\n- การจัดการข้อมูลใน Array 2 มิติ",
        fileUrl: "https://drive.google.com/" // ตัวอย่างการใช้ลิงก์ภายนอก
    }
];

// ==========================================
// 2. ระบบแสดงผล ค้นหา และกรองข้อมูล
// ==========================================
const grid = document.getElementById('resourceGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

function renderCards() {
    const keyword = searchInput.value.toLowerCase().trim();
    grid.innerHTML = '';

    const filtered = resources.filter(item => {
        const matchesType = currentFilter === 'all' || item.type === currentFilter;
        const matchesSearch = item.title.toLowerCase().includes(keyword) ||
                              item.subject.toLowerCase().includes(keyword) ||
                              item.description.toLowerCase().includes(keyword);
        return matchesType && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 2rem;">ไม่พบข้อมูลที่ค้นหา ลองเปลี่ยนคำค้นหาดูอีกครั้งนะ</p>`;
        return;
    }

    filtered.forEach(item => {
        const badgeText = item.type === 'exam' ? '📝 ข้อสอบเก่า' : '📖 ชีทสรุป';
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div>
                <span class="badge ${item.type}">${badgeText}</span>
                <h3>${item.title}</h3>
                <div class="subject-tag">${item.subject}</div>
                <p class="desc">${item.description}</p>
            </div>
            <div class="card-actions">
                <button class="btn-outline" onclick="openModal(${item.id})">อ่านสรุปย่อ</button>
                <a href="${item.fileUrl}" target="_blank" class="btn-primary">เปิดไฟล์</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Event Listeners สำหรับการค้นหาและกดปุ่มกรอง
searchInput.addEventListener('input', renderCards);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderCards();
    });
});

// ==========================================
// 3. ระบบหน้าต่าง Modal อ่านรายละเอียด
// ==========================================
const modal = document.getElementById('previewModal');
const closeBtn = document.querySelector('.close-btn');

function openModal(id) {
    const item = resources.find(r => r.id === id);
    if (!item) return;

    const badge = document.getElementById('modalBadge');
    badge.className = `badge ${item.type}`;
    badge.textContent = item.type === 'exam' ? '📝 ข้อสอบเก่า' : '📖 ชีทสรุป';

    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalSubject').textContent = item.subject;
    document.getElementById('modalBody').textContent = item.previewText;
    document.getElementById('modalDownloadBtn').href = item.fileUrl;

    modal.style.display = 'block';
}

closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
};

// โหลดข้อมูลครั้งแรกเมื่อเปิดหน้าเว็บ
renderCards();