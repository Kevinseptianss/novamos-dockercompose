class AuthenticationsHandler {
    constructor(authenticationsServices, service, tokenManager, validator) {
        this._authenticationsService = authenticationsServices;
        this._service = service;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    }

    async postAuthenticationHandler(request, h) {
        this._validator.validatePostAuthenticationPayload(request.payload);

        const { otp, uniq, phone } = request.payload;
        const id = await this._service.verifyUserCredential(otp, uniq, phone);

        const accessToken = this._tokenManager.generateAccessToken({ id });
        const refreshToken = this._tokenManager.generateRefreshToken({ id });

        await this._authenticationsService.addRefreshToken(refreshToken);

        const response = h.response({
            status: 'success',
            message: 'Authentication berhasil di tambahkan',
            data: {
                accessToken,
                refreshToken,
            },
        });
        response.code(201);
        return response;
    }

    async putAuthenticationHandler(request, h) {
        this._validator.validatePutAuthenticationPayload(request.payload);

        const { refreshToken } = request.payload;
        await this._authenticationsService.verifyRefreshToken(refreshToken);
        const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
        const accessToken = this._tokenManager.generateAccessToken({ id });
        return {
            status: 'success',
            message: 'Access Token Berhasil di perbaharui',
            data: {
                accessToken,
            },
        };
    }
    
    async deleteAuthenticationHandler(request, h) {
        this._validator.validateDeleteAuthenticationPayload(request.payload);

        const { refreshToken } = request.payload;
        await this._authenticationsService.verifyRefreshToken(refreshToken);
        await this._authenticationsService.deleteRefreshToken(refreshToken);

        return {
            status: 'success',
            message: 'Refresh token berhasil di hapus',
        };
    }
}

module.exports = AuthenticationsHandler;