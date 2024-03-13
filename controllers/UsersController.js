import dbClient from '../utils/db';

import redisClient from '../utils/redis';

const crypto = require('crypto');
const { ObjectId } = require('mongodb');

class UsersController {
  static async postNew(request, response) {
    const dict = request.body;
    const { email } = dict;
    const { password } = dict;
    if (email === undefined) {
      return response.status(400).send({ error: 'Missing email' });
    }
    if (password === undefined) {
      return response.status(400).send({ error: 'Missing password' });
    }
    const useremail = await dbClient.getUser({ email });
    if (useremail) {
      return response.status(400).send({ error: 'Already exist' });
    }
    const sha1Hash = crypto.createHash('sha1');
    sha1Hash.update(password);
    const hashedPass = sha1Hash.digest('hex');

    const id = await dbClient.setUser({ email, password: hashedPass });
    return response.status(201).send({ email, id });
  }

  static async getMe(request, response) {
    const token = request.headers['x-token'];
    const userid = await redisClient.get(`auth_${token}`);
    if (!userid) {
      return response.status(401).send({ error: 'Unauthorized' });
    }
    const useridobj = new ObjectId(userid);
    const user = await dbClient.getUser({ _id: useridobj });
    return response.send({ email: user.email, password: user.password });
  }
}

module.exports = UsersController;
