const CostUtil = require('./utils/Utils');
const {
  ResourseAllocatorError
} = require('./utils/ErrorHandlers')


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