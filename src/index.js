import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
// redux 日志
import logger from 'redux-logger';
import { AppContainer } from 'react-hot-loader';
import registerServiceWorker from './registerServiceWorker';
import reducer from './redux/reducer';
import CRouter from './routes';
import './index.css';
import './style/lib/animate.css';
//axios配置引入
import { axioscofig } from './ajax/tools'
if (process.env.NODE_ENV !== 'production') {
    var mock = require ('./ajax/mock')
  }


const middleware = [thunk];
// redux日志
if (process.env.NODE_ENV !== 'production') {
    // middleware.push(logger)
  }
//Chrome redux 插件
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(
    applyMiddleware(...middleware))
);
// console.log(store)

// ReactDOM.render(
//     <Provider store={store}>
//         <CRouter store={store} />
//     </Provider>,
//   document.getElementById('root')
// );

const render = Component => {   // 增加react-hot-loader保持状态刷新操作，如果不需要可去掉并把下面注释的打开
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Component store={store} />
            </Provider>
        </AppContainer>
        ,
        document.getElementById('root')
    );
};

render(CRouter);

// Webpack Hot Module Replacement API
if (module.hot) {
    // 隐藏You cannot change <Router routes>; it will be ignored 错误提示
    // react-hot-loader 使用在react-router 3.x上引起的提示，react-router 4.x不存在
    // 详情可参照https://github.com/gaearon/react-hot-loader/issues/298
    const orgError = console.error; // eslint-disable-line no-console
    console.error = (...args) => { // eslint-disable-line no-console
        if (args && args.length === 1 && typeof args[0] === 'string' && args[0].indexOf('You cannot change <Router routes>;') > -1) {
            // React route changed
        } else {
            // Log the error as normally
            orgError.apply(console, args);
        }
    };
    module.hot.accept('./routes', () => {
        render(CRouter);
    })
}
registerServiceWorker();