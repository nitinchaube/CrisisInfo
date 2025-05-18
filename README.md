# 🧠 Event Intelligence Dashboard

An interactive single-page web application to detect, group, and visualize real-world events using semantic similarity.

This project leverages a Retrieval-Augmented Generation (RAG) pipeline using **ChromaDB** and **transformer embeddings** to deduplicate events (e.g., tweets), store them in a structured JSON format, and visualize relationships via graphs.

---

## 🌍 Live Demo

- 🔗 Frontend (GitHub Pages):
- 🔗 Backend API (Render): 

---

## 📌 Features

- 📝 **Submit Tweets or Event Descriptions**
- 🧠 **Check for Similar Events via Chroma Vector Search**
- 📦 **Store Events in `events.json` + ChromaDB**
- 🌐 **Filter Events by Type or Location**
- 🧩 **View Clickable Event Graphs**
- 📊 **Visualize Entity Relationships Dynamically**

---

## 🖥️ Tech Stack

| Layer        | Tech                            |
|--------------|---------------------------------|
| Frontend     | React + Vite + Tailwind CSS     |
| Graph Engine | `react-force-graph-2d`          |
| Backend      | Flask or FastAPI (Render)       |
| Vector Store | ChromaDB                        |
| Embeddings   | `all-mpnet-base-v2` (via Sentence Transformers) |
| Hosting      | GitHub Pages (Frontend) + Render (Backend) |

---

## 🧱 Layout Overview

+------------------------------------------------------+
| Header |
+------------------------------------------------------+
| [ Tweet/Event Submission Box ] |
+------------------------------------------------------+
| Filter Panel (20%) | Interactive Event Graph (80%) |
+---------------------+----------------------------------+




