# Sarab Restaurant & Fast Food - Full-Stack Web Application

A modern, responsive full-stack culinary showcase and table reservation web application designed for a premier fast-food and casual dining brand. Features an interactive client portal with asynchronous ordering/booking funnels and an authenticated manager control dashboard.

---

## Key Highlights & Modules

- **Modern Responsive Interface:** Fast, mobile-first design built with Tailwind CSS, custom cursive typography accents, sticky glassmorphism navigation, dynamic category filtering, and interactive modal dialogs.
- **Interactive Live Search & Filter:** Real-time client-side food menu search modal with tag-based filtering and instant search suggestions.
- **Asynchronous Table Booking Funnel:** Multi-field reservation engine powered by the JavaScript `Fetch` API, validating booking dates/times and saving directly to MySQL without page reloads (`save_reservation.php`).
- **Zero-Reload Customer Inquiries:** Lead generation and customer support form submitting directly to MySQL (`save_contact.php`).
- **Authenticated Manager Console (`admin.php`):**
  - Real-time KPI summary widgets (Total Bookings, Pending Actions, Today's Guests, Inquiries).
  - Interactive Table Reservation workflow with status updates (`Pending` → `Confirmed` → `Cancelled`).
  - Dedicated Customer Inquiries review panel (`Unread` → `Read`).
  - Single-click record deletion and pre-filled reviewer credentials for zero-friction evaluation.

---

## Technical Stack

| Layer        | Technologies / Implementations                                                             |
| :----------- | :----------------------------------------------------------------------------------------- |
| **Frontend** | HTML5, Tailwind CSS, Font Awesome 6, Vanilla JavaScript (ES6+ Fetch API, DOM Manipulation) |
| **Backend**  | PHP 8.x (Session Authentication, Prepared Statements, JSON Endpoints)                      |
| **Database** | MySQL / MariaDB (`sarab_db`)                                                               |
| **Security** | PDO Prepared Statements (SQL Injection Prevention), `htmlspecialchars` (XSS Sanitization)  |

---

## Database Architecture (`sarab_db`)

The relational database comprises three dedicated tables:

1. **`admins`**: Stores administrative credentials and dashboard access tokens.
2. **`reservations`**: Captures guest bookings, dining party sizes, reservation slots, special requests, and lifecycle statuses.
3. **`contacts`**: Stores customer feedback, event catering queries, subject tags, and response states.

A complete migration script with pre-seeded data is provided in `sarab_db.sql`.

---

## Local Installation & Setup Guide

### 1. Prerequisites

- [XAMPP](https://www.apachefriends.org/) (Apache and MySQL services installed)
- Modern web browser (Chrome, Edge, Firefox)

### 2. Directory Placement

Place the project folder inside your local web server root directory:

```bash
# Path example:
C:\xampp\htdocs\Burger-shop
```
