import UserModel from "../../models/user";
import FollowModel from "../../models/follow";
import RatingsModel from "../../models/ratings";
import BlockModel from "../../models/block";
import Utils from "../../utils";
import Auth0Controller from "./auth0";
import {
  constants,
  httpConstants,
  apiFailureMessage,
  apiSuccessMessage,
  apiEndpoints,
  genericConstants,
} from "../../common/constants";
import Config from "../../../config";
import NotificationManager from "../notification/manager";
import HttpService from "../../service/http-service";

const stripe = require("stripe")(Config.STRIPE_PRIVATE_KEY);

export default class Manager {
  addUser = async (requestData) => {
    const requestObject = {
      email: requestData.email,
      authId: requestData.authId,
      username: requestData.username,
      fullName: requestData.fullName,
      dateOfBirth: 0,
      addressLine: "NA",
      city: "NA",
      zipCode: 0,
      state: 0,
      country: "NA",
      countryCode: 0,
      phoneNumber: 0,
      addedOn: Date.now(),
      modifiedOn: Date.now(),
    };
    const userObject = new UserModel(requestObject);
    const newUser = await userObject.save().catch(() => {
      return Utils.returnRejection(
        apiFailureMessage.CREATE_USER_FAIL,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    });
    return newUser;
  };

  updateUser = async (requestData) => {
    const responseUser = await UserModel.findOneData({
      email: requestData.email,
    }).catch(() => {
      return Utils.returnRejection(
        apiFailureMessage.GET_USER_DATA_FAIL,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    });
    if (!responseUser)
      return Utils.returnRejection(
        apiFailureMessage.USER_NOT_FOUND,
        httpConstants.RESPONSE_CODES.NOT_FOUND
      );
    // If user is creating profile for first time
    if (responseUser.status === httpConstants.USER_STATUS.SIGNED_UP) {
      requestData["status"] = httpConstants.USER_STATUS.PROFILE_CREATED;
    }
    const updatedUserRes = await UserModel.findOneAndUpdateData(
      { _id: responseUser._id },
      requestData
    ).catch(() => {
      return Utils.returnRejection(
        apiFailureMessage.UPDATE_USER_FAIL,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    });
    return updatedUserRes;
  };

  getUserDetails = async (requestData) => {
    let request = {};
    if (requestData.email) {
      let substring = " ";
      let userEmail = requestData.email;
      if (userEmail.includes(substring)) {
        const emailIndex = userEmail.indexOf(substring);
        String.prototype.replaceAtIndex = function (_index, _newValue) {
          return (
            this.substr(0, _index) +
            _newValue +
            this.substr(_index + _newValue.length)
          );
        };
        request["email"] = userEmail.replaceAtIndex(emailIndex, "+");
      } else {
        request["email"] = requestData.email;
      }
    }
    if (requestData.id) request["_id"] = requestData.id;
    if (requestData.userName) request["username"] = requestData.userName;
    if (request.email || request._id || request.username) {
    } else
      return Utils.returnRejection(
        apiFailureMessage.SOME_DATA_REQUIRED,
        httpConstants.RESPONSE_CODES.NOT_FOUND
      );
    let blockList = await this.getBlockedUsers(requestData.currentUser);
    if (request._id)
      request = { $and: [{ _id: request._id }, { _id: { $nin: blockList } }] };
    else request = { ...request, _id: { $nin: blockList } };
    let responseUser = await UserModel.findOneData(request).catch(() => {
      return Utils.returnRejection(
        apiFailureMessage.GET_USERDETAILS_FAIL,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    });
    if (!responseUser)
      return Utils.returnRejection(
        apiFailureMessage.USER_NOT_FOUND,
        httpConstants.RESPONSE_CODES.NOT_FOUND
      );

    //Auth0 Token and UserDetails
    const tokenRes = await new Auth0Controller().getToken();
    const response = await new Auth0Controller().getUserDetails(
      tokenRes.access_token,
      responseUser.email
    );
    if (!response[0] || !response[0].email)
      return Utils.returnRejection(
        "user not found",
        httpConstants.RESPONSE_CODES.NOT_FOUND
      );
    if (response[0].email && response[0].email_verified === true)
      if (responseUser.emailVerified === false) {
        return await UserModel.findOneAndUpdate(
          { _id: responseUser._id },
          { emailVerified: true },
          { new: true }
        ).catch(() => {
          return Utils.returnRejection(
            apiFailureMessage.SOMETHING_WENT_WRONG,
            httpConstants.RESPONSE_CODES.BAD_REQUEST
          );
        });
      }
      
    const parseObj = JSON.parse(JSON.stringify(responseUser));
    parseObj.walletBalance = 0;
    parseObj.totalBalance = 0;
    
    if (responseUser.connectedAccountId) {
      const balance = await stripe.balance
        .retrieve({
          stripeAccount: responseUser.connectedAccountId,
        })
        .catch(() => {
          return Utils.returnRejection(
            apiFailureMessage.USER_NOT_FOUND,
            httpConstants.RESPONSE_CODES.NOT_FOUND
          );
        });
  
      parseObj.walletBalance =
        balance.available[0].amount / genericConstants.STRIPE_CASH;
      parseObj.totalBalance =
        balance.pending[0].amount / genericConstants.STRIPE_CASH +
        parseObj.walletBalance;
    }

    if (requestData.currentUser) {
      let isFollowing = await FollowModel.findOneData({
        follower: requestData.currentUser,
        user: parseObj._id,
      }).catch(() => {});
      parseObj.isFollowing = isFollowing ? true : false;
    }

    return parseObj;
  };

  getUsersList = async (requestData) => {
    if (!requestData.currentUser)
      return Utils.returnRejection(
        apiFailureMessage.CURRENT_USERID_REQUIRED,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    const currentUserId = requestData.currentUser;
    delete requestData.currentUser;
    let blockList = await this.getBlockedUsers(currentUserId);
    const userListRequest = this.parseGetUserListRequest(requestData);

    let userList = await UserModel.getDocuments(
      {
        $and: [
          userListRequest.requestData,
          { _id: { $nin: [...blockList, currentUserId] } },
        ],
      },
      userListRequest.selectionKeys,
      userListRequest.skip,
      userListRequest.limit,
      userListRequest.sortingKey
    ).catch(() => {
      return Utils.returnRejection(
        apiFailureMessage.SOMETHING_WENT_WRONG,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    });

    const totalDocuments = await UserModel.countData(
      userListRequest.requestData
    );
    const totalPages = Math.ceil(totalDocuments / userListRequest.limit);

    userList = JSON.stringify(userList);
    userList = JSON.parse(userList);
    let newList = await this.checkListForFollowing(currentUserId, userList);
    // Find which users are being followed already
    return { newList, totalPages };
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

  searchByUsername = async (requestData) => {
    const blockList = await this.getBlockedUsers(requestData.currentUser);

    const findObj = {
      $or: [
        { username: { $regex: requestData.userName, $options: "i" } },
        { fullName: { $regex: requestData.userName, $options: "i" } },
      ],
      _id: { $nin: [...blockList, requestData.currentUser] },
    };
    const userResponse = await UserModel.findDataWithPagination(
      findObj,
      requestData.skip || 0,
      requestData.limit || 15,
      { username: 1 }
    ).catch(() => {
      return Utils.returnRejection(
        apiFailureMessage.USER_NOT_FOUND,
        httpConstants.RESPONSE_CODES.NOT_FOUND
      );
    });

    // calculating total pages
    const totalDocuments = await UserModel.countData(findObj);
    const totalPages = Math.ceil(totalDocuments / (requestData.limit || 15));

    // get block list of current user
    let currentBlockList = await BlockModel.findData({
      currentUser: requestData.currentUser,
    })
      .distinct("targetUser")
      .catch(() => {});

    // convert objcetId to string
    currentBlockList = currentBlockList.map((user) => String(user));

    // get followings of current user
    const followingUsers = userResponse.map((user) => user._id);
    let userFollowing = await FollowModel.findData({
      follower: requestData.currentUser,
      user: { $in: followingUsers },
    })
      .distinct("user")
      .catch(() => {});

    // convert objcetId to string
    userFollowing = userFollowing.map((user) => String(user));

    // add isFollowing and isBlocked key
    const partyList = userResponse.map((user) => {
      let returnObject;
      // check isfollowing
      if (userFollowing.includes(String(user._id)))
        returnObject = { ...user._doc, isFollowing: true };
      else returnObject = { ...user._doc, isFollowing: false };

      // check isblocked
      if (currentBlockList.includes(String(user._id)))
        return { ...returnObject, isBlocked: true };
      else return { ...returnObject, isBlocked: false };
    });

    return { partyList, totalPages };
  };

}
