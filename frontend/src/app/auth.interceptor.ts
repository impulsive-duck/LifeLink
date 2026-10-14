import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const url = window.location.pathname;

  // Never attach Authorization header to public auth and registration endpoints
  const isPublicAuthUrl =
    req.url.includes('/api/auth/login') ||
    req.url.includes('/api/auth/signup') ||
    req.url.includes('/api/bloodbanks/login') ||
    req.url.includes('/api/bloodbanks/register') ||
    req.url.includes('/api/donor/login') ||
    req.url.includes('/api/donor/register') ||
    req.url.includes('/api/admin/login');

  if (isPublicAuthUrl) {
    return next(req);
  }

  let token: string | null = null;

  if (url.startsWith('/hospital') || url.startsWith('/admin')) {
    token = localStorage.getItem('hospital_auth_token') || localStorage.getItem('token');
  } else if (url.startsWith('/donor')) {
    token = localStorage.getItem('donorToken') || localStorage.getItem('token');
  } else {
    // Blood Bank console / default routes
    token = localStorage.getItem('token') 
         || localStorage.getItem('hospital_auth_token') 
         || localStorage.getItem('donorToken');
  }

  if (token && !req.headers.has('Authorization')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
