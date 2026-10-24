# BidSphere — Online Auction Platform (Backend)

BidSphere is a robust, production-ready Spring Boot backend for a real-time online auction platform. It features concurrent live bidding with optimistic locking, anti-sniping protection, automated auction closing schedulers, WebSocket broadcasts, comprehensive JWT security, image uploading, payments/checkout, watchlists, in-app notifications, and full Swagger/OpenAPI documentation.

---

## 🚀 Key Features

- **Authentication & Authorization**:
  - Stateless JWT token-based authentication.
  - Role-Based Access Control (`ROLE_BIDDER`, `ROLE_SELLER`, `ROLE_ADMIN`).
  - BCrypt password hashing.

- **Real-Time Bidding Engine**:
  - High-concurrency bidding with JPA `@Version` optimistic locking to avoid race conditions.
  - Automatic validation of minimum increments and bidder identity (sellers cannot bid on their own items).
  - **Anti-sniping protection**: Automatically extends auction end time by 2 minutes if a bid is placed in the final 2 minutes.
  - STOMP over WebSocket broadcasts (`/topic/auction/{id}`) for live price updates to all connected bidders.

- **Automated Lifecycle Scheduler**:
  - Background cron scheduler (`AuctionCloseScheduler`) runs every 30 seconds to close expired auctions.
  - Automatically identifies the winning bidder, initializes a `PENDING` payment record, and sends notifications/emails.
  - Marks auctions with no bids as `UNSOLD`.

- **Watchlist & Notifications**:
  - Watchlist APIs allowing users to watch auctions and receive updates.
  - In-app notification system with read/unread tracking and automated email alerts on outbids and auction wins.

- **Checkout & Payments**:
  - Post-auction settlement and simulated checkout for winning bidders.
  - Payment tracking (`PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`) and platform transaction references.
  - Admin revenue analytics.

- **User Profile & Activity Tracking**:
  - Detailed profiles showing total bids placed, auctions won, items listed, and watchlists.
  - Avatar uploads and password change functionality.

- **Admin Oversight**:
  - Platform-wide stats (total users, active/closed auctions, total bids, total revenue).
  - User status toggling (enable/ban accounts).
  - Auction cancellation and category creation.

- **OpenAPI & Swagger Documentation**:
  - Interactive Swagger UI with Bearer JWT authorization at `/swagger-ui/index.html`.

---

## 🛠️ Technology Stack

- **Java**: 17+ (Fully compatible with Java 17 to Java 25 LTS)
- **Framework**: Spring Boot 3.4.1
- **Persistence**: Spring Data JPA & Hibernate
- **Database**: MySQL (Production) / H2 in-memory (Unit & Integration Testing)
- **Security**: Spring Security 6 + JJWT 0.12.6
- **Realtime**: Spring WebSocket + STOMP Messaging
- **Email**: Spring Mail / JavaMailSender (Mailtrap configured)
- **API Docs**: SpringDoc OpenAPI 2.8.6
- **Testing**: JUnit 5, Mockito, Spring Boot Test, MockMvc (48 automated tests)

---

## 📂 Project Structure

```text
bidsphere-backend/
├── src/
│   ├── main/
│   │   ├── java/com/bidsphere/
│   │   │   ├── config/          # Security, Web MVC, WebSocket, Async, OpenAPI configs
│   │   │   ├── controller/      # REST API Controllers (Auth, Auction, Bid, Watchlist, Payment, User, Admin)
│   │   │   ├── dto/             # Request & Response DTOs
│   │   │   ├── entity/          # JPA Entities & Enums
│   │   │   ├── exception/       # Custom Exceptions & GlobalExceptionHandler
│   │   │   ├── repository/      # Spring Data JPA Repositories
│   │   │   ├── scheduler/       # AuctionCloseScheduler (automated lifecycle)
│   │   │   ├── security/        # JWT Authentication Filter, JwtUtil, CustomUserDetailsService
│   │   │   └── service/         # Core business logic services
│   │   └── resources/
│   │       ├── application.properties # Main application config
│   │       └── data.sql               # Seed categories and default admin user
│   └── test/
│       ├── java/com/bidsphere/
│       │   ├── controller/      # Integration tests (Auth, Category, Watchlist, Payment, User)
│       │   └── service/         # Unit tests (Auth, Auction, Bid, Watchlist, Payment, User, Notification)
│       └── resources/
│           ├── application.properties # Isolated H2 testing configuration
│           └── mockito-extensions/    # Subclass mock maker for modern JDKs
```

---

## 🔌 REST API Endpoints Overview

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new bidder or seller account | Public |
| POST | `/api/auth/login` | Authenticate and obtain JWT token | Public |

### Auctions (`/api/auctions`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/auctions` | Get active auctions (paginated) | Public |
| GET | `/api/auctions/{id}` | Get full details of an auction | Public |
| GET | `/api/auctions/search?keyword=...` | Search auctions by title/description | Public |
| GET | `/api/auctions/category/{id}` | Filter active auctions by category | Public |
| GET | `/api/auctions/my` | Get current seller's auctions | Authenticated |
| POST | `/api/auctions` | Create auction with item image (multipart) | Authenticated (Seller) |
| PUT | `/api/auctions/{id}` | Update auction before bids are placed | Authenticated (Owner) |
| DELETE | `/api/auctions/{id}` | Cancel auction | Authenticated (Owner / Admin) |

### Bids (`/api`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auctions/{id}/bids` | Place a bid on an auction | Authenticated (Bidder) |
| GET | `/api/auctions/{id}/bids` | Get bid history for an auction | Public |
| GET | `/api/bids/my` | Get all bids placed by the logged-in user | Authenticated |

### Watchlist (`/api/watchlist`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/watchlist/{auctionId}` | Add auction to user's watchlist | Authenticated |
| DELETE | `/api/watchlist/{auctionId}` | Remove auction from watchlist | Authenticated |
| GET | `/api/watchlist` | Get current user's watchlisted auctions | Authenticated |
| GET | `/api/watchlist/{auctionId}/status`| Check if an auction is in user's watchlist | Authenticated |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/notifications` | Get user notifications (paginated, latest first) | Authenticated |
| GET | `/api/notifications/unread-count`| Get unread notification count | Authenticated |
| PUT | `/api/notifications/{id}/read` | Mark single notification as read | Authenticated |
| PUT | `/api/notifications/read-all` | Mark all notifications as read | Authenticated |
| DELETE | `/api/notifications/{id}` | Delete a notification | Authenticated |

### Payments & Checkout (`/api/payments`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/payments/auction/{auctionId}` | Complete payment for a won auction | Authenticated (Winner) |
| GET | `/api/payments/auction/{auctionId}` | Get payment status for an auction | Authenticated |
| GET | `/api/payments/my` | Get user's payment history | Authenticated |

### User Profile (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/users/profile` | Get current user profile & metrics | Authenticated |
| PUT | `/api/users/profile` | Update profile details and avatar image | Authenticated |
| PUT | `/api/users/change-password` | Update user password | Authenticated |
| GET | `/api/users/won-auctions` | Get list of auctions won by user | Authenticated |
| GET | `/api/users/{id}` | Public profile for a seller/user | Public |

### Admin Operations (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Platform metrics & total revenue | Admin |
| GET | `/api/admin/users` | List all users (paginated) | Admin |
| PUT | `/api/admin/users/{id}/toggle` | Enable/Disable user account | Admin |
| GET | `/api/admin/auctions` | List all platform auctions (with status filter) | Admin |
| PUT | `/api/admin/auctions/{id}/cancel`| Force cancel an auction | Admin |
| GET | `/api/admin/payments` | View all platform transactions | Admin |
| POST | `/api/admin/categories` | Add a new auction category | Admin |

---

## ⚡ WebSocket Live Bidding

- **Connection URL**: `ws://localhost:8080/ws` (SockJS + STOMP)
- **Topic Subscription**: `/topic/auction/{auctionId}`
- **Broadcast Payload**:
```json
{
  "auctionId": 10,
  "currentPrice": 550.00,
  "highestBidderName": "Bob",
  "endTime": "2026-10-24T14:30:00",
  "bidCount": 3
}
```

---

## 🧪 Testing

The test suite runs with an isolated in-memory H2 database, requiring no external MySQL installation.

```bash
cd bidsphere-backend
.\mvnw.cmd test
```

### Test Suite Summary:
- **Total Tests**: 48 tests
- **Failures**: 0
- **Errors**: 0
- **Coverage**:
  - `BidsphereBackendApplicationTests` (Spring context bootstrap)
  - `AuthServiceTest` & `AuthControllerIntegrationTest`
  - `AuctionServiceTest`
  - `BidServiceTest` (optimistic locking, validation, anti-sniping)
  - `WatchlistServiceTest` & `WatchlistControllerIntegrationTest`
  - `PaymentServiceTest` & `PaymentControllerIntegrationTest`
  - `UserServiceTest` & `UserControllerIntegrationTest`
  - `NotificationServiceTest`
  - `CategoryControllerIntegrationTest`

---

## 🏃 Running the Application

### 1. Database Setup (MySQL)
Ensure MySQL is running on port 3306 and create the database:
```sql
CREATE DATABASE bidsphere_db;
```

Default credentials in `application.properties`:
- Username: `root`
- Password: `root`

### 2. Start Application
```bash
cd bidsphere-backend
.\mvnw.cmd spring-boot:run
```

The server will start on port `8080`.
Default admin account created automatically on first run:
- **Email**: `admin@bidsphere.com`
- **Password**: `admin123`

### 3. Interactive API Documentation
Open your browser and visit:
[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)