import { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname;
  const isLoginPage = currentPage.includes('login.html');

  // Route Protection & State Listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      if (isLoginPage) {
        // window.location.href = 'admin.html'; // Temporarily disabled for UI testing
      } else {
        const userEmailEl = document.getElementById('admin-user-email');
        if (userEmailEl) userEmailEl.textContent = user.email;
      }
    } else {
      // User is signed out
      if (!isLoginPage) {
        // window.location.href = 'login.html'; // Temporarily disabled for UI testing
      }
    }
  });

  // Login Logic (Only runs on login.html)
  if (isLoginPage) {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const errorBox = document.getElementById('login-error');
    const errorText = document.getElementById('login-error-text');

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Reset UI
        errorBox.classList.add('hidden');
        loginBtn.disabled = true;
        const originalBtnHtml = loginBtn.innerHTML;
        loginBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Authenticating...`;

        try {
          await signInWithEmailAndPassword(auth, email, password);
          // onAuthStateChanged will handle the redirect
        } catch (error) {
          errorBox.classList.remove('hidden');
          errorText.textContent = getFriendlyErrorMessage(error.code);
          loginBtn.disabled = false;
          loginBtn.innerHTML = originalBtnHtml;
        }
      });
    }
  }

  // Logout Logic (Runs on admin pages)
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await signOut(auth);
        // onAuthStateChanged will redirect to login.html
      } catch (error) {
        alert("Error logging out: " + error.message);
      }
    });
  }

  // Helper function for user-friendly Firebase errors
  function getFriendlyErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred during login. Please try again.';
    }
  }
});
