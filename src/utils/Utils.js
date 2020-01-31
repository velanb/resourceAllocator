const {
  CostUtilsError
} = require('./ErrorHandlers')

class Utils {
  static objectVerifier(object) {
    for (let obj in object) {
      if (object[obj] == 0) {
        delete object[obj]
      }
    }
  }
}

class CostUtils {
  static costEffectiveServerAllocation(maxCPUlimit, serverOBJ) {
    let CPUsAllocated = 0;
    let objKeys = Object.keys(serverOBJ).reverse();
    let i = 0;
    let returnObject = {
      'large': 0,
      'xlarge': 0,
      '2xlarge': 0,
      '4xlarge': 0,
      '8xlarge': 0,
      '10xlarge': 0,
    };

    while (maxCPUlimit > CPUsAllocated) {
      let key = objKeys[i];
      let objValue = serverOBJ[key];

      if ((objValue + CPUsAllocated < maxCPUlimit)) {
        returnObject[key] = returnObject[key] + 1;
        CPUsAllocated = CPUsAllocated + objValue;
        i++;
      }
      if ((objValue + CPUsAllocated == maxCPUlimit)) {
        returnObject[key] = returnObject[key] + 1;
        CPUsAllocated = CPUsAllocated + objValue;
        i++;
      } else {
        if (i >= objKeys.length - 1) {
          i = 0;
          continue;
        } else {
          i++;
        }
      }
    }
    Utils.objectVerifier(returnObject)
    return returnObject;
  }

  static regionAllocator(regionObj, max) {
    let returnObject = {};
    for (let region in regionObj) {
      returnObject[region] = CostUtils.costEffectiveServerAllocation(max, regionObj[region]);
    }
    return returnObject;
  }

  static costCalculator(allocatedServers, costConfig, maxCost) {
    let tempMaxCost = maxCost;
    for (let region in costConfig) {
      let second = costConfig[region];
      let keys = Object.keys(second);
      for (let i = 0; i < keys.length; i++) {
        let tempData = allocatedServers[region][keys[i]]
        if (typeof tempData != 'undefined') {
          allocatedServers[region][keys[i]] = parseFloat((allocatedServers[region][keys[i]] * costConfig[region][keys[i]]).toFixed(2));
          if (tempMaxCost - allocatedServers[region][keys[i]] <= 0) {
            throw new CostUtilsError(`The cost limit has been exceeded`)
          } else {
            tempMaxCost = tempMaxCost - allocatedServers[region][keys[i]];
          }
        }
      }
      tempMaxCost = maxCost;
    }
    return allocatedServers
  }

  static costSum(costObj, serverObj) {
    let returnArray = [];
    for (let region in costObj) {
      let totalObj = {
        region: region,
        total_cost: 0,
        servers: []
      }
      for (let serverList in costObj[region]) {
        let totalCost = (totalObj['total_cost'] + costObj[region][serverList]);
        totalCost = parseFloat((Math.round(totalCost * 100) / 100).toFixed(2))
        totalObj['total_cost'] = totalCost;
      }
      for (let server in serverObj[region]) {
        let obj = {}
        obj[server] = serverObj[region][server];
        totalObj.servers.push(Object.freeze(obj));
      }
      returnArray.push(totalObj)
    }
    return returnArray;
  }
}

module.exports = CostUtils;