INSERT INTO users (first_name, last_name, email, password, role, enabled) VALUES
('Admin', 'User', 'admin@vehicle.com', '$2a$10$k9PNeMoC5PUrcqSag4HptOWtIeP.aSaSMcx.IIDBp4VMyWwZUMG/m', 'ADMIN', true),
('Alice', 'Driver', 'alice@example.com', '$2a$10$CYUCXWDGPIL9EFhDXPbbfuQFNhL9FcLEAYYqmM/8rpPFgOjY5z.8.', 'CUSTOMER', true),
('Rahul', 'Sharma', 'rahul@example.com', '$2a$10$CYUCXWDGPIL9EFhDXPbbfuQFNhL9FcLEAYYqmM/8rpPFgOjY5z.8.', 'CUSTOMER', true);

INSERT INTO vehicles (brand, model, vehicle_type, fuel_type, transmission, model_year, seats, daily_rate, location, registration_number, description, available) VALUES
('BMW', 'X5', 'SUV', 'Petrol', 'Automatic', 2024, 5, 280.00, 'Hyderabad', 'TS-01-BMW-2024', 'Premium SUV for business travel and city comfort.', true),
('Mercedes', 'C-Class', 'Sedan', 'Diesel', 'Automatic', 2023, 5, 220.00, 'Bengaluru', 'KA-02-MER-2023', 'Elegant executive sedan with advanced features.', true),
('Audi', 'Q3', 'SUV', 'Petrol', 'Automatic', 2022, 5, 240.00, 'Chennai', 'TN-03-AUD-2022', 'Compact luxury SUV, ideal for family trips.', true),
('Toyota', 'Innova Crysta', 'MPV', 'Diesel', 'Manual', 2021, 7, 190.00, 'Mumbai', 'MH-04-TOY-2021', 'Spacious MPV with comfort for long distance travel.', true),
('Kia', 'Seltos', 'SUV', 'Petrol', 'Automatic', 2024, 5, 210.00, 'Pune', 'PN-05-KIA-2024', 'Modern SUV with smart connectivity and safety.', true);

INSERT INTO vehicle_images (vehicle_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'),
(1, 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80'),
(2, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80'),
(3, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'),
(4, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'),
(5, 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80');

INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_price, booking_date, status, pickup_location, dropoff_location) VALUES
(2, 1, '2026-09-20', '2026-09-22', 560.00, '2026-09-18', 'CONFIRMED', 'Hyderabad', 'Hyderabad'),
(3, 2, '2026-09-25', '2026-09-27', 440.00, '2026-09-19', 'CONFIRMED', 'Bengaluru', 'Bengaluru'),
(2, 3, '2026-09-30', '2026-10-02', 480.00, '2026-09-20', 'CANCELLED', 'Chennai', 'Chennai');

INSERT INTO rentals (booking_id, started_at, returned_at, status) VALUES
(1, '2026-09-20T09:00:00', '2026-09-22T18:00:00', 'RETURNED'),
(2, '2026-09-25T08:30:00', null, 'ACTIVE');

INSERT INTO vehicle_registrations (vehicle_id, document_type, document_number, issued_date, expiry_date, status) VALUES
(1, 'Registration', 'REG-2024-BMW-1001', '2024-01-15', '2029-01-15', 'VALID'),
(2, 'Registration', 'REG-2023-MERC-1002', '2023-02-20', '2028-02-20', 'VALID'),
(3, 'Registration', 'REG-2022-AUDI-1003', '2022-03-10', '2027-03-10', 'VALID');
