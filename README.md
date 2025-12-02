# 💧 KidneyCare: AI-Powered CKD Awareness & Prevention

![KidneyCare Banner](https://placehold.co/1200x300/2563eb/ffffff?text=KidneyCare:+Protecting+Lives+in+Sri+Lanka+🇱🇰)

> **"A Doctor in Your Pocket, Powered by Arm."** 🦾  
> *Empowering Sri Lankan communities with offline, AI-driven kidney health monitoring.* 🏥

---

## 📖 **Project Overview**

**KidneyCare** is a pioneering mobile health platform designed to combat the rising tide of **Chronic Kidney Disease (CKD)** and **CKDu** (Unknown etiology) in Sri Lanka. 🇱🇰

Optimized for **Arm-based iPads** (A14–M3), the application operates **100% offline** 🚫🌐, bringing critical diagnostics, education, and risk assessment to rural agricultural heartlands (like Rajarata) where internet connectivity is scarce but health risks are high.

### 🌟 **Why This Matters**
*   **The Problem 📉**: 1 in 8 adults in certain Sri Lankan provinces suffers from CKD. Early detection is rare due to lack of specialists.
*   **The Solution 💡**: An accessible, localized app that uses on-device AI to act as a first line of defense.
*   **The Tech ⚡**: Leveraging the power of **Apple Silicon (Arm architecture)** to run complex ML models without the cloud.

---

## 🚀 **Core Features**

| Feature | Description | Tech Used |
| :--- | :--- | :--- |
| **🧠 AI Risk Engine** | Instantly calculates CKD risk probability based on demographics & biomarkers. | `Core ML` `Decision Trees` |
| **🎨 Interactive Anatomy** | Real-time rendered 3D/2D diagrams of kidney function. | `Metal` `SVG` |
| **🥗 Localized Diet** | Advice tailored to Sri Lankan cuisine (e.g., *Kohila*, *Red Rice*, *Goraka*). | `Local DB` |
| **🎮 Gamified Learning** | Quizzes and badges ("Kidney Guardian" 🛡️) to drive engagement. | `React State` |
| **🩺 Lab Tracker** | Log Creatinine, eGFR, BP, and Urine Color over time. | `SQLite` |
| **🔒 Privacy First** | Zero data leaves the device. Your health data is yours alone. | `On-Device Storage` |

---

## 🏗️ **Technical Architecture**

KidneyCare is built as a **Hybrid Application**, combining the flexibility of React with the raw performance of native Arm hardware.

### **1. System Architecture Diagram** 🌈
*High-level view of how the application components interact.*

```mermaid
graph TD
    %% Styles
    classDef user fill:#ff9a9e,stroke:#333,stroke-width:2px,color:black;
    classDef ui fill:#a18cd1,stroke:#333,stroke-width:2px,color:white;
    classDef logic fill:#84fab0,stroke:#333,stroke-width:2px,color:black;
    classDef db fill:#fccb90,stroke:#333,stroke-width:2px,color:black;
    classDef arm fill:#30cfd0,stroke:#333,stroke-width:4px,color:white;

    User[👤 Patient / User]:::user -->|Touch Input| UI[📱 React Native + SwiftUI Interface]:::ui
    
    subgraph "Application Layer 🛠️"
        UI -->|Updates| State[⚛️ State Management]:::logic
        State -->|Persist| DB[(💾 Local SQLite DB)]:::db
        State -->|Query| Logic[⚙️ Business Logic]:::logic
    end

    subgraph "Intelligence Layer (Offline) 🧠"
        Logic -->|Input Tensor| AI_Engine[🤖 AI Inference Engine]:::logic
        AI_Engine -->|Predictions| Logic
    end

    subgraph "Arm Hardware Layer 🦾"
        AI_Engine -->|Accelerate| ANE[⚡ Apple Neural Engine]:::arm
        UI -->|Render| GPU[🎨 Metal Optimized GPU]:::arm
        DB -->|I/O| SSD[💾 NVMe Storage]:::arm
    end
```

---

### **2. AI Processing Pipeline (Arm Optimized)** ⚡
*How we achieve real-time, offline AI inference without draining the battery.*

```mermaid
graph LR
    %% Styles
    classDef data fill:#fbc2eb,stroke:#333,stroke-width:2px;
    classDef process fill:#a6c1ee,stroke:#333,stroke-width:2px;
    classDef chip fill:#e0c3fc,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5;
    classDef output fill:#96e6a1,stroke:#333,stroke-width:2px;

    Data[📝 User Health Data]:::data -->|Pre-processing| Norm[⚖️ Normalization]:::process
    Norm -->|Input| Quant[📉 Int8 Quantization]:::process
    
    subgraph "Arm Architecture Execution ⚙️"
        Quant -->|Matrix Ops| AMX[🚀 AMX Co-processor]:::chip
        Quant -->|Background Tasks| E_Cores[🍃 Efficiency Cores]:::chip
        Quant -->|Heavy Compute| P_Cores[🔥 Performance Cores]:::chip
    end
    
    AMX -->|Result| Model[🔍 CKD Risk Model]:::output
    Model -->|Output| Score[📊 Risk Profile]:::output
```

---

### **3. Privacy & Data Flow** 🔒
*Ensuring patient confidentiality through local-only processing.*

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant App_UI as 📱 App UI
    participant Local_Store as 💾 Local DB
    participant AI_Model as 🧠 AI Model
    
    Note over User, AI_Model: 🌐 NO INTERNET CONNECTION REQUIRED
    
    User->>App_UI: ✍️ Enters BP & Creatinine
    App_UI->>Local_Store: 🔒 AES-256 Encrypt & Save
    App_UI->>AI_Model: ⚡ Request Risk Analysis
    AI_Model->>App_UI: 📊 Return Risk Score (Immediate)
    App_UI-->>User: 🥗 Display Diet Recommendations
    
    rect rgb(255, 230, 230)
        Note right of App_UI: ☁️ Cloud Sync: DISABLED ❌
    end
```

---

### **4. Arm Chip Utilization Block Diagram** 🔲
*Mapping KidneyCare features to specific silicon components.*

```mermaid
block-beta
    columns 3
    docTitle("KidneyCare Workload Distribution on Arm Silicon")
    
    block:CPU_Group
        columns 1
        CPU_Label["🧩 Arm CPU (Big.LITTLE)"]
        space
        block:Cores
            P_Core["🔥 P-Cores: UI & Logic"]
            E_Core["🍃 E-Cores: Background Logs"]
        end
    end

    block:GPU_Group
        columns 1
        GPU_Label["🎨 Arm / Apple GPU"]
        space
        Metal_API["⚙️ Metal API"]
        Render["🖼️ Anatomy Render"]
    end

    block:NPU_Group
        columns 1
        NPU_Label["🧠 Neural Engine (ANE)"]
        space
        CoreML["⚡ Core ML Delegate"]
        Inference["🤖 Risk Assessment"]
    end

    style CPU_Group fill:#ffdfba,stroke:#333,stroke-width:2px
    style GPU_Group fill:#bae1ff,stroke:#333,stroke-width:2px
    style NPU_Group fill:#baffc9,stroke:#333,stroke-width:2px
```

---

## ⚡ **How Arm Architecture is Used in KidneyCare**

KidneyCare utilizes the unique capabilities of Arm-based chips (A14–M3) to deliver a medical-grade experience on consumer hardware.

### **1. On-Device AI Processing 🧠**
*   **Mechanism**: The app offloads matrix multiplications to the **Apple Neural Engine (ANE)**.
*   **Benefit**: Enables real-time inference for our Risk Assessment AI (Transformers + Decision Trees) and generative illustrations.
*   **Result**: Zero latency, **100% offline capability**.

### **2. Performance Optimization 🚀**
*   **Mechanism**: Models are **quantized (int8/int4)**.
*   **Benefit**: Drastically reduces memory footprint and computation time.
*   **Result**: The app runs smoothly alongside other tasks, utilizing multi-core Arm CPUs for thread-balanced execution.

### **3. Energy Efficiency 🔋**
*   **Mechanism**: Heavy compute tasks are routed to **Performance Cores**, while background logging uses **Efficiency Cores**.
*   **Benefit**: Complex AI tasks do not drain the iPad battery.
*   **Result**: Health workers can use the device for full-day field visits in remote villages without recharging.

### **4. Seamless Integration (Core ML + Metal) 🖼️**
*   **Mechanism**: Direct access to the GPU via Metal for rendering educational 3D assets.
*   **Benefit**: High frame rates for interactive lessons and mini-games.
*   **Result**: An engaging, fluid user experience that feels premium and responsive.

---

## 🛤️ **User Journey Flow**

```mermaid
graph TD
  classDef start fill:#f96,stroke:#333,stroke-width:2px;
  classDef step fill:#fff,stroke:#333,stroke-width:1px;
  classDef endNode fill:#9f6,stroke:#333,stroke-width:2px;

  Start((🚀 Start)):::start --> Choice{New or Returning?}:::step
  Choice -- New --> Edu[📚 Educational Module]:::step
  Choice -- Returning --> Dash[📊 Dashboard]:::step
  
  Edu --> Quiz[❓ Quiz & Gamification]:::step
  Quiz --> Badge[🛡️ Earn 'Kidney Guardian']:::endNode
  
  Dash --> Action{Choose Action}:::step
  Action --> Assess[🩺 AI Risk Assessment]:::step
  Action --> Track[📝 Log Health Metrics]:::step
  
  Assess --> Result[📉 Personalized Report]:::endNode
  Track --> History[📅 View Trends]:::endNode
```

---

## 🛠 **Installation & Setup**

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/senushidinara/KidneyCare-AI-Powered-CKD-Awareness-Detection-Prevention.git
    cd KidneyCare-AI-Powered-CKD-Awareness-Detection-Prevention
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm start
    ```

4.  **Build for Production**
    ```bash
    npm run build
    # Deploys optimized assets for PWA / Capacitor wrapper
    ```

---

## 🏥 **Medical Disclaimer**
> *KidneyCare is a screening and education tool, not a diagnostic device. Always consult a qualified nephrologist for medical advice. In Sri Lanka, please visit your nearest MOH office or District Hospital for official testing.*

---

*Built with ❤️ for Sri Lanka.* 🇱🇰
