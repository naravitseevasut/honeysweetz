(function () {
  const S = window.SHOP;
  const fmt = n => n.toLocaleString("th-TH");
  const $ = id => document.getElementById(id);

  $("brandName").textContent = S.name;
  $("footName").textContent = "© " + new Date().getFullYear() + " " + S.name;
  document.querySelectorAll(".freeAmt").forEach(e => e.textContent = fmt(S.freeShippingOver));

  // สินค้า
  $("productGrid").innerHTML = S.products.map(p => `
    <article class="pcard">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="pbody">
        <h3>${p.name}</h3>
        <div class="size">ขนาด ${p.size}</div>
        <div class="price">${fmt(p.price)} <small>บาท</small></div>
        <p>${p.desc}</p>
        <a class="btn" href="#order" data-add="${p.sku}">สั่งซื้อสินค้านี้</a>
      </div>
    </article>`).join("");

  // ตัวเลือกจำนวน
  const qty = {};
  S.products.forEach(p => qty[p.sku] = 0);
  $("qtyList").innerHTML = S.products.map(p => `
    <div class="qty">
      <img src="${p.image}" alt="">
      <div class="t">${p.name}<small>${p.size} · ${fmt(p.price)} บาท</small></div>
      <div class="step">
        <button type="button" data-d="-1" data-sku="${p.sku}" aria-label="ลด">−</button>
        <output id="q_${p.sku}">0</output>
        <button type="button" data-d="1" data-sku="${p.sku}" aria-label="เพิ่ม">+</button>
      </div>
    </div>`).join("");

  function totals() {
    const sub = S.products.reduce((s, p) => s + p.price * qty[p.sku], 0);
    const ship = sub === 0 ? 0 : (sub >= S.freeShippingOver ? 0 : S.shippingFee);
    return { sub, ship, grand: sub + ship };
  }
  function render() {
    S.products.forEach(p => $("q_" + p.sku).textContent = qty[p.sku]);
    const t = totals();
    $("subTotal").textContent = fmt(t.sub);
    $("shipFee").textContent = t.sub === 0 ? "0" : (t.ship === 0 ? "ส่งฟรี" : fmt(t.ship));
    $("grandTotal").textContent = fmt(t.grand);
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-d]");
    if (b) {
      const k = b.dataset.sku;
      qty[k] = Math.max(0, Math.min(99, qty[k] + Number(b.dataset.d)));
      render();
    }
    const a = e.target.closest("[data-add]");
    if (a && qty[a.dataset.add] === 0) { qty[a.dataset.add] = 1; render(); }
  });
  render();

  // ส่งออเดอร์
  $("orderForm").addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target, msg = $("msg");
    msg.textContent = "";
    let ok = true;
    form.querySelectorAll("input,textarea").forEach(el => {
      const bad = (el.required && !el.value.trim()) || (el.pattern && el.value && !new RegExp("^(?:" + el.pattern + ")$").test(el.value.trim()));
      el.classList.toggle("bad", !!bad);
      if (bad) ok = false;
    });
    const t = totals();
    if (t.sub === 0) { msg.textContent = "กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้น"; return; }
    if (!ok) { msg.textContent = "กรุณากรอกข้อมูลให้ครบและถูกต้อง"; return; }
    if (S.API_URL.startsWith("PASTE_")) { msg.textContent = "ยังไม่ได้ตั้งค่า API_URL ใน config.js"; return; }

    const fd = new FormData(form);
    const payload = {
      action: "order",
      name: fd.get("name").trim(), phone: fd.get("phone").trim(),
      address: fd.get("address").trim(), subdistrict: fd.get("subdistrict").trim(),
      district: fd.get("district").trim(), province: fd.get("province").trim(),
      postcode: fd.get("postcode").trim(), note: (fd.get("note") || "").trim(),
      items: S.products.filter(p => qty[p.sku] > 0).map(p => ({
        sku: p.sku, name: p.name + " " + p.size, qty: qty[p.sku], price: p.price, weightG: p.weightG
      })),
      subtotal: t.sub, shipping: t.ship, total: t.grand
    };

    const btn = $("submitBtn");
    btn.disabled = true; btn.textContent = "กำลังส่งออเดอร์...";
    try {
      // text/plain เพื่อเลี่ยง CORS preflight ของ Apps Script
      const r = await fetch(S.API_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "บันทึกไม่สำเร็จ");
      form.hidden = true;
      $("oid").textContent = j.orderId;
      $("done").hidden = false;
      $("done").scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      msg.textContent = "เกิดข้อผิดพลาด: " + err.message + " (ลองใหม่อีกครั้ง)";
      btn.disabled = false; btn.textContent = "ยืนยันการสั่งซื้อ";
    }
  });
})();
