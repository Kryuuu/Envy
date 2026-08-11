export const WORD_POOLS = {
  technology: ['ROBOT', 'KODE', 'PIXEL', 'BYTE', 'CHIP', 'LASER', 'ROKET', 'LOGIKA', 'DATA', 'SISTEM', 'MESIN'],
  colors: ['MERAH', 'BIRU', 'HIJAU', 'KUNING', 'UNGU', 'ORANYE', 'PUTIH', 'HITAM', 'PERAK', 'EMAS'],
  actions: ['MAJU', 'LOMPAT', 'PUTAR', 'JALAN', 'TERBANG', 'CEPAT', 'LEKAS', 'GESIT', 'BELOK', 'CARI'],
  objects: ['BULAN', 'BINTANG', 'AWAN', 'MARS', 'KOMET', 'PANDA', 'KUCING', 'ELANG', 'HARIMAU', 'SINGA'],
};

export function generateRoomCode(): string {
  const t = WORD_POOLS.technology[Math.floor(Math.random() * WORD_POOLS.technology.length)];
  const c = WORD_POOLS.colors[Math.floor(Math.random() * WORD_POOLS.colors.length)];
  const a = WORD_POOLS.actions[Math.floor(Math.random() * WORD_POOLS.actions.length)];
  const o = WORD_POOLS.objects[Math.floor(Math.random() * WORD_POOLS.objects.length)];
  return `${t}-${c}-${a}-${o}`;
}
