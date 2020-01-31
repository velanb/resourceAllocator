class Server {
  constructor(server_CPUs, server_dict, region_server_dict) {
    this.server_CPUs = server_CPUs;
    this.server_dict = server_dict;
    this.region_server_dict = region_server_dict
  }

  _getServerCPUs() {
    return this.server_CPUs;
  }

  _getServerDict() {
    return this.server_dict;
  }

  _getRegionDict() {
    return this.region_server_dict;
  }
}

module.exports = Server;