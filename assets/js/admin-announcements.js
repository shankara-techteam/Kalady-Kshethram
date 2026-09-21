import { db, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-announcement-form');
  const feedContainer = document.getElementById('feed-container');
  const formTitle = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const statAnnouncements = document.getElementById('stat-announcements');
  
  let currentEditId = null;

  // Realtime Feed Listener
  const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
  
  onSnapshot(q, (snapshot) => {
    // Update Dashboard Stat
    if (statAnnouncements) {
      statAnnouncements.textContent = snapshot.size;
    }

    if (!feedContainer) return;
    feedContainer.innerHTML = '';
    
    if (snapshot.empty) {
      feedContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center p-12 text-center opacity-70">
          <span class="material-symbols-outlined text-4xl text-sandalwood mb-3">inbox</span>
          <p class="font-headline-md text-lg text-primary">No announcements found</p>
          <p class="font-body-md text-sm text-on-surface-variant mt-1">Publish your first update using the form on the left.</p>
        </div>`;
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;
      
      const card = document.createElement('div');
      card.className = "card-hover glass-panel p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden group cursor-default";
      
      card.innerHTML = `
        <div class="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-secondary opacity-80"></div>
        <div class="flex justify-between items-start pl-3">
          <div>
            <span class="font-label-md text-[10px] tracking-[0.15em] text-secondary uppercase bg-secondary/10 px-2.5 py-1 rounded-md border border-secondary/20 inline-block mb-2 font-bold">${data.badge || 'Update'}</span>
            <h3 class="font-headline-md text-xl text-primary leading-tight font-semibold group-hover:text-primary-container transition-colors">${data.title}</h3>
            <p class="font-body-md text-on-surface-variant text-sm mt-2 line-clamp-2 leading-relaxed opacity-90">${data.description}</p>
            <div class="flex items-center gap-4 mt-3">
              <p class="font-label-md text-xs text-secondary flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">calendar_today</span> ${data.fullDate || 'No date set'}</p>
              ${data.where ? `<p class="font-label-md text-xs text-secondary flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">location_on</span> ${data.where}</p>` : ''}
            </div>
          </div>
        </div>
        <div class="flex gap-2 mt-3 pt-4 border-t border-sandalwood/20 pl-3">
          <button class="edit-btn font-label-md text-xs uppercase tracking-widest text-primary hover:text-secondary transition-colors flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg border border-transparent hover:border-primary/20" data-id="${id}">
            <span class="material-symbols-outlined text-[14px]">edit</span> Edit
          </button>
          <button class="delete-btn font-label-md text-xs uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors flex items-center gap-1.5 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-200 ml-2" data-id="${id}">
            <span class="material-symbols-outlined text-[14px]">delete</span> Delete
          </button>
        </div>
      `;
      
      feedContainer.appendChild(card);
      
      // Edit Listener
      card.querySelector('.edit-btn').addEventListener('click', () => {
        currentEditId = id;
        document.getElementById('title').value = data.title || '';
        document.getElementById('badge').value = data.badge || '';
        document.getElementById('dateMonth').value = data.dateMonth || '';
        document.getElementById('dateDay').value = data.dateDay || '';
        document.getElementById('description').value = data.description || '';
        document.getElementById('fullDate').value = data.fullDate || '';
        document.getElementById('when').value = data.when || '';
        document.getElementById('where').value = data.where || '';
        document.getElementById('link').value = data.link || '';
        
        formTitle.textContent = "Edit Announcement";
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">update</span> Update Announcement`;
        submitBtn.classList.replace('from-primary', 'from-secondary');
        submitBtn.classList.replace('to-primary-container', 'to-secondary-container');
        cancelEditBtn.classList.remove('hidden');
        
        // Ensure Announcements view is active
        document.querySelector('[data-target="view-announcements"]').click();
      });
      
      // Delete Listener
      card.querySelector('.delete-btn').addEventListener('click', async () => {
        if (confirm(`Are you sure you want to delete "${data.title}"? This action cannot be undone.`)) {
          try {
            await deleteDoc(doc(db, "announcements", id));
            window.showToast('success', 'Announcement deleted successfully.');
            if (currentEditId === id) resetForm();
          } catch (error) {
            window.showToast('error', `Error deleting: ${error.message}`);
          }
        }
      });
    });
  });

  // Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const announcementData = {
        title: document.getElementById('title').value,
        badge: document.getElementById('badge').value || 'Update',
        dateMonth: document.getElementById('dateMonth').value || 'N/A',
        dateDay: document.getElementById('dateDay').value || 'N/A',
        description: document.getElementById('description').value,
        fullDate: document.getElementById('fullDate').value || '',
        when: document.getElementById('when').value || '',
        where: document.getElementById('where').value || '',
        link: document.getElementById('link').value || '',
      };

      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Processing...`;

      try {
        if (currentEditId) {
          await updateDoc(doc(db, "announcements", currentEditId), announcementData);
          window.showToast('success', 'Announcement updated successfully!');
        } else {
          announcementData.createdAt = serverTimestamp();
          await addDoc(collection(db, "announcements"), announcementData);
          window.showToast('success', 'Announcement published successfully!');
        }
        resetForm();
      } catch (error) {
        window.showToast('error', `Error: ${error.message}`);
      } finally {
        submitBtn.disabled = false;
        if(!currentEditId) {
          submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">publish</span> Publish Announcement`;
        }
      }
    });
  }

  function resetForm() {
    currentEditId = null;
    form.reset();
    formTitle.textContent = "Add Announcement";
    submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">publish</span> Publish Announcement`;
    submitBtn.classList.replace('from-secondary', 'from-primary');
    submitBtn.classList.replace('to-secondary-container', 'to-primary-container');
    cancelEditBtn.classList.add('hidden');
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', resetForm);
  }
});
