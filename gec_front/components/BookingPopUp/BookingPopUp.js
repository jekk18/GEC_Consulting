import React, { useCallback, useEffect, useState } from "react";
import SelectVector from "../Icons/SelectVector";
import CloseIcon from "../Icons/CloseIcon";
import { useTranslations } from "@/core/Translations/context";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { useRouter } from "next/router"; 
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import moment from "moment-timezone";
import {booking_service, verifivationCode } from "@/core/submission/request";
import Alert from "../Alert/Alert";
import { BeatLoader } from "react-spinners"; 
import { utcToZonedTime, format } from 'date-fns-tz';

const BookingPopUp = (props) => {
  const translations = useTranslations();
  const [desc, setDesc] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loader, setLoader] = useState(false);
  const [valLoader, setValLoader] = useState(false);
  const [token, setToken] = useState();
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [SubmissionAlet, setSubmissionAllert] = useState(false);
  const [valid, setValid] = useState(true);
  const [targetTime, setTargetTime] =useState()
  

  const router = useRouter();
  const { locale } = router;

  const translationsr = {
    en: {
      weekDays: ["S", "M", "T", "W", "T", "F", "S"],
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    ka: {
      weekDays: ["კ", "ო", "ს", "ო", "ხ", "პ", "შ"],
      months: [
        "იან",
        "თებ",
        "მარ",
        "აპრ",
        "მაი",
        "ივნ",
        "ივლ",
        "აგვ",
        "სექ",
        "ოქტ",
        "ნოე",
        "დეკ",
      ],
    },
    ru: {
      weekDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      months: [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июн",
        "Июл",
        "Авг",
        "Сен",
        "Окт",
        "Ноя",
        "Дек",
      ],
    },
  };
  const { weekDays, months } = translationsr[locale] || translationsr.en;

  const handleClose = () => {
    props.hancleClick(false);
  };
  const [date, setDate] = useState();

  const timeZoneName = moment.tz(moment.tz.guess()).zoneAbbr();

  const convert = (date, format = date.format) => {
    let object = { date, format };

    setDate({
      timeConvert: new DateObject(object).format(),
    });
  };

  const [selectedTime, setSelectedTime] = useState("");
 
 useEffect(()=> {
  if(selectedTime){
     
    const utcTime = selectedTime;  
    const utcTimeDate = new Date(`2023-01-01T${utcTime}:00Z`);
    const targetTimezone = 'Etc/UTC';   
    const targetTimeZone = format(utcTimeDate, 'HH:mm', { timeZone: targetTimezone });  
    setTargetTime(targetTimeZone)
  }
 },[selectedTime])

  const handleTimeChange = (date) => {
    setSelectedTime(date.format("HH:mm"));
  };

  const activeBtn =
    date?.timeConvert.length > 1 &&
    selectedTime.length > 1 &&
    desc.length > 1 &&
    phone.length > 1 &&
    code.length > 1 &&
    email.length > 1;

  const [openAlert, setOpenAlert] = useState(false);
  const [succsess, setSuccess] = useState(false);
  const [responseText, setResponseText] = useState("");

  const handleCloseAlert = (openValue) => {
    setOpenAlert(openValue);
    if (SubmissionAlet) {
      handleClose();
    }
  };
  const setAlertInfo = (succsess, responseText, openValue) => {
    setOpenAlert(openValue);
    setSuccess(succsess);
    setResponseText(responseText);
  };

  const sentCodeVerification = async (e) => {
    e.preventDefault();
    try {
      setValLoader(true);
      const res = await verifivationCode(email);
      setAlertInfo(true, res.message || res.status, true);
      setValid(false);
    } catch (error) {
      if (error.response) {
        setValid(true);
        console.log(error.response.data ?? error.response.data?.error, "error");
        setAlertInfo(
          false,
          error.response.data.message ?? error.response.data?.error.message,
          true
        );
      }
      return "An error occurred while submitting the data.";
    }
    setValLoader(false);
  };
  const verify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("yourAction");
    setToken(token);
    setCaptchaVerified(true);
  }, [executeRecaptcha]);

  useEffect(() => {
    verify();
  }, [verify]);

  useEffect(() => {
    if (valid === false) {
      setTimeout(() => {
        setValid(true);
      }, 30000);
    }
  }, [valid]);
 

  const sentSubmission = async (e) => {
    e.preventDefault();

    if (!captchaVerified) {
      console.log("Please complete the reCAPTCHA verification.");
      return;
    }

    try {
      setLoader(true); 
      const data = {
        locale: locale,
        post_id: props?.pageId ?? '',
        email: email,
        code: code,
        data: {
          date: date?.timeConvert,
          time: targetTime ,
          message: desc,
          phone: phone,
        },
        "g-recaptcha-response": token,
      };
      const res = await booking_service(data);
      setOpenAlert(true);
      setRefreshReCaptcha((r) => !r);
      setAlertInfo(true, res.message, true);
      setSubmissionAllert(true);
    } catch (error) {
      if (error.response) {
        setSubmissionAllert(false);
        setOpenAlert(true);
        setLoader(false);
        setAlertInfo(
          false,
          error.response.data.message ?? error.response.data?.error.message,
          true
        );
      }
      return "An error occurred while submitting the data.";
    }
    setLoader(false);
  }; 

  return (
    <div className="fixed-container-popup">
      <div className="booking-form">
        <div className="form-title-close-btn-box">
          <h1>{translations?.book_now}</h1>
          <div className="close-form" onClick={handleClose}>
            <CloseIcon />
          </div>
        </div>
        <form>
          <div className="valid-input-box select-box">
            <label htmlFor="" className={!date ? "" : "active"}>
              {!date && translations?.choose_date}
            </label>
            <DatePicker
              calendarPosition="bottom-left"
              className="dataPPPicker green dt-pck"
              weekDays={weekDays}
              months={months}
              onChange={convert}
            />
            <div className="select-vector">
              <SelectVector />
            </div>
          </div>
          <div className="valid-input-box select-box ss-22">
            {!selectedTime && (
              <label htmlFor="">{translations?.choose_time}</label>
            )}
            <DatePicker
              format="HH:mm"
              plugins={[<TimePicker hideSeconds position="bottom" />]}
   
              onChange={handleTimeChange}
              // defaultValue={targetTime}
            />
            <div className="select-vector">
              <SelectVector />
            </div>
          </div>
          <div className="valid-input-box description-box">
            {!desc && desc.length <= 1 && (
              <label htmlFor="">{translations?.book_now_description}</label>
            )}
            <input
              type="text"
              onChange={(e) => {
                setDesc(e.currentTarget.value);
              }}
            />
          </div>
          <div className="valid-input-box input-box-phone">
            {!phone && phone.length <= 1 && (
              <label htmlFor="">{translations?.phone}</label>
            )}
            <input
              type="text"
              onChange={(e) => {
                setPhone(e.currentTarget.value);
              }}
            />
          </div>
          <div
            className="valid-input-box input-box-email"
            style={{
              pointerEvents: valid ? "initial" : "none",
              opacity: valid ? "1" : "0.4",
            }}
          >
            {!email && email.length <= 1 && (
              <label htmlFor="">{translations?.email}</label>
            )}
            <input
              type="email"
              onChange={(e) => {
                setEmail(e.currentTarget.value);
              }}
            />
            {valLoader ? (
              <button type="button" style={{ pointerEvents: "none" }}>
                <BeatLoader size={10} color="#fFF" />
              </button>
            ) : (
              <button
                onClick={sentCodeVerification}
                type="button"
                style={{
                  opacity: email && email.length > 3 ? "1" : "0.7",
                  pointerEvents: email && email.length > 3 ? "initial" : "none",
                }}
              >
                {translations?.validate}
              </button>
            )}
          </div>
          <div className="valid-input-box input-box-code">
            {!code && code.length <= 1 && (
              <label htmlFor="">{translations?.code}</label>
            )}
            <input
              type="number"
              onChange={(e) => {
                setCode(e.currentTarget.value);
              }}
            />
          </div>
          <div className="submit-button">
            {loader ? (
              <button type="button" style={{ pointerEvents: "none" }}>
                <BeatLoader size={10} color="#fFF" />
              </button>
            ) : (
              <button
                onClick={sentSubmission}
                style={{
                  pointerEvents: activeBtn ? "initial" : "none",
                  opacity: activeBtn ? 1 : 0.4,
                }}
              >
                {translations?.submit}
              </button>
            )}
          </div>
        </form>
      </div>
      {openAlert && (
        <Alert
          click={handleCloseAlert}
          succsess={succsess}
          responseText={responseText}
        />
      )}
    </div>
  );
};

export default BookingPopUp;
