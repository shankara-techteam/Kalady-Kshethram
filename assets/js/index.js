window.toggleMobileMenu = function () {
      const menu = document.getElementById('mobile-menu');
      const isHidden = menu.classList.contains('hidden');
      if (isHidden) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          menu.classList.remove('opacity-0');
          menu.classList.add('opacity-100');
        }, 50);
      } else {
        menu.classList.remove('opacity-100');
        menu.classList.add('opacity-0');
        document.body.style.overflow = '';
        setTimeout(() => {
          menu.classList.remove('flex');
          menu.classList.add('hidden');
        }, 300);
      }
    };
    document.body.classList.add('page-loaded');

// --- Extracted Script Block ---

document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('announcements-container');
            const btnPrev = document.getElementById('announcements-prev');
            const btnNext = document.getElementById('announcements-next');

            if (!container || !btnPrev || !btnNext) return;

            // Scroll Logic
            const updateButtons = () => {
              const maxScrollLeft = container.scrollWidth - container.clientWidth;
              btnPrev.disabled = container.scrollLeft <= 5;
              btnNext.disabled = container.scrollLeft >= maxScrollLeft - 5;
            };

            const scrollAmount = () => {
              const card = container.querySelector('.snap-start');
              return card ? card.offsetWidth + 24 : 300; // 24 is the gap
            };

            btnPrev.addEventListener('click', () => {
              container.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
            });

            btnNext.addEventListener('click', () => {
              container.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
            });

            container.addEventListener('scroll', () => {
              window.requestAnimationFrame(updateButtons);
            });
            window.addEventListener('resize', updateButtons);

            // Initial check
            setTimeout(updateButtons, 150);
          });

// --- Extracted Script Block ---

// Update active nav links on scroll
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          const navLink = document.getElementById('nav-' + id);
          if (navLink) {
            document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
            navLink.classList.add('active');
          }
        }
      });
    }, { threshold: 0.35, rootMargin: '-80px 0px -50% 0px' });

    document.querySelectorAll('#home, #pathashala, #pilgrimage').forEach(sec => scrollObserver.observe(sec));

    // Gold line IntersectionObserver
    const goldLineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          goldLineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.gold-line').forEach(el => goldLineObserver.observe(el));

    // Trigger animations and page transition on load
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('page-loaded');
      const heroItems = document.querySelectorAll('#home .reveal-item');
      heroItems.forEach(item => {
        setTimeout(() => {
          item.classList.add('active');
        }, 150);
      });
    });

    // Pilgrimage Tab Switching Logic
    function selectPilgrimageTab(index) {
      // Hide all contents
      const contents = [1, 2, 3];
      contents.forEach(idx => {
        const el = document.getElementById('tab-content-' + idx);
        if (idx === index) {
          el.classList.remove('hidden');
          el.classList.add('tab-animate');
        } else {
          el.classList.add('hidden');
          el.classList.remove('tab-animate');
        }
      });

      // Reset tab button backgrounds
      [1, 2, 3].forEach(idx => {
        const btn = document.getElementById('tab-btn-' + idx);
        btn.classList.remove('bg-surface-container-lowest');
        btn.classList.add('bg-surface-container-low');
      });

      // Set active background
      const activeBtn = document.getElementById('tab-btn-' + index);
      activeBtn.classList.remove('bg-surface-container-low');
      activeBtn.classList.add('bg-surface-container-lowest');

      // Manage indicators
      const indicators = ['tab-indicator-1', 'tab-indicator-2', 'tab-indicator-3'];
      indicators.forEach((indId) => {
        const el = document.getElementById(indId);
        if (el) el.remove();
      });

      // Add indicator to new active tab
      const indDiv = document.createElement('div');
      indDiv.id = 'tab-indicator-' + index;
      indDiv.className = 'absolute inset-x-0 top-0 h-1 bg-tertiary';
      activeBtn.appendChild(indDiv);
    }

    // Modals Management
    function openDonateModal() {
      window.location.href = 'https://donate.sringeri.net/donation';
    }
    function closeDonateModal() {
      const m = document.getElementById('donate-modal');
      if (m) {
        m.classList.remove('flex');
        m.classList.add('hidden');
      }
      document.body.style.overflow = '';
    }
    function handleDonateSubmit(event) {
      if (event) event.preventDefault();
      window.location.href = 'https://donate.sringeri.net/donation';
    }

    // Shrine Modals
    const shrineData = {
      1: {
        title: "Ancient Sri Krishna Temple",
        subtitle: "The Family Deity (Kuladevatha) of Kaippilly Illam",
        desc: "<p>The ancient Sri Krishna Temple is located directly adjacent to the main Janmabhoomi complex on the banks of the Periyar (Purna) River. This temple holds a highly sacred historical value, as it was the family temple (Kuladevatha) of Kaippilly Illam, the house in which Sri Adi Shankaracharya was born.</p><p>As a young boy, Shankara Offered daily prayers here. The temple is famous for the legendary miracle of redirecting the Periyar River. Shankara's mother, Aryamba, used to walk a long distance daily to take a bath in the Periyar River. One summer day, unable to bear the heat and physical fatigue, she fainted on her way back.</p><p>Devastated, the young child Shankara prayed intensely to Lord Krishna to change the course of the river so that his mother would not have to walk. Lord Krishna granted the child's prayer, and the Periyar River changed its path, flowing directly past the Sri Krishna temple. To this day, the river continues to flow along this redirected course.</p>",
        img: "./image_1.jpg"
      },
      2: {
        title: "The Crocodile Ghat (Muthala Kadavu)",
        subtitle: "The Hallowed Location of the Crocodile Miracle",
        desc: "<p>The Crocodile Ghat, or Muthala Kadavu in Malayalam, is the specific spot on the banks of the Periyar River where the legendary incident that initiated Adi Shankaracharya into Sanyasa (renunciation) occurred.</p><p>Shankara was filled with a deep desire to lead a monk's life, but his mother Aryamba vehemently refused to give her permission. One day, while bathing in the Periyar River at this ghat, a crocodile grabbed Shankara's leg. Shankara cried out to his mother, who had rushed to the bank: 'O mother, a crocodile has caught me! I will die unless you permit me to take Sanyasa on the spot!'</p><p>In agony and wanting her son's life to be saved, Aryamba relented and granted her permission. The moment the permission was granted, the crocodile released its hold and vanished. Shankara was then free to enter the path of Sanyasa, leading him to travel across India restoring Sanatana Dharma.</p><p>Today, the Crocodile Ghat features beautiful stone steps leading down to the water, and pilgrims take a holy dip here to honor Shankara's vow of renunciation.</p>",
        img: "./image_2.jpg"
      },
      3: {
        title: "Kalady Veda Pathashala",
        subtitle: "Preserving the Oral Tradition of the Vedas",
        desc: "<p>Under the patronage and direction of the Sringeri Sharada Peetham, the Veda Pathashala at Kalady serves as a vital monastic seminary. Here, young students (Vidyarthis) learn to recite and study the Vedas under the guidance of traditional Pandits.</p><p>The curriculum covers:<ul><li class='lotus-bullet'><strong>Veda Adhyayana:</strong> Rig Veda and Yajur Veda recitation.</li><li class='lotus-bullet'><strong>Sanskrit Grammar & Literature:</strong> Master the language of the scriptures.</li><li class='lotus-bullet'><strong>Advaita Vedanta:</strong> Fundamental philosophy of non-duality as taught by Adi Shankaracharya.</li></ul></p><p>The school follows the traditional Gurukula style of living, where boarding, lodging, and education are provided entirely free of cost to the students, supported by donations from devotees around the world.</p>",
        img: "./image_4.jpg"
      }
    };

    function openShrineModal(index) {
      const data = shrineData[index];
      if (!data) return;

      const contentDiv = document.getElementById('shrine-modal-content');
      contentDiv.innerHTML = `
            <div class="w-full h-80 overflow-hidden border border-sandalwood/20 rounded-lg">
              <img src="${data.img}" class="w-full h-full object-cover" alt="${data.title}">
            </div>
            <h3 class="font-headline-lg text-headline-lg text-primary mt-4">${data.title}</h3>
            <span class="font-label-md text-label-md text-secondary uppercase tracking-wider block mb-2">${data.subtitle}</span>
            <div class="font-body-md text-body-md text-on-surface-variant leading-relaxed space-y-4">
              ${data.desc}
            </div>
          `;

      const m = document.getElementById('shrine-modal');
      m.classList.remove('hidden');
      m.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }

    function closeShrineModal() {
      const m = document.getElementById('shrine-modal');
      m.classList.remove('flex');
      m.classList.add('hidden');
      document.body.style.overflow = '';
    }

    function openKanakadharaModal() {
      const m = document.getElementById('kanakadhara-modal');
      m.classList.remove('hidden');
      m.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }

    function closeKanakadharaModal() {
      const m = document.getElementById('kanakadhara-modal');
      m.classList.remove('flex');
      m.classList.add('hidden');
      document.body.style.overflow = '';
    }

    // Prashnottara Dialogue Data
    const guruPrashnottara = {
      1: {
        q: "What should be sought in life?",
        sanskrit: "किं संसेव्यं पुंसां? गुरुचरणं, त्यक्तव्यमेव किं? संसारः।",
        translation: "What should be sought by men? The holy feet of the Guru. What should be renounced? The cycle of worldly existence."
      },
      2: {
        q: "Where lies true happiness?",
        sanskrit: "कुत्र सुखं? वैराग्ये, को मुक्तः? सर्वसङ्गत्यागी।",
        translation: "Where lies true happiness? In dispassion and detachment. Who is free? He who has renounced all attachments."
      },
      3: {
        q: "What is the source of fear?",
        sanskrit: "कस्माद् भीतिः? मरणाद्, दारिद्र्याद् वा? तदपि चित्तभ्रमात्।",
        translation: "What is the source of fear? Death, or poverty? In truth, it is the delusion of the mind itself."
      }
    };

    let typingInterval;
    function askGuru(index) {
      const data = guruPrashnottara[index];
      if (!data) return;

      // Highlight active button
      document.querySelectorAll('.q-btn').forEach((btn, i) => {
        if (i === index - 1) {
          btn.classList.add('border-primary', 'bg-primary/5', 'text-primary');
        } else {
          btn.classList.remove('border-primary', 'bg-primary/5', 'text-primary');
        }
      });

      const screen = document.getElementById('guru-dialogue-screen');
      screen.innerHTML = `
            <div class="space-y-3 text-left">
              <div class="flex items-start gap-2">
                <span class="text-xs font-label-md text-secondary uppercase tracking-wider mt-1.5 flex-shrink-0">Q:</span>
                <p class="font-serif font-medium text-on-surface text-base md:text-lg">${data.q}</p>
              </div>
              <div class="mt-2 border-t border-sandalwood/15 pt-3 space-y-3">
                <span class="text-xs font-label-md text-primary uppercase tracking-wider block">Guru Shankara:</span>
                <p class="font-serif italic text-primary text-lg md:text-xl text-center leading-relaxed tracking-wide bg-surface-container/20 py-2.5 rounded-lg border border-sandalwood/10" id="typing-sanskrit"></p>
                <p class="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base italic pt-0.5" id="typing-translation"></p>
              </div>
            </div>
          `;

      // Start typing animation
      if (typingInterval) clearInterval(typingInterval);

      const sText = data.sanskrit;
      const tText = data.translation;
      let sIndex = 0;
      let tIndex = 0;

      const sEl = document.getElementById('typing-sanskrit');
      const tEl = document.getElementById('typing-translation');

      typingInterval = setInterval(() => {
        if (sIndex < sText.length) {
          sEl.innerHTML += sText.charAt(sIndex);
          sIndex++;
        } else if (tIndex < tText.length) {
          tEl.innerHTML += tText.charAt(tIndex);
          tIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 30);
    }

    // Sound of Kalady Audio Player Logic & Web Audio API Synthesis
    const tracks = {
      1: {
        url: "assets/audio/purusha-suktam.mp3",
        btnId: "track-btn-1",
      },
      2: {
        url: "assets/audio/bhaagya-suktam.mp3",
        btnId: "track-btn-2",
      },
      3: {
        url: "assets/audio/nirvana-shathakam.mp3",
        btnId: "track-btn-3",
      },
      4: {
        url: "assets/audio/sri-suktham.mp3",
        btnId: "track-btn-4",
      },
      5: {
        url: "assets/audio/sri-subrahmanya.mp3",
        btnId: "track-btn-5",
      }
    };
    let currentTrackId = 0;
    let isAudioPlaying = false;
    
    // Web Audio API Analyzer variables for accurate visualization
    let audioCtx;
    let audioSource;
    let analyser;
    let dataArray;
    let visualizerAnimationId;

    function selectTrack(trackId) {
      const audio = document.getElementById('sanctuary-audio');
      const track = tracks[trackId];
      if (!track) return;

      // Highlight active track item
      document.querySelectorAll('.track-item').forEach((item, index) => {
        const icon = document.getElementById('track-play-icon-' + (index + 1));
        if (index + 1 === trackId) {
          item.classList.add('border-primary', 'bg-primary/5');
          if (icon) icon.innerText = 'pause_circle';
        } else {
          item.classList.remove('border-primary', 'bg-primary/5');
          if (icon) icon.innerText = 'play_circle';
        }
      });

      if (currentTrackId === trackId) {
        togglePlayState();
        return;
      }

      currentTrackId = trackId;
      audio.src = track.url;
      audio.load();
      playAudio();
    }

    function playAudio() {
      const audio = document.getElementById('sanctuary-audio');
      
      // Initialize Web Audio Context if not created yet
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64; // Small FFT for 12 bars
          const bufferLength = analyser.frequencyBinCount;
          dataArray = new Uint8Array(bufferLength);
          
          audioSource = audioCtx.createMediaElementSource(audio);
          audioSource.connect(analyser);
          analyser.connect(audioCtx.destination);
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      } catch (e) {
        console.warn("Web Audio API not supported or blocked by CORS, falling back to basic playback", e);
      }

      // Play the authentic mp3 recording
      audio.play().then(() => {
        isAudioPlaying = true;
        document.getElementById('play-btn-icon').innerText = 'pause';
        startVisualizer();
      }).catch(err => {
        console.error("Autoplay blocked or file failed to load:", err);
        alert("Audio playback failed. Please ensure your browser allows audio playback on this site.");
      });
    }

    function pauseAudio() {
      const audio = document.getElementById('sanctuary-audio');
      try {
        audio.pause();
      } catch (e) { }
      isAudioPlaying = false;
      document.getElementById('play-btn-icon').innerText = 'play_arrow';
      stopVisualizer();
      // Reset icons on playlist
      document.querySelectorAll('.track-item').forEach((item, index) => {
        const icon = document.getElementById('track-play-icon-' + (index + 1));
        if (icon) icon.innerText = 'play_circle';
      });
    }

    function togglePlayState() {
      if (currentTrackId === 0) {
        selectTrack(1);
        return;
      }
      if (isAudioPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    }

    function nextTrack() {
      let next = currentTrackId + 1;
      if (next > 5) next = 1;
      selectTrack(next);
    }

    function prevTrack() {
      let prev = currentTrackId - 1;
      if (prev < 1) prev = 5;
      selectTrack(prev);
    }

    function startVisualizer() {
      if (visualizerAnimationId) cancelAnimationFrame(visualizerAnimationId);
      const bars = document.querySelectorAll('.visualizer-bar');
      
      let lastDrawTime = 0;

      function draw(time) {
        if (!isAudioPlaying) return;
        visualizerAnimationId = requestAnimationFrame(draw);
        
        // Throttle fallback animation slightly so it's not too chaotic
        if (time - lastDrawTime < 100) return;
        lastDrawTime = time;

        let sum = 0;
        if (analyser && dataArray) {
          analyser.getByteFrequencyData(dataArray);
          for(let i=0; i<dataArray.length; i++) {
             sum += dataArray[i];
          }
        }
        
        if (sum > 0) {
          // Accurate Web Audio API Visualization
          bars.forEach((bar, i) => {
            const value = dataArray[i + 1] || 10;
            const height = Math.max(15, (value / 255) * 100);
            bar.style.height = `${height}%`;
          });
        } else {
          // Fallback if Web Audio API data is 0 (due to CORS opaque media)
          bars.forEach(bar => {
            const height = Math.floor(Math.random() * 85) + 15;
            bar.style.height = `${height}%`;
          });
        }
      }
      
      requestAnimationFrame(draw);
    }

    function stopVisualizer() {
      if (visualizerAnimationId) cancelAnimationFrame(visualizerAnimationId);
      const bars = document.querySelectorAll('.visualizer-bar');
      bars.forEach(bar => {
        bar.style.height = '4px';
      });
    }

    // Close modal on escape or background click
    window.addEventListener('click', function (e) {
      const donateModal = document.getElementById('donate-modal');
      const shrineModal = document.getElementById('shrine-modal');
      const kanakadharaModal = document.getElementById('kanakadhara-modal');

      if (e.target === donateModal) closeDonateModal();
      if (e.target === shrineModal) closeShrineModal();
      if (e.target === kanakadharaModal) closeKanakadharaModal();
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeDonateModal();
        closeShrineModal();
        closeKanakadharaModal();
      }
    });

    // Kshethram Seva Bot Logic (Offline Rule-Based Chatbot)
    function toggleChatbot() {
      const win = document.getElementById('chatbot-window');
      const icon = document.getElementById('chatbot-toggle-icon');
      if (win.classList.contains('hidden')) {
        win.classList.remove('hidden');
        icon.innerText = 'close';
        const msgs = document.getElementById('chatbot-messages');
        msgs.scrollTop = msgs.scrollHeight;
      } else {
        win.classList.add('hidden');
        icon.innerText = 'chat';
      }
    }

    const botReplies = {
      welcome: `<p class="font-semibold text-primary font-serif mb-1.5">Hari Om! Pranams.</p>
                    <p class="font-sans">Welcome to the Sri Adi Shankara Janmabhoomi. I can assist you with details regarding your pilgrimage, temple services, or the non-dual philosophy of Advaita Vedanta.</p>`,
      timings: `<div class="space-y-2">
            <p class="font-serif font-bold text-primary text-sm flex items-center gap-1">🛕 Temple Shrine & Aarti Timings</p>
            <p class="font-sans">The Sri Adi Shankara Janmabhoomi Kshethram is open daily. General visiting hours:</p>
            <ul class="list-none space-y-1.5 my-2 pl-1">
              <li class="flex items-center gap-1.5"><span class="text-primary text-[10px]">🪷</span> <strong>Morning:</strong> 5:30 AM – 12:30 PM</li>
              <li class="flex items-center gap-1.5"><span class="text-primary text-[10px]">🪷</span> <strong>Evening:</strong> 4:30 PM – 8:30 PM</li>
            </ul>
            <div class="border-t border-sandalwood/20 pt-2 my-2">
              <p class="font-semibold text-secondary text-xs uppercase tracking-wider mb-1">Daily Aarti & Puja Schedule:</p>
              <ul class="list-disc pl-4 space-y-1 text-[11px] text-on-surface-variant">
                <li><strong>06:30 AM:</strong> Usha Puja & Morning Aarti</li>
                <li><strong>12:00 PM:</strong> Maha Puja & Noon Aarti</li>
                <li><strong>08:00 PM:</strong> Athazha Puja & Night Aarti</li>
              </ul>
            </div>
            <p class="text-[10px] text-on-surface-variant/75 italic">*Note: Timings are extended during major festivals such as Shankara Jayanthi (April/May) and Navaratri (September/October).*</p>
          </div>`,
      sevas: `<div class="space-y-2">
            <p class="font-serif font-bold text-primary text-sm flex items-center gap-1">🙏 Sacred Seva Offerings</p>
            <p class="font-sans">Devotees are invited to participate in the preservation of Vedic culture by sponsoring the following Pujas:</p>
            <ol class="list-decimal pl-4 space-y-2 my-2">
              <li>
                <strong>Adi Shankara Ashtothara Archana (₹150)</strong>
                <p class="text-[11px] text-on-surface-variant">Worship of Sri Adi Shankaracharya chanting his 108 names, praying for wisdom and spiritual growth.</p>
              </li>
              <li>
                <strong>Sharadamba Suhasini Puja (₹500)</strong>
                <p class="text-[11px] text-on-surface-variant">Special offerings to Goddess Sharadamba (the deity of learning) for blessings of intellect and prosperity, performed on Fridays.</p>
              </li>
              <li>
                <strong>Veda Pathashala Support (Custom Donation)</strong>
                <p class="text-[11px] text-on-surface-variant">Sponsor the boarding, lodging, and traditional scriptural education of young Vedic students.</p>
              </li>
              <li>
                <strong>Annadanam Seva (₹1008)</strong>
                <p class="text-[11px] text-on-surface-variant">Sponsor a day's traditional vegetarian meals (served on plantain leaves) for all visiting pilgrims.</p>
              </li>
            </ol>
            <p class="text-[10px] text-on-surface-variant/75 italic">To book sevas, click the <strong>Donate</strong> button at the top header or contact the Math office directly.</p>
          </div>`,
      lodging: `<div class="space-y-2">
            <p class="font-serif font-bold text-primary text-sm flex items-center gap-1">🏡 Pilgrim Accommodation (Yatri Nivas)</p>
            <p class="font-sans">The Sringeri Sharada Peetham provides boarding and lodging within the peaceful temple complex at <strong>Sri Sringeri Shankara Math Guest House (Adi Shankara Nilayam)</strong>:</p>
            <ul class="list-none space-y-1.5 my-2 pl-1">
              <li class="flex items-start gap-1.5"><span class="text-primary text-[10px] mt-1">🪷</span> <div><strong>Room Types:</strong> Both Air-Conditioned (AC) and Non-AC guest rooms are available, as well as larger family halls for tour groups.</div></li>
              <li class="flex items-start gap-1.5"><span class="text-primary text-[10px] mt-1">🪷</span> <div><strong>Booking Procedure:</strong> Rooms are allotted on a first-come, first-served basis. For peak seasons, email/post reservations to Sringeri Math, Kalady.</div></li>
              <li class="flex items-start gap-1.5"><span class="text-primary text-[10px] mt-1">🪷</span> <div><strong>Annadanam (Free Meals):</strong> Served daily to all visitors at the dining hall: Lunch (12:15 PM – 2:00 PM) and Dinner (7:45 PM – 9:00 PM).</div></li>
            </ul>
            <p class="text-[11px] text-secondary font-semibold">Contact Information: kalady@sringeri.net | +91 484 2462350</p>
          </div>`,
      advaita: `<div class="space-y-2">
            <p class="font-serif font-bold text-primary text-sm flex items-center gap-1">📖 Advaita Vedanta Philosophy</p>
            <p class="font-sans">Sri Adi Shankaracharya consolidated the philosophy of absolute non-duality (Advaita). The core thesis is encapsulated in his famous verse:</p>
            <div class="bg-surface-container-high/40 p-2.5 border-l-2 border-primary rounded my-2 font-serif italic text-primary text-center text-xs leading-relaxed">
              "ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः"
            </div>
            <p class="text-[10px] text-center font-semibold text-secondary uppercase tracking-wider -mt-1 mb-2">— Brahmajnanavalimala</p>
            <p class="font-sans">This states three fundamental principles:</p>
            <ul class="list-disc pl-4 space-y-1.5 text-[11px] text-on-surface-variant">
              <li><strong>Brahman is Real:</strong> The absolute, changeless reality, pure consciousness (Sat-Chit-Ananda), which exists beyond time and space.</li>
              <li><strong>The World is Mithya:</strong> The objective universe is not an absolute reality, but relative/apparent, appearing real only due to sensory illusion (Maya).</li>
              <li><strong>Identity of Self:</strong> The individual soul (Jiva) is in essence identical to the absolute consciousness (Brahman). Liberation is realizing this identity.</li>
            </ul>
          </div>`,
      miracles: `<div class="space-y-2">
            <p class="font-serif font-bold text-primary text-sm flex items-center gap-1">🐊 Miracles of Kalady</p>
            <p class="font-sans">Two monumental events occurred in Kalady during Sri Shankara's childhood that shaped his divine path:</p>
            <ul class="list-none space-y-3.5 my-2 pl-1">
              <li>
                <strong class="text-secondary text-xs uppercase tracking-wider flex items-center gap-1">💧 1. Redirecting the Purna River</strong>
                <p class="text-[11px] text-on-surface-variant leading-relaxed">Young Shankara's widowed mother Aryamba would walk daily to the Purna River for her bath. One summer day, she collapsed from extreme heat and exhaustion. Stricken with grief, Shankara composed a prayer to Lord Krishna. The next morning, the Purna River miraculously changed its course, flowing directly past their house.</p>
              </li>
              <li>
                <strong class="text-secondary text-xs uppercase tracking-wider flex items-center gap-1">🐊 2. The Crocodile Miracle at the Ghat</strong>
                <p class="text-[11px] text-on-surface-variant leading-relaxed">Shankara felt the calling of Sannyasa (monasticism), but his mother Aryamba refused permission. While bathing at the river ghat, a crocodile seized Shankara's leg. He cried out to his mother that he was dying, but if she permitted him to take "Apat Sannyasa" (renunciation in the face of death), the crocodile might release him. Desperate to save him, she agreed. Shankara took the mental vow of a monk, and the crocodile instantly let him go.</p>
              </li>
            </ul>
          </div>`,
      location: `<div class="space-y-2">
            <p class="font-serif font-bold text-primary text-sm flex items-center gap-1">📍 Location & Route Guide</p>
            <p class="font-sans">The Sri Adi Shankara Janmabhoomi Kshethram is located in <strong>Thalayattumpilli, Kalady, Vadakkumbhagom, Kerala 683574</strong>, along the banks of the Purna River.</p>
            <div class="my-2">
              <a href="https://maps.app.goo.gl/aMm1yXMobWAqE4YD8"
                target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 bg-primary text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-[#570000] transition-colors">
                🗺️ Open Google Maps Directions
              </a>
            </div>
            <ul class="list-none space-y-2 my-2 pl-1">
              <li class="flex items-start gap-1.5"><span class="text-primary text-[10px] mt-1">✈️</span> <div><strong>By Air:</strong> Cochin International Airport (COK) is just 10 km away. Pre-paid taxis and cabs are readily available from the airport to the temple (approx. 20-minute drive).</div></li>
              <li class="flex items-start gap-1.5"><span class="text-primary text-[10px] mt-1">🚆</span> <div><strong>By Train:</strong> Angamaly Railway Station (AFK) is 8 km away, and Aluva Railway Station (AWY) is 15 km away. Autos, buses, and taxis connect both stations to Kalady.</div></li>
              <li class="flex items-start gap-1.5"><span class="text-primary text-[10px] mt-1">🚌</span> <div><strong>By Road:</strong> Located near State Highway 1, Kalady is well-connected by local KSRTC buses from Ernakulam (35 km) and Thrissur (45 km).</div></li>
            </ul>
          </div>`,
      shankara: `<div class="space-y-2">
            <p class="font-serif font-bold text-primary text-sm flex items-center gap-1">🪷 Life of Sri Adi Shankaracharya</p>
            <p class="font-sans">Sri Adi Shankaracharya (c. 788 – 820 CE) was a philosopher-saint born in Kalady. His life was short but extraordinary:</p>
            <ul class="list-disc pl-4 space-y-1.5 text-[11px] text-on-surface-variant">
              <li><strong>Parentage:</strong> Born to a pious Namboothiri Brahmana couple, Shivaguru and Aryamba, after they prayed to Lord Shiva at Vadakkunnathan Temple.</li>
              <li><strong>Renunciation:</strong> Took monastic vows at age 8 under Guru Govinda Bhagavatpada on the banks of the Narmada River.</li>
              <li><strong>Writings:</strong> Traveled across India, writing profound commentaries (Prasthana Traya Bhashya) on the Upanishads, Bhagavad Gita, and Brahma Sutras.</li>
              <li><strong>Peethams:</strong> Re-established the Sanatana Dharma by establishing four cardinal monasteries (Peethams) in Sringeri (South), Dwaraka (West), Puri (East), and Jyotirmath (North) to preserve scriptural knowledge.</li>
            </ul>
          </div>`,
      shrines: `<div class="space-y-2">
            <p class="font-serif font-bold text-primary text-sm flex items-center gap-1">🏛️ Shrines and Sights in Kalady</p>
            <p class="font-sans">The holy complex in Kalady features several key sites of deep spiritual significance:</p>
            <ul class="list-none space-y-2 my-2 pl-1">
              <li class="flex items-start gap-1.5"><span class="text-primary text-[10px] mt-1">🛕</span> <div><strong>Adi Shankara Shrine:</strong> A beautiful temple housing a life-size murti of Shankaracharya in a seated posture.</div></li>
              <li class="flex items-start gap-1.5"><span class="text-primary text-[10px] mt-1">🛕</span> <div><strong>Goddess Sharadamba Shrine:</strong> Adjacent to the main shrine, dedicated to the Goddess of Learning and Wisdom.</div></li>
              <li class="flex items-start gap-1.5"><span class="text-primary text-[10px] mt-1">🛕</span> <div><strong>Ancestral Sri Krishna Temple:</strong> The family temple of Shankara's parents, which marks the birthplace. This is the only ancient temple surviving from his era.</div></li>
              <li class="flex items-start gap-1.5"><span class="text-primary text-[10px] mt-1">🌊</span> <div><strong>Crocodile Ghat (Muthala Kadavu):</strong> The place on the Purna River where young Shankara was caught by the crocodile.</div></li>
              <li class="flex items-start gap-1.5"><span class="text-primary text-[10px] mt-1">🗼</span> <div><strong>Keerthi Sthambha Mandapam:</strong> A tall 8-story memorial displaying paintings of Adi Shankara's life journey.</div></li>
            </ul>
          </div>`,
      greetings: `<div class="space-y-1">
            <p class="font-serif font-semibold text-primary">Pranams! Namaste.</p>
            <p class="font-sans text-xs">May the blessings of Goddess Sharadamba and Jagadguru Sri Adi Shankaracharya guide you. How may I assist your spiritual journey or pilgrimage details today?</p>
          </div>`,
      fallback: `<div class="space-y-1.5">
            <p class="font-serif font-semibold text-primary">Pranams. I am here to help you.</p>
            <p class="font-sans text-xs">I didn't quite capture that query. Feel free to select from the topics below or ask about them:</p>
            <div class="flex flex-col gap-1 text-[11px] pl-1 font-sans text-on-surface-variant">
              <div>• Type <strong>timings</strong> for temple visiting hours.</div>
              <div>• Type <strong>sevas</strong> to learn about Pujas & supporting Vedic students.</div>
              <div>• Type <strong>lodging</strong> for accommodation details at the guest house.</div>
              <div>• Type <strong>directions</strong> or <strong>location</strong> to plan your travel route.</div>
              <div>• Type <strong>philosophy</strong> or <strong>advaita</strong> to explore Shankara's teachings.</div>
              <div>• Type <strong>miracles</strong> to hear the sacred stories of young Shankara.</div>
              <div>• Type <strong>shrines</strong> to learn about the shrines in Kalady.</div>
            </div>
          </div>`
    };

    function getBotResponse(input) {
      const query = input.toLowerCase().trim();
      if (query.includes('hi') || query.includes('hello') || query.includes('pranam') || query.includes('namaste')) return botReplies.greetings;
      if (query.includes('timing') || query.includes('hour') || query.includes('schedule') || query.includes('open') || query.includes('close') || query.includes('aarti')) return botReplies.timings;
      if (query.includes('seva') || query.includes('puja') || query.includes('offering') || query.includes('archana') || query.includes('sponsor')) return botReplies.sevas;
      if (query.includes('stay') || query.includes('lodging') || query.includes('room') || query.includes('accommodation') || query.includes('guest')) return botReplies.lodging;
      if (query.includes('advaita') || query.includes('philosophy') || query.includes('non-dual') || query.includes('teach')) return botReplies.advaita;
      if (query.includes('location') || query.includes('where') || query.includes('reach') || query.includes('direction') || query.includes('kerala') || query.includes('route') || query.includes('airport')) return botReplies.location;
      if (query.includes('miracle') || query.includes('river') || query.includes('purna') || query.includes('crocodile') || query.includes('ghat') || query.includes('krishna')) return botReplies.miracles;
      if (query.includes('life') || query.includes('biography') || query.includes('shankara') || query.includes('monk') || query.includes('peetham') || query.includes('birth')) return botReplies.shankara;
      if (query.includes('shrine') || query.includes('sight') || query.includes('temple') || query.includes('visit') || query.includes('mandapam') || query.includes('places')) return botReplies.shrines;
      return botReplies.fallback;
    }

    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, tag => ({ '&': '&', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }

    function appendMessage(sender, text) {
      const container = document.getElementById('chatbot-messages');
      if (!container) return;
      const msgDiv = document.createElement('div');
      msgDiv.className = sender === 'user' ? 'flex items-start justify-end gap-2' : 'flex items-start gap-2.5';
      const avatar = sender === 'user'
        ? `<div class="w-8 h-8 rounded-full bg-secondary/15 border border-sandalwood/30 flex items-center justify-center flex-shrink-0 order-2 shadow-sm"><span class="material-symbols-outlined text-secondary text-sm">person</span></div>`
        : `<div class="w-8 h-8 rounded-full bg-primary/10 border border-sandalwood/30 flex items-center justify-center flex-shrink-0 shadow-sm"><span class="material-symbols-outlined text-primary text-sm">support_agent</span></div>`;
      const safeText = sender === 'user' ? escapeHTML(text) : text;
      const bubble = sender === 'user'
        ? `<div class="bg-primary text-white p-3.5 rounded-2xl rounded-tr-none max-w-[80%] text-xs leading-relaxed text-left shadow-sm font-sans">${safeText}</div>`
        : `<div class="bg-surface border border-sandalwood/20 p-3.5 rounded-2xl rounded-tl-none max-w-[82%] text-xs text-on-surface-variant leading-relaxed text-left shadow-sm">${safeText}</div>`;
      msgDiv.innerHTML = avatar + bubble;
      container.appendChild(msgDiv);
      container.scrollTop = container.scrollHeight;
    }

    function sendQuickReply(key) {
      appendMessage('user', key.charAt(0).toUpperCase() + key.slice(1));
      showTypingIndicatorAndReply(botReplies[key]);
    }

    // Keep it local - no APIs
    function handleChatSubmit(event) {
      event.preventDefault();
      const inputEl = document.getElementById('chatbot-input');
      const query = inputEl.value.trim();
      if (!query) return;
      appendMessage('user', query);
      inputEl.value = '';
      const response = getBotResponse(query);
      showTypingIndicatorAndReply(response);
    }

    function showTypingIndicatorAndReply(responseText) {
      const container = document.getElementById('chatbot-messages');
      if (!container) return;
      const indicatorDiv = document.createElement('div');
      indicatorDiv.id = 'chatbot-typing-indicator';
      indicatorDiv.className = 'flex items-start gap-2.5';
      indicatorDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-primary/10 border border-sandalwood/30 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span class="material-symbols-outlined text-primary text-sm">support_agent</span>
            </div>
            <div class="bg-surface border border-sandalwood/20 p-3 rounded-2xl rounded-tl-none text-xs text-on-surface-variant/60 leading-relaxed italic flex items-center gap-1.5 shadow-sm font-sans">
              Typing
              <span class="flex gap-0.5 items-center mt-1">
                <span class="w-1 h-1 bg-on-surface-variant/60 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-1 h-1 bg-on-surface-variant/60 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-1 h-1 bg-on-surface-variant/60 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </span>
            </div>
          `;
      container.appendChild(indicatorDiv);
      container.scrollTop = container.scrollHeight;
      setTimeout(() => {
        const ind = document.getElementById('chatbot-typing-indicator');
        if (ind) ind.remove();
        appendMessage('bot', responseText);
      }, 850);
    }

    // Initialize first dialog item on page load
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        askGuru(1);
      }, 800);
    });

// --- Extracted Script Block ---

(function () {

      /* ---------- 1. Scroll Progress Bar ---------- */
      const progressBar = document.getElementById('scroll-progress');
      function updateProgress() {
        if (!progressBar) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
      }
      window.addEventListener('scroll', updateProgress, { passive: true });

      /* ---------- 2. Parallax Hero & Images ---------- */
      const heroImg = document.getElementById('hero-parallax-img');
      const heroSection = document.getElementById('home');
      function updateParallax(scrollVal) {
        if (window.innerWidth < 768) return;
        const scrollY = typeof scrollVal === 'number' ? scrollVal : (window.scrollY || window.pageYOffset);

        // Hero Image Parallax
        if (heroImg && heroSection && scrollY <= heroSection.offsetHeight) {
          heroImg.style.transform = 'translate3d(0, ' + (scrollY * 0.35) + 'px, 0)';
        }

        // Shrine Cards Image Parallax
        const shrineImages = document.querySelectorAll('#shrine-grid .w-full.h-72 img');
        shrineImages.forEach((img) => {
          const rect = img.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const translateY = (progress - 0.5) * -30; // moves -15px to +15px
            img.style.transition = 'transform 0.12s ease-out';
            img.style.transform = `scale(1.08) translateY(${translateY}px)`;
          }
        });
      }
      window.addEventListener('scroll', () => updateParallax(), { passive: true });
      window.addEventListener('resize', () => updateParallax());

      /* ---------- 3. IntersectionObserver Reveal (item + scale) ---------- */
      const ioCallback = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      };
      const ioOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
      const revealIO = new IntersectionObserver(ioCallback, ioOpts);
      document.querySelectorAll('.reveal-item, .reveal-left, .reveal-right, .reveal-scale')
        .forEach(el => revealIO.observe(el));

      /* ---------- 4. Floating Incense Particles ---------- */
      function spawnParticles() {
        const container = document.getElementById('hero-particles');
        if (!container) return;
        const colors = [
          'rgba(255,225,109,0.5)',
          'rgba(194,178,128,0.4)',
          'rgba(255,107,53,0.3)',
          'rgba(255,255,255,0.3)',
        ];
        for (let i = 0; i < 22; i++) {
          const p = document.createElement('div');
          p.className = 'particle';
          const size = Math.random() * 5 + 2;
          const left = Math.random() * 100;
          const duration = Math.random() * 18 + 12;
          const delay = Math.random() * 14;
          const drift = (Math.random() - 0.5) * 120;
          const color = colors[Math.floor(Math.random() * colors.length)];
          p.style.cssText = `
            width:${size}px; height:${size}px;
            left:${left}%;
            background:${color};
            --drift:${drift}px;
            animation-duration:${duration}s;
            animation-delay:${delay}s;
            filter: blur(${Math.random() * 1.5}px);
          `;
          container.appendChild(p);
        }
      }
      spawnParticles();

      /* ---------- 5. Ambient Audio Toggle with pulse ring & localStorage sync ---------- */
      const audioEl = document.getElementById('ambient-audio');
      const iconOn = document.getElementById('audio-icon-on');
      const iconOff = document.getElementById('audio-icon-off');
      const toggleBtn = document.getElementById('ambient-toggle');
      let audioLoaded = false;

      function setAudioPlayingState(playing) {
        if (!audioEl) return;
        if (!audioLoaded) {
          audioEl.load();
          audioLoaded = true;
        }
        if (playing) {
          audioEl.muted = false;
          audioEl.play().then(() => {
            localStorage.setItem('ambient-audio-playing', 'true');
            if (iconOn) iconOn.style.display = 'block';
            if (iconOff) iconOff.style.display = 'none';
            if (toggleBtn) toggleBtn.classList.add('playing');
          }).catch(err => {
            console.warn('Playback blocked by browser settings. Will retry on next interaction.', err);
          });
        } else {
          audioEl.muted = true;
          audioEl.pause();
          localStorage.setItem('ambient-audio-playing', 'false');
          if (iconOn) iconOn.style.display = 'none';
          if (iconOff) iconOff.style.display = 'block';
          if (toggleBtn) toggleBtn.classList.remove('playing');
        }
      }

      window.toggleAmbientAudio = function () {
        if (!audioEl) return;
        const shouldPlay = audioEl.paused || audioEl.muted;
        setAudioPlayingState(shouldPlay);
      };

      // Autoplay or restore state on page load
      const savedState = localStorage.getItem('ambient-audio-playing');
      if (savedState === 'true') {
        // Try playing immediately
        setAudioPlayingState(true);

        // Setup backup triggers on user interaction
        const startOnGesture = () => {
          if (audioEl && (audioEl.paused || audioEl.muted)) {
            setAudioPlayingState(true);
          }
          window.removeEventListener('click', startOnGesture);
          window.removeEventListener('touchstart', startOnGesture);
          window.removeEventListener('keydown', startOnGesture);
        };
        window.addEventListener('click', startOnGesture);
        window.addEventListener('touchstart', startOnGesture);
        window.addEventListener('keydown', startOnGesture);
      }

      /* ---------- 6. Nav: shadow + shrink + scrolled class ---------- */
      /* ---------- 6. Nav: shadow + scrolled class ---------- */
      const header = document.querySelector('header');
      function updateHeader(scrollY) {
        if (!header) return;
        if (scrollY > 40) {
          header.style.boxShadow = '0 4px 24px rgba(87,0,0,0.10)';
          header.classList.add('scrolled');
        } else {
          header.style.boxShadow = 'none';
          header.classList.remove('scrolled');
        }
      }

      /* ---------- 7. LENIS Buttery Smooth Scroll ---------- */
      let lenis;
      if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          smoothTouch: true,
          touchMultiplier: 1.5,
          infinite: false,
        });

        // Expose globally for anchor scrolls
        window.__lenis = lenis;

        // Drive RAF loop
        function lenisRaf(time) {
          lenis.raf(time);
          requestAnimationFrame(lenisRaf);
        }
        requestAnimationFrame(lenisRaf);

        // Hook into Lenis scroll for progress bar, parallax, nav
        lenis.on('scroll', ({ scroll, limit }) => {
          // Progress bar
          if (progressBar) {
            progressBar.style.width = (limit > 0 ? (scroll / limit) * 100 : 0) + '%';
          }
          // Parallax
          updateParallax(scroll);
          // Nav header
          updateHeader(scroll);
        });

        // Smooth anchor scroll via Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
              e.preventDefault();
              const headerH = header ? header.offsetHeight : 80;
              lenis.scrollTo(target, { offset: -(headerH + 16), duration: 1.6 });
            }
          });
        });

      } else {
        // Fallback if Lenis fails to load
        window.addEventListener('scroll', () => {
          updateProgress();
          updateParallax();
          updateHeader(window.scrollY);
        }, { passive: true });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
              e.preventDefault();
              const headerH = header ? header.offsetHeight : 80;
              window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH - 16, behavior: 'smooth' });
            }
          });
        });
      }

      /* ---------- 8. 3D Tilt on shrine cards ---------- */
      document.querySelectorAll('.shrine-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / (rect.width / 2);
          const dy = (e.clientY - cy) / (rect.height / 2);
          card.style.transform = `perspective(900px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });

      /* ---------- 9. Page link transitions (fade-out then navigate) ---------- */
      document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

        link.addEventListener('click', function (e) {
          try {
            const targetUrl = new URL(href, window.location.href);
            const normalizePath = (p) => {
              let n = p.replace(/\.html$/, '');
              return (n === '' || n === '/index') ? '/' : n;
            };

            // Only handle local transitions
            if (targetUrl.origin === window.location.origin) {
              const targetPath = normalizePath(targetUrl.pathname);
              const currentPath = normalizePath(window.location.pathname);

              if (targetPath === currentPath) {
                if (targetUrl.hash) {
                  e.preventDefault();
                  const targetEl = document.getElementById(targetUrl.hash.slice(1));
                  if (targetEl) {
                    const headerH = header ? header.offsetHeight : 80;
                    if (typeof lenis !== 'undefined') {
                      lenis.scrollTo(targetEl, { offset: -(headerH + 16), duration: 1.6 });
                    } else {
                      window.scrollTo({ top: targetEl.getBoundingClientRect().top + window.scrollY - headerH - 16, behavior: 'smooth' });
                    }
                    history.pushState(null, null, targetUrl.hash);
                  }
                }
              } else {
                // Different local page - navigate immediately without flicker
                window.location.href = href;
              }
            }
          } catch (err) {
            console.warn(err);
          }
        });
      });

      // Scroll to hash on load if present
      if (window.location.hash) {
        setTimeout(() => {
          const targetEl = document.getElementById(window.location.hash.slice(1));
          if (targetEl) {
            const headerH = header ? header.offsetHeight : 80;
            if (typeof lenis !== 'undefined') {
              lenis.scrollTo(targetEl, { offset: -(headerH + 16), immediate: true });
            } else {
              window.scrollTo({ top: targetEl.getBoundingClientRect().top + window.scrollY - headerH - 16 });
            }
          }
        }, 500);
      }

    })();