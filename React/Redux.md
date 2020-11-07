### JS的状态管理框架
#### store
    ```js
    const store = createStore(reducer)
    store.getState()
    store.dispatch(action)
    store.subscribe(listener)
    ```
#### action
    ```js
    // 描述操作的行为
    function addTodo() {
        return {type: ADD_TODO, text: 'Build my app'}
    }
    store.dispatch(addTodo())
    store.subscribe(() => console.log(store.getState()))
    ```
#### reducer
    ```js
    // 更新 store 实际上是返回了一个新的 store
    function todoApp(state, action) {
        switch (action.type) {
            case ADD_TODO:
                return Object.assign({}, state, {
                    todos: state.todos.concat(...)
                })
            default:
                return state
        }
    }
    ```
#### 工具函数
    - combineReducers: 多个 reducer 组合
    - bindActionCreators: 封装 action 函数


### 在 React 中使用 Redux
    ```js
    import { connect } from 'react-redux'

    class TodoList extends Compenent {
        render() {
            const { todos, addTodo } = this.props;
            return {
                ...
            }
        }
    }

    function mapStateToProps(state) {
        // 需要啥绑定啥，不要返回整个 state，会影响性能
        return {
            todos: state.todos
        };
    }

    function mapDispatchToProps(dispatch) {
        return bindActionCreators({addTodo}, dispatch);
    }

    const ConnectedTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);

    export default class App extend React.Compenent {
        render() {
            return {
                <Provider store={store}>
                    <ConnectedTodoList />
                </Provider>
            }
        }
    }
    ```
    - connect 的工作原理：高阶组件


### 异步 action
    - view 事件触发 action，dispatcher 中的 middlewares 截获这个 action，发送异步请求，等待结果后 dispatch
    - 本质上 action 都是同步的，异步 action 不是一种特殊的 action，而是由几个同步 action 和 middleware 组成达到异步的目的
    - middleware   负责截获 action、发出 action
