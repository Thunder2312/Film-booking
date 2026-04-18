/**
 * ─────────────────────────────────────────────────────────
 *  API Endpoints Registry
 * ─────────────────────────────────────────────────────────
 *  Single source of truth for every route prefix and path
 *  used by the backend.
 *
 *  This file is documentation-as-code: scan it to see
 *  every endpoint the server exposes at a glance.
 * ─────────────────────────────────────────────────────────
 */

const API_ENDPOINTS = {

  // ── User / Auth ────────────────────────────────────────
  USER: {
    BASE:           '/user',
    GET_ALL:        'GET     /user',
    REGISTER:       'POST    /user/register',
    LOGIN:          'POST    /user/login',
    LOGOUT:         'DELETE  /user/logout',
    GET_UNAPPROVED: 'GET     /user/approveUser',
    APPROVE:        'POST    /user/approveUser',
  },

  // ── Movies ────────────────────────────────────────────
  MOVIES: {
    BASE:           '/movies',
    ADD:            'POST    /movies/addMovie',
    GET_ALL:        'GET     /movies/getMovie',
    GET_BY_ID:      'GET     /movies/getMovie/:movieId',
    DEACTIVATE:     'POST    /movies/deactivateMovie',
  },

  // ── Theaters ──────────────────────────────────────────
  THEATERS: {
    BASE:           '/theaters',
    GET_ALL:        'GET     /theaters/getTheater',
    GET_NAMES:      'GET     /theaters/theaters',
    ADD:            'POST    /theaters/addTheater',
    REMOVE:         'DELETE  /theaters/removeTheater',
  },

  // ── Showtimes ─────────────────────────────────────────
  SHOWTIMES: {
    BASE:           '/showtimes',
    GET_BY_MOVIE:   'GET     /showtimes/getMovieShowTimes/:movieId',
    GET_BY_DAY:     'GET     /showtimes/getDayShowTimes',
    ADD:            'POST    /showtimes/addShowTimes',
  },

  // ── Screens ───────────────────────────────────────────
  SCREENS: {
    BASE:           '/screens',
    GET_BY_THEATER: 'GET     /screens/getScreens/:theater_id',
  },

  // ── Seats ─────────────────────────────────────────────
  SEATS: {
    BASE:           '/seats',
    GET_BY_SHOWTIME:'GET     /seats/getSeats/:showtimeId',
  },

  // ── Payments ──────────────────────────────────────────
  PAYMENTS: {
    BASE:           '/payment',
    CREATE_ORDER:   'POST    /payment/create-order',
    VERIFY:         'POST    /payment/verify-payment',
  },

  // ── Docs ──────────────────────────────────────────────
  DOCS: {
    SWAGGER:        'GET     /api-docs',
  },

};

module.exports = { API_ENDPOINTS };
