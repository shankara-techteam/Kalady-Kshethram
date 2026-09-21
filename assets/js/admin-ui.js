// Handle Sidebar Navigation & View Switching
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.admin-view');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.querySelector('aside');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active state in sidebar
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Update breadcrumb
      if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = item.textContent.trim();
      }

      // Switch views
      const targetId = item.getAttribute('data-target');
      views.forEach(view => {
        if (view.id === targetId) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });

      // Close mobile sidebar if open
      if (window.innerWidth < 768 && sidebar) {
        sidebar.classList.add('hidden');
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
      if (!sidebar.classList.contains('hidden')) {
        // Overlay styling for mobile
        sidebar.classList.add('fixed', 'inset-y-0', 'left-0', 'z-50', 'w-64');
      }
    });
  }
});

// Global Toast Notification System
window.showToast = function(type, message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `p-4 rounded-xl text-sm flex items-center gap-3 shadow-lg transform transition-all translate-x-full opacity-0 duration-300 ease-out border min-w-[300px] z-50`;
  
  if (type === 'success') {
    toast.classList.add('bg-green-50', 'text-green-800', 'border-green-200');
    toast.innerHTML = `<span class="material-symbols-outlined text-[20px] text-green-500">check_circle</span> <div>${message}</div>`;
  } else if (type === 'error') {
    toast.classList.add('bg-red-50', 'text-red-800', 'border-red-200');
    toast.innerHTML = `<span class="material-symbols-outlined text-[20px] text-red-500">error</span> <div>${message}</div>`;
  } else {
    toast.classList.add('bg-surface-bright', 'text-on-surface', 'border-sandalwood/30');
    toast.innerHTML = `<span class="material-symbols-outlined text-[20px] text-primary">info</span> <div>${message}</div>`;
  }

  container.appendChild(toast);

  // Trigger entrance animation
  setTimeout(() => {
    toast.classList.remove('translate-x-full', 'opacity-0');
    toast.classList.add('translate-x-0', 'opacity-100');
  }, 10);

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.remove('translate-x-0', 'opacity-100');
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => toast.remove(), 300); // Wait for exit animation
  }, 5000);
};
