# Vehicle Rental System Backend

This project is a Spring Boot backend for a vehicle rental system. It uses:
- Java 21
- Spring Boot 3.3
- Spring Security + JWT
- H2 in-memory database
- JPA / Hibernate

## API Base Path
`/api/v1`

## Demo login credentials
- Admin: `admin@vehicle.com` / `admin123`
- Customer: `alice@example.com` / `user123`

## Main flows covered
- Register / Login
- Search vehicles
- View vehicle details
- Create booking
- View my bookings
- Cancel booking
- Start rental / return vehicle
- Admin dashboard, manage bookings, users, reports

## H2 Console
Visit `http://localhost:8080/h2-console` with:
- JDBC URL: `jdbc:h2:mem:vehicle_rental_db`
- Username: `sa`
- Password: empty

## Swagger UI
Visit `http://localhost:8080/swagger-ui/index.html`

## Run
```bash
cd Backend
mvn spring-boot:run
```
