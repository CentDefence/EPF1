/* ===================== DATA ===================== */
const TEAM_COUNT = 12;
const teamColors = ['#1650d6','#2f6bff','#0e3aa8','#3d6fe0','#173d8f','#4a7dff','#0b2d7a','#2557c9','#5c8dff','#123a99','#2f5ed6','#0f2f80'];
const teams = Array.from({length:TEAM_COUNT}, (_,i)=>({
  id:i+1,
  name:'Team '+(i+1),
  short:'T'+(i+1),
  color: teamColors[i%teamColors.length],
  played:9,
  won: Math.max(1, 9 - i - (i%3)),
  draw: (i%3),
  lost: Math.max(0, i + (i%2) - 3 < 0 ? i%2 : (i+ (i%2))%4),
}));
// derive clean, consistent placeholder standings
const standings = teams.map((t,i)=>{
  const won = Math.max(0, 8 - i);
  const draw = (i%4===0)?2:1;
  const played = 9;
  const lost = played - won - draw < 0 ? 0 : played - won - draw;
  const gf = 24 - i*2 + (i%3);
  const ga = 6 + i + (i%2);
  return {
    ...t, played, won, draw, lost,
    gf: Math.max(gf,4), ga: Math.max(ga,3),
    gd: Math.max(gf,4) - Math.max(ga,3),
    pts: won*3 + draw
  };
}).sort((a,b)=> b.pts-a.pts || b.gd-a.gd);

function crest(t){ return `<div class="crest" style="background:linear-gradient(135deg, ${t.color}, #060a1c)">${t.short}</div>`; }

/* fixtures / results */
const fixtures = [];
const results = [];
for(let md=1; md<=6; md++){
  for(let m=0; m<3; m++){
    const h = teams[(md*2+m)%TEAM_COUNT];
    const a = teams[(md*2+m+5)%TEAM_COUNT];
    if(h.id===a.id) continue;
    const date = `Sep ${8+md*2}`;
    if(md<=4){
      const hg = (md+m)%5, ag=(m+2)%4;
      results.push({md, date, home:h, away:a, hg, ag});
    } else {
      const time = m===0?'15:00':(m===1?'17:30':'20:00');
      fixtures.push({md, date, home:h, away:a, time});
    }
  }
}

/* player leaderboards */
const firstNames=['A.','B.','C.','D.','E.','F.','G.','H.','I.','J.','K.','L.'];
function makePlayers(n, statLabel, base){
  return Array.from({length:n}, (_,i)=>{
    const team = teams[i%TEAM_COUNT];
    return { name:'Player '+(i+1), team, val: Math.max(1, base-i) };
  });
}
const topScorers = makePlayers(8,'goals',17);
const topAssists = makePlayers(8,'assists',13);
const topCleansheets = makePlayers(8,'cleansheets',9);

/* ===================== RENDER ===================== */
function renderTableRows(list, limit){
  return list.slice(0,limit).map((t,i)=>`
    <tr class="${i<2?'z1':(i<TEAM_COUNT-3?'':'')}">
      <td class="rank">${i+1}</td>
      <td><div class="club-cell">${crest(t)}<span>${t.name}</span></div></td>
      <td class="num">${t.played}</td>
      <td class="num">${t.won}</td>
      <td class="num">${t.draw}</td>
      <td class="num">${t.lost}</td>
      <td class="num">${t.gd>0?'+':''}${t.gd}</td>
      <td class="pts">${t.pts}</td>
    </tr>`).join('');
}
function tableHead(){
  return `<thead><tr><th></th><th>Team</th><th class="num">P</th><th class="num">W</th><th class="num">D</th><th class="num">L</th><th class="num">GD</th><th class="num">Pts</th></tr></thead>`;
}
document.getElementById('fullTable').innerHTML = tableHead() + `<tbody>${renderTableRows(standings,TEAM_COUNT)}</tbody>`;
document.getElementById('homeTable').innerHTML = tableHead() + `<tbody>${renderTableRows(standings,5)}</tbody>`;

function fixtureRow(f, played){
  return `<div class="match-row">
    <div class="date-col">${f.date}<br>${played? ('MD '+f.md) : f.time}</div>
    <div class="side">${crest(f.home)}<span>${f.home.name}</span></div>
    <div class="mid ${played?'':'vs'}">${played? f.hg+' – '+f.ag : 'VS'}</div>
    <div class="side right"><span>${f.away.name}</span>${crest(f.away)}</div>
    <div class="venue">${played?'FT':'Stadium '+f.md}</div>
  </div>`;
}

function groupByMD(list){
  const g={};
  list.forEach(f=>{ (g[f.md]=g[f.md]||[]).push(f); });
  return g;
}
function renderMatchList(target, list, played){
  const g = groupByMD(list);
  const html = Object.keys(g).sort((a,b)=>played? b-a : a-b).map(md=>`
    <div class="matchday-block">
      <div class="matchday-label">Matchday ${md}</div>
      <div class="panel">${g[md].map(f=>fixtureRow(f,played)).join('')}</div>
    </div>`).join('');
  document.getElementById(target).innerHTML = html;
}
renderMatchList('fixturesPanel', fixtures, false);
renderMatchList('resultsPanel', results, true);

/* home mini fixtures/results */
document.getElementById('homeFixtures').innerHTML = fixtures.slice(0,4).map(f=>`
  <div class="mini-row">
    <div class="mv">${f.time}</div>
    <div class="teams">
      <div class="t">${crest(f.home)}<span>${f.home.name}</span></div>
      <div class="t">${crest(f.away)}<span>${f.away.name}</span></div>
    </div>
    <div class="date">${f.date}</div>
  </div>`).join('');

document.getElementById('homeResults').innerHTML = results.slice(-4).reverse().map(f=>`
  <div class="mini-row">
    <div class="mv">FT</div>
    <div class="teams">
      <div class="t">${crest(f.home)}<span>${f.home.name}</span><span class="score">${f.hg}</span></div>
      <div class="t">${crest(f.away)}<span>${f.away.name}</span><span class="score">${f.ag}</span></div>
    </div>
    <div class="date">${f.date}</div>
  </div>`).join('');

document.getElementById('homeTopScorer').innerHTML = topScorers.slice(0,4).map((p,i)=>`
  <div class="lead-row ${i===0?'top':''}">
    <div class="lr-rank">${i+1}</div>
    <div class="lr-info"><span class="lr-name">${p.name}</span><span class="lr-team">${p.team.name}</span></div>
    <div class="lr-val">${p.val}</div>
  </div>`).join('');

/* teams grid */
document.getElementById('teamsGrid').innerHTML = teams.map(t=>{
  const s = standings.find(x=>x.id===t.id);
  return `<div class="team-card">
    ${crest(t)}
    <h3>${t.name}</h3>
    <div class="meta"><span>Position</span><b>#${standings.findIndex(x=>x.id===t.id)+1}</b></div>
    <div class="meta"><span>Points</span><b>${s.pts} PTS</b></div>
  </div>`;
}).join('');

/* stats leaderboards */
function renderLeaders(target, list){
  document.getElementById(target).innerHTML = list.map((p,i)=>`
    <div class="lead-row ${i===0?'top':''}">
      <div class="lr-rank">${i+1}</div>
      <div class="lr-info"><span class="lr-name">${p.name}</span><span class="lr-team">${p.team.name}</span></div>
      <div class="lr-val">${p.val}</div>
    </div>`).join('');
}
renderLeaders('statGoals', topScorers);
renderLeaders('statAssists', topAssists);
renderLeaders('statCleansheets', topCleansheets);

/* ===================== NAV ===================== */
const tabButtons = document.querySelectorAll('nav.tabs button');
function goTo(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+view).classList.add('active');
  tabButtons.forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  document.getElementById('tabNav').classList.remove('open');
  window.scrollTo({top:0, behavior:'smooth'});
}
tabButtons.forEach(b=> b.addEventListener('click', ()=> goTo(b.dataset.view)));
document.getElementById('menuToggle').addEventListener('click', ()=>{
  document.getElementById('tabNav').classList.toggle('open');
});

/* ===================== LOADER SEQUENCE ===================== */
const bar = document.getElementById('loaderBar');
const pct = document.getElementById('loaderPct');
let progress = 0;
const timer = setInterval(()=>{
  progress += Math.random()*14 + 6;
  if(progress >= 100){
    progress = 100;
    clearInterval(timer);
    bar.style.width='100%';
    pct.textContent='LOADING 100%';
    setTimeout(()=>{
      const loader = document.getElementById('loader');
      loader.classList.add('launch');
      document.getElementById('site').classList.add('show');
      setTimeout(()=> loader.classList.add('hide'), 550);
    }, 260);
    return;
  }
  bar.style.width = progress+'%';
  pct.textContent = 'LOADING ' + Math.floor(progress) + '%';
}, 220);