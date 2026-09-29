var APP_DATA = {
  "scenes": [
    {
      "id": "0-bath_panoramic",
      "name": "Bath_Panoramic",
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
        }
      ],
      "faceSize": 960,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -3.138777306313326,
          "pitch": 0.4128793409539693,
          "rotation": 0,
          "target": "4-hallway2_panoramic"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 0.004163034111783759,
          "pitch": 0.8520352973512679,
          "title": "Инсталяиця",
          "text": "<span style=\"color: rgb(86, 86, 85); font-family: Lato, sans-serif; font-size: 16px; background-color: rgb(255, 255, 255);\">Aqua — обновленная инсталляция-бестселлер Cersanit, которая призвана создать тишину в доме и подарить спокойствие на долгие годы. Её легендарная надёжность дополнена продуманным функционалом, который помогает сделать каждый день комфортнее.</span>"
        }
      ]
    },
    {
      "id": "1-bathroom_panoramic",
      "name": "BathRoom_Panoramic",
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
        }
      ],
      "faceSize": 960,
      "initialViewParameters": {
        "yaw": -0.5401280676706595,
        "pitch": 0.822560053219151,
        "fov": 1.4084158071147468
      },
      "linkHotspots": [
        {
          "yaw": 2.529795020031001,
          "pitch": 0.3199788732227802,
          "rotation": 0,
          "target": "4-hallway2_panoramic"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -1.0166960657171558,
          "pitch": 0.7371617417956919,
          "title": "Ванна Акриловая 170х70",
          "text": "Эргономичная форма"
        }
      ]
    },
    {
      "id": "2-bedroom_panoramic",
      "name": "BedRoom_Panoramic",
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
        }
      ],
      "faceSize": 960,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -1.9142045985316276,
          "pitch": 0.18627055810275728,
          "rotation": 0,
          "target": "3-hallway1_panoramic"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "3-hallway1_panoramic",
      "name": "HallWay1_Panoramic",
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
        }
      ],
      "faceSize": 960,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -1.0359733834108802,
          "pitch": 0.2722545112153867,
          "rotation": 0,
          "target": "4-hallway2_panoramic"
        },
        {
          "yaw": -1.9685692269990263,
          "pitch": 0.34188710119462584,
          "rotation": 0,
          "target": "2-bedroom_panoramic"
        },
        {
          "yaw": -1.3324536218345475,
          "pitch": 0.15470161148181916,
          "rotation": 0,
          "target": "6-livingroom_panoramic"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "4-hallway2_panoramic",
      "name": "HallWay2_Panoramic",
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
        }
      ],
      "faceSize": 960,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 1.539169891098398,
          "pitch": 0.22855670741954626,
          "rotation": 0,
          "target": "0-bath_panoramic"
        },
        {
          "yaw": 0.85379510719976,
          "pitch": 0.2505115173053216,
          "rotation": 0,
          "target": "1-bathroom_panoramic"
        },
        {
          "yaw": -1.930083017987247,
          "pitch": 0.26168905987147717,
          "rotation": 0,
          "target": "3-hallway1_panoramic"
        },
        {
          "yaw": -0.046070496473102907,
          "pitch": 0.4548354632205598,
          "rotation": 0,
          "target": "5-kitchen_panoramic"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "5-kitchen_panoramic",
      "name": "Kitchen_Panoramic",
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
        }
      ],
      "faceSize": 960,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -0.6584819590202482,
          "pitch": 0.3056874466930388,
          "rotation": 0,
          "target": "4-hallway2_panoramic"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "6-livingroom_panoramic",
      "name": "LivingRoom_Panoramic",
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
        }
      ],
      "faceSize": 960,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -2.732332209830428,
          "pitch": 0.21793928908179971,
          "rotation": 0,
          "target": "4-hallway2_panoramic"
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "Project Title",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": true,
    "fullscreenButton": false,
    "viewControlButtons": false
  }
};
