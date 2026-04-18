import { environment } from '../../environments/environment';

/**
 * ─── API Configuration ────────────────────────────────────
 *  BASE_URL is sourced from the active environment file so
 *  it automatically switches between dev and prod builds.
 *
 *  All services should import API_CONFIG from here rather
 *  than hardcoding URLs.
 */
export const API_CONFIG = {
  BASE_URL: environment.apiUrl,
  ENDPOINTS: {
    USER:      '/user',
    MOVIES:    '/movies',
    SHOWTIMES: '/showtimes',
    THEATERS:  '/theaters',
    SEATS:     '/seats',
    SCREENS:   '/screens',
    PAYMENT:   '/payment',
  },
};