"use strict";

const request = require("request");

/**
 * To get the access token for each connection with the API
 *
 * @param {string} CLIENT_ID
 * @param {string} CLIENT_SECRET
 * @param {string} SCOPE join all scopes with a + https://dev.twitch.tv/docs/authentication#scopes
 * @returns {Array}
 * @example
 * Twitch.getToken('CLIENT_ID', 'CLIENT_SECRET', 'user:read:email').then(token => {
 *  console.log(token);
 * });
 */

exports.getToken = (CLIENT_ID, CLIENT_SECRET, SCOPE) => {
  let token_request = {
    method: "POST",
    url: `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials&scope=${SCOPE}`,
    headers: {
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(token_request, function (error, response, body) {
      if (error) {
        reject(error);
      }
      if (!body) return;
      const token = JSON.parse(body);
      resolve(token);
    });
  }).catch((error) => console.log("whoops"));
};

/**
 * Gets information about one Twitch user.
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} username Broadcaster userusername
 * @returns {Array}
 * @example
 * Twitch.getUserInfo("alex_off", token).then(info => {
 *      let result = info.data[0];
 *      console.log(result)
 *  });
 */

exports.getUserInfo = (token, client_id, username) => {
  let getid = {
    method: "GET",
    url: `https://api.twitch.tv/helix/users?login=${username}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(getid, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Get Cheermotes info
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID (optional)
 * @returns {Array}
 */

exports.getCheermotes = (token, client_id, broadcaster_id) => {
  let target_url;
  if (broadcaster_id != undefined) {
    target_url = {
      method: "GET",
      url: `https://api.twitch.tv/helix/bits/cheermotes?broadcaster_id=${broadcaster_id}`,
      headers: {
        "client-id": `${client_id}`,
        Authorization: `Bearer ${token}`,
        Cookie:
          "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
      },
    };
  } else {
    target_url = {
      method: "GET",
      url: `https://api.twitch.tv/helix/bits/cheermotes`,
      headers: {
        "client-id": `${client_id}`,
        Authorization: `Bearer ${token}`,
        Cookie:
          "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
      },
    };
  }
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Get Bits Leaderboard (all optional except the token)
 * Required scope : bits:read
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID
 * @returns {Array}
 */

exports.getBitsLeaderboard = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/bits/leaderboard?user_id${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Get Game analytics (all optional except the token and client_id)
 * Require scope : analytics:read:games
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} game_id Game ID
 * @returns {Array}
 */

exports.getGameAnalytics = (token, client_id, game_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/analytics/games?game_id=${game_id}&first=100`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets the list of Extension Transactions for a given extension.
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} extension_id ID of the extension to list
 * @returns {Array}
 */

exports.getExtensionTransactions = (token, client_id, extension_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/extensions/transactions?extension_id=${extension_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets clip information by clip ID (one only), broadcaster ID (one only), or game ID (one only).
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} id ID of the clip or broadcaster (if first)
 * @param {number} first Number of objects to return (max 100)
 * @returns {Array}
 */

exports.getClips = (token, client_id, id, first) => {
  let target_url;
  if (first != undefined) {
    target_url = {
      method: "GET",
      url: `https://api.twitch.tv/helix/clips?broadcaster_id=${id}&first=${first}`,
      headers: {
        "client-id": `${client_id}`,
        Authorization: `Bearer ${token}`,
        Cookie:
          "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
      },
    };
  } else {
    target_url = {
      method: "GET",
      url: `https://api.twitch.tv/helix/clips?id=${id}`,
      headers: {
        "client-id": `${client_id}`,
        Authorization: `Bearer ${token}`,
        Cookie:
          "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
      },
    };
  }
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets a list of entitlements for a given organization that have been granted to a game, user, or both.
 * @deprecated Not tested
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} id Broadcaster ID (get with : getUserInfo)
 * @returns {Array}
 */

exports.getDropsEntitlements = (token, client_id, user_id, game_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/entitlements/drops?user_id=${user_id}&game_id=${game_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets games sorted by number of current viewers on Twitch, most popular first.
 * Not tested
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {number} first Number of objects to return (max 100)
 * @returns {Array}
 */

exports.getTopGames = (token, client_id, first) => {
  let url;
  url = "https://api.twitch.tv/helix/games/top";
  if (first != undefined)
    url = `https://api.twitch.tv/helix/games/top?first=${first}`;
  let target_url = {
    method: "GET",
    url: url,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets game information by game ID or name.
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} game_id Game ID
 * @returns {Array}
 */

exports.getGames = (token, client_id, game_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/games?id=${game_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets the information of the most recent Hype Train of the given channel ID.
 * Require scope: channel:read:hype_train
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID
 * @returns {Array}
 */

exports.getHypeTrainEvents = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/hypetrain/events?broadcaster_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Returns all banned and timed-out users in a channel.
 * Require scope: moderation:read
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID
 * @returns {Array}
 */

exports.getBanned = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/moderation/banned?broadcaster_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Returns all user bans and un-bans in a channel.
 * Require scope: moderation:read
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID
 * @returns {Array}
 */

exports.getBannedEvents = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/moderation/banned/events?broadcaster_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Returns all moderators in a channel.
 * Require scope: moderation:read
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID
 * @returns {Array}
 */

exports.getModerators = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Returns a list of moderators or users added and removed as moderators from a channel.
 * Require scope: moderation:read
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID
 * @returns {Array}
 */

exports.getmoderatorEvents = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/moderation/moderators/events?broadcaster_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Returns a list of games or categories that match the query via name either entirely or partially.
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} name Categorie name
 * @returns {Array}
 */

exports.searchCategories = (token, client_id, name) => {
  let searchcategories = {
    method: "GET",
    url: `https://api.twitch.tv/helix/search/categories?query=${name}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(searchcategories, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Returns a list of channels (users who have streamed within the past 6 months)
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} name Broadcaster name
 * @returns {Array}
 */

exports.searchChannels = (token, client_id, name) => {
  let searchcategories = {
    method: "GET",
    url: `https://api.twitch.tv/helix/search/channels?query=${name}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(searchcategories, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets information about active streams.
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID (optional)
 * @returns {Array}
 */

exports.getStream = (token, client_id, broadcaster_id) => {
  let url;
  url = "https://api.twitch.tv/helix/streams";
  if (broadcaster_id != undefined)
    url = `https://api.twitch.tv/helix/streams?user_id=${broadcaster_id}`;
  let getstream = {
    method: "GET",
    url: url,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(getstream, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets the channel stream key for a user.
 * Required scope: channel:read:stream_key
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID
 * @returns {Array}
 */

exports.getStreamKey = (token, client_id, broadcaster_id) => {
  let searchcategories = {
    method: "GET",
    url: `https://api.twitch.tv/helix/streams/key?broadcaster_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(searchcategories, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Get a video informations
 * Required scope: user:read:broadcast
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} video_id Video ID
 * @returns {Array}
 */

exports.getVideoInformations = (token, client_id, video_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/videos?id=${video_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Get all videos of broadcaster ordered by recency
 * Required scope: user:read:broadcast
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID (optional)
 * @returns {Array}
 */

exports.getVideos = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/streams/markers?user_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets channel information for users.
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID (get with : getUserInfo)
 * @returns {Array}
 */

exports.getChannel = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets channel information for users.
 * Required scope: channel:read:subscriptions
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID (get with : getUserInfo)
 * @returns {Array}
 */

exports.getBroadcasterSubscriptions = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets the list of all stream tags defined by Twitch, optionally filtered by tag ID(s).
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @returns {Array}
 */

exports.getAllStreamTags = (token, client_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/tags/streams?first=100`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets the list of tags for a specified stream (channel).
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID (get with : getUserInfo)
 * @returns {Array}
 */

exports.getStreamTags = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/tags/streams?first=100&broadcaster_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets information about users who are being followed
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID (get with : getUserInfo)
 * @returns {Array}
 */

exports.getFollowsFrom = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/users/follows?first=100&from_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets information about users who are following
 *
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID (get with : getUserInfo)
 * @returns {Array}
 */

exports.getFollowsTo = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/users/follows?first=100&to_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};

/**
 * Gets information about active extensions installed by a specified user
 * Optional scope: user:read:broadcast or user:edit:broadcast
 * @param {string} token access_token
 * @param {string} client_id App client ID
 * @param {string} broadcaster_id Broadcaster ID (get with : getUserInfo)
 * @returns {Array}
 */

exports.getUserExtension = (token, client_id, broadcaster_id) => {
  let target_url = {
    method: "GET",
    url: `https://api.twitch.tv/helix/users/extensions?user_id=${broadcaster_id}`,
    headers: {
      "client-id": `${client_id}`,
      Authorization: `Bearer ${token}`,
      Cookie:
        "unique_id=aa555924100f05f0; unique_id_durable=aa555924100f05f0; twitch.lohp.countryCode=FR",
    },
  };
  return new Promise((resolve, reject) => {
    request(target_url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      const result = JSON.parse(body);
      resolve(result);
    });
  });
};
