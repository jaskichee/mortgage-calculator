import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';
 
const intlMiddleware = createMiddleware(routing);

export default intlMiddleware;
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(sl|en)/:path*']
};
