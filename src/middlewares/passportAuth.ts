import passport from './passportConfig.js';
export const requireAuth = passport.authenticate('jwt', { session: false });