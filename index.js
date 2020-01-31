const User = require('./src/Users');
const Server = require('./src/Server');
const ResourceAllocator = require('./src/ResourceAllocater');
const {
  region_cost_dict,
  region_server_dict,
  server_CPUs
} = require('./config/config')

// Example 
(async () => {
  let server = new Server(server_CPUs, region_server_dict, region_cost_dict);
  let allocator = new ResourceAllocator(server);
  let maxPrice = 100;
  let numberOfCPUs = 200;
  let hours = 24;
  let data = await allocator.get_cost(hours, numberOfCPUs, maxPrice);
  console.log(JSON.stringify(data))
})();

module.exports = {
  User,
  Server,
  ResourceAllocator
}