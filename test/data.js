var APP_DATA = {
  "scenes": [
    {
      "id": "0-",
      "name": "Вход",
      "mapCoords": { "left": "25%", "top": "40%" }, // ДОБАВИЛИ КООРДИНАТЫ 
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1500,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 1.067754635741652,
          "pitch": 0.6728753325899515,
          "rotation": 0,
          "target": "1--1"
        },
        {
          "yaw": 2.1338044429830854,
          "pitch": 0.6228571599120762,
          "rotation": 0,
          "target": "2--2"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1--1",
      "name": "Коридор 1",
      "mapCoords": { "left": "50%", "top": "40%" }, // ДОБАВИЛИ КООРДИНАТЫ 
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1500,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -1.860255458297722,
          "pitch": 0.680432379810668,
          "rotation": 0,
          "target": "0-"
        },
        {
          "yaw": -3.0630622642475913,
          "pitch": 0.7106932519073101,
          "rotation": 0,
          "target": "2--2"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "2--2",
      "name": "Коридор 2",
      "mapCoords": { "left": "25%", "top": "80%" }, // ДОБАВИЛИ КООРДИНАТЫ 
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1500,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 0.02160126986432509,
          "pitch": 0.624401350960083,
          "rotation": 0,
          "target": "1--1"
        },
        {
          "yaw": -0.7509893621438319,
          "pitch": 0.6239552230105225,
          "rotation": 0,
          "target": "0-"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "Project Title",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": false,
    "fullscreenButton": false,
    "viewControlButtons": false
  }
};
