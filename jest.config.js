module.exports = {
  "setupFiles": [
    "./test/setup.js"
  ],
  "testURL": "http://localhost:8000",
  "moduleFileExtensions": [
    "js",
    "jsx"
  ],
  "moduleDirectories": [
    "node_modules"
  ],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "identity-obj-proxy",
    "^react$": "preact-compat",
    "^react-dom$": "preact-compat"
  },
  "collectCoverageFrom": [
    "src/**/*.{js,jsx}"
  ]
}
