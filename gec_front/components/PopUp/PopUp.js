import React, { useCallback, useEffect, useRef, useState } from "react";
import ValidDiv from "./ValidDiv";
import ValidLabel from "./ValidLabel";
import ValidInput from "./ValidInput";
import CloseIcon from "../Icons/CloseIcon";
import FileIcon from "../Icons/FileIcon";
import CloseIconTwo from "../Icons/CloseIconTwo";
import ValButton from "./ValButton";
import { Submission } from "@/core/submission/request";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { BeatLoader } from "react-spinners"; 
import { useTranslations } from "@/core/Translations/context";
import { useSettings } from "@/core/settings/context";
import { settings } from "@/core/settings/request";



const PopUp = (props) => {
  const translations = useTranslations();
  const [name, setName] = useState("");
  const [lName, setLName] = useState(""); 
  const [email, setEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [message, setMessage] = useState("");
  const uploadRef = useRef(null);
  const [fileValue, setFileValue] = useState("");
  const [file, setFile] = useState(null);
  const [token, setToken] = useState();
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loader, setLoader] = useState(false); 
  
  const setting = useSettings();

  const handleClose = () => {
    props.click(false);
  }; 

  const handleRemoveFileValue = () => {
    setFileValue("");
    setFile(null);
    uploadRef.current.value = null;
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

  const fileExtensionsString = setting[settings?.fileValidation]?.value;
  const allowedFileTypes = fileExtensionsString?.split(',')?.map((ext) => '.' + ext?.trim());

 

  const isAllowedFileType = (fileType) => {
    return allowedFileTypes?.includes(fileType);
  };

  const handleChange = (e) => { 
    const selectedFile = e.target.files[0];    
    if (selectedFile) { 
      const fileType = '.' + selectedFile.name.split('.').pop().toLowerCase(); 
      console.log(selectedFile)
      if (isAllowedFileType(fileType)) { 
        setFileValue(selectedFile.name);
        setFile(selectedFile);
      } else {
        // Display an error message or take appropriate action for unsupported file types.
        console.log("Unsupported file type. Only PDF, Word, Excel files are allowed.");
      }
    }
  };


  const activeButton =
    name.length > 1 &&
    lName.length > 1 &&
    email.length > 1 &&
    message.length > 1 &&
    contactPhone.length > 1;

  const sentSubmission = async (e) => {
    e.preventDefault();

    if (!captchaVerified) {
      console.log("Please complete the reCAPTCHA verification.");
      return;
    }

    try { 
      setLoader(true);
      const data = {
        post_id: props.post_id,
        email: email,
        file: file,
        data: {
          name: name,
          lastname: lName,
          message: message,
          phone: contactPhone,
        },
        "g-recaptcha-response": token,
      };
      const res = await Submission(data); 
      setRefreshReCaptcha((r) => !r);
      props.alertInfo(true, res.message, true);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data ?? error.response.data?.error, "error");
        handleClose();
        props.alertInfo(
          false,
          error.response.data.message ?? error.response.data?.error.message,
          true
        );
      }
      return "An error occurred while submitting the data.";
    }
    setLoader(false);
    handleClose();
  };
  
  return (
    <>
      <form action="" className={props.class} onSubmit={sentSubmission}>
        <div className="form-title-box">
          <h1>{translations?.registration_form}</h1> 
          <div className="close-icon-form" onClick={handleClose}>
            <CloseIcon />
          </div>
        </div>
        <div className="valid-context">
          <ValidDiv class="valid-name">
            {!name && name.length <= 1 && (
              <ValidLabel title={translations?.full_name} /> 

            )}
            <input
              id="inp"
              type="text"
              className="val-input"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </ValidDiv> 
          <ValidDiv class="valid-email">
            {!lName && lName.length <= 1 && (
              <ValidLabel title={translations?.last_name} /> 
            )}
            <input
              id="inp2"
              type="text"
              className="val-input"
              onChange={(e) => {
                setLName(e.target.value);
              }}
            />
            </ValidDiv>
          <ValidDiv class="valid-email">
            {!email && email.length <= 1 && (
              <ValidLabel title={translations?.email} /> 

            )}
            <input
              id="inp"
              type="email"
              className="val-input"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </ValidDiv>
          <ValidDiv class="valid-email">
            {!contactPhone && contactPhone.length <= 1 && (
              <ValidLabel title={translations?.phone} /> 
            )}
            <input
              id="inp"
              type="number"
              className="val-input"
              onChange={(e) => {
                setContactPhone(e.target.value);
              }}
            />
          </ValidDiv>
          <ValidDiv class="valid-textarea">
            {!message && message.length <= 1 && (
              <ValidLabel title={translations?.message} /> 

            )}
            <input
              id="inp"
              type="text"
              className="val-input"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </ValidDiv>
          <ValidDiv class="valid-file">
            <div className="file-name">
              <FileIcon />
              {fileValue.length > 0 ? (
                <div className="p">
                  {" "}
                  {fileValue.split("C:\\")}{" "}
                  <div className="remove-value" onClick={handleRemoveFileValue}>
                    <CloseIconTwo />
                  </div>
                </div>
              ) : (
                <p className="p">{translations?.attach_file} {fileExtensionsString}</p> 
              )}
            </div>
            {/* <input id='inp' type="file" ref={uploadRef} className="val-input" onChange={(e) => { setFileValue(e.target.files[0]?.name); setFile(e.target.files[0]) }} /> */}
            <input
              id="inp"
              type="file"
              ref={uploadRef}
              className="val-input"
              accept={allowedFileTypes?.map((type) => type.toLowerCase()).join(", ")}
              onChange={handleChange}
            />
          </ValidDiv>
        </div>
        <div className="pop-btn">
          <div className="pop-btn-line"></div>
          {loader ? (
            <button type="button" style={{ pointerEvents: "none" }}>
              <BeatLoader size={10} color="#fFF" />
            </button>
          ) : (
            <button
              type="button"
              onClick={sentSubmission}
              style={{
                pointerEvents: activeButton ? "initial" : "none",
                opacity: activeButton ? "1" : "0.4",
              }}
            >
              {translations?.submit} 
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default PopUp;
