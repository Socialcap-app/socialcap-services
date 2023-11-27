import { randomInt } from 'crypto';
import { CoreApiClient } from '../src/core/api-client.js';

describe('Public API test', () => {

  it('should get the status of API+Db server successfully', async () => {
    const mockResponse = {
      health: 'running',
      version: '0.1',
      db: {
        engine: 'None',
        connected: true,
        metrics: "NO_METRICS"
      }      
    }

    // Public API port is 3080
    const apiClient = new CoreApiClient();
    await apiClient.connect("localhost", 3080);

    const [result, error] = await apiClient.status();
    expect(result.health).toEqual(mockResponse.health);
    expect(result.db.connected).toEqual(mockResponse.db.connected);
    expect(result.db.metrics).toEqual(mockResponse.db.metrics);
  });


  it('should get the status of API+Db server with Metrics', async () => {
    const mockResponse = {
      health: 'running',
      version: '0.1',
      db: {
        engine: 'None',
        connected: true,
        metrics: {}
      }      
    }

    // Public API port is 3080
    const apiClient = new CoreApiClient();
    await apiClient.connect("localhost", 3080);

    const [result, error] = await apiClient.status({metrics: true});
    expect(result.health).toEqual(mockResponse.health);
    expect(result.db.connected).toEqual(mockResponse.db.connected);
    expect(result.db.metrics).not.toEqual("NO_METRICS");
  });


  it('should insert a Signup successfully', async () => {
    // Public API port is 3080
    const apiClient = new CoreApiClient();
    await apiClient.connect("localhost", 3080);

    const rand = randomInt(5000);
    const [result, error] = await apiClient.mutate("sign_up", {
      full_name: "Teresita Graciosa Nro"+rand,
      email: "tgraciosa"+rand+"@dummymail.com",
      phone: "54-11-1234-"+rand,
      telegram: "@TG"+rand
    });
    expect(result).not.toEqual(null);
    expect(result.state).toEqual('PENDING');
  });
});


describe('Merkle Storage API', () => {

  it('should query merkle_map data successfully', async () => {
    const mockResponse = {
      "id": 2,
      "name": "Maruco_2",
      "root": "20317599963995714678870893528527629958288036455177062299831345807553926030028",
      "count": 3
    }

    const apiClient = new CoreApiClient();
    await apiClient.connect("localhost", 3081);

    const [result, error] = await apiClient.query("get_merkle_map", {id: 2});
    expect(result).toEqual(mockResponse);
  });

  it('should create merkle_map successfully', async () => {
    const randomName = "Maruco"+randomInt(5000);
    const mockResponse = {
      "name": randomName,
      "count": 0
    }

    const apiClient = new CoreApiClient();
    await apiClient.connect("localhost", 3081);

    const [result, error] = await apiClient.mutate("create_merkle_map", { 
      "name": randomName
    });
    expect(result.name).toEqual(mockResponse.name);
    expect(result.count).toEqual(mockResponse.count);
  });


  it('should query merkle_leaf data successfully', async () => {
    const mockResponse = {
      "key": "340112523895721626410879996467678105233",
      "hash": "4578195092967266717504634214083983441340587705529266918892238724554861292777",
      "data": {
        "uid": "ffdf4a17-a35b-4703-be8e-8b16bdf54e91",
        "full_name": "ALgo Maruco Juan Zamudio",
        "alias": "perejilitos"
      }
    }

    const apiClient = new CoreApiClient();
    await apiClient.connect("localhost", 3081);

    const [result, error] = await apiClient.query("get_merkle_map_leaf", ​{
      "mapId":2,
      "uid":"ffdf4a17-a35b-4703-be8e-8b16bdf54e91"
    });
    expect(result).toEqual(mockResponse);
  });
});
