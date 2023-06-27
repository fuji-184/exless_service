# Gunakan image dasar yang sesuai dengan kebutuhan aplikasi Anda
FROM node:14

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json ke dalam direktori kerja
COPY package*.json ./

# Install dependensi aplikasi
RUN npm install

# Salin seluruh kode aplikasi ke dalam direktori kerja
COPY . .

# Expose port yang akan digunakan oleh aplikasi
EXPOSE 3000

# Tentukan perintah default yang akan dijalankan saat container berjalan
CMD ["npm", "start"]
