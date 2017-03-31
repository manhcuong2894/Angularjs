var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
const saltRounds = 10;

module.exports = {
  secret: sails.config.jwtSettings.secret,
  issuer: sails.config.jwtSettings.issuer,
  audience: sails.config.jwtSettings.audience,

  /**
   * Hash the password field of the passed user.
   */
  hashPassword: function (user) {
    console.log(user.password);
    var salt = bcrypt.genSaltSync(saltRounds);

    if (user.password) {
      user.password = bcrypt.hashSync(user.password, salt);
      console.log(user.password + 's');
    }
  },

  /**
   * Compare user password hash with unhashed password
   * @returns boolean indicating a match
   */
  comparePassword: function (password, user) {
    console.log('pwd after hash: ' + user.password);
    return bcrypt.compareSync(password, user.password);
  },

  /**
   * Create a token based on the passed user
   * @param user
   */
  createToken: function (user) {
    return jwt.sign({
        user: user.toJSON()
      },
      sails.config.jwtSettings.secret,
      {
        algorithm: sails.config.jwtSettings.algorithm,
        expiresIn: sails.config.jwtSettings.expiresIn,
        issuer: sails.config.jwtSettings.issuer,
        audience: sails.config.jwtSettings.audience
      }
    );
  }
};
