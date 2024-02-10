const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../../services/db');

const UserSession = async (username, idToken, refreshToken) => {
  const dbconnection = GetSyncDBConnection();
  try {
    const user = await dbconnection('users').where('username', username);
    if (user.length > 0) {
      const userId = user[0].id;
      const userSession = await dbconnection('user_sessions').where({ userId, activeSession: 1 });
      if (userSession.length > 0) {
        const userSessionIds = userSession.map(data => { return data.id; });
        const currentDate = new Date();
        const formattedCurrentDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        const newUserSession = {
          userId,
          idToken,
          refreshToken,
          lastLoginTime: formattedCurrentDate,
          activeSession: 1
        };
        await dbconnection('user_sessions').update({ activeSession: 0 }).whereIn('id', userSessionIds);
        return await dbconnection('user_sessions').insert(newUserSession);
      } else {
        const currentDate = new Date();
        const formattedCurrentDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        const sessionData = {
          userId,
          idToken,
          refreshToken,
          lastLoginTime: formattedCurrentDate,
          activeSession: 1
        };
        return await dbconnection('user_sessions').insert(sessionData);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    GetSyncDBDisconnection(dbconnection);
  }
};

module.exports = { UserSession };
