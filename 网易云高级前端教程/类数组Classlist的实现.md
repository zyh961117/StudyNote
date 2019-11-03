- 类数组对象的特性
    - 对象属性（索引）是数字
    - 有 length 属性
    ```JavaScript
    let o = {0: 'a', 1: 'b', 2: 'c'};
    Object.defineProperty(o, "length", {
        value: 3,
        enumerable: false // 不可枚举
    });
    ```

- push 元素: [].push.call(o, 'd');
    _调用数组对象的 push 方法，将其中的 this 替换成类数组对象 o，并将 'd' 插入_

- 类数组的好处：它本质还是一个对象，可在它的原型自定义各种方法。（如果直接在 Array 对象上定义，就会改变 Array 的原型）
    ```JavaScript
    o.__proto__ = {
        each: function() {...},
        ...
    };
    o.each();
    ```

- 实现 ClassList
    ```JavaScript
    NeDomTokenList.prototype = Object.create(Array.prototype, {
        constructor: {
            value: NeDomTokenList
        },
        add: {
            value: function() {...}
        }
    });
    ```
