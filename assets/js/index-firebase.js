import { db, collection, query, orderBy, onSnapshot } from './firebase-config.js';

    document.addEventListener('DOMContentLoaded', () => {
      const container = document.getElementById('announcements-container');
      if (!container) return;

      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));

      onSnapshot(q, (snapshot) => {
        container.innerHTML = ''; // Clear existing
        if (snapshot.empty) {
          container.innerHTML = '<p class="text-on-surface-variant p-4 font-body-md">No announcements at this time.</p>';
          return;
        }

        let delay = 200;
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          let dMonth = data.dateMonth || 'N/A';
          let dDay = data.dateDay || 'N/A';
          if ((!data.dateMonth || !data.dateDay) && data.createdAt) {
            try {
              const d = data.createdAt.toDate();
              dMonth = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
              dDay = d.getDate().toString().padStart(2, '0');
            } catch(e){}
          }

          const cardHtml = `
            <div class="snap-start shrink-0 w-[85vw] md:w-[380px] lg:w-[420px] flex flex-col group relative reveal-item active" style="transition-delay: ${delay}ms">
              <div class="announce-card h-full border border-sandalwood/30 bg-surface-container/50 p-5 rounded-xl transition-all duration-300 flex flex-col cursor-default overflow-hidden">
                
                <div class="flex items-start justify-between mb-3">
                  <span class="font-label-md text-[10px] tracking-[0.15em] text-secondary uppercase bg-secondary/10 px-2 py-1 rounded-md border border-secondary/20">
                    ${data.badge || 'Update'}
                  </span>
                  <div class="flex flex-col items-center border border-primary/20 rounded overflow-hidden shadow-sm bg-surface -mt-1">
                    <div class="bg-primary text-white text-[9px] font-label-md tracking-[0.2em] px-2 py-0.5 w-full text-center uppercase">
                      ${dMonth}
                    </div>
                    <div class="text-primary font-headline-md font-bold text-base px-2 py-0 w-full text-center leading-none">
                      ${dDay}
                    </div>
                  </div>
                </div>

                <h3 class="font-headline-md text-xl text-primary mb-2 font-semibold group-hover:text-primary-container transition-colors tracking-tight">
                  ${data.title}
                </h3>

                <div class="font-body-md text-on-surface-variant mb-4 leading-relaxed flex-grow opacity-90 text-sm">
                  <div class="space-y-2 mt-1">
                    <div class="flex items-start gap-2">
                      <span class="material-symbols-outlined text-[16px] text-secondary mt-0.5">info</span>
                      <div><strong class="font-label-md text-primary block mb-0.5">Details</strong><span class="text-sm">${data.description}</span></div>
                    </div>
                    ${data.when ? `
                    <div class="flex items-start gap-2">
                      <span class="material-symbols-outlined text-[16px] text-secondary mt-0.5">schedule</span>
                      <div><strong class="font-label-md text-primary block mb-0.5">Date & Time</strong><span class="text-sm">${data.when}</span></div>
                    </div>` : ''}
                    ${data.where ? `
                    <div class="flex items-start gap-2">
                      <span class="material-symbols-outlined text-[16px] text-secondary mt-0.5">location_on</span>
                      <div><strong class="font-label-md text-primary block mb-0.5">Location</strong><span class="text-sm">${data.where}</span></div>
                    </div>` : ''}
                  </div>
                </div>

                <div class="mt-auto pt-3 border-t border-sandalwood/20 flex flex-col gap-2">
                  <div class="flex items-center gap-2 text-on-surface-variant opacity-85 text-xs">
                    <span class="material-symbols-outlined text-[16px] text-tertiary">calendar_today</span>
                    <span class="font-label-md">${data.fullDate || 'TBA'}</span>
                  </div>
                  ${data.link ? `
                  <a href="${data.link}" class="inline-flex items-center gap-1 text-primary font-label-md text-xs uppercase tracking-[0.1em] hover:text-secondary transition-colors mt-1 w-fit group/link pb-0.5 border-b border-transparent hover:border-secondary">
                    View Details
                    <span class="material-symbols-outlined text-[16px] transition-transform group-hover/link:translate-x-1">arrow_forward</span>
                  </a>` : ''}
                </div>
              </div>
            </div>
          `;
          container.insertAdjacentHTML('beforeend', cardHtml);
          delay += 100;
        });

        // Update navigation buttons
        const btnPrev = document.getElementById('announcements-prev');
        const btnNext = document.getElementById('announcements-next');
        if (btnPrev && btnNext) {
          const maxScrollLeft = container.scrollWidth - container.clientWidth;
          btnPrev.disabled = container.scrollLeft <= 5;
          btnNext.disabled = container.scrollLeft >= maxScrollLeft - 5;
        }
      });
      
      // -- EVENTS FETCHING --
      const eventsContainer = document.getElementById('events-container');
      if (eventsContainer) {
        const eq = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
        onSnapshot(eq, (snapshot) => {
          eventsContainer.innerHTML = ''; // Clear existing
          if (snapshot.empty) {
            eventsContainer.innerHTML = '<p class="text-on-surface-variant p-8 text-center w-full font-body-md col-span-full border border-dashed border-sandalwood/50 rounded-2xl">No upcoming events at this time.</p>';
            return;
          }

          let delay = 100;
          snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Build the Image or Placeholder
            const imgHtml = data.image_url 
              ? `<img src="${data.image_url}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onerror="this.src='../assets/images/om.jpg'">`
              : `<div class="w-full h-full bg-gradient-to-br from-surface-container to-sandalwood/20 flex flex-col items-center justify-center text-primary/50"><span class="material-symbols-outlined text-5xl mb-2">temple_hindu</span><span class="font-label-md text-xs uppercase tracking-[0.2em]">Spiritual Event</span></div>`;
            
            const cardHtml = `
              <div class="relative bg-surface border border-sandalwood/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(87,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 group flex flex-col reveal-item active" style="transition-delay: ${delay}ms">
                
                <!-- Image Header -->
                <div class="relative h-64 w-full overflow-hidden">
                  ${imgHtml}
                  <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                  
                  <!-- Floating Badge -->
                  <div class="absolute top-4 left-4 bg-surface/90 backdrop-blur-md border border-sandalwood/30 px-3 py-1.5 rounded-lg shadow-sm">
                    <span class="font-label-md text-[10px] text-primary uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                      ${data.type || 'Event'}
                    </span>
                  </div>
                </div>
                
                <!-- Card Content -->
                <div class="relative flex-1 p-6 md:p-8 flex flex-col z-10 bg-surface">
                  <h3 class="font-display-lg text-2xl md:text-3xl text-primary font-light mb-4 group-hover:text-primary-container transition-colors tracking-tight leading-tight">
                    ${data.title}
                  </h3>
                  
                  <p class="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed line-clamp-3 mb-6 opacity-90">
                    ${data.description}
                  </p>
                  
                  <!-- Footer -->
                  <div class="mt-auto pt-5 border-t border-sandalwood/20 flex items-center justify-between">
                    <div class="flex items-center gap-2 text-secondary bg-secondary/5 px-3 py-1.5 rounded-lg border border-secondary/10">
                      <span class="material-symbols-outlined text-[18px]">event_upcoming</span>
                      <span class="font-label-md text-xs uppercase tracking-widest font-semibold">${data.date || 'To Be Announced'}</span>
                    </div>
                    
                    <button class="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 border border-primary/20 group-hover:border-transparent group-hover:shadow-[0_0_15px_rgba(87,0,0,0.3)]">
                      <span class="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                  </div>
                </div>
                
                <!-- Hover Glow Effect -->
                <div class="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-3xl transition-colors duration-500 pointer-events-none"></div>
              </div>
            `;
            eventsContainer.insertAdjacentHTML('beforeend', cardHtml);
            delay += 100;
          });
        });
      }
    });