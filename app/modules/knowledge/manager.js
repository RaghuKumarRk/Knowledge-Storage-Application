import KnowledgeModel from "../../models/knowledge";
import TodoModel from "../../models/todo";
import Utils from "../../utils";
import {
  constants,
  httpConstants,
  apiFailureMessage,
  apiSuccessMessage,
  apiEndpoints,
  genericConstants,
} from "../../common/constants";
import Config from "../../../config";


export default class Manager {
  addKnowledge = async (requestData) => {
    const requestObject = {
      topicName: requestData.topicName,
      description: requestData.description,
      workingSteps: requestData.workingSteps,
    };
    const knowledgeObject = new KnowledgeModel(requestObject);
    const newKnowledge = await knowledgeObject.save().catch(() => {
      return Utils.returnRejection(
        apiFailureMessage.CREATE_KNOWLEDGE_FAIL,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    });
    return newKnowledge;
  };

  updateKnowledge = async (requestData) => {
    const responseKnowledge = await KnowledgeModel.findOneData({
      _id: requestData.knowledgeId,
    }).catch(() => {
      return Utils.returnRejection(
        apiFailureMessage.GET_KNOWLEDGE_DATA_FAIL,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    });
    if (!responseKnowledge)
      return Utils.returnRejection(
        apiFailureMessage.KNOWLEDGE_NOT_FOUND,
        httpConstants.RESPONSE_CODES.NOT_FOUND
      );
    
    const updatedKnowledgeRes = await KnowledgeModel.findOneAndUpdateData(
      { _id: responseKnowledge._id },
      requestData
    ).catch(() => {
      return Utils.returnRejection(
        apiFailureMessage.UPDATE_KNOWLEDGE_FAIL,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    });
    return updatedKnowledgeRes;
  };

  getKnowledgeDetails = async (requestData) => {
    let responseKnowledge = await KnowledgeModel.findOneData(requestData.knowledgeId).catch(() => {
      return Utils.returnRejection(
        apiFailureMessage.GET_KNOWLEDGE_DATA_FAIL,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    });
    if (!responseKnowledge)
      return Utils.returnRejection(
        apiFailureMessage.KNOWLEDGE_NOT_FOUND,
        httpConstants.RESPONSE_CODES.NOT_FOUND
      );
    return responseKnowledge;
  };

  getKnowledgeList = async (requestData) => {
    const knowledgeListRequest = this.parseGetUserListRequest(requestData);

    let knowledgeList = await KnowledgeModel.getDocuments(
      {
        $and: [
          knowledgeListRequest.requestData,
        ],
      },
      knowledgeListRequest.selectionKeys,
      knowledgeListRequest.skip,
      knowledgeListRequest.limit,
      knowledgeListRequest.sortingKey
    ).catch(() => {
      return Utils.returnRejection(
        apiFailureMessage.KNOWLEDGE_NOT_FOUND,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    });

    const totalDocuments = await KnowledgeModel.countData(
      knowledgeListRequest.requestData
    );
    const totalPages = Math.ceil(totalDocuments / knowledgeListRequest.limit);
    knowledgeList = JSON.stringify(knowledgeList);
    knowledgeList = JSON.parse(knowledgeList);
    return { knowledgeList, totalPages };
  };

  parseGetUserListRequest = (requestObj) => {
    if (!requestObj) return {};
    let skip = 0;
    if (requestObj.skip || requestObj.skip === 0) {
      skip = requestObj.skip;
      delete requestObj.skip;
    }
    let limit = 15;
    if (requestObj.limit) {
      limit = requestObj.limit;
      delete requestObj.limit;
    }
    let sortingKey = "username";
    if (requestObj.sortingKey) {
      sortingKey = requestObj.sortingKey;
      delete requestObj.sortingKey;
    }
    let selectionKeys = "";
    if (requestObj.selectionKeys) {
      selectionKeys = requestObj.selectionKeys;
      delete requestObj.selectionKeys;
    }
    let searchQuery = [];
    if (
      requestObj.searchKeys &&
      requestObj.searchValue &&
      Array.isArray(requestObj.searchKeys) &&
      requestObj.searchKeys.length
    ) {
      requestObj.searchKeys.map((searchKey) => {
        let searchRegex = { $regex: requestObj.searchValue, $options: "i" };
        searchQuery.push({ [searchKey]: searchRegex });
      });
      requestObj["$or"] = searchQuery;
    }
    if (requestObj.searchKeys) delete requestObj.searchKeys;
    if (requestObj.searchValue) delete requestObj.searchValue;
    return {
      requestData: requestObj,
      skip: skip,
      limit: limit,
      sortingKey: sortingKey,
      selectionKeys: selectionKeys,
    };
  };

  searchByTopicName = async (requestData) => {
    const findObj = {
      $or: [
        { topicName: { $regex: requestData.topicName, $options: "i" } },
        { description: { $regex: requestData.topicName, $options: "i" } },
      ]};
    const knowledgeResponse = await KnowledgeModel.findDataWithPagination(
      findObj,
      requestData.skip || 0,
      requestData.limit || 15,
      { topicName: 1 }
    ).catch(() => {
      return Utils.returnRejection(
        apiFailureMessage.KNOWLEDGE_NOT_FOUND,
        httpConstants.RESPONSE_CODES.NOT_FOUND
      );
    });

    // calculating total pages
    const totalDocuments = await KnowledgeModel.countData(findObj);
    const totalPages = Math.ceil(totalDocuments / (requestData.limit || 15));
    return { knowledgeResponse, totalPages };
  };

}
