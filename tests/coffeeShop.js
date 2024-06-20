import axios from 'axios'

const main = async () => {
  try {
    const { data } = await axios.get('https://cafenomad.tw/api/v1.2/cafes')
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

main()
