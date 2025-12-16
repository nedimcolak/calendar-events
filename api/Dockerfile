FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY tsconfig.json ./

COPY prisma ./prisma/

RUN npm run db:generate

COPY src ./src/

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh && \
    dos2unix /app/entrypoint.sh 2>/dev/null || sed -i 's/\r$//' /app/entrypoint.sh

EXPOSE 3000

# Set entrypoint
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
