# 🌐 NoxX Browser

A modern, feature-rich desktop browser built with Electron, React, and Node.js. This project demonstrates advanced web development skills, complex system architecture, and professional-grade UI/UX design.

![NoxX Browser](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🌟 Core Browser Functionality
- **Tab Management**: Create, switch, close, reorder, and detach tabs
- **Navigation**: Back, forward, refresh with visual feedback
- **Address Bar**: Integrated search and URL navigation
- **Bookmarks**: Full CRUD with folder organization and search
- **History**: Comprehensive browsing history with filtering and export
- **Downloads**: Download manager with status tracking and file management

### 🔒 Privacy & Security
- **Permission Management**: Site-specific permissions (camera, mic, location, etc.)
- **Security Panel**: HTTPS status and security indicators
- **Incognito Mode**: Privacy mode with detailed status tracking
- **Privacy Controls**: Comprehensive permission management

### 🎨 Customization & Settings
- **Theme Customizer**: Backgrounds, colors, gradients, videos
- **Settings Panel**: Comprehensive settings management
- **Performance Monitor**: System resource tracking
- **Glassmorphism UI**: Premium corporate styling

### 🔌 Extensions & Advanced Features
- **Extensions Support**: Panel with management, permissions, updates
- **Tab Detachment**: Open tabs in new windows
- **Keyboard Shortcuts**: Efficient navigation and control
- **Cross-Platform**: Works on Windows, macOS, and Linux

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/noxx-browser.git
   cd noxx-browser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run electron-dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run electron-build
   ```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 with Context API for state management
- **Backend**: Electron main process with Node.js
- **Styling**: Tailwind CSS with custom glassmorphism design
- **Build Tool**: Vite for fast development and building
- **Package Manager**: npm with modern dependency management

### Project Structure
```
noxx-browser/
├── electron/           # Electron main process
│   ├── main.cjs       # Main process entry point
│   └── preload.cjs    # Preload scripts for IPC
├── src/               # React application
│   ├── components/    # React components
│   │   ├── content/   # Browser content (bookmarks, history, etc.)
│   │   ├── privacy/   # Privacy and security features
│   │   ├── settings/  # Settings and customization
│   │   ├── system/    # System features (performance, incognito)
│   │   ├── tabs/      # Tab management
│   │   └── ui/        # UI components
│   ├── context/       # React Context providers
│   └── utils/         # Utility functions
├── public/            # Static assets
└── dist/              # Build output
```

## 🎯 Key Technical Achievements

### Complex System Architecture
- **Multi-process communication** between Electron main and renderer processes
- **BrowserView management** for web content rendering
- **State synchronization** across multiple windows and processes
- **Memory management** with proper cleanup and resource handling

### Advanced UI/UX Design
- **Glassmorphism design** with premium corporate styling
- **Responsive layout** that adapts to different screen sizes
- **Smooth animations** and transitions throughout the application
- **Accessibility considerations** with proper focus management

### Security & Privacy Implementation
- **Permission system** with granular control over site access
- **Security indicators** for HTTPS and connection status
- **Privacy mode** with comprehensive data protection
- **Safe IPC communication** with proper validation

## 📸 Screenshots

*[Add screenshots of key features here]*

## 🔧 Development

### Available Scripts
- `npm run dev` - Start Vite development server
- `npm run electron-dev` - Start Electron in development mode
- `npm run build` - Build React application
- `npm run electron-build` - Build Electron application
- `npm run preview` - Preview production build

### Code Quality
- ESLint configuration for code consistency
- Modern JavaScript/React patterns
- Comprehensive error handling
- Performance optimization

## 🤝 Contributing

This is a portfolio project demonstrating advanced web development skills. While contributions are welcome, the primary goal is to showcase technical capabilities and professional development practices.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Portfolio Project

This browser demonstrates:
- **Full-stack development** capabilities
- **Complex system architecture** understanding
- **Modern development practices** and tools
- **Professional UI/UX** design skills
- **Security and privacy** awareness
- **Cross-platform** application development

Built with modern development practices including AI-assisted coding for efficiency, demonstrating ability to leverage contemporary tools while maintaining full control over architecture, design, and implementation quality.

---

**Built with ❤️ using Electron, React, and modern web technologies**
