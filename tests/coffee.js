import axios from 'axios'
// import語法更動。
// 下載到的版本 dependencies: "cheerio":"^1.0.0-rc.12"。
import * as cheerio from 'cheerio'

const main = async () => {
  try {
    // 抓到html
    const { data } = await axios.get('https://cafenomad.tw/')
    // 可以載node.js環境下，用 jQuery語法去解析html的文字。
    // 引用 cheerio套件後，執行套件裡面的 load 去讀取抓到的html，可以用jQ語法去解析。
    // 思考如何用"選擇器"去選擇物件?
    const $ = cheerio.load(data)
    const shops = []
    $('.city-box .name').each(function () {
      // .push到[]裡面，.trim()把空白拿掉
      shops.push($(this).text().trim())
    })
    console.log(shops)
  } catch (error) {
    // 解析html可能會出錯
    console.log(error)
  }
}
// 載入網頁中的html全部載下來，代表axios成功執行。
main()
