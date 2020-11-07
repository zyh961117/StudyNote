### 定义
    ```js
    <Router>
        <Link to="/home"></Link>
        <Route path="/home" component={Home} />
    </Router>
    ```

### 特性
    - 声明式定义（tag）
    - 动态路由：render 的时候才会被解析

### 实现方式
    - URL 路径
    - hash 路由（#）
    - 内存路由

### API
    - <Link>: 普通链接，不会触发浏览器刷新，跟 <a> 的效果一样
    - <NavLink>: 类型 Link，但是会添加当前选中状态
    - <Prompt>: 满足条件时提示用户是否离开当前页面
    - <Redirect>: 重定向当前页面
    - <Route>: 路径匹配时显示对应组件，默认情况下多个 Route 都匹配时每个组件都会显示
    - <Switch>: 只显示第一个匹配的路由

### 传参
    - 通过 URL 传递参数：<Route path="/topic/:id" />
    - 获取参数：this.props.match.params

### 嵌套路由
    ```js
    // App
    <Router>
        <Route path="/:id" component={SubRoute} />
    </Router>
    // SubRoute
    <div>
        <Route path="/:id/:subId" component={..} />
    </div>
    ```
