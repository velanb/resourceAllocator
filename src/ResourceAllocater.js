const Server = require('./Server');
const CostUtil = require('./utils/Utils');
const {
  ResourseAllocatorError
} = require('./utils/ErrorHandlers')
const User = require('./Users')
const {
  server_CPUs,
  region_server_dict,
  region_cost_dict
} = require('./config');

class ResourceAllocator {
  constructor(serverObj) {
    this.serverList = serverObj;
    this.serversAllocated = null;
  }

  get_cost(hours, cpu, price) {
    if (typeof hours == 'undefined' || hours == null || hours == 'null') {
      throw new ResourseAllocatorError(`The hours cannot be null/undefined`);
    }

    return Promise.resolve().then(() => {
      if (typeof hours == 'number') {
        if (Math.round(hours) < 0) {
          throw new ResourseAllocatorError(`The hours must be greater than zero`);
        }
        return Math.round(hours);
      } else {
        throw new ResourseAllocatorError(`The hours must of type Integer`);
      }
    }).then((hours) => {
      if (typeof cpu == 'number') {
        let cpuCount = Math.round(cpu);
        if (cpuCount < 0) {
          throw new ResourseAllocatorError(`The CPU count should always be greater than zero`);
        }
        return {
          minCPU: cpuCount,
          hours: hours
        }
      } else {
        throw new ResourseAllocatorError(`Enter the valid number of cpu's`);
      }
    }).then(cpuData => {
      if (price <= 0) {
        throw new ResourseAllocatorError(`The price cannot be set to zero`);
      }
      return {
        minCpu: cpuData.minCPU,
        hours: cpuData.hours,
        maxPrice: price,
        serverRegionDict: this.serverList.server_dict,
        serverCostData: this.serverList.region_server_dict,
      }
    }).then(data => {
      let regionAlloc = CostUtil.regionAllocator(data.serverRegionDict, data.minCpu);
      this.serversAllocated = regionAlloc;
      return {
        regionAlloc: regionAlloc,
        hours: data.hours,
        maxPrice: data.maxPrice,
        serverCostData: data.serverCostData
      }
    }).then(data => {
      let costAlloc = CostUtil.costCalculator(data.regionAlloc, data.serverCostData, data.maxPrice);
      return {
        costAlloc: costAlloc,
        regionAlloc: data.regionAlloc
      }
    }).then(data => {
      let costData = CostUtil.costSum(data.regionAlloc, data.costAlloc);
      return costData;
    }).catch(err => {
      throw new ResourseAllocatorError(err.message)
    })
  }
}

module.exports = ResourceAllocator;


let server = new Server(server_CPUs, region_server_dict, region_cost_dict);

let allocator = new ResourceAllocator(server);
// let user = new User('velan', 'test', {})

(async () => {
  let data = await allocator.get_cost(100, 100, 10);
  console.log(JSON.stringify(data))
})();

// [{
//   "region": "us-east",
//   "total_cost": 9.05,
//   "servers": [{
//     "xlarge": 0.46
//   }, {
//     "4xlarge": 1.55
//   }, {
//     "8xlarge": 1.4
//   }, {
//     "10xlarge": 5.64
//   }]
// }, {
//   "region": "us-west",
//   "total_cost": 9.58,
//   "servers": [{
//     "large": 0.56
//   }, {
//     "4xlarge": 1.78
//   }, {
//     "8xlarge": 1.3
//   }, {
//     "10xlarge": 5.94
//   }]
// }, {
//   "region": "asia",
//   "total_cost": 7.79,
//   "servers": [{
//     "large": 0.22
//   }, {
//     "xlarge": 1
//   }, {
//     "4xlarge": 0.67
//   }, {
//     "8xlarge": 5.9
//   }]
// }]