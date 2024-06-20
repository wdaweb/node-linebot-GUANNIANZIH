import axios from 'axios'
import { distance } from '../utils/distance.js'
import template from '../template/coffeeShop.js'
import fs from 'node:fs'

export default async event => {
  try {
    const { data } = await axios.get('https://cafenomad.tw/api/v1.2/cafes')
    // console.log(data)
    // d 代表陣列裡面的每個東西，讓陣列裡面的物件每個多了 distance 的欄位
    // 計算數值是 import 進來的 distance 的 function，傳入景點的緯度、經度
    const replies = data
      .map(d => {
      // event.message.latitude/longitude => 紀錄使用者自己的 latitude, longitude
      //  設定回傳單位 K 公里
      // 回傳陣列得到 "使用者離景點多遠"
        d.distance = distance(d.latitude, d.longitude, event.message.latitude, event.message.longitude, 'K')
        //   組合完的結果 return
        return d
      })
    // 正序排 => 回傳近到遠的距離排序
      .sort((a, b) => {
        return a.distance - b.distance
      })
    //   取前五筆資料出來，slice 不包含結尾位置
      .slice(0, 5)
    //   .map 組成我們需要的寻格式: flex 型態
      .map(d => {
        // t 是訊息模板
        const t = template()
        t.body.contents[0].text = d.name || '未知店名'
        t.body.contents[1].contents[0].contents[1].text = d.address || '地址不詳'
        t.body.contents[1].contents[1].contents[1].text = d.open_time || '無提供營業時間'
        t.body.contents[1].contents[2].contents[1].text = d.socket || '不確定有無插座'
        t.footer.contents[0].action.uri = d.url || 'https://www.google.com.tw/maps'
        t.footer.contents[1].action.uri = `https://www.google.com/maps/search/?api=1&query=${d.latitude},${d.longitude}`
        return t
      })
    //   組合 flex message 完成後送出去
    const result = await event.reply({
      // 第一層設定 type
      type: 'flex',
      // 替代文字
      altText: 'Coffee',
      // 寫 flex 訊息，單張寫 type: bubble
      contents: {
        type: 'carousel',
        // 最後跑完的 array
        contents: replies
      }
    })
    if (process.env.DEBUG === 'true') {
      console.log(result)
      if (result.message) {
        // 把訊息寫在指定的檔案裡面 dump
        fs.writeFileSync('./dump/coffeeShop.json', JSON.stringify(replies, null, 2))
      }
    }
  } catch (error) {
    console.log(error)
    event.reply('發生錯誤，請稍後再試')
  }
}
