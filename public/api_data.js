define({ "api": [
  {
    "group": "Query",
    "type": "get",
    "url": "/api/query?:term&:offset",
    "title": "",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://image-src.heroku.com/api/query?term=cats&offset=1",
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
      "examples": [
        {
          "title": "Success-response",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        url: \"http:/i.imgur/cahdKic.jpg\",\n        snippet: \"As of today no one knows what happened to the Island of Itbayat and its 3000 inhabitants\"\n    },\n    {\n        url: \"http://i.imgur.com/WDkMVwR.png\",\n        snippet: \"No one knows except you.\"\n    } \n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Query",
    "name": "GetApiQueryTermOffset"
  }
] });
