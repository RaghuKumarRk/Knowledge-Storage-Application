import Utils from '../app/utils'
import * as yup from 'yup'

module.exports = {

  validateUserSignUp: async (req, res, next) => {
    const schema = yup.object().shape({
      email: yup.string().email(),
      authId : yup.string().required(),
      username : yup.string().required(),
      fullName : yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },

  validateAddDevice: async (req, res, next) => {
    const schema = yup.object().shape({
      deviceID: yup.string().required(),
      deviceType : yup.string().required(),
      pushToken : yup.string().required(),
      user: yup.string().required()
    })
    await validate(schema, req.body, res, next)
  },

  validateUserUpdate: async (req, res, next) => {
    const schema = yup.object().shape({
      email: yup.string().email(),
      fullName : yup.string(),
      profileImage : yup.string(),
      dateOfBirth : yup.number(),
      addressLine : yup.string(),
      city : yup.string(),
      zipCode : yup.number(),
      state : yup.string(),
      country : yup.string(),
      countryCode : yup.string(),
      phoneNumber : yup.number(),
      university : yup.string()
    })
    await validate(schema, req.body, res, next)
  },

  validateRateParty: async (req, res, next) => {
    const schema = yup.object().shape({
      userId: yup.string().required(),
      rating: yup.number().required(),
      targetUserId: yup.string().required(),
      partyId: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },


  ValidatefollowUnfollow: async (req, res, next) => {
    const schema = yup.object().shape({
      userId: yup.string().required(),
      targetUserId : yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },

  validateSearchByUsername: async (req, res, next) => {
    const schema = yup.object().shape({
      currentUser: yup.string().required(),
      userName: yup.string().required()
    })
    await validate(schema, req.body, res, next)
  },
  
  changeUsername: async (req, res, next) => {
    const schema = yup.object().shape({
      username: yup.string().required(),
      newUsername : yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },
  changePassword: async (req, res, next) => {
    const schema = yup.object().shape({
      email: yup.string().required(),
      authId : yup.string().required(),
      oldPassword: yup.string().required(),
      newPassword: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },
  validateLoginAndLogoutDevice: async (req, res, next) => {
    const schema = yup.object().shape({
      deviceID: yup.string().required(),
      pushToken: yup.string().required(),
      user: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },
  validateSendPushNotification: async (req, res, next) => {
    const schema = yup.object().shape({
      title: yup.string().required(),
      description: yup.string().required(),
      receiver: yup.string().required(),
      sender: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },
  validateHelp: async (req, res, next) => {
    const schema = yup.object().shape({
      userId: yup.string().required(),
      topic: yup.string().required(),
      message: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },
  validateBlockUser: async (req, res, next) => {
    const schema = yup.object().shape({
      targetUser: yup.string().required(),
      currentUser: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },
  validateBlockUserList: async (req, res, next) => {
    const schema = yup.object().shape({
      currentUser: yup.string().required(),
    })
    await validate(schema, req.query, res, next)
  },
  validateUnblockUser: async (req, res, next) => {
    const schema = yup.object().shape({
      targetUser: yup.string().required(),
      currentUser: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },
  validateCheckBlockStatus: async (req, res, next) => {
    const schema = yup.object().shape({
      targetUser: yup.string().required(),
      currentUser: yup.string().required(),
    })
    await validate(schema, req.query, res, next)
  },
  validateGetRating: async (req, res, next) => {
    const schema = yup.object().shape({
      user: yup.string().required(),
      targetUser: yup.string().required(),
      partyId: yup.string().required(),
    })
    await validate(schema, req.body, res, next)
  },
  validateCheckEmailExist: async(req, res, next) =>{
    const schema = yup.object().shape({
      email:yup.string().required()
    })
    await validate(schema, req.query, res, next)
  },

}




const validate = async (schema, reqData, res, next) => {
  try {
    await schema.validate(reqData, { abortEarly: false })
    next()
  } catch (e) {
    const errors = e.inner.map(({ path, message, value }) => ({ path, message, value }))
    Utils.responseForValidation(res, errors)
  }
}
