export const redisKeys = {
    getRegisterOtpKey(email: string): string {
        return `register_otp:${email}`;
    },

    getForgotPasswordOtpKey(email: string): string {
        return `forgot_password_otp:${email}`;
    },

    getBlacklistKey(user_session_id: string): string {
        return `blacklist:${user_session_id}`;
    },

    getRefreshTokenKey(user_session_id: string): string {
       return `refresh_token:${user_session_id}`;
    }, 
}