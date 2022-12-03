import Utils from '../../utils'
import { apiSuccessMessage, httpConstants } from '../../common/constants'
import BLManager from './manager'

export default class ContentsController {
    async addUser(request, response) {
        lhtWebLog('Inside addUser', request.body, 'addUser', 0, '');
        const [error, addUserRes] = await Utils.parseResponse(new BLManager().addUser(request.body));
        if (!addUserRes) return Utils.handleError(error, request, response)
        return Utils.response(response, addUserRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async updateUser(request, response) {
        lhtWebLog('Inside updateUser', request.body, 'updateUser', 0, '');
        const [error, updateUserRes] = await Utils.parseResponse(new BLManager().updateUser(request.body));
        if (!updateUserRes) return Utils.handleError(error, request, response)
        return Utils.response(response, updateUserRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async getUserDetails(request, response) {
        lhtWebLog('Inside getUserDetails', request.query, 'getUserDetails', 0, '');
        const [error, userRes] = await Utils.parseResponse(new BLManager().getUserDetails(request.query));
        if (!userRes) return Utils.handleError(error, request, response)
        return Utils.response(response, userRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async getUsersList(request, response) {
        lhtWebLog('Inside getUsersList', request.body, 'getUsersList', 0, '');
        const [error, userListRes] = await Utils.parseResponse(new BLManager().getUsersList(request.body));
        if (!userListRes) return Utils.handleError(error, request, response)
        return Utils.response(response, userListRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async searchByUsername(request, response) {
        lhtWebLog('Inside searchByUsername', request.body, 'searchByUsername', 0, '');
        const [error,searchUserRes] = await Utils.parseResponse(new BLManager().searchByUsername(request.body));
        if (!searchUserRes) return Utils.handleError(error, request, response)
        return Utils.response(response, searchUserRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

}
