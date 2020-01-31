class User {
  constructor(username, userEmail, serverConfig = {}) {
    this.username = username;
    this.userEmail = userEmail;
    this.config = serverConfig;
    this.servers = [];
  }

  _getUsername() {
    return this.username;
  }

  _getUserEmail() {
    return this.userEmail
  }

  _getUserConfig() {
    return this.config
  }

  _getUserServers() {
    return this.servers
  }
}

module.exports = User;