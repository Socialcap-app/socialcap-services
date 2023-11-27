
# Graphql queries 

### How to query if Txn has ended or not ...

**Request**:

POST `https://berkeley.graphql.minaexplorer.com`

Body 
~~~
{
  "query": `{zkapp(query: 
    {hash: \"${txnHash}\"}) 
    {
      blockHeight
      failureReason {
          failures
          index
      }    
    }
  }`,
  "variables": null
}
~~~

**Responses**:

Transaction accepted:
~~~
{
  "data": {
    "data": {
      "zkapp": {
        "blockHeight": 6896,
        "failureReason": null
      }
    }
  },
  "error": null
}
~~~

Transaction failed:
~~~
{
  "data": {
    "data": {
      "zkapp": {
        "blockHeight": 6825,
        "failureReason": [
          {
            "failures": [
              "Cancelled"
            ],
            "index": "2"
          },
          {
            "failures": [
              "Account_app_state_0_precondition_unsatisfied"
            ],
            "index": "1"
          }
        ]
      }
    }
  },
  "error": null
}
~~~

Graphql error:
~~~
{
  "data": {
    "error": "must have query",
    "link": "https://realm.mongodb.com/groups/5d743847f2a30b915a869d02/apps/6243ac4e874bdc290e411249/logs?co_id=64c690ea0e5ff13e1f149951"
  },
  "error": null
}
~~~

Axios error:
~~~
{
  "data": null,
  "error": {
    "message": "getaddrinfo ENOTFOUND berkeley.graphql.minaexplorer--.com",
    "name": "Error",
    "stack": "Error: getaddrinfo ENOTFOUND berkeley.graphql.minaexplorer--.com\n ...",
    "code": "ENOTFOUND",
    "status": null
  }
}
~~~
