function watch(obj) {
    let {data, watch} = obj
    let defineReactive = (data, key, val, func, fa) => {
        Object.defineProperty(data, key, {
            configurable: true, // 控制是否可以删除
            // writable: true,  // 控制是否可以修改(赋值)
            // enumerable: true, // 控制是否可以枚举
            get: () => val,
            set: (newVal) => {
                if (fa) {
                    oldFa = JSON.parse(JSON.stringify(fa))
                    val = newVal
                    newFa = JSON.parse(JSON.stringify(fa))
                    if (func && typeof func === 'function') {
                        func(newFa, oldFa)
                    }
                } else {
                    func(val, newVal)
                    val = newVal
                }
            }
        })
    }

    let observer = (data, watch, fa, func) => {
        Object.keys(data).forEach(key => {
            val = data[key]
            if (fa) {
                defineReactive(data, key, val, func, fa)
                if (val && typeof val === 'object') {
                    observer(val, null, fa, func)
                }
            } else {
                defineReactive(data, key, val, watch[key], null)
                observer(val, null, val, watch[key])
            }
        })
    }
    observer(data, watch)
    return data
}

const obj = {
  data: {
    a: 1,
    b: {
        c: {
            d: 1
        }
    }
  },
  watch: {
    a(newVal, oldVal) {
      console.log('a', newVal, oldVal)
    },
    b(newVal, oldVal) {
      console.log('b', newVal, oldVal)
    }
  },
}

const instance = watch(obj)
instance.a = 2 // log => 2 1
instance.b.c.d = 3 // log => { c: 3 } { c: 1 }
console.log(instance)
