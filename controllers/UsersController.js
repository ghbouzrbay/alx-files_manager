import dbClient from '../utils/db';

const crypto = require('crypto');

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
}

module.exports = UsersController;
