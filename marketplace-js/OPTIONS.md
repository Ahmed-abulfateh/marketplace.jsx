# Marketplace JSX - Complete Features & Options Guide

A comprehensive document of all available features, pages, API endpoints, and their implementations.

---

## Table of Contents

1. [Authentication & User Management](#authentication--user-management)
2. [Marketplace Core Features](#marketplace-core-features)
3. [Buyer Features](#buyer-features)
4. [Seller Features](#seller-features)
5. [Admin Features](#admin-features)
6. [Multi-Language & Localization](#multi-language--localization)
7. [Frontend Pages & Routes](#frontend-pages--routes)
8. [UI Components](#ui-components)
9. [Backend API Endpoints](#backend-api-endpoints)
10. [Database Models](#database-models)
11. [Development & Deployment](#development--deployment)
12. [Dependencies & Libraries](#dependencies--libraries)

---

## Authentication & User Management

### Sign Up
- **Page:** `src/pages/SignUpPage.jsx`
- **Route:** `/sign-up`
- **Implementation:** React form with validation
- **API Endpoint:** `POST /api/auth/sign-up`
- **Required Fields:**
  - Username
  - Email
  - Phone
  - Password
  - Role (buyer/seller/admin)
- **Features:**
  - Logo lockup with language switcher
  - 2-column layout for username + phone
  - Password validation
  - Role selection dropdown
  - Loading state on submit
  - "Already have an account?" link to sign in
- **Context Method:** `signUp(payload)` via `useMarketplace()`
- **Package:** React Router DOM 7

### Sign In
- **Page:** `src/pages/SignInPage.jsx`
- **Route:** `/sign-in`
- **Implementation:** React form with email/password
- **API Endpoint:** `POST /api/auth/sign-in`
- **Required Fields:**
  - Email
  - Password
- **Features:**
  - Logo lockup at top
  - Labelled form fields
  - Loading state ("Signing in...")
  - "Don't have an account?" link to sign up
  - Bilingual form labels
  - Logo image import from `assets/logo.png`
- **Context Method:** `signIn(payload)` via `useMarketplace()`
- **Package:** React Router DOM 7

### Password Reset
- **Page:** `src/pages/ResetPasswordPage.jsx`
- **Route:** `/reset-password`
- **Implementation:** Two-step password reset flow
- **API Endpoints:**
  - `POST /api/auth/request-password-reset` - Initiate reset
  - `POST /api/auth/reset-password` - Reset with token
- **Features:**
  - Request password reset email
  - Validate reset token
  - Set new password
  - Email notification via Nodemailer (if configured)
- **Context Methods:**
  - `requestPasswordReset()`
  - `resetPassword(token, newPassword)`
- **Package:** Nodemailer (for email sending)

### Sign Out
- **Implementation:** Button in navigation
- **Context Method:** `signOut()` via `useMarketplace()`
- **API Endpoint:** Clears local token and calls `GET /api/bootstrap`
- **Package:** React Router DOM 7

### Profile Management
- **Page:** `src/pages/ProfilePage.jsx`
- **Route:** `/profile` (Protected - buyer/seller/admin)
- **Implementation:** Edit user profile information
- **API Endpoint:** `PATCH /api/profile`
- **Editable Fields:**
  - Username
  - Email
  - Phone
  - Address (line, city, road, block, country)
- **Context Method:** `updateProfile(payload)` via `useMarketplace()`
- **Features:**
  - Form validation
  - Real-time preview
  - Bilingual labels
  - Loading state on submit
- **Package:** React Router DOM 7

---

## Marketplace Core Features

### Listings (Products)
- **Model:** `server/models/Listing.js` (MongoDB/Mongoose)
- **Fields:**
  - `id` (unique string)
  - `title` (string)
  - `description` (string)
  - `price` (number)
  - `image` (string URL)
  - `status` (enum: pending/active/flagged/sold)
  - `sellerId` (reference to User)
  - `catalog` (string - category)
  - `moderationNotes` (array of notes)
  - `reviews` (array with rating, text, authorId, timestamp)
  - `timestamps` (createdAt, updatedAt)

### Create Listing
- **Page:** `src/pages/SellerProductsPage.jsx`
- **Route:** `/seller/products` (Protected - seller)
- **Implementation:** Form to create new marketplace listing
- **API Endpoint:** `POST /api/listings`
- **Required Fields:**
  - Title
  - Description
  - Price
  - Image URL
  - Catalog (category)
- **Context Method:** `createListing(payload)` via `useMarketplace()`
- **Features:**
  - Seller approval required (middleware: `sellerApproved`)
  - Auto-generates unique ID
  - Sets status to "pending" initially
  - Bilingual catalog support
- **Packages:** Mongoose, Express

### Update Listing
- **Route:** `/seller/products` edit form
- **Implementation:** Modify existing listing
- **API Endpoint:** `PATCH /api/listings/:listingId`
- **Updatable Fields:** title, description, price, image, catalog
- **Context Method:** `updateListing(listingId, payload)` via `useMarketplace()`
- **Restrictions:** Only seller owner or admin can update
- **Packages:** Mongoose, Express

### Delete Listing
- **Implementation:** Delete button on seller products page
- **API Endpoint:** `DELETE /api/listings/:listingId`
- **Context Method:** `deleteListing(listingId)` via `useMarketplace()`
- **Restrictions:** Only seller owner or admin can delete
- **Features:** Sets status to "sold" (soft delete)
- **Packages:** Mongoose, Express

### Listing Details Page
- **Page:** `src/pages/ProductPage.jsx`
- **Route:** `/browse/:listingId`
- **Implementation:** Full product page with details, reviews, checkout
- **Features:**
  - Display listing info
  - Show reviews with ratings
  - Add to cart
  - Add to favorites
  - See stock status
  - Related listings
  - Checkout from product
- **Context Methods:**
  - `addListingReview(listingId, payload)`
  - `toggleFavorite(listingId)`
  - `toggleCart(listingId)`
- **Packages:** React Router DOM 7

### List Listings
- **Page:** `src/pages/BrowsePage.jsx`
- **Route:** `/browse`
- **Implementation:** Browse/filter/search all active listings
- **API Endpoint:** `GET /api/bootstrap` (included in store)
- **Features:**
  - Grid layout with listing cards
  - Filter by catalog
  - Search functionality
  - Sort options
  - Pagination
  - "View all" listings button
- **Packages:** React Router DOM 7

### Listing Card Component
- **Component:** `src/components/ListingCard.jsx`
- **Features:**
  - Product image with hover zoom (scale 1.03)
  - Price overlay badge (bottom-left)
  - Favorite heart button (top-right, toggles red)
  - Cart button with contextual icons (cart/checkmark)
  - Stock label indicator
  - Hover animation (translateY -4px + blue glow)
  - Link to product details
- **Styling:** `src/App.css` - `.listing-card`, `.listing-price-badge`, `.listing-fav-btn`, `.listing-cart-btn`
- **Context Integration:** `toggleFavorite()`, `toggleCart()`
- **Packages:** React Router DOM 7

### Favorites
- **Implementation:** Heart toggle on listings
- **Storage:** LocalStorage (demo) or MongoDB (remote)
- **API Endpoint:** `POST /api/favorites/:listingId/toggle`
- **Context:**
  - Method: `toggleFavorite(listingId)`
  - Store: `favoriteIds` array
- **Features:**
  - Toggle favorite status
  - Visual indicator (red heart when favorited)
  - Persistent across sessions
- **Packages:** Axios (API), Mongoose (DB)

### Shopping Cart
- **Implementation:** Add/remove listings from cart
- **Storage:** LocalStorage (demo) or MongoDB (remote)
- **API Endpoint:** `POST /api/cart/:listingId/toggle`
- **Context:**
  - Method: `toggleCart(listingId)`
  - Store: `cartIds` array
  - Computed: `cartTotal`, `cartTotalLabel`
- **Features:**
  - Add/remove items
  - Calculate total price
  - Format currency in BHD
  - Persist across sessions
- **Packages:** Axios (API), Mongoose (DB)

### Reviews & Ratings
- **Model:** Part of Listing model (array field)
- **Implementation:** Leave review on listing after purchase
- **API Endpoint:** `POST /api/listings/:listingId/reviews`
- **Required Fields:**
  - Rating (1-5 stars)
  - Text (review comment)
- **Context Method:** `addListingReview(listingId, payload)`
- **Features:**
  - Buyer-only reviews
  - Author anonymity or name
  - Display on product page
  - Average rating calculation
- **Packages:** Mongoose, Express

---

## Buyer Features

### Checkout
- **Page:** `src/pages/CheckoutPage.jsx`
- **Route:** `/checkout` or `/checkout/:listingId` (Protected - buyer/seller/admin)
- **Implementation:** Proceed to payment
- **API Endpoint:** `POST /api/checkout`
- **Features:**
  - Review cart/single item
  - Billing address form
  - Shipping address form
  - Select payment method
  - Apply coupon/promo codes
  - Calculate total with tax/shipping
  - Order confirmation with ID
- **Context Methods:**
  - `checkout(payload)`
  - `lastCheckout` state
  - `clearLastCheckout()`
- **Packages:** React Router DOM 7, Axios

### Checkout Success
- **Page:** `src/pages/CheckoutSuccessPage.jsx`
- **Route:** `/checkout/success`
- **Features:**
  - Order confirmation page
  - Display order ID
  - Show estimated delivery
  - Next steps information
  - Print invoice option
  - Continue shopping button

### Orders
- **Model:** `server/models/Order.js` (MongoDB/Mongoose)
- **Fields:**
  - `id` (unique string)
  - `buyerId` (reference to User)
  - `sellerId` (reference to User)
  - `listingId` (reference to Listing)
  - `status` (enum: pending/paid/shipped/delivered)
  - `price` (number)
  - `billingAddress` (object)
  - `shippingAddress` (object)
  - `messages` (array of message objects)
  - `timestamps` (createdAt, updatedAt)

### View Orders/Shipments
- **Page:** `src/pages/ShipmentsPage.jsx`
- **Route:** `/shipments` (Protected - buyer/seller/admin)
- **Implementation:** Track purchases and shipments
- **Features:**
  - Timeline of order statuses
  - Tracking information
  - Estimated delivery
  - Order message history
  - Send messages to seller
  - Leave review when delivered
- **Context Methods:**
  - `orders` (array from store)
  - `advanceOrderStatus(orderId, status)`
  - `sendOrderMessage(orderId, text)`

### Order Status Flow
- **Status Progression:** `pending` → `paid` → `shipped` → `delivered`
- **Defined in:** `server/index.js` - `orderStatusFlow` object
- **Context Method:** `getOrderStatusLabel(status)` - Capitalizes first letter
- **API Endpoint:** `PATCH /api/orders/:orderId/advance`
- **Packages:** Mongoose, Express

### Order Messaging
- **API Endpoint:** `POST /api/orders/:orderId/messages`
- **Features:**
  - Buyer-seller communication
  - Message timestamp
  - Author identification
  - Persistent message history
- **Context Method:** `sendOrderMessage(orderId, text)`
- **Packages:** Mongoose, Express

---

## Seller Features

### Seller Dashboard
- **Page:** `src/pages/SellerPage.jsx`
- **Route:** `/seller` (Protected - seller)
- **Layout:** `src/components/SellerLayout.jsx`
- **Features:**
  - Dashboard overview
  - Total sales, active listings, approval rate
  - Quick actions
  - Recent orders
  - Performance metrics
- **Package:** React Router DOM 7

### Seller Products Management
- **Page:** `src/pages/SellerProductsPage.jsx`
- **Route:** `/seller/products` (Protected - seller)
- **Features:**
  - List all seller's listings
  - Create new listing form
  - Edit listing form
  - Delete listing
  - View listing status
  - Bulk actions (if implemented)
  - Filter by status
- **Context Methods:**
  - `createListing(payload)`
  - `updateListing(listingId, payload)`
  - `deleteListing(listingId)`
  - `updateListingStatus(listingId, status)`
- **Packages:** React Router DOM 7, Mongoose

### Seller Orders Management
- **Page:** `src/pages/SellerOrdersPage.jsx`
- **Route:** `/seller/orders` (Protected - seller)
- **Features:**
  - View all incoming orders
  - Filter by status
  - Quick actions (ship, etc.)
  - Revenue tracking
  - Customer information
- **Context Methods:**
  - `orders` (filtered for seller)
  - `advanceOrderStatus(orderId, status)`

### Seller Order Detail
- **Page:** `src/pages/SellerOrderDetailPage.jsx`
- **Route:** `/seller/orders/:orderId` (Protected - seller)
- **Features:**
  - Full order details
  - Customer contact info
  - Message history
  - Mark as shipped
  - Print shipping label
  - Leave notes
- **Context Methods:**
  - `advanceOrderStatus(orderId, status)`
  - `sendOrderMessage(orderId, text)`

### Seller Account Verification
- **Implementation:** Approval workflow
- **API Endpoint:** Seller approval checked via `sellerApproved` middleware
- **Model Field:** `User.accountStatus` (enum: pending/active)
- **Features:**
  - Admin approval required
  - Sellers can only create listings when approved
  - Pending status prevents listing creation
  - Status can be updated by admin
- **Packages:** Mongoose, Express

---

## Admin Features

### Admin Dashboard
- **Page:** `src/pages/AdminPage.jsx`
- **Route:** `/admin` (Protected - admin)
- **Layout:** `src/components/AdminLayout.jsx`
- **Features:**
  - Overview metrics (users, listings, orders, revenue)
  - Recent activity
  - System health
  - Quick actions
  - Charts/analytics (if implemented)
- **Package:** React Router DOM 7

### Admin Sellers Management
- **Page:** `src/pages/AdminSellersPage.jsx`
- **Route:** `/admin/sellers` (Protected - admin)
- **Features:**
  - List all sellers
  - View seller details
  - Approve/reject sellers
  - Suspend/ban sellers
  - View seller listings
  - View seller orders
  - Send messages to sellers
- **API Endpoint:**
  - `GET /api/admin/sellers` - List all sellers
  - `PATCH /api/admin/sellers/:userId/status` - Update seller status
- **Context Methods:**
  - `updateSellerStatus(userId, status)`
- **Packages:** Mongoose, Express

### Admin Moderation
- **Page:** `src/pages/AdminModerationPage.jsx`
- **Route:** `/admin/moderation` (Protected - admin)
- **Features:**
  - View flagged listings
  - Filter by status (pending/active/flagged/sold)
  - Review listing details
  - Add moderation notes
  - Take action (approve/reject)
- **Context Methods:**
  - `updateListingStatus(listingId, status)`
  - `addModerationNote(listingId, note)`

### Admin Moderation Detail
- **Page:** `src/pages/AdminModerationDetailPage.jsx`
- **Route:** `/admin/moderation/:listingId` (Protected - admin)
- **Features:**
  - Full listing review
  - Moderation notes history
  - Add new notes
  - Image validation
  - Description check
  - Price validation
  - Approve/reject listing
- **API Endpoint:** `POST /api/listings/:listingId/notes`
- **Context Methods:**
  - `addModerationNote(listingId, note)`
  - `updateListingStatus(listingId, status)`

### Admin Consumers Management
- **Page:** `src/pages/AdminConsumersPage.jsx`
- **Route:** `/admin/consumers` (Protected - admin)
- **Features:**
  - List all buyers/consumers
  - View buyer profiles
  - View purchase history
  - Suspend/ban buyers
  - Send messages
  - Dispute resolution
- **Package:** React Router DOM 7

---

## Multi-Language & Localization

### Language Context
- **File:** `src/context/LanguageContext.jsx`
- **Implementation:** React Context with localStorage persistence
- **Supported Languages:** English (en), Arabic (ar)
- **LocalStorage Key:** `signal-market-language`
- **Features:**
  - Toggle between EN and AR
  - RTL/LTR text direction
  - HTML lang and dir attributes
  - localStorage persistence
  - Locale-aware number formatting

### Language Switcher Component
- **Component:** `src/components/LanguageSwitcher.jsx`
- **Placement:** SignIn/SignUp pages, navigation
- **Features:**
  - EN/AR toggle button
  - Current language indicator
  - Smooth language switching
  - Icons/flags for languages

### Bilingual Content
- **File:** `src/content/copy.js`
- **Implementation:** Object with EN and AR translations
- **Context Methods:**
  - `copy` - Full copy object for current language
  - `translateRoleLabel(role)` - Translate user roles (buyer/seller/admin)
  - `translateListingStatus(status)` - Translate listing statuses
  - `translateOrderStatus(status)` - Translate order statuses
  - `translateCatalogText(value)` - Translate product categories

### Currency Localization
- **Currency:** Bahraini Dinar (BHD)
- **Locale:** `en-BH` or `ar-BH` based on language
- **Method:** `formatCurrency(amount)` from LanguageContext
- **Implementation:** `Intl.NumberFormat` with 3 decimal places
- **Used in:** Cart total, pricing, checkout
- **Package:** JavaScript built-in Intl API

### RTL Support
- **Implementation:** Document-level RTL/LTR
- **CSS Variables:**
  - Used throughout styles
  - Grid and flex layouts adapt to direction
- **Styling File:** `src/index.css` - CSS variables with RTL considerations
- **Features:**
  - Automatic text alignment
  - Margin/padding flipping
  - Icon mirroring (if needed)

---

## Frontend Pages & Routes

### Home Page
- **Component:** `src/pages/HomePage.jsx`
- **Route:** `/` (index)
- **Layout:** MarketplaceLayout
- **Sections:**
  - **Hero Section**
    - Large title and CTA buttons
    - Glow effect background
    - Status pills with pulsing indicator
    - Hero card with workflow steps
  - **Stats Band**
    - 4-column statistics (listings count, 100% verified, BHD, 3 roles)
    - Bilingual labels
  - **Features Grid**
    - 4 feature cards (Escrow, Shipment Tracking, Verification, Dispute Support)
    - SVG icon per feature
    - Description text
  - **Featured Listings**
    - Show top 3 listings with ListingCard
    - "View all" button
  - **How It Works**
    - 4 numbered step cards
    - Bilingual step labels
    - Smooth transitions
  - **Operating Rails**
    - 3-column section (Buyer/Seller/Admin)
    - Feature lists per role
  - **Seller CTA Banner**
    - Shown only to unauthenticated users
    - Call to action to become seller
    - Metrics display (live listings, approval rate, payout speed)
- **Styling:** Comprehensive in `src/App.css` (`.home-*` classes)
- **Packages:** React, React Router DOM 7

### Browse Page
- **Component:** `src/pages/BrowsePage.jsx`
- **Route:** `/browse`
- **Layout:** MarketplaceLayout
- **Features:**
  - List all active listings
  - Filtering options
  - Search bar
  - Sort by (price, newest, rating, etc.)
  - Grid layout with ListingCard components
  - Pagination or infinite scroll
- **Packages:** React, React Router DOM 7

### Product/Listing Detail Page
- **Component:** `src/pages/ProductPage.jsx`
- **Route:** `/browse/:listingId`
- **Layout:** MarketplaceLayout
- **Features:**
  - Large product image gallery
  - Title, description, price
  - Stock availability
  - Seller information with rating
  - Add to cart button
  - Add to favorites button
  - Reviews section with star ratings
  - Related products carousel
  - Checkout option
- **Context Methods:**
  - `toggleFavorite(listingId)`
  - `toggleCart(listingId)`
  - `addListingReview(listingId, payload)`
- **Packages:** React, React Router DOM 7

### Sign In Page
- **Component:** `src/pages/SignInPage.jsx`
- **Route:** `/sign-in`
- **Layout:** Full-width (no MarketplaceLayout)
- **Features:**
  - Logo lockup (logo + brand name + language switcher)
  - Email field with label
  - Password field with label
  - Submit button with loading state
  - "Don't have an account?" link
  - Form validation
  - Error messages
  - Bilingual labels
- **Styling:** `.auth-panel-narrow`, `.auth-logo-lockup`
- **Packages:** React, React Router DOM 7

### Sign Up Page
- **Component:** `src/pages/SignUpPage.jsx`
- **Route:** `/sign-up`
- **Layout:** Full-width (no MarketplaceLayout)
- **Features:**
  - Logo lockup at top
  - Username + phone fields (2-column layout)
  - Email field (full width)
  - Password field (full width)
  - Role select dropdown (full width)
  - Submit button with loading state
  - "Already have an account?" link
  - Form validation
  - Error messages
  - Bilingual labels
- **Styling:** `.auth-panel-narrow`, `.auth-form-two-col`
- **Packages:** React, React Router DOM 7

### Profile Page
- **Component:** `src/pages/ProfilePage.jsx`
- **Route:** `/profile` (Protected - buyer/seller/admin)
- **Layout:** MarketplaceLayout
- **Features:**
  - Edit personal information
  - Change email/password
  - Update address fields
  - View account type (role)
  - Delete account option (if implemented)
  - Settings preferences
- **Context Method:** `updateProfile(payload)`
- **Packages:** React, React Router DOM 7

### Checkout Page
- **Component:** `src/pages/CheckoutPage.jsx`
- **Route:** `/checkout` or `/checkout/:listingId` (Protected - buyer/seller/admin)
- **Layout:** MarketplaceLayout
- **Features:**
  - Order review (items, quantity, price)
  - Billing address form
  - Shipping address form
  - Payment method selection
  - Coupon/promo code input
  - Order summary with tax/shipping
  - Confirm order button
  - Terms & conditions checkbox
- **Context Method:** `checkout(payload)`
- **Packages:** React, React Router DOM 7

### Checkout Success Page
- **Component:** `src/pages/CheckoutSuccessPage.jsx`
- **Route:** `/checkout/success`
- **Layout:** MarketplaceLayout
- **Features:**
  - Order confirmation message
  - Order ID display
  - Estimated delivery date
  - Next steps information
  - Print invoice button
  - Continue shopping button
- **Packages:** React, React Router DOM 7

### Shipments/Orders Tracking Page
- **Component:** `src/pages/ShipmentsPage.jsx`
- **Route:** `/shipments` (Protected - buyer/seller/admin)
- **Layout:** MarketplaceLayout
- **Features:**
  - Timeline view of all orders
  - Order status tracking
  - Shipment tracking info
  - Estimated delivery dates
  - Message history per order
  - Send message to seller
  - Leave review option
- **Context Methods:**
  - `orders` (from store)
  - `advanceOrderStatus(orderId, status)`
  - `sendOrderMessage(orderId, text)`
- **Packages:** React, React Router DOM 7

### Reset Password Page
- **Component:** `src/pages/ResetPasswordPage.jsx`
- **Route:** `/reset-password`
- **Layout:** Full-width (no MarketplaceLayout)
- **Features:**
  - Step 1: Request password reset (email)
  - Step 2: Validate token from email link
  - Step 3: Enter new password
  - Confirmation message
  - Link to sign in
- **Context Methods:**
  - `requestPasswordReset()`
  - `resetPassword(token, newPassword)`
- **Packages:** React, React Router DOM 7

### Deployment/Status Page
- **Component:** `src/pages/DeploymentPage.jsx`
- **Route:** `/deployment`
- **Layout:** Full-width or MarketplaceLayout
- **Features:**
  - System status information
  - API health check
  - Deployment information
  - Backend URL status
  - Database connection status
  - Demo vs Production mode indicator

### Seller Dashboard
- **Component:** `src/pages/SellerPage.jsx`
- **Route:** `/seller` (Protected - seller)
- **Layout:** SellerLayout
- **Features:**
  - Quick stats (total sales, active listings, avg rating)
  - Recent orders
  - Top products
  - Quick actions
- **Packages:** React, React Router DOM 7

### Seller Products Page
- **Component:** `src/pages/SellerProductsPage.jsx`
- **Route:** `/seller/products` (Protected - seller)
- **Layout:** SellerLayout
- **Features:**
  - List seller's listings
  - Create new listing form
  - Edit listing form
  - Delete listing
  - View product stats
  - Filter by status
- **Packages:** React, React Router DOM 7

### Seller Orders Page
- **Component:** `src/pages/SellerOrdersPage.jsx`
- **Route:** `/seller/orders` (Protected - seller)
- **Layout:** SellerLayout
- **Features:**
  - View all incoming orders
  - Filter by status
  - Customer information
  - Quick actions (ship, message)
  - Revenue tracking per order
- **Packages:** React, React Router DOM 7

### Seller Order Detail Page
- **Component:** `src/pages/SellerOrderDetailPage.jsx`
- **Route:** `/seller/orders/:orderId` (Protected - seller)
- **Layout:** SellerLayout
- **Features:**
  - Full order details
  - Customer information
  - Item details
  - Shipping address
  - Message history
  - Status change buttons
  - Print shipping label option
- **Packages:** React, React Router DOM 7

### Admin Dashboard
- **Component:** `src/pages/AdminPage.jsx`
- **Route:** `/admin` (Protected - admin)
- **Layout:** AdminLayout
- **Features:**
  - System overview
  - Key metrics (total users, listings, orders, revenue)
  - Recent activity feed
  - System health indicators
  - Quick actions
- **Packages:** React, React Router DOM 7

### Admin Sellers Page
- **Component:** `src/pages/AdminSellersPage.jsx`
- **Route:** `/admin/sellers` (Protected - admin)
- **Layout:** AdminLayout
- **Features:**
  - List all sellers
  - Filter by status (pending/active)
  - Seller details view
  - Approve/suspend sellers
  - View seller metrics
  - Message sellers
- **API Methods:**
  - `GET /api/admin/sellers`
  - `PATCH /api/admin/sellers/:userId/status`
- **Packages:** React, React Router DOM 7

### Admin Moderation Page
- **Component:** `src/pages/AdminModerationPage.jsx`
- **Route:** `/admin/moderation` (Protected - admin)
- **Layout:** AdminLayout
- **Features:**
  - List flagged listings
  - Filter by status
  - Quick review preview
  - Action buttons (approve/reject/review)
  - Listing details modal
- **Packages:** React, React Router DOM 7

### Admin Moderation Detail Page
- **Component:** `src/pages/AdminModerationDetailPage.jsx`
- **Route:** `/admin/moderation/:listingId` (Protected - admin)
- **Layout:** AdminLayout
- **Features:**
  - Full listing review
  - Image validation
  - Description review
  - Price check
  - Moderation notes history
  - Add new moderation notes
  - Approve/reject/flag listing
- **Packages:** React, React Router DOM 7

### Admin Consumers Page
- **Component:** `src/pages/AdminConsumersPage.jsx`
- **Route:** `/admin/consumers` (Protected - admin)
- **Layout:** AdminLayout
- **Features:**
  - List all buyers
  - Search and filter
  - View buyer profiles
  - Purchase history
  - Account status
  - Suspend/ban buyers
  - Message buyers
- **Packages:** React, React Router DOM 7

---

## UI Components

### MarketplaceLayout
- **File:** `src/components/MarketplaceLayout.jsx`
- **Purpose:** Main layout shell for most pages
- **Components:**
  - Sticky header with navigation
  - Search bar with filters
  - Shopping cart icon
  - Profile dropdown
  - Language switcher
  - Main content (Outlet)
  - Professional footer (4-column grid)
- **Styling:** 
  - `.site-header` - sticky header
  - `.site-footer` - 4-column grid footer
  - `.footer-brand` - brand column
  - `.footer-col` - link columns
  - `.footer-bottom` - copyright bar
- **Package:** React Router DOM 7

### SellerLayout
- **File:** `src/components/SellerLayout.jsx`
- **Purpose:** Layout for seller dashboard pages
- **Components:**
  - Sidebar navigation (seller specific)
  - Breadcrumb trail
  - Main content (Outlet)
  - Footer
- **Features:**
  - Links to seller pages (dashboard, products, orders)
  - Quick stats
  - Help/support links
- **Package:** React Router DOM 7

### AdminLayout
- **File:** `src/components/AdminLayout.jsx`
- **Purpose:** Layout for admin dashboard pages
- **Components:**
  - Admin sidebar navigation
  - Page title/breadcrumb
  - Main content (Outlet)
  - Footer
- **Features:**
  - Links to admin pages (dashboard, sellers, moderation, consumers)
  - Quick stats
  - Admin-specific actions
- **Package:** React Router DOM 7

### ListingCard
- **File:** `src/components/ListingCard.jsx`
- **Purpose:** Reusable product card component
- **Props:**
  - `listing` - listing object
  - `onClick` - optional click handler
  - `className` - additional CSS classes
- **Features:**
  - Product image with hover zoom
  - Price overlay badge (bottom-left)
  - Favorite heart button (top-right)
  - Cart button with contextual icon
  - Stock label
  - Title and description
  - Seller information
  - Link to product page
- **Styling:**
  - `.listing-card` - main card
  - `.listing-image-stage` - image container with overflow hidden
  - `.listing-price-badge` - price overlay
  - `.listing-fav-btn` - favorite button
  - `.listing-fav-btn-active` - favorited state
  - `.listing-cart-btn` - cart button
  - `.listing-cart-btn-active` - in-cart state
  - `.listing-stock-label` - stock indicator
- **Context Methods Used:**
  - `toggleFavorite(listingId)`
  - `toggleCart(listingId)`
- **Packages:** React, React Router DOM 7

### PageHero
- **File:** `src/components/PageHero.jsx`
- **Purpose:** Reusable page header/hero section
- **Props:**
  - `title` - page title
  - `subtitle` - optional subtitle
  - `backgroundImage` - optional background
- **Features:**
  - Large title display
  - Subtitle text
  - Centered layout
  - Professional styling
- **Styling:** `.page-hero-section`
- **Packages:** React

### LanguageSwitcher
- **File:** `src/components/LanguageSwitcher.jsx`
- **Purpose:** Language toggle button component
- **Features:**
  - EN/AR toggle
  - Current language indicator
  - Updates document direction
  - Updates localStorage
  - Bilingual button labels
- **Context:** Uses `useLanguage()` hook
- **Styling:** `.language-switcher-button`
- **Packages:** React

### ProtectedRoute
- **File:** `src/components/ProtectedRoute.jsx`
- **Purpose:** Route protection based on user role
- **Props:**
  - `roles` - array of allowed roles (e.g., ['buyer', 'seller', 'admin'])
- **Features:**
  - Check if user is authenticated
  - Verify user role
  - Redirect to sign-in if not authenticated
  - Show 403 error if wrong role
  - Works with React Router DOM 7 outlet pattern
- **Context:** Uses `useMarketplace()` hook
- **Packages:** React Router DOM 7

---

## Backend API Endpoints

### Authentication Endpoints

#### POST /api/auth/sign-in
- **Purpose:** User login
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt.token.here",
    "store": { /* store object */ }
  }
  ```
- **Authentication:** None required
- **Error Handling:** 401 Unauthorized if credentials invalid
- **Implementation:** `server/index.js` line 398
- **Packages:** JWT, bcrypt

#### POST /api/auth/sign-up
- **Purpose:** User registration
- **Request Body:**
  ```json
  {
    "username": "newuser",
    "email": "new@example.com",
    "phone": "+97312345678",
    "password": "password123",
    "role": "buyer" | "seller" | "admin"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt.token.here",
    "store": { /* store object */ }
  }
  ```
- **Validation:**
  - Email must be unique
  - Phone must be unique
  - Username required
  - Password hashed with bcrypt
- **Implementation:** `server/index.js` line 418
- **Packages:** JWT, bcrypt, Mongoose

#### POST /api/auth/request-password-reset
- **Purpose:** Request password reset email
- **Request Body:** None (uses current session)
- **Authentication:** Required (buyer/seller/admin)
- **Response:**
  ```json
  {
    "message": "Password reset email sent",
    "store": { /* store object */ }
  }
  ```
- **Features:**
  - Generates reset token
  - Sets expiry (30 minutes)
  - Sends email via Nodemailer
- **Implementation:** `server/index.js` line 462
- **Packages:** Nodemailer, JWT, Mongoose

#### POST /api/auth/reset-password
- **Purpose:** Reset password with token
- **Request Body:**
  ```json
  {
    "token": "reset.token",
    "newPassword": "newpassword123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password reset successful",
    "store": { /* store object */ }
  }
  ```
- **Validation:**
  - Token must be valid and not expired
  - New password must meet requirements
- **Implementation:** `server/index.js` line 492
- **Packages:** JWT, bcrypt, Mongoose

#### GET /api/bootstrap
- **Purpose:** Get complete store data for current session
- **Authentication:** Optional (reads token if present)
- **Response:**
  ```json
  {
    "store": {
      "session": null | { /* user object */ },
      "listings": [ /* all active listings */ ],
      "orders": [ /* user's orders */ ],
      "favoriteIds": [ "id1", "id2" ],
      "cartIds": [ "id3", "id4" ],
      "pendingSellers": [ /* pending seller list */ ]
    }
  }
  ```
- **Implementation:** `server/index.js` line 393
- **Used By:** Initialize app state, sign-out
- **Packages:** JWT, Mongoose

#### GET /api/health
- **Purpose:** Health check for server
- **Response:**
  ```json
  {
    "status": "ok",
    "timestamp": "2024-01-01T12:00:00Z"
  }
  ```
- **Implementation:** `server/index.js` line 389

---

### Profile Endpoints

#### PATCH /api/profile
- **Purpose:** Update user profile
- **Authentication:** Required (buyer/seller/admin)
- **Request Body:**
  ```json
  {
    "username": "newusername",
    "email": "newemail@example.com",
    "phone": "+97312345678",
    "addressLine": "123 Main St",
    "city": "Manama",
    "road": "Road 1",
    "block": "Block 1",
    "country": "Bahrain"
  }
  ```
- **Response:**
  ```json
  {
    "store": { /* updated store */ }
  }
  ```
- **Validation:**
  - Email/phone uniqueness check
  - Required fields validation
- **Implementation:** `server/index.js` line 517
- **Packages:** Mongoose, Express

---

### Listing Endpoints

#### POST /api/listings
- **Purpose:** Create new listing
- **Authentication:** Required (seller/admin)
- **Middleware:** `sellerApproved` - checks if seller is approved
- **Request Body:**
  ```json
  {
    "title": "Product Name",
    "description": "Product description",
    "price": 25.500,
    "image": "https://example.com/image.jpg",
    "catalog": "electronics"
  }
  ```
- **Response:**
  ```json
  {
    "store": { /* updated store with new listing */ }
  }
  ```
- **Validation:**
  - Required fields validation
  - Price must be positive
  - Seller must be approved
- **Implementation:** `server/index.js` line 585
- **Packages:** Mongoose, Express

#### PATCH /api/listings/:listingId
- **Purpose:** Update existing listing
- **Authentication:** Required (seller/admin)
- **Middleware:** `sellerApproved`
- **Request Body:** Same as POST (partial update)
- **Response:**
  ```json
  {
    "store": { /* updated store */ }
  }
  ```
- **Authorization:** Only listing owner or admin can update
- **Implementation:** `server/index.js` line 615
- **Packages:** Mongoose, Express

#### DELETE /api/listings/:listingId
- **Purpose:** Delete/soft-delete listing
- **Authentication:** Required (seller/admin)
- **Middleware:** `sellerApproved`
- **Response:**
  ```json
  {
    "store": { /* updated store */ }
  }
  ```
- **Implementation:** Sets status to "sold" (soft delete)
- **Implementation File:** `server/index.js` line 639
- **Packages:** Mongoose, Express

#### PATCH /api/listings/:listingId/status
- **Purpose:** Update listing status
- **Authentication:** Required (seller/admin)
- **Middleware:** `sellerApproved`
- **Request Body:**
  ```json
  {
    "status": "pending|active|flagged|sold"
  }
  ```
- **Response:**
  ```json
  {
    "store": { /* updated store */ }
  }
  ```
- **Status Flow:** pending → active (after admin approval)
- **Implementation:** `server/index.js` line 660
- **Packages:** Mongoose, Express

---

### Favorites Endpoints

#### POST /api/favorites/:listingId/toggle
- **Purpose:** Add/remove listing from favorites
- **Authentication:** Required (buyer/seller/admin)
- **Response:**
  ```json
  {
    "store": { /* updated store with new favoriteIds */ }
  }
  ```
- **Implementation:** Toggles ID in favoriteIds array
- **Storage:** User session store (MongoDB or localStorage)
- **Implementation File:** `server/index.js` line 565
- **Packages:** Mongoose, Express

---

### Cart Endpoints

#### POST /api/cart/:listingId/toggle
- **Purpose:** Add/remove listing from shopping cart
- **Authentication:** Required (buyer/seller/admin)
- **Response:**
  ```json
  {
    "store": { /* updated store with new cartIds */ }
  }
  ```
- **Implementation:** Toggles ID in cartIds array
- **Storage:** User session store
- **Implementation File:** `server/index.js` line 575
- **Packages:** Mongoose, Express

---

### Checkout Endpoints

#### POST /api/checkout
- **Purpose:** Complete purchase and create order(s)
- **Authentication:** Required (buyer/seller/admin)
- **Request Body:**
  ```json
  {
    "billingAddress": {
      "line": "123 Main St",
      "city": "Manama",
      "country": "Bahrain"
    },
    "shippingAddress": {
      "line": "123 Main St",
      "city": "Manama",
      "country": "Bahrain"
    }
  }
  ```
- **Response:**
  ```json
  {
    "confirmation": {
      "orderId": "ord-xxx",
      "total": 100.500,
      "estimatedDelivery": "2024-01-15"
    },
    "store": { /* updated store with cleared cart */ }
  }
  ```
- **Process:**
  - Validates addresses
  - Creates Order records for each cart item
  - Clears cart
  - Sets order status to "pending"
- **Implementation:** `server/index.js` line 859
- **Packages:** Mongoose, Express

---

### Order Endpoints

#### PATCH /api/orders/:orderId/advance
- **Purpose:** Advance order to next status
- **Authentication:** Required (seller/admin)
- **Request Body:**
  ```json
  {
    "status": "pending|paid|shipped|delivered"
  }
  ```
- **Response:**
  ```json
  {
    "store": { /* updated store */ }
  }
  ```
- **Status Flow:** pending → paid → shipped → delivered
- **Defined in:** `server/index.js` - `orderStatusFlow` object
- **Implementation:** `server/index.js` line 687
- **Packages:** Mongoose, Express

#### POST /api/orders/:orderId/messages
- **Purpose:** Send message on order
- **Authentication:** Required (buyer/seller/admin)
- **Request Body:**
  ```json
  {
    "text": "Message content"
  }
  ```
- **Response:**
  ```json
  {
    "store": { /* updated store */ }
  }
  ```
- **Features:**
  - Adds timestamp to message
  - Stores sender ID
  - Persists in Order.messages array
- **Implementation:** `server/index.js` line 731
- **Packages:** Mongoose, Express

---

### Review Endpoints

#### POST /api/listings/:listingId/reviews
- **Purpose:** Add review to listing
- **Authentication:** Required (buyer/admin)
- **Request Body:**
  ```json
  {
    "rating": 1-5,
    "text": "Review comment text"
  }
  ```
- **Response:**
  ```json
  {
    "store": { /* updated store */ }
  }
  ```
- **Features:**
  - Stores author ID
  - Adds timestamp
  - Buyer-only constraint
  - Aggregate rating calculation
- **Implementation:** `server/index.js` line 767
- **Packages:** Mongoose, Express

---

### Moderation Endpoints

#### POST /api/listings/:listingId/notes
- **Purpose:** Add moderation note to flagged listing
- **Authentication:** Required (admin only)
- **Request Body:**
  ```json
  {
    "note": "Moderation note content"
  }
  ```
- **Response:**
  ```json
  {
    "store": { /* updated store */ }
  }
  ```
- **Features:**
  - Admin-only access
  - Stores note with timestamp
  - Persists in Listing.moderationNotes array
  - Used in listing review workflow
- **Implementation:** `server/index.js` line 671
- **Packages:** Mongoose, Express

---

### Admin Endpoints

#### GET /api/admin/sellers
- **Purpose:** Get list of all sellers
- **Authentication:** Required (admin only)
- **Query Parameters:**
  - `status` - filter by status (pending/active)
  - `search` - search by username/email
- **Response:**
  ```json
  {
    "sellers": [
      {
        "id": "user-xxx",
        "username": "seller1",
        "email": "seller@example.com",
        "accountStatus": "active|pending",
        "listingCount": 5,
        "approvalRate": 95
      }
    ]
  }
  ```
- **Implementation:** `server/index.js` line 826
- **Packages:** Mongoose, Express

#### PATCH /api/admin/sellers/:userId/status
- **Purpose:** Update seller approval status
- **Authentication:** Required (admin only)
- **Request Body:**
  ```json
  {
    "status": "pending|active"
  }
  ```
- **Response:**
  ```json
  {
    "store": { /* updated store */ }
  }
  ```
- **Features:**
  - Approve/reject sellers
  - Affects seller's ability to create listings
- **Implementation:** `server/index.js` line 839
- **Packages:** Mongoose, Express

---

## Database Models

### User Model
- **File:** `server/models/User.js`
- **Database:** MongoDB (Mongoose)
- **Fields:**
  - `id` (String, unique, required) - User ID
  - `username` (String, required)
  - `email` (String, unique, required)
  - `phone` (String, unique, required)
  - `addressLine` (String, default: '')
  - `city` (String, default: '')
  - `road` (String, default: '')
  - `block` (String, default: '')
  - `country` (String, default: '')
  - `passwordHash` (String, required) - Bcrypt hash
  - `role` (String, enum: ['buyer', 'seller', 'admin'], required)
  - `accountStatus` (String, enum: ['pending', 'active'], default: 'active')
  - `passwordResetToken` (String, nullable) - JWT token for password reset
  - `passwordResetExpiry` (Date, nullable) - Reset token expiry
  - `timestamps` - createdAt, updatedAt
- **Indexes:** id, email, phone unique
- **Packages:** Mongoose

### Listing Model
- **File:** `server/models/Listing.js`
- **Database:** MongoDB (Mongoose)
- **Fields:**
  - `id` (String, unique, required) - Listing ID
  - `title` (String, required)
  - `description` (String, required)
  - `price` (Number, required)
  - `image` (String, required) - Image URL
  - `status` (String, enum: ['pending', 'active', 'flagged', 'sold'], default: 'pending')
  - `sellerId` (String, required) - Reference to User
  - `catalog` (String, required) - Product category
  - `moderationNotes` (Array) - Admin notes
  - `reviews` (Array) - Review objects with rating, text, authorId, timestamp
  - `timestamps` - createdAt, updatedAt
- **Indexes:** id, sellerId, status
- **Packages:** Mongoose

### Order Model
- **File:** `server/models/Order.js`
- **Database:** MongoDB (Mongoose)
- **Fields:**
  - `id` (String, unique, required) - Order ID
  - `buyerId` (String, required) - Reference to User
  - `sellerId` (String, required) - Reference to User
  - `listingId` (String, required) - Reference to Listing
  - `status` (String, enum: ['pending', 'paid', 'shipped', 'delivered'], default: 'pending')
  - `price` (Number, required) - Order price at time of purchase
  - `billingAddress` (Object) - Address details
  - `shippingAddress` (Object) - Address details
  - `messages` (Array) - Message objects with text, authorId, timestamp
  - `timestamps` - createdAt, updatedAt
- **Indexes:** id, buyerId, sellerId, listingId
- **Packages:** Mongoose

### AppState Model
- **File:** `server/models/AppState.js`
- **Database:** MongoDB (Mongoose)
- **Purpose:** Store per-user application state (favorites, cart, etc.)
- **Fields:**
  - `userId` (String, unique, required)
  - `favoriteIds` (Array of strings)
  - `cartIds` (Array of strings)
  - `timestamps` - createdAt, updatedAt
- **Usage:** Persists user preferences and cart across sessions
- **Packages:** Mongoose

---

## Development & Deployment

### Development Setup

#### Install Dependencies
```bash
cd marketplace-js
npm install
```

#### Start Development Server
```bash
npm run dev
```
- Starts client on `http://localhost:5174` (Vite)
- Starts server on `http://localhost:4000` (Node.js with --watch)
- Uses `concurrently` to run both simultaneously
- Proxy: `/api` → `http://localhost:4000`

#### Build for Production
```bash
npm run build
```
- Generates optimized bundle in `dist/`
- Fixed output filenames configured in `vite.config.js`
- Includes CSS and JS assets

#### ESLint Checking
```bash
npm run lint
```
- Runs ESLint on all files
- Configuration: `eslint.config.js`

#### Create Admin User
```bash
npm run admin:create
```
- Runs `server/scripts/create-admin.js`
- Prompts for admin credentials
- Creates admin account in MongoDB

#### Preview Production Build
```bash
npm run preview
```
- Serves dist/ folder locally
- Tests production build before deployment

#### Run Server Only
```bash
npm run server
# or
npm start
```
- Starts Express server on port 4000
- Requires separate client build

#### Run Client Dev Server Only
```bash
npm run dev:client
```
- Starts Vite dev server on port 5174

---

### Configuration

#### Environment Variables (.env)
- `VITE_API_URL` - Frontend API base URL (e.g., https://api.example.com)
- `PORT` - Server port (default: 4000)
- `JWT_SECRET` - Secret for JWT token signing
- `FRONTEND_URL` - CORS origin (e.g., https://example.com)
- `SMTP_HOST` - Email server host
- `SMTP_USER` - Email username
- `SMTP_PASS` - Email password
- `SMTP_PORT` - Email port (default: 587)
- `MONGODB_URI` - MongoDB connection string

#### Vite Configuration
- **File:** `vite.config.js`
- **Features:**
  - React plugin enabled
  - Fixed output filenames (hash strategy)
  - Dev proxy for `/api` → localhost:4000

#### TypeScript Configuration
- **Client:** `tsconfig.app.json`
- **Node:** `tsconfig.node.json`
- **Root:** `tsconfig.json`

#### ESLint Configuration
- **File:** `eslint.config.js`
- **Plugins:** react-hooks, react-refresh
- **JSX Support:** `parserOptions.ecmaFeatures.jsx: true`

---

### Deployment

#### Render.com Deployment
- **File:** `render.yaml`
- **Configuration:** Express server deployment to Render
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **See also:** `RENDER_DEPLOYMENT_GUIDE.md`

#### Deployment Files
- **DEPLOYMENT_SETUP.md** - Full deployment setup instructions
- **MONGODB_IP_WHITELIST.md** - MongoDB IP whitelist configuration
- **RENDER_DEPLOYMENT_GUIDE.md** - Render-specific deployment guide

---

### Database Setup

#### MongoDB Connection
- **Package:** Mongoose 9.6.1
- **Required:** MongoDB URI in environment variables
- **Models:** Automatically created on first connection
- **Seed Data:** `server/seed/initialData.js`

#### Seed Initial Data
- Initializes demo listings, users, and orders
- Auto-runs on server start if database is empty
- Contains default admin user (optional)
- Located in: `server/seed/initialData.js`

---

## Dependencies & Libraries

### Frontend Dependencies

#### React & Routing
- **react** ^19.2.5 - UI framework
- **react-dom** ^19.2.5 - DOM renderer
- **react-router-dom** ^7.14.2 - Client-side routing

#### HTTP & API
- **axios** ^1.16.0 - HTTP client for API calls

### Backend Dependencies

#### Server Framework
- **express** ^5.2.1 - Web server framework

#### Database
- **mongoose** ^9.6.1 - MongoDB ODM

#### Authentication
- **jsonwebtoken** ^9.0.3 - JWT token creation/verification

#### Security & Utilities
- **cors** ^2.8.6 - CORS middleware
- **dotenv** ^17.4.2 - Environment variables

#### Email
- **nodemailer** ^8.0.7 - Email sending

### Development Dependencies

#### Build Tools
- **vite** ^8.0.10 - Frontend build tool
- **@vitejs/plugin-react** ^6.0.1 - React plugin for Vite

#### Linting
- **eslint** ^10.2.1 - Code linter
- **@eslint/js** ^10.0.1 - ESLint JavaScript config
- **eslint-plugin-react-hooks** ^7.1.1 - React hooks linting
- **eslint-plugin-react-refresh** ^0.5.2 - React refresh linting

#### Utilities
- **concurrently** ^9.2.1 - Run multiple npm scripts
- **globals** ^17.5.0 - ESLint globals

---

## Feature Summary by User Role

### Buyer Features
- ✅ Sign up/in with email and password
- ✅ Browse and search listings
- ✅ View product details with reviews
- ✅ Add items to cart
- ✅ Add items to favorites
- ✅ Checkout and purchase
- ✅ Track orders and shipments
- ✅ Message sellers
- ✅ Leave reviews and ratings
- ✅ Update profile and address
- ✅ Request password reset
- ✅ Multi-language support (EN/AR)

### Seller Features
- ✅ Sign up as seller
- ✅ All buyer features (can browse as buyer)
- ✅ Create product listings
- ✅ Edit/delete own listings
- ✅ Seller dashboard with metrics
- ✅ View incoming orders
- ✅ Update order status (paid → shipped → delivered)
- ✅ Message buyers about orders
- ✅ Account approval workflow (admin managed)
- ✅ Multi-language support (EN/AR)

### Admin Features
- ✅ All buyer/seller features
- ✅ Admin dashboard
- ✅ Manage sellers (approve/suspend)
- ✅ Moderate listings (flag/approve)
- ✅ Add moderation notes
- ✅ View all consumers (buyers)
- ✅ System health monitoring
- ✅ Create admin users via CLI
- ✅ Multi-language support (EN/AR)

---

## API Runtime Modes

### Remote Mode
- **Activated when:** `VITE_API_URL` environment variable is set
- **Behavior:** All API calls go to remote server
- **Fallback:** If remote fails (network error, 5xx), falls back to demo mode
- **Used for:** Production deployments

### Demo Mode
- **Activated when:** `VITE_API_URL` is not set OR remote mode fails
- **Storage:** Browser localStorage
- **Implementation:** `src/lib/demoMarketplaceApi.js`
- **Used for:** Development, testing, GitHub Pages deployment
- **Data:** Persists across sessions in localStorage

### Mode Detection
- **File:** `src/lib/marketplaceApi.js`
- **Function:** `getMarketplaceRuntimeInfo()` - Returns current mode
- **Display:** Shown on `/deployment` page
- **Automatic Fallback:** Triggered by network errors, timeouts, 404/5xx responses

---

## Styling & Theme

### CSS Variables (Global)
- **File:** `src/index.css`
- **Colors:**
  - `--background: #000000` - Dark background
  - `--accent: #1d9bf0` - Primary blue accent
  - `--text-primary: #ffffff` - Main text
  - `--text-secondary: #8a99ab` - Secondary text
  - `--border: #2b3544` - Border color
- **Typography:**
  - `--heading-font: 'Space Grotesk'` - Headings
  - `--body-font: 'Tajawal'` - Body (Arabic)
  - `--body-font-ar: 'Tajawal'` - Body Arabic
- **Spacing/Sizing:** Defined per component
- **Responsive Breakpoints:** Mobile-first approach

### Responsive Design
- **Mobile:** Base styles (320px+)
- **Tablet:** `@media (min-width: 768px)`
- **Desktop:** `@media (min-width: 1024px)`
- **Large Desktop:** `@media (min-width: 1440px)`

### Dark Theme Support
- **Implementation:** CSS variables approach
- **RTL Support:** Flexbox/grid layouts adapt automatically
- **Font Loading:** Google Fonts (Space Grotesk, Tajawal)

### Professional UI Components
- Gradient backgrounds with glow effects
- Smooth hover transitions
- Loading state indicators
- Error state styling
- Success animations
- Accessibility features (labels, ARIA attributes)

---

## Security Features

### Authentication
- **JWT Tokens:** Signed with `JWT_SECRET`
- **Token Storage:** localStorage (TOKEN_KEY: 'signal-market-token')
- **Password Hashing:** Bcrypt with salt
- **Authorization Middleware:** Role-based access control

### CORS
- **Allowed Origins:**
  - localhost:5173, 5174, 5178
  - Production URLs from environment
  - GitHub Pages: ahmed-abulfateh.github.io
- **Configuration:** `server/index.js` - `isAllowedOrigin()` function

### Password Reset
- **Reset Token:** JWT with 30-minute expiry
- **Email Verification:** Nodemailer-based
- **One-time Use:** Token invalidated after use

### Role-Based Access Control
- **Roles:** buyer, seller, admin
- **Protected Routes:** `ProtectedRoute` component
- **Middleware:** `authRequired(['role1', 'role2'])` on backend
- **Seller Verification:** `sellerApproved` middleware

### Input Validation
- **Frontend:** React form validation
- **Backend:** Request body schema validation
- **Database:** Mongoose schema validation

---

## Troubleshooting

### Common Issues

#### API Connection Error
- **Cause:** Backend not running or API_URL misconfigured
- **Solution:** 
  - Check `npm run dev:server` is running on port 4000
  - Verify `VITE_API_URL` environment variable
  - Falls back to demo mode if remote unavailable

#### Sign-in Not Working
- **Cause:** User not found, wrong password, or token issue
- **Solution:**
  - Verify user exists in database
  - Check password is correct
  - Clear localStorage and try again

#### Listing Not Appearing
- **Cause:** Seller not approved, listing status is not "active"
- **Solution:**
  - Admin must approve seller
  - Seller must publish listing (status → active)
  - Verify listing is in "active" status

#### Dark Mode Not Loading
- **Cause:** CSS variables not loaded or browser cache
- **Solution:**
  - Hard refresh page (Ctrl+Shift+R)
  - Check browser DevTools - CSS variables in :root
  - Verify `src/index.css` is loaded

#### Language Switch Not Working
- **Cause:** localStorage issue or React state not updating
- **Solution:**
  - Clear localStorage and refresh
  - Check `signal-market-language` key in localStorage
  - Verify LanguageProvider wraps app

---

## File Structure Reference

```
marketplace-js/
├── server/
│   ├── index.js                    # Express server & API endpoints
│   ├── lib/
│   │   └── auth.js                 # Password hashing utilities
│   ├── models/
│   │   ├── AppState.js             # User preferences model
│   │   ├── Listing.js              # Product model
│   │   ├── Order.js                # Order model
│   │   └── User.js                 # User model
│   ├── scripts/
│   │   └── create-admin.js         # Admin user creation script
│   └── seed/
│       └── initialData.js          # Database seed data
├── src/
│   ├── App.jsx                     # Root routing component
│   ├── App.css                     # All component styles
│   ├── index.css                   # Global styles & CSS variables
│   ├── main.jsx                    # React entry point
│   ├── context/
│   │   ├── LanguageContext.jsx     # i18n context
│   │   └── MarketplaceContext.jsx  # Global store context
│   ├── lib/
│   │   ├── marketplaceApi.js       # Frontend API client
│   │   ├── demoMarketplaceApi.js   # Demo/localStorage API
│   │   └── (utilities)
│   ├── components/
│   │   ├── AdminLayout.jsx
│   │   ├── LanguageSwitcher.jsx
│   │   ├── ListingCard.jsx
│   │   ├── MarketplaceLayout.jsx
│   │   ├── PageHero.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── SellerLayout.jsx
│   └── pages/
│       ├── HomePage.jsx
│       ├── BrowsePage.jsx
│       ├── ProductPage.jsx
│       ├── CheckoutPage.jsx
│       ├── CheckoutSuccessPage.jsx
│       ├── ShipmentsPage.jsx
│       ├── ProfilePage.jsx
│       ├── SignInPage.jsx
│       ├── SignUpPage.jsx
│       ├── ResetPasswordPage.jsx
│       ├── DeploymentPage.jsx
│       ├── SellerPage.jsx
│       ├── SellerProductsPage.jsx
│       ├── SellerOrdersPage.jsx
│       ├── SellerOrderDetailPage.jsx
│       ├── AdminPage.jsx
│       ├── AdminSellersPage.jsx
│       ├── AdminModerationPage.jsx
│       ├── AdminModerationDetailPage.jsx
│       └── AdminConsumersPage.jsx
├── public/
│   └── 404.html
├── package.json
├── vite.config.js
├── tsconfig.json
├── eslint.config.js
├── OPTIONS.md                      # This file
├── README.md
├── DEPLOYMENT_SETUP.md
├── MONGODB_IP_WHITELIST.md
└── RENDER_DEPLOYMENT_GUIDE.md
```

---

## Quick Reference

### Key Packages
- **Frontend:** React 19, Vite 8, React Router 7, Axios
- **Backend:** Express 5, Mongoose 9, JWT, Bcrypt
- **Email:** Nodemailer
- **Dev:** ESLint, Concurrently

### Key Paths
- API Base: `/api` (proxied to localhost:4000)
- Client: `http://localhost:5174`
- Server: `http://localhost:4000`
- Build Output: `dist/`
- Config Base Path: `/marketplace.jsx/`

### Key Files
- Routes: `src/App.jsx`
- Global Context: `src/context/MarketplaceContext.jsx`
- Styles: `src/App.css`, `src/index.css`
- API: `src/lib/marketplaceApi.js`
- Server: `server/index.js`

### Environment Variables
- `VITE_API_URL` - API endpoint URL
- `PORT` - Server port (4000)
- `JWT_SECRET` - JWT signing secret
- `MONGODB_URI` - Database connection

---

**Last Updated:** May 2026  
**Status:** Production-Ready  
**Version:** 1.0.0
