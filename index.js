// 自動讀取.env
// import 'dotenv/config' 等於下面兩段code
// import dotenv from 'dotenv';
// dotenv.config();
import 'dotenv/config'
// 引用機器人
import linebot from 'linebot'
import commandsCF from './commands/coffee.js'
import commandsCFS from './commands/coffeeShop.js'
import { text } from 'cheerio'

// 設定機器人: 用套件去建立機器人 process.env
// 從.evn讀取機器人資訊，可在不同環境使用不同配置。
// linebot({...}): 呼叫 linebot
// process 是 Node.js 中的一個全局對象；有很多屬性，process.evn用來存取環境變量。
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})
// 46:00
// 有環境變數.env，就可以用.evn去區分執行環境現在是'本機開發'or'伺服器'
// dotenv解析後面都是文字 'text'
bot.on('message', async (event) => {
  if (process.env.DEBUG === 'true') {
    // 之後去雲端改false，就不會收到資訊
    console.log(event)
  }
  // 如果收到的訊息型態是文字再進行判斷
  if (event.message.type === 'text') {
    // 收到的文字是''，才會進行；專門處理'地區'的指令。
    if (event.message.text === '有哪些地區') {
      // 這裡放前端請求查詢的語法，並拉出去 commands > coffee.js 另外寫。
      await commandsCF(event)
    } else if (event.message.text === '快速尋找') {
      event.reply({
        type: 'text',
        text: '你好! 歡迎來到 Where Café',
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                // 按鈕動作叫做訊息
                type: 'message',
                // 按下去使用者會傳送出的文字
                text: '有哪些地區',
                // 按鈕文字
                label: 'Where Café'
              }
            },
            {
              type: 'action',
              action: {
                type: 'uri',
                uri: 'https://cafenomad.tw/',
                label: 'Cafe Nomad'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: 'Exit Chat Room',
                data: 'aaa'
              }
            }
          ]
        }
      })
    }
  } else if (event.message.type === 'location') {
    commandsCFS(event)
  }
})

// postback 會將東西送出去但不會留下紀錄，是另外的事件
bot.on('postback', event => {
  console.log(event)
  event.reply('祝你有個美好的一天!')
})

// 啟動使用linebot的line機器人的伺服器。
// btn.listen()啟動一個HTTP伺服器並讓機器人開始監聽來自Line平台的Webhook請求。
// '/'這是伺服器的途徑，來自 Line 的 Webhook 請求都將被發送到這個路徑。
// process.env.PORT || 3000，這是伺服器監聽的端口號。首先，它會檢查環境變量 PORT 是否已設置（通常在部署到雲服務器或平台時由平台提供），如果沒有設置，則默認使用端口 3000。這樣做可以確保在本地開發和部署環境中都能正常運行。雲端伺服器會指定PORT是多少，架設他指定PORT是1234，只寫 ,3000 會打不開。
// 雲端PORT會放到環境變數內。有就用；沒有就3000。
// () => { console.log('機器人啟動'); }，這是一個回調函數，當伺服器成功啟動並開始監聽請求時將被調用。它會打印出 "機器人啟動" 以通知開發者伺服器已經啟動並正在運行。
bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
