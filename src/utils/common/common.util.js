const crypto = require('crypto');
const { errorInfo } = require('../../config/vars');
module.exports.isStringBlank = (str) => {
  return !str || /^\s*$/.test(str);
};

module.exports.encrypt = (password) => {
  const algorithm = process.env.PASSWORD_ALGORITHM;
  const secretKey = process.env.PASSWORD_SECRET_KEY;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

module.exports.decryptPassword = (password) => {
  const textParts = password.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(
    process.env.PASSWORD_ALGORITHM,
    Buffer.from(process.env.PASSWORD_SECRET_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports.encryptJSON = (jsonObject) => {
  const stringfyJSON = JSON.stringify(jsonObject);
  const secret = process.env.JSON_ENCRYPTION_SECRET_KEY;
  const rounds = parseInt(process.env.JSON_ENCRYPTION_ROUNDS);
  const keySize = parseInt(process.env.JSON_ENCRYPTION_KEY_SIZE);
  const algorithm = process.env.JSON_ENCRYPTION_ALGORITHM;
  const salt = crypto.createHash('sha1').update(secret).digest('hex');
  const iv = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(secret, salt, rounds, keySize, 'sha512');
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  const encryptedData = Buffer.concat([
    cipher.update(JSON.stringify(stringfyJSON)),
    cipher.final()
  ]);
  return iv.toString('base64') + ':' + encryptedData.toString('base64');
};

const decryptResponse = (data) => {
  const secret = process.env.NODE_APP_JSON_DECRYPTION_SECRET_KEY;
  const rounds = parseInt(process.env.NODE_APP_JSON_DECRYPTION_ROUNDS);
  const keySize = parseInt(process.env.NODE_APP_JSON_DECRYPTION_KEY_SIZE);
  const algorithm = process.env.NODE_APP_JSON_DECRYPTION_ALGORITHM;
  const salt = crypto.createHash('sha1').update(secret).digest('hex');
  const textParts = data.split(':');
  const iv = Buffer.from(textParts.shift(), 'base64');
  const encryptedData = Buffer.from(textParts.join(':'), 'base64');
  const key = crypto.pbkdf2Sync(secret, salt, rounds, keySize, 'sha512');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decryptedData = decipher.update(encryptedData);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);
  return JSON.parse(JSON.parse(decryptedData.toString()));
};

module.exports.decryptSecrets = (secret) => {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'preproduction') {
    return decryptResponse(secret);
  }
  return secret;
};

module.exports.getCurrentUtcDatetime = (_date, minutes) => {
  function pad (number, length) {
    let str = `${number}`;
    while (str.length < length) {
      str = `0${str}`;
    }

    return str;
  }
  Date.prototype.YYYYMMDDHHMMSS = function YYYYMMDDHHMMSS () { // eslint-disable-line no-extend-native
    const yyyy = this.getFullYear().toString();
    const MM = pad(this.getMonth() + 1, 2);
    const dd = pad(this.getDate(), 2);
    const hh = pad(this.getHours(), 2);
    const mm = pad(this.getMinutes(), 2);
    const ss = pad(this.getSeconds(), 2);

    return {
      timestamp: yyyy + MM + dd + hh + mm + ss,
      isoString: `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}Z`
    };
  };

  function getTimeStampDate (date) {
    return date.YYYYMMDDHHMMSS();
  }

  let now;
  if (minutes) {
    const oldDateObj = new Date();
    now = new Date();
    now.setTime(oldDateObj.getTime() + minutes * 60 * 1000);
  } else {
    now = new Date(_date);
  }

  return getTimeStampDate(now);
};

module.exports.isEmpty = (data) => {
  if (typeof data === 'object') {
    if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') {
      return true;
    }
    if (!data) {
      return true;
    }
    return false;
  } else if (typeof data === 'string') {
    if (!data.trim()) {
      return true;
    }
    return false;
  } else if (typeof data === 'undefined') {
    return true;
  } else {
    return false;
  }
};

module.exports.errorMessage = (exception) => {
  if (process.env.NODE_ENV === 'development') {
    return exception;
  } else {
    const response = {
      body: {
        data: {
          message: errorInfo
        }
      }
    };
    return response;
  }
};

// will return masking values
module.exports.dataMasking = (fieldValue, fieldType) => {
  fieldValue = (typeof fieldValue) === 'number' ? fieldValue.toString() : fieldValue;
  let masked = '';
  const mask = (value) => {
    let masked = '';
    if (typeof value === 'object') {
      for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < value[i].length; j++) {
          masked += 'X';
        }
        masked += ' ';
      }
    } else {
      for (let i = 0; i < value.length; i++) {
        masked += 'X';
      }
    }
    return masked;
  };
  if (fieldType === 'email') { // If value is email
    const s = fieldValue;
    masked = s.split('@')[0] + '@' + mask(s.split('@')[1].split('.')[0]) + '.' + s.split('@')[1].split('.')[1];
  } else if (fieldType === 'mobile') { // If value is mobile number
    masked = fieldValue.slice(0, 6) + mask(fieldValue.slice(-4));
  } else if (fieldType === 'nric') { // If value is NRIC
    masked = mask(fieldValue.slice(0, 8)) + fieldValue.slice(-4);
  } else { // If value is Address having the value as 'TAMAN SERI MANJA'
    masked = mask(fieldValue.split(' '));
  }
  return masked;
};
