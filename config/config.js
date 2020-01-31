exports.server_CPUs = {
  'large': 1,
  'xlarge': 2,
  '2xlarge': 4,
  '4xlarge': 8,
  '8xlarge': 16,
  '10xlarge': 32,
}

exports.region_server_dict = {
  "us-east": {
    'large': 1,
    'xlarge': 2,
    '2xlarge': 4,
    '4xlarge': 8,
    '8xlarge': 16,
    '10xlarge': 32,
  },
  "us-west": {
    'large': 1,
    '2xlarge': 4,
    '4xlarge': 8,
    '8xlarge': 16,
    '10xlarge': 32,
  },
  "asia": {
    'large': 1,
    'xlarge': 2,
    '4xlarge': 8,
    '8xlarge': 16,
  }
}

exports.region_cost_dict = {
  "us-east": {
    "large": 0.12,
    "xlarge": 0.23,
    "2xlarge": 0.45,
    "4xlarge": 0.774,
    "8xlarge": 1.4,
    "10xlarge": 2.82
  },
  "us-west": {
    "large": 0.14,
    "2xlarge": 0.413,
    "4xlarge": 0.89,
    "8xlarge": 1.3,
    "10xlarge": 2.97
  },
  "asia": {
    "large": 0.11,
    "xlarge": 0.20,
    "4xlarge": 0.67,
    "8xlarge": 1.18,
  }
}