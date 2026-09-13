import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { PrefectureSelect } from './PrefectureSelect'

type WeatherTemperature = {
  min: string,
  max: string
}

type WeatherDetail = {
  imageTitle: string,
  image: string,
  dayLabel: string,
  temperature: WeatherTemperature
}

type WeatherInfo = {
  titlePage: string,
  today: WeatherDetail,
  tomorrow: WeatherDetail,
  threeDaysLater: WeatherDetail
}

function App() {
 
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>();

  const changePrefecture = (e:React.ChangeEvent<HTMLSelectElement>): void => {
    console.log(e.target.value);
    getWeatherInfo(e.target.value);
  }

  const getWeatherInfo = (code: string): void => {
    axios.get("https://weather.tsukumijima.net/api/forecast/city/" + code)
      .then(res => {
        console.log(res.data);

        const infos: WeatherInfo = {
          titlePage: res.data.title,
          today: {
            imageTitle: res.data.forecasts[0].image.title,
            image: res.data.forecasts[0].image.url,
            dayLabel: res.data.forecasts[0].dateLabel,
            temperature: {
              max: res.data.forecasts[0].temperature.max.celsius,
              min: res.data.forecasts[0].temperature.min.celsius
            }

          },
          tomorrow: {
            imageTitle: res.data.forecasts[1].image.title,
            image: res.data.forecasts[1].image.url,
            dayLabel: res.data.forecasts[1].dateLabel,
            temperature: {
              max: res.data.forecasts[1].temperature.max.celsius,
              min: res.data.forecasts[1].temperature.min.celsius
            }

          },
          threeDaysLater: {
            imageTitle: res.data.forecasts[2].image.title,
            image: res.data.forecasts[2].image.url,
            dayLabel: res.data.forecasts[2].dateLabel,
            temperature: {
              max: res.data.forecasts[2].temperature.max.celsius,
              min: res.data.forecasts[2].temperature.min.celsius
            }
          }
        };

        setWeatherInfo(infos);
      })

  };

  useEffect(() => {
    getWeatherInfo("260010");
    
  }, []);



  return (
    <>
      <PrefectureSelect onChangeX={changePrefecture} />


      <section id="center">
        <h3>
          {weatherInfo?.titlePage}

        </h3>
        <div className="grid grid-flow-col grid-rows-3 gap-4">
          <div className="row-span-3 ...">
            <h2>{weatherInfo?.today.dayLabel}</h2>
            <img src={weatherInfo?.today.image} width={170} height={179} />
          </div>
          <div className="col-span-2 ...">{weatherInfo?.today.imageTitle}</div>
          <div className="flex gap-4 col-span-2 row-span-2 ...">
            <div className='flex flex-col gap-2'>
              <p style={{ color: 'red' }}>
                最高気温
              </p>
              <h2>{weatherInfo?.today.temperature.max}C°</h2>
            </div>
            <div className='flex flex-col gap-2'>
              <p className="text-blue-600/100 dark:text-sky-400/100">最低気温</p>
              <h2>{weatherInfo?.today.temperature.min}C°</h2>
            </div>
          </div>
        </div>

        <div className="dayWeather gap-x-8">
          {weatherInfo?.tomorrow.image && (
            <div className="card">
              {weatherInfo?.tomorrow.dayLabel}
              <img src={weatherInfo?.tomorrow.image} />
            </div>)}
          {weatherInfo?.threeDaysLater.image && (
            <div className="card">
              {weatherInfo.threeDaysLater.dayLabel}
              <img src={weatherInfo.threeDaysLater.image} />
            </div>)}

        </div>

        


        
      </section>

      
      <section id="spacer"></section>
    </>
  )
}

export default App
