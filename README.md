# ร้านน้ำผึ้งบ้านสวน – Landing Page + ระบบหยิบ/แพ็ค/จ่าหน้าพัสดุ

เว็บสแตติก (HTML/CSS/JS) + Google Sheet เป็นฐานข้อมูล (ผ่าน Google Apps Script) + Deploy บน Vercel

## โครงสร้างไฟล์
```
index.html      หน้าแลนดิ้งเพจ + ฟอร์มสั่งซื้อ
pack.html       หน้าร้านค้า: ใบหยิบสินค้า, เช็กลิสต์แพ็ค, พิมพ์ป้ายจ่าหน้า
config.js       ตั้งค่าร้าน, สินค้า (2 SKUs), API_URL, ที่อยู่ผู้ส่ง
app.js, style.css
images/         โฟลเดอร์รูปภาพแยกต่างหาก (honey-wild.svg, honey-longan.svg)
apps-script/Code.gs   โค้ดฝั่ง Google Sheet
vercel.json
```
SKUs: `HW500` น้ำผึ้งป่าดอกไม้ป่า 500 ก. (280 บาท) · `HL500` น้ำผึ้งดอกลำไย 500 ก. (320 บาท)

## 1) สร้าง Google Sheet
1. สร้าง Google Sheet ใหม่ (ตั้งชื่ออะไรก็ได้)
2. เมนู **Extensions → Apps Script** แล้ววางโค้ดจาก `apps-script/Code.gs`
3. แก้ `ADMIN_KEY` เป็นรหัสผ่านของคุณเอง
4. ระบบจะสร้างแท็บ `Orders` และหัวตารางให้อัตโนมัติเมื่อมีออเดอร์แรก

## 2) Deploy Apps Script เป็น Web App
1. **Deploy → New deployment → Web app**
2. Execute as: **Me** · Who has access: **Anyone**
3. กด Deploy, อนุญาตสิทธิ์ แล้วคัดลอก URL (ลงท้าย `/exec`)
4. วางที่ `API_URL` ใน `config.js`
> ถ้าแก้ Code.gs ภายหลัง ต้อง Deploy → Manage deployments → New version

## 3) ขึ้น GitHub
```bash
cd honey-shop
git init && git add . && git commit -m "honey shop"
git branch -M main
git remote add origin https://github.com/<username>/honey-shop.git
git push -u origin main
```
รูปสินค้าอยู่ในโฟลเดอร์ `images/` แยกจากโค้ดแล้ว

## 4) Deploy บน Vercel
1. เข้า vercel.com → **Add New → Project** → เลือก repo `honey-shop`
2. Framework Preset: **Other** (ไม่ต้องใส่ build command) → **Deploy**
3. ได้โดเมน `https://<ชื่อโปรเจกต์>.vercel.app` ทุกครั้งที่ push เว็บอัปเดตอัตโนมัติ

## การใช้งานร้านค้า
1. เปิด `https://<โดเมน>/pack` ใส่รหัส `ADMIN_KEY` → โหลดออเดอร์
2. ส่วน ① บอกจำนวนที่ต้องหยิบแต่ละ SKU รวมกัน
3. ส่วน ② ติ๊กออเดอร์ → **พิมพ์ป้ายจ่าหน้า** (ขนาด 100×150 มม.) → แพ็คเสร็จกด **แพ็คเสร็จแล้ว** (ใส่เลขพัสดุได้) สถานะจะอัปเดตใน Sheet

## หมายเหตุ
- ลูกค้าโอนเงินและแจ้งสลิปกับร้านเอง (ยังไม่มีระบบชำระเงินอัตโนมัติ)
- `ADMIN_KEY` เป็นการป้องกันแบบพื้นฐานสำหรับงานเรียน; ถ้าใช้จริงควรเพิ่มระบบล็อกอิน
- ควรแก้ที่อยู่ผู้ส่งใน `config.js` เป็นข้อมูลจริงของร้านก่อนส่งงาน
