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
          const cardHtml = `
            <div class="snap-start shrink-0 w-[85vw] md:w-[380px] lg:w-[420px] flex flex-col group relative reveal-item active" style="transition-delay: ${delay}ms">
              <div class="announce-card h-full border border-sandalwood/30 bg-surface-container/50 p-5 rounded-xl transition-all duration-300 flex flex-col cursor-default overflow-hidden">
                
                <div class="flex items-start justify-between mb-3">
                  <span class="font-label-md text-[10px] tracking-[0.15em] text-secondary uppercase bg-secondary/10 px-2 py-1 rounded-md border border-secondary/20">
                    ${data.badge || 'Update'}
                  </span>
                  <div class="flex flex-col items-center border border-primary/20 rounded overflow-hidden shadow-sm bg-surface -mt-1">
                    <div class="bg-primary text-white text-[9px] font-label-md tracking-[0.2em] px-2 py-0.5 w-full text-center uppercase">
                      ${data.dateMonth || 'N/A'}
                    </div>
                    <div class="text-primary font-headline-md font-bold text-base px-2 py-0 w-full text-center leading-none">
                      ${data.dateDay || 'N/A'}
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
                      <div><strong class="font-label-md text-primary block mb-0.5">What</strong><span class="text-sm">${data.description}</span></div>
                    </div>
                    ${data.when ? `
                    <div class="flex items-start gap-2">
                      <span class="material-symbols-outlined text-[16px] text-secondary mt-0.5">schedule</span>
                      <div><strong class="font-label-md text-primary block mb-0.5">When</strong><span class="text-sm">${data.when}</span></div>
                    </div>` : ''}
                    ${data.where ? `
                    <div class="flex items-start gap-2">
                      <span class="material-symbols-outlined text-[16px] text-secondary mt-0.5">location_on</span>
                      <div><strong class="font-label-md text-primary block mb-0.5">Where</strong><span class="text-sm">${data.where}</span></div>
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
    });