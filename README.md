# My Diary
<img width="1366" height="634" alt="Screenshot (340)" src="https://github.com/user-attachments/assets/fd97f804-92f1-4995-a03f-ae37870c81c3" />


A modern AI-powered digital diary application where users can securely record their daily memories, revisit past entries, and receive thoughtful responses from their diary using AI.

## ✨ Features

### 🔐 User Authentication

* User Registration
* Secure Login System
* Password Hashing using Bcrypt
* User-specific diary entries

### 📝 Diary Management

* Create diary entries
* View all personal entries
* Read full diary posts
* Clean and responsive UI

### 🤖 AI Diary Companion

* "Ask My Diary" feature powered by Groq AI
* Diary responds naturally to user entries
* Human-like reflections instead of robotic emotion analysis
* Personalized responses based on diary content

### 🎨 Modern User Interface

* Soft pink-purple diary theme
* Responsive design
* Card-based diary feed
* Smooth animations and transitions
* Mobile-friendly layout

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)

### Backend

* Node.js
* Express.js

### Database

* MySQL (Aiven Cloud Database)

### Authentication

* Bcrypt

### AI Integration

* Groq API
* Llama 3.3 70B Versatile Model

---

## 📂 Project Structure

```text
My_Diary/
│
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── feed.html
│   ├── post.html
│   ├── postDetail.html
│   │
│   ├── css/
│   │   ├── theme.css
│   │   ├── login.css
│   │   ├── feed.css
│   │   ├── post.css
│   │   └── postDetail.css
│   │
│   └── assets/
│       └── background.jpeg
│
│── database/
│        └── schema.sql
│
│── Demo/
│    ├── screenshots/
│      ├── AIResponse.png
│      ├── Feed.png
│      ├── LoginPage.png
│      ├── NewPost.png
│      └── viewPost.png
│        
├── backend/
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/gayathrikakumani24-droid/My_Diary.git
cd My_Diary
```

### Install Dependencies

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file inside the backend folder:

```env
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

GROQ_API_KEY=your_groq_api_key
```

### Start Server

```bash
node index.js
```

Server runs on:

```text
http://localhost:3000
```

---

## 🗄️ Database Schema

### Users Table

| Column         | Type         |
| -------------- | ------------ |
| ID             | INT          |
| EmailID        | VARCHAR(50)  |
| HashedPassword | VARCHAR(100) |

### Posts Table

| Column          | Type          |
| --------------- | ------------- |
| ID              | INT           |
| UserID          | INT           |
| postTitle       | VARCHAR(100)  |
| postDescription | VARCHAR(1500) |

---

## 🤖 AI Prompt Behavior

The diary responds as a caring companion:

* References details from the diary entry
* Speaks naturally and conversationally
* Avoids robotic emotion reports
* Acts like a trusted diary listening to the user

---

## 🚀 Future Improvements

* Edit diary entries
* Delete diary entries
* Dark mode
* AI mood tracking
* Search and filter entries
* User profile page
* Rich text editor
* Image uploads

---

## 📸 Screenshots

### Login Page

Secure login interface with modern diary theme.
<img width="1366" height="627" alt="Screenshot (339)" src="https://github.com/user-attachments/assets/3d19e7eb-58d5-4ed9-b2ea-5afb20922430" />

### Feed Page

Displays all diary memories in elegant cards.
<img width="1366" height="642" alt="Screenshot (337)" src="https://github.com/user-attachments/assets/1decfcbb-25f0-42ff-8661-adce526e8541" />

### Create Post

Write daily experiences and interact with the AI diary.
<img width="1350" height="642" alt="Screenshot (335)" src="https://github.com/user-attachments/assets/862faf07-4685-497f-ae1c-298182f3991a" />


### AI Diary Response

Receive thoughtful and personalized diary reflections.
<img width="1348" height="636" alt="Screenshot (336)" src="https://github.com/user-attachments/assets/2220e3a2-148f-40e4-9caf-3775ce1eab07" />
---

## 👩‍💻 Author

**Gayathri**

Computer Science Engineering (AI & ML)

GitHub: https://github.com/gayathrikakumani24-droid

---

## 📄 License

This project is created for educational and portfolio purposes.
