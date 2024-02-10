const crypto = require('crypto');
const { logger } = require('../../utils/logger');
const moment = require('moment');

exports.generateSignature = (timestamp, clientId, partnerSecret, body) => {
  try {
    const nowDate = getCurrentUtcDatetime(timestamp);
    const ordered = [];
    if (body) {
      Object.keys(body).sort().forEach((v) => {
        // Check if value is of type Object / Array
        if (body[v] instanceof Array) {
          body[v].sort().forEach((item) => {
            for (const key in item) { // eslint-disable-line
              if (item.hasOwnProperty(key)) { // eslint-disable-line
                ordered.push(item[key]);
              }
            }
          });
        } else if (body[v] instanceof Object) {
          ordered.push(getKeyValueObject(body[v]));
        } else {
          ordered.push(body[v]);
        }
      });
    };
    // await generateSignatureService.generateSignature(body);
    const sig = nowDate.timestamp + ordered.join('') + clientId + partnerSecret;
    const signature = crypto.createHash('sha256').update(sig).digest('base64');
    return { signature: signature, timestamp: nowDate.isoString };
  } catch (error) {
    logger.error(' error in while genertaing Signature', error);
  }
}

const getBaseString = (data = {}) => {
  return Object.keys(data)
    .sort()
    .map((item) => {
      if (data[item] && typeof data[item] === 'object') {
        return getBaseString(data[item]);
      }
      return data[item];
    })
    .join('');
};

exports.generateSignatureForWFM = (timestamp, clientId, partnerSecret, body) => {
  try {
    const nowDate = getCurrentUtcDatetime(timestamp);
    // await generateSignatureService.generateSignature(body);
    const sig = `${nowDate.isoString}${getBaseString(body)}${clientId}`
    const signature = crypto.createHmac('sha256', sig).digest('hex');
    return { signature: signature, timestamp: nowDate.isoString };
  } catch (error) {
    logger.error(' error in while genertaing Signature', error);
  }
};

exports.generateSignatureForSubscription = (timestamp, clientId, partnerSecret, requestBody) => {
  try {
    const nowDate = new Date(timestamp).getTime();
    const ordered = [];
    const body = JSON.parse(JSON.stringify(requestBody));
    body.timestamp = nowDate;
    if (body) {
      Object.keys(body).sort().forEach((v) => {
        // Check if value is of type Object / Array
        if (body[v] instanceof Array) {
          body[v].sort().forEach((item) => {
            for (const key in item) { // eslint-disable-line
              if (item.hasOwnProperty(key)) {
                ordered.push(key);
                ordered.push(item[key]);
              }
            }
          });
        } else if (body[v] instanceof Object) {
          ordered.push(v);
          ordered.push(getKeyValueObject(body[v]));
        } else {
          ordered.push(v);
          ordered.push(body[v]);
        }
      });
    };
    // await generateSignatureService.generateSignature(body);
    const sig = ordered.join('');
    const signature = crypto.createHmac('sha256', process.env.DISNEYPLUS_ACTIVATION_X_API_KEY).update(sig).digest('base64');
    return { signature: signature, timestamp: nowDate };
  } catch (error) {
    logger.error(' error in while genertaing Signature', error);
  }
}

exports.generateSignatureForChangeMobile = (timestamp, clientId, partnerSecret, requestBody) => {
  try {
    const nowDate = new Date(timestamp).getTime();
    const ordered = [];
    const body = JSON.parse(JSON.stringify(requestBody));
    body.timestamp = nowDate;
    if (body) {
      Object.keys(body).sort().forEach((v) => {
        // Check if value is of type Object / Array
        if (body[v] instanceof Array) {
          body[v].sort().forEach((item) => {
            for (const key in item) { // eslint-disable-line
              if (item.hasOwnProperty(key)) {
                ordered.push(key);
                ordered.push(item[key]);
              }
            }
          });
        } else if (body[v] instanceof Object) {
          ordered.push(v);
          ordered.push(getKeyValueObject(body[v]));
        } else {
          ordered.push(v);
          ordered.push(body[v]);
        }
      });
    };
    // await generateSignatureService.generateSignature(body);
    const sig = ordered.join('');
    const signature = crypto.createHmac('sha256', process.env.DISNEYPLUS_ACTIVATION_X_API_KEY).update(sig).digest('base64');
    return { signature: signature, timestamp: nowDate };
  } catch (error) {
    logger.error(' error in while genertaing Signature', error);
  }
}

exports.generateSignatureForSMS = (requestBody) => {
  try {
    const nowDate = new Date().toISOString();
    const ordered = [];
    const body = JSON.parse(JSON.stringify(requestBody));
    if (body) {
      Object.keys(body).sort().forEach((v) => {
        // Check if value is of type Object / Array
        if (body[v] instanceof Array) {
          body[v].sort().forEach((item) => {
            for (const key in item) { // eslint-disable-line
              if (item.hasOwnProperty(key)) {
                //ordered.push(key);
                ordered.push(item[key]);
              }
            }
          });
        } else if (body[v] instanceof Object) {
          let text = [];
          Object.keys(body[v]).forEach((key) => {
            text.push(key);
            text.push(body[v][key]);
          });
          ordered.push( text.join(''));
        } else {
          ordered.push(body[v]);
        }
      });
      
    };
    // await generateSignatureService.generateSignature(body);
    const sig = ordered.join('');
    const timestampsig = moment().utc().format('YYYYMMDDHHmmss');
    const partnerId = process.env.UNS_CLIENT_ID
    const partnerSecret = process.env.UNS_CLIENT_SECRET

    const paramString = `${timestampsig}${sig}${partnerId}${partnerSecret}`;
    const signature = crypto.createHash('sha256').update(paramString).digest('base64');
    logger.info('D+H SMS Concatinated String: ', { message: paramString });
    logger.info('D+H SMS Signature: ', { signature: signature, timestamp: nowDate });
    return { signature: signature, timestamp: nowDate };
  } catch (error) {
    logger.error(' error in while genertaing SMS Signature', error);
  }
}

exports.generateSignatureForRecoRecommendations = (timestamp, partnerSecret, clientId, body) => {
  try {
    const nowDate = getCurrentUtcDatetime(timestamp);
    const ordered = [];
    if (body) {
      Object.keys(body).sort().forEach((v) => {
        // Check if value is of type Object / Array
        if (body[v] instanceof Array) {
          body[v].sort().forEach((item) => {
            for (const key in item) { // eslint-disable-line
              if (item.hasOwnProperty(key)) { // eslint-disable-line
                ordered.push(item[key]);
              }
            }
          });
        } else if (body[v] instanceof Object) {
          ordered.push(getKeyValueObject(body[v]));
        } else {
          ordered.push(body[v]);
        }
      });
    };
    const sig = nowDate.timestamp + ordered.join('') + clientId + partnerSecret;
    const signature = crypto.createHash('sha256').update(sig).digest('base64');
    return { signature: signature, timestamp: nowDate.isoString };
  } catch (error) {
    logger.error(' error in while genertaing Signature', error);
    throw error;
  }
}
const getKeyValueObject = (obj) => {
  const text = [];

  Object.keys(obj).forEach((key) => {
    text.push(key);
    text.push(obj[key]);
  });

  return text.join('');
}

const getCurrentUtcDatetime = (_date, minutes) => {
  function pad(number, length) {
    let str = `${number}`;
    while (str.length < length) {
      str = `0${str}`;
    }

    return str;
  }
  Date.prototype.YYYYMMDDHHMMSS = function YYYYMMDDHHMMSS() { // eslint-disable-line no-extend-native
    const yyyy = this.getFullYear().toString();
    const MM = pad(this.getMonth() + 1, 2);
    const dd = pad(this.getDate(), 2);
    const hh = pad(this.getHours(), 2);
    const mm = pad(this.getMinutes(), 2);
    const ss = pad(this.getSeconds(), 2);

    return {
      timestamp: yyyy + MM + dd + hh + mm + ss,
      isoString: `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}Z`,
      date: dd + MM + yyyy
    };
  };

  function getTimeStampDate(date) {
    return date.YYYYMMDDHHMMSS();
  }

  let now;
  if (minutes) {
    now = new Date(_date);
    now.setTime(now.getTime() + (minutes * 60 * 1000));
  } else {
    now = new Date(_date);
  }

  return getTimeStampDate(now);
};

exports.generateSignatureForOrderAPI = (apId, account_id, purchase_id, orderType, salesChannel, smcNo, eventTitle) => {
  /* timestamp + account_id + ap_id +
  event_title + order_purchase_date +
  order_type + purchase_id +
  sales_channel + partner id + partnersecret
*/
  const timestampsig = moment().utc().format('YYYYMMDDHHmmss');
  const orderPurchaseDate = moment().toISOString();
  const partnerId = process.env.ORDER_API_CLIENT_ID
  const partnerSecret = process.env.ORDER_API_CLIENT_SECRET

  const paramString = `${timestampsig}${account_id}${apId}${eventTitle}${orderPurchaseDate}${orderType}${purchase_id}${salesChannel}${smcNo}${partnerId}${partnerSecret}`;
  const signature = crypto.createHash('sha256').update(paramString).digest('base64');
  return { signature, timestamp: orderPurchaseDate }
}
