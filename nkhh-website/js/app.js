/* ===== Warna & helper SVG ===== */
const C={sky:'#D6F0FF',hill1:'#C3EDD2',hill2:'#A8E3BF',ground:'#8FD9AA',groundD:'#6FC68F',wall:'#E6F6FF',wallD:'#BFE0F5',floor:'#BDE7CF',
ink:'#16324A',skinN:'#E0A070',skinT:'#EDB78C',hair:'#2A2333',green:'#2FBF71',blue:'#35A9F2',navy:'#2A6BD1',sun:'#FFC933',orange:'#FFB020',
red:'#E8434B',pink:'#FF9BAE',water:'#7DD3FF',waterD:'#2F9BEA',metal:'#B7C5D3',metalD:'#8DA0B3',purple:'#8E6BD1',wood:'#C98B4F',woodD:'#A86F38',
mouth:'#7A2E3A',cream:'#FFF6DA',lime:'#6FD98F'};
const ST=`stroke="${C.ink}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
const T=(type,vals,dur,begin)=>`<animateTransform attributeName="transform" type="${type}" values="${vals}" dur="${dur}s" repeatCount="indefinite" additive="sum"${begin?` begin="${begin}s"`:''}/>`;
const A=(attr,vals,dur,begin)=>`<animate attributeName="${attr}" values="${vals}" dur="${dur}s" repeatCount="indefinite"${begin?` begin="${begin}s"`:''}/>`;
const R=(angles,cx,cy,dur,begin)=>T('rotate',angles.map(a=>`${a} ${cx} ${cy}`).join(';'),dur,begin);
const MV=(pts,dur,begin)=>T('translate',pts.map(p=>p.join(' ')).join(';'),dur,begin);
const txt=(x,y,s,size=15,fill=C.ink,anchor='middle')=>`<text x="${x}" y="${y}" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${s}</text>`;
const shadow=(x,y,rx)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="5" fill="#000" opacity=".12"/>`;
const label=(x,y,s,fill='#fff',col=C.ink)=>{const w=s.length*7.4+18;return `<rect x="${x-w/2}" y="${y-16}" width="${w}" height="24" rx="12" fill="${fill}" stroke="${C.ink}" stroke-width="2"/>`+txt(x,y+1,s,13,col)};

/* ===== Wajah ===== */
function face(m){
  const eyes=`<ellipse cx="-8" cy="-75" rx="2.7" ry="3.6" fill="${C.ink}"/><ellipse cx="8" cy="-75" rx="2.7" ry="3.6" fill="${C.ink}"/>`;
  const ch=`<circle cx="-14.5" cy="-67" r="4" fill="${C.pink}" opacity=".6"/><circle cx="14.5" cy="-67" r="4" fill="${C.pink}" opacity=".6"/>`;
  const st=`stroke="${C.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  const big=`<circle cx="-8" cy="-75" r="5" fill="#fff" stroke="${C.ink}" stroke-width="1.6"/><circle cx="8" cy="-75" r="5" fill="#fff" stroke="${C.ink}" stroke-width="1.6"/><circle cx="-8" cy="-75" r="2" fill="${C.ink}"/><circle cx="8" cy="-75" r="2" fill="${C.ink}"/>`;
  return ({
    smile:eyes+ch+`<path d="M-6 -66 Q0 -60 6 -66" ${st}/>`,
    cheer:eyes+ch+`<path d="M-7 -67 Q0 -55 7 -67 Z" fill="${C.mouth}" stroke="${C.ink}" stroke-width="1.6" stroke-linejoin="round"/>`,
    worry:eyes+ch+`<path d="M-13 -83 L-5 -80 M13 -83 L5 -80" ${st}/><path d="M-5 -62 Q0 -66 5 -62" ${st}/>`,
    pain:`<path d="M-12 -78 L-5 -75 L-12 -72 M12 -78 L5 -75 L12 -72" ${st}/>`+ch+`<ellipse cx="0" cy="-62" rx="4" ry="3" fill="${C.mouth}" stroke="${C.ink}" stroke-width="1.5"/>`,
    o:big+ch+`<ellipse cx="0" cy="-62" rx="3.6" ry="4.6" fill="${C.mouth}" stroke="${C.ink}" stroke-width="1.5"/>`,
    open:eyes+ch+`<ellipse cx="0" cy="-63" rx="3.8" ry="3" fill="${C.mouth}" stroke="${C.ink}" stroke-width="1.5"/>`,
    closed:`<path d="M-12 -75 Q-8 -71 -4 -75 M4 -75 Q8 -71 12 -75" ${st}/>`+ch+`<path d="M-4 -63 L4 -63" ${st}/>`
  })[m||'smile'];
}

/* ===== Karakter: Nusa (who:'nusa') & Tara (who:'tara') =====
 o: x,y (pinggul), s, r (putar badan), flip, tr (condong badan atas), hr (kepala), face, cape, bob,
    legs{l,r}=[lutut x,y,kaki x,y], arms{l,r}=[siku x,y,tangan x,y], aL/aR animasi lengan, hA animasi kepala, pre/extra markup lokal */
function kid(o={}){
  const boy=(o.who||'nusa')==='nusa';
  const skin=boy?C.skinN:C.skinT, shirt=boy?C.green:C.blue, pants=boy?C.navy:C.orange, cape=boy?C.sun:C.lime;
  const s=o.s||1, fl=o.flip?-1:1;
  const lg=o.legs||{}, ar=o.arms||{};
  const lL=lg.l||[-10,22,-10,42], lR=lg.r||[10,22,10,42];
  const aL=ar.l||[-27,-27,-29,-8], aR=ar.r||[27,-27,29,-8];
  const limb=(a,b,c,col,w)=>`<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  const leg=(h,p)=>limb(h,[p[0],p[1]],[p[2],p[3]],boy?pants:skin,boy?12:9)+`<circle cx="${p[2]}" cy="${p[3]+2}" r="6.5" fill="${boy?'#fff':'#FF6B6B'}" stroke="${C.ink}" stroke-width="1.8"/>`;
  const arm=(sh,p,an)=>{const mx=sh[0]+(p[0]-sh[0])*.55,my=sh[1]+(p[1]-sh[1])*.55;
    return `<g>${limb(sh,[p[0],p[1]],[p[2],p[3]],skin,8)}<path d="M${sh[0]} ${sh[1]} L${mx} ${my}" stroke="${shirt}" stroke-width="12" stroke-linecap="round"/><circle cx="${p[2]}" cy="${p[3]}" r="5.5" fill="${skin}" stroke="${C.ink}" stroke-width="1.6"/>${an||''}</g>`;};
  const badge=`<circle cx="0" cy="-32" r="8" fill="#fff" stroke="${C.ink}" stroke-width="1.6"/><path d="M-1.8 -37.4H1.8V-33.8H5.4V-30.2H1.8V-26.6H-1.8V-30.2H-5.4V-33.8H-1.8Z" fill="${C.green}"/>`;
  const torso=`<rect x="-17" y="-54" width="34" height="56" rx="15" fill="${shirt}" ${ST}/>`+(boy
    ?`<rect x="-16" y="-9" width="32" height="11" rx="5" fill="${pants}"/>`
    :`<path d="M-18 -6L18 -6L25 14Q0 20 -25 14Z" fill="${pants}" ${ST}/>`)+badge;
  const hair=boy
    ?`<path d="M-24 -76C-27 -108 27 -108 24 -76C20 -88 10 -90 0 -86C-10 -90 -20 -88 -24 -76Z" fill="${C.hair}"/>`
    :`<circle cx="-30" cy="-80" r="9" fill="${C.hair}"/><circle cx="30" cy="-80" r="9" fill="${C.hair}"/><path d="M-24 -76C-27 -108 27 -108 24 -76C20 -88 10 -92 2 -86C-8 -92 -20 -88 -24 -76Z" fill="${C.hair}"/><circle cx="-25" cy="-86" r="4" fill="${C.sun}" stroke="${C.ink}" stroke-width="1.4"/><circle cx="25" cy="-86" r="4" fill="${C.sun}" stroke="${C.ink}" stroke-width="1.4"/>`;
  const head=`<g${o.hr?` transform="rotate(${o.hr} 0 -56)"`:''}><g>${o.hA||''}<circle cx="-23" cy="-75" r="5" fill="${skin}" ${ST}/><circle cx="23" cy="-75" r="5" fill="${skin}" ${ST}/><circle cx="0" cy="-76" r="23" fill="${skin}" ${ST}/>${hair}${face(o.face)}</g></g>`;
  const capeSvg=o.cape===false?'':`<path d="M-17 -48C-38 -30 -40 0 -36 20L36 20C40 0 38 -30 17 -48Z" fill="${cape}" ${ST}>${o.capeAnim===false?'':`<animate attributeName="d" dur="2.2s" repeatCount="indefinite" values="M-17 -48C-38 -30 -40 0 -36 20L36 20C40 0 38 -30 17 -48Z;M-17 -48C-34 -30 -44 0 -40 20L32 20C44 0 34 -30 17 -48Z;M-17 -48C-38 -30 -40 0 -36 20L36 20C40 0 38 -30 17 -48Z"/>`}</path>`;
  const upper=`<g${o.tr?` transform="rotate(${o.tr})"`:''}><rect x="-5" y="-60" width="10" height="10" fill="${skin}"/>${torso}${arm([-16,-44],aL,o.aL)}${arm([16,-44],aR,o.aR)}${head}${o.extra||''}</g>`;
  let body=`${o.pre||''}${capeSvg}${leg([-9,2],lL)}${leg([9,2],lR)}${upper}`;
  let g=`<g transform="translate(${o.x||0} ${o.y||0}) rotate(${o.r||0}) scale(${s*fl} ${s})">${body}</g>`;
  if(o.bob) g=`<g>${g}${MV([[0,0],[0,-4],[0,0]],1.6)}</g>`;
  return g;
}

/* ===== Latar ===== */
const park=()=>`<rect width="420" height="300" fill="${C.sky}"/><circle cx="366" cy="46" r="24" fill="${C.sun}"/><g fill="#fff"><ellipse cx="74" cy="52" rx="34" ry="11"/><ellipse cx="100" cy="43" rx="22" ry="11"/>${MV([[0,0],[14,0],[0,0]],9)}</g><ellipse cx="90" cy="266" rx="190" ry="64" fill="${C.hill1}"/><ellipse cx="350" cy="272" rx="170" ry="58" fill="${C.hill2}"/><rect y="250" width="420" height="50" fill="${C.ground}"/><rect y="250" width="420" height="5" fill="${C.groundD}"/>`;
const uks=()=>`<rect width="420" height="300" fill="${C.wall}"/><rect y="238" width="420" height="62" fill="${C.floor}"/><rect y="232" width="420" height="8" fill="${C.wallD}"/><rect x="28" y="36" width="66" height="84" rx="8" fill="#fff" stroke="${C.wallD}" stroke-width="3"/><path d="M55 54H67V66H79V78H67V90H55V78H43V66H55Z" fill="${C.green}"/><rect x="42" y="100" width="40" height="5" rx="2.5" fill="${C.wallD}"/><circle cx="360" cy="44" r="22" fill="#fff" stroke="${C.wallD}" stroke-width="3"/><path d="M360 44V30M360 44L370 50" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
const svgWrap=(inner,lbl)=>`<svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" aria-label="${lbl||'Peragaan P3K'}">${inner}</svg>`;

/* ===== Properti ===== */
const wound=(x,y,rot=-35)=>`<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse rx="9" ry="4.6" fill="#F2766F" stroke="#B83A3A" stroke-width="1.4"/><path d="M-5 -1L4 1M-4 2L5 -1" stroke="#B83A3A" stroke-width="1.2" stroke-linecap="round"/></g>`;
const drop=(x,y,col,dist=30,dur=1.1,begin=0,r=3.4)=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*1.3}" fill="${col}" opacity="0">${MV([[0,0],[0,dist]],dur,begin)}${A('opacity','0;1;1;0',dur,begin)}</ellipse>`;
const clock=(cx,cy,r,txtLabel)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${C.ink}" stroke-width="3"/>`+[0,90,180,270].map(a=>`<path d="M${cx} ${cy-r+4}V${cy-r+8}" stroke="${C.ink}" stroke-width="2" transform="rotate(${a} ${cx} ${cy})"/>`).join('')+`<path d="M${cx} ${cy}V${cy-r+9}" stroke="${C.red}" stroke-width="3" stroke-linecap="round">${R([0,360],cx,cy,6)}</path><circle cx="${cx}" cy="${cy}" r="3" fill="${C.ink}"/>`+(txtLabel?label(cx,cy+r+22,txtLabel,C.sun):'');
const tapAt=(X,y0=66)=>`<rect x="${X-8}" y="${y0}" width="62" height="14" rx="7" fill="${C.metal}" ${ST}/><rect x="${X-6}" y="${y0+10}" width="12" height="10" rx="3" fill="${C.metalD}" ${ST}/><rect x="${X+34}" y="${y0-12}" width="8" height="12" fill="${C.metalD}"/><rect x="${X+26}" y="${y0-19}" width="24" height="8" rx="4" fill="${C.blue}" ${ST}/><circle cx="${X+54}" cy="${y0+7}" r="9" fill="${C.metalD}" ${ST}/>`;
const stream=(X,y1,y2)=>`<line x1="${X}" y1="${y1}" x2="${X}" y2="${y2}" stroke="${C.water}" stroke-width="9" stroke-linecap="round" opacity=".55"/><line x1="${X}" y1="${y1}" x2="${X}" y2="${y2}" stroke="${C.waterD}" stroke-width="5" stroke-linecap="round" stroke-dasharray="9 9">${A('stroke-dashoffset','0;-36',.7)}</line>`;
const basin=(X,by)=>`<rect x="${X-6}" y="${by+22}" width="24" height="${250-by-22}" fill="#E8EEF4" ${ST}/><path d="M${X-44} ${by}H${X+56}Q${X+56} ${by+30} ${X+26} ${by+30}H${X-14}Q${X-44} ${by+30} ${X-44} ${by}Z" fill="#fff" ${ST}/>`;
const splash=(x,y)=>[0,1,2].map(i=>drop(x+(i-1)*9,y,C.water,26,.8,i*.25,2.8)).join('');
const ice=(x,y,s=1,wob=true)=>`<g transform="translate(${x} ${y}) scale(${s})"><g>${[[-14,-8,-8],[2,-12,6],[-4,4,-3]].map(c=>`<rect x="${c[0]-9}" y="${c[1]-9}" width="18" height="18" rx="4" fill="#CFEFFF" stroke="${C.waterD}" stroke-width="2" transform="rotate(${c[2]} ${c[0]} ${c[1]})"/><path d="M${c[0]-5} ${c[1]-4}L${c[0]-1} ${c[1]-6}" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`).join('')}${wob?R([-4,4,-4],0,0,1.4):''}</g></g>`;
const cloth=(x,y,w=46,h=34)=>`<g transform="translate(${x} ${y})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="2.4"/><path d="M${-w/2+8} ${-h/2+9}H${w/2-8}M${-w/2+8} 0H${w/2-8}M${-w/2+8} ${h/2-9}H${w/2-8}" stroke="${C.sun}" stroke-width="3" stroke-linecap="round"/></g>`;
const pack=(x,y,s=1,rot=0)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-24" y="-17" width="48" height="34" rx="11" fill="${C.cream}" stroke="${C.ink}" stroke-width="2.6"/><path d="M-24 -4H24M-24 6H24" stroke="${C.sun}" stroke-width="3"/><rect x="-5" y="-17" width="10" height="34" fill="#CFEFFF" opacity=".85"/><path d="M0 -8V8M-5 -4L5 4M5 -4L-5 4" stroke="${C.waterD}" stroke-width="2" stroke-linecap="round"/></g>`;
const flake=(x,y,s=1,begin=0)=>`<g transform="translate(${x} ${y}) scale(${s})" opacity="0"><path d="M0 -9V9M-8 -4.5L8 4.5M-8 4.5L8 -4.5" stroke="${C.waterD}" stroke-width="2.4" stroke-linecap="round"/>${A('opacity','0;1;0',1.8,begin)}${MV([[0,0],[0,-10]],1.8,begin)}</g>`;
const xmark=(x,y,r=22)=>`<g><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".85"/><path d="M${x-r*.6} ${y-r*.6}L${x+r*.6} ${y+r*.6}M${x+r*.6} ${y-r*.6}L${x-r*.6} ${y+r*.6}" stroke="${C.red}" stroke-width="7" stroke-linecap="round">${A('stroke-opacity','1;.45;1',1.2)}</path></g>`;
const noSign=(x,y,r=34)=>`<g><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.red}" stroke-width="8"/><path d="M${x-r*.7} ${y-r*.7}L${x+r*.7} ${y+r*.7}" stroke="${C.red}" stroke-width="8" stroke-linecap="round"/>${A('opacity','1;.55;1',1.2)}</g>`;
const bee=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-8" cy="-10" rx="9" ry="5" fill="#fff" stroke="${C.ink}" stroke-width="1.6" opacity=".9">${R([-18,10,-18],-4,-3,.25)}</ellipse><ellipse cx="6" cy="-11" rx="9" ry="5" fill="#fff" stroke="${C.ink}" stroke-width="1.6" opacity=".9">${R([18,-10,18],4,-3,.25)}</ellipse><ellipse cx="0" cy="0" rx="14" ry="10" fill="${C.sun}" stroke="${C.ink}" stroke-width="2"/><path d="M-4 -9V9M4 -9V9" stroke="${C.ink}" stroke-width="3.4"/><path d="M-14 0L-20 4" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/><circle cx="10" cy="-2" r="1.7" fill="${C.ink}"/></g>`;
const star=(x,y,r=7,fill=C.sun)=>{let p='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;p+=(i?'L':'M')+(x+rr*Math.cos(a)).toFixed(1)+' '+(y+rr*Math.sin(a)).toFixed(1)}return `<path d="${p}Z" fill="${fill}" stroke="${C.ink}" stroke-width="1.6" stroke-linejoin="round"/>`};
const sparkle=(x,y,begin=0)=>`<g transform="translate(${x} ${y})" opacity="0">${star(0,0,8)}${A('opacity','0;1;0',1.4,begin)}${T('scale','.6;1.2;.6',1.4,begin)}</g>`;
const check=(x,y)=>`<circle cx="${x}" cy="${y}" r="17" fill="${C.green}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x-8} ${y}L${x-2} ${y+7}L${x+9} ${y-7}" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const bang=(x,y)=>`<g>${label(x,y,'Aduh!',C.sun)}${A('opacity','1;.5;1',1)}</g>`;
/* ===== Skenario 1-3: Pendarahan & Luka ===== */
const bench=(x,y)=>`<rect x="${x-44}" y="${y}" width="104" height="10" rx="4" fill="${C.wood}" ${ST}/><rect x="${x-34}" y="${y+10}" width="8" height="${250-y-10}" fill="${C.woodD}"/><rect x="${x+42}" y="${y+10}" width="8" height="${250-y-10}" fill="${C.woodD}"/>`;
const TARA_WAVE=R([0,-22,0,-22,0],16,-44,1.2);

const MIMISAN={id:'mimisan',cat:1,title:'Mimisan',tag:'Hidung berdarah',color:'#CFF5DD',
 summary:'Duduk agak membungkuk, tekan cuping hidung 5–10 menit, napas lewat mulut.',
 thumb:2,
 note:{t:'Panggil guru atau orang dewasa jika darah tidak berhenti setelah 10 menit atau mimisan terjadi setelah benturan keras.',warn:true},
 steps:[
 {t:'Tetap tenang',x:'Hidung mengeluarkan darah. Jangan panik, tarik napas dulu.',who:'tara',say:'Tenang, Nusa! Mimisan biasanya bisa ditolong dengan cara sederhana.',
  svg:()=>svgWrap(park()+shadow(190,251,30)+shadow(90,251,30)
   +kid({who:'tara',x:90,y:203,face:'cheer',bob:true,arms:{r:[34,-60,36,-84]},aR:TARA_WAVE})
   +kid({who:'nusa',x:190,y:203,face:'worry',cape:false,arms:{r:[26,-27,28,-8]}})
   +drop(191,140,C.red,34,1.1)+drop(191,140,C.red,34,1.1,.55)+label(190,64,'Mimisan!',C.sun),'Nusa mimisan, Tara menenangkan')},
 {t:'Duduk agak membungkuk',x:'Duduk tegak lalu condongkan badan ke depan. Jangan menengadah ke atas, nanti darah tertelan.',who:'tara',say:'Duduk di sini ya, badan agak membungkuk ke depan.',
  svg:()=>svgWrap(park()+shadow(80,251,30)+bench(170,208)
   +kid({who:'tara',x:80,y:203,face:'smile',bob:true,arms:{r:[40,-46,62,-44]}})
   +kid({who:'nusa',x:170,y:198,tr:18,hr:6,cape:false,face:'worry',legs:{l:[20,4,22,46],r:[30,6,36,46]},arms:{r:[28,-40,4,-66],l:[-26,-22,-6,-2]}})
   +drop(193,141,C.red,32,1.1)
   +`<rect x="262" y="22" width="132" height="108" rx="16" fill="#fff" stroke="${C.ink}" stroke-width="3"/>`
   +kid({who:'nusa',x:328,y:120,s:.5,hr:-32,cape:false,face:'closed',arms:{r:[27,-27,29,-8]}})
   +`<path d="M276 36L380 118M380 36L276 118" stroke="${C.red}" stroke-width="9" stroke-linecap="round" opacity=".9">${A('stroke-opacity','1;.5;1',1.2)}</path>`
   +label(328,152,'Jangan menengadah!','#FFE9E9',C.red)+label(118,70,'Badan agak ke depan',C.cream),'Nusa duduk membungkuk; gambar menengadah dicoret')},
 {t:'Tekan cuping hidung',x:'Tekan cuping hidung dengan jari selama 5–10 menit. Bernapas lewat mulut.',who:'nusa',say:'Aku tekan hidungku dan napas lewat mulut. Sabar ya!',
  svg:()=>svgWrap(park()+shadow(80,251,30)+bench(170,208)
   +kid({who:'tara',x:80,y:203,face:'cheer',bob:true,arms:{r:[34,-56,52,-76]},aR:R([0,-12,0],16,-44,1)})
   +kid({who:'nusa',x:170,y:198,tr:18,hr:6,cape:false,face:'open',legs:{l:[20,4,22,46],r:[30,6,36,46]},arms:{r:[28,-40,4,-66],l:[-26,-22,-6,-2]},aR:MV([[0,0],[1.5,1.5],[0,0]],.9)})
   +[0,1,2].map(i=>`<path d="M${204+i*3} 139q8 -5 16 0" stroke="${C.waterD}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0">${A('opacity','0;.9;0',1.5,i*.4)}${MV([[0,0],[14,-2]],1.5,i*.4)}</path>`).join('')
   +clock(336,86,36,'5–10 menit')+label(262,196,'Napas lewat mulut',C.skys||'#DCF1FF'),'Nusa menekan cuping hidung, jam berputar')}
 ]};

const SINK_ARM=[36,-44,56,-58];
const nusaSink=(f,extra)=>kid(Object.assign({who:'nusa',x:150,y:203,face:f,cape:false,arms:{r:SINK_ARM}},extra));
const LECET={id:'lecet',cat:1,title:'Luka Lecet / Tergores',tag:'Luka lecet',color:'#CFF5DD',
 summary:'Bersihkan luka dengan air mengalir, beri antiseptik, lalu tutup dengan plester.',
 thumb:1,
 note:{t:'Kalau lukanya dalam, sangat kotor, atau darah terus keluar, minta tolong guru atau orang dewasa.',warn:true},
 steps:[
 {t:'Lihat lukanya',x:'Luka lecet terjadi saat kulit tergores. Kulit terlihat merah dan perih.',who:'tara',say:'Wah, tanganmu lecet! Ayo kita obati bersama.',
  svg:()=>svgWrap(uks()+shadow(150,251,30)+shadow(290,251,30)+nusaSink('pain')+wound(196,152)
   +kid({who:'tara',x:290,y:203,flip:true,face:'worry',bob:true,arms:{r:[34,-50,40,-66]}})+bang(150,64),'Nusa memperlihatkan luka lecet di lengan')},
 {t:'Bersihkan dengan air mengalir',x:'Bilas luka di bawah air mengalir sampai kotorannya hilang.',who:'nusa',say:'Airnya mengalir pelan, kotorannya ikut terbawa.',
  svg:()=>svgWrap(uks()+basin(197,182)+shadow(150,251,30)+shadow(300,251,30)+nusaSink('smile')+wound(196,152)+tapAt(197,62)+stream(197,84,148)+splash(197,156)
   +kid({who:'tara',x:310,y:203,flip:true,face:'cheer',bob:true})+label(318,100,'Air mengalir',C.sun),'Nusa membasuh luka di bawah keran')},
 {t:'Teteskan antiseptik',x:'Teteskan cairan antiseptik pada luka dan sekitarnya.',who:'tara',say:'Tahan ya, sedikit perih tapi ini membunuh kuman.',
  svg:()=>svgWrap(uks()+shadow(150,251,30)+shadow(250,251,30)+nusaSink('smile')+wound(196,152)
   +kid({who:'tara',x:250,y:203,flip:true,face:'smile',arms:{r:[38,-58,50,-85]}})
   +`<g transform="translate(200 112) rotate(172)"><rect x="-11" y="-2" width="22" height="30" rx="5" fill="#B5651D" ${ST}/><rect x="-8" y="6" width="16" height="12" rx="2" fill="#fff"/><rect x="-5" y="-10" width="10" height="9" fill="#B5651D" ${ST}/><rect x="-6" y="-15" width="12" height="6" rx="2" fill="${C.orange}" ${ST}/>${R([172,176,172],0,0,1)}</g>`
   +drop(200,130,'#E8962E',22,.9)+drop(199,130,'#E8962E',22,.9,.45)+label(345,92,'Antiseptik',C.sun),'Tara meneteskan antiseptik ke luka')},
 {t:'Tutup dengan plester',x:'Tempelkan plester bersih agar luka terlindung dari kotoran.',who:'tara',say:'Selesai! Lukanya sudah terlindungi plester.',
  svg:()=>svgWrap(uks()+shadow(150,251,30)+shadow(250,251,30)+nusaSink('cheer')
   +`<g transform="translate(196 152) rotate(-35)"><rect x="-19" y="-7" width="38" height="14" rx="5" fill="#F6C9A0" ${ST}/><rect x="-8" y="-7" width="16" height="14" fill="#FBE3C8" stroke="${C.ink}" stroke-width="1.4"/><circle cx="-14" cy="-2" r="1" fill="${C.ink}" opacity=".5"/><circle cx="14" cy="2" r="1" fill="${C.ink}" opacity=".5"/></g>`
   +kid({who:'tara',x:250,y:203,flip:true,face:'cheer',bob:true,arms:{r:[34,-52,45,-63]}})
   +sparkle(214,130,0)+sparkle(176,140,.5)+check(335,100),'Plester terpasang di lengan Nusa')}
 ]};

const MEMAR={id:'memar',cat:1,title:'Luka Memar',tag:'Memar',color:'#CFF5DD',
 summary:'Kompres dingin atau es berbalut kain pada memar untuk mengurangi bengkak dan nyeri.',
 thumb:2,
 note:{t:'Jangan tempel es langsung ke kulit. Beri tahu orang dewasa jika bengkaknya besar atau bagian tubuh sulit digerakkan.',warn:true},
 steps:[
 {t:'Kenali memar',x:'Memar muncul setelah terbentur. Kulit tampak kebiruan, bengkak, dan nyeri.',who:'tara',say:'Lututmu biru karena terbentur. Itu namanya memar.',
  svg:()=>svgWrap(park()+shadow(290,252,46)+shadow(110,251,30)
   +kid({who:'tara',x:110,y:203,face:'worry',bob:true,arms:{r:[26,-27,28,-8]}})
   +kid({who:'nusa',x:290,y:232,flip:true,cape:false,face:'pain',legs:{l:[-22,8,-46,12],r:[28,-24,34,10]},arms:{r:[34,-34,30,-26],l:[-30,-22,-30,-4]}})
   +`<circle cx="262" cy="208" r="10" fill="${C.skinN}"/><ellipse cx="262" cy="208" rx="8" ry="7" fill="${C.purple}" opacity=".9"/><ellipse cx="260" cy="207" rx="4" ry="3.5" fill="#5B3FA8"/>`
   +label(196,150,'Memar!',C.sun),'Nusa duduk memegang lutut yang memar')},
 {t:'Siapkan es berbalut kain',x:'Bungkus es batu dengan kain bersih supaya tidak langsung menempel di kulit.',who:'tara',say:'Es batu kubungkus kain dulu, biar kulitmu tidak kedinginan.',
  svg:()=>svgWrap(park()+`<rect x="14" y="14" width="254" height="88" rx="18" fill="#fff" stroke="${C.ink}" stroke-width="3"/>`
   +ice(54,58,1.25)+txt(54,94,'Es batu',13)+txt(96,62,'+',30)+cloth(140,56,52,40)+txt(140,94,'Kain bersih',13)+txt(190,62,'=',30)+pack(236,56,1)
   +shadow(110,251,30)+kid({who:'tara',x:110,y:203,face:'cheer',bob:true,arms:{r:[34,-52,52,-70]}})
   +shadow(300,252,46)+kid({who:'nusa',x:300,y:232,flip:true,cape:false,face:'worry',legs:{l:[-22,8,-46,12],r:[28,-24,34,10]},arms:{r:[34,-34,30,-26],l:[-30,-22,-30,-4]}})
   +`<circle cx="272" cy="208" r="10" fill="${C.skinN}"/><ellipse cx="272" cy="208" rx="8" ry="7" fill="${C.purple}" opacity=".9"/>`,'Es batu dibungkus kain')},
 {t:'Tempelkan pada memar',x:'Tempelkan kompres dingin pada area memar untuk mengurangi bengkak dan nyeri.',who:'nusa',say:'Dingin! Tapi nyerinya mulai berkurang.',
  svg:()=>svgWrap(park()+shadow(215,251,30)+shadow(290,252,46)
   +kid({who:'tara',x:215,y:203,tr:22,face:'smile',arms:{r:[34,-36,45.5,-13]}})
   +kid({who:'nusa',x:290,y:232,flip:true,cape:false,face:'smile',legs:{l:[-22,8,-46,12],r:[28,-24,34,10]},arms:{r:[34,-34,30,-26],l:[-30,-22,-30,-4]}})
   +`<g>${pack(262,205,1,-12)}${MV([[0,0],[0,-2],[0,0]],1.2)}</g>`+flake(250,186,1,0)+flake(276,182,.8,.7)+label(330,118,'Kompres dingin',C.sun),'Tara menempelkan kompres dingin pada lutut Nusa')}
 ]};
/* ===== Skenario 4-7: Kondisi Khusus & Darurat ===== */
const tree=(x)=>`<rect x="${x-9}" y="120" width="18" height="132" rx="6" fill="${C.woodD}" ${ST}/><circle cx="${x}" cy="104" r="52" fill="#4FC07B" ${ST}/><circle cx="${x-40}" cy="128" r="32" fill="#5FCD8A" ${ST}/><circle cx="${x+40}" cy="128" r="32" fill="#5FCD8A" ${ST}/>`;
const shade=(x,w)=>`<ellipse cx="${x}" cy="253" rx="${w}" ry="9" fill="${C.groundD}" opacity=".75"/>`;
const lying=(f,legs)=>kid({who:'nusa',x:230,y:232,r:-90,cape:false,face:f,legs:legs});

const PINGSAN={id:'pingsan',cat:2,title:'Pingsan',tag:'Pingsan',color:'#DCF1FF',
 summary:'Baringkan di tempat teduh, kaki lebih tinggi dari kepala, longgarkan kerah, jangan beri minum.',
 thumb:2,
 note:{t:'Kalau tidak sadar lebih dari 1 menit atau sulit bernapas, segera panggil orang dewasa dan hubungi 112.',warn:true},
 steps:[
 {t:'Kenali tanda pingsan',x:'Wajah pucat, badan lemas, pandangan gelap, lalu hilang kesadaran.',who:'tara',say:'Nusa pucat dan lemas. Dia hampir pingsan, ayo kita bantu!',
  svg:()=>svgWrap(park()+shadow(190,251,30)+shadow(90,251,30)
   +kid({who:'tara',x:90,y:203,face:'o',bob:true,arms:{l:[-34,-56,-38,-80],r:[34,-56,38,-80]}})
   +`<g>${kid({who:'nusa',x:190,y:203,face:'closed',hr:8,cape:false})}${R([-4,4,-4],190,250,2)}</g>`
   +`<g>${[0,120,240].map(a=>star(190+34*Math.cos(a*Math.PI/180),127+34*Math.sin(a*Math.PI/180),7)).join('')}${R([0,360],190,127,3)}</g>`+label(190,56,'Pingsan',C.sun),'Nusa pusing dengan bintang berputar')},
 {t:'Baringkan di tempat teduh',x:'Pindahkan ke tempat teduh dan sejuk, lalu baringkan dengan hati-hati.',who:'tara',say:'Kita baringkan Nusa di bawah pohon yang teduh.',
  svg:()=>svgWrap(park()+shade(135,115)+tree(100)+lying('closed',{l:[-2,22,-2,42],r:[2,22,2,42]})
   +kid({who:'tara',x:345,y:203,flip:true,face:'smile',bob:true,arms:{r:[34,-56,52,-76]}})+label(200,40,'Tempat teduh',C.sun),'Nusa berbaring di bawah pohon')},
 {t:'Naikkan kaki',x:'Ganjal kedua kaki dengan tas agar lebih tinggi dari kepala.',who:'tara',say:'Kakinya kuganjal tas, supaya darah mengalir lancar ke kepala.',
  svg:()=>svgWrap(park()+shade(135,115)+tree(100)
   +`<rect x="244" y="224" width="46" height="26" rx="9" fill="${C.orange}" ${ST}/><rect x="254" y="232" width="26" height="11" rx="4" fill="#FFD98A" stroke="${C.ink}" stroke-width="1.6"/>`
   +lying('closed',{l:[7,22,14,44],r:[9,22,15,44]})
   +`<path d="M312 232V200" stroke="${C.red}" stroke-width="5" stroke-linecap="round">${MV([[0,0],[0,-5],[0,0]],1)}</path><path d="M303 208L312 196L321 208" stroke="${C.red}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round">${MV([[0,0],[0,-5],[0,0]],1)}</path>`
   +kid({who:'tara',x:372,y:203,flip:true,face:'cheer',bob:true})+label(330,84,'Kaki lebih tinggi',C.sun)+label(150,196,'Kepala lebih rendah','#fff'),'Kaki Nusa diganjal tas')},
 {t:'Longgarkan kerah, jangan beri minum',x:'Longgarkan pakaian atau kerah. Jangan beri minum selama belum sadar.',who:'tara',say:'Kerahnya kulonggarkan. Minum nanti saja kalau sudah sadar penuh.',
  svg:()=>svgWrap(park()+shade(135,115)+tree(100)
   +`<rect x="244" y="224" width="46" height="26" rx="9" fill="${C.orange}" ${ST}/>`
   +lying('closed',{l:[7,22,14,44],r:[9,22,15,44]})
   +kid({who:'tara',x:118,y:203,tr:40,face:'smile',arms:{r:[44,-40,61.5,-13.8]}})+label(130,60,'Longgarkan kerah',C.sun)
   +`<g><path d="M312 150h36l-5 40a8 8 0 0 1-8 7h-10a8 8 0 0 1-8-7z" fill="#E8F7FF" ${ST}/><path d="M315 168h30l-2 22a6 6 0 0 1-6 5h-14a6 6 0 0 1-6-5z" fill="${C.water}"/></g>`+noSign(330,172,38)+label(330,232,'Jangan beri minum','#FFE9E9',C.red),'Kerah dilonggarkan, gelas dicoret')}
 ]};

const TERSEDAK={id:'tersedak',cat:2,title:'Tersedak',tag:'Tersedak',color:'#DCF1FF',
 summary:'Kenali tanda tersedak, lalu bantu dengan tepukan punggung atau hentakan perut.',
 thumb:2,
 note:{t:'Segera teriak minta tolong guru atau orang dewasa. Bantuan ini sebaiknya dilakukan penolong yang sudah dilatih. Bayi dan anak kecil perlu penanganan orang dewasa terlatih.',warn:true},
 steps:[
 {t:'Kenali tanda tersedak',x:'Tangan memegang leher, sulit bicara, batuk, wajah tegang atau membiru.',who:'tara',say:'Tangan Nusa memegang leher! Dia tersedak, panggil guru!',
  svg:()=>svgWrap(park()+shadow(190,251,30)+shadow(310,251,30)
   +kid({who:'nusa',x:190,y:203,face:'o',cape:false,arms:{l:[-26,-46,-5,-55],r:[26,-46,5,-55]},bob:true})
   +[-1,0,1].map(i=>`<path d="M${190+i*26} 112L${190+i*34} 100" stroke="${C.red}" stroke-width="4" stroke-linecap="round" opacity="0">${A('opacity','0;1;0',1,Math.abs(i)*.3)}</path>`).join('')
   +kid({who:'tara',x:310,y:203,flip:true,face:'o',arms:{r:[36,-56,50,-72]}})+label(190,52,'Tangan memegang leher',C.sun),'Nusa memegang lehernya')},
 {t:'Tepukan punggung (Back Blows)',x:'Condongkan badan ke depan, lalu tepuk punggung di antara tulang belikat dengan pangkal telapak tangan.',who:'tara',say:'Badan condong ke depan ya. Aku tepuk punggungmu beberapa kali.',
  svg:()=>svgWrap(park()+shadow(258,251,30)+shadow(200,251,30)
   +kid({who:'nusa',x:258,y:203,tr:28,hr:6,cape:false,face:'o',arms:{r:[26,-30,10,-18],l:[-26,-30,-10,-18]}})
   +kid({who:'tara',x:200,y:203,face:'cheer',arms:{r:[40,-54,62,-44]},aR:MV([[0,0],[-9,0],[0,0]],.5)})
   +`<g transform="translate(274 158)" opacity="0">${star(0,0,10,C.sun)}${A('opacity','0;1;0',.5)}</g>`
   +`<circle cx="290" cy="150" r="5.5" fill="${C.orange}" stroke="${C.ink}" stroke-width="1.6" opacity="0">${MV([[0,0],[44,16]],1.5)}${A('opacity','0;0;1;0',1.5)}</circle>`
   +label(230,52,'Tepukan punggung 5x',C.sun)+txt(345,200,'Pok! Pok!',18,C.red),'Tara menepuk punggung Nusa')},
 {t:'Hentakan perut (Heimlich)',x:'Berdiri di belakang, lingkarkan tangan di perut, lalu hentak ke arah dalam dan atas.',who:'tara',say:'Aku peluk dari belakang, lalu hentak ke atas. Semoga cepat keluar!',
  svg:()=>svgWrap(park()+shadow(200,251,34)+shadow(232,251,26)
   +kid({who:'tara',x:200,y:203,s:1.1,face:'worry'})
   +`<g>${kid({who:'nusa',x:232,y:208,s:.9,face:'o',cape:false,arms:{l:[-26,-30,-14,-18],r:[26,-30,14,-18]}})}${MV([[0,0],[2,-3],[0,0]],.9)}</g>`
   +`<g><path d="M182 155L188 178L226 190" stroke="${C.blue}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M218 155L222 176L238 190" stroke="${C.blue}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M200 183L226 190" stroke="${C.skinT}" stroke-width="8" stroke-linecap="round"/><circle cx="232" cy="190" r="7.5" fill="${C.skinT}" ${ST}/>${MV([[0,0],[6,-9],[0,0]],.9)}</g>`
   +`<path d="M276 212Q300 196 280 168" stroke="${C.red}" stroke-width="5" fill="none" stroke-linecap="round">${A('stroke-opacity','1;.4;1',.9)}</path><path d="M270 176L280 166L289 178" stroke="${C.red}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
   +`<circle cx="232" cy="152" r="5.5" fill="${C.orange}" stroke="${C.ink}" stroke-width="1.6" opacity="0">${MV([[0,0],[70,-34]],1.4)}${A('opacity','0;1;1;0',1.4)}</circle>`
   +label(335,64,'Dari belakang',C.sun)+label(335,92,'Hentak ke atas',C.sun),'Tara melakukan hentakan perut pada Nusa')}
 ]};

const BAKAR={id:'bakar',cat:2,title:'Luka Bakar Ringan',tag:'Luka bakar',color:'#DCF1FF',
 summary:'Siram dengan air mengalir 10–15 menit. Mitos Alert: jangan diberi pasta gigi!',
 thumb:1,
 note:{t:'Jika lepuh besar, luka bakar luas, atau di wajah dan tangan, segera minta tolong orang dewasa untuk ke tenaga kesehatan.',warn:true},
 steps:[
 {t:'Terkena air panas atau api',x:'Kulit memerah, perih, dan terasa panas. Jauhkan dari sumber panas.',who:'tara',say:'Ouch, panas! Jauhi airnya dulu, ya.',
  svg:()=>svgWrap(uks()+shadow(180,251,30)+shadow(80,251,30)
   +`<rect x="276" y="196" width="112" height="9" rx="4" fill="${C.wood}" ${ST}/><rect x="286" y="205" width="8" height="45" fill="${C.woodD}"/><rect x="370" y="205" width="8" height="45" fill="${C.woodD}"/>`
   +`<g transform="translate(330 186) rotate(-62)"><rect x="-14" y="-18" width="28" height="30" rx="6" fill="#fff" ${ST}/><path d="M14 -10q12 2 10 12q-2 6 -10 6" stroke="${C.ink}" stroke-width="3" fill="none"/></g>`
   +[0,1,2].map(i=>`<circle cx="${318+i*10}" cy="168" r="6" fill="#fff" opacity="0" stroke="${C.wallD}" stroke-width="2">${MV([[0,0],[0,-30]],1.8,i*.5)}${A('opacity','0;.9;0',1.8,i*.5)}</circle>`).join('')
   +kid({who:'nusa',x:180,y:203,face:'pain',cape:false,arms:{r:SINK_ARM}})+`<circle cx="236" cy="145" r="10" fill="${C.red}" opacity=".55">${A('r','8;13;8',1)}</circle>`
   +kid({who:'tara',x:80,y:203,face:'o',bob:true,arms:{r:[34,-58,38,-82]}})+bang(180,64),'Nusa terkena air panas, tangannya memerah')},
 {t:'Siram dengan air mengalir',x:'Alirkan air bersih pada bagian yang terbakar selama 10–15 menit.',who:'nusa',say:'Airnya dingin dan mengalir. Perihnya mulai reda.',
  svg:()=>svgWrap(uks()+basin(197,182)+shadow(150,251,30)+shadow(310,251,30)+nusaSink('smile')
   +`<ellipse cx="196" cy="152" rx="10" ry="5" fill="${C.red}" opacity=".6" transform="rotate(-35 196 152)"/>`
   +tapAt(197,62)+stream(197,84,148)+splash(197,156)+kid({who:'tara',x:310,y:203,flip:true,face:'cheer',bob:true,arms:{r:[34,-56,52,-76]}})
   +clock(352,70,32,'10–15 menit'),'Nusa mengalirkan air pada tangan, jam berputar')},
 {t:'Mitos Alert: jangan pasta gigi!',x:'Jangan oleskan pasta gigi, mentega, atau kecap pada luka bakar. Bisa membuat luka kotor dan infeksi.',who:'tara',say:'Awas mitos! Pasta gigi bukan obat luka bakar.',
  svg:()=>svgWrap(uks()+shadow(70,251,30)+shadow(350,251,30)
   +`<g transform="translate(210 168) rotate(-12)"><rect x="-70" y="-14" width="12" height="28" rx="3" fill="#E8EEF4" ${ST}/><rect x="-60" y="-19" width="100" height="38" rx="10" fill="#fff" ${ST}/><rect x="-44" y="-8" width="74" height="16" rx="6" fill="${C.sky}"/>${txt(-7,5,'PASTA GIGI',12,'#fff')}<rect x="40" y="-9" width="18" height="18" rx="4" fill="${C.blue}" ${ST}/></g>`
   +noSign(210,168,72)+label(210,52,'MITOS ALERT!',C.red,'#fff')
   +kid({who:'tara',x:70,y:203,face:'worry',arms:{r:[34,-60,30,-84]},aR:R([0,-18,18,0],16,-44,.8)})
   +kid({who:'nusa',x:350,y:203,flip:true,cape:false,face:'smile',hA:R([-7,7,-7],0,-56,.8)}),'Pasta gigi dicoret tanda larangan')}
 ]};

const SERANGGA={id:'serangga',cat:2,title:'Gigitan / Sengatan Serangga',tag:'Sengatan serangga',color:'#DCF1FF',
 summary:'Cuci area sengatan, lepas sengat hati-hati, lalu kompres dingin.',
 thumb:3,
 note:{t:'Segera minta tolong orang dewasa jika bengkak menyebar, wajah atau bibir bengkak, atau sulit bernapas.',warn:true},
 steps:[
 {t:'Kenali sengatan',x:'Terasa perih dan muncul benjolan merah di kulit setelah disengat serangga.',who:'tara',say:'Lenganmu disengat lebah! Jangan dikejar ya, lebahnya sudah pergi.',
  svg:()=>svgWrap(park()+shadow(200,251,30)+shadow(90,251,30)
   +kid({who:'nusa',x:200,y:203,face:'pain',cape:false,arms:{r:SINK_ARM}})
   +`<circle cx="246" cy="152" r="8" fill="#F2766F" stroke="#B83A3A" stroke-width="1.6"/><circle cx="246" cy="152" r="2.6" fill="#fff"/>`
   +`<g>${bee(292,104,1.2)}${MV([[0,0],[18,-10],[-6,-18],[24,-6],[0,0]],3)}</g>`
   +kid({who:'tara',x:90,y:203,face:'worry',bob:true,arms:{r:[34,-56,52,-70]}})+bang(200,64),'Nusa disengat lebah')},
 {t:'Cuci area sengatan',x:'Cuci bekas sengatan dengan air mengalir dan sabun.',who:'nusa',say:'Kucuci pelan-pelan dengan sabun dan air bersih.',
  svg:()=>svgWrap(uks()+basin(197,182)+shadow(150,251,30)+shadow(310,251,30)+nusaSink('smile')
   +`<circle cx="196" cy="152" r="7" fill="#F2766F" stroke="#B83A3A" stroke-width="1.4"/>`+tapAt(197,62)+stream(197,84,148)+splash(197,156)
   +[0,1,2,3].map(i=>`<circle cx="${178+i*13}" cy="140" r="${3+i%2*2}" fill="#fff" stroke="${C.waterD}" stroke-width="1.4" opacity="0">${MV([[0,0],[0,-26]],1.6,i*.4)}${A('opacity','0;1;0',1.6,i*.4)}</circle>`).join('')
   +kid({who:'tara',x:310,y:203,flip:true,face:'cheer',bob:true})+label(318,100,'Sabun + air',C.sun),'Nusa mencuci bekas sengatan')},
 {t:'Lepas sengat hati-hati',x:'Jika ada sengat yang tertinggal, kerok pelan dengan tepi kartu. Jangan dipencet atau dicabut dengan jari.',who:'tara',say:'Kerok pelan dengan tepi kartu, jangan dipencet ya.',
  svg:()=>svgWrap(uks()+shadow(150,251,30)+shadow(235,251,30)+nusaSink('smile')
   +`<circle cx="196" cy="152" r="7" fill="#F2766F" stroke="#B83A3A" stroke-width="1.4"/>`
   +kid({who:'tara',x:235,y:203,flip:true,face:'smile',arms:{r:[28,-48,39,-51]}})
   +`<g transform="translate(196 152) rotate(-20)"><rect x="-14" y="-3" width="28" height="6" rx="1.5" fill="#fff" ${ST}>${MV([[0,0],[-6,0],[0,0]],1.2)}</rect></g>`
   +`<path d="M203 146L300 70M203 158L300 130" stroke="${C.wallD}" stroke-width="3" stroke-dasharray="6 6"/>`
   +`<circle cx="350" cy="100" r="54" fill="#F6D2B0" stroke="${C.ink}" stroke-width="3.5"/><ellipse cx="350" cy="108" rx="34" ry="22" fill="#F2766F" stroke="#B83A3A" stroke-width="2"/><path d="M350 100V86" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/><circle cx="350" cy="84" r="2.6" fill="${C.ink}"/>`
   +`<g><rect x="318" y="76" width="68" height="9" rx="2" fill="#fff" ${ST} transform="rotate(8 350 80)">${MV([[-6,0],[10,0],[-6,0]],1.6)}</rect></g>`
   +label(350,176,'Kerok pelan-pelan',C.sun),'Tara mengerok sengat dengan tepi kartu')},
 {t:'Kompres dingin',x:'Tempelkan kompres dingin berbalut kain untuk mengurangi bengkak dan rasa gatal atau nyeri.',who:'tara',say:'Dingin ya! Bengkaknya akan berkurang.',
  svg:()=>svgWrap(uks()+shadow(150,251,30)+shadow(235,251,30)+nusaSink('cheer')
   +`<g>${pack(196,152,.8,-35)}${MV([[0,0],[0,-2],[0,0]],1.2)}</g>`
   +kid({who:'tara',x:235,y:203,flip:true,face:'cheer',bob:true,arms:{r:[28,-48,39,-51]}})
   +flake(184,128,1,0)+flake(214,124,.8,.7)+check(335,100)+label(335,150,'Sudah lebih nyaman',C.sun),'Kompres dingin pada lengan Nusa')}
 ]};

const SCENES=[MIMISAN,LECET,MEMAR,PINGSAN,TERSEDAK,BAKAR,SERANGGA];
/* ===== UI ===== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const REDUCED=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const settle=(svg,t,pause)=>{try{svg.setCurrentTime(t);if(pause)svg.pauseAnimations()}catch(e){}};

/* Avatar wajah */
const faceSvg=(who,mood)=>`<svg viewBox="-34 -106 68 64" aria-hidden="true">${kid({who,face:mood||'smile',capeAnim:false})}</svg>`;
$$('[data-face]').forEach(el=>{el.innerHTML=faceSvg(el.dataset.face,'cheer')});

/* Hero */
(function(){
  const art=`<svg viewBox="0 0 460 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="230" cy="205" r="178" fill="#fff" opacity=".85"/><circle cx="230" cy="205" r="178" fill="none" stroke="${C.ink}" stroke-width="4"/>
  <ellipse cx="230" cy="372" rx="150" ry="10" fill="#000" opacity=".12"/>
  ${kid({who:'nusa',x:160,y:312,s:1.45,face:'cheer',bob:true,arms:{r:[36,-62,42,-88]},aR:R([0,-24,0,-24,0],16,-44,1.3)})}
  ${kid({who:'tara',x:312,y:312,s:1.45,face:'cheer',bob:true,arms:{l:[-36,-62,-42,-88]},aL:R([0,24,0,24,0],-16,-44,1.3,.3)})}
  <g transform="translate(66 96)">${pack(0,0,.9,-10)}${MV([[0,0],[0,-8],[0,0]],2.6)}</g>
  <g transform="translate(398 110)"><path d="M0 -16C10 -4 14 4 14 10A14 14 0 0 1 -14 10C-14 4 -10 -4 0 -16Z" fill="${C.water}" stroke="${C.ink}" stroke-width="2.6"/>${MV([[0,0],[0,-9],[0,0]],2.2,.4)}</g>
  <g transform="translate(86 300)"><rect x="-22" y="-8" width="44" height="16" rx="6" fill="#F6C9A0" stroke="${C.ink}" stroke-width="2.4" transform="rotate(-25)"/>${MV([[0,0],[0,-7],[0,0]],2.4,.8)}</g>
  <g transform="translate(392 300)"><circle r="17" fill="#fff" stroke="${C.ink}" stroke-width="2.6"/><path d="M-2.8 -9H2.8V-2.8H9V2.8H2.8V9H-2.8V2.8H-9V-2.8H-2.8Z" fill="${C.green}"/>${MV([[0,0],[0,-8],[0,0]],2.8,.2)}</g>
  ${sparkle(230,48,0)}${sparkle(112,200,.6)}${sparkle(352,196,1)}
  </svg>`;
  const box=$('#heroArt');box.innerHTML=art;
  if(REDUCED)settle(box.firstElementChild,.7,true);
})();

/* Kartu materi */
(function(){
  const card=s=>{
    const n=s.steps.length;
    return `<article class="card" data-id="${s.id}">
      <div class="thumb">${s.steps[s.thumb].svg()}</div>
      <div class="card-body">
        <span class="chip" style="background:${s.color}">${n} langkah · animasi</span>
        <h3 class="font-bold">${s.title}</h3>
        <p>${s.summary}</p>
        <div class="mt-auto pt-3"><button class="btn btn-sm btn-ghost" data-open="${s.id}" aria-label="Lihat peragaan ${s.title}">▶ Lihat peragaan</button></div>
      </div></article>`;
  };
  $('#grid1').innerHTML=SCENES.filter(s=>s.cat===1).map(card).join('');
  $('#grid2').innerHTML=SCENES.filter(s=>s.cat===2).map(card).join('');
  $$('.card').forEach(c=>{
    const svg=$('.thumb svg',c); settle(svg,.7,true);
    c.addEventListener('pointerenter',()=>{if(!REDUCED)svg.unpauseAnimations()});
    c.addEventListener('pointerleave',()=>{svg.pauseAnimations()});
    c.addEventListener('click',e=>{openModal(c.dataset.id,$('[data-open]',c))});
  });
})();

/* Modal peragaan */
const M={el:$('#modal'),stage:$('#stage'),S:null,i:0,playing:true,el_ms:0,timer:null,last:null};
const STEP_MS=5200;
const ICON_PAUSE='<svg viewBox="0 0 24 24" fill="#16324A"><rect x="5" y="4" width="5" height="16" rx="1.5"/><rect x="14" y="4" width="5" height="16" rx="1.5"/></svg>';
const ICON_PLAY='<svg viewBox="0 0 24 24" fill="#16324A"><path d="M7 4v16l13-8z"/></svg>';
function setPlayUi(){const b=$('#bPlay');b.innerHTML=M.playing?ICON_PAUSE:ICON_PLAY;b.setAttribute('aria-label',M.playing?'Jeda animasi':'Putar animasi')}
function showStep(i){
  const S=M.S, st=S.steps[i]; M.i=i; M.el_ms=0; $('#bFill').style.width='0%';
  M.stage.innerHTML=st.svg(); const svg=M.stage.firstElementChild; settle(svg,.7,!M.playing);
  M.stage.setAttribute('aria-label',svg.getAttribute('aria-label'));
  $('#mStepNo').textContent=`Langkah ${i+1} dari ${S.steps.length}`;
  $('#mStepTitle').textContent=st.t; $('#mStepText').textContent=st.x;
  $('#mSay').textContent=(st.who==='tara'?'Tara: ':'Nusa: ')+st.say;
  $('#mWho').innerHTML=faceSvg(st.who,'cheer');
  $('#mRange').value=i+1;
  $$('#mDots .dot').forEach((d,k)=>d.setAttribute('aria-current',k===i?'true':'false'));
  $('#bPrev').disabled=i===0; $('#bNext').disabled=i===S.steps.length-1;
}
function tick(){
  if(!M.playing)return; M.el_ms+=100; $('#bFill').style.width=Math.min(100,M.el_ms/STEP_MS*100)+'%';
  if(M.el_ms>=STEP_MS) showStep((M.i+1)%M.S.steps.length);
}
function togglePlay(force){
  M.playing=typeof force==='boolean'?force:!M.playing; setPlayUi();
  const svg=M.stage.firstElementChild; if(svg){M.playing?svg.unpauseAnimations():svg.pauseAnimations()}
}
function openModal(id,trigger){
  const S=SCENES.find(s=>s.id===id); M.S=S; M.last=trigger||document.activeElement;
  $('#mTitle').textContent=S.title; const cat=$('#mCat'); cat.textContent=S.cat===1?'Pendarahan & Luka':'Kondisi Khusus & Darurat'; cat.style.background=S.color;
  $('#mHead').style.background=S.color;
  const r=$('#mRange'); r.max=S.steps.length;
  $('#mDots').innerHTML=S.steps.map((s,k)=>`<button type="button" class="dot" data-k="${k}" aria-label="Langkah ${k+1}: ${s.t}">${k+1}</button>`).join('');
  const n=$('#mNote'); n.hidden=!S.note; if(S.note){n.className='note'+(S.note.warn?' warn':'');n.innerHTML='<strong>Ingat!</strong> '+S.note.t}
  M.playing=!REDUCED; setPlayUi();
  M.el.hidden=false; document.body.style.overflow='hidden'; showStep(0);
  clearInterval(M.timer); M.timer=setInterval(tick,100);
  $('#mClose').focus();
}
function closeModal(){
  M.el.hidden=true; document.body.style.overflow=''; clearInterval(M.timer); M.stage.innerHTML='';
  if(M.last&&M.last.focus)M.last.focus();
}
$('#mClose').addEventListener('click',closeModal);
M.el.addEventListener('click',e=>{if(e.target===M.el)closeModal()});
$('#bPlay').addEventListener('click',()=>togglePlay());
$('#bPrev').addEventListener('click',()=>showStep(Math.max(0,M.i-1)));
$('#bNext').addEventListener('click',()=>showStep(Math.min(M.S.steps.length-1,M.i+1)));
$('#mRange').addEventListener('input',e=>showStep(+e.target.value-1));
$('#mDots').addEventListener('click',e=>{const b=e.target.closest('.dot');if(b)showStep(+b.dataset.k)});
document.addEventListener('keydown',e=>{
  if(M.el.hidden)return;
  if(e.key==='Escape'){closeModal();return}
  if(e.key==='ArrowRight'&&document.activeElement.id!=='mRange'){showStep(Math.min(M.S.steps.length-1,M.i+1))}
  if(e.key==='ArrowLeft'&&document.activeElement.id!=='mRange'){showStep(Math.max(0,M.i-1))}
  if(e.key==='Tab'){
    const f=$$('button:not([disabled]),input',M.el).filter(x=>x.offsetParent!==null); if(!f.length)return;
    const a=f[0],b=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();b.focus()}
    else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a.focus()}
  }
});

/* Quiz */
const QUIZ=[
 {q:'Hidungmu berdarah. Posisi duduk yang benar adalah...',o:['Menengadah ke atas','Duduk agak membungkuk ke depan','Berbaring telentang','Berlari agar darah cepat berhenti'],a:1,e:'Membungkuk ke depan membuat darah keluar dan tidak tertelan. Menengadah justru berisiko.'},
 {q:'Berapa lama cuping hidung ditekan saat mimisan?',o:['Sekitar 10 detik','1 jam penuh','5–10 menit','Tidak perlu ditekan'],a:2,e:'Tekan cuping hidung 5–10 menit sambil bernapas lewat mulut.'},
 {q:'Langkah pertama pada luka lecet adalah...',o:['Langsung ditempel plester','Dibersihkan dengan air mengalir','Ditiup lalu dibiarkan kotor','Dioles pasta gigi'],a:1,e:'Bersihkan dulu dengan air mengalir, baru beri antiseptik dan tutup dengan plester.'},
 {q:'Cara menolong luka memar di lutut adalah...',o:['Dikompres dingin, es dibungkus kain','Dipijat dengan keras','Dikompres air panas','Ditekan dengan benda keras'],a:0,e:'Kompres dingin berbalut kain mengurangi bengkak dan nyeri. Es tidak boleh menempel langsung di kulit.'},
 {q:'Temanmu pingsan. Posisi yang benar adalah...',o:['Duduk tegak di kursi','Berbaring dengan kaki lebih rendah','Berbaring di tempat teduh, kaki lebih tinggi dari kepala','Berdiri sambil dipegangi'],a:2,e:'Kaki yang lebih tinggi membantu darah mengalir ke kepala. Longgarkan juga kerahnya.'},
 {q:'Teman yang masih pingsan boleh diberi minum?',o:['Boleh, supaya cepat sadar','Tidak boleh, bisa tersedak','Boleh, asal air hangat','Boleh, tetapi sedikit saja'],a:1,e:'Orang yang tidak sadar tidak boleh diberi minum karena air bisa masuk ke saluran napas.'},
 {q:'Apa tanda seseorang sedang tersedak?',o:['Tangan memegang leher dan sulit bicara','Tersenyum lebar','Menguap','Menggaruk kepala'],a:0,e:'Tangan memegang leher adalah tanda universal tersedak. Segera panggil orang dewasa.'},
 {q:'Hentakan perut (Heimlich) dilakukan dari posisi...',o:['Depan, sambil menarik tangan','Belakang, kedua tangan melingkar di perut','Samping, sambil menepuk kepala','Atas, sambil melompat'],a:1,e:'Penolong berdiri di belakang, tangan melingkar di perut, lalu menghentak ke arah dalam dan atas.'},
 {q:'Tanganmu terkena air panas. Tindakan yang benar adalah...',o:['Oleskan pasta gigi','Pecahkan lepuhnya','Siram air mengalir 10–15 menit','Oleskan mentega'],a:2,e:'Air mengalir mendinginkan kulit. Pasta gigi dan mentega adalah mitos yang bisa memperburuk luka.'},
 {q:'Setelah mencuci bekas sengatan dan melepas sengat dengan hati-hati, langkah berikutnya adalah...',o:['Kompres dingin','Digaruk keras','Ditusuk jarum','Dijemur di bawah matahari'],a:0,e:'Kompres dingin membantu mengurangi bengkak dan rasa gatal atau nyeri.'}
];
const QS={i:0,score:0,done:false};
const starSvg=(on)=>`<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" fill="${on?'#FFC933':'#fff'}" stroke="#16324A" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
function renderQuiz(){
  const root=$('#quiz-root');
  if(QS.i>=QUIZ.length){
    const sc=QS.score,lv=sc>=9?['Pahlawan Emas',3,'Luar biasa! Kamu siap menolong teman di sekolah.']:sc>=7?['Pahlawan Perak',2,'Hebat! Sedikit lagi kamu jadi Pahlawan Emas.']:sc>=5?['Pahlawan Perunggu',1,'Bagus! Baca kartu materi sekali lagi lalu coba lagi.']:['Pahlawan Pemula',0,'Jangan menyerah! Tonton lagi peragaan Nusa dan Tara.'];
    root.innerHTML=`<div class="p-6 md:p-9 text-center fade-in">
      <div class="who mx-auto" style="width:6rem;height:6rem">${faceSvg(sc>=7?'nusa':'tara',sc>=5?'cheer':'worry')}</div>
      <p class="mt-4 font-extrabold text-skyd">Hasil Quiz</p>
      <h3 class="text-3xl md:text-4xl font-bold">${lv[0]}</h3>
      <div class="flex justify-center gap-2 mt-3" role="img" aria-label="${lv[1]} dari 3 bintang">${[0,1,2].map(k=>starSvg(k<lv[1])).join('')}</div>
      <p class="mt-4 text-2xl disp font-bold">${sc} / ${QUIZ.length} benar</p>
      <p class="mt-1 text-inks font-semibold">${lv[2]}</p>
      <div class="mt-6 flex flex-wrap gap-3 justify-center"><button class="btn btn-sun" id="qAgain">Main lagi</button><a class="btn btn-ghost" href="#kategori">Belajar lagi</a></div></div>`;
    $('#qAgain').addEventListener('click',()=>{QS.i=0;QS.score=0;renderQuiz()});
    return;
  }
  const Q=QUIZ[QS.i], who=QS.i%2?'tara':'nusa', L='ABCD';
  root.innerHTML=`<div class="p-5 md:p-8 fade-in">
    <div class="flex items-center gap-3"><span class="font-extrabold text-sm whitespace-nowrap">Soal ${QS.i+1} / ${QUIZ.length}</span><div class="bar flex-1" role="progressbar" aria-valuemin="0" aria-valuemax="${QUIZ.length}" aria-valuenow="${QS.i}"><i style="width:${QS.i/QUIZ.length*100}%"></i></div><span class="font-extrabold text-sm whitespace-nowrap">Skor ${QS.score}</span></div>
    <div class="mt-5 flex gap-4 items-start"><div class="who" id="qWho" style="width:4rem;height:4rem">${faceSvg(who,'smile')}</div><h3 class="text-xl md:text-2xl font-bold flex-1" style="line-height:1.25">${Q.q}</h3></div>
    <div class="mt-5 grid gap-3" id="qOpts">${Q.o.map((t,k)=>`<button class="opt" data-k="${k}"><span class="l">${L[k]}</span><span>${t}</span></button>`).join('')}</div>
    <div id="qFb" class="mt-5" aria-live="polite"></div></div>`;
  $$('#qOpts .opt').forEach(b=>b.addEventListener('click',()=>{
    const k=+b.dataset.k, ok=k===Q.a; if(ok)QS.score++;
    $$('#qOpts .opt').forEach((x,j)=>{x.disabled=true;if(j===Q.a)x.classList.add('ok');else if(j===k)x.classList.add('no')});
    $('#qWho').innerHTML=faceSvg(who,ok?'cheer':'worry');
    const last=QS.i===QUIZ.length-1;
    $('#qFb').innerHTML=`<div class="note ${ok?'':'warn'} fade-in"><strong>${ok?'Benar! Kamu hebat.':'Belum tepat, tidak apa-apa.'}</strong> ${Q.e}</div><div class="mt-4 text-right"><button class="btn btn-leaf btn-sm" id="qNext">${last?'Lihat hasil':'Soal berikutnya'} →</button></div>`;
    const nb=$('#qNext'); nb.focus(); nb.addEventListener('click',()=>{QS.i++;renderQuiz()});
  }));
}
renderQuiz();

/* Navigasi */
(function(){
  const bg=$('#burger'),mob=$('#navMob');
  bg.addEventListener('click',()=>{const h=mob.hidden;mob.hidden=!h;bg.setAttribute('aria-expanded',String(h));bg.setAttribute('aria-label',h?'Tutup menu':'Buka menu')});
  $$('a',mob).forEach(a=>a.addEventListener('click',()=>{mob.hidden=true;bg.setAttribute('aria-expanded','false')}));
  const ids=['beranda','kategori','quiz','tentang'];
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){$$('.nav-link').forEach(a=>a.classList.toggle('is-on',a.getAttribute('href')==='#'+en.target.id))}}),{rootMargin:'-40% 0px -55% 0px'});
    ids.forEach(id=>{const el=document.getElementById(id);if(el)io.observe(el)});
  }
})();
