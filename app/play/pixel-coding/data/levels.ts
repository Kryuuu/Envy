import { PixelLevel } from '../types/pixel';
const E = 'empty' as const, R = 'red' as const, B = 'blue' as const, G = 'green' as const, Y = 'yellow' as const, P = 'purple' as const, O = 'orange' as const;

export const pixelLevels: PixelLevel[] = [
  // L1-3: Coordinates basics
  {id:1,name:'Titik Pertama',description:'Warnai satu pixel di tengah grid.',gridSize:5,allowRepeat:false,optimalCommands:1,
    target:[[E,E,E,E,E],[E,E,E,E,E],[E,E,R,E,E],[E,E,E,E,E],[E,E,E,E,E]],
    tutorial:{title:'💡 Apa itu Koordinat?',content:'Koordinat menunjukkan posisi di grid. X = kolom (kiri→kanan), Y = baris (atas→bawah). Mulai dari 0!'}},
  {id:2,name:'Garis Horizontal',description:'Buat garis merah mendatar.',gridSize:5,allowRepeat:false,optimalCommands:5,
    target:[[E,E,E,E,E],[E,E,E,E,E],[R,R,R,R,R],[E,E,E,E,E],[E,E,E,E,E]]},
  {id:3,name:'Tanda Plus',description:'Buat tanda + di tengah.',gridSize:5,allowRepeat:false,optimalCommands:5,
    target:[[E,E,B,E,E],[E,E,B,E,E],[B,B,B,B,B],[E,E,B,E,E],[E,E,B,E,E]]},

  // L4-6: Sequence/patterns
  {id:4,name:'Hati Kecil',description:'Buat pola hati sederhana.',gridSize:5,allowRepeat:false,optimalCommands:8,
    target:[[E,R,E,R,E],[R,R,R,R,R],[R,R,R,R,R],[E,R,R,R,E],[E,E,R,E,E]]},
  {id:5,name:'Wajah Senyum',description:'Buat wajah senyum.',gridSize:5,allowRepeat:false,optimalCommands:8,
    target:[[E,E,E,E,E],[E,B,E,B,E],[E,E,E,E,E],[Y,E,E,E,Y],[E,Y,Y,Y,E]]},
  {id:6,name:'Panah Kanan',description:'Buat panah menunjuk kanan.',gridSize:5,allowRepeat:false,optimalCommands:7,
    target:[[E,E,G,E,E],[E,E,E,G,E],[G,G,G,G,G],[E,E,E,G,E],[E,E,G,E,E]]},

  // L7-9: Repetition
  {id:7,name:'Bingkai',description:'Buat bingkai di tepi grid.',gridSize:5,allowRepeat:true,optimalCommands:6,
    target:[[P,P,P,P,P],[P,E,E,E,P],[P,E,E,E,P],[P,E,E,E,P],[P,P,P,P,P]],
    tutorial:{title:'💡 Repeat untuk Pola',content:'Gunakan Repeat untuk mengulang perintah Paint. Sangat berguna untuk membuat garis atau bingkai!'}},
  {id:8,name:'Garis-Garis',description:'Buat pola garis horizontal bergantian.',gridSize:6,allowRepeat:true,optimalCommands:6,
    target:[[O,O,O,O,O,O],[E,E,E,E,E,E],[O,O,O,O,O,O],[E,E,E,E,E,E],[O,O,O,O,O,O],[E,E,E,E,E,E]]},
  {id:9,name:'Papan Catur',description:'Buat pola kotak-kotak 2 warna.',gridSize:6,allowRepeat:true,optimalCommands:12,
    target:[[B,E,B,E,B,E],[E,B,E,B,E,B],[B,E,B,E,B,E],[E,B,E,B,E,B],[B,E,B,E,B,E],[E,B,E,B,E,B]]},

  // L10-12: Combined
  {id:10,name:'Bintang',description:'Buat pola bintang.',gridSize:7,allowRepeat:true,optimalCommands:13,
    target:[[E,E,E,Y,E,E,E],[E,E,Y,Y,Y,E,E],[E,Y,Y,Y,Y,Y,E],[Y,Y,Y,Y,Y,Y,Y],[E,Y,Y,Y,Y,Y,E],[E,E,Y,Y,Y,E,E],[E,E,E,Y,E,E,E]]},
  {id:11,name:'Robot Face',description:'Buat wajah robot.',gridSize:7,allowRepeat:true,optimalCommands:16,
    target:[[E,B,B,B,B,B,E],[B,E,E,E,E,E,B],[B,E,G,E,G,E,B],[B,E,E,E,E,E,B],[B,E,R,R,R,E,B],[B,E,E,E,E,E,B],[E,B,B,B,B,B,E]]},
  {id:12,name:'Alien Pixel',description:'Buat alien pixel art!',gridSize:8,allowRepeat:true,optimalCommands:20,
    target:[[E,E,E,P,P,E,E,E],[E,E,P,P,P,P,E,E],[E,P,P,P,P,P,P,E],[P,E,P,E,E,P,E,P],[P,P,P,P,P,P,P,P],[E,P,E,P,P,E,P,E],[E,P,E,E,E,E,P,E],[E,E,P,E,E,P,E,E]]},
];
