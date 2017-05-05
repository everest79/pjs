var P = (function () {
    //from https://github.com/jneen/pjs
    var c = 0,              //计数器
        g = {},             //全局缓存
        n = 'pjs',          //工具名称
        i = 'init',         //初始化函数名
        m = '_mem_',        //类成员设置方法名
        o = 'object',       //类型字符串
        f = 'function',     //类型字符串
        r = function (Class, Base, Name) {
            //不存时
            !!Base || (Base = Object), c++, !!Name || (Name = n + c)
            var k, t,
                //空的函数
                zero = function () { },
                //工厂构造
                ctor = function () {
                    //任何时间执行构造，都返回对应类的实例
                    var me = this instanceof ctor ? this : new zero
                    //如果基类不等行初始化函数 也不等于Object，则执行基类构造
                    Base !== t && Base !== Object && Base.apply(me, arguments)
                    //执行对应类的初始化函数
                    t.apply(me, arguments)
                    //返回对象
                    return me
                },
                //引用has方法
                isOP = Object.prototype.hasOwnProperty,
                //基类原型 此步以zero桥接基类原型
                _bPT = zero.prototype = Base.prototype,
                //构造原型 通过实例化桥实现继承，同时覆盖zero原型，在非new执行构造时，实例化zero
                _cPT = zero.prototype = ctor.prototype = new zero,
                //用户定义绑定方法执行
                bind = function (def, target) {
                    //def是个方法 则执行并获取返回值
                    //执行时传入四个参数 类[this],target,基类,基类原型
                    if (typeof def === f) def = def.call(ctor, target, Base, _bPT)
                    //def是个对象(传入或函数返回)，遍历此对象，添加到target
                    if (typeof def === o) for (k in def) isOP.call(def, k) && (target[k] = def[k])
                    //如果绑定的是类定义函数
                    if (target === _cPT) {
                        if (m in target) bind(target[m], ctor), delete target[m]   //如果存在静态成员方法或对象，则先执行绑定然后删除
                        i in _cPT || (_cPT[i] = Base),                              //类原型中不包括初始化函数则绑定为基类
                        t = _cPT[i], delete _cPT[i],                                //将初始化函数绑定到类私有对象后从原型删除
                        _cPT.constructor = ctor                                     //将类原型中的构造指向工厂构造
                    }
                    return ctor
                }
            //类型
            ctor.type = function () { return ctor }
            //基类
            ctor.base = function () { return Base }
            //继承当前类，通过cls返回一个新类
            ctor.extend = function (cls) { return cctor(cls, ctor) }
            //覆盖tostring方法
            ctor.toString = _cPT.toString = function () { return e.call(this, Name) }
            //对传入的类进行绑定操作
            return bind(Class, _cPT)
        },
        e = r.toString = function (v) { return '[' + (typeof this) + ' ' + (v ? v : n) + ']' }
    return r
})()
