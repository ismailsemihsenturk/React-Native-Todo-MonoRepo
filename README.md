# React-Native-Todo-MonoRepo

## Template for (me) the React Native for Web with SQLite DB
# [Tutorial for SQLite](https://github.com/expo/examples/blob/master/with-sqlite/App.js)
[Change the render method to the Root](https://github.com/necolas/react-native-web/blob/3fc40bdf810901146b8a240a2d0399dee708cfff/packages/react-native-web/src/exports/render/index.js#L10) to the:<br>
`
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
