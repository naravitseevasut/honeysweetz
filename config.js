// ===== ตั้งค่าร้าน (แก้ไขที่ไฟล์นี้ที่เดียว) =====
window.SHOP = {
  name: "น้ำผึ้งบ้านสวน",
  // URL ของ Google Apps Script Web App (ได้หลัง Deploy ตาม README ข้อ 2)
  API_URL: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",
  // รหัสผ่านหน้าแพ็คของ (ต้องตรงกับ ADMIN_KEY ใน Code.gs)
  // หมายเหตุ: ไม่ต้องใส่ไว้ที่นี่ ผู้ดูแลจะกรอกในหน้า pack.html เอง
  shippingFee: 50,
  freeShippingOver: 800,
  sender: {
    name: "ร้านน้ำผึ้งบ้านสวน",
    phone: "081-234-5678",
    address: "99 หมู่ 1 ต.ในเมือง อ.เมือง จ.เชียงใหม่ 50000"
  },
  products: [
    {
      sku: "HW500",
      name: "น้ำผึ้งป่าดอกไม้ป่า",
      size: "500 กรัม",
      price: 280,
      weightG: 750,
      image: "images/honey-wild.svg",
      desc: "น้ำผึ้งจากดอกไม้ป่าหลากหลายชนิด กลิ่นหอมเข้ม รสกลมกล่อม เหมาะกับชา โยเกิร์ต และขนมปัง"
    },
    {
      sku: "HL500",
      name: "น้ำผึ้งดอกลำไย",
      size: "500 กรัม",
      price: 320,
      weightG: 750,
      image: "images/honey-longan.svg",
      desc: "น้ำผึ้งดอกลำไยแท้ สีอำพันใส หวามละมุน กลิ่นหอมอ่อน ๆ ทานง่ายทุกวัย"
    }
  ]
};
