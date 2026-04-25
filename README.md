# 🏡 Airbnb Clone - Express.js Portal

A full-stack web application inspired by Airbnb, built using **Node.js**, **Express.js**, and **EJS**. 

## 🚀 Features

### 🎭 Dual Portal Architecture
- **Traveler (User) Portal**: Allows users to browse available homes, view detailed property information, manage favorites, and track reservations/bookings.
- **Host (Admin) Portal**: Dedicated dashboard for hosts to add new properties (specifying name, price, location, and photo), view their active listings, and edit home details.

### 💻 Core Functionalities
- **MVC Architecture**: Clean separation of logic with specific controllers for store/travelers (`storeController.js`) and hosts (`hostController.js`).
- **Data Persistence**: Uses Node's native `fs` module to securely store, retrieve, and manage property data via a local JSON file (`data/homes.json`).
- **Custom Error Handling**: Features a highly stylized, animated "glitch/CRT" system error page (`error.ejs`) and dedicated 404 handling.
- **Modern UI**: Styled with Tailwind CSS, utilizing glassmorphism, backdrops, screen blends, and custom keyframe animations.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templating), HTML5
- **Styling**: Tailwind CSS (compiled via `output.css`) with custom CSS animations
- **Data Storage**: File System (JSON-based storage)

## 📁 Project Structure

\`\`\`text
├── controllers/
│   ├── errors.js          # Global error handling (404)
│   ├── hostController.js  # Host/Admin business logic
│   └── storeController.js # Traveler/User business logic
├── models/
│   └── home.js            # Home data model (save, fetchAll, findById)
├── views/
│   ├── home.ejs           # Landing portal page
│   ├── error.ejs          # Glitch-themed error template
│   ├── host/              # Host dashboard views (addHome, hostHome, etc.)
│   └── store/             # Traveler views (userHomelist, bookings, etc.)
├── utils/
│   └── pathUtil.js        # Root directory path utility
├── data/
│   └── homes.json         # Database storage file (Auto-generated)
└── app.js / server.js     # Express application entry point (Assumed)
\`\`\`

## ⚙️ Installation & Setup

1. **Clone the repository:**
   \`\`\`bash
   git clone <your-github-repo-url>
   cd airbnb-clone
   \`\`\`

2. **Install dependencies:**
   Make sure you have [Node.js](https://nodejs.org/) installed, then run:
   \`\`\`bash
   npm install
   \`\`\`

3. **Data Initialization:**
   Ensure there is a `data` folder in the root directory. The application will auto-generate `homes.json` inside it when a new home is added, but the folder must exist to prevent crashes.
   \`\`\`bash
   mkdir data
   \`\`\`

4. **Compile Tailwind CSS (Optional but recommended if editing styles):**
   \`\`\`bash
   npm run build:css 
   \`\`\`

5. **Run the application:**
   \`\`\`bash
   npm start
   # or run with nodemon for development
   npm run dev
   \`\`\`

6. **Access the App:**
   Open `http://localhost:4000` (or your configured port) in your web browser. From the landing page, choose between the **Traveler** or **Host/Admin** portal to start using the application.

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
