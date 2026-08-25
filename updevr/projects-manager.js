/**
 * Uttham Portfolio - Dynamic Projects & CMS Cloud Manager
 * Hybrid Engine: Firebase Firestore Real-Time Cloud DB + Local Storage Fallback
 */

const STORAGE_KEY = 'uttham_portfolio_projects_v1';
let firestoreDb = null;

// Initialize Firebase if configured
function initFirestore() {
  if (typeof firebase !== 'undefined' && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      firestoreDb = firebase.firestore();
      console.log('⚡ Firebase Cloud Firestore Connected successfully.');
    } catch (e) {
      console.warn('Firebase initialization notice:', e);
    }
  }
}

// Unified Database API
window.ProjectsDB = {
  // Get all projects (from Firestore cloud or Local fallback)
  async getAll() {
    initFirestore();

    // Try fetching from Cloud Firestore
    if (firestoreDb) {
      try {
        const snapshot = await firestoreDb.collection('projects').orderBy('order', 'asc').get();
        if (!snapshot.empty) {
          const cloudProjects = [];
          snapshot.forEach(doc => {
            cloudProjects.push({ id: doc.id, ...doc.data() });
          });
          // Cache locally for instant offline loading
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProjects));
          return cloudProjects;
        }
      } catch (err) {
        console.warn('Firestore fetch notice, using cached data:', err);
      }
    }

    // Fallback: LocalStorage / Initial Master Dataset
    try {
      const localData = localStorage.getItem(STORAGE_KEY);
      if (localData) {
        return JSON.parse(localData);
      }
    } catch (e) {
      console.warn('LocalStorage read notice:', e);
    }

    return window.DEFAULT_PROJECTS || [];
  },

  // Save or Update Project (Cloud + Local)
  async save(project) {
    initFirestore();
    if (!project.id) {
      project.id = 'proj_' + Date.now();
    }

    // Save to Cloud Firestore
    if (firestoreDb) {
      try {
        await firestoreDb.collection('projects').doc(project.id).set(project, { merge: true });
        console.log('☁️ Project synced to Firebase Cloud.');
      } catch (err) {
        console.warn('Firestore save notice:', err);
      }
    }

    // Always update local cache
    const projects = await this.getAll();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = { ...projects[index], ...project };
    } else {
      projects.push(project);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return project;
  },

  // Delete Project (Cloud + Local)
  async delete(id) {
    initFirestore();

    // Delete from Cloud Firestore
    if (firestoreDb) {
      try {
        await firestoreDb.collection('projects').doc(id).delete();
        console.log('☁️ Project deleted from Firebase Cloud.');
      } catch (err) {
        console.warn('Firestore delete notice:', err);
      }
    }

    // Update local cache
    let projects = await this.getAll();
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  },

  // Reset to original 5 projects
  async resetDefaults() {
    initFirestore();
    const defaults = window.DEFAULT_PROJECTS || [];

    if (firestoreDb) {
      try {
        const batch = firestoreDb.batch();
        defaults.forEach(proj => {
          const docRef = firestoreDb.collection('projects').doc(proj.id);
          batch.set(docRef, proj);
        });
        await batch.commit();
        console.log('☁️ Reset Cloud Firestore to master defaults.');
      } catch (e) {
        console.warn('Firestore batch reset notice:', e);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
};

// Render function for index.html
window.renderDynamicProjects = async function() {
  const grid = document.querySelector('.project-grid');
  if (!grid) return;

  const projects = await window.ProjectsDB.getAll();
  if (!projects || projects.length === 0) return;

  let html = '';
  projects.forEach((proj, idx) => {
    const cardClass = proj.cardType || (idx === 0 ? 'featured' : idx === 1 ? 'side' : 'half');
    const delayClass = `sr-delay-${(idx % 3) + 1}`;
    const borderBeamClass = (proj.cardType === 'featured') ? 'border-beam-card' : '';
    const heightStyle = (proj.cardType === 'half') ? 'style="height:190px;"' : (proj.cardType === 'full') ? 'style="height:210px;"' : '';
    
    const tagsHtml = (proj.tags || []).map(t => `<span class="proj-tag">${t}</span>`).join('');
    
    const liveLinkHtml = proj.liveUrl ? `
      <a href="${proj.liveUrl}" target="_blank" class="proj-link">Live Platform <i class="bi bi-arrow-right"></i></a>
      <div class="proj-actions">
        <a href="${proj.liveUrl}" target="_blank" class="proj-icon-btn magnetic-btn" title="Live Site"><i class="bi bi-box-arrow-up-right"></i></a>
      </div>` : '';

    const githubLinkHtml = proj.githubUrl ? `
      <a href="${proj.githubUrl}" target="_blank" class="proj-link">View Repository <i class="bi bi-arrow-right"></i></a>
      <div class="proj-actions">
        <a href="${proj.githubUrl}" target="_blank" class="proj-icon-btn magnetic-btn" title="GitHub Repo"><i class="bi bi-github"></i></a>
      </div>` : '';

    html += `
      <div class="project-card ${cardClass} sr ${delayClass} spotlight-card ${borderBeamClass}"
        data-tech="${proj.category || 'fullstack'}"
        data-project-id="${proj.id}"
        data-tilt data-tilt-max="5" data-tilt-glare data-tilt-max-glare="0.12" data-tilt-speed="400">
        <div class="proj-thumb" ${heightStyle}>
          <div class="proj-browser-bar">
            <div class="proj-browser-dots">
              <span class="proj-browser-dot" style="background:#ff5f57;"></span>
              <span class="proj-browser-dot" style="background:#febc2e;"></span>
              <span class="proj-browser-dot" style="background:#28c840;"></span>
              <span class="proj-browser-url"><i class="bi bi-lock-fill" style="font-size:0.55rem; margin-right:4px;"></i>${proj.browserUrl || 'project.app'}</span>
            </div>
            <span class="badge" style="background:${proj.badgeColor || 'rgba(255,107,53,0.2)'}; color:${proj.badgeTextColor || '#ff6b35'}; font-family:var(--font-mono); font-size:0.6rem; border:1px solid rgba(255,107,53,0.3);">${proj.badgeText || 'PROJECT'}</span>
          </div>
          <div class="proj-thumb-inner">
            <img src="${proj.previewImg}" alt="${proj.title}" class="proj-preview-img" loading="lazy" onerror="this.src='preview_januarydelight.jpg'" />
            <div class="proj-overlay-glow"></div>
          </div>
          <div class="proj-chip">
            <span><i class="bi bi-lightning-charge-fill text-accent"></i> ${proj.featured ? 'Featured' : 'Live'}</span>
          </div>
        </div>
        <div class="proj-content">
          <div class="proj-tags">${tagsHtml}</div>
          <div class="proj-title">${proj.title}</div>
          <p class="proj-desc">${proj.desc}</p>
          <div class="proj-footer">
            ${liveLinkHtml || githubLinkHtml}
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;

  // Re-initialize VanillaTilt for newly rendered dynamic elements
  if (typeof VanillaTilt !== 'undefined' && window.innerWidth > 768) {
    const newCards = grid.querySelectorAll('[data-tilt]');
    VanillaTilt.init(newCards);
  }
};

// Initialize dynamic render on DOM load
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.project-grid')) {
    window.renderDynamicProjects();
  }
});
