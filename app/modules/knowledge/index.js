import Utils from '../../utils'
import { apiSuccessMessage, httpConstants } from '../../common/constants'
import BLManager from './manager'

export default class ContentsController {
    async addKnowledge(request, response) {
        lhtWebLog('Inside addKnowledge', request.body, 'addKnowledge', 0, '');
        const [error, addKnowledgeRes] = await Utils.parseResponse(new BLManager().addKnowledge(request.body));
        if (!addKnowledgeRes) return Utils.handleError(error, request, response)
        return Utils.response(response, addKnowledgeRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async updateKnowledge(request, response) {
        lhtWebLog('Inside updateKnowledge', request.body, 'updateKnowledge', 0, '');
        const [error, updateKnowledgeRes] = await Utils.parseResponse(new BLManager().updateKnowledge(request.body));
        if (!updateKnowledgeRes) return Utils.handleError(error, request, response)
        return Utils.response(response, updateKnowledgeRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async getKnowledgeDetails(request, response) {
        lhtWebLog('Inside getKnowledgeDetails', request.query, 'getKnowledgeDetails', 0, '');
        const [error, knowledgeRes] = await Utils.parseResponse(new BLManager().getKnowledgeDetails(request.query));
        if (!knowledgeRes) return Utils.handleError(error, request, response)
        return Utils.response(response, knowledgeRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async getKnowledgeList(request, response) {
        lhtWebLog('Inside getKnowledgeList', request.body, 'getUsersList', 0, '');
        const [error, knowledgeListRes] = await Utils.parseResponse(new BLManager().getKnowledgeList(request.body));
        if (!knowledgeListRes) return Utils.handleError(error, request, response)
        return Utils.response(response, knowledgeListRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

    async searchByTopicName(request, response) {
        lhtWebLog('Inside searchByTopicName', request.body, 'searchByTopicName', 0, '');
        const [error,searchTopicRes] = await Utils.parseResponse(new BLManager().searchByTopicName(request.body));
        if (!searchTopicRes) return Utils.handleError(error, request, response)
        return Utils.response(response, searchTopicRes, apiSuccessMessage.FETCH_SUCCESS, httpConstants.RESPONSE_STATUS.SUCCESS, httpConstants.RESPONSE_CODES.OK)
    }

}
