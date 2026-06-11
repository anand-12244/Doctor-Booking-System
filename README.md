# Native

# CareConnect - Doctor Booking Native App[pdf24_converted (2).pdf](https://github.com/user-attachments/files/28831113/pdf24_converted.2.pdf)

Download the porject screenshot using this link---

https://github.com/user-attachments/files/28831113/pdf24_converted.2.pdf


A comprehensive React Native healthcare application built with Expo that enables users to book doctor appointments, search for specialists, and access AI-powered symptom checking.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)
- [Project Architecture](#project-architecture)
- [Dependencies](#dependencies)
- [File Structure](#file-structure)
- [Contributing](#contributing)

---

## 🏥 Overview

**CareConnect** is a mobile-first healthcare platform that streamlines the doctor appointment booking process. The app features an intelligent symptom checker powered by Groq AI, allowing users to identify appropriate medical specialties before booking appointments. With a user-friendly interface and comprehensive doctor profiles, CareConnect makes healthcare accessible and convenient.

---

## ✨ Features

### Core Features

- **🏠 Home Screen**: Dashboard with featured doctors and specialties
- **👨‍⚕️ Doctor Directory**: Browse all available doctors with filters and search
- **📅 Appointment Booking**: Book, view, and manage appointments
- **🔍 Search Functionality**: Find doctors by name, specialty, or rating
- **❤️ Favorites System**: Save preferred doctors for quick access
- **💊 AI Symptom Checker**: AI-powered symptom analyzer using Groq API
  - Analyzes patient symptoms
  - Recommends appropriate medical specialties
  - Provides confidence levels and urgency assessment
  - Smart doctor matching based on recommendations

### User Features

- **👤 User Profile**: View and manage personal information
- **📋 My Appointments**: Track booking history and upcoming appointments
- **🔐 Authentication**: Secure login and registration system
- **📞 Contact Support**: Direct contact with support team
- **ℹ️ About Section**: App information and details

### Specialties Supported

- General Physician
- Gynecologist
- Dermatologist
- Pediatrician
- Neurologist
- Gastroenterologist

---

## 🛠️ Tech Stack

| Layer                | Technology               |
| -------------------- | ------------------------ |
| **Framework**        | React Native 0.83.6      |
| **Build Tool**       | Expo 55.0.19             |
| **Navigation**       | React Navigation 7.2.2   |
| **State Management** | React Context API        |
| **HTTP Client**      | Axios 1.16.0             |
| **Storage**          | AsyncStorage             |
| **API**              | Groq AI API, JSON Server |
| **UI Components**    | React Native, SVG        |
| **Styling**          | StyleSheet               |

---

## 📁 Project Structure

```
CareConnect-NativeApp/
├── src/
│   ├── assets/
│   │   └── assets.js              # Asset imports and configurations
│   ├── components/
│   │   ├── AIBanner.js            # AI Symptom Checker banner
│   │   ├── Banner.js              # Generic banner component
│   │   ├── Footer.js              # Footer component
│   │   ├── Header.js              # Header component
│   │   ├── Navbar.js              # Navigation bar
│   │   ├── SpecialityMenu.js      # Specialties filter menu
│   │   └── TopDoctors.js          # Top featured doctors list
│   ├── context/
│   │   ├── AppContext.js          # Global app state
│   │   └── FavouritesContext.js   # Favorites management
│   ├── screens/
│   │   ├── HomeScreen.js          # Home/Dashboard
│   │   ├── DoctorsScreen.js       # Doctor listing & browse
│   │   ├── LoginScreen.js         # Authentication
│   │   ├── AboutScreen.js         # About page
│   │   ├── ContactScreen.js       # Contact/Support
│   │   ├── MyProfileScreen.js     # User profile
│   │   ├── MyAppointmentsScreen.js # Appointments history
│   │   ├── AppointmentScreen.js   # Appointment booking details
│   │   ├── SearchScreen.js        # Search functionality
│   │   ├── FavouritesScreen.js    # Saved doctors
│   │   └── SymptomCheckerScreen.js # AI symptom analysis
│   ├── services/
│   │   └── groqService.js         # Groq AI API integration
│   └── utils/
│       └── doctorMatcher.js       # Doctor matching logic
├── assets/                         # Static assets (images, fonts, etc.)
├── App.js                          # Main app entry point
├── index.js                        # App initialization
├── app.json                        # Expo configuration
├── eas.json                        # EAS Build configuration
├── metro.config.js                 # Metro bundler configuration
├── json-server.json                # JSON Server configuration
├── db.json                         # Mock database
├── package.json                    # Dependencies & scripts
└── README.md                       # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Git**

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd CareConnect-NativeApp
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Install Expo CLI (if not already installed)

```bash
npm install -g expo-cli
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

**Note**: The Groq API key is required for the AI Symptom Checker feature. Get your API key from [Groq Console](https://console.groq.com).

### JSON Server Configuration

The app uses JSON Server for mock data. Configure it in `json-server.json`:

```json
{
  "port": 3000,
  "delay": 0,
  "id": "id"
}
```

---

## ▶️ Running the App

### Start Expo Development Server

```bash
npm start
# or
yarn start
```

### Run on Specific Platforms

**Android Emulator/Device:**

```bash
npm run android
```

**iOS Simulator/Device:**

```bash
npm run ios
```

**Web Browser:**

```bash
npm run web
```

---

## 📜 Available Scripts

| Script  | Command           | Description                      |
| ------- | ----------------- | -------------------------------- |
| Start   | `npm start`       | Launches Expo development server |
| Android | `npm run android` | Builds and runs on Android       |
| iOS     | `npm run ios`     | Builds and runs on iOS           |
| Web     | `npm run web`     | Runs in web browser              |

---

## 🏗️ Project Architecture

### State Management (Context API)

**AppContext.js**:

- Manages global app state
- Handles doctor data, appointments, user information
- Provides app-wide data access

**FavouritesContext.js**:

- Manages favorite doctors list
- Persists to AsyncStorage
- Handles add/remove favorite operations

### Navigation Flow

- **Stack Navigator**: Primary navigation structure
- **Initial Route**: HomeScreen
- **Routes**: Home → Doctors → Appointment → MyAppointments → etc.

### API Integration

- **Groq AI Service**: Symptom analysis and doctor recommendations
- **JSON Server**: Mock backend for doctor data and appointments
- **Axios**: HTTP client for API requests

---

## 📦 Dependencies

### Core Dependencies

- **react**: ^19.2.0 - JavaScript library for UI
- **react-native**: 0.83.6 - Framework for native apps
- **expo**: ^55.0.19 - Build and deployment tool

### Navigation

- **@react-navigation/native**: ^7.2.2
- **@react-navigation/native-stack**: ^7.14.12
- **react-native-safe-area-context**: ~5.6.2
- **react-native-screens**: ~4.23.0

### Storage & API

- **@react-native-async-storage/async-storage**: 2.2.0
- **axios**: ^1.16.0
- **json-server**: ^0.17.4

### UI & Utilities

- **react-native-svg**: 15.15.3
- **expo-image-picker**: ~55.0.19
- **expo-status-bar**: ~55.0.5
- **react-native-web**: ^0.21.0

### Development Dependencies

- **react-native-svg-transformer**: ^1.5.3

---

## 🔄 Data Flow

### Symptom Checking Flow

```
User Input Symptoms
    ↓
Groq AI Analysis
    ↓
JSON Response (specialties, confidence, urgency)
    ↓
Doctor Matcher Utility
    ↓
Filtered & Sorted Doctor List
    ↓
Display Recommended Doctors
```

### Appointment Booking Flow

```
Select Doctor
    ↓
Choose Date/Time
    ↓
Add Notes
    ↓
Confirm Booking
    ↓
Save to AsyncStorage
    ↓
Update MyAppointments
```

---

## 🔌 Key Components

### groqService.js

Handles Groq AI API integration:

- Analyzes user symptoms
- Returns medical recommendations
- Provides confidence levels and urgency

### doctorMatcher.js

Smart doctor matching logic:

- Matches doctors with recommended specialties
- Normalizes specialty names for accurate matching
- Sorts by availability and rating

### Context Providers

- **AppContextProvider**: Wraps entire app with global state
- **FavouritesProvider**: Manages favorites separately

---

## 📸 Screenshots & Screens

### Live App Demo

You can view the live app at: **http://localhost:8082**

When running locally:

1. Start JSON Server: `npx json-server --watch db.json --port 3000`
2. Start Expo: `npm start`
3. Open web: Press `w` or visit `http://localhost:8082`

---

### 🏠 Home Screen

**Description**: The main dashboard featuring:

- Prominent blue gradient banner with featured doctor images
- "Book Appointment With Trusted Doctors" call-to-action
- Specialties carousel with 6 medical specialties (with icons)
- AI-powered symptom checker banner
- Top doctors section showing featured healthcare providers (10 doctors displayed)
- Quick booking and account creation options
- Footer with company info and contact details

**Key Features**:

- ✅ Featured doctors carousel with photos
- ✅ All 6 specialty categories with icons
- ✅ AI Symptom Checker prominent banner
- ✅ Top doctors list with availability status
- ✅ Professional blue/white gradient color scheme
- ✅ Responsive navigation header with icons (AI, Search, Favorites)

**Components Used**: Header, Banner, SpecialityMenu, TopDoctors, Footer  
**File**: [src/screens/HomeScreen.js](src/screens/HomeScreen.js)

---

### 🤖 AI Symptom Checker Screen

**Description**: An intelligent symptom analysis interface featuring:

- "SMART DIAGNOSTICS" header with robot emoji 🤖
- Large heading "AI Symptom Checker"
- Quick-fill symptom buttons for common conditions:
  - Fever & Cough 🌡️
  - Migraine/Headache 🧠
  - Skin Redness/Rash 🧴
  - Stomach Pain/Reflux 🤢
  - Chest Discomfort 💔
- Large text area for detailed symptom input (placeholder: "Describe your symptoms...")
- "Analyze Symptoms with AI" button
- Groq AI-powered analysis providing:
  - Recommended specialties (matched from available doctors)
  - Confidence levels (high/medium/low)
  - Initial medical assessment (clinical explanation)
  - Urgency classification (routine/urgent/emergency)
  - Recommended steps for patient

**Key Features**:

- ✅ Pre-filled symptom templates for quick access
- ✅ Custom symptom text input
- ✅ Groq AI real-time analysis
- ✅ Specialty-based doctor recommendations
- ✅ Confidence scoring
- ✅ Urgency classification

**Components Used**: Header, Custom input form  
**Services**: [src/services/groqService.js](src/services/groqService.js)  
**File**: [src/screens/SymptomCheckerScreen.js](src/screens/SymptomCheckerScreen.js)

---

### 🔍 Search Screen

**Description**: A comprehensive search and filter interface with:

- Back button for navigation
- Search bar with icon for doctor/specialty search
- "Browse by Specialty" section heading
- All 6 specialty filter pills:
  - General physician
  - Gynecologist
  - Dermatologist
  - Pediatricians
  - Neurologist
  - Gastroenterologist
- Real-time filtering of doctors based on search term or specialty
- Clean, minimalist design with clear typography

**Key Features**:

- ✅ Real-time search functionality
- ✅ Specialty filter pills (clickable)
- ✅ Doctor list auto-updates with filters
- ✅ Back navigation
- ✅ Quick access specialty filters
- ✅ Responsive layout

**Components Used**: Header with back button, Search input  
**File**: [src/screens/SearchScreen.js](src/screens/SearchScreen.js)

---

### 👨‍⚕️ Doctors Screen

**Description**: A detailed doctor listing page featuring:

- Heading: "Browse through the doctors specialist"
- Specialty filter tabs (scrollable):
  - All (shows all doctors)
  - General physician
  - Gynecologist
  - Dermatologist
  - Pediatricians
  - Neurologist
  - Gastroenterologist
- Doctor cards displaying:
  - Doctor photo/avatar
  - Name and specialty
  - Ratings and reviews (star ratings)
  - Availability status (Available/Not Available - green/red indicator)
  - "Book" button for quick booking
- Scrollable list showing all 10+ available doctors
- Dynamic filter functionality by specialty
- Loading state with progress indicator while fetching doctors

**Key Features**:

- ✅ 10+ doctors available in database
- ✅ Specialty-based filtering tabs
- ✅ Real-time availability indicators
- ✅ Quick one-click booking
- ✅ Doctor ratings display
- ✅ Loading state management
- ✅ Responsive card layout

**Data from**: [db.json](db.json) (10 doctors)  
**File**: [src/screens/DoctorsScreen.js](src/screens/DoctorsScreen.js)

---

### 📅 Appointment Booking Screen

**Description**: The appointment booking flow featuring:

- Selected doctor details section:
  - Doctor photo/avatar
  - Name, specialty, and fees
  - Rating information
  - Address details (line1, line2)
- Date picker for appointment scheduling
- Available time slots for selected date (displayed in grid)
- Additional notes field for patient instructions
- Appointment summary showing:
  - Doctor name and specialty
  - Selected date and time
  - Consultation fees
  - Address information
- "Confirm Booking" button to finalize appointment
- Cancel/back option

**Key Features**:

- ✅ Date picker component
- ✅ Time slot availability display
- ✅ Booking confirmation summary
- ✅ Notes/instructions field
- ✅ Doctor details display
- ✅ Fee information
- ✅ Address details

**Context Data**: Uses AppContext for doctor and appointment data  
**File**: [src/screens/AppointmentScreen.js](src/screens/AppointmentScreen.js)

---

### 📋 My Appointments Screen

**Description**: User's appointment history showing:

- Upcoming appointments list (sorted by date)
- Completed appointments history
- For each appointment card:
  - Doctor information (name, photo, specialty)
  - Appointment date and time
  - Doctor fees
  - Status indicators (Upcoming - blue, Completed - gray)
- Cancel option for upcoming appointments (with confirmation)
- Reschedule option for upcoming appointments
- View appointment details option
- Empty state placeholder message ("No appointments booked yet")

**Key Features**:

- ✅ Upcoming appointments display
- ✅ Completed appointments history
- ✅ Cancel appointment functionality
- ✅ Reschedule option
- ✅ Appointment details view
- ✅ Date sorting
- ✅ Empty state handling

**Context Data**: Uses AppContext for appointment management  
**Storage**: AsyncStorage for persistent appointment data  
**File**: [src/screens/MyAppointmentsScreen.js](src/screens/MyAppointmentsScreen.js)

---

### ❤️ Favorites Screen

**Description**: Saved doctors list featuring:

- "Your Favorite Doctors" heading
- List of all favorited doctors
- For each doctor card:
  - Heart icon toggle (filled/empty) to add/remove from favorites
  - Doctor name and specialty
  - Rating information (star rating)
  - Availability status indicator
  - Direct "Book" button for quick appointment
- Empty state message ("No favorite doctors yet")
- Easy one-click booking from favorites

**Key Features**:

- ✅ Save favorite doctors with heart toggle
- ✅ Quick access to favorites
- ✅ One-click booking from favorites
- ✅ Heart icon toggle (animated)
- ✅ Doctor ratings display
- ✅ Availability status indicators
- ✅ Empty state handling

**Context Data**: Uses FavouritesContext for favorites management  
**Storage**: AsyncStorage for persistent favorites  
**File**: [src/screens/FavouritesScreen.js](src/screens/FavouritesScreen.js)

---

### 👤 User Profile Screen

**Description**: Personal information management including:

- User avatar/profile picture section
- Full name field (editable)
- Contact information section:
  - Email address (editable)
  - Phone number (editable)
- Medical history/notes section (expandable)
- Edit profile button (pencil icon)
- Logout button with confirmation
- Account settings link
- Privacy & security settings

**Key Features**:

- ✅ Profile photo/avatar
- ✅ Editable fields (name, email, phone)
- ✅ Medical history notes
- ✅ Account settings access
- ✅ Logout functionality
- ✅ Privacy settings
- ✅ Profile editing mode

**Context Data**: Uses AppContext for user data  
**Storage**: AsyncStorage for profile persistence  
**File**: [src/screens/MyProfileScreen.js](src/screens/MyProfileScreen.js)

---

### 🔐 Login Screen

**Description**: Authentication interface featuring:

- CareConnect branding and logo
- Email/username input field with placeholder
- Password input field (masked)
- "Remember me" checkbox
- "Login" button (prominent color)
- "Forgot Password" link for password recovery
- "Create Account" link for new users
- Social login options (if available)
- Form validation with error messages
- Loading state during authentication

**Key Features**:

- ✅ Email/username input
- ✅ Password field (masked input)
- ✅ Remember me checkbox
- ✅ Password recovery link
- ✅ Create account redirect
- ✅ Form validation
- ✅ Error handling
- ✅ Loading state

**Context Data**: Uses AppContext for authentication  
**Storage**: AsyncStorage for token storage  
**File**: [src/screens/LoginScreen.js](src/screens/LoginScreen.js)

---

### ℹ️ About Screen

**Description**: Application information page with:

- App name and version (CareConnect v1.0.0)
- App description and mission statement
- CareConnect vision: "Your trusted partner in healthcare"
- Feature highlights with icons:
  - AI-powered diagnosis
  - Easy booking
  - Trusted doctors
  - 24/7 support
- Team information section
- Technology stack overview:
  - React Native
  - Expo
  - Groq AI
  - JSON Server
- Links to privacy policy and terms
- Contact information:
  - Phone: +1-212-832-7382
  - Email: ananddev@gmail.com

**Key Features**:

- ✅ App information
- ✅ Feature highlights with icons
- ✅ Team details
- ✅ Tech stack information
- ✅ Policy links
- ✅ Contact information

**File**: [src/screens/AboutScreen.js](src/screens/AboutScreen.js)

---

### 📞 Contact Screen

**Description**: Support and contact information featuring:

- Heading: "Get In Touch"
- Contact form with fields:
  - Full Name input
  - Email input
  - Subject input
  - Message textarea (large)
- "Send Message" button
- Direct contact information section:
  - Phone: +1-212-832-7382
  - Email: ananddev@gmail.com
  - Address (if available)
- FAQ section (collapsible)
- Support chat option (if available)
- Success message after form submission ("Message sent successfully!")

**Key Features**:

- ✅ Contact form with validation
- ✅ Name, email, subject, message fields
- ✅ Message submission
- ✅ Direct contact info display
- ✅ FAQ section
- ✅ Success notifications
- ✅ Error handling

**File**: [src/screens/ContactScreen.js](src/screens/ContactScreen.js)

---

## 🧭 Navigation Components

### Header Navigation (Top Bar)

- CareConnect logo/brand name (clickable - returns to home)
- Navigation icons on right side:
  - 🤖 AI Symptom Checker (tappable)
  - 🔍 Search (tappable)
  - 🤍 Favorites/Wishlist (heart icon, tappable)
  - ☰ Menu (hamburger icon, tappable)

**Component**: [src/components/Header.js](src/components/Header.js)

### Footer Navigation

- Company information section
- Quick Links:
  - Home
  - About us
  - Contact us
  - Privacy policy
- Contact Details:
  - Phone: +1-212-832-7382
  - Email: ananddev@gmail.com
- Copyright notice: "© 2025 Anand - All Rights Reserved"

**Component**: [src/components/Footer.js](src/components/Footer.js)

---

[pdf24_converted (2).pdf](https://github.com/user-attachments/files/28831200/pdf24_converted.2.pdf)
[pdf24_converted (2).pdf](https://github.com/user-attachments/files/28831206/pdf24_converted.2.pdf)
