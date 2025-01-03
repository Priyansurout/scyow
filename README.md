# 🎥 Real-Time YouTube Sync Player

This project is a **real-time web application** that allows multiple users to watch YouTube videos together in perfect sync, no matter where they are. The application uses **WebSocket** technology to synchronize video playback across devices with **zero lag** and **shared playback controls**. Whether it's for virtual movie nights, study groups, or team presentations, this project offers a seamless shared viewing experience!

## 🚀 Features

- **Real-time synchronization**: Watch YouTube videos together in perfect sync.
- **Shared playback controls**: Actions like play, pause, and seek are synced for all users.
- **Speed adjustment**: Control playback speed for all connected users.
- **Live user tracking**: See who’s in the room in real-time.
- **Easy room creation**: Generate unique Room IDs and invite friends to join with a simple link.

## 💻 Tech Stack

- **Frontend**: [React](https://reactjs.org/)
- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Real-time Communication**: [Socket.io](https://socket.io/)
- **Video Playback**: [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)

## 🛠️ How It Works

1. **Create a Room**: A user shares a YouTube link, and a Room ID is generated.
2. **Join the Room**: Others can join by entering the Room ID.
3. **Sync Playback**: Once in the room, playback actions like play, pause, and seek are broadcasted to all connected users, ensuring everyone stays perfectly synced.
4. **Real-time Communication**: WebSocket technology keeps the server and clients connected with a two-way handshake to update all users instantly.

## 🌟 Perfect For

- 🎬 **Virtual Movie Nights**
- 📚 **Online Study Sessions**
- 💼 **Team Presentations**
- 🎓 **Virtual Workshops**

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js**: [Download here](https://nodejs.org/en/download/)
- **npm**: Comes with Node.js

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Priyansurout/youtube_syn.git
    ```
2. Navigate to the project directory:
    ```bash
    cd youtube_syn
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

1. Start the server:
    ```bash
    npm start
    ```
2. Open your browser and go to `http://localhost:3000` to view the app.

## 📂 Project Structure

- `/client`: Contains the React frontend code.
- `/server`: Contains the Express.js backend code, including Socket.io setup.
- `/public`: Static assets and configuration files.

## 🤝 Contributing

Feel free to submit issues, feature requests, or contribute to this project. **Contributions and stars are highly appreciated!** 🌟

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to reach out for any feedback or questions! 😊

**Project Link**: [https://github.com/Priyansurout/youtube_syn](https://github.com/Priyansurout/youtube_syn)


