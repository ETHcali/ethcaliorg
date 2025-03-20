{
    "version": 2,
    "builds": [
      {
        "src": "ethcali.html",
        "use": "@vercel/static"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "/ethcali.html"
      }
    ]
  }
