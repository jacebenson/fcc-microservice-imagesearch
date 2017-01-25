define({ "api": [
  {
    "type": "get",
    "url": "/api/history",
    "title": "",
    "version": "1.0.0",
    "group": "History",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl http://image-svc.herokuapp.com/api/query?term=cats&offset=1",
        "type": "curl"
      },
      {
        "title": "Example usage:",
        "content": "curl http://image-svc.herokuapp.com/api/history",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "term",
            "description": "<p>Search term</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "offset",
            "description": "<p>What page of results to return, default is 0</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "imageData",
            "description": "<p>Image information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "imageData.url",
            "description": "<p>Image URL</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "imageData.snippet",
            "description": "<p>Alternate Text</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "searchQuery",
            "description": "<p>Search information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "searchQuery._id",
            "description": "<p>mongoDB id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "searchQuery.query",
            "description": "<p>Term searched</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "searchQuery.created",
            "description": "<p>Date the search was logged</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-response",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        url: \"http:/i.imgur/cahdKic.jpg\",\n        snippet: \"As of today no one knows what happened to the Island of Itbayat and its 3000 inhabitants\"\n    },\n    {\n        url: \"http://i.imgur.com/WDkMVwR.png\",\n        snippet: \"No one knows except you.\"\n    } \n]",
          "type": "json"
        },
        {
          "title": "Success-response",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"_id\": \"58883552375c8131482b5d49\",\n        \"query\": \"no%20one%20knows\",\n        \"created\": \"Tue Jan 24 2017\"\n    },\n    {\n        \"_id\": \"5888394ec2cec800043d1ccc\",\n        \"query\": \"cats\",\n        \"created\": \"Wed Jan 25 2017\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api.js",
    "groupTitle": "History",
    "name": "GetApiHistory"
  }
] });
