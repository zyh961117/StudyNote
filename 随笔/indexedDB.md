# IndexedDB & Dexie.js 使用经验

工作中遇到这样的一个场景：在实时编辑时，需要将产生的编辑操作上传到服务端（以 websocket 长连的方式），但当用户处于断线或弱网的情况下，我们需要将用户的所有操作存储在本地，等待网络恢复时再重传。

## 为什么选择 indexedDB 来进行本地存储？
1. indexedDB 提供 key/value 的存储方式，不需要像 localStorage 那样转存为字符串。对于一次用户的编辑操作，往往对应着 文档ID、作者ID、操作内容 等字段，再次上传的时候需要筛选出该文档、该作者对应的操作内容，用这种存储方式显然更方便索引
2. indexedDB 提供的存储空间很大，一篇离线文档所有操作数的大小往往是 MB 级别的。而 indexedDB 可提供超过 250MB 的存储空间，这也是 indexedDB 相较于 localStorage 最大的优势所在。

## 如何使用 indexedDB？
我们选择了 `Dexie.js` 这个第三方库，它将 indexedDB 进行了封装，提供了简单而全面的 API

### 创建数据库
```js
import Dexie from 'dexie'

const db = new Dexie('editor_database')  // 创建名为 editor_database 的数据库
db.version(1).stores({  // 这里可以定义版本号，后续修改表字段时可以增加版本号
  docMessage: `++id,&msgId,docId,userId,msgType,updates,status,createTime,updateTime`  // 创建 docUpdate 表，&表示 primaryKey，++表示自增字段
})

export default db
```

### 增删改查操作
```js
import editorDB from './editorDB'

export default class DocMessage {
  constructor() {
    this.db = editorDB && editorDB.docMessage
  }

  // 添加一条消息记录
  async addMessage(msg) {
    const time = new Date().getTime()
    try {
      await this.db.add({
        ...msg,
        status: 0,
        createTime: time,
        updateTime: time
      })
    } catch (err) {
      console.error(err)
    }
  }

  // 删除单条消息记录
  async deleteMessageByMsgId(msgId) {
    try {
      await this.db.where({ msgId }).delete()
    } catch (err) {
      console.error(err)
    }
  }

  // 删除多条消息记录
  async deleteMessagesByMsgIds(msgIds) {
    try {
      await this.db
        .where('msgId')
        .anyOf(msgIds)
        .delete()
    } catch (err) {
      console.error(err)
    }
  }

  // 更新一条消息的状态
  async updateMessageStatus(msgId, status) {
    const time = new Date().getTime()
    try {
      await this.db
        .where('msgId')
        .equals(msgId)
        .modify({
          status,
          updateTime: time
        })
    } catch (err) {
      console.error(err)
    }
  }

  // 更新多条消息的状态
  async updateMessagesStatus(msgIds, status) {
    const time = new Date().getTime()
    try {
      await this.db
        .where('msgId')
        .anyOf(msgIds)
        .modify({
          status,
          updateTime: time
        })
    } catch (err) {
      console.error(err)
    }
  }

  // 查询某时间段内某文档的所有消息
  async filterMessagesByDocId(docId, startTime, endTime) {
    let messages = []
    try {
      messages = await this.db
        .where({ docId })
        .and((item) => item.createTime < endTime && item.createTime > startTime) // 也可以使用 above 和 below
        .toArray()
    } catch (err) {
      console.error(err)
    }
    return messages
  }

  // 查询某文档的所有消息
  async getAllMessagesByDocId(docId) {
    let messages = []
    try {
      messages = this.db.where({ docId }).sortBy('createTime')
    } catch (err) {
      console.error(err)
    }
    return messages
  }
}
```
