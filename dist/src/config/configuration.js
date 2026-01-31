"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-change-this',
        expiresIn: process.env.JWT_EXPIRATION || '15m',
    },
    refreshToken: {
        secret: process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret-change-this',
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
    },
});
//# sourceMappingURL=configuration.js.map