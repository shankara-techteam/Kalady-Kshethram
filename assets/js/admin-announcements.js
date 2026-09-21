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
        <div class="p-10 text-center">
          <span class="material-symbols-outlined text-4xl text-zinc-300 mb-2">inbox</span>
          <p class="font-medium text-zinc-900">No announcements found</p>
          <p class="text-sm text-zinc-500 mt-1">Publish your first update using the form.</p>
        </div>`;
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;
      
      const card = document.createElement('div');
      card.className = "p-5 hover:bg-zinc-50 transition-colors group";
      
      card.innerHTML = `
        <div class="flex justify-between items-start">
          <div class="flex-1 pr-4">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">${data.badge || 'Update'}</span>
              <span class="text-xs text-zinc-400 flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">calendar_today</span> ${data.fullDate || 'No date set'}</span>
            </div>
            <h3 class="text-base font-semibold text-zinc-900 leading-tight mb-1">${data.title}</h3>
            <p class="text-sm text-zinc-600 line-clamp-2 leading-relaxed">${data.description}</p>
            ${data.where ? `<p class="text-xs text-zinc-500 mt-2 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">location_on</span> ${data.where}</p>` : ''}
          </div>
          <div class="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="edit-btn text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:border-zinc-300 px-3 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm" data-id="${id}">
              <span class="material-symbols-outlined text-[14px]">edit</span> Edit
            </button>
            <button class="delete-btn text-xs font-medium text-red-600 hover:text-red-700 bg-white border border-red-100 hover:border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm" data-id="${id}">
              <span class="material-symbols-outlined text-[14px]">delete</span> Delete
            </button>
          </div>
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
        submitBtn.innerHTML = `Update`;
        submitBtn.classList.remove('premium-btn');
        submitBtn.classList.add('bg-zinc-100', 'text-zinc-900', 'border', 'border-zinc-300', 'hover:bg-zinc-200');
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
      submitBtn.innerHTML = `Processing...`;

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
          submitBtn.innerHTML = `Publish`;
        }
      }
    });
  }

  function resetForm() {
    currentEditId = null;
    form.reset();
    formTitle.textContent = "Add Announcement";
    submitBtn.innerHTML = `Publish`;
    submitBtn.classList.remove('bg-zinc-100', 'text-zinc-900', 'border-zinc-300');
    submitBtn.classList.add('premium-btn');
    cancelEditBtn.classList.add('hidden');
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', resetForm);
  }
});
