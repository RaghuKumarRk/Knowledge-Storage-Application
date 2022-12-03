export const httpConstants = {
  METHOD_TYPE: {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    PATCH: 'PATCH'
  },
  HEADER_TYPE: {
    URL_ENCODED: 'application/x-www-form-urlencoded',
    APPLICATION_JSON: 'application/json'
  },
  HEADER_KEYS: {
    DEVICE_TYPE: 'device-type',
    DEVICE_ID: 'device-id',
    SESSION_TOKEN: 'session-token',
    PUSH_TOKEN: 'push-token'
  },
  USER_STATUS: {
    SIGNED_UP: "SIGNED_UP",
    PROFILE_CREATED: "PROFILE_CREATED",
  },
  DEVICE_TYPE: {
    ANDROID: 'android',
    IOS: 'ios',
    WEB: 'web'
  },
  CONTENT_TYPE: {
    URL_ENCODE: 'application/x-www-form-urlencoded'
  },
  WEBSERVICE_PATH: {
    SYNC_ATTENDANCE: 'sync-attendance/'
  },
  AUTH0:{
    GRANT_TYPE :"client_credentials",
    GRANT_TYPE_PASSWORD: "password",
    CONNECTION: 'Username-Password-Authentication',
  },

  RESPONSE_STATUS: {
    SUCCESS: true,
    FAILURE: false
  },
  RESPONSE_CODES: {
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
    NOT_FOUND: 404,
    OK: 200,
    NO_CONTENT_FOUND: 204,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    GONE: 410,
    UNSUPPORTED_MEDIA_TYPE: 415,
    TOO_MANY_REQUEST: 429
  },
  LOG_LEVEL_TYPE: {
    INFO: 'info',
    ERROR: 'error',
    WARN: 'warn',
    VERBOSE: 'verbose',
    DEBUG: 'debug',
    SILLY: 'silly',
    FUNCTIONAL: 'functional',
    HTTP_REQUEST: 'http request'
  },
  API_MESSAGES: {
    INVALID_RATING: 'Rating should be greater than 1 or less than 5'
  }
}

export const stringConstants = {
  SERVICE_STATUS_HTML:
    '<body style="font-family: Helvetica !important; background-color: black">' +
    '<div style="display: flex; flex:1; height: 100% ; justify-content: center; align-items: center; min-height: 100vh !important; font-size: 24px !important; color: #605DFF !important;">' +
    '⚡  KSA 🔋 MicroService is working fine</div></body>'
}

export const genericConstants = {
  DEVICE_TYPE: {},
  STRIPE_CASH: 100,
}

export const apiSuccessMessage = {
  FETCH_SUCCESS: 'Information fetched successfully.',
  CREATE_KNOWLEDGE_SUCCESS: 'Knowledge created successfully.',
  UPDATE_KNOWLEDGE_SUCCESS: 'Knowledge updated successfully.'
}

export const apiEndpoints = {
}

export const apiFailureMessage = {
  INVALID_PARAMS: 'Invalid Parameters',
  INVALID_REQUEST: 'Invalid Request',
  CREATE_KNOWLEDGE_FAIL: 'Failed to create knowledge.',
  GET_KNOWLEDGE_DATA_FAIL: 'Failed to get knowledge data',
  KNOWLEDGE_NOT_FOUND: "Knowledges not found",
  UPDATE_KNOWLEDGE_FAIL: 'Failed to Update knowledge',
}
export const NOTIFICATION_EVENTS = {
  CREATE_PROFILE: 'create-profile-notification',
  UPDATE_PROFILE: 'update-profile-notification',
  RATE_PARTY: 'rate-party-notification',
  FOLLOW: 'follow-notification',
  UNFOLLOW: 'unfollow-notification',
  GET_HELP: 'get-help'

}
export const constants = {
  AMQP: {
    EXCHANGE_TYPE: {
      FANOUT: 'fanout',
      TOPIC: 'topic'
    },
    QUEUE_TYPE: {
        PUB_SUB: 'publisher_subscriber_queue',
        ROUTING_QUEUE: 'routing_queue',
    },
    PAYLOAD_DATA: {
      SENT_FROM: 'MOODAY',
      SENT_FROM_HELPDESK: 'Mooday Helpdesk',
      NOTIFICATION_TITLE: {
        FOLLOW: 'New follower added',
        BLOCK_USER: "Block",
        UNBLOCK_USER: "Unblock",
      },
      NOTIFICATION_FOR: {
        FOLLOW: "followerAdded",
        TWILIO_MESSAGE: "twilioMessage",
        BLOCK_USER: "blockUser",
        UNBLOCK_USER: "unblockUser",
      },
      NOTIFICATION_TYPE_PUSH: 'push',
      NOTIFICATION_TYPE_EMAIL: 'email',
      NOTIFICATION_TYPE_SMS: 'sms',
      NOTIFICATION_TYPE_SLACK: 'slack',
    }
  }
}
