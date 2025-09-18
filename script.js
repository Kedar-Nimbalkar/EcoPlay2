/* ---------- Utilities ---------- */
const DB = {
  usersKey: 'ecoplay_users',
  quizzesKey: 'ecoplay_quizzes',
  submissionsKey: 'ecoplay_submissions',
  eventsKey: 'ecoplay_events',
  redemptionsKey: 'ecoplay_redemptions',
  videosKey: 'ecoplay_videos'
};

function nowISO(){ return new Date().toISOString(); }
function uid(prefix='id'){ return prefix + '_' + Math.random().toString(36).slice(2,9); }
function load(key, defaultVal){ try { const v=localStorage.getItem(key); return v? JSON.parse(v): defaultVal; } catch(e){ return defaultVal; } }
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

/* init basic stores */
if(!load(DB.usersKey, null)){
  save(DB.usersKey, [{
    id: uid('u'),
    username: 'demo_student',
    name: 'Demo Student',
    createdAt: nowISO(),
    points: 120,
    badges: ['Bronze Sapling'],
    submissions: [],
    quizzesTaken: [],
    joinedEvents: []
  }]);
}
if(!load(DB.quizzesKey, null)){
  save(DB.quizzesKey, [
    {
      id: uid('q'),
      title: "Plant Care Basics",
      description: "Quick 5-question quiz about watering & planting.",
      questions: [
        { q: "How often should most new saplings be watered?", options: ["Daily","Once a week","Once a month","Never"], a:0, points:10 },
        { q: "Which season is often best to plant trees in many regions?", options:["Summer","Winter","Monsoon/Autumn","Spring"], a:3, points:10 },
        { q: "What is compost used for?", options:["Fuel","Fertilizer","Shoelace","Clothing"], a:1, points:10 },
        { q: "Mulching helps:", options:["Retain moisture","Remove soil","Attract pests","Kill roots"], a:0, points:5 },
        { q: "Which tool is safest for small tree planting?", options:["Chainsaw","Shovel","Hammer","Blowtorch"], a:1, points:5 }
      ],
      createdAt: nowISO()
    }
  ]);
}
if(!load(DB.submissionsKey, null)) save(DB.submissionsKey, []);
if(!load(DB.eventsKey, null)) save(DB.eventsKey, []);
if(!load(DB.redemptionsKey, null)) save(DB.redemptionsKey, []);
if(!load(DB.videosKey, null)) save(DB.videosKey, []);

/* ---------- App State ---------- */
const AppState = {
  currentUser: null,
  isAdmin: false
};

/* ---------- DOM helpers ---------- */
const root = document.getElementById('app');
const navLinks = document.querySelectorAll('.nav-link');
const currentUserDisplay = document.getElementById('currentUserDisplay');
const authBtn = document.getElementById('authBtn');
document.getElementById('year').innerText = new Date().getFullYear();

/* ---------- Modal helpers ---------- */
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
function showModal(html){ modalContent.innerHTML = html; modal.classList.remove('hidden'); }
function closeModal(){ modal.classList.add('hidden'); modalContent.innerHTML=''; }
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

/* ---------- Routing ---------- */
function clearActiveNav(){ navLinks.forEach(a=>a.classList.remove('active')); }
navLinks.forEach(a=>{
  a.addEventListener('click', (ev)=>{
    ev.preventDefault();
    const route = a.getAttribute('data-route');
    routeTo(route);
  });
});

function routeTo(route){
  clearActiveNav();
  const link = document.querySelector(`[data-route="${route}"]`);
  if(link) link.classList.add('active');

  switch(route){
    case 'home': renderHome(); break;
    case 'games': renderGames(); break;
    case 'redeem': renderRedeem(); break;
    case 'about': renderAbout(); break;
    case 'contact': renderContact(); break;
    case 'profile': renderProfile(); break;
    case 'admin': renderAdmin(); break;
    case 'videos': renderVideos(); break;
    default: renderHome();
  }
}

/* ---------- Video Feature ---------- */
function getVideos(){ return load(DB.videosKey, []); }
function saveVideos(v){ save(DB.videosKey, v); }

function renderVideos(){
  const videos = getVideos();
  root.innerHTML = `
    <div class="container">
      <h2>Educational Videos</h2>
      ${AppState.isAdmin ? `
        <div class="form-row">
          <label>Video Title</label>
          <input id="vidTitle" placeholder="Title"/>
        </div>
        <div class="form-row">
          <label>Video URL (YouTube / MP4 link)</label>
          <input id="vidURL" placeholder="https://"/>
        </div>
        <div style="text-align:right"><button class="btn" id="addVideoBtn">Add Video</button></div>
        <hr/>
      ` : ''}
      <div class="video-list">
        ${videos.length? videos.map(v=>`
          <div class="video-card">
            <h4>${v.title}</h4>
            <video width="320" height="240" controls>
              <source src="${v.url}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        `).join('') : '<div class="muted">No videos uploaded yet.</div>'}
      </div>
    </div>
  `;

  if(AppState.isAdmin){
    document.getElementById('addVideoBtn').addEventListener('click', ()=>{
      const title = document.getElementById('vidTitle').value.trim();
      const url = document.getElementById('vidURL').value.trim();
      if(!title || !url){ alert('Provide both title and URL'); return; }
      const videos = getVideos();
      videos.push({ id: uid('vid'), title, url, createdAt: nowISO() });
      saveVideos(videos);
      alert('Video added successfully!');
      renderVideos();
    });
  }
}

/* ---------- Dummy Page Renderers ---------- */
function renderHome(){ root.innerHTML=`<div class="container"><h2>Welcome to EcoPlay</h2><p>Navigate using the menu above.</p></div>`; }
function renderGames(){ root.innerHTML=`<div class="container"><h2>Games</h2><p>Play eco-friendly quizzes and challenges here.</p></div>`; }
function renderRedeem(){ root.innerHTML=`<div class="container"><h2>Redeem</h2><p>Redeem your points for eco-goodies.</p></div>`; }
function renderAbout(){ root.innerHTML=`<div class="container"><h2>About EcoPlay</h2><p>A gamified platform to learn and practice environmental awareness.</p></div>`; }
function renderContact(){ root.innerHTML=`<div class="container"><h2>Contact Us</h2><p>Email: support@ecoplay.org</p></div>`; }
function renderProfile(){ root.innerHTML=`<div class="container"><h2>Profile</h2><p>Manage your EcoPlay account.</p></div>`; }
function renderAdmin(){ root.innerHTML=`<div class="container"><h2>Admin Panel</h2><p>Admins can manage quizzes, events, and videos here.</p></div>`; }

/* ---------- Auth ---------- */
const currentUserDisplay = document.getElementById('currentUserDisplay');
const authBtn = document.getElementById('authBtn');

authBtn.addEventListener('click', ()=>{
  if(AppState.currentUser){ AppState.currentUser=null; AppState.isAdmin=false; updateAuthUI(); routeTo('home'); }
  else signInUI();
});

function signInUI(){
  showModal(`
    <h3>Sign in / Register</h3>
    <div class="form-row"><label>Username</label><input id="mi_username" placeholder="username"/></div>
    <div class="form-row"><label>Full name</label><input id="mi_name" placeholder="Full name"/></div>
    <div style="text-align:right"><button id="doSign" class="btn">Sign In / Register</button></div>
  `);
  setTimeout(()=>{
    document.getElementById('doSign').addEventListener('click', ()=>{
      const username = document.getElementById('mi_username').value.trim();
      const name = document.getElementById('mi_name').value.trim() || username;
      if(!username){ alert('Enter username'); return; }
      let users = load(DB.usersKey, []);
      let user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      if(!user){
        user = { id: uid('u'), username, name, createdAt: nowISO(), points:0, badges:[], submissions:[], quizzesTaken:[], joinedEvents:[] };
        users.push(user); save(DB.usersKey, users);
      }
      AppState.currentUser = user; AppState.isAdmin = (username.toLowerCase()==='admin'); 
      updateAuthUI(); closeModal(); routeTo('home');
    });
  },50);
}

function updateAuthUI(){
  if(AppState.currentUser){
    currentUserDisplay.innerText = AppState.currentUser.name + ' (' + AppState.currentUser.points + ' pts)';
    authBtn.innerText = 'Sign out';
  } else {
    currentUserDisplay.innerText = 'Not signed in';
    authBtn.innerText = 'Sign in';
  }
}

/* ---------- Init ---------- */
updateAuthUI();
routeTo('home');
