import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { PrefectureSelect } from './PrefectureSelect'
import { Temporal } from '@js-temporal/polyfill'

type WeatherTemperature = {
  min: string,
  max: string
}

type WeatherDetail = {
  imageTitle: string,
  image: string,
  dateLabel: string,
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
  const [isChecked, setIsChecked] = useState(true);

  const changePrefecture = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    console.log(e.target.value);
    getWeatherInfo(e.target.value);
  }
  //天気の表示日数
  const changeCheckboxTomorrow = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIsChecked(e.target.checked);
    console.log(e.target.checked);

    document.cookie = "TomorrowButton=" + e.target.checked;
  }

  const parseCookie = (cookieValue: string): Record<string, string> => {
    const cookie = cookieValue.split(";");
    const obj: Record<string, string> = {};

    cookie.map((item) => {
      const elem = item.split("=");
      const key = elem[0].trim();
      const val = decodeURIComponent(elem[1]);
      obj[key] = val;
    });

    return obj;
  }

  const getWeatherInfo = (code: string): void => {
    axios.get("https://weather.tsukumijima.net/api/forecast/city/" + code)
      .then(res => {
        let pageTitle = res.data.title;
        console.log(pageTitle);
        pageTitle = pageTitle.split(" ")[0];
        pageTitle = pageTitle + " の天気";
        document.title = pageTitle;

        //What's the date today?
        const dateArray = res.data.forecasts.map((item: { date: string }) =>
          Temporal.PlainMonthDay.from(item.date).toString()
        );

        const jpDataArray = dateArray.map((date: string) => {
          const [month, day] = date.split("-");
          return `${month}月${day}日`;
        });

        console.log(res.data);

        const infos: WeatherInfo = {
          titlePage: pageTitle,
          today: {
            imageTitle: res.data.forecasts[0].image.title,
            image: res.data.forecasts[0].image.url,
            dateLabel: jpDataArray[0],
            dayLabel: res.data.forecasts[0].dateLabel,
            temperature: {
              max: res.data.forecasts[0].temperature.max.celsius,
              min: res.data.forecasts[0].temperature.min.celsius
            }

          },
          tomorrow: {
            imageTitle: res.data.forecasts[1].image.title,
            image: res.data.forecasts[1].image.url,
            dateLabel: jpDataArray[1],
            dayLabel: res.data.forecasts[1].dateLabel,
            temperature: {
              max: res.data.forecasts[1].temperature.max.celsius,
              min: res.data.forecasts[1].temperature.min.celsius
            }

          },
          threeDaysLater: {
            imageTitle: res.data.forecasts[2].image.title,
            image: res.data.forecasts[2].image.url,
            dateLabel: jpDataArray[2],
            dayLabel: res.data.forecasts[2].dateLabel,
            temperature: {
              max: res.data.forecasts[2].temperature.max.celsius,
              min: res.data.forecasts[2].temperature.min.celsius
            }
          }
        };

        const cookieValue = document.cookie;
        const cookieObj = parseCookie(cookieValue);
        console.log(cookieObj);

        if (cookieObj.TomorrowButton === "false") {
          setIsChecked(false);
        } else {
          setIsChecked(true);
        }


        setWeatherInfo(infos);
      })


  };

  useEffect(() => {
    const inputPrefectures = document.getElementById("pref-select");
    if (inputPrefectures instanceof HTMLSelectElement) {
      const selectedPrefecture = inputPrefectures.value;
      console.log(selectedPrefecture);
      getWeatherInfo(selectedPrefecture);
    }


  }, []);



  return (
    <>
      <PrefectureSelect onChangeX={changePrefecture} />


      <section id="center">
        <div className="flex flex-row gap-2">
          <label><input type="checkbox" onChange={changeCheckboxTomorrow} checked={isChecked} />明日の天気</label>
        </div>

        <h3>
          {weatherInfo?.titlePage}
        </h3>
        <div className="grid grid-flow-col grid-rows-3 gap-6">
          <div className="row-span-3 ...">

            <h2>{weatherInfo?.today.dayLabel} {weatherInfo?.today.dateLabel}</h2>
            <img src={weatherInfo?.today.image} width={200} height={209} />
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
          {isChecked && (
            <>
              {weatherInfo?.tomorrow.image && (
                <div className="card">
                  {weatherInfo?.tomorrow.dayLabel}
                  {weatherInfo?.tomorrow.dateLabel}
                  <img src={weatherInfo?.tomorrow.image} width={130} height={139} />
                  <div className='flex flex-row gap-4'>
                    <div className='flex flex-col gap-2'>
                      <p style={{ color: 'red' }}>
                        最高気温
                      </p>
                      <h2>{weatherInfo?.tomorrow.temperature.max}C°</h2>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <p className="text-blue-600/100 dark:text-sky-400/100">最低気温</p>
                      <h2>{weatherInfo?.tomorrow.temperature.min}C°</h2>
                    </div>
                  </div>

                </div>)}
            </>
          )}
          {weatherInfo?.threeDaysLater.image && (
            <div className="card">
              {weatherInfo.threeDaysLater.dayLabel}
              {weatherInfo?.threeDaysLater.dateLabel}
              <img src={weatherInfo.threeDaysLater.image} width={130} height={139} />
              <div className='flex flex-row gap-4'>
                <div className='flex flex-col gap-2'>
                  <p style={{ color: 'red' }}>
                    最高気温
                  </p>
                  <h2>{weatherInfo?.threeDaysLater.temperature.max}C°</h2>
                </div>
                <div className='flex flex-col gap-2'>
                  <p className="text-blue-600/100 dark:text-sky-400/100">最低気温</p>
                  <h2>{weatherInfo?.threeDaysLater.temperature.min}C°</h2>
                </div>
              </div>

            </div>)}

        </div>





      </section>


      <section id="spacer"></section>
    </>
  )
}

export default App
