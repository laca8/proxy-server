# 🔁 Vercel Proxy Server

A lightweight proxy server built with Node.js and `http-proxy`, designed to run on [Vercel](https://vercel.com) using **Serverless API Functions**.

This proxy allows forwarding requests from `/api/proxy/...` to any external API like [JSONPlaceholder](https://jsonplaceholder.typicode.com).

---

## ⚙️ Technologies Used

- Node.js
- [http-proxy](https://www.npmjs.com/package/http-proxy)
- Vercel Serverless Functions
- JSONPlaceholder API (as example target)

---

## 🚀 How It Works

1. User sends a request to `/api/proxy/route`
2. The proxy strips the `/api/proxy` prefix
3. It forwards the request to a target external API
4. The response is sent back to the client

---

## 🧱 Project Structure

project-root/
├── api/
│ └── proxy.js
├── package.json
├── vercel.json