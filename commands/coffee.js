// 使用 axios、cheerio庫的 Node.js程式，從網頁抓取資料並使用LINE機器人回覆用戶。
// axios 發送HTTP請求。
import axios from 'axios'
// 伺服器jQuery實現，解析HTML操作文件。
import * as cheerio from 'cheerio'

// 導出一個異部函數，做請求匯出 async 的 function。
export default async (event) => {
  try {
    console.log('Fetching data...')
    // 抓到html
    const { data } = await axios.get('https://cafenomad.tw/')
    console.log('Data fetched')
    // 可以載node.js環境下，用 jQuery語法去解析html的文字。
    // 引用 cheerio套件後，執行套件裡面的 load 去讀取抓到的html，可以用jQ語法去解析。
    // 思考如何用"選擇器"去選擇物件?
    const $ = cheerio.load(data)
    const shops = []
    $('.city-box .name').each(function () {
      // .push到[]裡面，.trim()把空白拿掉
      shops.push($(this).text().trim())
    })
    console.log('Shops:', shops)
    // 回復提取到的訊息，event 的 reply 是 promise，可以加 await，可以得到回覆結果。
    // event.reply只能用一次。 line 的回覆都會是正常的。 line 不會拋出錯誤。
    const result = await event.reply(shops.join('\n'))
    console.log('Reply sent:', result)
    // 如果有誤 linebot會把錯誤訊息回傳。
    if (process.env.DEBUG === 'true') {
      console.log(result)
    }
  } catch (error) {
    // 錯誤處理
    console.error('Error fetching or processing data:', error)
    try {
      await event.reply('發生錯誤，請稍後再試')
    } catch (replyError) {
      console.error('Error sending reply:', replyError)
    }
  }
}
