# 🏡 Airbnb Clone - Express.js Portal

A full-stack web application inspired by Airbnb, built using **Node.js**, **Express.js**, and **EJS**. 

## 🚀 Features

### 🎭 Dual Portal Architecture
- **Traveler (User) Portal**: Allows users to browse available homes, view detailed property information, manage favorites, and track reservations/bookings.
- **Host (Admin) Portal**: Dedicated dashboard for hosts to add new properties (specifying name, price, location, and photo), view their active listings, and edit home details.

### 💻 Core Functionalities
- **MVC Architecture**: Clean separation of logic with specific controllers for store/travelers (`storeController.js`) and hosts (`hostController.js`).
- **Custom Error Handling**: Features a highly stylized, animated "glitch/CRT" system error page (`error.ejs`) and dedicated 404 handling.
- **Modern UI**: Styled with Tailwind CSS, utilizing glassmorphism, backdrops, screen blends, and custom keyframe animations.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templating), HTML5
- **Styling**: Tailwind CSS (compiled via `output.css`) with custom CSS animations
- **Data Storage**: MongoDB - Mongoose

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

4. **Compile Tailwind CSS (Optional but recommended if editing styles):**
   \`\`\`bash
   npm run build:css 
   \`\`\`

6. **Access the App:**
   Open `http://localhost:[YOUR_PORT]` in your web browser. From the landing page, choose between the **Traveler** or **Host/Admin** portal to start using the application.

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
