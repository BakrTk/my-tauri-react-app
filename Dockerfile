# 🐧 اختيار صورة تدعم ARMv7 (Raspberry Pi)
FROM arm32v7/debian:bullseye

# 🛠️ منع apt من حفظ ملفات الحزم لتفادي مشاكل read-only system
RUN echo 'Dir::Cache::archives "";' >> /etc/apt/apt.conf.d/no-cache

# 📦 تثبيت الأدوات الأساسية وتبعيات GTK/WebKit وSSL وGLib
RUN apt-get update && apt-get install -y \
    curl build-essential pkg-config \
    libssl-dev libgtk-3-dev libwebkit2gtk-4.0-dev \
    libayatana-appindicator3-dev librsvg2-dev \
    libglib2.0-dev \
    git ca-certificates

# ضبط متغير البيئة PKG_CONFIG_PATH ليشمل مسارات ملفات pkg-config الخاصة بـ GLib
ENV PKG_CONFIG_PATH="/usr/lib/arm-linux-gnueabihf/pkgconfig:/usr/lib/pkgconfig"

# 🔧 تثبيت Node.js (مثال: الإصدار 18.x)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# 🦀 تثبيت Rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# 🚀 تثبيت tauri-cli
RUN cargo install tauri-cli

# 📂 تعيين مجلد العمل داخل الحاوية
WORKDIR /app

# 📥 نسخ ملفات المشروع إلى الحاوية
COPY . .

# 📦 تثبيت تبعيات npm
RUN npm install

# ⚒️ بناء تطبيق الواجهة (React / Vue / Svelte...)
RUN npm run build

# 🏗️ بناء تطبيق Tauri بداخل src-tauri
RUN cd src-tauri && cargo build --release

# ✅ التطبيق النهائي سيكون هنا داخل الحاوية:
# /app/src-tauri/target/release/<اسم التطبيق>

# 🖥️ عند تشغيل الحاوية - افتح bash فقط (اختياري)
CMD ["/bin/bash"]
