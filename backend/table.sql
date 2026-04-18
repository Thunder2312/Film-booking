
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);


CREATE TABLE guests (
    guest_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    genre VARCHAR(50),
    language VARCHAR(50),
    rated VARCHAR(10), -- e.g. PG-13, R
    release_date DATE,
    added_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE theaters (
    theater_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location TEXT NOT NULL,
    total_screens INT DEFAULT 1,
    city VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    screen_id INT NOT NULL REFERENCES screens(screen_id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    seat_type VARCHAR(20) DEFAULT 'REGULAR', -- REGULAR, PREMIUM, VIP
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(screen_id, seat_number)
);

CREATE TABLE showtimes (
    showtime_id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
    screen_id INT NOT NULL REFERENCES screens(screen_id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
);

CREATE TABLE screens(
    screen_id SERIAL PRIMARY KEY;
    theater_id INT NOT NULL REFERENCES theaters(theater_id) ON DELETE CASCADE,
    name VARCHAR(20) NOT NULL,
    total_seats INT NOT NULL
)

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    guest_id INT REFERENCES guests(guest_id) ON DELETE SET NULL,
    showtime_id INT NOT NULL REFERENCES showtimes(showtime_id) ON DELETE CASCADE,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, SUCCESS, FAILED, REFUNDED
    UNIQUE(user_id, showtime_id, booking_time)
);

CREATE TABLE showtime_prices(
    showtime_id INT REFERENCES showtimes(showtime_id) ON DELETE CASCADE,
    seat_type VARCHAR(20),
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(showtime_id, seat_type)
);

-- Optional Tables: Enforce that either user_id OR guest_id must be present
ALTER TABLE bookings
ADD CONSTRAINT chk_user_or_guest
CHECK (
    (user_id IS NOT NULL AND guest_id IS NULL)
    OR (user_id IS NULL AND guest_id IS NOT NULL)
);

CREATE TABLE booked_seats (
    booked_seat_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
    seat_id INT NOT NULL REFERENCES seats(seat_id),
    price DECIMAL(10,2) NOT NULL,
    UNIQUE(booking_id, seat_id)
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50), -- e.g., CREDIT_CARD, PAYPAL
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'SUCCESS' -- SUCCESS, FAILED, REFUNDED
);

INSERT INTO seats (screen_id, seat_number, seat_type)
SELECT 
    sc.screen_id,
    chr(64+r) || LPAD(s:text, 2, '0'),
    CASE 
        WHEN r>=10 THEN 'VIP'
        WHEN r>=7 THEN 'PREMIUM'
        ELSE 'REGULAR'
    END 
FROM screens sc
CROSS JOIN generate_series(1,12) r 
CROSS JOIN generate_series(1,10) s 
ON CONFLICT (screen_id, seat_number) DO NOTHING;

CREATE INDEX idx_showtimes_showtime_id ON showtimes(showtime_id);

CREATE INDEX idx_seats_screen_id ON seats(screen_id);

CREATE INDEX idx_showtimes_prices_showtime_id_seat_type
ON showtime_prices(showtime_id, seat_type);

CREATE INDEX idx_booked_seats_seat_id ON booked_seats(seat_id);

CREATE INDEX idx_bookings_booking_id ON booking(booking_id);

CREATE INDEX idx_booking_showtime_payment
ON bookings(showtime_id, payment_status);




