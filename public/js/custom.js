$(document).ready(function() {
  // 1. Dynamic Navbar Authentication State Switch
  const token = localStorage.getItem('jobizza_token');
  if (token) {
    fetch('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.user) {
        const user = data.user;
        const loginButtons = document.querySelectorAll('a[href="/login"]');
        loginButtons.forEach(btn => {
          const wrapper = document.createElement('div');
          wrapper.className = 'd-inline-flex align-items-center';
          wrapper.style.gap = '5px';
          
          const dashLink = user.role === 'admin' ? '/admin' : '/dashboard';
          
          wrapper.innerHTML = `
            <a href="${dashLink}" class="btn btn-dark font-weight-bold text-3 rounded-pill shadow-sm border-0 px-4 py-2 d-inline-flex align-items-center gap-2" style="background-color: #0284c7 !important; color: #FFFFFF !important; border-radius: 9999px !important; margin-left: 15px; margin-right: 5px; display: inline-flex !important;">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; color: #FFFFFF;">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
               </svg>
               <span>Dashboard</span>
            </a>
            <a href="#" class="signout-action-btn btn btn-dark font-weight-bold text-3 rounded-pill shadow-sm border-0 px-4 py-2 d-inline-flex align-items-center gap-2" style="background-color: #dc2626 !important; color: #FFFFFF !important; border-radius: 9999px !important; margin-left: 5px; margin-right: 10px; display: inline-flex !important;">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; color: #FFFFFF;">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
               </svg>
               <span>Sign Out</span>
            </a>
          `;
          
          wrapper.querySelector('.signout-action-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('jobizza_token');
            window.location.href = '/';
          });
          
          btn.replaceWith(wrapper);
        });
      }
    })
    .catch(err => console.error('Auth verification failed:', err));
  }

  // 2. Dynamic Team Sync (loads members from MongoDB and reinitializes owl-carousel)
  const owl = $('.owl-carousel');
  if (owl.length > 0) {
    fetch('http://localhost:5000/api/team')
    .then(res => res.json())
    .then(response => {
      if (response.success && response.data && response.data.length > 0) {
        const teamMembers = response.data;
        
        // Destroy existing owl-carousel instance if it exists
        if (owl.data('owl.carousel')) {
          owl.owlCarousel('destroy');
        }
        
        owl.empty();
        
        teamMembers.forEach(member => {
          const imageSrc = member.image || 'images/Gaurav new.png';
          const linkedin = member.linkedinUrl || '#';
          const positionName = member.position || member.role || '';
          
          const itemHtml = `
            <div>
              <div class="card border-0">
                <div class="card-img-top position-relative overlay">
                  <a class="custom-link-hover-effects text-decoration-none" data-cursor-effect-hover="plus" target="_blank" href="${linkedin}">
                    <img alt="${member.name}" class="img-fluid" src="${imageSrc}" onerror="this.src='images/Gaurav new.png'"> 
                  </a>
                </div>
                <div class="card-body" style="text-align: center; padding: 12px">
                  <h4 class="text-color-hover-primary text-5 mb-0">
                    <a class="custom-link-hover-effects text-decoration-none" target="_blank" data-cursor-effect-hover="plus" href="${linkedin}">${member.name}</a>
                  </h4>
                  <p class="text-3-5 mb-0">
                    <a class="custom-link-hover-effects text-decoration-none" data-cursor-effect-hover="plus" target="_blank" href="${linkedin}">${positionName}</a>
                  </p>
                </div>
              </div>
            </div>
          `;
          owl.append(itemHtml);
        });
        
        // Reinitialize owl-carousel with same responsive/styling configuration
        owl.owlCarousel({
          responsive: {
            0: { items: 1 },
            576: { items: 1 },
            768: { items: 3 },
            992: { items: 3 },
            1200: { items: 5 }
          },
          margin: 20,
          loop: false,
          nav: false,
          dots: true
        });
      }
    })
    .catch(err => console.error('Failed to load team members:', err));
  }
});
