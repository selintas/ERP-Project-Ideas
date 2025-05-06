// İş emri kodları (030701254 gibi)
const urunCodes = Array.from({length: 20}, (_, i) => {
  const prefix = '030701';
  const suffix = (i + 200).toString().padStart(3, '0');
  return `${prefix}${suffix}`;
});

// İş merkezi kodları (Mt-100 ile 200 arasında)
const makineCodes = Array.from({length: 12}, (_, i) => {
  const number = 100 + i * 8 + Math.floor(Math.random() * 8);
  return `Mt-${number}`;
});

// İş emri listesi oluştur
const urunler = urunCodes.map((code, i) => ({
  id: `urun${i + 1}`,
  ad: code
}));

// İş merkezi listesi oluştur
const makineler = makineCodes.map((code, i) => ({
  id: `makine${i + 1}`,
  ad: code
}));