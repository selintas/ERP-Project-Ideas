let atamalar = {};

function allowDrop(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.add('dragover');
}

function dragStart(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  ev.target.style.opacity = '0.5';
}

function dragEnd(ev) {
  ev.target.style.opacity = '';
  document.querySelectorAll('.dragover').forEach(el => {
    el.classList.remove('dragover');
  });
}

function dragLeave(ev) {
  ev.currentTarget.classList.remove('dragover');
}

function olustur() {
  const urunlerDiv = document.getElementById("urunler");
  const makinelerDiv = document.getElementById("makineler");

  // Ürünleri oluştur
  urunler.forEach(urun => {
    const div = document.createElement("div");
    div.className = "item";
    div.draggable = true;
    div.id = urun.id;
    div.innerHTML = `<span class="content">${urun.ad}</span>`;
    div.ondragstart = dragStart;
    div.ondragend = dragEnd;
    urunlerDiv.appendChild(div);
  });

  // Makineleri oluştur
  makineler.forEach((makine, index) => {
    const div = document.createElement("div");
    div.className = "machine";
    div.id = makine.id;
    div.setAttribute('data-number', index + 1);
    div.innerHTML = `<span class="content">${makine.ad}</span>`;
    div.ondrop = drop;
    div.ondragover = allowDrop;
    div.ondragleave = dragLeave;
    makinelerDiv.appendChild(div);
  });

  // Atamaları yükle
  const kayit = localStorage.getItem("selin_atamalar");
  if (kayit) {
    atamalar = JSON.parse(kayit);
    Object.entries(atamalar).forEach(([makineId, urunId]) => {
      const makineEl = document.getElementById(makineId);
      const urunEl = document.getElementById(urunId);
      if (makineEl && urunEl) {
        makineEl.appendChild(urunEl);
        makineEl.classList.add("dropped");
      }
    });
  }

  atamalariGuncelle();
}

function drop(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.remove('dragover');
  
  const urunId = ev.dataTransfer.getData("text");
  const urunEl = document.getElementById(urunId);

  // Eğer ürün ürünler konteynerine bırakılıyorsa
  if (ev.target.id === "urunler" || ev.target === document.getElementById("urunler")) {
    document.getElementById("urunler").appendChild(urunEl);
    const eskiMakine = Object.keys(atamalar).find(k => atamalar[k] === urunId);
    if (eskiMakine) {
      delete atamalar[eskiMakine];
      document.getElementById(eskiMakine).classList.remove("dropped");
    }
    atamalariGuncelle();
    return;
  }

  const item = document.querySelector('.item');

// Sürükleme başladığında user-select özelliğini devre dışı bırak
item.addEventListener('dragstart', () => {
  item.classList.add('no-select');
});

// Sürükleme bittiğinde user-select özelliğini geri yükle
item.addEventListener('dragend', () => {
  item.classList.remove('no-select');
});

  // Eğer ürün bir makineye bırakılıyorsa
  let targetMachine = ev.target;
  if (!targetMachine.classList.contains("machine")) {
    targetMachine = targetMachine.closest(".machine");
  }

  if (targetMachine) {
    if (targetMachine.querySelector(".item")) {
      alert("Bu iş merkezine zaten bir ürün atanmış.");
      return;
    }
    
    // Önceki atamalı makineyi temizle
    const eskiMakine = Object.keys(atamalar).find(k => atamalar[k] === urunId);
    if (eskiMakine) {
      document.getElementById(eskiMakine).classList.remove("dropped");
    }
    
    targetMachine.appendChild(urunEl);
    targetMachine.classList.add("dropped");
    atamalar[targetMachine.id] = urunId;
    atamalariGuncelle();
  }
}

function kaydet() {
  localStorage.setItem("selin_atamalar", JSON.stringify(atamalar));
  alert("Atamalar kaydedildi!");
}

function sifirla() {
  if (!confirm("Tüm atamalar silinsin mi?")) return;
  localStorage.removeItem("selin_atamalar");
  location.reload();
}

function atamalariGuncelle() {
  const tbody = document.getElementById("atamaListesi");
  tbody.innerHTML = "";

  Object.entries(atamalar).forEach(([makineId, urunId]) => {
    const makineEl = document.getElementById(makineId);
    const urunEl = document.getElementById(urunId);
    if (makineEl && urunEl) {
      const row = document.createElement("tr");
      const tdMakine = document.createElement("td");
      tdMakine.textContent = makineEl.querySelector('.content').textContent;
      const tdUrun = document.createElement("td");
      tdUrun.textContent = urunEl.querySelector('.content').textContent;
      row.appendChild(tdMakine);
      row.appendChild(tdUrun);
      tbody.appendChild(row);
    }
  });
}

window.addEventListener("load", olustur);